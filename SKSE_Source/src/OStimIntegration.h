#pragma once

#include "PCH.h"

/*
 * OStim integration using the new OstimNG Thread API.
 * Replaces the old SKSE message-based InterfaceMap approach.
 */

#include "OstimNG-API-Thread.h"

// ============================================================
// Navigator integration wrapper
// ============================================================
namespace OStimNavigator {

    class OStimIntegration {
    public:
        static OStimIntegration& GetSingleton() {
            static OStimIntegration instance;
            return instance;
        }

        void Initialize(const char* pluginName, REL::Version pluginVersion);

        bool IsOStimAvailable() const { return m_threadInterface != nullptr; }

        OstimNG_API::Thread::IThreadInterface* GetThreadInterface() const { return m_threadInterface; }

        // Returns thread IDs for all currently active threads (player + NPC).
        std::vector<uint32_t> GetActiveThreadIDs() const;

        // Convenience: look up an RE::Actor* from a thread actor slot.
        // Returns nullptr if unavailable.
        RE::Actor* GetActorFromThread(uint32_t threadID, uint32_t actorIndex) const;

    private:
        OStimIntegration() = default;
        OStimIntegration(const OStimIntegration&) = delete;
        OStimIntegration& operator=(const OStimIntegration&) = delete;

        OstimNG_API::Thread::IThreadInterface* m_threadInterface = nullptr;
    };
}
