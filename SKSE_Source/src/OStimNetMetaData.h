#pragma once

#include "PCH.h"
#include <filesystem>
#include <functional>
#include <string>
#include <unordered_map>
#include <vector>

namespace OStimNavigator {

    struct AnimationDescriptionEntry {
        std::string description;
        std::filesystem::path sourceFilePath;  // Absolute path to the file this was loaded from
        std::string originalKey;              // Key as it appears in the JSON file (preserves original casing)
    };

    struct SceneMeta {
        std::string intent;                // "platonic"|"romantic"|"lustful"|"transactional"|"dom"|"aggressive"
        std::vector<std::string> positions; // list of position strings
    };

    class OStimNetMetaData {
    public:
        static OStimNetMetaData& GetSingleton() {
            static OStimNetMetaData instance;
            return instance;
        }

        // Load all animation description files from Data/SKSE/Plugins/OStimNet/animationsDescriptions/
        void LoadDescriptions();

        // Returns null if the scene ID has no description
        const AnimationDescriptionEntry* GetDescription(const std::string& sceneId) const;

        // Returns the inherited description for the given scene ID by tracing its speed animation to an OStim scene description
        const AnimationDescriptionEntry* GetInheritedDescription(const std::string& sceneId) const;

        // Returns the direct description if available, otherwise falls back to the inherited description
        const AnimationDescriptionEntry* GetEffectiveDescription(const std::string& sceneId) const;

        // Save a description for a scene.
        // If the scene has no existing description (was not read from a file),
        // the entry is persisted to Data/SKSE/Plugins/OStimNet/animationsDescriptions/<modpack>.json
        // and the in-memory cache is updated.
        // If a description for the scene is already cached, only the cache is updated.
        // Returns true on success, false if the file could not be written.
        bool SaveDescription(const std::string& sceneId, const std::string& description);

        // Update the cached description entry in memory (without writing to disk)
        void UpdateCachedDescription(const std::string& sceneId, const std::string& description, const std::filesystem::path& sourceFilePath);

        // Load scene meta entries from Data/SKSE/Plugins/OStimNet/OStimNetMetaData.json
        void LoadSceneMeta();

        // Returns null if the scene ID has no meta entry
        const SceneMeta* GetSceneMeta(const std::string& sceneId) const;

        // Persist a SceneMeta entry for the given scene to OStimNetMetaData.json
        // and update the in-memory cache.
        // Returns true on success.
        bool SaveSceneMeta(const std::string& sceneId, const SceneMeta& meta);

        // Async variants — must be called from the game thread (e.g. inside an
        // SKSE AddTask lambda).  File I/O runs on a detached background thread;
        // the in-memory cache update and onComplete callback are posted back to
        // the game thread via SKSE::GetTaskInterface()->AddTask.
        void SaveDescriptionAsync(const std::string& sceneId, const std::string& description,
                                  std::function<void(bool)> onComplete = nullptr);
        void SaveSceneMetaAsync(const std::string& sceneId, const SceneMeta& meta,
                                std::function<void(bool)> onComplete = nullptr);

        // For each scene in SceneDatabase that has no positions in meta:
        // intersect its tags with GetPositionSuggestions() and save the result.
        void AutoPopulatePositions();

        // The canonical list of position strings used for suggestions and auto-population.
        static const std::vector<std::string>& GetPositionSuggestions();

        // Stats
        size_t GetDescriptionCount() const { return m_descriptions.size(); }
        size_t GetSceneMetaCount()    const { return m_sceneMeta.size(); }
        bool IsLoaded() const { return m_loaded; }

    private:
        OStimNetMetaData() = default;
        ~OStimNetMetaData() = default;
        OStimNetMetaData(const OStimNetMetaData&) = delete;
        OStimNetMetaData& operator=(const OStimNetMetaData&) = delete;

        void ParseDescriptionFile(const std::filesystem::path& filePath);

        static constexpr const char* k_metaFilePath =
            "Data/SKSE/Plugins/OStimNet/OStimNetMetaData.json";

        std::unordered_map<std::string, AnimationDescriptionEntry> m_descriptions;
        std::unordered_map<std::string, SceneMeta> m_sceneMeta;
        bool m_loaded = false;
    };

}  // namespace OStimNavigator
