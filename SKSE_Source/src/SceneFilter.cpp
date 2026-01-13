#include "SceneFilter.h"
#include "SceneDatabase.h"
#include "ActionDatabase.h"
#include "ActorPropertiesDatabase.h"
#include "FurnitureDatabase.h"
#include "SceneSimilarity.h"
#include "StringUtils.h"
#include <algorithm>

namespace OStimNavigator {

    namespace {
        // Helper: get RE::Actor* for a given actor slot in a thread using the new API
        RE::Actor* GetActorFromThread(uint32_t threadID, int index) {
            if (index < 0)
                return nullptr;
            return OStimIntegration::GetSingleton().GetActorFromThread(threadID, static_cast<uint32_t>(index));
        }

        // Helper: Check if actor meets requirements
        bool ValidateRoleRequirements(
            const std::unordered_set<std::string>& requirements,
            RE::Actor* actor,
            ActorPropertiesDatabase& propsDB
        ) {
            if (requirements.empty() || !actor)
                return true;

            auto actorReqs = propsDB.GetActorRequirements(actor);
            for (const auto& req : requirements) {
                if (actorReqs.find(req) == actorReqs.end())
                    return false;
            }
            return true;
        }

        // Helper: Generic tag filtering with AND/OR logic
        template<typename Container>
        bool MatchesTagFilter(
            const Container& itemTags,
            const std::unordered_set<std::string>& selectedTags,
            bool useAND
        ) {
            if (useAND) {
                for (const auto& selectedTag : selectedTags) {
                    bool found = false;
                    for (const auto& tag : itemTags) {
                        if (tag == selectedTag) { found = true; break; }
                    }
                    if (!found) return false;
                }
                return true;
            } else {
                for (const auto& tag : itemTags) {
                    if (selectedTags.find(tag) != selectedTags.end())
                        return true;
                }
                return false;
            }
        }
    }

