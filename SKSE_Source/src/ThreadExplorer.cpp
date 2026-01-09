#include "ThreadExplorer.h"
#include "OStimIntegration.h"
#include "SceneDatabase.h"
#include "ActionDatabase.h"
#include "ActorPropertiesDatabase.h"
#include "FurnitureDatabase.h"
#include "SceneSimilarity.h"
#include "SceneFilter.h"
#include "StringUtils.h"
#include "SceneUIHelpers.h"
#include <SKSEMenuFramework.h>
#include <algorithm>

namespace OStimNavigator {
    namespace UI {
        namespace ThreadExplorer {
            // Window state
            static bool s_isShown = false;
            static int32_t s_selectedThreadID = -1;
            static SceneData* s_currentScene = nullptr;  // Current scene in the thread
            static OStim::Thread* s_currentThread = nullptr;  // Current thread for actor name resolution
            static std::string s_lastSceneID = "";  // Track scene changes for similarity recalculation
            
            // Filter state
            static char s_searchBuffer[256] = "";
            static std::unordered_set<std::string> s_selectedModpacks;
            static std::unordered_set<std::string> s_selectedSceneTags;
            static std::unordered_set<std::string> s_selectedActorTags;
            static std::unordered_set<std::string> s_selectedActions;
            static std::unordered_set<std::string> s_selectedActionTags;
            
            // Filter mode toggles (true = AND, false = OR)
            static bool s_sceneTagsAND = false;
            static bool s_actorTagsAND = false;
            static bool s_actionsAND = false;
            static bool s_actionTagsAND = false;
            
            // Filtered results
            static std::vector<SceneData*> s_filteredScenes;
            static std::unordered_map<SceneData*, float> s_similarityScores;  // Cache for similarity scores
            static int s_currentPage = 0;
            static int s_itemsPerPage = 50;
            
            // Compatibility filters
            static bool s_hideTransitions = true;
            static bool s_useIntendedSex = true;
            static bool s_validateRequirements = true;
            static bool s_hideNonRandom = true;
            static bool s_hideIntroIdle = true;
            
            // Current scene tag/action tracking for highlighting
            static std::unordered_set<std::string> s_currentSceneActions;
            static std::unordered_set<std::string> s_currentSceneTags;
            static std::unordered_set<std::string> s_currentSceneActorTags;
            
            // Flag to defer filter application until after table rendering
            static bool s_filtersNeedReapply = false;

            void Show(int32_t threadID) {
                bool threadChanged = (s_selectedThreadID != threadID);
                s_selectedThreadID = threadID;
                s_isShown = true;
                
                // Only reset filters when switching to a different thread
                if (threadChanged) {
                    s_searchBuffer[0] = '\0';
                    s_selectedModpacks.clear();
                    s_selectedSceneTags.clear();
                    s_selectedActorTags.clear();
                    s_selectedActions.clear();
                    s_selectedActionTags.clear();
                    s_sceneTagsAND = false;
                    s_actorTagsAND = false;
                    s_actionsAND = false;
                    s_actionTagsAND = false;
                    s_currentPage = 0;
                    s_hideTransitions = true;
                    s_useIntendedSex = true;                
                    s_validateRequirements = true;
                    s_hideNonRandom = true;
                    s_hideIntroIdle = true;
                }
            }

            void Hide() {
                s_isShown = false;
            }

            bool IsShown() {
                return s_isShown;
            }

            // Helper to get similarity color based on score
            static ImGuiMCP::ImVec4 GetSimilarityColor(float similarity) {
                if (similarity >= 0.7f) {
                    return ImGuiMCP::ImVec4(0.2f, 0.9f, 0.2f, 1.0f);  // Green
                } else if (similarity >= 0.4f) {
                    return ImGuiMCP::ImVec4(0.9f, 0.9f, 0.2f, 1.0f);  // Yellow
                } else if (similarity > 0.0f) {
                    return ImGuiMCP::ImVec4(0.9f, 0.5f, 0.2f, 1.0f);  // Orange
                } else {
                    return ImGuiMCP::ImVec4(0.7f, 0.7f, 0.7f, 1.0f);  // Gray (no match)
                }
            }

            // Forward declaration
            static void ApplyFilters(OStim::Thread* thread);

