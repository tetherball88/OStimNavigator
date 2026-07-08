#pragma once

#include <cstdint>
#include <string>

// Loaded once at kDataLoaded from Data/SKSE/Plugins/OStimNavigator.ini.
class Settings {
public:
    static Settings& GetSingleton() {
        static Settings singleton;
        return singleton;
    }

    void Load();

    // Applies the logLevel field to the spdlog default logger.
    // Must be called after both SetupLogging() and Load().
    void ApplyLogLevel() const;

    // DirectInput key code for the toggle-navigator hotkey.
    // 0 = disabled. Only fires when the player is in an active OStim scene.
    uint32_t toggleNavigatorKey = 0;

    // Minimum log level written to OstimNavigator.log.
    // Accepted values (case-insensitive): trace, debug, info, warn, error.
    // Default: info
    std::string logLevel = "info";

private:
    Settings() = default;
    Settings(const Settings&) = delete;
    Settings& operator=(const Settings&) = delete;
};
