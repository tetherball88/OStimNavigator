#pragma once

#include "PCH.h"

/*
 * OStim integration using the new OstimNG Thread API.
 * Replaces the old SKSE message-based InterfaceMap approach.
 */

// ============================================================
// OstimNG Thread API (from OStim SKSE Dev public API)
// ============================================================
namespace OstimNG_API::Thread
{
    enum class InterfaceVersion : uint8_t { V1 };

    enum class APIResult : uint8_t { OK, Invalid, Failed };

    enum class ThreadEvent : uint8_t
    {
        ThreadStarted,
        ThreadEnded,
        NodeChanged,
        ControlInput
    };

    enum class Controls : uint8_t
    {
        Up, Down, Left, Right, Toggle, Yes, No, Menu,
        KEY_HIDE, AlignMenu, SearchMenu
    };

    struct KeyData
    {
        int keyUp, keyDown, keyLeft, keyRight;
        int keyYes, keyEnd, keyToggle, keySearch;
        int keyAlignment, keySceneStart, keyNpcSceneStart;
        int keySpeedUp, keySpeedDown, keyPullOut;
        int keyAutoMode, keyFreeCam, keyHideUI;
    };

    typedef void (*ThreadEventCallback)(ThreadEvent eventType, uint32_t threadID, void* userData);
    typedef void (*ControlEventCallback)(Controls controlType, uint32_t threadID, void* userData);

    struct ActorData
    {
        uint32_t formID;
        float    excitement;
        bool     isFemale;
        bool     hasSchlong;
        int      timesClimaxed;
    };

    struct NavigationData
    {
        std::string sceneId;
        std::string destinationId;
        std::string icon;
        std::string description;
        std::string border;
        bool        isTransition;
    };

    struct ActorAlignmentData
    {
        float offsetX, offsetY, offsetZ;
        float scale, rotation, sosBend;
    };

    struct SceneSearchResult
    {
        std::string sceneId;
        std::string name;
        uint32_t    actorCount;
    };

    struct OptionsMenuItem
    {
        std::string id, title, icon, border, description;
    };

    class IThreadInterface
    {
    public:
        virtual uint32_t    GetPlayerThreadID() noexcept = 0;
        virtual bool        IsThreadValid(uint32_t threadID) noexcept = 0;
        virtual const char* GetCurrentSceneID(uint32_t threadID) noexcept = 0;
        virtual uint32_t    GetActorCount(uint32_t threadID) noexcept = 0;
        virtual uint32_t    GetActors(uint32_t threadID, ActorData* buffer, uint32_t bufferSize) noexcept = 0;
        virtual uint32_t    GetNavigationCount(uint32_t threadID) noexcept = 0;
        virtual uint32_t    GetNavigationOptions(uint32_t threadID, NavigationData* buffer, uint32_t bufferSize) noexcept = 0;
        virtual APIResult   NavigateToScene(uint32_t threadID, const char* sceneID) noexcept = 0;
        virtual bool        IsTransition(uint32_t threadID) noexcept = 0;
        virtual bool        IsInSequence(uint32_t threadID) noexcept = 0;
        virtual bool        IsAutoMode(uint32_t threadID) noexcept = 0;
        virtual bool        IsPlayerControlDisabled(uint32_t threadID) noexcept = 0;
        virtual void        RegisterEventCallback(ThreadEventCallback callback, void* userData) noexcept = 0;
        virtual void        UnregisterEventCallback(ThreadEventCallback callback) noexcept = 0;
        virtual void        RegisterControlCallback(ControlEventCallback callback, void* userData) noexcept = 0;
        virtual void        UnregisterControlCallback(ControlEventCallback callback) noexcept = 0;
        virtual void        SetExternalUIEnabled(bool enabled) noexcept = 0;
        virtual void        GetKeyData(KeyData* outData) noexcept = 0;
        virtual const char* GetCurrentNodeName(uint32_t threadID) noexcept = 0;
        virtual int32_t     GetCurrentSpeed(uint32_t threadID) noexcept = 0;
        virtual int32_t     GetMaxSpeed(uint32_t threadID) noexcept = 0;
        virtual APIResult   SetSpeed(uint32_t threadID, int32_t speed) noexcept = 0;
        virtual bool        GetActorAlignment(uint32_t threadID, uint32_t actorIndex, ActorAlignmentData* outData) noexcept = 0;
        virtual APIResult   SetActorAlignment(uint32_t threadID, uint32_t actorIndex, const ActorAlignmentData* data) noexcept = 0;
        virtual uint32_t    SearchScenes(const char* query, SceneSearchResult* buffer, uint32_t bufferSize) noexcept = 0;
        virtual bool        GetSceneInfo(const char* sceneID, SceneSearchResult* outInfo) noexcept = 0;
        virtual APIResult   NavigateToSearchResult(uint32_t threadID, const char* sceneID) noexcept = 0;
        virtual void        RebuildOptionsTree() noexcept = 0;
        virtual uint32_t    GetOptionsItemCount() noexcept = 0;
        virtual uint32_t    GetOptionsItems(OptionsMenuItem* buffer, uint32_t bufferSize) noexcept = 0;
        virtual bool        SelectOptionsItem(int32_t index) noexcept = 0;
        virtual bool        IsOptionsAtRoot() noexcept = 0;
    };

    using _RequestPluginAPI_Thread = IThreadInterface* (*)(InterfaceVersion, const char*, REL::Version);

    inline IThreadInterface* GetAPI(const char* pluginName, REL::Version pluginVersion)
    {
        const auto ostim = GetModuleHandleA("OStim.dll");
        if (!ostim)
            return nullptr;

        const auto requestAPI = reinterpret_cast<_RequestPluginAPI_Thread>(
            reinterpret_cast<void*>(GetProcAddress(ostim, "RequestPluginAPI_Thread")));
        if (!requestAPI)
            return nullptr;

        return requestAPI(InterfaceVersion::V1, pluginName, pluginVersion);
    }
}

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
