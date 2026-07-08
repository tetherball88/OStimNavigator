#include <Windows.h>
#include <spdlog/sinks/basic_file_sink.h>
#include <spdlog/spdlog.h>
#include <map>

#include "PCH.h"
#include "src/OStimIntegration.h"
#include "src/ActionDatabase.h"
#include "src/SceneDescriptionBuilder.h"
#include "src/SceneDescriptionData.h"
#include "src/ActorPropertiesDatabase.h"
#include "src/FurnitureDatabase.h"
#include "src/OStimNetMetaData.h"
#include "src/SceneDatabase.h"
#include "src/UI.h"
#include "src/PrismaUIManager.h"
#include "src/Papyrus.h"
#include "src/SkyrimNetIntegration.h"
#include "src/OStimNetIntegration.h"
#include "src/KeyboardInputBlocker.h"
#include "src/Settings.h"

using namespace SKSE;

namespace {
    void SetupLogging() {
        auto logDir = SKSE::log::log_directory();
        if (!logDir) {
            if (auto* console = RE::ConsoleLog::GetSingleton()) {
                console->Print("OstimNavigator: log directory unavailable");
            }
            return;
        }

        std::filesystem::path logPath = *logDir;
        if (!std::filesystem::is_directory(logPath)) {
            logPath = logPath.parent_path();
        }
        logPath /= "OstimNavigator.log";

        std::error_code ec;
        std::filesystem::create_directories(logPath.parent_path(), ec);
        if (ec) {
            if (auto* console = RE::ConsoleLog::GetSingleton()) {
                console->Print("OstimNavigator: failed to create log folder (%s)", ec.message().c_str());
            }
            return;
        }

        auto sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>(logPath.string(), true);
        auto logger = std::make_shared<spdlog::logger>("OstimNavigator", std::move(sink));
        logger->set_level(spdlog::level::trace);
        logger->flush_on(spdlog::level::info);
        logger->set_pattern("[%H:%M:%S] [%l] %v");

        spdlog::set_default_logger(std::move(logger));
    }

    void PrintToConsole(std::string_view message) {
        SKSE::log::info("{}", message);
        if (auto* console = RE::ConsoleLog::GetSingleton()) {
            console->Print("%s", message.data());
        }
    }
}

SKSEPluginLoad(const LoadInterface* skse) {
    SKSE::Init(skse);

    SetupLogging();
    SKSE::log::info("OstimNavigator plugin loading...");

    // Check if OStim is loaded (it should load before us alphabetically)
    if (const auto* ostimInfo = skse->GetPluginInfo("OStim")) {
        SKSE::log::info("Found OStim plugin version {}.{}.{}",
            ostimInfo->version >> 24,
            (ostimInfo->version >> 16) & 0xFF,
            (ostimInfo->version >> 8) & 0xFF);
    }

    if (const auto* messaging = SKSE::GetMessagingInterface()) {
        if (!messaging->RegisterListener([](SKSE::MessagingInterface::Message* message) {
                switch (message->type) {
                    case SKSE::MessagingInterface::kPreLoadGame:
                        SKSE::log::debug("PreLoadGame...");
                        OStimNavigator::PrismaUIManager::GetSingleton().Destroy();
                        break;

                    case SKSE::MessagingInterface::kInputLoaded:
                        SKSE::log::debug("Input loaded — installing keyboard blocker hook...");
                        KeyboardInputBlocker::Install();
                        break;

                    case SKSE::MessagingInterface::kPostLoadGame:
                    case SKSE::MessagingInterface::kNewGame:
                        SKSE::log::debug("New game/Load...");
                        if (!OStimNavigator::OStimIntegration::GetSingleton().IsOStimAvailable()) {
                            SKSE::log::warn("Retrying OStim integration...");
                            OStimNavigator::OStimIntegration::GetSingleton().Initialize(
                                SKSE::PluginDeclaration::GetSingleton()->GetName().data(),
                                SKSE::PluginDeclaration::GetSingleton()->GetVersion());
                        }
                        // OStimNavigator::PrismaUIManager::GetSingleton().Show();
                        break;

                    case SKSE::MessagingInterface::kDataLoaded: {
                        SKSE::log::info("Data loaded successfully.");

                        // Load settings from OStimNavigator.ini
                        Settings::GetSingleton().Load();
                        Settings::GetSingleton().ApplyLogLevel();

                        // Initialize OStim integration
                        OStimNavigator::OStimIntegration::GetSingleton().Initialize(
                            SKSE::PluginDeclaration::GetSingleton()->GetName().data(),
                            SKSE::PluginDeclaration::GetSingleton()->GetVersion());
                        
                        // Load furniture database (must be loaded before scenes for furniture validation)
                        OStimNavigator::FurnitureDatabase::GetSingleton().LoadFurnitureTypes();
                        
                        // Load action database (must be loaded before scenes)
                        OStimNavigator::ActionDatabase::GetSingleton().LoadActions();
                        
                        // Load actor properties database
                        OStimNavigator::ActorPropertiesDatabase::GetSingleton().LoadActorProperties();

                        // Load animation description database
                        OStimNavigator::OStimNetMetaData::GetSingleton().LoadDescriptions();

                        // Load scene meta database
                        OStimNavigator::OStimNetMetaData::GetSingleton().LoadSceneMeta();

                        // Load scene database
                        OStimNavigator::SceneDatabase::GetSingleton().LoadScenes();

                        // Auto-populate positions in scene meta from scene tags (skips scenes that already have positions)
                        OStimNavigator::OStimNetMetaData::GetSingleton().AutoPopulatePositions();

                        // Initialize PrismaUI (acquire API handle once at data load time)
                        OStimNavigator::PrismaUIManager::GetSingleton().Initialize();

                        // Initialize SkyrimNet integration (optional — graceful if absent)
                        OStimNavigator::SkyrimNetIntegration::GetSingleton().Initialize();

                        // Register UI elements
                        OStimNavigator::UI::Register();

                        if (auto* console = RE::ConsoleLog::GetSingleton()) {
                            console->Print("OstimNavigator: Ready");
                        }
                        break;
                    }

                    default:
                        break;
                }
            })) {
            SKSE::log::critical("Failed to register messaging listener.");
            return false;
        }
    } else {
        SKSE::log::critical("Messaging interface unavailable.");
        return false;
    }

    if (const auto* papyrus = SKSE::GetPapyrusInterface()) {
        if (!papyrus->Register(OStimNavigator::Papyrus::Register)) {
            SKSE::log::critical("Failed to register Papyrus functions.");
            return false;
        }
    } else {
        SKSE::log::critical("Papyrus interface unavailable.");
        return false;
    }

    return true;
}

