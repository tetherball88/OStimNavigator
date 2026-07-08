#include "Papyrus.h"
#include "PrismaUIManager.h"

namespace OStimNavigator {
    namespace Papyrus {

        constexpr std::string_view SCRIPT_NAME = "OStimNavigator";

        // OStimNavigator.ShowDevEditor() global native
        void ShowDevEditor(RE::BSScript::IVirtualMachine*, RE::VMStackID, RE::StaticFunctionTag*) {
            auto& mgr = PrismaUIManager::GetSingleton();
            mgr.Show();
        }

        bool Register(RE::BSScript::IVirtualMachine* vm) {
            vm->RegisterFunction("ShowDevEditor", SCRIPT_NAME, ShowDevEditor);
            SKSE::log::info("Registered Papyrus functions for {}", SCRIPT_NAME);
            return true;
        }

    }
}
