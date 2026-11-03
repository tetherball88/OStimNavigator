#pragma once

#include "PCH.h"
#include "SceneDatabase.h"
#include "OStimIntegration.h"
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>

namespace OStimNavigator {

    struct SceneFilterSettings {
        // Text filters
        const char* searchText = nullptr;
        
        // Multi-select filters
        std::unordered_set<std::string> selectedModpacks;
        std::unordered_set<std::string> selectedSceneTags;
        std::unordered_set<std::string> selectedActorTags;
        std::unordered_set<std::string> selectedActions;
        std::unordered_set<std::string> selectedActionTags;
        
        // Filter modes (AND/OR)
        bool sceneTagsAND = false;
        bool actorTagsAND = false;
        bool actionsAND = false;
        bool actionTagsAND = false;
        
        // Compatibility filters
        bool hideTransitions = true;
        bool useIntendedSex = true;
        bool validateRequirements = true;
        bool hideNonRandom = true;
        bool hideIntroIdle = true;
    };
    
    struct SceneFilterResult {
        std::vector<SceneData*> filteredScenes;
        std::unordered_map<SceneData*, float> similarityScores;
    };
    
    class SceneFilter {
    public:
        // Build default compatibility filter settings for an active OStim thread
        // (respects OStim MCM IsUnrestrictedNavigation and IsIntendedSexOnly).
        static SceneFilterSettings GetThreadDefaultSettings();

        // Apply all filters to scenes and return filtered results.
        // threadID: the OStim thread whose actors are used for compatibility checks.
        static SceneFilterResult ApplyFilters(
            uint32_t threadID,
            SceneData* currentScene,
            const SceneFilterSettings& settings
        );

        // Cached O(1) lookup for available canonical positions for an active thread.
        static const std::string& GetThreadPositionsJson(uint32_t threadID);

        // Cached O(1) lookup for available actions for an active thread (optionally filtered by phase/tag).
        static const std::string& GetThreadActionsJson(uint32_t threadID, const char* tag);

        // Cached O(1) lookup for available canonical positions for a pre-start actor + furniture setup.
        static const std::string& GetSetupPositionsJson(
            const uint32_t* actorFormIDs,
            uint32_t actorCount,
            const char* furnitureType
        );

        // Cached O(1) lookup for available actions for a pre-start actor + furniture setup
        // (phaseOrTag: "foreplay", "oral", "sex", "sexual", or empty for all).
        static const std::string& GetSetupActionsJson(
            const uint32_t* actorFormIDs,
            uint32_t actorCount,
            const char* furnitureType,
            const char* phaseOrTag
        );

        // Invalidate cached thread/setup filter results (called when a scene is reloaded/edited).
        static void InvalidateCache();
    };
}
