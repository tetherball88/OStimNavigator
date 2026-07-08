#pragma once

// kPositions is the authoritative canonical list — external consumers access it
// via ONavGetCanonicalPositions(). The remaining tables are internal-only.
#include "OStimNavigator_PublicAPI.h"

namespace OStimNavigatorAPI {

// ─── Canonical scene position names ─────────────────────────────────────────

inline const std::vector<std::string> kPositions = {
    // missionary family — receiver on back, giver on top/front
    "missionary",       // giver on top, face-to-face
    "butterfly",        // receiver on back, hips tilted up and legs spread, giver kneeling — body stays grounded, angle deepened
    "matingpress",      // receiver on back, legs folded back and pinned to chest/shoulders, giver lying on top pressing full weight down
    "piledriver",       // receiver on back, legs folded all the way over head (near-vertical), giver crouching above
    "anvil",            // receiver on back, legs raised straight up (~90°), giver kneeling upright between them
    "bridge",           // receiver arches back off ground (weight on shoulders and feet), giver kneeling in the gap
    "seashell",         // receiver on back, shoulders grounded, entire lower body lifted and held by kneeling giver who controls thrusting
    // cowgirl family — receiver on top, facing forward or back
    "cowgirl",          // receiver on top, facing giver
    "reversecowgirl",   // receiver on top, facing away
    "amazon",           // receiver on top, giver's legs raised
    // doggy family — receiver facing away, from behind
    "doggystyle",       // receiver on all fours, giver behind
    "prone",            // receiver lying flat, giver on top from behind
    // standing
    "standing",         // both partners upright
    "bodyguard",        // both standing, giver behind receiver
    "nelson",           // giver behind receiver, arms hooked under receiver's armpits and behind neck
    "carry",            // receiver carried, face-to-face, both standing
    // side-lying
    "spooning",         // both on side, giver behind receiver
    "scissors",         // partners at an angle, legs interlinked
    "pretzel",          // side-lying, one leg raised, partners intertwined
    // seated / lap
    "lap",              // receiver seated in giver's lap
    "lotus",            // seated face-to-face, receiver's legs wrapped around giver
    "reverselotus",     // seated with receiver's back to giver, giver's legs wrapped around receiver
    // oral / face
    "facesitting",      // receiver sitting on giver's face
    "sixtynine",        // mutual oral, partners inverted head-to-toe
    // multi-partner
    "spitroast",        // receiver between two partners, oral + rear penetration
    // special
    "wheelbarrow",      // receiver's legs held up by giver, hands on ground
    "idle",             // non-sexual / resting pose
};

// ─── Alias → canonical position name ───────────────────────────────────────────
// External consumers use ONavGetPositionAliases(); this table is the internal authority.

inline const std::unordered_map<std::string, std::string> kPositionAliases = {
    // missionary family
    { "mating-press",     "matingpress"    },
    { "mating press",     "matingpress"    },
    { "pile-driver",      "piledriver"     },
    { "pile driver",      "piledriver"     },
    // cowgirl family
    { "reverse-cowgirl",  "reversecowgirl" },
    { "reverse cowgirl",  "reversecowgirl" },
    { "rcg",              "reversecowgirl" },
    { "girl on top",      "cowgirl"        },
    // doggy family
    { "doggy",            "doggystyle"     },
    { "doggy-style",      "doggystyle"     },
    { "doggy style",      "doggystyle"     },
    { "prone bone",       "prone"          },
    { "prone-bone",       "prone"          },
    // standing
    { "full nelson",      "nelson"          },
    { "fullnelson",       "nelson"          },
    // side-lying
    { "spoon",            "spooning"       },
    { "scissoring",       "scissors"       },
    // seated / lap
    { "lap dance",        "lap"            },
    { "lapdance",         "lap"            },
    { "lotus position",   "lotus"          },
    { "reverse lotus",    "reverselotus"   },
    // oral / face
    { "face-sitting",     "facesitting"    },
    { "face sitting",     "facesitting"    },
    { "queening",         "facesitting"    },
    { "69",               "sixtynine"      },
    { "sixty-nine",       "sixtynine"      },
    { "sixty nine",       "sixtynine"      },
    // multi-partner
    { "spit-roast",       "spitroast"      },
    { "spit roast",       "spitroast"      },
    { "spitroasting",     "spitroast"      },
    // special
    { "wheel barrow",     "wheelbarrow"    },
    { "wheel-barrow",     "wheelbarrow"    },
    { "rest",             "idle"           },
    { "resting",          "idle"           },
};

// ─── Position canonical ID → display name ───────────────────────────────────────────
// External consumers use ONavGetPositionDisplayNames(); this table is the internal authority.

inline const std::unordered_map<std::string, std::string> kPositionDisplayNames = {
    {"missionary",     ""},
    {"butterfly",      "(missionary, receiver's hips raised)"},
    {"matingpress",    "(missionary, receiver's legs pinned back)"},
    {"piledriver",     "(receiver on back, legs over head)"},
    {"anvil",          "(receiver on back, legs raised up)"},
    {"bridge",         "(receiver arched back off ground)"},
    {"seashell",       "(receiver on back, lower body lifted and held by kneeling giver)"},
    {"cowgirl",        ""},
    {"reversecowgirl", ""},
    {"amazon",         "(cowgirl, giver's legs raised)"},
    {"doggystyle",     ""},
    {"prone",          "(receiver lying flat, giver on top from behind)"},
    {"standing",       ""},
    {"bodyguard",      "(both standing, giver behind receiver)"},
    {"nelson",         "(giver behind receiver, arms hooked under receiver's armpits and behind neck)"},
    {"carry",          "(receiver carried face-to-face)"},
    {"spooning",       ""},
    {"scissors",       ""},
    {"pretzel",        "(side-lying, one leg raised, partners intertwined)"},
    {"lap",            "(receiver seated in giver's lap)"},
    {"lotus",          ""},
    {"reverselotus",   "(receiver seated with receiver's back to giver)"},
    {"facesitting",    ""},
    {"sixtynine",      ""},
    {"spitroast",      ""},
    {"wheelbarrow",    "(receiver's legs held up by giver, hands on ground)"},
    {"idle",           "idle"},
};

// ─── Position canonical ID → common (pretty) name ──────────────────────────────
// Only needed for positions whose well-known colloquial name differs from the
// canonical key. PositionSentence uses this as the displayed label; the value in
// kPositionDisplayNames is then appended as a parenthetical description suffix.

inline const std::unordered_map<std::string, std::string> kPositionCommonNames = {
    {"prone",          "prone bone"},
    {"reversecowgirl", "reverse cowgirl"},
    {"matingpress",    "mating press"},
    {"piledriver",     "pile driver"},
    {"reverselotus",   "reverse lotus"},
    {"sixtynine",      "sixty-nine"},
    {"spitroast",      "spit roast"},
};

// ─── Internal-only tables ────────────────────────────────────────────────────

inline const std::unordered_map<std::string, std::string> kActorTagLabels = {
    {"allfours",     "on all fours"},
    {"bendover",     "bent over"},
    {"drowsy",       "drowsy"},
    {"facingaway",   "facing away"},
    {"handstanding", "handstanding"},
    {"kneeling",     "kneeling"},
    {"lyingback",    "lying on their back"},
    {"lyingfront",   "lying face-down"},
    {"lyingside",    "lying on their side"},
    {"onbottom",     "on the bottom"},
    {"ontop",        "on top"},
    {"sitting",      "sitting"},
    {"sleeping",     "sleeping"},
    {"legsover",     "legs over"},
    {"legsup",       "legs up"},
    {"legswrapped",  "legs wrapped"},
    {"levitated",    "levitated"},
    {"restrained",   "restrained"},
    {"spreadlegs",   "legs spread"},
    {"squatting",    "squatting"},
    {"standing",     "standing"},
    {"suspended",    "suspended"},
    {"upsidedown",   "upside-down"},
    {"climaxing",    "climaxing"},
};

inline const std::vector<std::string> kActorTagSuggestions = {
    // upright
    "standing", "squatting", "kneeling",
    // seated
    "sitting",
    // on all fours / bent
    "allfours", "bendover",
    // lying down
    "lyingback", "lyingfront", "lyingside", "sleeping", "drowsy",
    // relative position
    "ontop", "onbottom",
    // leg positions
    "spreadlegs", "legsup", "legsover", "legswrapped",
    // orientation modifiers
    "facingaway", "upsidedown",
    // exotic / special
    "handstanding", "suspended", "levitated", "restrained", "climaxing"
};

// ─── Action phrase descriptor ─────────────────────────────────────────────────
// verbPhrase  : "{{actor}} [verbPhrase] {{target}}" (target omitted for self-actions)
// actorOrgan  : explicit organ the actor uses; "" = suppress annotation
// targetOrgan : explicit organ on the target that is involved; "" = suppress annotation
//
// Leave an organ field empty when:
//   • it is already stated within verbPhrase (e.g. "licks the vagina of")
//   • it is not a body part (e.g. a toy)
// Fill both fields when the verb alone is ambiguous (e.g. "fingers").

struct ActionPhrase {
    std::string verbPhrase;
    std::string actorOrgan;
    std::string targetOrgan;
};

// ─── Action type → { verb phrase, actor organ, target organ } ────────────────
// Used as: "{{actor}} [verbPhrase] {{target}}"
// For self-actions the target reference is omitted.

inline const std::unordered_map<std::string, ActionPhrase> kActionPhrases = {
    // ── Intercourse ──────────────────────────────────────────────────────────
    {"vaginalsex",               {"has vaginal sex with",              "penis",   ""      }},
    {"analsex",                  {"has anal sex with",                 "penis",   ""      }},
    {"tribbing",                 {"tribs with",                        "",        ""      }},
    // ── Oral ─────────────────────────────────────────────────────────────────
    {"blowjob",                  {"gives a blowjob to",                "",        "penis" }},
    {"deepthroat",               {"deepthroats the penis of",          "",        "penis" }},
    {"cunnilingus",              {"performs cunnilingus on",           "",        ""      }},
    {"anilingus",                {"performs anilingus on",             "",        ""      }},
    {"rimjob",                   {"performs a rimjob on",              "",        ""      }},
    {"lickingvagina",            {"licks the vagina of",               "",        ""      }},
    {"lickingpenis",             {"licks the penis of",                "",        "penis" }},
    {"lickingtesticles",         {"licks the testicles of",            "",        "testicles"}},
    {"lickingnipple",            {"licks the nipple of",               "",        ""      }},
    {"suckingnipple",            {"sucks the nipple of",               "",        ""      }},
    // ── Manual stimulation ───────────────────────────────────────────────────
    {"handjob",                  {"gives a handjob to",                "",        "penis" }},
    {"footjob",                  {"gives a footjob to",                "",        "penis" }},
    {"boobjob",                  {"gives a boobjob to",                "",        "penis" }},
    {"thighjob",                 {"rubs their thighs against the penis of", "",   "penis" }},
    {"buttjob",                  {"grinds their butt against the penis of", "",   "penis" }},
    // ── Fingering / fisting / toying ─────────────────────────────────────────
    {"vaginalfingering",         {"fingers the vagina of",             "",        ""      }},
    {"vaginalfisting",           {"fists the vagina of",               "",        ""      }},
    {"vaginaltoying",            {"uses a toy on the vagina of",       "",        ""      }},
    {"analfingering",            {"fingers the anus of",               "",        ""      }},
    {"analfisting",              {"fists the anus of",                 "",        ""      }},
    {"analtoying",               {"uses a toy on the anus of",         "",        ""      }},
    // ── Rubbing / grinding ───────────────────────────────────────────────────
    {"grindingpenis",            {"grinds their vagina against the penis of", "", "penis" }},
    {"grindingthigh",            {"grinds their vagina against the thigh of", "", ""      }},
    {"grindingfoot",             {"grinds their vagina against the foot of", "",  ""      }},
    {"grindingobject",           {"grinds their vagina against an object", "",    ""      }},
    {"rubbingclitoris",          {"rubs the clitoris of",              "",        ""      }},
    {"rubbingpenisagainstface",  {"rubs their penis against the face of", "penis", ""      }},
    // ── Groping ──────────────────────────────────────────────────────────────
    {"gropingbreast",            {"gropes the breasts of",             "",        ""      }},
    {"gropingbutt",              {"gropes the butt of",                "",        ""      }},
    {"gropingtesticles",         {"gropes the testicles of",           "",        "testicles"}},
    {"oralfingering",            {"fingers the mouth of",              "",        ""      }},
    {"choking",                  {"chokes",                            "",        ""      }},
    // ── Climax / ejaculation ─────────────────────────────────────────────────
    {"facial",                   {"ejaculates on the face of",         "",        ""      }},
    {"cumonbutt",                {"ejaculates on the butt of",         "",        ""      }},
    {"cumonchest",               {"ejaculates on the chest of",        "",        ""      }},
    {"cumonvulva",               {"ejaculates on the vulva of",        "",        ""      }},
    // ── Masturbation (self) ───────────────────────────────────────────────────
    {"malemasturbation",         {"masturbates his penis",             "",        "penis" }},
    {"femalemasturbation",       {"masturbates her vagina",            "",        ""      }},
    // ── Sensual / romantic ───────────────────────────────────────────────────
    {"kissing",                  {"kisses",                            "",        ""      }},
    {"frenchkissing",            {"french-kisses",                     "",        ""      }},
    {"kissingcheek",             {"kisses the cheek of",               "",        ""      }},
    {"kissingneck",              {"kisses the neck of",                "",        ""      }},
    {"kissingfoot",              {"kisses the foot of",                "",        ""      }},
    {"kissinghand",              {"kisses the hand of",                "",        ""      }},
    {"hugging",                  {"hugs",                              "",        ""      }},
    {"cuddling",                 {"cuddles with",                      "",        ""      }},
    {"spooning",                 {"spoons",                            "",        ""      }},
    {"breastsmothering",         {"smothers with their breasts",       "",        ""      }},
    {"buttsmothering",           {"smothers with their butt",          "",        ""      }},
    {"vampirebite",              {"sinks their fangs into the neck of","",        ""      }},
    {"pullinghair",              {"pulls the hair of",                 "",        ""      }},
    {"massage",                  {"massages",                          "",        ""      }},
    {"breastslide",              {"slides their breasts on",           "",        ""      }},
    // ── Supporting / positional ──────────────────────────────────────────────
    {"holdingarm",               {"holds the arm of",                  "",        ""      }},
    {"holdingbody",              {"holds",                             "",        ""      }},
    {"holdingchin",              {"holds the chin of",                 "",        ""      }},
    {"holdingfoot",              {"holds the foot of",                 "",        ""      }},
    {"holdinghand",              {"holds the hand of",                 "",        ""      }},
    {"holdinghip",               {"holds the hip of",                  "",        ""      }},
    {"holdingleg",               {"holds the leg of",                  "",        ""      }},
    {"holdingneck",              {"holds the neck of",                 "",        ""      }},
    {"holdinghead",              {"holds the head of",                 "",        ""      }},
    {"holdingthigh",             {"holds the thigh of",                "",        ""      }},
    {"pattinghead",              {"pats the head of",                  "",        ""      }},
    {"strokinghead",             {"strokes the head of",               "",        ""      }},
    {"leglocking",               {"leg-locks",                         "",        ""      }},
    {"mounting",                 {"mounts",                            "",        ""      }},
    {"spectating",               {"watches",                           "",        ""      }},
    {"bathing",                  {"bathes",                            "",        ""      }},
    {"washing",                  {"washes",                            "",        ""      }},
    {"dancing",                  {"dances",                            "",        ""      }},
    {"ticklingfoot",             {"tickles the foot of",               "",        ""      }},
    {"spanking",                 {"spanks the butt of",                "",        ""      }},
    {"breastslapping",           {"slaps the breasts of",              "",        ""      }},
};

// ─── Self-directed and two-sided action sets ──────────────────────────────────

inline const std::unordered_set<std::string> kSelfActionTypes = {
    "malemasturbation",
    "femalemasturbation",
};

// Two-sided actions: a single action record implies both actors participate mutually.
// Source: "info": "X is two sided, you don't need to add two actions for it" in OStim action JSONs.
inline const std::unordered_set<std::string> kTwoSidedActionTypes = {
    "kissing",
    "frenchkissing",
    "holdinghand",
    "tribbing",
};

// Mutual verb phrase used when rendering two-sided actions:
// "{{A}} and {{T}} [mutualVerb]"
inline const std::unordered_map<std::string, std::string> kMutualVerbPhrases = {
    {"kissing",       "kiss"},
    {"frenchkissing", "french-kiss"},
    {"holdinghand",   "hold hands"},
    {"tribbing",      "trib"},
};

// ─── Body part → readable label ──────────────────────────────────────────────

inline const std::unordered_map<std::string, std::string> kBodyPartLabels = {
    {"penis",     "penis"},
    {"vagina",    "vagina"},
    {"anus",      "anus"},
    {"mouth",     "mouth"},
    {"hand",      "hand"},
    {"foot",      "foot"},
    {"breast",    "breasts"},
    {"nipple",    "nipple"},
    {"testicles", "testicles"},
    {"inwater",   "water"},
    {"vampire",   "fangs"},
};

// Priority order used when picking the most descriptive body part from a requirements set.
inline const std::vector<std::string> kBodyPartPriority = {
    "penis", "vagina", "anus", "mouth", "breast", "nipple", "testicles", "hand", "foot"
};

// ─── Furniture type → { preposition, display name } ──────────────────────────
// Prepositions: "on" for surfaces you sit/lie on, "at" for workstations,
//               "against" for vertical supports.

struct FurniturePhrase { const char* prep; const char* display; };

inline const std::unordered_map<std::string, FurniturePhrase> kFurniturePhrases = {
    {"alchemytable",        {"at",      "an alchemy table"}},
    {"bench",               {"on",      "a bench"}},
    {"chair",               {"on",      "a chair"}},
    {"cookingpot",          {"at",      "a cooking pot"}},
    {"enchantingtable",     {"at",      "an enchanting table"}},
    {"shelf",               {"against", "a shelf"}},
    {"table",               {"on",      "a table"}},
    {"tableleanmarker",     {"against", "a table"}},
    {"tableleanmarkerbbls", {"against", "a table"}},
    {"wall",                {"against", "a wall"}},
    {"wardrobe",            {"against", "a wardrobe"}},
    {"wardrobethick",       {"against", "a wardrobe"}},
    {"wardrobethin",        {"against", "a wardrobe"}},
    {"bed",                 {"on",      "a bed"}},
    {"singlebed",           {"on",      "a bed"}},
    {"doublebed",           {"on",      "a bed"}},
    {"bedroll",             {"on",      "a bedroll"}},
};

// ─── OStimNet intent values ─────────────────────────────────────────────────
// Internal-only: used by PrismaUIManager to populate UI suggestion lists.
inline const std::vector<std::string> kOStimNetIntents = {
    "platonic", "romantic", "lustful", "transactional", "dom", "aggressive"
};

// ─── Sexual action types ─────────────────────────────────────────────────────
// Subset of kActionPhrases keys that represent explicitly sexual acts.
// Used by SceneDatabase and ONavGetAllActions to filter sex-relevant actions.
inline const std::unordered_set<std::string> kSexualActionTypes = {
    // intercourse
    "vaginalsex", "analsex", "tribbing",
    // oral
    "blowjob", "deepthroat", "cunnilingus", "anilingus", "rimjob",
    "lickingvagina", "lickingpenis", "lickingtesticles", "lickingnipple", "suckingnipple",
    // manual stimulation
    "handjob", "footjob", "boobjob", "thighjob", "buttjob",
    // fingering / fisting / toying
    "vaginalfingering", "vaginalfisting", "vaginaltoying",
    "analfingering", "analfisting", "analtoying",
    // rubbing / grinding
    "grindingpenis", "grindingthigh", "grindingfoot", "grindingobject",
    "rubbingclitoris", "rubbingpenisagainstface",
    // groping
    "gropingbreast", "gropingbutt", "gropingtesticles", "oralfingering"
    // climax / ejaculation
    "facial", "cumonbutt", "cumonchest", "cumonvulva",
    // masturbation
    "malemasturbation", "femalemasturbation",
};

} // namespace OStimNavigatorAPI

namespace OStimNavigator {
    using namespace ::OStimNavigatorAPI;
} // namespace OStimNavigator
