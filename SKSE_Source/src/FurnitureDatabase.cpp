#include "FurnitureDatabase.h"
#include "FormUtils.h"
#include "StringUtils.h"
#include "JsonUtils.h"
#include <filesystem>
#include <fstream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

namespace OStimNavigator {

    namespace {
        // Helper to extract JSON string fields
        template<typename T>
        bool TryGetJsonValue(const json& j, const char* key, T& out) {
            if (!j.contains(key)) return false;
            try {
                out = j[key].get<T>();
                return true;
            } catch (...) {
                return false;
            }
        }
    }

    void FurnitureDatabase::LoadFurnitureTypes() {
        if (m_loaded) {
            return;
        }

        SKSE::log::info("Loading furniture types...");
        
        std::filesystem::path furnitureTypesPath = "Data/SKSE/Plugins/OStim/furniture types";
        
        LoadFurnitureTypesFromDirectory(furnitureTypesPath);
        
        // Resolve supertype pointers
        ResolveSuperTypes();
        
        m_loaded = true;
        SKSE::log::info("Loaded {} furniture types", m_furnitureTypes.size());
    }

    void FurnitureDatabase::LoadFurnitureTypesFromDirectory(const std::filesystem::path& directory) {
        JsonUtils::LoadJsonFilesFromDirectory(directory,
            [this](const std::filesystem::path& path) {
                ParseFurnitureFile(path);
            },
            true);  // recursive
    }

    void FurnitureDatabase::ParseFurnitureFile(const std::filesystem::path& filePath) {
        try {
            std::ifstream file(filePath);
            if (!file.is_open()) {
                SKSE::log::warn("Could not open furniture type file: {}", filePath.string());
                return;
            }

            json j;
            file >> j;
            file.close();

            // Get the furniture type ID from filename (without .json extension)
            std::string furnitureID = filePath.stem().string();
            StringUtils::ToLower(furnitureID);

            FurnitureTypeData furnitureType;
            furnitureType.id = furnitureID;

            // Parse fields using helper
            TryGetJsonValue(j, "name", furnitureType.name);
            TryGetJsonValue(j, "priority", furnitureType.priority);
            TryGetJsonValue(j, "listIndividually", furnitureType.listIndividually);
            
            if (TryGetJsonValue(j, "supertype", furnitureType.supertypeID)) {
                StringUtils::ToLower(furnitureType.supertypeID);
            }

            // Parse faction object
            if (j.contains("faction") && j["faction"].is_object()) {
                auto& factionObj = j["faction"];
                std::string mod;
                std::string formid;
                
                if (factionObj.contains("mod") && factionObj["mod"].is_string()) {
                    mod = factionObj["mod"].get<std::string>();
                }
                if (factionObj.contains("formid") && factionObj["formid"].is_string()) {
                    formid = factionObj["formid"].get<std::string>();
                }
                
                if (!mod.empty() && !formid.empty()) {
                    furnitureType.factionIDs.push_back(mod + "|" + formid);
                }
            }

            m_furnitureTypes[furnitureID] = furnitureType;

        } catch (const std::exception& e) {
            SKSE::log::error("Error parsing furniture type file {}: {}", filePath.string(), e.what());
        }
    }

    void FurnitureDatabase::ResolveSuperTypes() {
        for (auto& [id, furnitureType] : m_furnitureTypes) {
            if (!furnitureType.supertypeID.empty()) {
                auto it = m_furnitureTypes.find(furnitureType.supertypeID);
                if (it != m_furnitureTypes.end()) {
                    furnitureType.supertype = &it->second;
                } else {
                    SKSE::log::warn("Furniture type '{}' has unknown supertype '{}'", id, furnitureType.supertypeID);
                }
            }
        }
    }

    FurnitureTypeData* FurnitureDatabase::GetFurnitureType(const std::string& id) {
        auto it = m_furnitureTypes.find(StringUtils::ToLowerCopy(id));
        return it != m_furnitureTypes.end() ? &it->second : nullptr;
    }

    void FurnitureDatabase::AddSuperTypes(std::unordered_set<std::string>& furnitureTypes, const FurnitureTypeData* furniture) {
        while (furniture) {
            furnitureTypes.insert(furniture->id);
            furniture = furniture->supertype;
        }
    }

    std::unordered_set<std::string> FurnitureDatabase::GetFurnitureTypesFromActor(RE::Actor* actor) {
        std::unordered_set<std::string> furnitureTypes;
        if (!actor) return furnitureTypes;

        for (const auto& [furnitureID, furnitureData] : m_furnitureTypes) {
            for (const auto& factionIDStr : furnitureData.factionIDs) {
                uint32_t factionFormID = 0;
                std::string pluginName;
                
                if (!FormUtils::ParsePluginFormID(factionIDStr, pluginName, factionFormID)) {
                    SKSE::log::warn("Invalid faction format (expected 'Plugin.esp|0xFormID'): {}", factionIDStr);
                    continue;
                }

                RE::TESFaction* faction = FormUtils::LookupForm<RE::TESFaction>(factionFormID, pluginName);
                if (faction && actor->IsInFaction(faction)) {
                    AddSuperTypes(furnitureTypes, &furnitureData);
                    break;
                }
            }
        }
        return furnitureTypes;
    }

    bool FurnitureDatabase::IsSceneCompatible(const std::unordered_set<std::string>& threadFurnitureTypes, const std::string& sceneFurniture) {
        std::string sceneFurnitureLower = StringUtils::ToLowerCopy(sceneFurniture);

        if (threadFurnitureTypes.empty()) {
            bool compatible = sceneFurnitureLower.empty();
            return compatible;
        }

        if (sceneFurnitureLower.empty()) {
            bool hasBed = std::any_of(threadFurnitureTypes.begin(), threadFurnitureTypes.end(),
                [](const auto& type) { return type.find("bed") != std::string::npos; });
            return hasBed;
        }

        bool compatible = threadFurnitureTypes.find(sceneFurnitureLower) != threadFurnitureTypes.end();
        return compatible;
    }
}
