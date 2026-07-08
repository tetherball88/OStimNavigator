#include "OStimNetMetaData.h"
#include "SceneDescriptionData.h"
#include "JsonUtils.h"
#include "SceneDatabase.h"
#include "StringUtils.h"
#include <fstream>
#include <nlohmann/json.hpp>
#include <thread>
#include <unordered_set>

namespace OStimNavigator {

    // ─── canonical positions list ─────────────────────────────────────────────

    /*static*/ const std::vector<std::string>& OStimNetMetaData::GetPositionSuggestions() {
        return kPositions;
    }

    // ─────────────────────────────────────────────────────────────────────────

    void OStimNetMetaData::LoadDescriptions() {
        if (m_loaded) {
            return;
        }

        m_descriptions.clear();

        std::filesystem::path descriptionsPath = "Data/SKSE/Plugins/OStimNet/animationsDescriptions";

        JsonUtils::LoadJsonFilesFromDirectory(descriptionsPath,
            [this](const std::filesystem::path& path) {
                ParseDescriptionFile(path);
            },
            false);  // non-recursive

        SKSE::log::info("Loaded {} animation descriptions", m_descriptions.size());
        m_loaded = true;
    }

    void OStimNetMetaData::ParseDescriptionFile(const std::filesystem::path& filePath) {
        try {
            std::ifstream file(filePath);
            if (!file.is_open()) {
                SKSE::log::warn("Failed to open animation description file: {}", filePath.string());
                return;
            }

            nlohmann::json j;
            file >> j;

            if (!j.is_object()) {
                SKSE::log::warn("Animation description file is not a JSON object: {}", filePath.string());
                return;
            }

            int loadedFromFile = 0;
            for (auto& [sceneId, descValue] : j.items()) {
                if (!descValue.is_string()) {
                    SKSE::log::warn("Skipping non-string description for scene '{}' in: {}", sceneId, filePath.string());
                    continue;
                }

                std::string id = sceneId;
                StringUtils::ToLower(id);

                if (m_descriptions.contains(id)) {
                    SKSE::log::warn("Duplicate animation description for scene '{}' — overwriting with entry from: {}", id, filePath.string());
                }

                m_descriptions[id] = AnimationDescriptionEntry{
                    descValue.get<std::string>(),
                    filePath,
                    sceneId  // preserve original casing from JSON key
                };
                ++loadedFromFile;
            }

            SKSE::log::info("Loaded {} animation descriptions from: {}", loadedFromFile, filePath.string());

        } catch (const std::exception& e) {
            SKSE::log::error("Error parsing animation description file {}: {}", filePath.string(), e.what());
        }
    }

    const AnimationDescriptionEntry* OStimNetMetaData::GetDescription(const std::string& sceneId) const {
        std::string id = sceneId;
        StringUtils::ToLower(id);

        auto it = m_descriptions.find(id);
        if (it == m_descriptions.end()) {
            return nullptr;
        }
        return &it->second;
    }

    const AnimationDescriptionEntry* OStimNetMetaData::GetInheritedDescription(const std::string& sceneId) const {
        auto* scene = SceneDatabase::GetSingleton().GetSceneByID(sceneId);
        if (!scene) {
            return nullptr;
        }

        std::string idLower = sceneId;
        StringUtils::ToLower(idLower);
        if (m_descriptions.contains(idLower)) {
            return nullptr;
        }

        if (scene->firstSpeedAnimation.empty()) {
            return nullptr;
        }

        std::string ostimSceneId = SceneDatabase::GetSingleton().FindOStimSceneIdByAnimation(scene->firstSpeedAnimation);
        if (ostimSceneId.empty()) {
            return nullptr;
        }

        auto it = m_descriptions.find(ostimSceneId);
        if (it != m_descriptions.end()) {
            SKSE::log::debug("OStimNetMetaData: scene '{}' inherits description from OStim scene '{}' using animation '{}'", 
                sceneId, ostimSceneId, scene->firstSpeedAnimation);
            return &it->second;
        }

        return nullptr;
    }

    const AnimationDescriptionEntry* OStimNetMetaData::GetEffectiveDescription(const std::string& sceneId) const {
        const auto* direct = GetDescription(sceneId);
        if (direct) {
            return direct;
        }
        return GetInheritedDescription(sceneId);
    }

