#include "PrismaUIManager.h"
#include "Settings.h"
#include "ActionDatabase.h"
#include "OStimNetMetaData.h"
#include "OStimIntegration.h"
#include "SceneDescriptionBuilder.h"
#include "SceneDescriptionData.h"
#include "SkyrimNetIntegration.h"
#include <nlohmann/json.hpp>
#include <algorithm>
#include <chrono>
#include <filesystem>
#include <fstream>
#include <memory>
#include <string_view>
#include <thread>
#include <type_traits>
#include <utility>
#include <Windows.h>

namespace {

    // All suggestion lists are defined in SceneDescriptionData.h.

    // ─────────────────────────────────────────────────────────────────────────

    // Functor that receives the OThread.IsRunning(0) return value and pushes it
    // to the UI via updatePlayerThreadRunning(true/false).
    struct IsRunningCallback : RE::BSScript::IStackCallbackFunctor {
        void operator()(RE::BSScript::Variable a_result) override {
            bool running = a_result.IsBool() ? a_result.GetBool() : false;
            SKSE::GetTaskInterface()->AddTask([running]() {
                auto& mgr = OStimNavigator::PrismaUIManager::GetSingleton();
                if (!mgr.IsViewValid()) return;
                std::string script = "updatePlayerThreadRunning(";
                script += running ? "true" : "false";
                script += ")";
                mgr.InvokeScript(script.c_str());
            });
        }
        void SetObject(const RE::BSTSmartPointer<RE::BSScript::Object>&) override {}
    };

    std::string GetPagePath() {
        wchar_t buf[MAX_PATH]{};
        GetModuleFileNameW(nullptr, buf, MAX_PATH);
        auto p = std::filesystem::path(buf).parent_path()
               / L"Data" / L"Magelight" / L"OStimNavigator" / L"views" / L"OStimNavigator" / L"index.html";
        const auto u = p.u8string();
        return std::string(reinterpret_cast<const char*>(u.data()), u.size());
    }

    template <typename FnType>
    void GameTaskTrampoline(void* user) {
        std::unique_ptr<FnType> fn(static_cast<FnType*>(user));
        (*fn)();
    }

    template <typename Callable>
    void PostToGameThread(Callable&& callable) {
        using FnType = std::decay_t<Callable>;
        auto* heapFn = new FnType(std::forward<Callable>(callable));

        auto* ml = OStimNavigator::PrismaUIManager::GetSingleton().GetMagelight();
        if (ml && ml->hostVersionNumber >= 3001) {
            if (ml->PostGameTask(&GameTaskTrampoline<FnType>, heapFn) != MAGELIGHT_API::Result::Ok) {
                delete heapFn;
            }
        } else {
            std::thread([heapFn]() {
                SKSE::GetTaskInterface()->AddTask([heapFn]() {
                    std::unique_ptr<FnType> fn(heapFn);
                    (*fn)();
                });
            }).detach();
        }
    }
}

namespace OStimNavigator {

    // ─── scene serialisation ────────────────────────────────────────────────

    static nlohmann::json SerializeScenes() {
        auto& db = SceneDatabase::GetSingleton();
        if (!db.IsLoaded()) return nlohmann::json::array();

        std::vector<nlohmann::json> entries;
        entries.reserve(db.GetSceneCount());

        for (auto* scene : db.GetAllScenes()) {
            if (!scene) continue;

            // skip swapped variants (same as SKSE table)
            std::string idLower = scene->id;
            std::transform(idLower.begin(), idLower.end(), idLower.begin(), ::tolower);
            if (idLower.find("swapped") != std::string::npos) continue;

            nlohmann::json actors = nlohmann::json::array();
            for (const auto& a : scene->actors) {
                nlohmann::json actor;
                actor["intendedSex"] = a.intendedSex;
                actor["tags"] = a.tags;
                actors.push_back(actor);
            }

            nlohmann::json actions = nlohmann::json::array();
            for (const auto& ac : scene->actions) {
                nlohmann::json action;
                action["type"]      = ac.type;
                action["actor"]     = ac.actor;
                action["target"]    = ac.target;
                action["performer"] = ac.performer;
                actions.push_back(action);
            }

            nlohmann::json entry;
            entry["id"]               = scene->id;
            entry["name"]             = scene->name;
            entry["modpack"]          = scene->modpack;
            entry["actorCount"]       = scene->actorCount;
            entry["furnitureType"]    = scene->furnitureType;
            entry["tags"]             = scene->tags;
            entry["actions"]          = actions;
            entry["actors"]           = actors;
            entry["isTransition"]     = scene->isTransition;
            entry["noRandomSelection"]= scene->noRandomSelection;
            {
                const auto* directDesc = OStimNetMetaData::GetSingleton().GetDescription(scene->id);
                const auto* effectiveDesc = OStimNetMetaData::GetSingleton().GetEffectiveDescription(scene->id);
                entry["hasCustomDescription"] = (effectiveDesc != nullptr && !effectiveDesc->description.empty());
                entry["descriptionInherited"] = (effectiveDesc != nullptr && !effectiveDesc->description.empty() && directDesc == nullptr);
            }

            entries.push_back(std::move(entry));
        }

        // Sort alphabetically by scene id.
        std::sort(entries.begin(), entries.end(), [](const nlohmann::json& a, const nlohmann::json& b) {
            return a["id"].get_ref<const std::string&>() < b["id"].get_ref<const std::string&>();
        });

        nlohmann::json arr = nlohmann::json::array();
        for (auto& e : entries) arr.push_back(std::move(e));
        return arr;
    }

    // Functor that receives OThread.GetScene(0) and pushes sorted scenes + current scene to the UI.
    struct GetSceneCallback : RE::BSScript::IStackCallbackFunctor {
        void operator()(RE::BSScript::Variable a_result) override {
            std::string currentId = a_result.IsString() ? std::string(a_result.GetString()) : "";
            SKSE::GetTaskInterface()->AddTask([currentId]() {
                auto& mgr = PrismaUIManager::GetSingleton();
                if (!mgr.IsViewValid()) return;
                std::string json = SerializeScenes().dump();
                mgr.InvokeScript(("updateScenes(" + json + ")").c_str());
                mgr.InvokeScript(("updateCurrentScene(" + nlohmann::json(currentId).dump() + ")").c_str());
                mgr.UpdateCurrentThread();
                SKSE::log::debug("PrismaUIManager: pushed {} scenes to UI (current: '{}')",
                    SceneDatabase::GetSingleton().GetSceneCount(), currentId);
            });
        }
        void SetObject(const RE::BSTSmartPointer<RE::BSScript::Object>&) override {}
    };

