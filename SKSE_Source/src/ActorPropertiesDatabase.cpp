#include "ActorPropertiesDatabase.h"
#include "FormUtils.h"
#include "StringUtils.h"
#include "JsonUtils.h"
#include <nlohmann/json.hpp>
#include <filesystem>
#include <fstream>

namespace OStimNavigator {

    void ActorPropertiesDatabase::LoadActorProperties() {
        m_properties.clear();
        m_loaded = false;

        std::filesystem::path basePath = "Data/SKSE/Plugins/OStim/actor properties";
        
        int loadedCount = 0;
        JsonUtils::LoadJsonFilesFromDirectory(basePath,
            [this, &loadedCount](const std::filesystem::path& path) {
                ParsePropertyFile(path);
                loadedCount++;
            },
            true);  // recursive

        m_loaded = true;
        SKSE::log::info("Loaded {} actor property files", loadedCount);
    }

    void ActorPropertiesDatabase::ParsePropertyFile(const std::filesystem::path& filePath) {
        try {
            std::ifstream file(filePath);
            if (!file.is_open()) {
                SKSE::log::warn("Failed to open actor property file: {}", filePath.string());
                return;
            }

            nlohmann::json json;
            file >> json;

            ActorPropertyData data;
            ParseCondition(json, data);
            ParseActorType(json, data);
            ParseRequirements(json, data);

            if (IsValidPropertyData(data)) {
                m_properties.push_back(data);
            }

        } catch (const std::exception& e) {
            SKSE::log::error("Error parsing actor property file {}: {}", filePath.string(), e.what());
        }
    }

    void ActorPropertiesDatabase::ParseCondition(const nlohmann::json& json, ActorPropertyData& data) {
        if (!json.contains("condition")) return;
        
        auto& condition = json["condition"];
        if (condition.contains("mod") && condition.contains("formid")) {
            data.conditionPlugin = condition["mod"].get<std::string>();
            data.conditionFormID = FormUtils::ParseFormID(condition["formid"].get<std::string>());
        }
    }

    void ActorPropertiesDatabase::ParseActorType(const nlohmann::json& json, ActorPropertyData& data) {
        if (!json.contains("type")) return;
        
        data.actorType = json["type"].get<std::string>();
        StringUtils::ToLower(data.actorType);
    }

    void ActorPropertiesDatabase::ParseRequirements(const nlohmann::json& json, ActorPropertyData& data) {
        if (!json.contains("requirements")) return;
        
        auto& requirements = json["requirements"];
        if (!requirements.is_object()) return;

        for (auto& [key, value] : requirements.items()) {
            std::string requirement = key;
            StringUtils::ToLower(requirement);
            
            if (value.get<bool>()) {
                data.requirements.insert(requirement);
            } else {
                data.missingRequirements.insert(requirement);
            }
        }
    }

    bool ActorPropertiesDatabase::IsValidPropertyData(const ActorPropertyData& data) const {
        return data.conditionFormID != 0 || !data.requirements.empty() || !data.missingRequirements.empty();
    }

    std::unordered_set<std::string> ActorPropertiesDatabase::GetActorRequirements(RE::Actor* actor) const {
        std::unordered_set<std::string> requirements;

        if (!actor) {
            // nullptr actors meet all requirements (for validation purposes)
            return requirements;
        }
        
        // Check cache first
        RE::FormID actorFormID = actor->GetFormID();
        auto cacheIt = m_cache.find(actorFormID);
        if (cacheIt != m_cache.end()) {
            return cacheIt->second;
        }

        SKSE::log::trace("Evaluating actor properties for: {}", actor->GetName() ? actor->GetName() : "Unknown");

        for (const auto& property : m_properties) {
            if (EvaluateCondition(property, actor)) {
                ApplyPropertyRequirements(property, requirements);
            }
        }

        if (!requirements.empty()) {
            SKSE::log::trace("Final requirements for {}: {}", actor->GetName() ? actor->GetName() : "Unknown", requirements.size());
        }
        
        m_cache[actorFormID] = requirements;
        return requirements;
    }

    bool ActorPropertiesDatabase::EvaluateCondition(const ActorPropertyData& property, RE::Actor* actor) const {
        if (property.conditionFormID == 0) {
            return true;  // No condition means always true
        }

        RE::FormID maskedFormID = property.conditionFormID & 0x00FFFFFF;
        auto* perk = FormUtils::LookupForm<RE::BGSPerk>(maskedFormID, property.conditionPlugin);
        
        if (!perk) {
            SKSE::log::warn("  Perk not found: {}|{:08X}", property.conditionPlugin, maskedFormID);
            return false;
        }

        if (!perk->perkConditions) {
            SKSE::log::trace("  Perk found ({}|{:08X}) with no conditions - always true", 
                property.conditionPlugin, maskedFormID);
            return true;
        }

        bool result = perk->perkConditions.IsTrue(actor, actor);
        SKSE::log::trace("  Perk condition ({}|{:08X}) evaluated to: {}", 
            property.conditionPlugin, maskedFormID, result);
        return result;
    }

    void ActorPropertiesDatabase::ApplyPropertyRequirements(const ActorPropertyData& property, 
                                                            std::unordered_set<std::string>& requirements) const {
        for (const auto& req : property.requirements) {
            requirements.insert(req);
            SKSE::log::trace("  Adding requirement: {}", req);
        }
        for (const auto& req : property.missingRequirements) {
            requirements.erase(req);
            SKSE::log::trace("  Removing requirement: {}", req);
        }
    }

}
