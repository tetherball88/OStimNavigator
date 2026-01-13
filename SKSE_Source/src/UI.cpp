#include "UI.h"
#include "ThreadExplorer.h"
#include "OStimIntegration.h"
#include "OStimNetIntegration.h"
#include <SKSEMenuFramework.h>

namespace OStimNavigator {
    namespace UI {
        namespace ActiveThreads {
            struct ThreadDisplayData {
                uint32_t threadID;
                bool isPlayerThread;
                uint32_t actorCount;
                std::string sceneID;
                std::string actorNames;
            };

            static std::vector<ThreadDisplayData> s_cachedThreadData;
            static std::chrono::steady_clock::time_point s_lastRefreshTime;
            static constexpr auto AUTO_REFRESH_INTERVAL = std::chrono::seconds(1);

            void RefreshThreadData() {
                SKSE::log::debug("UI::ActiveThreads::RefreshThreadData() called");
                s_cachedThreadData.clear();
                auto& ostim = OStimIntegration::GetSingleton();

                if (!ostim.IsOStimAvailable()) {
                    SKSE::log::warn("UI::ActiveThreads::RefreshThreadData: OStim not available");
                    return;
                }

                auto* iface = ostim.GetThreadInterface();
                if (!iface) {
                    SKSE::log::warn("UI::ActiveThreads::RefreshThreadData: ThreadInterface not available");
                    return;
                }

                uint32_t playerThreadID = iface->GetPlayerThreadID();
                SKSE::log::debug("UI::ActiveThreads::RefreshThreadData: Player thread ID: {}", playerThreadID);
                
                auto threadIDs = ostim.GetActiveThreadIDs();
                SKSE::log::debug("UI::ActiveThreads::RefreshThreadData: Retrieved {} active thread IDs", threadIDs.size());

                for (uint32_t tid : threadIDs) {
                    ThreadDisplayData data;
                    data.threadID = tid;
                    data.isPlayerThread = (tid == playerThreadID);
                    data.actorCount = iface->GetActorCount(tid);

                    // Current scene ID
                    const char* sceneID = iface->GetCurrentSceneID(tid);
                    data.sceneID = (sceneID && sceneID[0] != '\0') ? sceneID : "No scene";
                    SKSE::log::debug("UI::ActiveThreads::RefreshThreadData: Thread {} - Scene: {}, Actor count: {}", tid, data.sceneID, data.actorCount);

                    // Actor names via FormID lookup
                    std::string actorNames;
                    std::vector<OstimNG_API::Thread::ActorData> actors(data.actorCount);
                    uint32_t filled = iface->GetActors(tid, actors.data(), data.actorCount);
                    SKSE::log::debug("UI::ActiveThreads::RefreshThreadData: Thread {} - Fetched {}/{} actors", tid, filled, data.actorCount);
                    
                    for (uint32_t i = 0; i < filled; ++i) {
                        auto* form = RE::TESForm::LookupByID(actors[i].formID);
                        auto* actor = form ? form->As<RE::Actor>() : nullptr;
                        if (actor) {
                            const char* name = actor->GetName();
                            if (name && name[0] != '\0') {
                                if (!actorNames.empty()) actorNames += ", ";
                                actorNames += name;
                                SKSE::log::debug("UI::ActiveThreads::RefreshThreadData: Thread {} - Actor {}: {}", tid, i, name);
                            }
                        }
                    }
                    data.actorNames = actorNames.empty() ? "Unknown" : actorNames;
                    SKSE::log::debug("UI::ActiveThreads::RefreshThreadData: Thread {} - All actors: {}", tid, data.actorNames);

                    s_cachedThreadData.push_back(data);
                }
                SKSE::log::debug("UI::ActiveThreads::RefreshThreadData: Cached {} thread entries", s_cachedThreadData.size());
            }

            void __stdcall Render() {
                static bool firstRender = true;
                if (firstRender) {
                    SKSE::log::info("UI::ActiveThreads::Render() - First render call");
                    firstRender = false;
                }
                SKSE::log::debug("UI::ActiveThreads::Render() called");
                
                auto& ostim = OStimIntegration::GetSingleton();

                if (!ostim.IsOStimAvailable()) {
                    SKSE::log::warn("UI::ActiveThreads::Render: OStim not available");
                    ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(1.0f, 0.5f, 0.0f, 1.0f), "OStim not available");
                    ImGuiMCP::ImGui::TextWrapped("Make sure OStim is installed and loaded.");
                    return;
                }

                auto* iface = ostim.GetThreadInterface();
                if (!iface) {
                    SKSE::log::error("UI::ActiveThreads::Render: ThreadInterface not available");
                    ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(1.0f, 0.0f, 0.0f, 1.0f), "Error: ThreadInterface not available");
                    return;
                }

                // Auto-refresh every second
                auto now = std::chrono::steady_clock::now();
                if (s_lastRefreshTime.time_since_epoch().count() == 0 ||
                    now - s_lastRefreshTime >= AUTO_REFRESH_INTERVAL) {
                    SKSE::log::debug("UI::ActiveThreads::Render: Auto-refresh triggered");
                    RefreshThreadData();
                    s_lastRefreshTime = now;
                }