    bool OStimNetMetaData::SaveDescription(const std::string& sceneId, const std::string& description) {
        std::string id = sceneId;
        StringUtils::ToLower(id);

        auto it = m_descriptions.find(id);
        if (it != m_descriptions.end()) {
            // Already loaded from a file — write the updated description back to its source file.
            const std::filesystem::path& filePath = it->second.sourceFilePath;

            nlohmann::json j = nlohmann::json::object();
            if (std::filesystem::exists(filePath)) {
                std::ifstream in(filePath, std::ios::binary);
                if (in.is_open()) {
                    try {
                        in >> j;
                        if (!j.is_object()) j = nlohmann::json::object();
                    } catch (...) {
                        j = nlohmann::json::object();
                    }
                }
            }

            // Use the original key from the file to avoid creating a duplicate with different casing.
            j[it->second.originalKey] = description;

            std::error_code ec;
            std::filesystem::create_directories(filePath.parent_path(), ec);
            if (ec) {
                SKSE::log::error("OStimNetMetaData: failed to create directory {}: {}",
                    filePath.parent_path().string(), ec.message());
                return false;
            }

            std::ofstream out(filePath);
            if (!out.is_open()) {
                SKSE::log::error("OStimNetMetaData: failed to open {} for writing", filePath.string());
                return false;
            }
            out << j.dump(4);
            if (out.fail()) {
                SKSE::log::error("OStimNetMetaData: write failed for '{}'", filePath.string());
                return false;
            }

            it->second.description = description;
            SKSE::log::info("Saved animation description for '{}' to: {}", sceneId, filePath.string());
            return true;
        }

        // New entry: resolve the target file from the scene's modpack name.
        const SceneData* scene = SceneDatabase::GetSingleton().GetSceneByID(id);
        std::string modpack = (scene && !scene->modpack.empty()) ? scene->modpack : "unknown";

        std::filesystem::path filePath =
            std::filesystem::path("Data/SKSE/Plugins/OStimNet/animationsDescriptions") / (modpack + ".json");

        // Load any existing content from that file so we don't overwrite other entries.
        nlohmann::json j = nlohmann::json::object();
        if (std::filesystem::exists(filePath)) {
            std::ifstream in(filePath, std::ios::binary);
            if (in.is_open()) {
                try {
                    in >> j;
                    if (!j.is_object()) {
                        j = nlohmann::json::object();
                    }
                } catch (...) {
                    j = nlohmann::json::object();
                }
            }
        }

        // Add the new entry and write back.
        j[sceneId] = description;

        std::error_code ec;
        std::filesystem::create_directories(filePath.parent_path(), ec);
        if (ec) {
            SKSE::log::error("OStimNetMetaData: failed to create directory {}: {}",
                filePath.parent_path().string(), ec.message());
            return false;
        }

        std::ofstream out(filePath);
        if (!out.is_open()) {
            SKSE::log::error("OStimNetMetaData: failed to open {} for writing", filePath.string());
            return false;
        }
        out << j.dump(4);
        if (out.fail()) {
            SKSE::log::error("OStimNetMetaData: write failed for '{}'", filePath.string());
            return false;
        }

        // Update the in-memory cache.
        m_descriptions[id] = AnimationDescriptionEntry{description, filePath, sceneId};

        SKSE::log::info("Saved animation description for '{}' to: {}", sceneId, filePath.string());
        return true;
     }

    void OStimNetMetaData::UpdateCachedDescription(const std::string& sceneId, const std::string& description, const std::filesystem::path& sourceFilePath) {
        std::string id = sceneId;
        StringUtils::ToLower(id);
        
        auto it = m_descriptions.find(id);
        if (it != m_descriptions.end()) {
            it->second.description = description;
            it->second.sourceFilePath = sourceFilePath;
        } else {
            m_descriptions[id] = AnimationDescriptionEntry{
                description,
                sourceFilePath,
                sceneId
            };
        }
    }

    // ─── scene meta ────────────────────────────────────────────────────────────

    void OStimNetMetaData::LoadSceneMeta() {
        m_sceneMeta.clear();

        std::filesystem::path filePath(k_metaFilePath);
        if (!std::filesystem::exists(filePath)) {
            SKSE::log::info("OStimNetMetaData: no OStimNetMetaData.json found — starting empty");
            return;
        }

        try {
            std::ifstream file(filePath, std::ios::binary);
            if (!file.is_open()) {
                SKSE::log::warn("OStimNetMetaData: failed to open {}", filePath.string());
                return;
            }

            nlohmann::json j;
            file >> j;

            if (!j.is_object()) {
                SKSE::log::warn("OStimNetMetaData: {} is not a JSON object", filePath.string());
                return;
            }

            for (auto& [sceneId, entry] : j.items()) {
                if (!entry.is_object()) continue;

                std::string id = sceneId;
                StringUtils::ToLower(id);

                SceneMeta meta;
                meta.intent   = entry.value("intent",   "");
                if (entry.contains("positions") && entry["positions"].is_array()) {
                    for (const auto& p : entry["positions"]) {
                        if (p.is_string()) meta.positions.push_back(p.get<std::string>());
                    }
                }
                m_sceneMeta[id] = std::move(meta);
            }

            SKSE::log::info("OStimNetMetaData: loaded {} scene meta entries", m_sceneMeta.size());

        } catch (const std::exception& e) {
            SKSE::log::error("OStimNetMetaData: error reading {}: {}", filePath.string(), e.what());
        }
    }

