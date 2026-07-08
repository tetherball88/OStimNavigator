#pragma once
#include "PCH.h"
#include "PrismaUI_API.h"
#include "SceneDatabase.h"
#include "OStimIntegration.h"

namespace OStimNavigator {

    class PrismaUIManager : public RE::BSTEventSink<RE::InputEvent*> {
    public:
        static PrismaUIManager& GetSingleton() {
            static PrismaUIManager singleton;
            return singleton;
        }

        void Initialize();
        void Show();
        void Hide();
        void Destroy();

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

        // Called by the UI on mousedown when the view has lost focus.
        static void OnRefocusView(const char* /*unused*/);

        // Called by the UI to log a message to the SKSE log.
        static void OnLog(const char* message);

        // Called by the UI Generate button — sends the scene context to the SkyrimNet LLM
        // and returns the generated description via receiveGeneratedDescription(text).
        static void OnGenerateDescription(const char* sceneId);

        // OStim thread event callback — updates the UI when the current node changes.
        static void OnOStimThreadEvent(OstimNG_API::Thread::ThreadEvent eventType, uint32_t threadID, void* userData);

        // Called by the UI when a text input gains/loses focus — toggles keyboard input blocking.
        // Argument: "true" or "false"
        static void OnSetTextInputFocus(const char* focused);

        bool IsAvailable() const { return prismaUI != nullptr; }
        bool IsViewValid() const { return prismaUI && prismaUI->IsValid(view); }
        void InvokeScript(const char* script) { if (IsViewValid()) prismaUI->Invoke(view, script); }

        // RE::BSTEventSink<RE::InputEvent*>
        RE::BSEventNotifyControl ProcessEvent(RE::InputEvent* const* a_event,
            RE::BSTEventSource<RE::InputEvent*>* a_source) override;

    private:
        PRISMA_UI_API::IVPrismaUI1* prismaUI = nullptr;
        PrismaView view = 0;
        bool initialized = false;
        bool isListeningInput = false;
        bool m_pausedGame = false;
        bool m_textInputFocused = false;

        void StartListeningInput();
        void StopListeningInput();
        void SetGamePaused(bool pause);
        void CheckTextInputFocus();
        void SetTextInputFocus(bool focused);

        static void OnDomReady(PrismaView view);

        PrismaUIManager() = default;
        ~PrismaUIManager() = default;
        PrismaUIManager(const PrismaUIManager&) = delete;
        PrismaUIManager& operator=(const PrismaUIManager&) = delete;
    };

}
