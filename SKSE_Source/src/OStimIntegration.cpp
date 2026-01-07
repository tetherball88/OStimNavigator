#include "OStimIntegration.h"

namespace OStimNavigator {
    void OStimIntegration::Initialize() {
        OStim::InterfaceExchangeMessage msg;
        const auto* messagingInterface = SKSE::GetMessagingInterface();

        if (!messagingInterface) {
            return;
        }

        messagingInterface->Dispatch(
            OStim::InterfaceExchangeMessage::MESSAGE_TYPE,
            &msg,
            sizeof(msg),
            "OStim"
        );

        if (!msg.interfaceMap) {
            return;
        }

        m_interfaceMap = msg.interfaceMap;
        m_threadInterface = m_interfaceMap->getInterface<OStim::ThreadInterface>(OStim::ThreadInterface::NAME);
    }

    std::vector<OStim::Thread*> OStimIntegration::GetActiveThreads() const {
        std::vector<OStim::Thread*> activeThreads;

        if (!m_threadInterface) {
            return activeThreads;
        }

        // Check thread ID 0 (player thread)
        OStim::Thread* playerThread = m_threadInterface->getThread(0);
        if (playerThread && (uintptr_t)playerThread > 0x10000) {
            activeThreads.push_back(playerThread);
        }

        // Check thread IDs 1-15 (NPC threads)
        for (int32_t i = 1; i <= 15; ++i) {
            OStim::Thread* thread = m_threadInterface->getThread(i);
            if (thread && (uintptr_t)thread > 0x10000) {
                activeThreads.push_back(thread);
            }
        }

        return activeThreads;
    }
}
