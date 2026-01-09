#pragma once

#include "PCH.h"
#include <string>
#include <map>

namespace OStimNavigator {
    namespace OStimNetIntegration {
        struct AnimationDescription {
            std::string originalId;     // Original animation ID with preserved case
            std::string description;
            std::string fileName;
        };

        // Check if TT_OStimNet.esp is loaded
        bool IsOStimNetAvailable();

        // Load animation descriptions from JSON files
        void LoadAnimationDescriptions();

        // Get the animation descriptions map
        const std::map<std::string, AnimationDescription>& GetAnimationDescriptions();

        // Check if descriptions are loaded
        bool AreDescriptionsLoaded();

        // Force reload of descriptions
        void ReloadDescriptions();

        // Render the OStimNet UI page
        void __stdcall Render();
    }
}
