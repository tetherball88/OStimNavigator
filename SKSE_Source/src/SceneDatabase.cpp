#include "SceneDatabase.h"
#include "ActionDatabase.h"
#include "FurnitureDatabase.h"
#include "OStimNetMetaData.h"
#include "SceneDescriptionData.h"
#include "StringUtils.h"
#include "JsonUtils.h"
#include <chrono>
#include <fstream>

namespace OStimNavigator {

    void SceneDatabase::LoadScenes() {
        if (m_loaded) {
            return;
        }

        m_scenes.clear();
        m_allTags.clear();
        m_allActions.clear();
        m_allActorTags.clear();
        m_allPositions.clear();
        m_animationToOStimSceneId.clear();

        // Path to OStim scenes directory
        std::filesystem::path scenesPath = "Data/SKSE/Plugins/OStim/scenes";

        auto t0 = std::chrono::steady_clock::now();
        
        JsonUtils::LoadJsonFilesFromDirectory(scenesPath,
            [this](const std::filesystem::path& path) {
                ParseSceneFile(path);
            },
            true);  // recursive

        auto t1 = std::chrono::steady_clock::now();
        auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(t1 - t0).count();
        
        SKSE::log::info("Loaded {} scenes in {} ms", m_scenes.size(), ms);

        // ── Unknown tag audit ────────────────────────────────────────────────
        // Actor tags not in kActorTagSuggestions
        {
            std::unordered_set<std::string> known(kActorTagSuggestions.begin(), kActorTagSuggestions.end());
            std::vector<std::string> unknown;
            for (const auto& tag : m_allActorTags) {
                if (!known.count(tag)) unknown.push_back(tag);
            }
            if (!unknown.empty()) {
                std::sort(unknown.begin(), unknown.end());
                std::string joined;
                for (const auto& tag : unknown) {
                    if (!joined.empty()) joined += ", ";
                    joined += tag;
                }
                SKSE::log::info("[audit] unknown actor tags: {}", joined);
            }
        }
        // Scene tags not in kPositions / kPositionAliases
        {
            std::unordered_set<std::string> known(kPositions.begin(), kPositions.end());
            for (const auto& [alias, _] : kPositionAliases) known.insert(alias);
            std::vector<std::string> unknown;
            for (const auto& tag : m_allTags) {
                if (!known.count(tag)) unknown.push_back(tag);
            }
            if (!unknown.empty()) {
                std::sort(unknown.begin(), unknown.end());
                std::string joined;
                for (const auto& tag : unknown) {
                    if (!joined.empty()) joined += ", ";
                    joined += tag;
                }
                SKSE::log::info("[audit] unknown scene tags: {}", joined);
            }
        }

        SKSE::log::info("SceneDatabase: {} unique positions across all scenes", m_allPositions.size());

        // Log per-furniture-type sexual scene counts
        {
            auto furnitureIDs = FurnitureDatabase::GetSingleton().GetAllFurnitureTypeIDs();
            for (const auto& id : furnitureIDs) {
                const auto* ft = FurnitureDatabase::GetSingleton().GetFurnitureType(id);
                if (ft && ft->sceneCount > 0) {
                    SKSE::log::info("  furniture '{}': {} scene(s) with sexual activity", id, ft->sceneCount);
                }
            }
        }

        m_loaded = true;
    }

    void SceneDatabase::ReloadScene(const std::string& id) {
        std::string lowerID = id;
        std::transform(lowerID.begin(), lowerID.end(), lowerID.begin(), ::tolower);

        auto it = m_scenes.find(lowerID);
        if (it == m_scenes.end()) {
            SKSE::log::warn("SceneDatabase::ReloadScene: scene '{}' not in cache — skipping", id);
            return;
        }

        std::filesystem::path filePath = it->second.filePath;
        SceneData backup = it->second;
        m_scenes.erase(it);
        ParseSceneFile(filePath);
        if (m_scenes.find(lowerID) == m_scenes.end()) {
            // Parse failed — restore previous data so the scene remains accessible.
            SKSE::log::warn("SceneDatabase::ReloadScene: parse failed for '{}', keeping previous data", id);
            m_scenes[lowerID] = std::move(backup);
            return;
        }
        SKSE::log::info("SceneDatabase::ReloadScene: refreshed '{}' from {}", id, filePath.string());
    }