    // No-op callback for fire-and-forget Papyrus calls where we don't need the return value.
    // DispatchStaticCall crashes with a null BSTSmartPointer, so always pass one of these.
    struct NoOpCallback : RE::BSScript::IStackCallbackFunctor {
        void operator()(RE::BSScript::Variable) override {}
        void SetObject(const RE::BSTSmartPointer<RE::BSScript::Object>&) override {}
    };

    // Helper: escape content as a JS template-literal argument and call fn(content) in the UI.
    static void InvokeWithString(PrismaUIManager& mgr, const char* fn, const std::string& content) {
        std::string escaped;
        escaped.reserve(content.size());
        for (char c : content) {
            if (c == '\\') escaped += "\\\\";
            else if (c == '`')  escaped += "\\`";
            else if (c == '$')  escaped += "\\$";
            else escaped += c;
        }
        mgr.InvokeScript((std::string(fn) + "(`" + escaped + "`)").c_str());
    }

    // ─── input listening ─────────────────────────────────────────────────────

    void PrismaUIManager::StartListeningInput() {
        if (isListeningInput) return;
        if (auto* dm = RE::BSInputDeviceManager::GetSingleton()) {
            dm->AddEventSink(this);
            isListeningInput = true;
            SKSE::log::debug("PrismaUIManager: started listening for input events");
        }
    }

    void PrismaUIManager::StopListeningInput() {
        if (!isListeningInput) return;
        if (auto* dm = RE::BSInputDeviceManager::GetSingleton()) {
            dm->RemoveEventSink(this);
            isListeningInput = false;
            SKSE::log::debug("PrismaUIManager: stopped listening for input events");
        }
    }

    bool PrismaUIManager::HasFocus() const {
        if (hasUIMode.load()) return true;
        return magelight && modId != 0 && magelight->GetUIModeOwner() == modId;
    }

    void PrismaUIManager::SetFocus(bool shouldFocus) {
        if (!IsViewValid()) return;

        if (shouldFocus) {
            magelight->RaiseView(view);
            std::uint32_t flags = MAGELIGHT_API::kUIModeFlagNone;
            if (magelight->hostVersionNumber >= 10100 && magelight->QueryCapability("uimodecancel") == 1) {
                flags |= MAGELIGHT_API::kUIModeFlagReclaim;
            }
            auto res = magelight->RequestUIMode(view, flags);
            if (res != MAGELIGHT_API::Result::Ok) {
                SKSE::log::warn("Magelight RequestUIMode refused ({}): {}",
                    static_cast<int>(res), magelight->GetLastErrorMessage(modId));
            }
            SyncConsoleLayering();
        } else {
            if (magelight->hostVersionNumber >= 10100 && magelight->QueryCapability("uimodecancel") == 1) {
                magelight->CancelUIModeRequest(modId);
            }
            magelight->ReleaseUIMode(modId);
            hasUIMode.store(false);
            SetGamePaused(false);
            SyncConsoleLayering();
        }
    }

    void PrismaUIManager::UpdateKeys() {
        if (!IsViewValid()) return;

        nlohmann::json j = {
            {"toggleNavigatorKey", Settings::GetSingleton().toggleNavigatorKey}
        };
        InvokeScript(("updateKeys(" + j.dump() + ")").c_str());
    }

    RE::BSEventNotifyControl PrismaUIManager::ProcessEvent(
        RE::InputEvent* const* a_event,
        RE::BSTEventSource<RE::InputEvent*>* /*a_source*/)
    {
        if (!a_event || !*a_event || !IsViewValid() || !isCurrentlyVisible || HasFocus()) {
            return RE::BSEventNotifyControl::kContinue;
        }

        const uint32_t hotkeyCode = Settings::GetSingleton().toggleNavigatorKey;
        if (hotkeyCode == 0) return RE::BSEventNotifyControl::kContinue;

        for (auto* event = *a_event; event; event = event->next) {
            auto* button = event->AsButtonEvent();
            if (!button || !button->IsDown()) continue;
            if (button->GetDevice() != RE::INPUT_DEVICE::kKeyboard) continue;
            if (button->GetIDCode() != hotkeyCode) continue;

            // Only act when the player is in an active OStim scene.
            auto* iface = OStimIntegration::GetSingleton().GetThreadInterface();
            if (!iface) continue;
            const uint32_t INVALID_THREAD = static_cast<uint32_t>(-1);
            if (iface->GetPlayerThreadID() == INVALID_THREAD) continue;

            SKSE::log::debug("PrismaUIManager: hotkey SetFocus(true) (view={})", view);
            SetFocus(true);
            break;
        }

        return RE::BSEventNotifyControl::kContinue;
    }

    RE::BSEventNotifyControl PrismaUIManager::ProcessEvent(
        const RE::MenuOpenCloseEvent* a_event,
        RE::BSTEventSource<RE::MenuOpenCloseEvent>* /*a_source*/)
    {
        if (!a_event) {
            return RE::BSEventNotifyControl::kContinue;
        }

        const std::string_view name = a_event->menuName.c_str() ? a_event->menuName.c_str() : "";
        if (name == RE::Console::MENU_NAME || name == "MagelightOverlay" || name == "MagelightFocus") {
            SyncConsoleLayering();
        }

        return RE::BSEventNotifyControl::kContinue;
    }

    void PrismaUIManager::SetGamePaused(bool pause) {
        desiredGamePause.store(pause);
        PostToGameThread([this]() {
            const bool wantPause = desiredGamePause.load() && isCurrentlyVisible && hasUIMode.load();
            if (wantPause == appliedGamePause) {
                return;
            }
            if (auto* ui = RE::UI::GetSingleton()) {
                if (wantPause) {
                    ++ui->numPausesGame;
                    appliedGamePause = true;
                } else {
                    if (ui->numPausesGame > 0) {
                        --ui->numPausesGame;
                    }
                    appliedGamePause = false;
                }
                SKSE::log::debug("PrismaUIManager: game pause -> {} (numPausesGame={})",
                    appliedGamePause, ui->numPausesGame);
            }
        });
    }

