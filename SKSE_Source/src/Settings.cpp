#include "Settings.h"
#include <Windows.h>
#include <filesystem>
#include <algorithm>
#include <spdlog/spdlog.h>

void Settings::Load() {
    std::filesystem::path iniPath =
        std::filesystem::current_path() / "Data/SKSE/Plugins/OStimNavigator.ini";

    const auto path = iniPath.string();

    toggleNavigatorKey = static_cast<uint32_t>(
        GetPrivateProfileIntA("Hotkeys", "ToggleNavigator", 0, path.c_str()));

    char levelBuf[32] = {};
    GetPrivateProfileStringA("Debug", "LogLevel", "info", levelBuf, sizeof(levelBuf), path.c_str());
    logLevel = levelBuf;

    SKSE::log::info("Settings loaded from {}", path);
    SKSE::log::info("  ToggleNavigator key = 0x{:02X} ({})", toggleNavigatorKey, toggleNavigatorKey);
    SKSE::log::info("  LogLevel            = {}", logLevel);
}

void Settings::ApplyLogLevel() const {
    std::string lvl = logLevel;
    std::transform(lvl.begin(), lvl.end(), lvl.begin(), ::tolower);

    spdlog::level::level_enum spdlogLevel = spdlog::level::info; // default
    if      (lvl == "trace") spdlogLevel = spdlog::level::trace;
    else if (lvl == "debug") spdlogLevel = spdlog::level::debug;
    else if (lvl == "info")  spdlogLevel = spdlog::level::info;
    else if (lvl == "warn")  spdlogLevel = spdlog::level::warn;
    else if (lvl == "error") spdlogLevel = spdlog::level::err;
    else {
        SKSE::log::warn("Settings: unknown LogLevel '{}' — falling back to 'info'", logLevel);
    }

    spdlog::set_level(spdlogLevel);
    SKSE::log::info("Log level set to '{}'", spdlog::level::to_string_view(spdlogLevel));
}