// =============================================================================
// Public API exports
// =============================================================================

extern "C" __declspec(dllexport)
const char* ONavBuildSceneDescription(const char* sceneId, uint32_t threadID) {
    if (!sceneId) return "";
    auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene) return "";
    static std::string s_result;
    s_result = OStimNavigator::BuildSceneDescription(*scene, threadID);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetAnimationDescription(const char* sceneId) {
    if (!sceneId) return "";
    OStimNavigator::OStimNetIntegration::LoadAnimationDescriptions();
    const auto* descEntry = OStimNavigator::OStimNetMetaData::GetSingleton().GetEffectiveDescription(sceneId);
    if (!descEntry || descEntry->description.empty()) return "";
    static std::string s_result;
    s_result = descEntry->description;
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
bool ONavIsIdle(const char* sceneId) {
    if (!sceneId) {
        SKSE::log::debug("ONavIsIdle: called with null sceneId -> false");
        return false;
    }
    const auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene) {
        SKSE::log::debug("ONavIsIdle: scene '{}' not found -> false", sceneId);
        return false;
    }
    for (const auto& tag : scene->tags) {
        if (tag == "idle") {
            SKSE::log::debug("ONavIsIdle: scene '{}' has tag 'idle' -> true", sceneId);
            return true;
        }
    }
    SKSE::log::debug("ONavIsIdle: scene '{}' -> false", sceneId);
    return false;
}

extern "C" __declspec(dllexport)
bool ONavIsIntro(const char* sceneId) {
    if (!sceneId) {
        SKSE::log::debug("ONavIsIntro: called with null sceneId -> false");
        return false;
    }
    const auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene) {
        SKSE::log::debug("ONavIsIntro: scene '{}' not found -> false", sceneId);
        return false;
    }
    for (const auto& tag : scene->tags) {
        if (tag == "intro") {
            SKSE::log::debug("ONavIsIntro: scene '{}' has tag 'intro' -> true", sceneId);
            return true;
        }
    }
    SKSE::log::debug("ONavIsIntro: scene '{}' -> false", sceneId);
    return false;
}

extern "C" __declspec(dllexport)
bool ONavIsTransit(const char* sceneId) {
    if (!sceneId) {
        SKSE::log::debug("ONavIsTransit: called with null sceneId -> false");
        return false;
    }
    const auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene) {
        SKSE::log::debug("ONavIsTransit: scene '{}' not found -> false", sceneId);
        return false;
    }
    if (scene->isTransition) {
        SKSE::log::debug("ONavIsTransit: scene '{}' isTransition -> true", sceneId);
        return true;
    }
    SKSE::log::debug("ONavIsTransit: scene '{}' -> false", sceneId);
    return false;
}

