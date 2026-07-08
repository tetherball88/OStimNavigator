#include "SkyrimNetIntegration.h"

namespace OStimNavigator {

    void SkyrimNetIntegration::Initialize()
    {
        m_hDLL = ::LoadLibraryA("SkyrimNet");
        if (!m_hDLL) {
            SKSE::log::info("SkyrimNetIntegration: SkyrimNet.dll not found — LLM generation unavailable.");
            return;
        }

        m_sendPrompt = reinterpret_cast<FnSendPrompt>(
            ::GetProcAddress(m_hDLL, "PublicSendCustomPromptToLLM"));

        if (m_sendPrompt) {
            SKSE::log::info("SkyrimNetIntegration: PublicSendCustomPromptToLLM resolved.");
        } else {
            SKSE::log::warn("SkyrimNetIntegration: PublicSendCustomPromptToLLM not found — "
                            "SkyrimNet API v8+ required.");
        }
    }

    bool SkyrimNetIntegration::SendGenerateDescription(
        const std::string& contextJson,
        std::function<void(std::string response, bool success)> callback)
    {
        if (!m_sendPrompt) {
            SKSE::log::warn("SkyrimNetIntegration: SendGenerateDescription called but API unavailable.");
            return false;
        }

        return m_sendPrompt(
            "ostimnet_generate_scene_description",
            "default",
            contextJson.c_str(),
            [callback](const char* response, int success) {
                callback(response ? std::string(response) : "", success != 0);
            });
    }
}
