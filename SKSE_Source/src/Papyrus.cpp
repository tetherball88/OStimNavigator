#include "Papyrus.h"
#include "PrismaUIManager.h"
#include "SceneDatabase.h"

namespace OStimNavigator {
    namespace Papyrus {

        constexpr std::string_view SCRIPT_NAME = "OStimNavigator";

        // OStimNavigator.ShowDevEditor() global native
        void ShowDevEditor(RE::BSScript::IVirtualMachine*, RE::VMStackID, RE::StaticFunctionTag*) {
            auto& mgr = PrismaUIManager::GetSingleton();
            mgr.Show();
        }

        // OStimNavigator.IsSceneLoaded(string asSceneID) global native
        bool IsSceneLoaded(RE::BSScript::IVirtualMachine*, RE::VMStackID, RE::StaticFunctionTag*,
                           RE::BSFixedString asSceneID) {
            SKSE::log::info("Papyrus::IsSceneLoaded called with sceneID='{}'", asSceneID.c_str());
            return SceneDatabase::GetSingleton().GetSceneByID(asSceneID.c_str()) != nullptr;
        }

        bool Register(RE::BSScript::IVirtualMachine* vm) {
            vm->RegisterFunction("ShowDevEditor", SCRIPT_NAME, ShowDevEditor);
            vm->RegisterFunction("IsSceneLoaded", SCRIPT_NAME, IsSceneLoaded);
            SKSE::log::info("Registered Papyrus functions for {}", SCRIPT_NAME);
            return true;
        }

    }
}
