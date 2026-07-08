#include "PrismaUIManager.h"
#include "KeyboardInputBlocker.h"
#include "Settings.h"
#include "ActionDatabase.h"
#include "OStimNetMetaData.h"
#include "OStimIntegration.h"
#include "SceneDescriptionBuilder.h"
#include "SceneDescriptionData.h"
#include "SkyrimNetIntegration.h"
#include <nlohmann/json.hpp>
#include <algorithm>
#include <fstream>
#include <thread>
#include <chrono>

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

    void PrismaUIManager::SetGamePaused(bool pause) {
        if (pause) {
            if (!m_pausedGame) {
                if (auto* ui = RE::UI::GetSingleton()) {
                    ui->numPausesGame++;
                    m_pausedGame = true;
                    SKSE::log::debug("PrismaUIManager: game paused (numPausesGame={})", ui->numPausesGame);
                }
            }
        } else {
            if (m_pausedGame) {
                if (auto* ui = RE::UI::GetSingleton()) {
                    if (ui->numPausesGame > 0) {
                        ui->numPausesGame--;
                    }
                    SKSE::log::debug("PrismaUIManager: game unpaused (numPausesGame={})", ui->numPausesGame);
                }
                m_pausedGame = false;
            }
        }
    }

    RE::BSEventNotifyControl PrismaUIManager::ProcessEvent(
        RE::InputEvent* const* a_event,
        RE::BSTEventSource<RE::InputEvent*>* /*a_source*/)
    {
        if (!a_event || !*a_event) return RE::BSEventNotifyControl::kContinue;

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

            // Toggle: show and focus if not visible, hide if visible.
            SKSE::GetTaskInterface()->AddTask([]() {
                auto& mgr = PrismaUIManager::GetSingleton();
                if(mgr.prismaUI && mgr.IsViewValid()) {
                    if (mgr.prismaUI->HasFocus(mgr.view)) {
                        SKSE::log::debug("PrismaUIManager: hotkey Unfocus(view={})", mgr.view);
                        mgr.prismaUI->Unfocus(mgr.view);
                    } else {
                        SKSE::log::debug("PrismaUIManager: hotkey Focus(view={})", mgr.view);
                        mgr.prismaUI->Focus(mgr.view);
                    }
                    mgr.CheckTextInputFocus();
                }
                
            });
        }

        return RE::BSEventNotifyControl::kContinue;
    }

    // ─── public interface ────────────────────────────────────────────────────

    void PrismaUIManager::Initialize() {
        if (initialized) {
            return;
        }

        auto api = PRISMA_UI_API::RequestPluginAPI(PRISMA_UI_API::InterfaceVersion::V1);
        if (!api) {
            SKSE::log::info("PrismaUI not available — OStim Navigator will run without Prisma UI");
            return;
        }

        prismaUI = static_cast<PRISMA_UI_API::IVPrismaUI1*>(api);
        initialized = true;
        SKSE::log::info("PrismaUI initialized successfully for OStim Navigator");

        // Register for OStim thread events so we can track scene changes.
        if (auto* iface = OStimIntegration::GetSingleton().GetThreadInterface()) {
            iface->RegisterEventCallback(OnOStimThreadEvent, nullptr);
            SKSE::log::debug("PrismaUIManager: registered OStim thread event callback");
        }
    }

    void PrismaUIManager::Show() {
        if (!prismaUI) {
            return;
        }

        if (view && prismaUI->IsValid(view)) {
            prismaUI->Show(view);
            if(!prismaUI->HasFocus(view)) {
                prismaUI->Focus(view);
            }
            return;
        }

        auto newView = prismaUI->CreateView("OStimNavigator/index.html", OnDomReady);
        if (!newView) {
            SKSE::log::error("Failed to create PrismaUI view for OStim Navigator");
            return;
        }

        view = newView;
        prismaUI->RegisterJSListener(view, "saveSceneJson",        OnSaveSceneJson);
        prismaUI->RegisterJSListener(view, "requestSceneJson",    OnRequestSceneJson);
        prismaUI->RegisterJSListener(view, "requestAutoDescription", OnRequestAutoDescription);
        prismaUI->RegisterJSListener(view, "requestCustomDescription", OnRequestCustomDescription);
        prismaUI->RegisterJSListener(view, "saveCustomDescription",    OnSaveCustomDescription);
        prismaUI->RegisterJSListener(view, "requestSceneMeta",         OnRequestSceneMeta);
        prismaUI->RegisterJSListener(view, "saveSceneMeta",            OnSaveSceneMeta);
        prismaUI->RegisterJSListener(view, "closeNavigator",       OnCloseNavigator);
        prismaUI->RegisterJSListener(view, "warpToScene",          OnWarpToScene);
        prismaUI->RegisterJSListener(view, "refocusView",          OnRefocusView);
        prismaUI->RegisterJSListener(view, "generateDescription",  OnGenerateDescription);
        prismaUI->RegisterJSListener(view, "log",                  OnLog);
        prismaUI->RegisterJSListener(view, "setTextInputFocus",      OnSetTextInputFocus);
        SKSE::log::info("PrismaUI view created for OStim Navigator: {}", newView);

        StartListeningInput();
    }

    void PrismaUIManager::Hide() {
        if (!prismaUI || !view) {
            return;
        }

        SetTextInputFocus(false);
        KeyboardInputBlocker::SetBlocking(false);
        SetGamePaused(false);

        if (prismaUI->IsValid(view)) {
            prismaUI->Hide(view);
        }
    }

    void PrismaUIManager::Destroy() {
        if (!prismaUI || !view) {
            return;
        }

        // Ensure keyboard blocking is released if a text input was focused.
        SetTextInputFocus(false);
        KeyboardInputBlocker::SetBlocking(false);
        SetGamePaused(false);
        StopListeningInput();

        if (prismaUI->IsValid(view)) {
            SKSE::log::debug("PrismaUIManager: Destroy Unfocus(view={}, hasFocus={})", view, prismaUI->HasFocus(view));
            prismaUI->Unfocus(view);
            prismaUI->Hide(view);
        }

        PrismaView viewToDestroy = view;
        view = 0;  // mark invalid immediately so no new tasks use it

        // Unfocus is asynchronous — poll until focus is actually released, then destroy.
        std::thread([this, viewToDestroy]() {
            auto stillFocused = std::make_shared<std::atomic<bool>>(true);
            int maxWaitMs = 2000;
            int waited = 0;
            while (waited < maxWaitMs) {
                SKSE::GetTaskInterface()->AddTask([this, viewToDestroy, stillFocused]() {
                    stillFocused->store(prismaUI && prismaUI->IsValid(viewToDestroy) && prismaUI->HasFocus(viewToDestroy));
                });
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
                waited += 100;
                if (!stillFocused->load()) break;
                SKSE::log::debug("PrismaUIManager: waiting for unfocus... ({}ms)", waited);
            }
            SKSE::GetTaskInterface()->AddTask([this, viewToDestroy]() {
                if (prismaUI && prismaUI->IsValid(viewToDestroy)) {
                    SKSE::log::debug("PrismaUIManager: Destroy(view={})", viewToDestroy);
                    prismaUI->Destroy(viewToDestroy);
                }
            });
        }).detach();
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

    void PrismaUIManager::OnDomReady(PrismaView /*view*/) {
        SKSE::log::info("OStim Navigator PrismaUI DOM ready");
        SKSE::GetTaskInterface()->AddTask([]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (!mgr.IsViewValid()) return;
            if(!mgr.prismaUI->HasFocus(mgr.view)) {
                SKSE::log::debug("PrismaUIManager: OnDomReady Focus(view={})", mgr.view);
                mgr.prismaUI->Focus(mgr.view);
            }
            mgr.InvokeScript("showNavigator()");
            mgr.UpdateScenes();
            mgr.UpdateSceneSuggestions();
            mgr.UpdateOStimNetSuggestions();
            mgr.UpdateOStimNetSuggestions();

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
        });
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
        SKSE::GetTaskInterface()->AddTask([sceneId, content]() {
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
                    // effect immediately. DispatchStaticCall can crash inside Skyrim's
                    // own VM code if the "OData" class isn't registered yet (returns
                    // false and may null-deref internally), so guard carefully.
                    auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
                    if (vm) {
                        auto* args = RE::MakeFunctionArguments(RE::BSFixedString(sceneId.c_str()));
                        RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> callback =
                            RE::make_smart<NoOpCallback>();
                        bool dispatched = false;
                        try {
                            dispatched = vm->DispatchStaticCall("OData", "ReloadScene", args, callback);
                        } catch (const std::exception& e) {
                            SKSE::log::warn("OStim Navigator: OData.ReloadScene exception: {}", e.what());
                        } catch (...) {
                            SKSE::log::warn("OStim Navigator: OData.ReloadScene unknown exception");
                        }
                        delete args;
                        if (dispatched) {
                            SKSE::log::info("OStim Navigator: triggered OData.ReloadScene('{}')", sceneId);
                        } else {
                            SKSE::log::warn("OStim Navigator: OData.ReloadScene dispatch failed for '{}' (class not registered?)", sceneId);
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

    void PrismaUIManager::OnRefocusView(const char* /*unused*/) {
        SKSE::GetTaskInterface()->AddTask([]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            if (mgr.IsViewValid() && !mgr.prismaUI->HasFocus(mgr.view)) {
                SKSE::log::debug("PrismaUIManager: OnRefocusView Focus(view={})", mgr.view);
                mgr.prismaUI->Focus(mgr.view);
            }
        });
    }

    void PrismaUIManager::OnWarpToScene(const char* sceneId) {
        if (!sceneId || !*sceneId) return;
        std::string id(sceneId);
        SKSE::log::info("OStim Navigator: warp player thread to '{}'", id);

        SKSE::GetTaskInterface()->AddTask([id]() {
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
        SKSE::GetTaskInterface()->AddTask([]() {
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
        SKSE::GetTaskInterface()->AddTask([id, additionalInstructions]() {
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

    void PrismaUIManager::CheckTextInputFocus() {
        auto* controlMap = RE::ControlMap::GetSingleton();
        if (!controlMap) return;
        bool focus = prismaUI->HasFocus(view);
        if (focus && m_textInputFocused) {
            SetGamePaused(true);
            controlMap->AllowTextInput(false);
            KeyboardInputBlocker::SetBlocking(true);
        } else if (!focus || !m_textInputFocused) {
            SetGamePaused(false);
            controlMap->AllowTextInput(false);
            KeyboardInputBlocker::SetBlocking(false);
        }
    }

    void PrismaUIManager::SetTextInputFocus(bool focused) {
        if (focused) {
            m_textInputFocused = true;
            SKSE::log::debug("PrismaUIManager: text input focused — game hotkeys suppressed, game paused");
        } else if (!focused && m_textInputFocused) {
            m_textInputFocused = false;
            SKSE::log::debug("PrismaUIManager: text input unfocused — game hotkeys restored, game unpaused");
        }
    }

    void PrismaUIManager::OnSetTextInputFocus(const char* focused) {
        bool block = focused && (std::string_view(focused) == "true");
        SKSE::log::debug("OStim Navigator: setTextInputFocus → {}", block ? "focused" : "unfocused");
        SKSE::GetTaskInterface()->AddTask([block]() {
            auto& mgr = PrismaUIManager::GetSingleton();
            mgr.SetTextInputFocus(block);
            // Re-focus the view when a text input is activated — mirrors what the
            // hotkey toggle does (explicit Focus call). Without this, the CEF view
            // may not have keyboard focus and character keys will not reach the input.
            // if (block && mgr.IsViewValid()) {
            //     SKSE::log::info("PrismaUIManager: setTextInputFocus Unfocus(view={})", mgr.view);
            //     mgr.prismaUI->Unfocus(mgr.view);
            //     SKSE::log::info("PrismaUIManager: setTextInputFocus Focus(view={})", mgr.view);
            //     mgr.prismaUI->Focus(mgr.view);
            // }
            mgr.CheckTextInputFocus();
        });
    }

    void PrismaUIManager::OnOStimThreadEvent(
        OstimNG_API::Thread::ThreadEvent eventType,
        uint32_t threadID,
        void* /*userData*/)
    {
        // When the player thread (ID 0) finishes, hide and destroy the UI.
        if (eventType == OstimNG_API::Thread::ThreadEvent::ThreadEnded && threadID == 0) {
            SKSE::GetTaskInterface()->AddTask([]() {
                auto& mgr = PrismaUIManager::GetSingleton();
                if (!mgr.IsViewValid()) return;
                mgr.Hide();
                mgr.Destroy();
                SKSE::log::debug("PrismaUIManager: Player thread ended — Prisma UI hidden and destroyed.");
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

        SKSE::GetTaskInterface()->AddTask([id]() {
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

        SKSE::GetTaskInterface()->AddTask([id]() {
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
        SKSE::GetTaskInterface()->AddTask([sceneId, description]() {
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

        SKSE::GetTaskInterface()->AddTask([id]() {
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
        SKSE::GetTaskInterface()->AddTask([sceneId, meta]() {
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
        SKSE::GetTaskInterface()->AddTask([id]() {
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