    const SceneMeta* OStimNetMetaData::GetSceneMeta(const std::string& sceneId) const {
        std::string id = sceneId;
        StringUtils::ToLower(id);

        auto it = m_sceneMeta.find(id);
        if (it == m_sceneMeta.end()) return nullptr;
        return &it->second;
    }

    bool OStimNetMetaData::SaveSceneMeta(const std::string& sceneId, const SceneMeta& meta) {
        std::string id = sceneId;
        StringUtils::ToLower(id);

        std::filesystem::path filePath(k_metaFilePath);

        // Load existing file content so we don't overwrite other entries.
        nlohmann::json j = nlohmann::json::object();
        if (std::filesystem::exists(filePath)) {
            std::ifstream in(filePath, std::ios::binary);
            if (in.is_open()) {
                try {
                    in >> j;
                    if (!j.is_object()) j = nlohmann::json::object();
                } catch (...) {
                    j = nlohmann::json::object();
                }
            }
        }

        // Upsert the entry (preserve existing keys inside the object).
        j[id]["intent"]    = meta.intent;
        j[id]["positions"] = meta.positions;

        std::error_code ec;
        std::filesystem::create_directories(filePath.parent_path(), ec);
        if (ec) {
            SKSE::log::error("OStimNetMetaData: failed to create directory {}: {}",
                filePath.parent_path().string(), ec.message());
            return false;
        }

        std::ofstream out(filePath, std::ios::binary);
        if (!out.is_open()) {
            SKSE::log::error("OStimNetMetaData: failed to open {} for writing", filePath.string());
            return false;
        }
        out << j.dump(4);
        if (out.fail()) {
            SKSE::log::error("OStimNetMetaData: write failed for '{}'", sceneId);
            return false;
        }

        // Update in-memory cache.
        m_sceneMeta[id] = meta;

        SKSE::log::info("OStimNetMetaData: saved meta for '{}' to {}", sceneId, filePath.string());
        return true;
    }

    void OStimNetMetaData::AutoPopulatePositions() {
        // Canonical set for direct tag matches.
        const auto& positionsList = GetPositionSuggestions();
        std::unordered_set<std::string> positionsSet(positionsList.begin(), positionsList.end());

        auto resolveTag = [&](const std::string& tagLower) -> std::string {
            // Direct match.
            if (positionsSet.count(tagLower)) return tagLower;
            // Alias match.
            auto it = kPositionAliases.find(tagLower);
            if (it != kPositionAliases.end()) return it->second;
            return {};
        };

        auto& sceneDb = SceneDatabase::GetSingleton();
        int populated = 0;

        for (const auto* scene : sceneDb.GetAllScenes()) {
            if (!scene) continue;

            std::string idLower = scene->id;
            StringUtils::ToLower(idLower);

            // Skip if this scene already has positions set.
            const auto* existing = GetSceneMeta(idLower);
            if (existing && !existing->positions.empty()) continue;

            // Collect matched positions in canonical form, deduped, order preserved.
            std::vector<std::string> matched;
            std::unordered_set<std::string> seen;
            for (const auto& tag : scene->tags) {
                std::string tagLower = tag;
                StringUtils::ToLower(tagLower);
                std::string canonical = resolveTag(tagLower);
                if (!canonical.empty() && seen.insert(canonical).second) {
                    matched.push_back(canonical);
                }
            }

            if (matched.empty()) continue;

            SceneMeta meta;
            if (existing) meta.intent = existing->intent;  // preserve existing intent if any
            meta.positions = std::move(matched);

            if (SaveSceneMeta(scene->id, meta)) {
                ++populated;
            }
        }

        SKSE::log::info("OStimNetMetaData: AutoPopulatePositions — populated {} scenes", populated);
    }

    // ─── async save helpers ───────────────────────────────────────────────────

