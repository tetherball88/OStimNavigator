#include "ActionDatabase.h"
#include "SceneDatabase.h"
#include "StringUtils.h"
#include "JsonUtils.h"
#include <nlohmann/json.hpp>
#include <fstream>
#include <functional>
#include <algorithm>

using json = nlohmann::json;

namespace OStimNavigator {

    void ActionDatabase::LoadActions() {
        if (m_loaded) {
            return;
        }

        m_actions.clear();
        m_aliases.clear();
        m_allTags.clear();

        // Path to OStim actions directory
        std::filesystem::path actionsPath = "Data/SKSE/Plugins/OStim/actions";
        
        JsonUtils::LoadJsonFilesFromDirectory(actionsPath, 
            [this](const std::filesystem::path& path) {
                ParseActionFile(path);
            });

        SKSE::log::info("Loaded {} actions with {} aliases", m_actions.size(), m_aliases.size());
        m_loaded = true;
    }

    void ActionDatabase::ParseActionFile(const std::filesystem::path& filePath) {
        try {
            std::ifstream file(filePath);
            if (!file.is_open()) {
                SKSE::log::warn("Failed to open action file: {}", filePath.string());
                return;
            }

            json j;
            file >> j;

            ActionData action;
            action.type = filePath.stem().string();
            StringUtils::ToLower(action.type);

            ParseAliases(j, action);
            ParseTags(j, action);
            ParseRoleRequirements(j, action);

            m_actions[action.type] = action;

        } catch (const std::exception& e) {
            SKSE::log::error("Error parsing action file {}: {}", filePath.string(), e.what());
        }
    }

    void ActionDatabase::ParseAliases(const nlohmann::json& j, ActionData& action) {
        ParseJsonStringArray(j, "aliases", [&](const std::string& alias) {
            action.aliases.push_back(alias);
            m_aliases[alias] = action.type;
        });
    }

    void ActionDatabase::ParseTags(const nlohmann::json& j, ActionData& action) {
        ParseJsonStringArray(j, "tags", [&](const std::string& tag) {
            action.tags.push_back(tag);
            m_allTags.insert(tag);
        });
    }

    void ActionDatabase::ParseRoleRequirements(const nlohmann::json& j, ActionData& action) {
        if (j.contains("actor") && j["actor"].is_object()) {
            action.actorRequirements = ParseActorRequirements(j["actor"]);
        }
        if (j.contains("target") && j["target"].is_object()) {
            action.targetRequirements = ParseActorRequirements(j["target"]);
        }
        if (j.contains("performer") && j["performer"].is_object()) {
            action.performerRequirements = ParseActorRequirements(j["performer"]);
        }
    }

    void ActionDatabase::ParseJsonStringArray(const nlohmann::json& j, const char* key, 
                                               std::function<void(const std::string&)> callback) {
        if (j.contains(key) && j[key].is_array()) {
            for (const auto& item : j[key]) {
                if (item.is_string()) {
                    std::string value = item.get<std::string>();
                    StringUtils::ToLower(value);
                    callback(value);
                }
            }
        }
    }

    std::unordered_set<std::string> ActionDatabase::ParseActorRequirements(const nlohmann::json& actorJson) {
        std::unordered_set<std::string> requirements;
        ParseJsonStringArray(actorJson, "requirements", [&](const std::string& req) {
            requirements.insert(req);
        });
        return requirements;
    }

    std::string ActionDatabase::ResolveActionType(const std::string& typeOrAlias) const {
        std::string lower = StringUtils::ToLowerCopy(typeOrAlias);
        
        // Check if it's an alias
        auto aliasIt = m_aliases.find(lower);
        if (aliasIt != m_aliases.end()) {
            return aliasIt->second;
        }
        
        // Otherwise return as-is (assume it's already the main type)
        return lower;
    }

    ActionData* ActionDatabase::GetAction(const std::string& type) {
        std::string resolved = ResolveActionType(type);
        
        auto it = m_actions.find(resolved);
        if (it != m_actions.end()) {
            return &it->second;
        }
        return nullptr;
    }

    const ActionData* ActionDatabase::FindAction(const std::string& typeOrAlias) const {
        std::string resolved = ResolveActionType(typeOrAlias);
        auto it = m_actions.find(resolved);
        return (it != m_actions.end()) ? &it->second : nullptr;
    }

    bool ActionDatabase::ActionHasTag(const std::string& type, const std::string& tag) const {
        const ActionData* action = FindAction(type);
        if (!action) return false;

        std::string lowerTag = StringUtils::ToLowerCopy(tag);
        return std::find(action->tags.begin(), action->tags.end(), lowerTag) != action->tags.end();
    }
    
    std::vector<std::string> ActionDatabase::GetActionTags(const std::string& typeOrAlias) const {
        const ActionData* action = FindAction(typeOrAlias);
        return action ? action->tags : std::vector<std::string>{};
    }
    
    std::unordered_set<std::string> ActionDatabase::GetTagsFromActions(const std::vector<SceneActionData>& actions) const {
        std::unordered_set<std::string> allTags;
        
        for (const auto& action : actions) {
            auto actionTags = GetActionTags(action.type);
            for (const auto& tag : actionTags) {
                allTags.insert(tag);
            }
        }
        
        return allTags;
    }

    std::vector<std::string> ActionDatabase::GetAllTags() const {
        return StringUtils::SetToSortedVector(m_allTags);
    }
}