            static void RenderSimilarityColumn(SceneData* scene) {
                if (s_currentScene && s_similarityScores.count(scene)) {
                    float similarity = s_similarityScores[scene];
                    ImGuiMCP::ImVec4 color = GetSimilarityColor(similarity);
                    
                    // Increase font size for similarity percentage
                    ImGuiMCP::ImGui::SetWindowFontScale(1.3f);
                    ImGuiMCP::ImGui::TextColored(color, "%.1f%%", similarity * 100.0f);
                    ImGuiMCP::ImGui::SetWindowFontScale(1.0f);
                    
                    if (ImGuiMCP::ImGui::IsItemHovered()) {
                        ImGuiMCP::ImGui::SetTooltip("Similarity to current scene: %.1f%%", similarity * 100.0f);
                    }
                } else {
                    ImGuiMCP::ImGui::TextDisabled("N/A");
                    if (ImGuiMCP::ImGui::IsItemHovered()) {
                        ImGuiMCP::ImGui::SetTooltip("No current scene to compare");
                    }
                }
            }

            static void RenderSceneRow(SceneData* scene, int index, OStim::Thread* thread) {
                using namespace SceneUIHelpers;

                // Push unique ID for this entire row to prevent ID conflicts between rows
                ImGuiMCP::ImGui::PushID(index);

                // Buttons (Warp)
                ImGuiMCP::ImGui::TableSetColumnIndex(1);
                std::string warpButtonID = "Warp##" + std::to_string(index);

                if (RenderStyledButton(warpButtonID.c_str(), ImGuiMCP::ImVec2(60, 0), s_greenButtonColor)) {
                    auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
                    if (vm) {
                        auto* args = RE::MakeFunctionArguments((int)s_selectedThreadID, std::move(scene->id), true);
                        RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> callback;
                        vm->DispatchStaticCall("OThread", "WarpTo", args, callback);
                        delete args;
                        SKSE::log::info("Warped thread {} to scene: {}", s_selectedThreadID, scene->id);
                        // Trigger filter reapply to recalculate similarity scores with new current scene
                        s_filtersNeedReapply = true;
                    }
                }

                // File Name
                ImGuiMCP::ImGui::TableSetColumnIndex(2);
                ImGuiMCP::ImGui::SetWindowFontScale(1.15f);
                RenderTableTextColumn(scene->id.c_str());
                ImGuiMCP::ImGui::SetWindowFontScale(1.0f);

                // Name
                ImGuiMCP::ImGui::TableSetColumnIndex(3);
                ImGuiMCP::ImGui::SetWindowFontScale(1.15f);
                RenderTableTextColumn(scene->name.c_str());
                ImGuiMCP::ImGui::SetWindowFontScale(1.0f);

                // Gender
                ImGuiMCP::ImGui::TableSetColumnIndex(4);
                RenderGenderComposition(scene->actors);

                // Modpack
                ImGuiMCP::ImGui::TableSetColumnIndex(5);
                RenderTableTextColumn(scene->modpack.c_str());

                // Actions (unique, as pills)
                ImGuiMCP::ImGui::TableSetColumnIndex(6);
                RenderActionPillCollection(scene->actions, s_currentSceneActions, thread, &s_selectedActions,
                    []() {
                        s_filtersNeedReapply = true;
                    });

                // Actor Tags (unique from all actors, as pills)
                ImGuiMCP::ImGui::TableSetColumnIndex(7);
                std::unordered_set<std::string> uniqueActorTags;
                for (const auto& actor : scene->actors) {
                    for (const auto& tag : actor.tags) {
                        uniqueActorTags.insert(tag);
                    }
                }
                RenderPillCollection(uniqueActorTags, s_currentSceneActorTags,
                    [](const std::string& tag) -> const std::string& { return tag; },
                    &s_selectedActorTags, nullptr, false,
                    []() {
                        s_filtersNeedReapply = true;
                    });

                // Scene Tags (as pills)
                ImGuiMCP::ImGui::TableSetColumnIndex(8);
                RenderPillCollection(scene->tags, s_currentSceneTags,
                    [](const std::string& tag) -> const std::string& { return tag; },
                    &s_selectedSceneTags, nullptr, false,
                    []() {
                        s_filtersNeedReapply = true;
                    });

                // Pop the row ID
                ImGuiMCP::ImGui::PopID();
            }