    SceneFilterResult SceneFilter::ApplyFilters(
        uint32_t threadID,
        SceneData* currentScene,
        const SceneFilterSettings& settings
    ) {
        SceneFilterResult result;

        auto& ostim      = OStimIntegration::GetSingleton();
        auto& sceneDB    = SceneDatabase::GetSingleton();
        auto& actionDB   = ActionDatabase::GetSingleton();
        auto& furnitureDB = FurnitureDatabase::GetSingleton();

        if (!sceneDB.IsLoaded())
            return result;

        auto* iface = ostim.GetThreadInterface();
        uint32_t threadActorCount = iface ? iface->GetActorCount(threadID) : 0;

        auto allScenes = sceneDB.GetAllScenes();

        // Get thread's furniture types by checking actor factions
        std::unordered_set<std::string> threadFurnitureTypes;
        if (furnitureDB.IsLoaded()) {
            if (RE::Actor* actor = GetActorFromThread(threadID, 0)) {
                threadFurnitureTypes = furnitureDB.GetFurnitureTypesFromActor(actor);
            }
        }

        for (auto* scene : allScenes) {
            if (!scene) continue;

            // Filter by actor count (must match thread)
            if (scene->actorCount != threadActorCount)
                continue;

            // Furniture filtering using actor factions
            if (furnitureDB.IsLoaded()) {
                if (!furnitureDB.IsSceneCompatible(threadFurnitureTypes, scene->furnitureType))
                    continue;
            }

            // Hide transitions filter
            if (settings.hideTransitions && scene->isTransition)
                continue;

            // Hide non-random selection scenes
            if (settings.hideNonRandom && scene->noRandomSelection)
                continue;

            // Hide intro/idle scenes
            if (settings.hideIntroIdle) {
                bool hasIntroOrIdle = false;
                for (const auto& tag : scene->tags) {
                    std::string lowerTag = StringUtils::ToLowerCopy(tag);
                    if (lowerTag == "intro" || lowerTag == "idle") {
                        hasIntroOrIdle = true;
                        break;
                    }
                }
                if (hasIntroOrIdle) continue;
            }

            // Intended sex filter
            if (settings.useIntendedSex) {
                bool sexMismatch = false;
                for (uint32_t i = 0; i < scene->actorCount; ++i) {
                    if (i < scene->actors.size()) {
                        const auto& sceneActor = scene->actors[i];
                        std::string intendedSex = StringUtils::ToLowerCopy(sceneActor.intendedSex);

                        if (intendedSex == "male" || intendedSex == "female") {
                            if (RE::Actor* actor = GetActorFromThread(threadID, i)) {
                                auto sexValue = actor->GetActorBase()->GetSex();
                                bool isMale = (sexValue == RE::SEXES::kMale);

                                if ((intendedSex == "male" && !isMale) ||
                                    (intendedSex == "female" && isMale)) {
                                    sexMismatch = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (sexMismatch) continue;
            }

            // Actor requirements validation filter
            if (settings.validateRequirements && actionDB.IsLoaded()) {
                auto& propsDB = ActorPropertiesDatabase::GetSingleton();
                if (propsDB.IsLoaded()) {
                    bool requirementsMismatch = false;

                    for (const auto& sceneAction : scene->actions) {
                        const ActionData* actionData = actionDB.GetAction(sceneAction.type);
                        if (!actionData) continue;

                        if (RE::Actor* actor = GetActorFromThread(threadID, sceneAction.actor)) {
                            if (!ValidateRoleRequirements(actionData->actorRequirements, actor, propsDB)) {
                                requirementsMismatch = true; break;
                            }
                        }
                        if (RE::Actor* actor = GetActorFromThread(threadID, sceneAction.target)) {
                            if (!ValidateRoleRequirements(actionData->targetRequirements, actor, propsDB)) {
                                requirementsMismatch = true; break;
                            }
                        }
                        if (RE::Actor* actor = GetActorFromThread(threadID, sceneAction.performer)) {
                            if (!ValidateRoleRequirements(actionData->performerRequirements, actor, propsDB)) {
                                requirementsMismatch = true; break;
                            }
                        }
                        if (requirementsMismatch) break;
                    }
                    if (requirementsMismatch) continue;
                }
            }

            // Search filter (name or ID)
            if (settings.searchText && settings.searchText[0] != '\0') {
                std::string search    = StringUtils::ToLowerCopy(settings.searchText);
                std::string sceneName = StringUtils::ToLowerCopy(scene->name);
                std::string sceneID   = StringUtils::ToLowerCopy(scene->id);

                if (sceneName.find(search) == std::string::npos &&
                    sceneID.find(search) == std::string::npos)
                    continue;
            }

            // Modpack filter
            if (!settings.selectedModpacks.empty() &&
                settings.selectedModpacks.find(scene->modpack) == settings.selectedModpacks.end())
                continue;

            // Scene tags filter
            if (!settings.selectedSceneTags.empty()) {
                if (!MatchesTagFilter(scene->tags, settings.selectedSceneTags, settings.sceneTagsAND))
                    continue;
            }

            // Actor tags filter
            if (!settings.selectedActorTags.empty()) {
                bool matchFound = false;
                for (const auto& actor : scene->actors) {
                    if (MatchesTagFilter(actor.tags, settings.selectedActorTags, settings.actorTagsAND)) {
                        matchFound = true; break;
                    }
                }
                if (!matchFound) continue;
            }

            // Action filter
            if (!settings.selectedActions.empty()) {
                std::vector<std::string> actionTypes;
                for (const auto& action : scene->actions)
                    actionTypes.push_back(action.type);
                if (!MatchesTagFilter(actionTypes, settings.selectedActions, settings.actionsAND))
                    continue;
            }

            // Action tags filter
            if (!settings.selectedActionTags.empty()) {
                auto sceneActionTags = actionDB.GetTagsFromActions(scene->actions);

                if (settings.actionTagsAND) {
                    bool hasAllTags = true;
                    for (const auto& selectedTag : settings.selectedActionTags) {
                        if (sceneActionTags.find(selectedTag) == sceneActionTags.end()) {
                            hasAllTags = false; break;
                        }
                    }
                    if (!hasAllTags) continue;
                } else {
                    bool hasTag = false;
                    for (const auto& selectedTag : settings.selectedActionTags) {
                        if (sceneActionTags.find(selectedTag) != sceneActionTags.end()) {
                            hasTag = true; break;
                        }
                    }
                    if (!hasTag) continue;
                }
            }

            result.filteredScenes.push_back(scene);
        }

        // Calculate and cache similarity scores if we have a current scene
        if (currentScene) {
            for (auto* scene : result.filteredScenes) {
                float similarity = SceneSimilarity::CalculateSimilarityScore(currentScene, scene);
                result.similarityScores[scene] = similarity;
            }
        }

        // Sort by similarity score (descending), fallback to scene ID
        std::sort(result.filteredScenes.begin(), result.filteredScenes.end(),
            [&result](const SceneData* a, const SceneData* b) {
                if (!result.similarityScores.empty()) {
                    auto itA = result.similarityScores.find(const_cast<SceneData*>(a));
                    auto itB = result.similarityScores.find(const_cast<SceneData*>(b));
                    float simA = (itA != result.similarityScores.end()) ? itA->second : 0.0f;
                    float simB = (itB != result.similarityScores.end()) ? itB->second : 0.0f;
                    if (simA != simB) return simA > simB;
                }
                return a->id < b->id;
            });

        return result;
    }
}
