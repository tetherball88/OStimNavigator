#include "FurnitureDatabase.h"
#include "FormUtils.h"
#include "StringUtils.h"
#include "JsonUtils.h"
#include <filesystem>
#include <fstream>
#include <limits>
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

        // Resolve faction pointers
        ResolveFactions();
        
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

            // Parse conditions
            if (j.contains("conditions") && j["conditions"].is_array()) {
                std::vector<std::function<bool(RE::TESObjectREFR*)>> conditions;
                int condIndex = 0;
                for (auto& jsonCondition : j["conditions"]) {
                    if (!jsonCondition.contains("type") || !jsonCondition["type"].is_string()) {
                        condIndex++;
                        continue;
                    }
                    std::string condType = jsonCondition["type"].get<std::string>();
                    StringUtils::ToLower(condType);

                    if (condType == "anykeyword" || condType == "keywordblacklist") {
                        if (jsonCondition.contains("keywords") && jsonCondition["keywords"].is_array()) {
                            std::vector<RE::BGSKeyword*> keywords;
                            for (auto& jsonKeyword : jsonCondition["keywords"]) {
                                if (jsonKeyword.contains("mod") && jsonKeyword["mod"].is_string() &&
                                    jsonKeyword.contains("formid") && jsonKeyword["formid"].is_string()) {
                                    auto* keyword = FormUtils::LookupForm<RE::BGSKeyword>(
                                        FormUtils::ParseFormID(jsonKeyword["formid"].get<std::string>()),
                                        jsonKeyword["mod"].get<std::string>());
                                    if (keyword) {
                                        keywords.push_back(keyword);
                                    }
                                }
                            }
                            if (!keywords.empty()) {
                                bool isBlacklist = (condType == "keywordblacklist");
                                conditions.push_back([keywords, isBlacklist](RE::TESObjectREFR* refr) {
                                    for (RE::BGSKeyword* keyword : keywords) {
                                        if (refr->HasKeyword(keyword)) {
                                            return !isBlacklist;
                                        }
                                    }
                                    return isBlacklist;
                                });
                            } else {
                                SKSE::log::warn("Furniture type '{}': keyword list for condition {} is empty", furnitureID, condIndex);
                            }
                        } else {
                            SKSE::log::warn("Furniture type '{}': condition {} missing 'keywords' array", furnitureID, condIndex);
                        }
                    } else if (condType == "formlist" || condType == "formblacklist") {
                        if (jsonCondition.contains("formlist") && jsonCondition["formlist"].is_object()) {
                            auto& jsonList = jsonCondition["formlist"];
                            if (jsonList.contains("mod") && jsonList["mod"].is_string() &&
                                jsonList.contains("formid") && jsonList["formid"].is_string()) {
                                auto* formList = FormUtils::LookupForm<RE::BGSListForm>(
                                    FormUtils::ParseFormID(jsonList["formid"].get<std::string>()),
                                    jsonList["mod"].get<std::string>());
                                if (formList) {
                                    bool isBlacklist = (condType == "formblacklist");
                                    conditions.push_back([formList, isBlacklist](RE::TESObjectREFR* refr) {
                                        RE::TESForm* base = refr->GetBaseObject();
                                        bool contains = base && formList->HasForm(base->formID);
                                        return isBlacklist ? !contains : contains;
                                    });
                                } else {
                                    SKSE::log::warn("Furniture type '{}': condition {} could not resolve formlist", furnitureID, condIndex);
                                }
                            }
                        } else {
                            SKSE::log::warn("Furniture type '{}': condition {} missing 'formlist' object", furnitureID, condIndex);
                        }
                    } else if (condType == "markercount") {
                        std::string markertype;
                        std::string markerCondition;
                        int markerValue = -1;
                        float minZ = std::numeric_limits<float>::quiet_NaN();
                        float maxZ = std::numeric_limits<float>::quiet_NaN();
                        TryGetJsonValue(jsonCondition, "markertype", markertype);
                        TryGetJsonValue(jsonCondition, "condition", markerCondition);
                        TryGetJsonValue(jsonCondition, "value", markerValue);
                        TryGetJsonValue(jsonCondition, "minZ", minZ);
                        TryGetJsonValue(jsonCondition, "maxZ", maxZ);
                        StringUtils::ToLower(markertype);
                        StringUtils::ToLower(markerCondition);

                        if (!markertype.empty() && !markerCondition.empty() && markerValue != -1) {
                            RE::BSFurnitureMarker::AnimationType animType;
                            bool validMarkerType = true;
                            if (markertype == "sleep") {
                                animType = RE::BSFurnitureMarker::AnimationType::kSleep;
                            } else if (markertype == "sit") {
                                animType = RE::BSFurnitureMarker::AnimationType::kSit;
                            } else {
                                SKSE::log::warn("Furniture type '{}': condition {} has unknown markertype '{}'", furnitureID, condIndex, markertype);
                                validMarkerType = false;
                            }

                            if (validMarkerType) {
                                bool checkEquals = (markerCondition == "equals");
                                bool checkGreater = (markerCondition == "greater");
                                if (!checkEquals && !checkGreater) {
                                    SKSE::log::warn("Furniture type '{}': condition {} has unknown condition '{}'", furnitureID, condIndex, markerCondition);
                                } else {
                                    conditions.push_back([animType, markerValue, minZ, maxZ, checkEquals](RE::TESObjectREFR* refr) {
                                        RE::NiAVObject* root = refr->Get3D();
                                        if (!root) return false;
                                        RE::NiExtraData* extra = root->GetExtraData("FRN");
                                        if (!extra) return false;
                                        RE::BSFurnitureMarkerNode* node = netimmerse_cast<RE::BSFurnitureMarkerNode*>(extra);
                                        if (!node) return false;
                                        int count = 0;
                                        for (RE::BSFurnitureMarker& marker : node->markers) {
                                            if (!std::isnan(minZ) && marker.offset.z < minZ) continue;
                                            if (!std::isnan(maxZ) && marker.offset.z > maxZ) continue;
                                            if (marker.animationType.all(animType)) count++;
                                        }
                                        return checkEquals ? (count == markerValue) : (count > markerValue);
                                    });
                                }
                            }
                        }
                    } else if (condType == "cellname") {
                        std::string cellname;
                        TryGetJsonValue(jsonCondition, "cellname", cellname);
                        if (!cellname.empty()) {
                            StringUtils::ToLower(cellname);
                            conditions.push_back([cellname](RE::TESObjectREFR* refr) {
                                RE::TESObjectCELL* cell = refr->GetParentCell();
                                if (!cell) return false;
                                std::string cellID = cell->GetFormEditorID();
                                StringUtils::ToLower(cellID);
                                return cellID.find(cellname) != std::string::npos;
                            });
                        }
                    } else {
                        SKSE::log::warn("Furniture type '{}': condition {} has unknown type '{}'", furnitureID, condIndex, condType);
                    }

                    condIndex++;
                }

                if (!conditions.empty()) {
                    furnitureType.condition = [conditions](RE::TESObjectREFR* refr) {
                        for (const auto& cond : conditions) {
                            if (!cond(refr)) return false;
                        }
                        return true;
                    };
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

    void FurnitureDatabase::ResolveFactions() {
        // First pass: resolve factions from own factionIDs
        for (auto& [id, furnitureType] : m_furnitureTypes) {
            if (furnitureType.factionIDs.empty()) {
                continue;
            }
            const auto& factionIDStr = furnitureType.factionIDs.front();
            uint32_t factionFormID = 0;
            std::string pluginName;
            if (!FormUtils::ParsePluginFormID(factionIDStr, pluginName, factionFormID)) {
                SKSE::log::warn("Furniture type '{}': invalid faction format '{}'", id, factionIDStr);
                continue;
            }
            furnitureType.faction = FormUtils::LookupForm<RE::TESFaction>(factionFormID, pluginName);
            if (!furnitureType.faction) {
                SKSE::log::warn("Furniture type '{}': could not resolve faction '{}'", id, factionIDStr);
            }
        }

        // Second pass: inherit faction from supertype chain (e.g. doublebed inherits from bed)
        for (auto& [id, furnitureType] : m_furnitureTypes) {
            if (furnitureType.faction) {
                continue;
            }
            const FurnitureTypeData* parent = furnitureType.supertype;
            while (parent) {
                if (parent->faction) {
                    furnitureType.faction = parent->faction;
                    break;
                }
                parent = parent->supertype;
            }
        }
    }

    FurnitureTypeData* FurnitureDatabase::GetFurnitureType(const std::string& id) {
        auto it = m_furnitureTypes.find(StringUtils::ToLowerCopy(id));
        return it != m_furnitureTypes.end() ? &it->second : nullptr;
    }

    FurnitureTypeData* FurnitureDatabase::GetFurnitureType(RE::TESObjectREFR* object) {
        if (!object) return nullptr;

        FurnitureTypeData* currentType = nullptr;
        for (auto& [id, type] : m_furnitureTypes) {
            if ((!currentType || currentType->priority < type.priority) && type.condition(object)) {
                currentType = &type;
            }
        }
        return currentType;
    }

    void FurnitureDatabase::AddSuperTypes(std::unordered_set<std::string>& furnitureTypes, const FurnitureTypeData* furniture) {
        while (furniture) {
            furnitureTypes.insert(furniture->id);
            furniture = furniture->supertype;
        }
    }

    std::string FurnitureDatabase::GetFurnitureTypeFromActor(RE::Actor* actor) {
        if (!actor) return "";

        const FurnitureTypeData* best = nullptr;
        for (const auto& [furnitureID, furnitureData] : m_furnitureTypes) {
            if (furnitureData.faction && actor->IsInFaction(furnitureData.faction)) {
                return furnitureData.id; 
            }
        }
        return "";
    }

    std::unordered_set<std::string> FurnitureDatabase::GetFurnitureTypesFromActor(RE::Actor* actor) {
        std::unordered_set<std::string> furnitureTypes;
        if (!actor) return furnitureTypes;

        for (const auto& [furnitureID, furnitureData] : m_furnitureTypes) {
            if (furnitureData.faction && actor->IsInFaction(furnitureData.faction)) {
                AddSuperTypes(furnitureTypes, &furnitureData);
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

    std::vector<std::string> FurnitureDatabase::GetAllFurnitureTypeIDs() const {
        std::vector<std::string> result;
        result.reserve(m_furnitureTypes.size());
        for (const auto& [id, _] : m_furnitureTypes) {
            result.push_back(id);
        }
        std::sort(result.begin(), result.end());
        return result;
    }

    void FurnitureDatabase::IncrementSceneCount(const std::string& id) {
        auto it = m_furnitureTypes.find(id);
        if (it != m_furnitureTypes.end()) {
            it->second.sceneCount++;
        }
    }
}
