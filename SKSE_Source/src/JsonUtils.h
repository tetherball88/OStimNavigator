#pragma once

#include <filesystem>
#include <functional>

namespace OStimNavigator {
    namespace JsonUtils {
        
        // Load JSON files from a directory with a callback for each file
        // Callback signature: void(const std::filesystem::path& filePath)
        inline void LoadJsonFilesFromDirectory(
            const std::filesystem::path& directory,
            std::function<void(const std::filesystem::path&)> parseCallback,
            bool recursive = false) {
            
            if (!std::filesystem::exists(directory)) {
                SKSE::log::warn("Directory not found: {}", directory.string());
                return;
            }

            SKSE::log::info("Loading JSON files from: {}", directory.string());

            try {
                if (recursive) {
                    for (const auto& entry : std::filesystem::recursive_directory_iterator(directory)) {
                        if (entry.is_regular_file() && entry.path().extension() == ".json") {
                            parseCallback(entry.path());
                        }
                    }
                } else {
                    for (const auto& entry : std::filesystem::directory_iterator(directory)) {
                        if (entry.is_regular_file() && entry.path().extension() == ".json") {
                            parseCallback(entry.path());
                        }
                    }
                }
            } catch (const std::exception& e) {
                SKSE::log::error("Error loading JSON files from {}: {}", directory.string(), e.what());
            }
        }
    }
}
