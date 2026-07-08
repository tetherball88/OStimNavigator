#pragma once

#include "PCH.h"
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <nlohmann/json.hpp>

namespace OStimNavigator {
    
    struct ActorData {
        std::string intendedSex;                // "male", "female", or empty for any
        int animationIndex = -1;                // Animation index, -1 if not specified
        std::vector<std::string> tags;          // Actor tags
    };
    
    struct SceneActionData {
        std::string type;                       // Action type (resolved)
        int actor = -1;                         // Actor role index (-1 if not specified)
        int target = -1;                        // Target role index (-1 if not specified)
        int performer = -1;                     // Performer role index (-1 if not specified)
    };
    
    struct SceneData {
        std::string id;                         // Scene ID (filename without .json)
        std::filesystem::path filePath;         // Absolute path to the source .json file
        std::string name;                       // Display name
        std::string modpack;                    // Modpack name
        uint32_t actorCount = 0;                // Number of actors
        std::string furnitureType;              // Furniture type
        std::vector<std::string> tags;          // Scene tags
        std::vector<SceneActionData> actions;   // Actions with role mappings
        std::vector<ActorData> actors;          // Actor data for each position

        // Optional metadata
        float length = 0.0f;                    // Animation length
        bool isTransition = false;              // Is this a transition scene
        std::string destination;                // Transition destination (if transition)
        bool noRandomSelection = false;         // If true, not suitable for auto mode
        std::string firstSpeedAnimation;        // First speed animation name
    };

    class SceneDatabase {
    public:
        static SceneDatabase& GetSingleton() {
            static SceneDatabase instance;
            return instance;
        }

        // Load all scenes from Data/SKSE/Plugins/OStim/scenes/
        void LoadScenes();

        // Re-parse a single scene file from disk and update the in-memory cache.
        // Call this after saving edits to a scene JSON so that subsequent queries
        // (e.g. BuildSceneDescription) reflect the new data immediately.
        void ReloadScene(const std::string& id);

        // Update the in-memory cache for a single scene using content that is
        // already in memory (e.g. the string that was just written to disk).
        // Skips the second disk read that ReloadScene would otherwise perform,
        // and also skips the OStimNet metadata re-injection (already done at
        // initial load). Must be called on the game thread.
        void ReloadSceneFromContent(const std::string& id, const std::string& content,
                                    const std::filesystem::path& filePath);

        // Query functions
        SceneData* GetSceneByID(const std::string& id);
        std::vector<SceneData*> GetAllScenes();
        std::vector<SceneData*> GetScenesByActorCount(uint32_t actorCount);
        std::vector<SceneData*> GetScenesByTag(const std::string& tag);
        std::vector<SceneData*> SearchScenesByName(const std::string& searchTerm);
        
        // Find an OStim scene ID that uses the given animation name
        std::string FindOStimSceneIdByAnimation(const std::string& animationName) const;
        
        // Stats
        size_t GetSceneCount() const { return m_scenes.size(); }
        bool IsLoaded() const { return m_loaded; }
        
        // Get all unique tags from all scenes
        std::vector<std::string> GetAllTags() const;
        
        // Get all unique action types from all scenes
        std::vector<std::string> GetAllActions() const;
        
        // Get all unique actor tags from all scenes
        std::vector<std::string> GetAllActorTags() const;

        // Get all position strings that appear in at least one scene (sorted)
        std::vector<std::string> GetAllPositions() const;

        // Find the filesystem path for a scene by ID (empty path if not found)
        std::filesystem::path FindSceneFilePath(const std::string& id) const;

    private:
        SceneDatabase() = default;
        ~SceneDatabase() = default;
        SceneDatabase(const SceneDatabase&) = delete;
        SceneDatabase& operator=(const SceneDatabase&) = delete;

        void ParseSceneFile(const std::filesystem::path& filePath);
        void ParseActors(const nlohmann::json& j, SceneData& scene);
        void ParseActions(const nlohmann::json& j, SceneData& scene);
        
        template<typename Predicate>
        std::vector<SceneData*> FilterScenes(Predicate pred) {
            std::vector<SceneData*> result;
            for (auto& pair : m_scenes) {
                if (pred(pair.second)) {
                    result.push_back(&pair.second);
                }
            }
            return result;
        }

        std::unordered_map<std::string, SceneData> m_scenes;
        std::unordered_set<std::string> m_allTags;
        std::unordered_set<std::string> m_allActions;
        std::unordered_set<std::string> m_allActorTags;
        std::unordered_set<std::string> m_allPositions;
        std::unordered_map<std::string, std::string> m_animationToOStimSceneId;
        bool m_loaded = false;
    };
}
