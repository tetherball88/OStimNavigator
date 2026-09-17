#pragma once

#include "PCH.h"
#include <string>
#include <cstdint>
#include <vector>

namespace OStimNavigator {

    class PulloutSceneSearch {
    public:
        /**
         * Finds the best matching pullout scene ID for currentSceneId, or empty string if not found.
         *
         * Algorithm v2:
         * 1. Same actor count and slot-compatible intended sexes.
         * 2. Excludes transitions and scenes with noRandomSelection.
         * 3. STRICT: Zero vaginalsex / analsex / tribbing / penetrative intercourse actions.
         * 4. Strict furniture match: candidate furniture must match current scene furniture.
         * 5. Action tiers (A: malemasturbation/handjob/blowjob, B: boobjob/footjob, C: buttjob/thighjob, D: other stimulation).
         * 6. Position tiers (0: standing, 1: bendover/allfours, 2: sitting/kneeling/squatting, 3: lying).
         * 7. Combined priority = (pos_distance * 2) + action_tier. Lower wins.
         * 8. Last-resort fallback pass if no tiered candidate matches.
         */
        static std::string FindPulloutScene(const std::string& currentSceneId, uint32_t threadId, int giverPos = -1, int receiverPos = -1);

        /**
         * Resolves the position tier (0-3) for a given set of actor tags.
         * Tier 0: standing, suspended, handstanding
         * Tier 1: bendover, allfours
         * Tier 2: sitting, kneeling, squatting
         * Tier 3: lyingback, lyingside, lyingfront, sleeping, drowsy, onbottom
         */
        static int GetPositionTier(const std::vector<std::string>& actorTags);
    };

} // namespace OStimNavigator