    void SceneDatabase::ParseSceneFile(const std::filesystem::path& filePath) {
        try {
            // Read raw bytes first so we can detect the original line ending style.
            std::ifstream rawFile(filePath, std::ios::binary);
            if (!rawFile.is_open()) {
                SKSE::log::warn("Failed to open scene file: {}", filePath.string());
                return;
            }
            std::string rawContent((std::istreambuf_iterator<char>(rawFile)),
                                    std::istreambuf_iterator<char>());
            rawFile.close();

            // Detect whether the file uses CRLF so we can restore it on write-back.
            const bool hasCRLF = rawContent.find("\r\n") != std::string::npos;

            nlohmann::ordered_json j = nlohmann::ordered_json::parse(rawContent);

            SceneData scene;
            scene.id = filePath.stem().string();
            StringUtils::ToLower(scene.id);
            scene.filePath = filePath;

            // Parse basic fields
            scene.name = j.value("name", scene.id);
            scene.modpack = j.contains("modpack") ? j.value("modpack", "") : j.value("modPack", "");
            scene.length = j.value("length", 0.0f);
            scene.noRandomSelection = j.value("noRandomSelection", false);
            scene.furnitureType = j.value("furniture", "");

            // Check if transition
            if (j.contains("destination")) {
                scene.isTransition = true;
                scene.destination = j["destination"].get<std::string>();
            }

            // Parse speeds[0].animation -> scene.firstSpeedAnimation
            if (j.contains("speeds") && j["speeds"].is_array() && !j["speeds"].empty()) {
                const auto& speedObj = j["speeds"][0];
                if (speedObj.contains("animation") && speedObj["animation"].is_string()) {
                    scene.firstSpeedAnimation = speedObj["animation"].get<std::string>();
                }
            }

            if (scene.id.starts_with("ostim") && !scene.firstSpeedAnimation.empty()) {
                std::string lowerAnim = scene.firstSpeedAnimation;
                StringUtils::ToLower(lowerAnim);
                m_animationToOStimSceneId[lowerAnim] = scene.id;
            }

            // Parse actors, tags, and actions
            ParseActors(j, scene);
            
            if (j.contains("tags") && j["tags"].is_array()) {
                for (const auto& tag : j["tags"]) {
                    std::string tagStr = tag.get<std::string>();
                    StringUtils::ToLower(tagStr);
                    scene.tags.push_back(tagStr);
                    m_allTags.insert(tagStr);
                }
            }

            ParseActions(j, scene);

            // Merge OStimNet metadata (intent + positions) into scene tags and persist to file
            // Skip core OStim scenes
            const SceneMeta* meta = scene.id.starts_with("ostim") ? nullptr : OStimNetMetaData::GetSingleton().GetSceneMeta(scene.id);
            if (meta) {
                SKSE::log::debug("SceneDatabase: merging OStimNet metadata for scene '{}'", scene.id);
                // Collect tags to inject (intent first, then positions)
                std::vector<std::string> toInject;
                if (!meta->intent.empty()) {
                    std::string s = meta->intent;
                    size_t pos = 0;
                    while ((pos = s.find(',')) != std::string::npos) {
                        std::string token = s.substr(0, pos);
                        if (!token.empty()) {
                            toInject.push_back(token);
                        }
                        s.erase(0, pos + 1);
                    }
                    if (!s.empty()) {
                        toInject.push_back(s);
                    }
                }
                for (const auto& pos : meta->positions)
                    if (!pos.empty())
                        toInject.push_back(pos);

                // Build set of existing JSON tags (lowercase) to avoid duplicates
                std::unordered_set<std::string> existingTags;
                if (j.contains("tags") && j["tags"].is_array())
                    for (const auto& t : j["tags"])
                        if (t.is_string()) existingTags.insert(t.get<std::string>());

                bool modified = false;
                for (const auto& tag : toInject) {
                    if (!existingTags.count(tag)) {
                        j["tags"].push_back(tag);
                        existingTags.insert(tag);
                        // Also keep the in-memory scene in sync
                        scene.tags.push_back(tag);
                        m_allTags.insert(tag);
                        modified = true;
                    }
                }

                SKSE::log::debug("SceneDatabase: merged {} tags into scene '{}'", toInject.size(), scene.id);

                if (modified) {
                    try {
                        std::ofstream out(filePath, std::ios::binary);
                        if (out.is_open()) {
                            std::string dumped = j.dump(4);
                            if (hasCRLF) {
                                // Restore original CRLF line endings
                                std::string converted;
                                converted.reserve(dumped.size() + dumped.size() / 20);
                                for (std::size_t i = 0; i < dumped.size(); ++i) {
                                    if (dumped[i] == '\n' && (i == 0 || dumped[i - 1] != '\r'))
                                        converted += '\r';
                                    converted += dumped[i];
                                }
                                out << converted;
                            } else {
                                out << dumped;
                            }
                            SKSE::log::info("SceneDatabase: injected metadata tags into {}", filePath.string());
                        } else {
                            SKSE::log::warn("SceneDatabase: could not open {} for writing", filePath.string());
                        }
                    } catch (const std::exception& e) {
                        SKSE::log::warn("SceneDatabase: failed to save {}: {}", filePath.string(), e.what());
                    }
                }
            }

            // Collect positions from final scene tags (after OStimNet injection)
            {
                static const std::unordered_set<std::string> positionsSet(kPositions.begin(), kPositions.end());
                for (const auto& tag : scene.tags) {
                    if (positionsSet.count(tag)) {
                        m_allPositions.insert(tag);
                    } else {
                        auto it = kPositionAliases.find(tag);
                        if (it != kPositionAliases.end()) m_allPositions.insert(it->second);
                    }
                }
            }

            m_scenes[scene.id] = scene;

            // Increment the scene count on the matched furniture type if this scene has
            // at least one sexual action and is tied to a specific furniture type.
            if (!scene.furnitureType.empty()) {
                bool hasSexualAction = std::any_of(scene.actions.begin(), scene.actions.end(),
                    [](const SceneActionData& a) { return kSexualActionTypes.count(a.type) > 0; });
                if (hasSexualAction) {
                    FurnitureDatabase::GetSingleton().IncrementSceneCount(scene.furnitureType);
                }
            }

        } catch (const std::exception& e) {
            SKSE::log::error("Error parsing scene file {}: {}", filePath.string(), e.what());
        }
    }