// Shared helper: priority order for body parts that receive cum
namespace {
    static const char* kCumPartPriority[] = {
        "vagina", "anus", "mouth", "breast", "nipple", "hand", "foot"
    };

    std::string BestCumPart(const std::unordered_set<std::string>& reqs) {
        for (const auto* p : kCumPartPriority) {
            if (reqs.count(p)) return p;
        }
        return "";
    }

    // Returns a map of counterpartIndex -> set<area> covering all penis-based actions
    // where the given actorPosition is the penetrating party.
    std::map<int, std::vector<std::string>> CollectCumTargets(
        const OStimNavigator::SceneData& scene,
        OStimNavigator::ActionDatabase& actionDB,
        int actorPosition)
    {
        std::map<int, std::vector<std::string>> results; // counterpartIdx -> areas (ordered, deduped)

        for (const auto& sceneAction : scene.actions) {
            const OStimNavigator::ActionData* data = actionDB.GetAction(sceneAction.type);
            if (!data) continue;

            int counterpart = -1;
            std::string part;

            // Case A: actorPosition is "actor" role with penis
            if (sceneAction.actor == actorPosition
                    && data->actorRequirements.count("penis")
                    && sceneAction.target >= 0) {
                counterpart = sceneAction.target;
                part = BestCumPart(data->targetRequirements);
            }
            // Case B: actorPosition is "target" role with penis
            else if (sceneAction.target == actorPosition
                    && data->targetRequirements.count("penis")
                    && sceneAction.actor >= 0) {
                counterpart = sceneAction.actor;
                part = BestCumPart(data->actorRequirements);
            }

            if (counterpart >= 0 && !part.empty()) {
                auto& areas = results[counterpart];
                if (std::find(areas.begin(), areas.end(), part) == areas.end()) {
                    areas.push_back(part);
                }
            }
        }

        return results;
    }
}

