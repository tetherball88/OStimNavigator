#pragma once

#include "PCH.h"
#include <nlohmann/json_fwd.hpp>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <vector>

namespace OStimNavigator {

    struct ActorPropertyData {
        RE::FormID conditionFormID = 0;
        std::string conditionPlugin;
        std::string actorType;
        std::unordered_set<std::string> requirements;
        std::unordered_set<std::string> missingRequirements;  // Requirements set to false
    };

    class ActorPropertiesDatabase {
    public:
        static ActorPropertiesDatabase& GetSingleton() {
            static ActorPropertiesDatabase singleton;
            return singleton;
        }

        void LoadActorProperties();
        bool IsLoaded() const { return m_loaded; }

        // Get requirements for a specific actor based on perks/conditions
        std::unordered_set<std::string> GetActorRequirements(RE::Actor* actor) const;
        
        // Clear the evaluation cache (call when needed, e.g., when actors change)
        void ClearCache() const { m_cache.clear(); }

    private:
        ActorPropertiesDatabase() = default;
        ~ActorPropertiesDatabase() = default;
        ActorPropertiesDatabase(const ActorPropertiesDatabase&) = delete;
        ActorPropertiesDatabase& operator=(const ActorPropertiesDatabase&) = delete;

        void ParsePropertyFile(const std::filesystem::path& filePath);
        void ParseCondition(const nlohmann::json& json, ActorPropertyData& data);
        void ParseActorType(const nlohmann::json& json, ActorPropertyData& data);
        void ParseRequirements(const nlohmann::json& json, ActorPropertyData& data);
        bool IsValidPropertyData(const ActorPropertyData& data) const;
        bool EvaluateCondition(const ActorPropertyData& property, RE::Actor* actor) const;
        void ApplyPropertyRequirements(const ActorPropertyData& property, std::unordered_set<std::string>& requirements) const;

        std::vector<ActorPropertyData> m_properties;
        bool m_loaded = false;
        
        // Cache of evaluated requirements per actor (mutable so const methods can use it)
        mutable std::unordered_map<RE::FormID, std::unordered_set<std::string>> m_cache;
    };

}