    void SceneDatabase::ParseActors(const nlohmann::json& j, SceneData& scene) {
        if (!j.contains("actors") || !j["actors"].is_array()) {
            return;
        }

        const auto& actorsArray = j["actors"];
        scene.actorCount = static_cast<uint32_t>(actorsArray.size());
        
        for (const auto& actorJson : actorsArray) {
            ActorData actor;
            
            if (actorJson.contains("intendedSex") && actorJson["intendedSex"].is_string()) {
                actor.intendedSex = actorJson["intendedSex"].get<std::string>();
                StringUtils::ToLower(actor.intendedSex);
            }
            
            actor.animationIndex = actorJson.value("animationIndex", -1);
            
            if (actorJson.contains("tags") && actorJson["tags"].is_array()) {
                for (const auto& tagJson : actorJson["tags"]) {
                    if (tagJson.is_string()) {
                        std::string tag = tagJson.get<std::string>();
                        StringUtils::ToLower(tag);
                        actor.tags.push_back(tag);
                        m_allActorTags.insert(tag);
                    }
                }
            }
            
            scene.actors.push_back(actor);
        }
    }

    void SceneDatabase::ParseActions(const nlohmann::json& j, SceneData& scene) {
        if (!j.contains("actions") || !j["actions"].is_array()) {
            return;
        }

        for (const auto& actionObj : j["actions"]) {
            if (!actionObj.contains("type")) {
                continue;
            }

            SceneActionData actionData;
            std::string actionType = actionObj["type"].get<std::string>();
            StringUtils::ToLower(actionType);
            actionData.type = ActionDatabase::GetSingleton().ResolveActionType(actionType);
            
            // Parse role indices using value() for cleaner code
            actionData.actor = actionObj.value("actor", -1);
            actionData.target = actionObj.value("target", -1);
            actionData.performer = actionObj.value("performer", -1);
            
            scene.actions.push_back(actionData);
            m_allActions.insert(actionData.type);
            ActionDatabase::GetSingleton().MarkUsedInScene(actionData.type);
        }
    }

    SceneData* SceneDatabase::GetSceneByID(const std::string& id) {
        std::string lowerID = StringUtils::ToLowerCopy(id);
        
        auto it = m_scenes.find(lowerID);
        if (it != m_scenes.end()) {
            return &it->second;
        }
        return nullptr;
    }

    std::vector<SceneData*> SceneDatabase::GetAllScenes() {
        std::vector<SceneData*> result;
        result.reserve(m_scenes.size());
        for (auto& pair : m_scenes) {
            result.push_back(&pair.second);
        }
        return result;
    }

