#include "UI.h"
#include "ThreadExplorer.h"
#include "OStimIntegration.h"
#include "OStimNetIntegration.h"
#include <SKSEMenuFramework.h>

namespace OStimNavigator {
    namespace UI {
        namespace ActiveThreads {
            struct ThreadDisplayData {
                int32_t threadID;
                bool isPlayerThread;
                uint32_t actorCount;
                std::string sceneID;
                std::string actorNames;
            };

            static std::vector<ThreadDisplayData> s_cachedThreadData;
            static std::chrono::steady_clock::time_point s_lastRefreshTime;
            static constexpr auto AUTO_REFRESH_INTERVAL = std::chrono::seconds(1);

            void RefreshThreadData() {
                s_cachedThreadData.clear();
                auto& ostim = OStimIntegration::GetSingleton();

                if (!ostim.IsOStimAvailable()) {
                    return;
                }

                auto threads = ostim.GetActiveThreads();

                for (OStim::Thread* thread : threads) {
                    // Thread pointers are already validated by GetActiveThreads()
                    ThreadDisplayData data;
                    data.threadID = thread->getThreadID();
                    data.isPlayerThread = thread->isPlayerThread();
                    data.actorCount = thread->getActorCount();

                    // Get scene/node
                    OStim::Node* currentNode = thread->getCurrentNode();
                    if (currentNode && currentNode->getNodeID()) {
                        data.sceneID = currentNode->getNodeID();
                    } else {
                        data.sceneID = "No scene";
                    }

                    // Get actor names
                    std::string actorNames;
                    for (uint32_t i = 0; i < data.actorCount; ++i) {
                        OStim::ThreadActor* threadActor = thread->getActor(i);
                        if (threadActor) {
                            void* gameActorPtr = threadActor->getGameActor();
                            if (gameActorPtr) {
                                RE::Actor* actor = static_cast<RE::Actor*>(gameActorPtr);
                                if (actor) {
                                    const char* name = actor->GetName();
                                    if (name && name[0] != '\0') {
                                        if (!actorNames.empty()) {
                                            actorNames += ", ";
                                        }
                                        actorNames += name;
                                    }
                                }
                            }
                        }
                    }
                    data.actorNames = actorNames.empty() ? "Unknown" : actorNames;

                    s_cachedThreadData.push_back(data);
                }
            }

            void __stdcall Render() {
                auto& ostim = OStimIntegration::GetSingleton();

                if (!ostim.IsOStimAvailable()) {
                    ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(1.0f, 0.5f, 0.0f, 1.0f), "OStim not available");
                    ImGuiMCP::ImGui::TextWrapped("Make sure OStim NG is installed and loaded.");
                    return;
                }

                auto* threadInterface = ostim.GetThreadInterface();
                if (!threadInterface) {
                    ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(1.0f, 0.0f, 0.0f, 1.0f), "Error: ThreadInterface not available");
                    return;
                }

                // Auto-refresh every second
                auto now = std::chrono::steady_clock::now();
                if (s_lastRefreshTime.time_since_epoch().count() == 0 || 
                    now - s_lastRefreshTime >= AUTO_REFRESH_INTERVAL) {
                    RefreshThreadData();
                    s_lastRefreshTime = now;
                }

                // Display header with refresh button
                ImGuiMCP::ImGui::Text("Active OStim Threads: %zu", s_cachedThreadData.size());
                ImGuiMCP::ImGui::SameLine();
                if (ImGuiMCP::ImGui::Button("Refresh")) {
                    RefreshThreadData();
                }
                ImGuiMCP::ImGui::Separator();

                if (s_cachedThreadData.empty()) {
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
                    // Setup columns
                    ImGuiMCP::ImGui::TableSetupColumn("Thread ID", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 80.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Player Thread", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 100.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Actors", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 60.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Current Scene", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch);
                    ImGuiMCP::ImGui::TableSetupColumn("Actor Names", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch);
                    ImGuiMCP::ImGui::TableSetupColumn("Actions", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed, 100.0f);
                    ImGuiMCP::ImGui::TableHeadersRow();

                    // Display cached thread data
                    for (const auto& data : s_cachedThreadData) {
                        ImGuiMCP::ImGui::TableNextRow();

                        // Thread ID
                        ImGuiMCP::ImGui::TableSetColumnIndex(0);
                        ImGuiMCP::ImGui::Text("%d", data.threadID);

                        // Is Player Thread
                        ImGuiMCP::ImGui::TableSetColumnIndex(1);
                        if (data.isPlayerThread) {
                            ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.0f, 1.0f, 0.0f, 1.0f), "YES");
                        } else {
                            ImGuiMCP::ImGui::Text("No");
                        }

                        // Actor Count
                        ImGuiMCP::ImGui::TableSetColumnIndex(2);
                        ImGuiMCP::ImGui::Text("%u", data.actorCount);

                        // Current Scene/Node
                        ImGuiMCP::ImGui::TableSetColumnIndex(3);
                        ImGuiMCP::ImGui::Text("%s", data.sceneID.c_str());

                        // Actor Names
                        ImGuiMCP::ImGui::TableSetColumnIndex(4);
                        ImGuiMCP::ImGui::TextWrapped("%s", data.actorNames.c_str());
                        
                        // Actions button
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
            if (!SKSEMenuFramework::IsInstalled()) {
                return;
            }

            SKSEMenuFramework::SetSection("OStim Navigator");
            SKSEMenuFramework::AddSectionItem("Active Threads", ActiveThreads::Render);

            // Only add OStimNet page if the plugin is available
            if (OStimNetIntegration::IsOStimNetAvailable()) {
                SKSEMenuFramework::AddSectionItem("OStimNet", OStimNetIntegration::Render);
            }
        }
    }
}
