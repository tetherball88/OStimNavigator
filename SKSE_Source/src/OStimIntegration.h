#pragma once

#include "PCH.h"

// Forward declarations from OStim
namespace OStim {
    class InterfaceMap;
    class PluginInterface;
    class ThreadInterface;
    class Thread;
    class ThreadActor;
    class Action;
    class ActionType;

    struct InterfaceExchangeMessage {
        enum : uint32_t {
            MESSAGE_TYPE = 'OST'  // 0x4F5354
        };
        InterfaceMap* interfaceMap = nullptr;
    };

    class InterfaceMap {
    public:
        virtual PluginInterface* queryInterface(const char* name) = 0;
        virtual bool addInterface(const char* name, PluginInterface* pluginInterface) = 0;
        virtual PluginInterface* removeInterface(const char* name) = 0;

        // Helper template for easier casting
        template <typename T>
        T* getInterface(const char* name) {
            return static_cast<T*>(queryInterface(name));
        }
    };

    class PluginInterface {
    public:
        virtual ~PluginInterface(){};
        virtual uint32_t getVersion() = 0;
    };

    class ThreadActor {
    public:
        // cast this to RE::Actor*
        virtual void* getGameActor() = 0;
    };

    class ActionType {
    public:
        virtual const char* getActionID() = 0;
    };

    class Action {
    public:
        virtual ActionType* getType() = 0;
    };

    class Node {
    public:
        virtual const char* getNodeID() = 0;
        virtual uint32_t getActionCount() = 0;
        virtual Action* getAction(uint32_t index) = 0;
    };

    class ThreadActorVisitor {
    public:
        virtual bool visit(ThreadActor* actor) = 0;
    };

    class Thread {
    public:
        virtual int32_t getThreadID() = 0;
        virtual bool isPlayerThread() = 0;
        virtual uint32_t getActorCount() = 0;
        virtual ThreadActor* getActor(uint32_t position) = 0;
        virtual void forEachThreadActor(ThreadActorVisitor* visitor) = 0;
        virtual Node* getCurrentNode() = 0;
    };

    class ThreadEventListener {
    public:
        virtual void listen(Thread* thread) = 0;
    };

    class ThreadActorEventListener {
    public:
        virtual void listen(Thread* thread, ThreadActor* actor) = 0;
    };

    class ThreadInterface : public PluginInterface {
    public:
        inline static const char* NAME = "Threads";
        virtual Thread* getThread(int32_t threadID) = 0;
        virtual void registerThreadStartListener(ThreadEventListener* listener) = 0;
        virtual void registerSpeedChangedListener(ThreadEventListener* listener) = 0;
        virtual void registerNodeChangedListener(ThreadEventListener* listener) = 0;
        virtual void registerClimaxListener(ThreadActorEventListener* listener) = 0;
        virtual void registerThreadStopListener(ThreadEventListener* listener) = 0;
    };
}

namespace OStimNavigator {
    class OStimIntegration {
    public:
        static OStimIntegration& GetSingleton() {
            static OStimIntegration instance;
            return instance;
        }

        // Initialize OStim integration by requesting the InterfaceMap
        void Initialize();

        // Check if OStim is loaded and integrated
        bool IsOStimAvailable() const { return m_threadInterface != nullptr; }

        // Get thread interface
        OStim::ThreadInterface* GetThreadInterface() const { return m_threadInterface; }

        // Get all active threads by brute-force querying (checks thread IDs 0-99)
        std::vector<OStim::Thread*> GetActiveThreads() const;

    private:
        OStimIntegration() = default;
        ~OStimIntegration() = default;
        OStimIntegration(const OStimIntegration&) = delete;
        OStimIntegration& operator=(const OStimIntegration&) = delete;

        OStim::InterfaceMap* m_interfaceMap = nullptr;
        OStim::ThreadInterface* m_threadInterface = nullptr;
    };
}
