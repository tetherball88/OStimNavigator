#pragma once
#include "PCH.h"
#include <functional>
#include <string>

namespace OStimNavigator {

    /**
     * Minimal wrapper around the SkyrimNet Public API.
     * Resolves PublicSendCustomPromptToLLM at runtime via LoadLibraryA/GetProcAddress.
     * Call Initialize() once during kDataLoaded.
     */
    class SkyrimNetIntegration {
    public:
        static SkyrimNetIntegration& GetSingleton() {
            static SkyrimNetIntegration instance;
            return instance;
        }

        // Resolve function pointers from SkyrimNet.dll.
        // Safe to call even when SkyrimNet is absent — IsAvailable() will return false.
        void Initialize();

        bool IsAvailable() const { return m_sendPrompt != nullptr; }

        // Sends a prompt named "ostim_scene_description" to the LLM with the
        // provided contextJson and calls callback(response, success) on completion.
        // The callback fires on a SkyrimNet ThreadPool worker — do NOT call RE::
        // functions from it. Use SKSE::GetTaskInterface()->AddTask() if needed.
        // Returns false immediately if the API is unavailable or queueing failed.
        bool SendGenerateDescription(
            const std::string& contextJson,
            std::function<void(std::string response, bool success)> callback);

    private:
        SkyrimNetIntegration() = default;
        SkyrimNetIntegration(const SkyrimNetIntegration&) = delete;
        SkyrimNetIntegration& operator=(const SkyrimNetIntegration&) = delete;

        // Matches the ABI declared in SkyrimNet_PublicAPI.h (v8+).
        using FnSendPrompt = bool(*)(
            const char* promptName,
            const char* variant,
            const char* contextJson,
            std::function<void(const char* response, int success)> callback);

        FnSendPrompt m_sendPrompt = nullptr;
        HMODULE      m_hDLL       = nullptr;
    };
}