                // Display header with refresh button
                ImGuiMCP::ImGui::Text("Active OStim Threads: %zu", s_cachedThreadData.size());
                ImGuiMCP::ImGui::SameLine();
                if (ImGuiMCP::ImGui::Button("Refresh")) {
                    SKSE::log::debug("UI::ActiveThreads::Render: Manual refresh button clicked");
                    RefreshThreadData();
                }
                ImGuiMCP::ImGui::Separator();

                if (s_cachedThreadData.empty()) {
                    SKSE::log::debug("UI::ActiveThreads::Render: No active threads to display");
                    ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.7f, 0.7f, 0.7f, 1.0f), "No active threads");
                    return;
                }

                // Create a table for thread information
                static ImGuiMCP::ImGuiTableFlags flags = ImGuiMCP::ImGuiTableFlags_Resizable |
                                      ImGuiMCP::ImGuiTableFlags_RowBg |
                                      ImGuiMCP::ImGuiTableFlags_BordersOuter |
                                      ImGuiMCP::ImGuiTableFlags_BordersV |
                                      ImGuiMCP::ImGuiTableFlags_ScrollY;

                if (ImGuiMCP::ImGui::BeginTable("ActiveThreadsTable", 6, flags)) {
                    ImGuiMCP::ImGui::TableSetupColumn("Thread ID",     ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 80.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Player Thread", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 100.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Actors",        ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 60.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Current Scene", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch);
                    ImGuiMCP::ImGui::TableSetupColumn("Actor Names",   ImGuiMCP::ImGuiTableColumnFlags_WidthStretch);
                    ImGuiMCP::ImGui::TableSetupColumn("Actions",       ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 100.0f);
                    ImGuiMCP::ImGui::TableHeadersRow();

                    for (const auto& data : s_cachedThreadData) {
                        ImGuiMCP::ImGui::TableNextRow();

                        ImGuiMCP::ImGui::TableSetColumnIndex(0);
                        ImGuiMCP::ImGui::Text("%u", data.threadID);

                        ImGuiMCP::ImGui::TableSetColumnIndex(1);
                        if (data.isPlayerThread) {
                            ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.0f, 1.0f, 0.0f, 1.0f), "YES");
                        } else {
                            ImGuiMCP::ImGui::Text("No");
                        }

                        ImGuiMCP::ImGui::TableSetColumnIndex(2);
                        ImGuiMCP::ImGui::Text("%u", data.actorCount);

                        ImGuiMCP::ImGui::TableSetColumnIndex(3);
                        ImGuiMCP::ImGui::Text("%s", data.sceneID.c_str());

                        ImGuiMCP::ImGui::TableSetColumnIndex(4);
                        ImGuiMCP::ImGui::TextWrapped("%s", data.actorNames.c_str());

                        ImGuiMCP::ImGui::TableSetColumnIndex(5);
                        std::string buttonLabel = "Explore##" + std::to_string(data.threadID);
                        if (ImGuiMCP::ImGui::Button(buttonLabel.c_str())) {
                            ThreadExplorer::Show(data.threadID);
                        }
                    }

                    ImGuiMCP::ImGui::EndTable();
                }

                // Render explorer window if open
                ThreadExplorer::Render();
            }
        }

        void Register() {
            SKSE::log::info("UI::Register() called");

            if (!SKSEMenuFramework::IsInstalled()) {
                SKSE::log::warn("SKSEMenuFramework is NOT installed (file not found) - menu will not be registered");
                return;
            }

            // Check if the module handle is valid (DLL actually loaded)
            auto moduleHandle = GetModuleHandle(L"SKSEMenuFramework");
            if (!moduleHandle) {
                SKSE::log::error("SKSEMenuFramework.dll file exists but module is NOT loaded! Registration will fail silently.");
                SKSE::log::error("This usually means we're registering too early. Try registering on kPostPostLoad instead of kDataLoaded.");
                return;
            }

            SKSE::log::info("SKSEMenuFramework module handle: {}", reinterpret_cast<void*>(moduleHandle));
            SKSE::log::info("SKSEMenuFramework is installed and loaded, registering menu...");

            SKSEMenuFramework::SetSection("OStim Navigator");
            SKSE::log::info("Set section to 'OStim Navigator'");

            SKSEMenuFramework::AddSectionItem("Active Threads", ActiveThreads::Render);
            SKSE::log::info("Added section item 'Active Threads'");

            // Only add OStimNet page if the plugin is available
            if (OStimNetIntegration::IsOStimNetAvailable()) {
                SKSEMenuFramework::AddSectionItem("OStimNet", OStimNetIntegration::Render);
                SKSE::log::info("Added section item 'OStimNet' (OStimNet plugin available)");
            } else {
                SKSE::log::info("OStimNet plugin not available, skipping OStimNet section");
            }

            SKSE::log::info("UI::Register() completed successfully");
        }
    }
}
