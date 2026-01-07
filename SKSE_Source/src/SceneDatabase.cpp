#include "SceneDatabase.h"
#include "ActionDatabase.h"
#include "StringUtils.h"
#include "JsonUtils.h"
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

        // Path to OStim scenes directory
        std::filesystem::path scenesPath = "Data/SKSE/Plugins/OStim/scenes";
        
        JsonUtils::LoadJsonFilesFromDirectory(scenesPath,
            [this](const std::filesystem::path& path) {
                ParseSceneFile(path);
            },
            true);  // recursive
        
        SKSE::log::info("Loaded {} scenes", m_scenes.size());
        m_loaded = true;
    }

    void SceneDatabase::ParseSceneFile(const std::filesystem::path& filePath) {
        try {
            std::ifstream file(filePath);
            if (!file.is_open()) {
                SKSE::log::warn("Failed to open scene file: {}", filePath.string());
                return;
            }

            nlohmann::json j;
            file >> j;

            SceneData scene;
            scene.id = filePath.stem().string();
            StringUtils::ToLower(scene.id);

            // Parse basic fields
            scene.name = j.value("name", scene.id);
            scene.modpack = j.value("modpack", "");
            scene.length = j.value("length", 0.0f);
            scene.noRandomSelection = j.value("noRandomSelection", false);
            scene.furnitureType = j.value("furniture", "");

            // Check if transition
            if (j.contains("destination")) {
                scene.isTransition = true;
                scene.destination = j["destination"].get<std::string>();
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
            m_scenes[scene.id] = scene;

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
}