    // Must be called from the game thread.  Gathers cache info synchronously,
    // then spins up a background thread to perform the file I/O and posts the
    // cache update + callback back to the game thread on completion.
    void OStimNetMetaData::SaveDescriptionAsync(const std::string& sceneId,
                                                const std::string& description,
                                                std::function<void(bool)> onComplete) {
        // ── gather needed info on the game thread (fast in-memory lookups) ──
        std::string id = sceneId;
        StringUtils::ToLower(id);

        std::filesystem::path filePath;
        std::string           originalKey;

        auto it = m_descriptions.find(id);
        if (it != m_descriptions.end()) {
            filePath    = it->second.sourceFilePath;
            originalKey = it->second.originalKey;
        } else {
            const SceneData* scene = SceneDatabase::GetSingleton().GetSceneByID(id);
            std::string modpack = (scene && !scene->modpack.empty()) ? scene->modpack : "unknown";
            filePath    = std::filesystem::path("Data/SKSE/Plugins/OStimNet/animationsDescriptions") /
                          (modpack + ".json");
            originalKey = sceneId;  // preserve original casing supplied by the caller
        }

        // ── background thread: file I/O ──────────────────────────────────────
        std::thread([this, id, sceneId, description, filePath, originalKey, onComplete]() {
            nlohmann::json j = nlohmann::json::object();
            if (std::filesystem::exists(filePath)) {
                std::ifstream in(filePath, std::ios::binary);
                if (in.is_open()) {
                    try { in >> j; if (!j.is_object()) j = nlohmann::json::object(); }
                    catch (...) { j = nlohmann::json::object(); }
                }
            }

            j[originalKey] = description;

            auto fail = [&](const std::string& msg) {
                SKSE::log::error("{}", msg);
                if (onComplete) {
                    SKSE::GetTaskInterface()->AddTask([onComplete]() { onComplete(false); });
                }
            };

            std::error_code ec;
            std::filesystem::create_directories(filePath.parent_path(), ec);
            if (ec) {
                fail("OStimNetMetaData: failed to create directory " +
                     filePath.parent_path().string() + ": " + ec.message());
                return;
            }

            std::ofstream out(filePath);
            if (!out.is_open()) {
                fail("OStimNetMetaData: failed to open " + filePath.string() + " for writing");
                return;
            }
            out << j.dump(4);
            bool ok = !out.fail();
            out.close();

            if (!ok) {
                fail("OStimNetMetaData: write failed for '" + sceneId + "'");
                return;
            }

            SKSE::log::info("Saved animation description for '{}' to: {}", sceneId, filePath.string());

            // ── game thread: update in-memory cache + fire callback ──────────
            SKSE::GetTaskInterface()->AddTask([this, id, description, filePath, originalKey, onComplete]() {
                m_descriptions[id] = AnimationDescriptionEntry{description, filePath, originalKey};
                if (onComplete) onComplete(true);
            });
        }).detach();
    }

    // Must be called from the game thread.  See SaveDescriptionAsync for the
    // threading model.
    void OStimNetMetaData::SaveSceneMetaAsync(const std::string& sceneId,
                                              const SceneMeta& meta,
                                              std::function<void(bool)> onComplete) {
        // ── gather needed info on the game thread ────────────────────────────
        std::string id = sceneId;
        StringUtils::ToLower(id);

        std::filesystem::path filePath(k_metaFilePath);

        // ── background thread: file I/O ──────────────────────────────────────
        std::thread([this, id, sceneId, meta, filePath, onComplete]() {
            nlohmann::json j = nlohmann::json::object();
            if (std::filesystem::exists(filePath)) {
                std::ifstream in(filePath, std::ios::binary);
                if (in.is_open()) {
                    try { in >> j; if (!j.is_object()) j = nlohmann::json::object(); }
                    catch (...) { j = nlohmann::json::object(); }
                }
            }

            j[id]["intent"]    = meta.intent;
            j[id]["positions"] = meta.positions;

            auto fail = [&](const std::string& msg) {
                SKSE::log::error("{}", msg);
                if (onComplete) {
                    SKSE::GetTaskInterface()->AddTask([onComplete]() { onComplete(false); });
                }
            };

            std::error_code ec;
            std::filesystem::create_directories(filePath.parent_path(), ec);
            if (ec) {
                fail("OStimNetMetaData: failed to create directory " +
                     filePath.parent_path().string() + ": " + ec.message());
                return;
            }

            std::ofstream out(filePath, std::ios::binary);
            if (!out.is_open()) {
                fail("OStimNetMetaData: failed to open " + filePath.string() + " for writing");
                return;
            }
            out << j.dump(4);
            bool ok = !out.fail();
            out.close();

            if (!ok) {
                fail("OStimNetMetaData: write failed for '" + sceneId + "'");
                return;
            }

            SKSE::log::info("OStimNetMetaData: saved meta for '{}' to {}", sceneId, filePath.string());

            // ── game thread: update in-memory cache + fire callback ──────────
            SKSE::GetTaskInterface()->AddTask([this, id, meta, onComplete]() {
                m_sceneMeta[id] = meta;
                if (onComplete) onComplete(true);
            });
        }).detach();
    }

}  // namespace OStimNavigator
