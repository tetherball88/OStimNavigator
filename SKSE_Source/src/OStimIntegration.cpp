#include "OStimIntegration.h"

namespace OStimNavigator {

    void OStimIntegration::Initialize(const char* pluginName, REL::Version pluginVersion)
    {
        SKSE::log::info("OStimIntegration: Initializing with new OstimNG Thread API...");

        m_threadInterface = OstimNG_API::Thread::GetAPI(pluginName, pluginVersion);

        if (m_threadInterface) {
            SKSE::log::info("OStimIntegration: Successfully acquired IThreadInterface.");
        } else {
            SKSE::log::warn("OStimIntegration: OStim.dll not found or RequestPluginAPI_Thread unavailable. "
                            "OStim integration disabled.");
        }
    }

    std::vector<uint32_t> OStimIntegration::GetActiveThreadIDs() const
    {
        std::vector<uint32_t> result;
        if (!m_threadInterface) {
            SKSE::log::warn("OStimIntegration::GetActiveThreadIDs: Thread interface not available.");
            return result;
        }

        SKSE::log::debug("OStimIntegration::GetActiveThreadIDs: Starting thread scan...");

        // Player thread - API returns -1 if no thread, cast to uint32_t will give max uint
        uint32_t playerID = m_threadInterface->GetPlayerThreadID();
        SKSE::log::debug("OStimIntegration::GetActiveThreadIDs: GetPlayerThreadID() returned: {} (0x{:X})", playerID, playerID);
        
        const uint32_t INVALID_THREAD = static_cast<uint32_t>(-1);
        if (playerID != INVALID_THREAD) {
            result.push_back(playerID);
            SKSE::log::info("OStimIntegration::GetActiveThreadIDs: Found player thread ID: {}", playerID);
        } else {
            SKSE::log::info("OStimIntegration::GetActiveThreadIDs: No player thread active (returned {})", playerID);
        }

        // NPC threads – poll a reasonable range; skip the player ID already added
        int npcCount = 0;
        for (uint32_t i = 1; i <= 15; ++i) {
            if (i == playerID)
                continue;
            
            bool isValid = m_threadInterface->IsThreadValid(i);
            SKSE::log::debug("OStimIntegration::GetActiveThreadIDs: IsThreadValid({}) = {}", i, isValid);
            
            if (isValid) {
                result.push_back(i);
                npcCount++;
                SKSE::log::info("OStimIntegration::GetActiveThreadIDs: Found NPC thread ID: {}", i);
            }
        }
        SKSE::log::info("OStimIntegration::GetActiveThreadIDs: Total active threads: {} (player: {}, NPCs: {})", result.size(), (playerID != INVALID_THREAD) ? 1 : 0, npcCount);

        return result;
    }

    RE::Actor* OStimIntegration::GetActorFromThread(uint32_t threadID, uint32_t actorIndex) const
    {
        if (!m_threadInterface) {
            SKSE::log::warn("OStimIntegration::GetActorFromThread: Thread interface not available.");
            return nullptr;
        }

        uint32_t count = m_threadInterface->GetActorCount(threadID);
        if (actorIndex >= count) {
            SKSE::log::warn("OStimIntegration::GetActorFromThread: Actor index {} out of range for thread {}. Actor count: {}", actorIndex, threadID, count);
            return nullptr;
        }

        SKSE::log::debug("OStimIntegration::GetActorFromThread: Fetching actor {} from thread {}. Total actors: {}", actorIndex, threadID, count);

        // Fetch all actors and pick the one at actorIndex
        std::vector<OstimNG_API::Thread::ActorData> buffer(count);
        uint32_t filled = m_threadInterface->GetActors(threadID, buffer.data(), count);
        if (actorIndex >= filled) {
            SKSE::log::warn("OStimIntegration::GetActorFromThread: Failed to fetch actor {}. Buffer filled: {}/{}", actorIndex, filled, count);
            return nullptr;
        }

        uint32_t formID = buffer[actorIndex].formID;
        if (!formID) {
            SKSE::log::warn("OStimIntegration::GetActorFromThread: Actor {} has invalid formID (0).", actorIndex);
            return nullptr;
        }

        auto* form = RE::TESForm::LookupByID(formID);
        if (!form) {
            SKSE::log::warn("OStimIntegration::GetActorFromThread: Failed to lookup form 0x{:X} for actor {}.", formID, actorIndex);
            return nullptr;
        }

        auto* actor = form->As<RE::Actor>();
        if (actor) {
            SKSE::log::debug("OStimIntegration::GetActorFromThread: Successfully retrieved actor {} from thread {}: {}", actorIndex, threadID, actor->GetName());
        } else {
            SKSE::log::warn("OStimIntegration::GetActorFromThread: Form 0x{:X} is not an Actor.", formID);
        }
        return actor;
    }
}
