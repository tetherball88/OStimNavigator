#pragma once
#include "PCH.h"
#include "MagelightUI_API.h"
#include "SceneDatabase.h"
#include "OStimIntegration.h"
#include <atomic>

namespace OStimNavigator {

    class PrismaUIManager :
        public RE::BSTEventSink<RE::InputEvent*>,
        public RE::BSTEventSink<RE::MenuOpenCloseEvent> {
    public:
        static PrismaUIManager& GetSingleton() {
            static PrismaUIManager singleton;
            return singleton;
        }

        void Initialize();
        void Show();
        void Hide();

        bool HasFocus() const;
        void SetFocus(bool shouldFocus);

        // Push hotkey configuration to the UI so focused-mode key handling stays in sync.
        void UpdateKeys();

        // Push the full scene list to the UI as JSON.
        void UpdateScenes();

        // Push current thread details (actors gender setup and furniture) to the UI.
        void UpdateCurrentThread();

        // Push autocomplete suggestion lists (actionTypes, actorTags, sceneTags) to the UI.
        void UpdateSceneSuggestions();

        // Called by the UI when the user saves an edited scene JSON (Ctrl+S).
        static void OnSaveSceneJson(const char* argument);

        // Called by the UI when it needs the raw JSON for a scene.
        static void OnRequestSceneJson(const char* sceneId);

        // Called by the UI when it needs the auto-generated description for a scene.
        static void OnRequestAutoDescription(const char* sceneId);

        // Called by the UI when it needs the saved custom description for a scene.
        static void OnRequestCustomDescription(const char* sceneId);

        // Called by the UI when the user saves a custom description override.
        // Argument format: JSON string { "sceneId": "...", "description": "..." }
        static void OnSaveCustomDescription(const char* argument);

        // Push OStimNet suggestion lists (intents, positions) to the UI.
        void UpdateOStimNetSuggestions();

        // Called by the UI when it needs the SceneMeta for a scene.
        static void OnRequestSceneMeta(const char* sceneId);

        // Called by the UI when the user saves scene meta.
        // Argument format: JSON string { "sceneId": "...", "intent": "...", "positions": [...] }
        static void OnSaveSceneMeta(const char* argument);

        // Called by the UI close button — hides the Prisma view.
        static void OnCloseNavigator(const char* /*unused*/);

        // Called by the UI play button — warps the player's thread to a scene.
        static void OnWarpToScene(const char* sceneId);

        // Called by the UI when the player presses the toggle-navigator hotkey while focused.
        static void OnToggleFocus(const char* /*unused*/);

        // Called by the UI to forward non-text-input OStim hotkeys while UI mode is active.
        static void OnForwardKey(const char* argument);

        // Called by the UI when focus enters or leaves a text input / Monaco editor.
        static void OnSetTextInputFocus(const char* argument);

        // Called by the UI when a fullscreen modal opens or closes so the view can expand/shrink.
        static void OnSetModalOpen(const char* argument);

        // Called by the UI to log a message to the SKSE log.
        static void OnLog(const char* message);

        // Called by the UI Generate button — sends the scene context to the SkyrimNet LLM
        // and returns the generated description via receiveGeneratedDescription(text).
        static void OnGenerateDescription(const char* sceneId);

        // OStim thread event callback — updates the UI when the current node changes.
        static void OnOStimThreadEvent(OstimNG_API::Thread::ThreadEvent eventType, uint32_t threadID, void* userData);

        const MAGELIGHT_API::MagelightApi4* GetMagelight() const { return magelight; }
        bool IsAvailable() const { return magelight != nullptr && modId != 0; }
        bool IsViewValid() const { return magelight && view != 0 && magelight->IsViewValid(view); }
        void InvokeScript(const char* script) { if (IsViewValid()) magelight->InvokeJS(view, script); }

        // RE::BSTEventSink<RE::InputEvent*>
        RE::BSEventNotifyControl ProcessEvent(RE::InputEvent* const* a_event,
            RE::BSTEventSource<RE::InputEvent*>* a_source) override;

        // RE::BSTEventSink<RE::MenuOpenCloseEvent>
        RE::BSEventNotifyControl ProcessEvent(const RE::MenuOpenCloseEvent* a_event,
            RE::BSTEventSource<RE::MenuOpenCloseEvent>* a_source) override;

    private:
        const MAGELIGHT_API::MagelightApi4* magelight = nullptr;
        MAGELIGHT_API::ModId modId = 0;
        MAGELIGHT_API::ViewId view = 0;
        std::atomic<bool> hasUIMode{false};
        std::atomic<bool> hasKeyFocus{false};
        std::atomic<bool> desiredGamePause{false};
        bool appliedGamePause = false;
        bool isModalOpen = false;
        bool initialized = false;
        bool isListeningInput = false;
        bool isCurrentlyVisible = false;
        bool domReady = false;
        bool pendingShowOnDomReady = false;

        void StartListeningInput();
        void StopListeningInput();
        void SetGamePaused(bool pause);
        void SyncConsoleLayering();
        void SyncViewBounds();

        static void OnMagelightEvent(const MAGELIGHT_API::EventData* ev, void* user);

        PrismaUIManager() = default;
        ~PrismaUIManager() = default;
        PrismaUIManager(const PrismaUIManager&) = delete;
        PrismaUIManager& operator=(const PrismaUIManager&) = delete;
    };

}
