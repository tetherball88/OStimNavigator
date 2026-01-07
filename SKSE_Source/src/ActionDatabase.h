#pragma once

#include "PCH.h"
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <nlohmann/json_fwd.hpp>

namespace OStimNavigator {
    
    // Forward declaration
    struct SceneActionData;
    
    struct ActionData {
        std::string type;                               // Main action type (e.g., "vaginalsex")
        std::vector<std::string> aliases;               // Aliases (e.g., "sex")
        std::vector<std::string> tags;                  // Action tags
        
        // Requirements per role
        std::unordered_set<std::string> actorRequirements;
        std::unordered_set<std::string> targetRequirements;
        std::unordered_set<std::string> performerRequirements;
    };

    class ActionDatabase {
    public:
        static ActionDatabase& GetSingleton() {
            static ActionDatabase instance;
            return instance;
        }

        // Load all actions from Data/SKSE/Plugins/OStim/actions
        void LoadActions();

        // Resolve an action type or alias to the main action type
        std::string ResolveActionType(const std::string& typeOrAlias) const;

        // Get action data by type
        ActionData* GetAction(const std::string& type);
        
        // Check if an action has a specific tag
        bool ActionHasTag(const std::string& type, const std::string& tag) const;
        
        // Get tags for a specific action type
        std::vector<std::string> GetActionTags(const std::string& typeOrAlias) const;
        
        // Get all unique tags from multiple actions
        std::unordered_set<std::string> GetTagsFromActions(const std::vector<SceneActionData>& actions) const;

        // Stats
        size_t GetActionCount() const { return m_actions.size(); }
        bool IsLoaded() const { return m_loaded; }
        
        // Get all unique tags from all actions
        std::vector<std::string> GetAllTags() const;

    private:
        ActionDatabase() = default;
        ~ActionDatabase() = default;
        ActionDatabase(const ActionDatabase&) = delete;
        ActionDatabase& operator=(const ActionDatabase&) = delete;

        void ParseActionFile(const std::filesystem::path& filePath);
        void ParseAliases(const nlohmann::basic_json<>& j, ActionData& action);
        void ParseTags(const nlohmann::basic_json<>& j, ActionData& action);
        void ParseRoleRequirements(const nlohmann::basic_json<>& j, ActionData& action);
        void ParseJsonStringArray(const nlohmann::basic_json<>& j, const char* key, 
                                  std::function<void(const std::string&)> callback);
        std::unordered_set<std::string> ParseActorRequirements(const nlohmann::basic_json<>& actorJson);
        const ActionData* FindAction(const std::string& typeOrAlias) const;

        std::unordered_map<std::string, ActionData> m_actions;      // type -> ActionData
        std::unordered_map<std::string, std::string> m_aliases;     // alias -> type
        std::unordered_set<std::string> m_allTags;
        bool m_loaded = false;
    };
}