    std::vector<SceneData*> SceneDatabase::GetScenesByActorCount(uint32_t actorCount) {
        return FilterScenes([actorCount](const SceneData& scene) {
            return scene.actorCount == actorCount;
        });
    }

    std::vector<SceneData*> SceneDatabase::GetScenesByTag(const std::string& tag) {
        std::string lowerTag = StringUtils::ToLowerCopy(tag);
        return FilterScenes([&lowerTag](const SceneData& scene) {
            return std::find(scene.tags.begin(), scene.tags.end(), lowerTag) != scene.tags.end();
        });
    }

    std::vector<SceneData*> SceneDatabase::SearchScenesByName(const std::string& searchTerm) {
        std::string lowerSearch = StringUtils::ToLowerCopy(searchTerm);
        return FilterScenes([&lowerSearch](const SceneData& scene) {
            return StringUtils::ToLowerCopy(scene.name).find(lowerSearch) != std::string::npos;
        });
    }

    std::vector<std::string> SceneDatabase::GetAllTags() const {
        return StringUtils::SetToSortedVector(m_allTags);
    }

    std::vector<std::string> SceneDatabase::GetAllActions() const {
        return StringUtils::SetToSortedVector(m_allActions);
    }

    std::vector<std::string> SceneDatabase::GetAllActorTags() const {
        return StringUtils::SetToSortedVector(m_allActorTags);
    }

    std::vector<std::string> SceneDatabase::GetAllPositions() const {
        return StringUtils::SetToSortedVector(m_allPositions);
    }

    void SceneDatabase::ReloadSceneFromContent(const std::string& id, const std::string& content,
                                               const std::filesystem::path& filePath) {
        std::string lowerID = id;
        std::transform(lowerID.begin(), lowerID.end(), lowerID.begin(), ::tolower);

        try {
            nlohmann::ordered_json j = nlohmann::ordered_json::parse(content);

            SceneData scene;
            scene.id       = lowerID;
            scene.filePath = filePath;

            scene.name              = j.value("name", scene.id);
            scene.modpack           = j.contains("modpack") ? j.value("modpack", "") : j.value("modPack", "");
            scene.length            = j.value("length", 0.0f);
            scene.noRandomSelection = j.value("noRandomSelection", false);
            scene.furnitureType     = j.value("furniture", "");

            if (j.contains("destination")) {
                scene.isTransition = true;
                scene.destination  = j["destination"].get<std::string>();
            }

            // Parse speeds[0].animation -> scene.firstSpeedAnimation
            if (j.contains("speeds") && j["speeds"].is_array() && !j["speeds"].empty()) {
                const auto& speedObj = j["speeds"][0];
                if (speedObj.contains("animation") && speedObj["animation"].is_string()) {
                    scene.firstSpeedAnimation = speedObj["animation"].get<std::string>();
                }
            }

            ParseActors(j, scene);

            if (j.contains("tags") && j["tags"].is_array()) {
                for (const auto& tag : j["tags"]) {
                    std::string tagStr = tag.get<std::string>();
                    StringUtils::ToLower(tagStr);
                    scene.tags.push_back(tagStr);
                    m_allTags.insert(tagStr);
                }
            }

            ParseActions(j, scene);

            // OStimNet metadata re-injection is intentionally skipped here — it was
            // already applied during the initial LoadScenes() pass and must not run
            // again during a hot-reload triggered by a user edit.

            m_scenes[lowerID] = std::move(scene);
            SKSE::log::info("SceneDatabase::ReloadSceneFromContent: refreshed '{}'", id);
        } catch (const std::exception& e) {
            SKSE::log::error("SceneDatabase::ReloadSceneFromContent: parse failed for '{}': {}", id, e.what());
        }
    }

    std::filesystem::path SceneDatabase::FindSceneFilePath(const std::string& id) const {
        std::string lowerID = id;
        std::transform(lowerID.begin(), lowerID.end(), lowerID.begin(), ::tolower);
        auto it = m_scenes.find(lowerID);
        if (it != m_scenes.end()) {
            return it->second.filePath;
        }
        return {};
    }

    std::string SceneDatabase::FindOStimSceneIdByAnimation(const std::string& animationName) const {
        std::string lowerAnim = animationName;
        StringUtils::ToLower(lowerAnim);
        auto it = m_animationToOStimSceneId.find(lowerAnim);
        if (it != m_animationToOStimSceneId.end()) {
            return it->second;
        }
        return "";
    }
}
