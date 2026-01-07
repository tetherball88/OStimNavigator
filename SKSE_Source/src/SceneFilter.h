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
        // Apply all filters to scenes and return filtered results
        static SceneFilterResult ApplyFilters(
            OStim::Thread* thread,
            SceneData* currentScene,
            const SceneFilterSettings& settings
        );
    };
}
