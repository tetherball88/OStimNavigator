#pragma once

#include <string>

namespace OStimNavigator {
    namespace FormUtils {
        // Lookup a form by FormID and plugin name
        // Returns nullptr if form not found
        template<typename T = RE::TESForm>
        T* LookupForm(RE::FormID formID, const std::string& pluginName) {
            auto* dataHandler = RE::TESDataHandler::GetSingleton();
            if (!dataHandler) {
                return nullptr;
            }

            // Try standard lookup first
            RE::TESForm* form = dataHandler->LookupForm(formID, pluginName);
            if (form) {
                return form->As<T>();
            }

            // Fallback: try with compile index
            auto* file = dataHandler->LookupModByName(pluginName);
            if (file && file->compileIndex != 0xFF) {
                RE::FormID maskedFormID = formID & 0x00FFFFFF;
                RE::FormID fullFormID = (static_cast<RE::FormID>(file->compileIndex) << 24) | maskedFormID;
                return RE::TESForm::LookupByID<T>(fullFormID);
            }

            return nullptr;
        }
        
        // Parse a hex FormID string (supports "0x" prefix)
        inline RE::FormID ParseFormID(const std::string& formIDStr) {
            try {
                std::string cleanStr = formIDStr;
                if (cleanStr.size() >= 2 && cleanStr.substr(0, 2) == "0x") {
                    cleanStr = cleanStr.substr(2);
                }
                return std::stoul(cleanStr, nullptr, 16);
            } catch (...) {
                return 0;
            }
        }
        
        // Parse "Plugin.esp|0xFormID" format into plugin name and FormID
        // Returns true if successful, false otherwise
        inline bool ParsePluginFormID(const std::string& str, std::string& outPlugin, RE::FormID& outFormID) {
            size_t pipePos = str.find('|');
            if (pipePos == std::string::npos) {
                return false;
            }
            
            outPlugin = str.substr(0, pipePos);
            std::string formIDPart = str.substr(pipePos + 1);
            outFormID = ParseFormID(formIDPart);
            
            return outFormID != 0;
        }
    }
}
