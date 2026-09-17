#include "PulloutSceneSearch.h"
#include "SceneDatabase.h"
#include "ActionDatabase.h"
#include "SceneSimilarity.h"
#include "OStimIntegration.h"
#include <algorithm>
#include <cctype>
#include <vector>
#include <unordered_set>
#include <cmath>

namespace OStimNavigator {

    static bool CaseInsensitiveEquals(const std::string& a, const std::string& b) {
        if (a.size() != b.size()) return false;
        for (size_t i = 0; i < a.size(); ++i) {
            if (std::tolower(static_cast<unsigned char>(a[i])) != std::tolower(static_cast<unsigned char>(b[i]))) {
                return false;
            }
        }
        return true;
    }

    int PulloutSceneSearch::GetPositionTier(const std::vector<std::string>& actorTags) {
        std::unordered_set<std::string> tags;
        tags.reserve(actorTags.size());
        for (const auto& tag : actorTags) {
            std::string lowerTag = tag;
            std::transform(lowerTag.begin(), lowerTag.end(), lowerTag.begin(),
                [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
            tags.insert(std::move(lowerTag));
        }

        // Tier 0: standing, suspended, handstanding
        if (tags.count("standing") || tags.count("suspended")) {
            return 0;
        }
        // Tier 1: bendover, allfours
        if (tags.count("bendover") || tags.count("allfours")) {
            return 1;
        }
        // Tier 2: sitting, kneeling, squatting
        if (tags.count("sitting") || tags.count("kneeling") || tags.count("squatting")) {
            return 2;
        }
        // Tier 3: lyingback, lyingside, lyingfront, sleeping, drowsy, onbottom
        if (tags.count("lyingback") || tags.count("lyingside") || tags.count("lyingfront")) {
            return 3;
        }

        // Default to Tier 2
        return 2;
    }

    std::string PulloutSceneSearch::FindPulloutScene(const std::string& currentSceneId, uint32_t threadId, int giverPos, int receiverPos) {
        if (currentSceneId.empty()) return "";

        auto* currentScene = SceneDatabase::GetSingleton().GetSceneByID(currentSceneId);
        if (!currentScene || currentScene->actors.empty()) return "";

        auto& actionDB = ActionDatabase::GetSingleton();

        // 1. If giver/receiver positions were not provided, infer them
        if (giverPos < 0 || receiverPos < 0) {
            std::vector<std::pair<int, int>> vaginalPairs;
            for (const auto& action : currentScene->actions) {
                if (action.type.empty()) continue;
                std::string resolvedType = actionDB.ResolveActionType(action.type);
                if (resolvedType == "vaginalsex" || actionDB.ActionHasTag(resolvedType, "vaginalsex") ||
                    actionDB.ActionHasTag(resolvedType, "intercourse")) {
                    if (action.actor >= 0 && action.target >= 0) {
                        vaginalPairs.emplace_back(action.actor, action.target);
                    }
                }
            }

            if (vaginalPairs.size() == 1) {
                giverPos = vaginalPairs[0].first;
                receiverPos = vaginalPairs[0].second;
            } else if (vaginalPairs.size() > 1) {
                auto* threadIF = OStimIntegration::GetSingleton().GetThreadInterface();
                if (threadIF && threadIF->IsThreadValid(threadId)) {
                    constexpr uint32_t kMaxActors = 8;
                    OstimNG_API::Thread::ActorData buffer[kMaxActors];
                    uint32_t count = threadIF->GetActors(threadId, buffer, kMaxActors);
                    float maxEx = -1.0f;
                    for (const auto& [g, r] : vaginalPairs) {
                        if (g >= 0 && static_cast<uint32_t>(g) < count) {
                            if (buffer[g].excitement > maxEx) {
                                maxEx = buffer[g].excitement;
                                giverPos = g;
                                receiverPos = r;
                            }
                        }
                    }
                }
                if (giverPos < 0) {
                    giverPos = vaginalPairs[0].first;
                    receiverPos = vaginalPairs[0].second;
                }
            }

            // If not directly identified from action roles, infer from intendedSex
            if (giverPos < 0 || giverPos >= static_cast<int>(currentScene->actors.size())) {
                for (size_t i = 0; i < currentScene->actors.size(); ++i) {
                    if (CaseInsensitiveEquals(currentScene->actors[i].intendedSex, "male")) {
                        giverPos = static_cast<int>(i);
                        break;
                    }
                }
            }
            if (giverPos < 0) giverPos = 0;

            if (receiverPos < 0 || receiverPos >= static_cast<int>(currentScene->actors.size()) || receiverPos == giverPos) {
                for (size_t i = 0; i < currentScene->actors.size(); ++i) {
                    if (static_cast<int>(i) != giverPos) {
                        receiverPos = static_cast<int>(i);
                        break;
                    }
                }
            }
            if (receiverPos < 0) receiverPos = 0;
        }

        // Validate bounds
        if (giverPos >= static_cast<int>(currentScene->actors.size())) giverPos = 0;
        if (receiverPos >= static_cast<int>(currentScene->actors.size())) receiverPos = (currentScene->actors.size() > 1) ? 1 : 0;

        int currentGiverTier = GetPositionTier(currentScene->actors[giverPos].tags);
        int currentReceiverTier = GetPositionTier(currentScene->actors[receiverPos].tags);

        // Helper: Slot sex compatibility
        auto IsSexCompatible = [&](const SceneData* cand) -> bool {
            for (size_t i = 0; i < currentScene->actors.size(); ++i) {
                const auto& curSex = currentScene->actors[i].intendedSex;
                const auto& candSex = cand->actors[i].intendedSex;
                bool curSpecific = (CaseInsensitiveEquals(curSex, "male") || CaseInsensitiveEquals(curSex, "female"));
                bool candSpecific = (CaseInsensitiveEquals(candSex, "male") || CaseInsensitiveEquals(candSex, "female"));
                if (curSpecific && candSpecific) {
                    if (!CaseInsensitiveEquals(curSex, candSex)) {
                        return false;
                    }
                }
            }
            return true;
        };

        // Helper: STRICT zero intercourse
        auto HasIntercourse = [&](const SceneData* cand) -> bool {
            for (const auto& action : cand->actions) {
                if (action.type.empty()) continue;
                std::string resolvedType = actionDB.ResolveActionType(action.type);
                if (CaseInsensitiveEquals(resolvedType, "vaginalsex") ||
                    CaseInsensitiveEquals(resolvedType, "analsex") ||
                    CaseInsensitiveEquals(resolvedType, "tribbing") ||
                    actionDB.ActionHasTag(resolvedType, "intercourse") ||
                    actionDB.ActionHasTag(resolvedType, "vaginalsex")) {
                    return true;
                }
            }
            return false;
        };

        // Helper: Hard filters
        auto PassesHardFilters = [&](const SceneData* cand) -> bool {
            if (!cand) return false;
            if (cand->id == currentScene->id) return false;
            if (cand->isTransition) return false;
            if (cand->noRandomSelection) return false;

            if (cand->actorCount != currentScene->actorCount ||
                cand->actors.size() != currentScene->actors.size()) {
                return false;
            }

            // Strict furniture match (both empty = match)
            if (cand->furnitureType != currentScene->furnitureType) {
                return false;
            }

            if (!IsSexCompatible(cand)) {
                return false;
            }

            if (HasIntercourse(cand)) {
                return false;
            }

            return true;
        };

        // Helper: Action Tier classification (0=A, 1=B, 2=C, 3=D, -1=none)
        auto GetCandidateActionTier = [&](const SceneData* cand) -> int {
            int bestTier = 999;
            for (const auto& action : cand->actions) {
                if (action.type.empty()) continue;
                std::string resolvedType = actionDB.ResolveActionType(action.type);

                // Tier A: malemasturbation (actor=receiverPos), handjob (target=giverPos), blowjob (target=giverPos)
                if (CaseInsensitiveEquals(resolvedType, "malemasturbation")) {
                    if (action.actor == receiverPos || action.actor == -1) {
                        bestTier = std::min(bestTier, 0);
                    }
                } else if (CaseInsensitiveEquals(resolvedType, "handjob") || CaseInsensitiveEquals(resolvedType, "blowjob")) {
                    if (action.target == giverPos || action.target == -1) {
                        bestTier = std::min(bestTier, 0);
                    }
                }
                // Tier B: boobjob, footjob (target=giverPos)
                else if (CaseInsensitiveEquals(resolvedType, "boobjob") || CaseInsensitiveEquals(resolvedType, "footjob") || CaseInsensitiveEquals(resolvedType, "grindingpenis")) {
                    if (action.target == giverPos || action.target == -1) {
                        bestTier = std::min(bestTier, 1);
                    }
                }
                // Tier C: buttjob, thighjob (target=giverPos)
                else if (CaseInsensitiveEquals(resolvedType, "buttjob") || CaseInsensitiveEquals(resolvedType, "thighjob")) {
                    if (action.target == giverPos || action.target == -1) {
                        bestTier = std::min(bestTier, 2);
                    }
                }
                // Tier D: any non-penetrative stimulation on giver
                else if (actionDB.ActionHasTag(resolvedType, "sexual") || actionDB.ActionHasTag(resolvedType, "sensual") || actionDB.ActionHasTag(resolvedType, "penilestimulation")) {
                    if (action.target == giverPos || action.actor == giverPos || (action.target == -1 && action.actor == -1)) {
                        bestTier = std::min(bestTier, 3);
                    }
                }
            }
            return (bestTier <= 3) ? bestTier : -1;
        };

        const auto allScenes = SceneDatabase::GetSingleton().GetAllScenes();
        SceneData* bestCandidate = nullptr;
        int bestPriority = 999999;
        int bestGiverDist = 999999;

        // Pass 1: Tiered Cascade
        for (auto* candidate : allScenes) {
            if (!PassesHardFilters(candidate)) continue;

            int actionTier = GetCandidateActionTier(candidate);
            if (actionTier < 0) continue;

            int candGiverTier = GetPositionTier(candidate->actors[giverPos].tags);
            int candReceiverTier = GetPositionTier(candidate->actors[receiverPos].tags);

            int giverDist = std::abs(currentGiverTier - candGiverTier);
            int receiverDist = std::abs(currentReceiverTier - candReceiverTier);
            int posDistance = giverDist + receiverDist;

            int priority = (posDistance * 2) + actionTier;

            bool isBetter = false;
            if (!bestCandidate) {
                isBetter = true;
            } else if (priority < bestPriority) {
                isBetter = true;
            } else if (priority == bestPriority && giverDist < bestGiverDist) {
                isBetter = true;
            }

            if (isBetter) {
                bestCandidate = candidate;
                bestPriority = priority;
                bestGiverDist = giverDist;
            }
        }

        // Pass 2: Last-resort fallback pass
        if (!bestCandidate) {
            SKSE::log::info("PulloutSceneSearch: no candidate found in tiered cascade for '{}', running fallback pass", currentSceneId);
            int bestFallbackPosDist = 999999;
            for (auto* candidate : allScenes) {
                if (!PassesHardFilters(candidate)) continue;

                int candGiverTier = GetPositionTier(candidate->actors[giverPos].tags);
                int candReceiverTier = GetPositionTier(candidate->actors[receiverPos].tags);
                int posDistance = std::abs(currentGiverTier - candGiverTier) + std::abs(currentReceiverTier - candReceiverTier);

                if (!bestCandidate || posDistance < bestFallbackPosDist) {
                    bestCandidate = candidate;
                    bestFallbackPosDist = posDistance;
                }
            }
        }

        if (bestCandidate) {
            SKSE::log::info("PulloutSceneSearch: selected '{}' for current scene '{}' (giverPos={}, receiverPos={})",
                bestCandidate->id, currentSceneId, giverPos, receiverPos);
            return bestCandidate->id;
        }

        SKSE::log::warn("PulloutSceneSearch: no pullout scene found for '{}'", currentSceneId);
        return "";
    }

} // namespace OStimNavigator