    void PrismaUIManager::SyncConsoleLayering() {
        PostToGameThread([this]() {
            auto* ui = RE::UI::GetSingleton();
            if (!ui) return;

            auto overlayMenu = ui->GetMenu("MagelightOverlay");
            auto consoleMenu = ui->GetMenu(RE::Console::MENU_NAME);

            // Render MagelightOverlay above Skyrim's native Console (depth 12, below Cursor Menu at 13)
            // whenever OStim Navigator is visible, and restore Magelight's default (9) when hidden.
            if (overlayMenu) {
                overlayMenu->depthPriority = isCurrentlyVisible ? 12 : 9;
            }

            if (consoleMenu) {
                consoleMenu->depthPriority = (isCurrentlyVisible && HasFocus()) ? 9 : 12;
            }

            if (overlayMenu && consoleMenu) {
                std::ptrdiff_t overlayIdx = -1;
                std::ptrdiff_t consoleIdx = -1;
                for (std::uint32_t i = 0; i < ui->menuStack.size(); ++i) {
                    if (ui->menuStack[i].get() == overlayMenu.get()) {
                        overlayIdx = static_cast<std::ptrdiff_t>(i);
                    } else if (ui->menuStack[i].get() == consoleMenu.get()) {
                        consoleIdx = static_cast<std::ptrdiff_t>(i);
                    }
                }
                if (isCurrentlyVisible && overlayIdx >= 0 && consoleIdx >= 0 && overlayIdx < consoleIdx) {
                    std::rotate(
                        ui->menuStack.begin() + overlayIdx,
                        ui->menuStack.begin() + overlayIdx + 1,
                        ui->menuStack.begin() + consoleIdx + 1);
                } else if (!isCurrentlyVisible && overlayIdx >= 0 && consoleIdx >= 0 && overlayIdx > consoleIdx) {
                    std::rotate(
                        ui->menuStack.begin() + consoleIdx,
                        ui->menuStack.begin() + overlayIdx,
                        ui->menuStack.begin() + overlayIdx + 1);
                }
            }
        });
    }

    // ─── public interface ────────────────────────────────────────────────────

    void PrismaUIManager::Initialize() {
        if (initialized) {
            return;
        }

        auto api = MAGELIGHT_API::RequestApi4();
        if (!api) {
            SKSE::log::info("Magelight UI not available — OStim Navigator will run without Magelight UI");
            return;
        }

        MAGELIGHT_API::ModDesc desc{};
        desc.size = sizeof(desc);
        desc.modId = "OStimNavigator";
        desc.displayName = "OStim Navigator";
        desc.modVersion = MAGELIGHT_API::PackVersion(0, 0, 1);
        desc.minHostVersion = MAGELIGHT_API::PackVersion(0, 28, 0);
        desc.callbackThread = MAGELIGHT_API::CallbackThread::GameThread;
        desc.onEvent = &PrismaUIManager::OnMagelightEvent;
        desc.onLog = nullptr;
        desc.user = this;
        desc.sessionName = nullptr;

        MAGELIGHT_API::ModId registeredMod = 0;
        auto res = api->RegisterMod(&desc, &registeredMod);
        if (res != MAGELIGHT_API::Result::Ok || !registeredMod) {
            SKSE::log::error("Failed to register OStimNavigator with Magelight UI (result={})", static_cast<int>(res));
            return;
        }

        magelight = api;
        modId = registeredMod;
        initialized = true;
        SKSE::log::info("Magelight UI (host {}) initialized successfully for OStim Navigator (modId={})",
            magelight->hostVersion ? magelight->hostVersion : "?", modId);

        const std::string pagePath = GetPagePath();
        MAGELIGHT_API::ViewDesc vd{};
        vd.size = sizeof(vd);
        vd.name = "OStimNavigator";
        vd.htmlPath = pagePath.c_str();
        vd.anchor = MAGELIGHT_API::Anchor::TopLeft;
        vd.fullscreen = true;
        vd.clickThrough = false;
        vd.startVisible = false;
        vd.layer = MAGELIGHT_API::Layer::Popup;
        vd.uiScale = 0.0f;
        vd.onDomReady = nullptr;

        MAGELIGHT_API::ViewId newView = 0;
        res = magelight->CreateViewEx(modId, &vd, &newView);
        if (res != MAGELIGHT_API::Result::Ok || !newView) {
            SKSE::log::error("Failed to create Magelight view ({}): {}",
                static_cast<int>(res), magelight->GetLastErrorMessage(modId));
            return;
        }

        view = newView;
        isCurrentlyVisible = false;
        domReady = false;
        pendingShowOnDomReady = false;

        magelight->RegisterJSListener(view, "saveSceneJson",            OnSaveSceneJson);
        magelight->RegisterJSListener(view, "requestSceneJson",         OnRequestSceneJson);
        magelight->RegisterJSListener(view, "requestAutoDescription",   OnRequestAutoDescription);
        magelight->RegisterJSListener(view, "requestCustomDescription", OnRequestCustomDescription);
        magelight->RegisterJSListener(view, "saveCustomDescription",    OnSaveCustomDescription);
        magelight->RegisterJSListener(view, "requestSceneMeta",         OnRequestSceneMeta);
        magelight->RegisterJSListener(view, "saveSceneMeta",            OnSaveSceneMeta);
        magelight->RegisterJSListener(view, "closeNavigator",           OnCloseNavigator);
        magelight->RegisterJSListener(view, "warpToScene",              OnWarpToScene);
        magelight->RegisterJSListener(view, "toggleFocus",              OnToggleFocus);
        magelight->RegisterJSListener(view, "forwardKey",               OnForwardKey);
        magelight->RegisterJSListener(view, "setTextInputFocus",        OnSetTextInputFocus);
        magelight->RegisterJSListener(view, "setModalOpen",             OnSetModalOpen);
        magelight->RegisterJSListener(view, "generateDescription",      OnGenerateDescription);
        magelight->RegisterJSListener(view, "log",                      OnLog);

        if (magelight->hostVersionNumber >= 2800 && magelight->QueryCapability("escapecapture") == 1) {
            magelight->SetEscapeCapture(view, true);
        }

        if (magelight->hostVersionNumber >= 3111 && magelight->QueryCapability("prepaint") == 1) {
            magelight->SetViewPrepaint(view, true);
        }

        if (magelight->hostVersionNumber >= 10900 && magelight->QueryCapability("focusShare") == 1) {
            magelight->SetViewFocusSharing(view, MAGELIGHT_API::kFocusShareGive | MAGELIGHT_API::kFocusShareTake);
        }

        SKSE::log::info("Magelight persistent view created for OStim Navigator: {} ({})", newView, pagePath);

        // Register for OStim thread events so we can track scene changes.
        if (auto* iface = OStimIntegration::GetSingleton().GetThreadInterface()) {
            iface->RegisterEventCallback(OnOStimThreadEvent, nullptr);
            SKSE::log::debug("PrismaUIManager: registered OStim thread event callback");
        }

        if (auto* ui = RE::UI::GetSingleton()) {
            ui->AddEventSink<RE::MenuOpenCloseEvent>(this);
        }

        StartListeningInput();
    }

