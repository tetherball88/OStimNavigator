#pragma once

#include "PCH.h"

namespace OStimNavigator {
    namespace UI {
        // Initialize and register all UI elements with SKSEMenuFramework
        void Register();

        // Active Threads Menu
        namespace ActiveThreads {
            void __stdcall Render();
        }
    }
}