extern "C" __declspec(dllexport)
const char* ONavGetCumTargets(const char* sceneId, int actorPosition) {
    if (!sceneId) return "[]";
    const auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene) return "[]";

    auto targets = CollectCumTargets(*scene, OStimNavigator::ActionDatabase::GetSingleton(), actorPosition);
    if (targets.empty()) return "[]";

    // Build JSON: [{"counterpartIndex":1,"areas":["vagina","anus"]}, ...]
    std::string json = "[";
    bool firstEntry = true;
    for (const auto& [counterpart, areas] : targets) {
        if (!firstEntry) json += ",";
        firstEntry = false;
        json += "{\"counterpartIndex\":" + std::to_string(counterpart) + ",\"areas\":[";
        for (size_t i = 0; i < areas.size(); ++i) {
            if (i > 0) json += ",";
            json += "\"" + areas[i] + "\"";
        }
        json += "]}";
    }
    json += "]";

    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetPositionDisplayNames() {
    std::string json = "{";
    bool first = true;
    for (const auto& [id, display] : OStimNavigatorAPI::kPositionDisplayNames) {
        if (!first) json += ",";
        first = false;
        // Escape quotes inside display strings
        std::string escaped;
        for (char c : display) { if (c == '"') escaped += "\\\""; else escaped += c; }
        json += "\"" + id + "\":\"" + escaped + "\"";
    }
    json += "}";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetPositionAliases() {
    std::string json = "{";
    bool first = true;
    for (const auto& [alias, canonical] : OStimNavigatorAPI::kPositionAliases) {
        if (!first) json += ",";
        first = false;
        json += "\"" + alias + "\":\"" + canonical + "\"";
    }
    json += "}";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetCanonicalPositions() {
    const auto& positions = OStimNavigator::OStimNetMetaData::GetSingleton().GetPositionSuggestions();
    std::string json = "[";
    for (size_t i = 0; i < positions.size(); ++i) {
        if (i > 0) json += ",";
        json += "\"" + positions[i] + "\"";
    }
    json += "]";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetAllPositions() {
    auto positions = OStimNavigator::SceneDatabase::GetSingleton().GetAllPositions();
    std::string json = "[";
    for (size_t i = 0; i < positions.size(); ++i) {
        if (i > 0) json += ",";
        json += "\"" + positions[i] + "\"";
    }
    json += "]";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetAllActions(const char* tag) {
    std::vector<std::string> actions;
    if (tag && tag[0] != '\0') {
        auto withTag = OStimNavigator::ActionDatabase::GetSingleton().GetActionsWithTag(tag);
        for (const auto& a : OStimNavigator::ActionDatabase::GetSingleton().GetAvailableActionTypes()) {
            if (withTag.count(a)) actions.push_back(a);
        }
    } else {
        actions = OStimNavigator::ActionDatabase::GetSingleton().GetAvailableActionTypes();
    }
    std::string json = "[";
    for (size_t i = 0; i < actions.size(); ++i) {
        if (i > 0) json += ",";
        json += "\"" + actions[i] + "\"";
    }
    json += "]";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetFurnitureTypesWithSexScenes(uint32_t minSceneCount, uint32_t centerRefID, float radius) {
    if (minSceneCount == 0) minSceneCount = 1;

    // id -> minimum distance to a matching nearby ref (-1.0 when no scan)
    std::unordered_map<std::string, float> nearbyTypeDistances;
    if (centerRefID != 0) {
        auto* centerRef = RE::TESForm::LookupByID<RE::TESObjectREFR>(centerRefID);
        if (centerRef) {
            RE::NiPoint3 centerPos = centerRef->GetPosition();
            RE::TES::GetSingleton()->ForEachReferenceInRange(centerRef, radius, [&](RE::TESObjectREFR* ref) {
                if (!ref || ref->IsDisabled() || ref->IsDeleted()) {
                    return RE::BSContainer::ForEachResult::kContinue;
                }
                auto* ft = OStimNavigator::FurnitureDatabase::GetSingleton().GetFurnitureType(ref);
                if (ft && ft->sceneCount >= minSceneCount) {
                    float dist = (centerPos - ref->GetPosition()).Length();
                    auto it = nearbyTypeDistances.find(ft->id);
                    if (it == nearbyTypeDistances.end() || dist < it->second) {
                        nearbyTypeDistances[ft->id] = dist;
                    }
                }
                return RE::BSContainer::ForEachResult::kContinue;
            });
        }
    }

    auto ids = OStimNavigator::FurnitureDatabase::GetSingleton().GetAllFurnitureTypeIDs();
    std::string json = "[";
    bool first = true;
    for (const auto& id : ids) {
        if (centerRefID != 0 && nearbyTypeDistances.find(id) == nearbyTypeDistances.end()) {
            continue;
        }
        const auto* ft = OStimNavigator::FurnitureDatabase::GetSingleton().GetFurnitureType(id);
        if (ft && ft->sceneCount >= minSceneCount) {
            if (!first) json += ",";
            first = false;
            float dist = (centerRefID != 0) ? nearbyTypeDistances.at(id) : -1.0f;
            json += "{\"id\":\"" + id + "\",\"distance\":" + std::to_string(dist) + "}";
        }
    }
    json += "]";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

// Returns the scene-level tags for a scene as a JSON array of strings.
// Tags include position names (e.g. "missionary", "cowgirl") and any other
// metadata tags authored in the scene JSON. Returns "[]" if the scene is unknown.
extern "C" __declspec(dllexport)
const char* ONavGetSceneTags(const char* sceneId) {
    if (!sceneId || sceneId[0] == '\0') return "[]";
    const auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene || scene->tags.empty()) return "[]";
    std::string json = "[";
    for (size_t i = 0; i < scene->tags.size(); ++i) {
        if (i > 0) json += ",";
        json += "\"" + scene->tags[i] + "\"";
    }
    json += "]";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

extern "C" __declspec(dllexport)
const char* ONavGetSceneActions(const char* sceneId) {
    if (!sceneId || sceneId[0] == '\0') {
        static const char* s_empty = "[]";
        return s_empty;
    }
    auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene) {
        static const char* s_empty = "[]";
        return s_empty;
    }
    // Collect unique resolved action types for this scene, preserving order of first appearance.
    std::vector<std::string> actions;
    std::unordered_set<std::string> seen;
    for (const auto& action : scene->actions) {
        if (!action.type.empty() && seen.insert(action.type).second) {
            actions.push_back(action.type);
        }
    }
    std::string json = "[";
    for (size_t i = 0; i < actions.size(); ++i) {
        if (i > 0) json += ",";
        json += "\"" + actions[i] + "\"";
    }
    json += "]";
    static std::string s_result;
    s_result = std::move(json);
    return s_result.c_str();
}

// Returns true if any actor position in the scene has the given tag.
// @param sceneId  Scene ID string (e.g. "SomeModpack|SomeScene"). Must not be null.
// @param tag      Actor-position tag to check for (e.g. "climaxing"). Must not be null.
// @return true if at least one actor position in the scene carries this tag; false otherwise.
extern "C" __declspec(dllexport)
bool ONavSceneHasActorWithTag(const char* sceneId, const char* tag) {
    if (!sceneId || !tag || sceneId[0] == '\0' || tag[0] == '\0') return false;
    const auto* scene = OStimNavigator::SceneDatabase::GetSingleton().GetSceneByID(sceneId);
    if (!scene) return false;
    for (const auto& actor : scene->actors) {
        if (std::find(actor.tags.begin(), actor.tags.end(), tag) != actor.tags.end())
            return true;
    }
    return false;
}