            // Helper function to apply filters
            static void ApplyFilters(OStim::Thread* thread) {
                // Build filter settings from current UI state
                SceneFilterSettings settings;
                settings.searchText = s_searchBuffer;
                settings.selectedModpacks = s_selectedModpacks;
                settings.selectedSceneTags = s_selectedSceneTags;
                settings.selectedActorTags = s_selectedActorTags;
                settings.selectedActions = s_selectedActions;
                settings.selectedActionTags = s_selectedActionTags;
                settings.sceneTagsAND = s_sceneTagsAND;
                settings.actorTagsAND = s_actorTagsAND;
                settings.actionsAND = s_actionsAND;
                settings.actionTagsAND = s_actionTagsAND;
                settings.hideTransitions = s_hideTransitions;
                settings.useIntendedSex = s_useIntendedSex;
                settings.validateRequirements = s_validateRequirements;
                settings.hideNonRandom = s_hideNonRandom;
                settings.hideIntroIdle = s_hideIntroIdle;
                
                // Apply filters using SceneFilter module
                auto result = SceneFilter::ApplyFilters(thread, s_currentScene, settings);
                
                // Update local state with results
                s_filteredScenes = std::move(result.filteredScenes);
                s_similarityScores = std::move(result.similarityScores);
                s_currentPage = 0;
            }

            void Render() {
                using namespace SceneUIHelpers;

                if (!s_isShown) {
                    return;
                }

                // Track if this is the first render after showing the window
                static bool s_firstRender = true;
                static int32_t s_lastThreadID = -1;

                // Reset first render flag when thread changes or window was hidden
                if (s_lastThreadID != s_selectedThreadID) {
                    s_firstRender = true;
                    s_lastThreadID = s_selectedThreadID;
                }

                // Set window size relative to screen resolution (70% width, 75% height)
                ImGuiMCP::ImVec2 displaySize = ImGuiMCP::ImGui::GetIO()->DisplaySize;
                ImGuiMCP::ImGui::SetNextWindowSize(ImGuiMCP::ImVec2(displaySize.x * 0.7f, displaySize.y * 0.75f), ImGuiMCP::ImGuiCond_FirstUseEver);

                // Set solid, non-transparent background
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_WindowBg, ImGuiMCP::ImVec4(0.10f, 0.10f, 0.12f, 1.0f));

