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
        struct SetupCacheEntry {
            std::vector<SceneData*> compatibleScenes;
            std::string positionsJson = "[]";
            std::string allActionsJson = "[]";
            std::string foreplayActionsJson = "[]";
            std::string oralActionsJson = "[]";
            std::string sexActionsJson = "[]";
            std::unordered_set<std::string> allActionsSet;
            std::unordered_map<std::string, std::string> actionsByTagJson;
        };

        struct ThreadCacheState {
            std::vector<RE::FormID> actorFormIDs;
            std::unordered_set<std::string> furnitureTypes;
            bool useIntendedSex = true;
            bool validateRequirements = true;
            std::string setupKey;
        };

        // Level 1: Per-thread state cache (threadID -> ThreadCacheState)
        static std::unordered_map<uint32_t, ThreadCacheState> s_threadCache;

        // Level 2: Setup signature cache across threads (setupKey -> SetupCacheEntry)
        static std::unordered_map<std::string, SetupCacheEntry> s_setupCache;

        static const std::string kEmptyJsonArray = "[]";

        // Helper: Check if pre-fetched actor requirements meet action role requirements
        bool ValidateRoleRequirements(
            const std::unordered_set<std::string>& required,
            const std::unordered_set<std::string>& actorReqs,
            bool hasActor
        ) {
            if (required.empty() || !hasActor)
                return true;

            for (const auto& req : required) {
                if (actorReqs.find(req) == actorReqs.end())
                    return false;
            }
            return true;
        }

        // Helper: Format sorted vector of strings as JSON array
        std::string VectorToJsonArray(const std::vector<std::string>& items) {
            std::string json = "[";
            for (size_t i = 0; i < items.size(); ++i) {
                if (i > 0) json += ",";
                json += "\"" + items[i] + "\"";
            }
            json += "]";
            return json;
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

        // Builds or retrieves a SetupCacheEntry for a given vector of actors + furnitureTypes + MCM flags.
        SetupCacheEntry* GetOrBuildSetupCacheFromActors(
            std::vector<RE::Actor*> actors,
            const std::unordered_set<std::string>& threadFurnitureTypes,
            bool useIntendedSex,
            bool validateRequirements,
            bool sortActorsForOStim,
            std::string* outSetupKey = nullptr
        ) {
            auto& sceneDB = SceneDatabase::GetSingleton();
            auto& actionDB = ActionDatabase::GetSingleton();
            auto& furnitureDB = FurnitureDatabase::GetSingleton();
            auto& propsDB = ActorPropertiesDatabase::GetSingleton();

            if (!sceneDB.IsLoaded())
                return nullptr;

            uint32_t actorCount = static_cast<uint32_t>(actors.size());
            if (actorCount == 0)
                return nullptr;

            if (validateRequirements && propsDB.IsLoaded()) {
                propsDB.ClearCache();
            }

            struct SlotInfo {
                RE::Actor* actor = nullptr;
                bool isMale = false;
                bool hasPenis = false;
                std::unordered_set<std::string> reqs;
            };
            std::vector<SlotInfo> slots(actorCount);

            for (uint32_t i = 0; i < actorCount; ++i) {
                slots[i].actor = actors[i];
                if (RE::Actor* actor = actors[i]) {
                    if (auto* base = actor->GetActorBase()) {
                        slots[i].isMale = (base->GetSex() == RE::SEXES::kMale);
                    }
                    if (propsDB.IsLoaded()) {
                        slots[i].reqs = propsDB.GetActorRequirements(actor);
                        slots[i].hasPenis = (slots[i].reqs.find("penis") != slots[i].reqs.end());
                    } else {
                        slots[i].hasPenis = slots[i].isMale;
                    }
                }
            }

            // When called pre-start (before OActorUtil.Sort has run), sort actors into OStim's slot order:
            // males first, then non-male schlongified/strap-on actors (when !useIntendedSex), then females.
            if (sortActorsForOStim && actorCount > 1) {
                std::stable_sort(slots.begin(), slots.end(),
                    [useIntendedSex](const SlotInfo& a, const SlotInfo& b) {
                        int rankA = a.isMale ? 0 : ((!useIntendedSex && a.hasPenis) ? 1 : 2);
                        int rankB = b.isMale ? 0 : ((!useIntendedSex && b.hasPenis) ? 1 : 2);
                        return rankA < rankB;
                    });
            }

            // Build deterministic setup signature key for Level 2 cache
            std::string setupKey = std::to_string(actorCount) + "|" +
                                   (useIntendedSex ? "1" : "0") + "|" +
                                   (validateRequirements ? "1" : "0") + "|";
            {
                auto sortedFurn = StringUtils::SetToSortedVector(threadFurnitureTypes);
                for (size_t i = 0; i < sortedFurn.size(); ++i) {
                    if (i > 0) setupKey += ",";
                    setupKey += sortedFurn[i];
                }
            }
            for (uint32_t i = 0; i < actorCount; ++i) {
                setupKey += "|";
                if (!slots[i].actor) {
                    setupKey += "null";
                } else {
                    setupKey += (slots[i].isMale ? "M:" : "F:");
                    if (validateRequirements) {
                        auto sortedReqs = StringUtils::SetToSortedVector(slots[i].reqs);
                        for (size_t r = 0; r < sortedReqs.size(); ++r) {
                            if (r > 0) setupKey += ",";
                            setupKey += sortedReqs[r];
                        }
                    }
                }
            }

            if (outSetupKey) {
                *outSetupKey = setupKey;
            }

            // Level 2 cache check: has this exact setup already been computed?
            auto setupIt = s_setupCache.find(setupKey);
            if (setupIt != s_setupCache.end()) {
                return &setupIt->second;
            }

            // Level 2 miss: filter only scenes matching actorCount and prebuild JSON caches in one pass
            SetupCacheEntry newEntry;
            const auto& candidateScenes = sceneDB.GetScenesByActorCount(actorCount);
            newEntry.compatibleScenes.reserve(candidateScenes.size());

            std::unordered_set<std::string> allPositionsSet;
            std::unordered_set<std::string> sexPositionsSet;
            std::unordered_set<std::string> foreplayActionsSet;
            std::unordered_set<std::string> oralActionsSet;
            std::unordered_set<std::string> sexActionsSet;

            const bool checkFurniture = furnitureDB.IsLoaded();
            const bool checkReqs = validateRequirements && actionDB.IsLoaded() && propsDB.IsLoaded();

            for (auto* scene : candidateScenes) {
                if (!scene) continue;
                if (scene->isTransition || scene->noRandomSelection || scene->isIntroOrIdle)
                    continue;

                if (checkFurniture && !furnitureDB.IsSceneCompatible(threadFurnitureTypes, scene->furnitureType))
                    continue;

                if (useIntendedSex) {
                    bool sexMismatch = false;
                    for (uint32_t i = 0; i < actorCount && i < scene->actors.size(); ++i) {
                        const auto& intendedSex = scene->actors[i].intendedSex;
                        if (slots[i].actor) {
                            if ((intendedSex == "male" && !slots[i].isMale) ||
                                (intendedSex == "female" && slots[i].isMale)) {
                                sexMismatch = true;
                                break;
                            }
                        }
                    }
                    if (sexMismatch) continue;
                }

                if (checkReqs) {
                    bool requirementsMismatch = false;
                    for (const auto& sceneAction : scene->actions) {
                        const ActionData* actionData = actionDB.GetAction(sceneAction.type);
                        if (!actionData) continue;

                        int actorIdx = sceneAction.actor;
                        int targetIdx = (sceneAction.target >= 0) ? sceneAction.target : sceneAction.actor;
                        int performerIdx = (sceneAction.performer >= 0) ? sceneAction.performer : sceneAction.actor;

                        if (actorIdx >= 0 && static_cast<uint32_t>(actorIdx) < actorCount) {
                            if (!ValidateRoleRequirements(actionData->actorRequirements, slots[actorIdx].reqs, slots[actorIdx].actor != nullptr)) {
                                requirementsMismatch = true; break;
                            }
                        }
                        if (targetIdx >= 0 && static_cast<uint32_t>(targetIdx) < actorCount) {
                            if (!ValidateRoleRequirements(actionData->targetRequirements, slots[targetIdx].reqs, slots[targetIdx].actor != nullptr)) {
                                requirementsMismatch = true; break;
                            }
                        }
                        if (performerIdx >= 0 && static_cast<uint32_t>(performerIdx) < actorCount) {
                            if (!ValidateRoleRequirements(actionData->performerRequirements, slots[performerIdx].reqs, slots[performerIdx].actor != nullptr)) {
                                requirementsMismatch = true; break;
                            }
                        }
                    }
                    if (requirementsMismatch) continue;
                }

                newEntry.compatibleScenes.push_back(scene);

                for (const auto& pos : scene->positions) {
                    allPositionsSet.insert(pos);
                    if (scene->phaseRank == 3) {
                        sexPositionsSet.insert(pos);
                    }
                }

                for (const auto& action : scene->actions) {
                    if (action.type.empty()) continue;
                    newEntry.allActionsSet.insert(action.type);

                    if (scene->phaseRank == 1 && action.phaseRank == 1) {
                        foreplayActionsSet.insert(action.type);
                    } else if (scene->phaseRank == 2 && action.phaseRank == 2) {
                        oralActionsSet.insert(action.type);
                    } else if (scene->phaseRank == 3 && action.phaseRank == 3) {
                        sexActionsSet.insert(action.type);
                    }
                }
            }

            std::sort(newEntry.compatibleScenes.begin(), newEntry.compatibleScenes.end(),
                [](const SceneData* a, const SceneData* b) { return a->id < b->id; });

            const auto& finalPositions = !sexPositionsSet.empty() ? sexPositionsSet : allPositionsSet;
            newEntry.positionsJson       = VectorToJsonArray(StringUtils::SetToSortedVector(finalPositions));
            newEntry.allActionsJson      = VectorToJsonArray(StringUtils::SetToSortedVector(newEntry.allActionsSet));
            newEntry.foreplayActionsJson = VectorToJsonArray(StringUtils::SetToSortedVector(foreplayActionsSet));
            newEntry.oralActionsJson     = VectorToJsonArray(StringUtils::SetToSortedVector(oralActionsSet));
            newEntry.sexActionsJson      = VectorToJsonArray(StringUtils::SetToSortedVector(sexActionsSet));

            auto [insertedIt, _] = s_setupCache.emplace(std::move(setupKey), std::move(newEntry));
            return &insertedIt->second;
        }

        // Resolves or builds the SetupCacheEntry for an active thread using the two-level cache.
        SetupCacheEntry* GetOrBuildSetupCache(uint32_t threadID, bool useIntendedSex, bool validateRequirements) {
            auto& ostim = OStimIntegration::GetSingleton();
            auto& sceneDB = SceneDatabase::GetSingleton();
            auto& furnitureDB = FurnitureDatabase::GetSingleton();

            if (!sceneDB.IsLoaded())
                return nullptr;

            auto* iface = ostim.GetThreadInterface();
            if (!iface || !iface->IsThreadValid(threadID))
                return nullptr;

            // Fetch all thread actors in a single API call
            std::vector<RE::Actor*> threadActors = ostim.GetActorsFromThread(threadID);
            uint32_t actorCount = static_cast<uint32_t>(threadActors.size());
            if (actorCount == 0)
                return nullptr;

            std::vector<RE::FormID> actorFormIDs(actorCount, 0);
            for (uint32_t i = 0; i < actorCount; ++i) {
                if (threadActors[i]) {
                    actorFormIDs[i] = threadActors[i]->GetFormID();
                }
            }

            std::unordered_set<std::string> threadFurnitureTypes;
            if (furnitureDB.IsLoaded() && threadActors[0]) {
                threadFurnitureTypes = furnitureDB.GetFurnitureTypesFromActor(threadActors[0]);
            }

            // Level 1 cache check: same threadID, same actors, same furniture, same MCM flags
            auto threadIt = s_threadCache.find(threadID);
            if (threadIt != s_threadCache.end()) {
                const auto& cached = threadIt->second;
                if (cached.actorFormIDs == actorFormIDs &&
                    cached.furnitureTypes == threadFurnitureTypes &&
                    cached.useIntendedSex == useIntendedSex &&
                    cached.validateRequirements == validateRequirements) {
                    auto setupIt = s_setupCache.find(cached.setupKey);
                    if (setupIt != s_setupCache.end()) {
                        return &setupIt->second;
                    }
                }
            }

            std::string setupKey;
            SetupCacheEntry* entry = GetOrBuildSetupCacheFromActors(
                threadActors, threadFurnitureTypes, useIntendedSex, validateRequirements,
                /*sortActorsForOStim=*/false, &setupKey);

            if (entry) {
                ThreadCacheState state;
                state.actorFormIDs = std::move(actorFormIDs);
                state.furnitureTypes = std::move(threadFurnitureTypes);
                state.useIntendedSex = useIntendedSex;
                state.validateRequirements = validateRequirements;
                state.setupKey = std::move(setupKey);
                s_threadCache[threadID] = std::move(state);
            }
            return entry;
        }

        const std::string& SelectActionsJsonFromEntry(SetupCacheEntry* entry, const char* phaseOrTag) {
            if (!entry) return kEmptyJsonArray;
            if (!phaseOrTag || phaseOrTag[0] == '\0') {
                return entry->allActionsJson;
            }

            std::string key = StringUtils::ToLowerCopy(phaseOrTag);
            if (key == "foreplay") {
                return entry->foreplayActionsJson;
            }
            if (key == "oral") {
                return entry->oralActionsJson;
            }
            if (key == "sex" || key == "intercourse") {
                return entry->sexActionsJson;
            }

            auto it = entry->actionsByTagJson.find(key);
            if (it != entry->actionsByTagJson.end()) {
                return it->second;
            }

            auto withTag = ActionDatabase::GetSingleton().GetActionsWithTag(key);
            std::unordered_set<std::string> matching;
            for (const auto& actionType : entry->allActionsSet) {
                if (withTag.count(actionType)) {
                    matching.insert(actionType);
                }
            }
            std::string json = VectorToJsonArray(StringUtils::SetToSortedVector(matching));
            auto [insertedIt, _] = entry->actionsByTagJson.emplace(std::move(key), std::move(json));
            return insertedIt->second;
        }
    }

    void SceneFilter::InvalidateCache() {
        s_threadCache.clear();
        s_setupCache.clear();
    }

    SceneFilterSettings SceneFilter::GetThreadDefaultSettings() {
        SceneFilterSettings settings;
        settings.hideTransitions = true;
        settings.hideNonRandom = true;
        settings.hideIntroIdle = true;

        if (auto* iface = OStimIntegration::GetSingleton().GetThreadInterface()) {
            if (iface->IsUnrestrictedNavigation()) {
                settings.useIntendedSex = false;
                settings.validateRequirements = false;
            } else {
                settings.useIntendedSex = iface->IsIntendedSexOnly();
                settings.validateRequirements = true;
            }
        } else {
            settings.useIntendedSex = true;
            settings.validateRequirements = true;
        }
        return settings;
    }

    const std::string& SceneFilter::GetThreadPositionsJson(uint32_t threadID) {
        auto settings = GetThreadDefaultSettings();
        if (auto* entry = GetOrBuildSetupCache(threadID, settings.useIntendedSex, settings.validateRequirements)) {
            return entry->positionsJson;
        }
        return kEmptyJsonArray;
    }

    const std::string& SceneFilter::GetThreadActionsJson(uint32_t threadID, const char* tag) {
        auto settings = GetThreadDefaultSettings();
        auto* entry = GetOrBuildSetupCache(threadID, settings.useIntendedSex, settings.validateRequirements);
        return SelectActionsJsonFromEntry(entry, tag);
    }

    const std::string& SceneFilter::GetSetupPositionsJson(
        const uint32_t* actorFormIDs,
        uint32_t actorCount,
        const char* furnitureType
    ) {
        if (!actorFormIDs || actorCount == 0) {
            return kEmptyJsonArray;
        }
        std::vector<RE::Actor*> actors;
        actors.reserve(actorCount);
        for (uint32_t i = 0; i < actorCount; ++i) {
            if (actorFormIDs[i] != 0) {
                if (auto* a = RE::TESForm::LookupByID<RE::Actor>(actorFormIDs[i])) {
                    actors.push_back(a);
                }
            }
        }
        if (actors.empty()) {
            return kEmptyJsonArray;
        }

        auto settings = GetThreadDefaultSettings();
        auto& furnitureDB = FurnitureDatabase::GetSingleton();
        std::unordered_set<std::string> furnitureTypes = furnitureDB.IsLoaded()
            ? furnitureDB.GetFurnitureTypesFromID(furnitureType ? furnitureType : "")
            : std::unordered_set<std::string>{};

        if (auto* entry = GetOrBuildSetupCacheFromActors(
                actors, furnitureTypes, settings.useIntendedSex, settings.validateRequirements,
                /*sortActorsForOStim=*/true)) {
            return entry->positionsJson;
        }
        return kEmptyJsonArray;
    }

    const std::string& SceneFilter::GetSetupActionsJson(
        const uint32_t* actorFormIDs,
        uint32_t actorCount,
        const char* furnitureType,
        const char* phaseOrTag
    ) {
        if (!actorFormIDs || actorCount == 0) {
            return kEmptyJsonArray;
        }
        std::vector<RE::Actor*> actors;
        actors.reserve(actorCount);
        for (uint32_t i = 0; i < actorCount; ++i) {
            if (actorFormIDs[i] != 0) {
                if (auto* a = RE::TESForm::LookupByID<RE::Actor>(actorFormIDs[i])) {
                    actors.push_back(a);
                }
            }
        }
        if (actors.empty()) {
            return kEmptyJsonArray;
        }

        auto settings = GetThreadDefaultSettings();
        auto& furnitureDB = FurnitureDatabase::GetSingleton();
        std::unordered_set<std::string> furnitureTypes = furnitureDB.IsLoaded()
            ? furnitureDB.GetFurnitureTypesFromID(furnitureType ? furnitureType : "")
            : std::unordered_set<std::string>{};

        auto* entry = GetOrBuildSetupCacheFromActors(
            actors, furnitureTypes, settings.useIntendedSex, settings.validateRequirements,
            /*sortActorsForOStim=*/true);
        return SelectActionsJsonFromEntry(entry, phaseOrTag);
    }

    SceneFilterResult SceneFilter::ApplyFilters(
        uint32_t threadID,
        SceneData* currentScene,
        const SceneFilterSettings& settings
    ) {
        SceneFilterResult result;

        auto& ostim       = OStimIntegration::GetSingleton();
        auto& sceneDB     = SceneDatabase::GetSingleton();
        auto& actionDB    = ActionDatabase::GetSingleton();
        auto& furnitureDB = FurnitureDatabase::GetSingleton();

        if (!sceneDB.IsLoaded())
            return result;

        const bool hasUiFilters =
            (settings.searchText && settings.searchText[0] != '\0') ||
            !settings.selectedModpacks.empty() ||
            !settings.selectedSceneTags.empty() ||
            !settings.selectedActorTags.empty() ||
            !settings.selectedActions.empty() ||
            !settings.selectedActionTags.empty();

        // Fast path: when standard compatibility filters are active, reuse the cached compatibleScenes list!
        const std::vector<SceneData*>* baseCandidates = nullptr;
        const bool standardCompatFlags = settings.hideTransitions && settings.hideNonRandom && settings.hideIntroIdle;
        if (standardCompatFlags) {
            if (auto* cachedSetup = GetOrBuildSetupCache(threadID, settings.useIntendedSex, settings.validateRequirements)) {
                if (!hasUiFilters) {
                    result.filteredScenes = cachedSetup->compatibleScenes;
                } else {
                    baseCandidates = &cachedSetup->compatibleScenes;
                }
            }
        }

        // If we need to apply UI filters on top of cached compatibleScenes, or if custom compatibility flags are used in UI:
        if (baseCandidates || !standardCompatFlags) {
            std::string lowerSearch = (settings.searchText && settings.searchText[0] != '\0')
                ? StringUtils::ToLowerCopy(settings.searchText)
                : "";

            // Only needed when !standardCompatFlags (user unchecked hideTransitions/hideNonRandom/hideIntroIdle in UI)
            std::vector<RE::Actor*> threadActors;
            std::vector<bool> actorIsMale;
            std::vector<std::unordered_set<std::string>> actorReqs;
            std::unordered_set<std::string> threadFurnitureTypes;
            uint32_t threadActorCount = 0;

            if (!baseCandidates) {
                threadActors = ostim.GetActorsFromThread(threadID);
                threadActorCount = static_cast<uint32_t>(threadActors.size());
                actorIsMale.resize(threadActorCount, false);
                actorReqs.resize(threadActorCount);

                auto& propsDB = ActorPropertiesDatabase::GetSingleton();
                if (settings.validateRequirements && propsDB.IsLoaded()) {
                    propsDB.ClearCache();
                }
                for (uint32_t i = 0; i < threadActorCount; ++i) {
                    if (RE::Actor* actor = threadActors[i]) {
                        if (auto* base = actor->GetActorBase()) {
                            actorIsMale[i] = (base->GetSex() == RE::SEXES::kMale);
                        }
                        if (settings.validateRequirements && propsDB.IsLoaded()) {
                            actorReqs[i] = propsDB.GetActorRequirements(actor);
                        }
                    }
                }
                if (furnitureDB.IsLoaded() && !threadActors.empty() && threadActors[0]) {
                    threadFurnitureTypes = furnitureDB.GetFurnitureTypesFromActor(threadActors[0]);
                }
                baseCandidates = &sceneDB.GetScenesByActorCount(threadActorCount);
            }

            const bool checkFurniture = !standardCompatFlags && furnitureDB.IsLoaded();
            const bool checkReqs = !standardCompatFlags && settings.validateRequirements &&
                                   actionDB.IsLoaded() && ActorPropertiesDatabase::GetSingleton().IsLoaded();

            for (auto* scene : *baseCandidates) {
                if (!scene) continue;

                if (!standardCompatFlags) {
                    if (checkFurniture && !furnitureDB.IsSceneCompatible(threadFurnitureTypes, scene->furnitureType))
                        continue;
                    if (settings.hideTransitions && scene->isTransition)
                        continue;
                    if (settings.hideNonRandom && scene->noRandomSelection)
                        continue;
                    if (settings.hideIntroIdle && scene->isIntroOrIdle)
                        continue;

                    if (settings.useIntendedSex) {
                        bool sexMismatch = false;
                        for (uint32_t i = 0; i < threadActorCount && i < scene->actors.size(); ++i) {
                            const auto& intendedSex = scene->actors[i].intendedSex;
                            if (threadActors[i]) {
                                if ((intendedSex == "male" && !actorIsMale[i]) ||
                                    (intendedSex == "female" && actorIsMale[i])) {
                                    sexMismatch = true;
                                    break;
                                }
                            }
                        }
                        if (sexMismatch) continue;
                    }

                    if (checkReqs) {
                        bool requirementsMismatch = false;
                        for (const auto& sceneAction : scene->actions) {
                            const ActionData* actionData = actionDB.GetAction(sceneAction.type);
                            if (!actionData) continue;

                            int actorIdx = sceneAction.actor;
                            int targetIdx = (sceneAction.target >= 0) ? sceneAction.target : sceneAction.actor;
                            int performerIdx = (sceneAction.performer >= 0) ? sceneAction.performer : sceneAction.actor;

                            if (actorIdx >= 0 && static_cast<uint32_t>(actorIdx) < threadActorCount) {
                                if (!ValidateRoleRequirements(actionData->actorRequirements, actorReqs[actorIdx], threadActors[actorIdx] != nullptr)) {
                                    requirementsMismatch = true; break;
                                }
                            }
                            if (targetIdx >= 0 && static_cast<uint32_t>(targetIdx) < threadActorCount) {
                                if (!ValidateRoleRequirements(actionData->targetRequirements, actorReqs[targetIdx], threadActors[targetIdx] != nullptr)) {
                                    requirementsMismatch = true; break;
                                }
                            }
                            if (performerIdx >= 0 && static_cast<uint32_t>(performerIdx) < threadActorCount) {
                                if (!ValidateRoleRequirements(actionData->performerRequirements, actorReqs[performerIdx], threadActors[performerIdx] != nullptr)) {
                                    requirementsMismatch = true; break;
                                }
                            }
                        }
                        if (requirementsMismatch) continue;
                    }
                }

                // Search filter (name or ID)
                if (!lowerSearch.empty()) {
                    std::string sceneName = StringUtils::ToLowerCopy(scene->name);
                    if (sceneName.find(lowerSearch) == std::string::npos &&
                        scene->id.find(lowerSearch) == std::string::npos)
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
                    actionTypes.reserve(scene->actions.size());
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
        }

        // Calculate and cache similarity scores if we have a current scene
        if (currentScene) {
            for (auto* scene : result.filteredScenes) {
                float similarity = SceneSimilarity::CalculateSimilarityScore(currentScene, scene);
                result.similarityScores[scene] = similarity;
            }

            // Sort by similarity score (descending), fallback to scene ID
            std::sort(result.filteredScenes.begin(), result.filteredScenes.end(),
                [&result](const SceneData* a, const SceneData* b) {
                    auto itA = result.similarityScores.find(const_cast<SceneData*>(a));
                    auto itB = result.similarityScores.find(const_cast<SceneData*>(b));
                    float simA = (itA != result.similarityScores.end()) ? itA->second : 0.0f;
                    float simB = (itB != result.similarityScores.end()) ? itB->second : 0.0f;
                    if (simA != simB) return simA > simB;
                    return a->id < b->id;
                });
        } else if (!standardCompatFlags || hasUiFilters) {
            std::sort(result.filteredScenes.begin(), result.filteredScenes.end(),
                [](const SceneData* a, const SceneData* b) {
                    return a->id < b->id;
                });
        }

        return result;
    }
}
