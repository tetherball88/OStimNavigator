#include "SceneDescriptionBuilder.h"
#include "SceneDescriptionData.h"
#include "ActionDatabase.h"
#include "FurnitureDatabase.h"
#include "FormUtils.h"
#include "OStimIntegration.h"
#include "OStimNetMetaData.h"
#include <sstream>
#include <algorithm>

namespace OStimNavigator {

namespace {

// ─── Actor template reference ──────────────────────────────────────────────

std::string ActorRef(int idx) {
    return "{{scenedata.actors." + std::to_string(idx) + "}}";
}

// ─── Actor position-tag → readable label ──────────────────────────────────
// Defined in SceneDescriptionData.h

// ─── Action type → verb phrase / self / two-sided / body part tables ─────────
// Defined in SceneDescriptionData.h

// Pick the most descriptive body part from a requirements set
std::string FirstBodyPart(const std::unordered_set<std::string>& reqs) {
    for (const auto& p : kBodyPartPriority) {
        if (reqs.count(p)) {
            return kBodyPartLabels.at(p);
        }
    }
    // Fallback: any labelled part
    for (const auto& r : reqs) {
        auto it = kBodyPartLabels.find(r);
        if (it != kBodyPartLabels.end()) return it->second;
    }
    return "";
}

// ─── Schlongified faction check ──────────────────────────────────────────────
// Returns true if the actor is in OStim's schlongified faction (has a real penis).
// Faction: OStim.esp 0xE9C

bool IsSchlongified(RE::Actor* actor) {
    if (!actor) return false;
    static RE::TESFaction* s_faction = FormUtils::LookupForm<RE::TESFaction>(0xE9C, "OStim.esp");
    if (!s_faction) return false;
    return actor->IsInFaction(s_faction);
}

// ─── Organ resolution ─────────────────────────────────────────────────────────
// If the named organ is "penis" or "testicles" but the actor is female and not
// schlongified, they must be using a strapon — substitute accordingly.

std::string ResolveOrgan(const std::string& organ, RE::Actor* actor) {
    if (organ != "penis" && organ != "testicles") return organ;
    if (!actor) return organ;
    if (actor->GetActorBase()->GetSex() == RE::SEXES::kFemale && !IsSchlongified(actor)) {
        return "strapon";
    }
    return organ;
}

// ─── Determine verb phrase for an action type ──────────────────────────────

std::string GetVerbPhrase(const std::string& type, ActionDatabase& db) {
    const ActionPhrase* phrase = db.FindActionPhrase(type);
    return phrase ? phrase->verbPhrase : type;
}

// ─── Classify action into output tier ─────────────────────────────────────
//   1 = sexual (main section)
//   2 = sensual / romantic (notable non-sexual section)
//   3 = neutral / supporting ("Additionally: ...")

int ClassifyAction(const std::string& type, ActionDatabase& db) {
    if (db.ActionHasTag(type, "sexual"))   return 1;
    if (db.ActionHasTag(type, "sensual"))  return 2;
    if (db.ActionHasTag(type, "romantic")) return 2;
    return 3;
}

// ─── Decide whether an action targets the actor themselves ─────────────────

bool IsSelfAction(const SceneActionData& action) {
    return kSelfActionTypes.count(action.type) > 0
        || action.target < 0
        || action.target == action.actor;
}

// ─── Build the sentence for a single action ────────────────────────────────

std::string BuildActionSentence(const SceneActionData& action, ActionDatabase& db, uint32_t threadID, int actorCount = 0) {
    if (action.actor < 0) return "";

    std::string actorRef  = ActorRef(action.actor);
    std::string verbPhrase = GetVerbPhrase(action.type, db);

    // Fetch body-part info for context (only used for sexual tier).
    // kActionPhrases is authoritative; ActionDatabase JSON is the fallback.
    std::string actorPart, targetPart;
    if (ClassifyAction(action.type, db) == 1) {
        const ActionPhrase* phrase = db.FindActionPhrase(action.type);
        if (phrase) {
            actorPart  = phrase->actorOrgan;
            targetPart = phrase->targetOrgan;
        } else {
            const ActionData* data = db.GetAction(action.type);
            if (data) {
                actorPart  = FirstBodyPart(data->actorRequirements);
                targetPart = FirstBodyPart(data->targetRequirements);
            }
        }

        // Strapon/futa resolution: replace "penis"/"testicles" with "strapon" for
        // female actors who are not schlongified (futa).
        RE::Actor* actorRE  = OStimIntegration::GetSingleton().GetActorFromThread(threadID, static_cast<uint32_t>(action.actor));
        RE::Actor* targetRE = (action.target >= 0)
            ? OStimIntegration::GetSingleton().GetActorFromThread(threadID, static_cast<uint32_t>(action.target))
            : nullptr;
        actorPart  = ResolveOrgan(actorPart,  actorRE);
        targetPart = ResolveOrgan(targetPart, targetRE);
    }

    std::string sentence;

    // Two-sided: render as "{{A}} and {{T}} [mutualVerb]" — no actor→target directionality.
    // Guard: if actor and target are the same person, fall through to self-action rendering.
    if (!IsSelfAction(action) && action.actor != action.target && kTwoSidedActionTypes.count(action.type)) {
        std::string targetRef = ActorRef(action.target);
        auto it = kMutualVerbPhrases.find(action.type);
        std::string mutualVerb = (it != kMutualVerbPhrases.end()) ? it->second : verbPhrase;
        return actorRef + " and " + targetRef + " " + mutualVerb;
    }

    // Treat as self-directed if:
    //  • the action is explicitly a self-type or has no target,
    //  • actor and target resolve to the same index, or
    //  • the scene has only one actor (solo animation — there is nobody else to act on).
    bool isSelf = IsSelfAction(action) || action.actor == action.target || actorCount <= 1;

    if (isSelf) {
        // e.g. "{{A}} masturbates (using their hand on their own penis)"
        std::string adjustedPhrase = verbPhrase;
        if (adjustedPhrase.size() >= 3 && adjustedPhrase.compare(adjustedPhrase.size() - 3, 3, " of") == 0) {
            size_t thePos = adjustedPhrase.rfind(" the ");
            if (thePos != std::string::npos) {
                std::string prefix = adjustedPhrase.substr(0, thePos);
                std::string noun = adjustedPhrase.substr(thePos + 5, adjustedPhrase.size() - (thePos + 5) - 3);
                adjustedPhrase = prefix + " their own " + noun;
            } else {
                adjustedPhrase = adjustedPhrase.substr(0, adjustedPhrase.size() - 3) + " of themselves";
            }
        } else if (adjustedPhrase.size() >= 5 && adjustedPhrase.compare(adjustedPhrase.size() - 5, 5, " with") == 0) {
            adjustedPhrase = adjustedPhrase.substr(0, adjustedPhrase.size() - 5);
        } else if (adjustedPhrase.size() >= 3 && adjustedPhrase.compare(adjustedPhrase.size() - 3, 3, " to") == 0) {
            adjustedPhrase += " themselves";
        } else if (adjustedPhrase.size() >= 3 && adjustedPhrase.compare(adjustedPhrase.size() - 3, 3, " on") == 0) {
            adjustedPhrase += " themselves";
        }

        sentence = actorRef + " " + adjustedPhrase;
        if (actorPart == "strapon" || targetPart == "strapon") {
            sentence += " (";
            if (!actorPart.empty() && !targetPart.empty()) {
                sentence += "using their " + actorPart + " on their own " + targetPart;
            } else if (!actorPart.empty()) {
                sentence += "using their " + actorPart;
            } else {
                sentence += "on their own " + targetPart;
            }
            sentence += ")";
        }
    } else {
        // e.g. "{{A}} has vaginal sex with {{T}} (using their penis, targeting {{T}}'s vagina)"
        std::string targetRef = ActorRef(action.target);
        sentence = actorRef + " " + verbPhrase + " " + targetRef;
        if (actorPart == "strapon" || targetPart == "strapon") {
            sentence += " (";
            if (!actorPart.empty() && !targetPart.empty()) {
                sentence += "using their " + actorPart + ", targeting " + targetRef + "'s " + targetPart;
            } else if (!actorPart.empty()) {
                sentence += "using their " + actorPart;
            } else {
                sentence += "targeting " + targetRef + "'s " + targetPart;
            }
            sentence += ")";
        }
    }

    // If a distinct performer is specified, note who drives the action
    if (action.performer >= 0 && action.performer != action.actor) {
        sentence += " — " + ActorRef(action.performer) + " drives the pace";
    }

    return sentence;
}

// ─── Furniture helpers ─────────────────────────────────────────────────────
// FurniturePhrase and kFurniturePhrases are defined in SceneDescriptionData.h

// Builds the furniture intro sentence.
// typeId: SceneData::furnitureType (used for preposition lookup).
// displayName: the name to use in the sentence. If empty, falls back to the
//              display name embedded in kFurniturePhrases for known types, or
//              the raw typeId for unknown ones.
std::string FurnitureSentence(const std::string& typeId, const std::string& displayName = "") {
    if (typeId.empty()) return "";
    std::string lower = typeId;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    auto it = kFurniturePhrases.find(lower);
    if (it != kFurniturePhrases.end()) {
        const std::string& name = displayName.empty() ? it->second.display : displayName;
        return "The scene takes place " + std::string(it->second.prep) + " " + name + ".";
    }

    // Unknown mod-added furniture — avoid guessing the wrong preposition
    const std::string& name = displayName.empty() ? lower : displayName;
    static const std::string kVowels = "aeiou";
    std::string article = (kVowels.find(name[0]) != std::string::npos) ? "an" : "a";
    return "The scene involves " + article + " " + name + ".";
}

// ─── Position sentence ────────────────────────────────────────────────────────
// Builds "The scene is in X position." or "The scene combines X, Y and Z positions."
// Each raw string is normalised via kPositionAliases then looked up in kPositionDisplayNames.

std::string PositionSentence(const std::vector<std::string>& rawPositions) {
    if (rawPositions.empty()) return "";

    struct PositionEntry { std::string commonName; std::string desc; };
    std::vector<PositionEntry> entries;
    entries.reserve(rawPositions.size());
    for (const auto& raw : rawPositions) {
        std::string key = raw;
        std::transform(key.begin(), key.end(), key.begin(), ::tolower);
        // Normalise alias → canonical
        auto aliasIt = kPositionAliases.find(key);
        if (aliasIt != kPositionAliases.end()) key = aliasIt->second;
        // Skip idle — not meaningful to mention
        if (key == "idle") continue;
        // Common name — colloquial override or fall back to canonical key
        auto commonIt = kPositionCommonNames.find(key);
        std::string commonName = (commonIt != kPositionCommonNames.end()) ? commonIt->second : key;
        // Description — parenthetical annotation appended after "position"
        auto descIt = kPositionDisplayNames.find(key);
        std::string desc = (descIt != kPositionDisplayNames.end()) ? descIt->second : "";
        entries.push_back({commonName, desc});
    }

    if (entries.empty()) return "";

    // Format: "commonName position[desc]"  e.g. "prone bone position(receiver lying flat, giver on top from behind)"
    auto formatEntry = [](const PositionEntry& e) {
        return e.commonName + " position" + e.desc;
    };

    if (entries.size() == 1) {
        return "The scene is in " + formatEntry(entries[0]) + ".";
    }

    std::string result = "The scene combines ";
    for (size_t i = 0; i < entries.size(); ++i) {
        if (i > 0) result += (i == entries.size() - 1) ? " and " : ", ";
        result += formatEntry(entries[i]);
    }
    result += ".";
    return result;
}


} // anonymous namespace

// ─── Public entry point ────────────────────────────────────────────────────

std::string BuildSceneDescription(const SceneData& scene, uint32_t threadID) {
    auto& db = ActionDatabase::GetSingleton();

    std::ostringstream out;
    bool firstLine = true;

    auto emit = [&](const std::string& line) {
        if (!firstLine) out << "\n";
        out << line;
        firstLine = false;
    };

    // 1. Furniture intro — resolved from actor 0's faction membership.
    {
        RE::Actor* actor = OStimIntegration::GetSingleton().GetActorFromThread(threadID, 0);
        std::string furnitureType;
        if (actor) {
            furnitureType = FurnitureDatabase::GetSingleton().GetFurnitureTypeFromActor(actor);
        }
        std::string sentence = FurnitureSentence(furnitureType);
        if (!sentence.empty()) emit(sentence);
    }

    // 1b. Position sentences — from OStimNet metadata if available.
    {
        const SceneMeta* meta = OStimNetMetaData::GetSingleton().GetSceneMeta(scene.id);
        if (meta) {
            if (!meta->positions.empty()) {
                std::string sentence = PositionSentence(meta->positions);
                if (!sentence.empty()) emit(sentence);
            }
        }
    }

    // 2. Actor introductions
    {
        std::vector<std::string> parts;
        parts.reserve(scene.actors.size());

        std::vector<int> climaxingActors;

        for (int i = 0; i < static_cast<int>(scene.actors.size()); ++i) {
            const auto& actor = scene.actors[i];

            // Build descriptor: gender first, then recognised position tags
            std::string desc;

            auto append = [&](const std::string& token) {
                if (!desc.empty()) desc += ", ";
                desc += token;
            };

            RE::Actor* reActor = OStimIntegration::GetSingleton().GetActorFromThread(threadID, static_cast<uint32_t>(i));
            if (reActor) {
                auto sex = reActor->GetActorBase()->GetSex();
                if (sex == RE::SEXES::kMale) append("male");
                else if (sex == RE::SEXES::kFemale) append(IsSchlongified(reActor) ? "futa" : "female");
            } else if (!actor.intendedSex.empty()) {
                append(actor.intendedSex);
            }

            bool isClimaxing = false;
            for (const auto& tag : actor.tags) {
                if (tag == "climaxing") { isClimaxing = true; continue; }
                auto it = kActorTagLabels.find(tag);
                if (it != kActorTagLabels.end()) append(it->second);
            }
            if (isClimaxing) climaxingActors.push_back(i);

            parts.push_back(desc.empty()
                ? ActorRef(i)
                : ActorRef(i) + " (" + desc + ")");
        }

        if (!parts.empty()) {
            std::string line;
            for (size_t i = 0; i < parts.size(); ++i) {
                if (i > 0) line += (i == parts.size() - 1) ? " and " : ", ";
                line += parts[i];
            }
            emit(line);
        }

        // Climax sentence — separate from the positional descriptor.
        if (!climaxingActors.empty()) {
            std::string refs;
            for (size_t i = 0; i < climaxingActors.size(); ++i) {
                if (i > 0) refs += (i == climaxingActors.size() - 1) ? " and " : ", ";
                refs += ActorRef(climaxingActors[i]);
            }
            emit(refs + (climaxingActors.size() == 1 ? " is climaxing." : " are climaxing."));
        }
    }

    // Classify all actions into tiers
    std::vector<std::string> sexual, sensual, supporting;

    for (const auto& action : scene.actions) {
        if (action.actor < 0) continue;

        // Resolve aliases (e.g. "anal" → "analsex") so lookups always hit
        SceneActionData resolved = action;
        resolved.type = db.ResolveActionType(action.type);

        std::string sentence = BuildActionSentence(resolved, db, threadID, static_cast<int>(scene.actors.size()));
        if (sentence.empty()) continue;

        switch (ClassifyAction(resolved.type, db)) {
            case 1: sexual.push_back(sentence);      break;
            case 2: sensual.push_back(sentence);     break;
            default: supporting.push_back(sentence); break;
        }
    }

    // 3. Sexual actions
    for (const auto& s : sexual) emit(s + ".");

    // 4. Sensual / romantic actions
    for (const auto& s : sensual) emit(s + ".");

    // 5. Supporting / positional actions  ("Additionally: A, B and C.")
    if (!supporting.empty()) {
        std::string add = "Additionally: ";
        for (size_t i = 0; i < supporting.size(); ++i) {
            if (i > 0) add += (i == supporting.size() - 1) ? " and " : ", ";
            add += supporting[i];
        }
        emit(add + ".");
    }

    return out.str();
}

} // namespace OStimNavigator