                std::string windowTitle = "Thread Explorer";
                if (ImGuiMCP::ImGui::Begin(windowTitle.c_str(), &s_isShown, ImGuiMCP::ImGuiWindowFlags_None)) {
                    auto& ostim = OStimIntegration::GetSingleton();
                    auto& sceneDB = SceneDatabase::GetSingleton();
                    auto& actionDB = ActionDatabase::GetSingleton();

                    if (!ostim.IsOStimAvailable()) {
                        ImGuiMCP::ImGui::TextColored(SceneUIHelpers::s_orangeTextColor, "OStim not available");
                        ImGuiMCP::ImGui::End();
                        ImGuiMCP::ImGui::PopStyleColor();
                        return;
                    }

                    auto* threadInterface = ostim.GetThreadInterface();
                    if (!threadInterface) {
                        ImGuiMCP::ImGui::TextColored(SceneUIHelpers::s_redTextColor, "Error: ThreadInterface not available");
                        ImGuiMCP::ImGui::End();
                        ImGuiMCP::ImGui::PopStyleColor();
                        return;
                    }

                    OStim::Thread* thread = threadInterface->getThread(s_selectedThreadID);
                    if (!thread) {
                        ImGuiMCP::ImGui::TextColored(SceneUIHelpers::s_redTextColor, "Thread no longer exists");
                        if (ImGuiMCP::ImGui::Button("Close")) {
                            s_isShown = false;
                        }
                        ImGuiMCP::ImGui::End();
                        ImGuiMCP::ImGui::PopStyleColor();
                        return;
                    }
                    
                    // Store thread for action tooltips
                    s_currentThread = thread;
                    
                    // Auto-apply filters on first render
                    if (s_firstRender) {
                        ApplyFilters(thread);
                        s_firstRender = false;
                    }

                    // ========== CURRENT THREAD ==========
                    // Make header larger
                    ImGuiMCP::ImGui::SetWindowFontScale(1.2f);
                    if (ImGuiMCP::ImGui::CollapsingHeader("Current Thread", ImGuiMCP::ImGuiTreeNodeFlags_DefaultOpen)) {
                        ImGuiMCP::ImGui::SetWindowFontScale(1.0f);
                        ImGuiMCP::ImGui::Indent();
                        
                        uint32_t actorCount = thread->getActorCount();
                        
                        // Current Scene - collect data first
                        s_currentScene = nullptr;  // Reset current scene
                        s_currentSceneActions.clear();
                        s_currentSceneTags.clear();
                        s_currentSceneActorTags.clear();
                        
                        std::string currentSceneID = "";
                        OStim::Node* currentNode = thread->getCurrentNode();
                        if (currentNode) {
                            const char* sceneID = currentNode->getNodeID();
                            if (sceneID && sceneID[0] != '\0') {
                                currentSceneID = sceneID;
                                SceneData* sceneData = sceneDB.GetSceneByID(sceneID);
                                s_currentScene = sceneData;  // Store current scene for similarity calculations
                                if (sceneData) {
                                    // Extract actions, scene tags, and actor tags from current scene
                                    for (const auto& action : sceneData->actions) {
                                        s_currentSceneActions.insert(action.type);
                                    }
                                    for (const auto& tag : sceneData->tags) {
                                        s_currentSceneTags.insert(tag);
                                    }
                                    for (const auto& actor : sceneData->actors) {
                                        for (const auto& tag : actor.tags) {
                                            s_currentSceneActorTags.insert(tag);
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Detect scene change and trigger similarity recalculation
                        if (currentSceneID != s_lastSceneID) {
                            SKSE::log::info("Scene changed from '{}' to '{}', triggering similarity recalculation", 
                                s_lastSceneID, currentSceneID);
                            s_lastSceneID = currentSceneID;
                            s_filtersNeedReapply = true;
                        }
                        
                        // Determine thread type based on action tags
                        std::string threadType = "none";
                        if (s_currentScene && actionDB.IsLoaded()) {
                            bool hasSexual = false;
                            bool hasSensual = false;
                            
                            for (const auto& action : s_currentScene->actions) {
                                ActionData* actionData = actionDB.GetAction(action.type);
                                if (actionData) {
                                    for (const auto& tag : actionData->tags) {
                                        if (tag == "sexual") {
                                            hasSexual = true;
                                        } else if (tag == "romantic" || tag == "sensual") {
                                            hasSensual = true;
                                        }
                                    }
                                }
                            }
                            
                            if (hasSexual) {
                                threadType = "sexual";
                            } else if (hasSensual) {
                                threadType = "sensual";
                            }
                        }
                        
                        // Selected Thread info with type and gender composition
                        ImGuiMCP::ImGui::Text("Selected Thread: Thread %d (%s)", thread->getThreadID(), threadType.c_str());
                        
                        // Gender Composition (on same line)
                        if (s_currentScene && !s_currentScene->actors.empty()) {
                            ImGuiMCP::ImGui::SameLine();
                            ImGuiMCP::ImGui::Text(" - ");
                            ImGuiMCP::ImGui::SameLine();
                            RenderGenderComposition(s_currentScene->actors);
                        }
                        
                        // Current Scene
                        if (s_currentScene && !s_currentScene->actions.empty()) {
                            ImGuiMCP::ImGui::Text("Actions: ");
                            ImGuiMCP::ImGui::SameLine();
                            RenderActionPillCollection(s_currentScene->actions, s_currentSceneActions, nullptr, &s_selectedActions,
                                []() {
                                    s_filtersNeedReapply = true;
                                });
                        }
                        
                        // Scene Tags line with pills
                        if (s_currentScene && !s_currentScene->tags.empty()) {
                            ImGuiMCP::ImGui::Text("Scene Tags: ");
                            ImGuiMCP::ImGui::SameLine();
                            RenderPillCollection(s_currentScene->tags, s_currentSceneTags,
                                [](const std::string& tag) -> const std::string& { return tag; },
                                &s_selectedSceneTags, nullptr, false,
                                []() { 
                                    s_filtersNeedReapply = true; 
                                });
                        }
                        
                        // Actor Config (Names with tags as pills)
                        ImGuiMCP::ImGui::Text("Actors: ");
                        ImGuiMCP::ImGui::SameLine();
                        for (uint32_t i = 0; i < actorCount; ++i) {
                            RE::Actor* actor = GetActorFromThread(thread, i);
                            if (actor) {
                                std::string actorName = GetActorName(actor);
                                ImGuiMCP::ImGui::Text("%s (", actorName.c_str());
                                ImGuiMCP::ImGui::SameLine();
                                
                                // Get actor tags from current scene
                                std::vector<std::string> actorTags;
                                if (s_currentScene && i < s_currentScene->actors.size()) {
                                    actorTags = s_currentScene->actors[i].tags;
                                }
                                
                                // Display tags as pills
                                if (!actorTags.empty()) {
                                    std::vector<std::string> sortedTags = actorTags;
                                    std::sort(sortedTags.begin(), sortedTags.end());
                                    
                                    size_t tagCount = 0;
                                    for (const auto& tag : sortedTags) {
                                        bool isHighlighted = s_currentSceneActorTags.count(tag) > 0;
                                        bool isSelected = s_selectedActorTags.count(tag) > 0;
                                        ImGuiMCP::ImVec4 color = GetColorForTag(tag, isHighlighted);
                                        if (RenderPill(tag.c_str(), color, isSelected)) {
                                            // When clicked, toggle the filter set
                                            if (s_selectedActorTags.count(tag) > 0) {
                                                s_selectedActorTags.erase(tag);
                                            } else {
                                                s_selectedActorTags.insert(tag);
                                            }
                                            s_filtersNeedReapply = true;
                                        }
                                        tagCount++;
                                        if (tagCount < sortedTags.size()) {
                                            ImGuiMCP::ImGui::SameLine();
                                        }
                                    }
                                }
                                
                                ImGuiMCP::ImGui::SameLine();
                                ImGuiMCP::ImGui::Text(")%s", (i < actorCount - 1) ? ", " : "");
                                if (i < actorCount - 1) {
                                    ImGuiMCP::ImGui::SameLine();
                                }
                            }
                        }
                        
                        // Furniture types (from actor factions)
                        auto& furnitureDB = FurnitureDatabase::GetSingleton();
                        std::string furnitureStr = "Furniture: None";
                        
                        if (furnitureDB.IsLoaded() && actorCount > 0) {
                            RE::Actor* actor = GetActorFromThread(thread, 0);
                            if (actor) {
                                auto furnitureTypes = furnitureDB.GetFurnitureTypesFromActor(actor);
                                if (!furnitureTypes.empty()) {
                                    furnitureStr = BuildCommaSeparatedList(furnitureTypes, "Furniture: ");
                                }
                            }
                        }
                        ImGuiMCP::ImGui::Text("%s", furnitureStr.c_str());
                        
                        ImGuiMCP::ImGui::Unindent();
                    } else {
                        ImGuiMCP::ImGui::SetWindowFontScale(1.0f);
                    }
                    
                    ImGuiMCP::ImGui::Separator();

                    // ========== FILTERS ==========
                    if (ImGuiMCP::ImGui::CollapsingHeader("Filters", ImGuiMCP::ImGuiTreeNodeFlags_DefaultOpen)) {
                        ImGuiMCP::ImGui::Indent();
                        
                        // Row 1: Search | Modpack (2-column layout)
                        ImGuiMCP::ImGui::Columns(2, "##filter_row1", false);
                        
                        // Left Column: Search
                        ImGuiMCP::ImGui::AlignTextToFramePadding();
                        // Highlight Search label if there's text in the search buffer
                        bool hasSearchText = s_searchBuffer[0] != '\0';
                        if (hasSearchText) {
                            ImGuiMCP::ImGui::TextColored(SceneUIHelpers::s_blueTextColor, "Search:");
                        } else {
                            ImGuiMCP::ImGui::Text("Search:");
                        }
                        ImGuiMCP::ImGui::SetNextItemWidth(-10.0f);
                        if (ImGuiMCP::ImGui::InputTextWithHint("##search", "Scene name or ID...", s_searchBuffer, sizeof(s_searchBuffer))) {
                            ApplyFilters(thread);
                        }
                        
                        // Right Column: Modpack
                        ImGuiMCP::ImGui::NextColumn();
                        ImGuiMCP::ImGui::AlignTextToFramePadding();
                        // Highlight Modpack label if filters are active
                        bool hasModpackFilter = !s_selectedModpacks.empty();
                        if (hasModpackFilter) {
                            ImGuiMCP::ImGui::TextColored(SceneUIHelpers::s_blueTextColor, "Modpack: (%zu)", s_selectedModpacks.size());
                        } else {
                            ImGuiMCP::ImGui::Text("Modpack:");
                        }
                        
                        std::string modpackPreview = BuildPreviewText(s_selectedModpacks, "All");
                        
                        ImGuiMCP::ImGui::SetNextItemWidth(-10.0f);
                        ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_PopupBg, ImGuiMCP::ImVec4(0.12f, 0.12f, 0.14f, 1.0f));
                        if (ImGuiMCP::ImGui::BeginCombo("##modpack_combo", modpackPreview.c_str())) {
                            if (sceneDB.IsLoaded()) {
                                std::unordered_set<std::string> allModpacks;
                                auto allScenes = sceneDB.GetAllScenes();
                                for (auto* scene : allScenes) {
                                    if (scene && !scene->modpack.empty()) {
                                        allModpacks.insert(scene->modpack);
                                    }
                                }
                                
                                // Sort modpacks alphabetically
                                std::vector<std::string> sortedModpacks(allModpacks.begin(), allModpacks.end());
                                std::sort(sortedModpacks.begin(), sortedModpacks.end());
                                
                                for (const auto& modpack : sortedModpacks) {
                                    bool selected = s_selectedModpacks.find(modpack) != s_selectedModpacks.end();
                                    if (ImGuiMCP::ImGui::Checkbox(modpack.c_str(), &selected)) {
                                        if (selected) {
                                            s_selectedModpacks.insert(modpack);
                                        } else {
                                            s_selectedModpacks.erase(modpack);
                                        }
                                        ApplyFilters(thread);
                                    }
                                }
                            }
                            ImGuiMCP::ImGui::EndCombo();
                        }
                        ImGuiMCP::ImGui::PopStyleColor();
                        
                        ImGuiMCP::ImGui::Columns(1);
                        
                        ImGuiMCP::ImGui::Spacing();
                        ImGuiMCP::ImGui::Separator();
                        ImGuiMCP::ImGui::Spacing();
                        
                        // Scene Tags, Actor Tags, Actions, and Action Tags filters
                        if (sceneDB.IsLoaded()) {
                            static char tagSearchBuffer[128] = "";
                            static char actorTagSearchBuffer[128] = "";
                            static char actionSearchBuffer[128] = "";
                            
                            // Row 2: Scene Tags | Actor Tags (2-column layout)
                            ImGuiMCP::ImGui::Columns(2, "##filter_row2", false);
                            
                            // Left Column: Scene Tags
                            RenderFilterCombo("Scene Tags:", s_sceneTagsAND,
                                "AND: Scene must have ALL selected tags", "OR: Scene must have ANY selected tag",
                                s_selectedSceneTags, sceneDB.GetAllTags(), tagSearchBuffer, sizeof(tagSearchBuffer),
                                "##scene_tags_combo", "##tag_search", "Search tags...", "##scene_tags_scroll",
                                [&thread]() { ApplyFilters(thread); });
                            
                            // Right Column: Actor Tags
                            ImGuiMCP::ImGui::NextColumn();
                            
                            RenderFilterCombo("Actor Tags:", s_actorTagsAND,
                                "AND: At least one actor must have ALL selected tags", "OR: At least one actor must have ANY selected tag",
                                s_selectedActorTags, sceneDB.GetAllActorTags(), actorTagSearchBuffer, sizeof(actorTagSearchBuffer),
                                "##actor_tags_combo", "##actor_tag_search", "Search tags...", "##actor_tags_scroll",
                                [&thread]() { ApplyFilters(thread); });
                            
                            ImGuiMCP::ImGui::Columns(1);
                            
                            // Row 3: Actions | Action Tags (2-column layout)
                            ImGuiMCP::ImGui::Columns(2, "##filter_row3", false);
                            
                            // Left Column: Actions
                            RenderFilterCombo("Actions:", s_actionsAND,
                                "AND: Scene must have ALL selected actions", "OR: Scene must have ANY selected action",
                                s_selectedActions, sceneDB.GetAllActions(), actionSearchBuffer, sizeof(actionSearchBuffer),
                                "##actions_combo", "##action_search", "Search actions...", "##actions_scroll",
                                [&thread]() { ApplyFilters(thread); });
                            
                            // Right Column: Action Tags
                            ImGuiMCP::ImGui::NextColumn();
                            
                            if (actionDB.IsLoaded()) {
                                static char actionTagSearchBuffer[128] = "";
                                
                                RenderFilterCombo("Action Tags:", s_actionTagsAND,
                                    "AND: Scene actions must have ALL selected tags", "OR: Scene actions must have ANY selected tag",
                                    s_selectedActionTags, actionDB.GetAllTags(), actionTagSearchBuffer, sizeof(actionTagSearchBuffer),
                                    "##action_tags_combo", "##action_tag_search", "Search action tags...", "##action_tags_scroll",
                                    [&thread]() { ApplyFilters(thread); });
                            }
                            
                            ImGuiMCP::ImGui::Columns(1);
                        }
                        
                        ImGuiMCP::ImGui::Spacing();
                        ImGuiMCP::ImGui::Separator();
                        ImGuiMCP::ImGui::Spacing();
                        
                        // Reset button and Results on their own line for prominence
                        if (ImGuiMCP::ImGui::Button("Reset All", ImGuiMCP::ImVec2(120, 0))) {
                            s_searchBuffer[0] = '\0';
                            s_selectedModpacks.clear();
                            s_selectedSceneTags.clear();
                            s_selectedActorTags.clear();
                            s_selectedActions.clear();
                            s_selectedActionTags.clear();
                            ApplyFilters(thread);
                        }
                        
                        ImGuiMCP::ImGui::Spacing();
                        
                        // Make results count more prominent with larger font and brighter color
                        ImGuiMCP::ImGui::SetWindowFontScale(1.3f);
                        ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.4f, 0.8f, 1.0f, 1.0f), "Results: %zu scenes", s_filteredScenes.size());
                        ImGuiMCP::ImGui::SetWindowFontScale(1.0f);
                        
                        ImGuiMCP::ImGui::Unindent();
                    }

                    ImGuiMCP::ImGui::Separator();

                    // ========== COMPATIBILITY FILTERS ==========
                    if (ImGuiMCP::ImGui::CollapsingHeader("Compatibility Filters")) {
                        ImGuiMCP::ImGui::Indent();
                        
                        ImGuiMCP::ImGui::TextColored(SceneUIHelpers::s_grayTextColor, "Filter scenes based on thread compatibility");
                        ImGuiMCP::ImGui::Spacing();
                        
                        if (RenderCheckboxWithTooltip("Hide Transition Scenes", &s_hideTransitions,
                            "Exclude transition/navigation scenes from results")) {
                            ApplyFilters(thread);
                        }
                        
                        if (RenderCheckboxWithTooltip("Use Intended Sex", &s_useIntendedSex,
                            "Filter scenes based on actor sex requirements (male/female).\nScenes requiring specific sexes will be excluded if thread actors don't match.")) {
                            ApplyFilters(thread);
                        }
                        
                        if (RenderCheckboxWithTooltip("Validate Actor Requirements", &s_validateRequirements,
                            "Filter scenes based on actor property requirements.\nScenes will be excluded if thread actors don't meet action requirements\n(e.g., vampire, penis, mouth, etc.).")) {
                            ApplyFilters(thread);
                        }
                        
                        if (RenderCheckboxWithTooltip("Hide Non-Random Scenes", &s_hideNonRandom,
                            "Exclude scenes marked as not suitable for auto mode.\nThese scenes are typically not immersive for random selection.")) {
                            ApplyFilters(thread);
                        }
                        
                        if (RenderCheckboxWithTooltip("Hide Intro/Idle Scenes", &s_hideIntroIdle,
                            "Exclude scenes tagged with 'intro' or 'idle'.\nThese are typically starting animations or idle poses.")) {
                            ApplyFilters(thread);
                        }
                        
                        ImGuiMCP::ImGui::Unindent();
                    }

                    ImGuiMCP::ImGui::Separator();

                    // ========== COMPATIBLE SCENES ==========
                    if (ImGuiMCP::ImGui::CollapsingHeader("Compatible Scenes", ImGuiMCP::ImGuiTreeNodeFlags_DefaultOpen)) {
                        ImGuiMCP::ImGui::Indent();
                        
                        // Pagination controls at top
                        RenderPaginationControls(s_currentPage, s_itemsPerPage, s_filteredScenes.size());
                        
                        // Results table
                        static ImGuiMCP::ImGuiTableFlags tableFlags = 
                            ImGuiMCP::ImGuiTableFlags_Resizable |
                            ImGuiMCP::ImGuiTableFlags_RowBg |
                            ImGuiMCP::ImGuiTableFlags_BordersOuter |
                            ImGuiMCP::ImGuiTableFlags_BordersV |
                            ImGuiMCP::ImGuiTableFlags_ScrollY |
                            ImGuiMCP::ImGuiTableFlags_Sortable;
                        
                        // Calculate available height (remaining space minus some padding for the unindent/end)
                        ImGuiMCP::ImVec2 availRegion;
                        ImGuiMCP::ImGui::GetContentRegionAvail(&availRegion);
                        float availableHeight = availRegion.y - 20.0f;
                        
                        if (ImGuiMCP::ImGui::BeginTable("ScenesTable", 9, tableFlags, ImGuiMCP::ImVec2(0, availableHeight))) {
                            ImGuiMCP::ImGui::TableSetupColumn("Similarity", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed | ImGuiMCP::ImGuiTableColumnFlags_DefaultSort, 120.0f);
                            ImGuiMCP::ImGui::TableSetupColumn("Warp", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed | ImGuiMCP::ImGuiTableColumnFlags_NoSort, 80.0f);
                            ImGuiMCP::ImGui::TableSetupColumn("File Name", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.15f);
                            ImGuiMCP::ImGui::TableSetupColumn("Name", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.15f);
                            ImGuiMCP::ImGui::TableSetupColumn("Gender", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed | ImGuiMCP::ImGuiTableColumnFlags_NoSort, 100.0f);
                            ImGuiMCP::ImGui::TableSetupColumn("Modpack", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.10f);
                            ImGuiMCP::ImGui::TableSetupColumn("Actions", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.20f);
                            ImGuiMCP::ImGui::TableSetupColumn("Actor Tags", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.20f);
                            ImGuiMCP::ImGui::TableSetupColumn("Scene Tags", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.15f);
                            ImGuiMCP::ImGui::TableHeadersRow();
                            
                            // Handle table sorting
                            if (auto* sortSpecs = ImGuiMCP::ImGui::TableGetSortSpecs()) {
                                if (sortSpecs->SpecsDirty) {
                                    if (sortSpecs->SpecsCount > 0) {
                                        const auto& spec = sortSpecs->Specs[0];
                                        
                                        std::sort(s_filteredScenes.begin(), s_filteredScenes.end(),
                                            [&spec](const SceneData* a, const SceneData* b) {
                                                int delta = 0;
                                                
                                                switch (spec.ColumnIndex) {
                                                    case 0: {  // Similarity
                                                        auto itA = s_similarityScores.find(const_cast<SceneData*>(a));
                                                        auto itB = s_similarityScores.find(const_cast<SceneData*>(b));
                                                        float simA = (itA != s_similarityScores.end()) ? itA->second : 0.0f;
                                                        float simB = (itB != s_similarityScores.end()) ? itB->second : 0.0f;
                                                        delta = (simA < simB) ? -1 : (simA > simB) ? 1 : 0;
                                                        break;
                                                    }
                                                    case 1:  // Warp (not sortable, skip)
                                                        delta = 0;
                                                        break;
                                                    case 2:  // File Name
                                                        delta = a->id.compare(b->id);
                                                        break;
                                                    case 3:  // Name
                                                        delta = a->name.compare(b->name);
                                                        break;
                                                    case 4:  // Gender (not sortable, skip)
                                                        delta = 0;
                                                        break;
                                                    case 5:  // Modpack
                                                        delta = a->modpack.compare(b->modpack);
                                                        break;
                                                    case 6:  // Actions (compare count)
                                                        delta = (int)a->actions.size() - (int)b->actions.size();
                                                        break;
                                                    default:
                                                        delta = 0;
                                                        break;
                                                }
                                                
                                                return (spec.SortDirection == ImGuiMCP::ImGuiSortDirection_Ascending) ? (delta < 0) : (delta > 0);
                                            });
                                    }
                                    sortSpecs->SpecsDirty = false;
                                }
                            }
                            
                            // Pagination
                            int startIdx = s_currentPage * s_itemsPerPage;
                            int endIdx = std::min(startIdx + s_itemsPerPage, (int)s_filteredScenes.size());
                            
                            for (int i = startIdx; i < endIdx; ++i) {
                                SceneData* scene = s_filteredScenes[i];
                                if (!scene) continue;
                                
                                ImGuiMCP::ImGui::TableNextRow();
                                
                                // Similarity Score
                                ImGuiMCP::ImGui::TableSetColumnIndex(0);
                                RenderSimilarityColumn(scene);
                                
                                RenderSceneRow(scene, i, thread);
                            }
                            
                            if (s_filteredScenes.empty()) {
                                ImGuiMCP::ImGui::TableNextRow();
                                ImGuiMCP::ImGui::TableSetColumnIndex(0);
                                ImGuiMCP::ImGui::TextDisabled("No scenes match the current filters.");
                            }
                            
                            ImGuiMCP::ImGui::EndTable();
                        }
                        
                        // Apply filters after table rendering if needed
                        if (s_filtersNeedReapply) {
                            ApplyFilters(thread);
                            s_filtersNeedReapply = false;
                            SKSE::log::info("  Filtered scenes result: {}", s_filteredScenes.size());
                        }
                        
                        ImGuiMCP::ImGui::Unindent();
                    }
                }
                ImGuiMCP::ImGui::End();
                ImGuiMCP::ImGui::PopStyleColor();
            }
        }
    }
}