    void PrismaUIManager::Show() {
        if (!IsViewValid()) {
            return;
        }

        magelight->ShowView(view, true);
        magelight->RaiseView(view);
        isCurrentlyVisible = true;
        SyncViewBounds();
        if (!HasFocus()) {
            SetFocus(true);
        }
        SyncConsoleLayering();

        if (!domReady) {
            pendingShowOnDomReady = true;
            return;
        }

        pendingShowOnDomReady = false;
        InvokeScript("showNavigator()");
        UpdateKeys();
        UpdateScenes();
        UpdateSceneSuggestions();
        UpdateOStimNetSuggestions();

        // Query whether the player's thread (ID 0) is currently running and
        // tell the UI so it can show the warp-to-scene button column.
        auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
        if (vm) {
            auto* args = RE::MakeFunctionArguments((int)0);
            RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> cb =
                RE::make_smart<IsRunningCallback>();
            vm->DispatchStaticCall("OThread", "IsRunning", args, cb);
            delete args;
        }
    }

    void PrismaUIManager::Hide() {
        if (!IsViewValid()) {
            return;
        }

        pendingShowOnDomReady = false;

        if (HasFocus()) {
            SetFocus(false);
        } else if (magelight->hostVersionNumber >= 10100 && magelight->QueryCapability("uimodecancel") == 1) {
            magelight->CancelUIModeRequest(modId);
        }

        InvokeScript("hideNavigator()");
        magelight->ShowView(view, false);
        isCurrentlyVisible = false;
        SetGamePaused(false);
        SyncConsoleLayering();
    }

    void PrismaUIManager::UpdateSceneSuggestions() {
        if (!IsViewValid()) return;

        auto& actionDB = ActionDatabase::GetSingleton();

        // Action types — collected from ActionDatabase (all loaded action types, sorted).
        auto actionTypes = actionDB.GetAllActionTypes();

        // Action tag map — { actionType: [tag, ...] } for every loaded action type.
        nlohmann::json actionTagSuggestions = nlohmann::json::object();
        for (const auto& type : actionTypes) {
            auto tags = actionDB.GetActionTags(type);
            actionTagSuggestions[type] = tags;
        }

        nlohmann::json suggestions;
        suggestions["actionTypes"]        = actionTypes;
        suggestions["actorTags"]          = kActorTagSuggestions;
        suggestions["sceneTags"]          = OStimNetMetaData::GetPositionSuggestions();
        suggestions["actionTagSuggestions"] = actionTagSuggestions;

        std::string json = suggestions.dump();
        InvokeScript(("updateSceneSuggestions(" + json + ")").c_str());
        SKSE::log::debug("PrismaUIManager: pushed scene suggestions ({} actionTypes, {} actionTagEntries) to UI",
            actionTypes.size(), actionTagSuggestions.size());
    }

