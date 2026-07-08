#pragma once

#include "PCH.h"

namespace OStimNavigator {
    namespace Papyrus {
        // Registers all native Papyrus functions with the Papyrus VM.
        bool Register(RE::BSScript::IVirtualMachine* vm);
    }
}
