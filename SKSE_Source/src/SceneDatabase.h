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
    };

    class SceneDatabase {
    public:
        static SceneDatabase& GetSingleton() {
            static SceneDatabase instance;
            return instance;
        }

        // Load all scenes from Data/SKSE/Plugins/OStim/scenes/
        void LoadScenes();

        // Query functions
        SceneData* GetSceneByID(const std::string& id);
        std::vector<SceneData*> GetAllScenes();
        std::vector<SceneData*> GetScenesByActorCount(uint32_t actorCount);
        std::vector<SceneData*> GetScenesByTag(const std::string& tag);
        std::vector<SceneData*> SearchScenesByName(const std::string& searchTerm);
        
        // Stats
        size_t GetSceneCount() const { return m_scenes.size(); }
        bool IsLoaded() const { return m_loaded; }
        
        // Get all unique tags from all scenes
        std::vector<std::string> GetAllTags() const;
        
        // Get all unique action types from all scenes
        std::vector<std::string> GetAllActions() const;
        
        // Get all unique actor tags from all scenes
        std::vector<std::string> GetAllActorTags() const;

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
        bool m_loaded = false;
    };
}