    void PrismaUIManager::UpdateScenes() {
        if (!IsViewValid()) return;

        SKSE::GetTaskInterface()->AddTask([]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (!mgr.IsViewValid()) return;

            // Ask Papyrus for the current scene on player thread (0) so we can pin
            // it to the top of the list. Falls back to unsorted if VM unavailable.
            auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
            if (vm) {
                auto* args = RE::MakeFunctionArguments((int)0);
                RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> cb =
                    RE::make_smart<GetSceneCallback>();
                vm->DispatchStaticCall("OThread", "GetScene", args, cb);
                delete args;
            } else {
                std::string json = SerializeScenes().dump();
                mgr.InvokeScript(("updateScenes(" + json + ")").c_str());
                mgr.InvokeScript("updateCurrentScene('')");
                mgr.UpdateCurrentThread();
                SKSE::log::debug("PrismaUIManager: pushed {} scenes to UI (fallback, no VM)", SceneDatabase::GetSingleton().GetSceneCount());
            }
        });
    }

    void PrismaUIManager::UpdateCurrentThread() {
        if (!IsViewValid()) return;

        auto* iface = OStimIntegration::GetSingleton().GetThreadInterface();
        if (!iface) return;

        const uint32_t INVALID_THREAD = static_cast<uint32_t>(-1);
        uint32_t threadID = iface->GetPlayerThreadID();
        if (threadID != INVALID_THREAD && iface->IsThreadValid(threadID)) {
            uint32_t actorCount = iface->GetActorCount(threadID);
            std::vector<OstimNG_API::Thread::ActorData> actors(actorCount);
            if (actorCount > 0) {
                iface->GetActors(threadID, actors.data(), actorCount);
            }

            std::vector<char> genders;
            for (const auto& actor : actors) {
                genders.push_back(actor.isFemale ? 'f' : 'm');
            }
            std::sort(genders.begin(), genders.end(), [](char a, char b) {
                auto getOrder = [](char c) {
                    if (c == 'f') return 0;
                    if (c == 'm') return 1;
                    return 2;
                };
                return getOrder(a) < getOrder(b);
            });
            std::string genderSetup(genders.begin(), genders.end());

            const char* rawSceneID = iface->GetCurrentSceneID(threadID);
            std::string sceneID = rawSceneID ? rawSceneID : "";
            std::string furnitureType = "";
            if (!sceneID.empty()) {
                auto* sceneData = SceneDatabase::GetSingleton().GetSceneByID(sceneID);
                if (sceneData) {
                    furnitureType = sceneData->furnitureType;
                }
            }

            nlohmann::json threadData;
            threadData["genderSetup"] = genderSetup;
            threadData["furniture"] = furnitureType;
            InvokeScript(("updateCurrentThread(" + threadData.dump() + ")").c_str());
            SKSE::log::debug("PrismaUIManager: pushed current thread details (setup: '{}', furniture: '{}') to UI",
                genderSetup, furnitureType);
        } else {
            InvokeScript("updateCurrentThread(null)");
        }
    }

    void PrismaUIManager::OnMagelightEvent(const MAGELIGHT_API::EventData* ev, void* user) {
        auto* mgr = static_cast<PrismaUIManager*>(user);
        if (!mgr || !ev || !mgr->magelight) {
            return;
        }

        switch (ev->type) {
            case MAGELIGHT_API::Event::ViewDomReady:
            case MAGELIGHT_API::Event::ViewReloaded: {
                if (ev->view != mgr->view) return;
                SKSE::log::info("OStim Navigator Magelight view {} {}: syncing state",
                    ev->view, ev->type == MAGELIGHT_API::Event::ViewDomReady ? "DOM ready" : "reloaded");

                mgr->domReady = true;
                mgr->SyncViewBounds();
                mgr->UpdateKeys();
                mgr->UpdateSceneSuggestions();
                mgr->UpdateOStimNetSuggestions();
                mgr->UpdateScenes();

                if (mgr->isCurrentlyVisible || mgr->pendingShowOnDomReady) {
                    mgr->pendingShowOnDomReady = false;
                    mgr->Show();
                }
                break;
            }

            case MAGELIGHT_API::Event::UIModeEntered: {
                if (ev->view == mgr->view) {
                    mgr->hasUIMode.store(true);
                    mgr->hasKeyFocus.store(true);
                    SKSE::log::debug("Magelight UI mode entered for OStim Navigator (view={})", ev->view);
                    if (!mgr->isCurrentlyVisible) {
                        mgr->Hide();
                    } else {
                        mgr->SyncConsoleLayering();
                    }
                }
                break;
            }

            case MAGELIGHT_API::Event::UIModeExited:
            case MAGELIGHT_API::Event::UIModeRefused: {
                mgr->hasUIMode.store(false);
                mgr->hasKeyFocus.store(false);
                mgr->SetGamePaused(false);
                mgr->SyncConsoleLayering();
                SKSE::log::debug("Magelight UI mode exited/refused (view={}, detail='{}')",
                    ev->view, ev->detail ? ev->detail : "");
                break;
            }

            case MAGELIGHT_API::Event::KeyFocusGained: {
                if (ev->view == mgr->view) {
                    mgr->hasKeyFocus.store(true);
                    SKSE::log::debug("Magelight key focus gained for OStim Navigator (view={}, from={}, mod='{}')",
                        ev->view, ev->x, ev->detail ? ev->detail : "");
                }
                break;
            }

            case MAGELIGHT_API::Event::KeyFocusLost: {
                if (ev->view == mgr->view) {
                    mgr->hasKeyFocus.store(false);
                    mgr->SetGamePaused(false);
                    SKSE::log::debug("Magelight key focus lost for OStim Navigator (view={}, to={}, mod='{}')",
                        ev->view, ev->x, ev->detail ? ev->detail : "");
                }
                break;
            }

            case MAGELIGHT_API::Event::ViewDestroyed:
            case MAGELIGHT_API::Event::RenderDead:
            case MAGELIGHT_API::Event::HostShutdown: {
                mgr->hasUIMode.store(false);
                mgr->hasKeyFocus.store(false);
                mgr->isCurrentlyVisible = false;
                mgr->pendingShowOnDomReady = false;
                mgr->domReady = false;
                mgr->SetGamePaused(false);
                mgr->SyncConsoleLayering();
                if (ev->type == MAGELIGHT_API::Event::ViewDestroyed && ev->view == mgr->view) {
                    mgr->view = 0;
                }
                break;
            }

            case MAGELIGHT_API::Event::ViewLoadFailed: {
                SKSE::log::error("Magelight view {} failed to load: {}",
                    ev->view, ev->detail ? ev->detail : "unknown error");
                break;
            }

            default:
                break;
        }
    }

    // window.saveSceneJson(JSON.stringify({id, content})) → single-argument payload
    void PrismaUIManager::OnSaveSceneJson(const char* argument) {
        if (!argument) return;

        std::string sceneId;
        std::string content;
        try {
            auto j = nlohmann::json::parse(argument);
            sceneId = j.at("id").get<std::string>();
            content = j.at("content").get<std::string>();
        } catch (const nlohmann::json::exception& e) {
            SKSE::log::error("OStim Navigator: invalid saveSceneJson payload: {}", e.what());
            return;
        }

        SKSE::log::info("OStim Navigator: saving scene JSON for '{}'", sceneId);

        // Look up the file path on the game thread (fast in-memory map lookup).
        PostToGameThread([sceneId, content]() {
            auto& mgr = PrismaUIManager::GetSingleton();

            auto filePath = SceneDatabase::GetSingleton().FindSceneFilePath(sceneId);
            if (filePath.empty()) {
                SKSE::log::warn("OStim Navigator: scene '{}' not found — cannot save", sceneId);
                if (mgr.IsViewValid()) mgr.InvokeScript("receiveSaveSceneJson(false)");
                return;
            }

            // Validate the JSON and write to disk on a background thread so the
            // game loop is not blocked by I/O or JSON parsing.
            std::thread([sceneId, content, filePath]() {
                // Validate that the content is well-formed JSON before writing.
                try {
                    (void)nlohmann::json::parse(content);
                } catch (const nlohmann::json::exception& e) {
                    SKSE::log::error("OStim Navigator: invalid JSON for '{}': {}", sceneId, e.what());
                    SKSE::log::error("OStim Navigator: raw content was: {}", content);
                    SKSE::GetTaskInterface()->AddTask([]() {
                        auto& mgr = PrismaUIManager::GetSingleton();
                        if (mgr.IsViewValid()) mgr.InvokeScript("receiveSaveSceneJson(false)");
                    });
                    return;
                }

                std::ofstream file(filePath, std::ios::out | std::ios::trunc | std::ios::binary);
                if (!file.is_open()) {
                    SKSE::log::error("OStim Navigator: could not open '{}' for writing", filePath.string());
                    SKSE::GetTaskInterface()->AddTask([]() {
                        auto& mgr = PrismaUIManager::GetSingleton();
                        if (mgr.IsViewValid()) mgr.InvokeScript("receiveSaveSceneJson(false)");
                    });
                    return;
                }

                file << content;
                bool writeOk = !file.fail();
                file.close();

                if (!writeOk) {
                    SKSE::log::error("OStim Navigator: write failed for '{}'", filePath.string());
                    SKSE::GetTaskInterface()->AddTask([]() {
                        auto& mgr = PrismaUIManager::GetSingleton();
                        if (mgr.IsViewValid()) mgr.InvokeScript("receiveSaveSceneJson(false)");
                    });
                    return;
                }

                SKSE::log::info("OStim Navigator: saved scene '{}' → {}", sceneId, filePath.string());

                // Return to the game thread to update caches and fire Papyrus.
                // Pass the already-validated content so ReloadSceneFromContent can
                // skip the second disk read that ReloadScene would otherwise perform.
                SKSE::GetTaskInterface()->AddTask([sceneId, content, filePath]() {
                    auto& mgr = PrismaUIManager::GetSingleton();
                    if (mgr.IsViewValid()) mgr.InvokeScript("receiveSaveSceneJson(true)");

                    // Refresh the SKSE-side scene cache directly from the in-memory
                    // content — no second disk read needed.
                    SceneDatabase::GetSingleton().ReloadSceneFromContent(sceneId, content, filePath);

                    // Hot-reload just this scene on OStim's side so the change takes
                    // effect immediately. DispatchStaticCall crashes with a native
                    // access violation when the target function isn't registered —
                    // OData is always present, but ReloadScene only exists in OStim's
                    // hot-reload extension. Check the function actually exists on the
                    // type before dispatching; TypeIsValid alone is not enough.
                    auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
                    if (vm) {
                        // Look up the OData type and scan its static function list.
                        bool hasReloadScene = false;
                        RE::BSTSmartPointer<RE::BSScript::ObjectTypeInfo> typeInfo;
                        if (vm->GetScriptObjectType1("OData", typeInfo) && typeInfo) {
                            auto* funcIter = typeInfo->GetGlobalFuncIter();
                            uint32_t funcCount = typeInfo->GetNumGlobalFuncs();
                            for (uint32_t i = 0; i < funcCount; ++i) {
                                if (funcIter[i].func && funcIter[i].func->GetName() == "ReloadScene") {
                                    hasReloadScene = true;
                                    break;
                                }
                            }
                        }

                        if (hasReloadScene) {
                            auto* args = RE::MakeFunctionArguments(RE::BSFixedString(sceneId.c_str()));
                            RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> callback =
                                RE::make_smart<NoOpCallback>();
                            bool dispatched = vm->DispatchStaticCall("OData", "ReloadScene", args, callback);
                            delete args;
                            if (dispatched) {
                                SKSE::log::info("OStim Navigator: triggered OData.ReloadScene('{}')", sceneId);
                            } else {
                                SKSE::log::warn("OStim Navigator: OData.ReloadScene dispatch failed for '{}'", sceneId);
                            }
                        } else {
                            SKSE::log::info("OStim Navigator: skipping OData.ReloadScene for '{}' — function not registered (hot reload unavailable)", sceneId);
                        }
                    }
                });
            }).detach();
        });
    }

    void PrismaUIManager::OnLog(const char* message) {
        if (!message) return;
        std::string_view msg(message);
        if (msg.starts_with("warn|")) {
            SKSE::log::warn("webUI: {}", msg.substr(5));
        } else if (msg.starts_with("error|")) {
            SKSE::log::error("webUI: {}", msg.substr(6));
        } else if (msg.starts_with("info|")) {
            SKSE::log::info("webUI: {}", msg.substr(5));
        } else {
            SKSE::log::info("webUI: {}", msg);
        }
    }

    void PrismaUIManager::OnToggleFocus(const char* /*unused*/) {
        PostToGameThread([]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (mgr.IsViewValid()) {
                mgr.SetFocus(!mgr.HasFocus());
            }
        });
    }

    void PrismaUIManager::OnForwardKey(const char* argument) {
        if (!argument || !*argument) return;

        uint32_t scanCode = 0;
        bool isDown = false;
        try {
            auto j = nlohmann::json::parse(argument);
            scanCode = j.at("scanCode").get<uint32_t>();
            isDown = j.at("isDown").get<bool>();
        } catch (const std::exception& e) {
            SKSE::log::error("OStim Navigator: invalid forwardKey payload: {}", e.what());
            return;
        }

        if (scanCode == 0) return;

        PostToGameThread([scanCode, isDown]() {
            auto* dm = RE::BSInputDeviceManager::GetSingleton();
            if (!dm) return;

            auto* btn = RE::ButtonEvent::Create(
                RE::INPUT_DEVICE::kKeyboard,
                RE::BSFixedString(""),
                scanCode,
                isDown ? 1.0f : 0.0f,
                isDown ? 0.0f : 0.1f);
            if (!btn) return;

            // Snapshot sinks instead of calling dm->SendEvent(&ev), because
            // Magelight's InputSink unlinks every keyboard event in-place while
            // any view holds UI mode before downstream mod sinks (OStimPrism) run.
            std::vector<RE::BSTEventSink<RE::InputEvent*>*> sinks;
            {
                RE::BSSpinLockGuard locker(dm->lock);
                sinks.reserve(dm->sinks.size());
                for (auto* s : dm->sinks) {
                    if (s) {
                        sinks.push_back(s);
                    }
                }
            }

            auto* selfSink = static_cast<RE::BSTEventSink<RE::InputEvent*>*>(&PrismaUIManager::GetSingleton());
            HMODULE hGame = GetModuleHandleW(nullptr);
            HMODULE hMagelight = GetModuleHandleW(L"Magelight.dll");

            for (auto* sink : sinks) {
                if (!sink || sink == selfSink) continue;

                const void* vtbl = *reinterpret_cast<const void* const*>(sink);
                HMODULE hSinkMod = nullptr;
                if (GetModuleHandleExW(
                        GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
                        reinterpret_cast<LPCWSTR>(vtbl),
                        &hSinkMod)) {
                    if (hSinkMod == hGame || (hMagelight && hSinkMod == hMagelight)) {
                        continue;
                    }
                }

                btn->next = nullptr;
                RE::InputEvent* ev = btn;
                sink->ProcessEvent(&ev, dm);
            }

            RE::free(btn);
        });
    }

    void PrismaUIManager::OnSetTextInputFocus(const char* argument) {
        const bool focused = (argument && std::string_view(argument) == "true");
        GetSingleton().SetGamePaused(focused);
    }

    void PrismaUIManager::SyncViewBounds() {
        if (!IsViewValid()) return;
        std::int32_t dispW = 0;
        std::int32_t dispH = 0;
        magelight->GetDisplaySize(&dispW, &dispH);
        if (dispW <= 0 || dispH <= 0) return;

        if (isModalOpen) {
            magelight->SetViewBounds(view, 0, 0, dispW, dispH);
            if (domReady) {
                InvokeScript("document.body.classList.remove('drawer-bounded');document.documentElement.style.removeProperty('--text-scale');");
            }
        } else {
            const std::int32_t drawerW = std::min(dispW, std::max<std::int32_t>(600, (dispW * 30) / 100));
            const std::int32_t drawerX = dispW - drawerW;
            magelight->SetViewBounds(view, drawerX, 0, drawerW, dispH);
            if (domReady) {
                const double scalePx = std::max(std::min(dispW * 0.0085, 30.0), 24.0);
                InvokeScript(("document.body.classList.add('drawer-bounded');document.documentElement.style.setProperty('--text-scale','" +
                    std::to_string(scalePx) + "px');").c_str());
            }
        }
    }

    void PrismaUIManager::OnSetModalOpen(const char* argument) {
        const bool open = (argument && std::string_view(argument) == "true");
        PostToGameThread([open]() {
            auto& mgr = GetSingleton();
            if (mgr.isModalOpen == open) return;
            mgr.isModalOpen = open;
            mgr.SyncViewBounds();
        });
    }

    void PrismaUIManager::OnWarpToScene(const char* sceneId) {
        if (!sceneId || !*sceneId) return;
        std::string id(sceneId);
        SKSE::log::info("OStim Navigator: warp player thread to '{}'", id);

        PostToGameThread([id]() {
            auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
            if (vm) {
                auto* args = RE::MakeFunctionArguments((int)0, std::string(id), false);
                RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> callback =
                    RE::make_smart<NoOpCallback>();
                vm->DispatchStaticCall("OThread", "WarpTo", args, callback);
                delete args;
            }
        });
    }

    void PrismaUIManager::OnCloseNavigator(const char* /*unused*/) {
        SKSE::log::debug("OStim Navigator: close requested from UI");
        PostToGameThread([]() {
            PrismaUIManager::GetSingleton().Hide();
        });
    }

    void PrismaUIManager::OnGenerateDescription(const char* argument) {
        if (!argument || !*argument) return;

        std::string id;
        std::string additionalInstructions;
        try {
            auto j = nlohmann::json::parse(argument);
            id                     = j.at("sceneId").get<std::string>();
            additionalInstructions = j.value("additionalInstructions", "");
        } catch (const std::exception& e) {
            SKSE::log::error("OStim Navigator: OnGenerateDescription — invalid argument: {}", e.what());
            return;
        }

        SKSE::log::debug("OStim Navigator: generateDescription for '{}'", id);

        // Build context JSON on the game thread — SceneDatabase is not thread-safe.
        PostToGameThread([id, additionalInstructions]() {
            nlohmann::json ctx;
            ctx["sceneId"]                = id;
            ctx["additionalInstructions"] = additionalInstructions;

            if (auto* scene = SceneDatabase::GetSingleton().GetSceneByID(id)) {
                ctx["sceneName"]    = scene->name;
                ctx["tags"]         = scene->tags;
                ctx["actorCount"]   = scene->actorCount;
                ctx["furnitureType"]= scene->furnitureType;

                std::vector<std::string> actionTypes;
                for (const auto& ac : scene->actions) actionTypes.push_back(ac.type);
                ctx["actions"] = actionTypes;

                // autoDescription — build programmatically
                ctx["autoDescription"] = BuildSceneDescription(*scene, 0);
            }

            // intent from OStimNetMetaData
            if (const auto* meta = OStimNetMetaData::GetSingleton().GetSceneMeta(id)) {
                ctx["intent"] = meta->intent;
            } else {
                ctx["intent"] = "";
            }

            std::string contextJson = ctx.dump();

            // Fire the LLM request — callback arrives on a SkyrimNet thread pool worker.
            bool queued = SkyrimNetIntegration::GetSingleton().SendGenerateDescription(
                contextJson,
                [](std::string response, bool success) {
                    SKSE::GetTaskInterface()->AddTask([response, success]() {
                        auto& mgr = PrismaUIManager::GetSingleton();
                        if (!mgr.IsViewValid()) return;
                        nlohmann::json result;
                        result["ok"] = success && !response.empty();
                        if (success && !response.empty()) {
                            result["text"] = response;
                        } else {
                            result["error"] = !response.empty() ? response : "Generation failed.";
                            if (!success)
                                SKSE::log::warn("PrismaUIManager: LLM generation failed: {}", response);
                        }
                        mgr.InvokeScript(("receiveGeneratedDescriptionResult(" + result.dump() + ")").c_str());
                    });
                });

            if (!queued) {
                auto& mgr = PrismaUIManager::GetSingleton();
                if (mgr.IsViewValid()) {
                    nlohmann::json result;
                    result["ok"]    = false;
                    result["error"] = "SkyrimNet API unavailable.";
                    mgr.InvokeScript(("receiveGeneratedDescriptionResult(" + result.dump() + ")").c_str());
                }
            }
        });
    }

    void PrismaUIManager::OnOStimThreadEvent(
        OstimNG_API::Thread::ThreadEvent eventType,
        uint32_t threadID,
        void* /*userData*/)
    {
        // When the player thread (ID 0) finishes, hide the persistent view.
        if (eventType == OstimNG_API::Thread::ThreadEvent::ThreadEnded && threadID == 0) {
            SKSE::GetTaskInterface()->AddTask([]() {
                auto& mgr = PrismaUIManager::GetSingleton();
                if (!mgr.IsViewValid()) return;
                mgr.Hide();
                SKSE::log::debug("PrismaUIManager: Player thread ended — Magelight UI hidden.");
            });
            return;
        }

        if (eventType != OstimNG_API::Thread::ThreadEvent::NodeChanged) return;

        // Do NOT call GetCurrentSceneID here — OStim may hold a lock when firing
        // the callback, and GetCurrentSceneID would try to acquire the same lock.
        // Schedule the query on the main game thread via AddTask instead.
        SKSE::GetTaskInterface()->AddTask([threadID]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (!mgr.IsViewValid()) return;

            auto* iface = OStimIntegration::GetSingleton().GetThreadInterface();
            if (!iface) return;

            const char* raw = iface->GetCurrentSceneID(threadID);
            std::string id = raw ? raw : "";

            mgr.InvokeScript(("updateCurrentScene(" + nlohmann::json(id).dump() + ")").c_str());
            mgr.UpdateCurrentThread();
            SKSE::log::debug("PrismaUIManager: NodeChanged → current scene '{}'", id);
        });
    }

    void PrismaUIManager::OnRequestAutoDescription(const char* sceneId) {
        if (!sceneId) return;
        std::string id(sceneId);
        SKSE::log::debug("OStim Navigator: requestAutoDescription for '{}'", id);

        PostToGameThread([id]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (!mgr.IsViewValid()) return;

            SceneData* scene = SceneDatabase::GetSingleton().GetSceneByID(id);
            if (!scene) {
                SKSE::log::warn("OStim Navigator: scene not found for auto-description '{}'", id);
                mgr.InvokeScript("receiveAutoDescription('')");
                return;
            }
            InvokeWithString(mgr, "receiveAutoDescription", BuildSceneDescription(*scene, 0));
        });
    }

    void PrismaUIManager::OnRequestCustomDescription(const char* sceneId) {
        if (!sceneId) return;
        std::string id(sceneId);
        SKSE::log::debug("OStim Navigator: requestCustomDescription for '{}'", id);

        PostToGameThread([id]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (!mgr.IsViewValid()) return;

            const auto* entry = OStimNetMetaData::GetSingleton().GetEffectiveDescription(id);
            InvokeWithString(mgr, "receiveCustomDescription", entry ? entry->description : "");
        });
    }

    void PrismaUIManager::OnSaveCustomDescription(const char* argument) {
        if (!argument) return;

        std::string sceneId;
        std::string description;
        try {
            auto j = nlohmann::json::parse(argument);
            sceneId     = j.at("sceneId").get<std::string>();
            description = j.at("description").get<std::string>();
        } catch (const std::exception& e) {
            SKSE::log::error("OStim Navigator: saveCustomDescription — invalid argument: {}", e.what());
            return;
        }

        SKSE::log::debug("OStim Navigator: saveCustomDescription for '{}'", sceneId);

        // Gather cache info on the game thread, then do file I/O in background.
        PostToGameThread([sceneId, description]() {
            OStimNetMetaData::GetSingleton().SaveDescriptionAsync(sceneId, description,
                [](bool ok) {
                    auto& mgr = PrismaUIManager::GetSingleton();
                    if (mgr.IsViewValid()) {
                        mgr.InvokeScript(ok ? "receiveCustomDescriptionSaved(true)"
                                            : "receiveCustomDescriptionSaved(false)");
                    }
                });
        });
    }

    void PrismaUIManager::UpdateOStimNetSuggestions() {
        if (!IsViewValid()) return;

        nlohmann::json suggestions;
        suggestions["intents"]   = kOStimNetIntents;
        suggestions["positions"] = OStimNetMetaData::GetPositionSuggestions();

        std::string json = suggestions.dump();
        InvokeScript(("updateOStimNetSuggestions(" + json + ")").c_str());
        SKSE::log::debug("PrismaUIManager: pushed OStimNet suggestions to UI");
    }

    void PrismaUIManager::OnRequestSceneMeta(const char* sceneId) {
        if (!sceneId) return;
        std::string id(sceneId);
        SKSE::log::debug("OStim Navigator: requestSceneMeta for '{}'", id);

        PostToGameThread([id]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (!mgr.IsViewValid()) return;

            const auto* meta = OStimNetMetaData::GetSingleton().GetSceneMeta(id);
            nlohmann::json result;
            if (meta) {
                result["intent"]    = meta->intent;
                result["positions"] = meta->positions;
            } else {
                result["intent"]    = "";
                result["positions"] = nlohmann::json::array();
            }
            mgr.InvokeScript(("receiveSceneMeta(" + result.dump() + ")").c_str());
        });
    }

    void PrismaUIManager::OnSaveSceneMeta(const char* argument) {
        if (!argument) return;

        std::string sceneId;
        SceneMeta meta;
        try {
            auto j = nlohmann::json::parse(argument);
            sceneId      = j.at("sceneId").get<std::string>();
            meta.intent  = j.value("intent", "");
            if (j.contains("positions") && j["positions"].is_array()) {
                for (const auto& p : j["positions"]) {
                    if (p.is_string()) meta.positions.push_back(p.get<std::string>());
                }
            }
        } catch (const std::exception& e) {
            SKSE::log::error("OStim Navigator: saveSceneMeta — invalid argument: {}", e.what());
            return;
        }

        SKSE::log::debug("OStim Navigator: saveSceneMeta for '{}'", sceneId);

        // Gather cache info on the game thread, then do file I/O in background.
        PostToGameThread([sceneId, meta]() {
            OStimNetMetaData::GetSingleton().SaveSceneMetaAsync(sceneId, meta,
                [](bool ok) {
                    auto& mgr = PrismaUIManager::GetSingleton();
                    if (mgr.IsViewValid()) {
                        mgr.InvokeScript(ok ? "receiveSceneMetaSaved(true)"
                                            : "receiveSceneMetaSaved(false)");
                    }
                });
        });
    }

    void PrismaUIManager::OnRequestSceneJson(const char* sceneId) {
        if (!sceneId) return;
        std::string id(sceneId);
        SKSE::log::debug("OStim Navigator: requestSceneJson for '{}'", id);

        // Get the file path on the game thread (fast in-memory map lookup).
        PostToGameThread([id]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (!mgr.IsViewValid()) return;

            auto filePath = SceneDatabase::GetSingleton().FindSceneFilePath(id);
            if (filePath.empty()) {
                SKSE::log::warn("OStim Navigator: scene file not found for '{}'", id);
                mgr.InvokeScript("receiveSceneJson('')");
                return;
            }

            // Read the file on a background thread to avoid stalling the game loop.
            std::thread([filePath]() {
                std::ifstream file(filePath, std::ios::binary);
                std::string raw;
                if (file.is_open()) {
                    raw.assign(std::istreambuf_iterator<char>(file),
                               std::istreambuf_iterator<char>());
                }

                SKSE::GetTaskInterface()->AddTask([raw]() {
                    auto& mgr = PrismaUIManager::GetSingleton();
                    if (!mgr.IsViewValid()) return;
                    if (raw.empty()) {
                        mgr.InvokeScript("receiveSceneJson('')");
                    } else {
                        InvokeWithString(mgr, "receiveSceneJson", raw);
                    }
                });
            }).detach();
        });
    }

}
