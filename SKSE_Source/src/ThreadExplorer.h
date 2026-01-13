#pragma once

#include "PCH.h"

namespace OStimNavigator {
    namespace UI {
        namespace ThreadExplorer {
            // Show the explorer window for a specific thread
            void Show(uint32_t threadID);
            
            // Hide the explorer window
            void Hide();
            
            // Check if the window is currently shown
            bool IsShown();
            
            // Render the explorer window (call this from the main UI render loop)
            void Render();
        }
    }
}
