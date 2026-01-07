#include <Windows.h>
#include <spdlog/sinks/basic_file_sink.h>
#include <spdlog/spdlog.h>

#include "PCH.h"
#include "src/OStimIntegration.h"
#include "src/ActionDatabase.h"
#include "src/ActorPropertiesDatabase.h"
#include "src/FurnitureDatabase.h"
#include "src/SceneDatabase.h"
#include "src/UI.h"

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
        spdlog::info("Logging to {}", logPath.string());
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

    if (const auto* messaging = SKSE::GetMessagingInterface()) {
        if (!messaging->RegisterListener([](SKSE::MessagingInterface::Message* message) {
                switch (message->type) {
                    case SKSE::MessagingInterface::kPreLoadGame:
                        SKSE::log::info("PreLoadGame...");
                        break;

                    case SKSE::MessagingInterface::kPostLoadGame:
                    case SKSE::MessagingInterface::kNewGame:
                        SKSE::log::info("New game/Load...");
                        break;

                    case SKSE::MessagingInterface::kDataLoaded: {
                        SKSE::log::info("Data loaded successfully.");

                        // Initialize OStim integration
                        OStimNavigator::OStimIntegration::GetSingleton().Initialize();
                        
                        // Load furniture database (must be loaded before scenes for furniture validation)
                        OStimNavigator::FurnitureDatabase::GetSingleton().LoadFurnitureTypes();
                        
                        // Load action database (must be loaded before scenes)
                        OStimNavigator::ActionDatabase::GetSingleton().LoadActions();
                        
                        // Load actor properties database
                        OStimNavigator::ActorPropertiesDatabase::GetSingleton().LoadActorProperties();

                        // Load scene database
                        OStimNavigator::SceneDatabase::GetSingleton().LoadScenes();

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

    return true;
}
