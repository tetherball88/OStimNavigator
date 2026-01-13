#include "OStimNetIntegration.h"
#include "JsonUtils.h"
#include "SceneDatabase.h"
#include "ActionDatabase.h"
#include "FurnitureDatabase.h"
#include "StringUtils.h"
#include "SceneUIHelpers.h"
#include <SKSEMenuFramework.h>
#include <nlohmann/json.hpp>
#include <fstream>
#include <filesystem>
#include <algorithm>

namespace OStimNavigator {
    namespace OStimNetIntegration {
        static std::map<std::string, AnimationDescription> s_animationDescriptions;
        static bool s_descriptionsLoaded = false;

        // Filter state
        static char s_searchBuffer[256] = "";
        static std::unordered_set<std::string> s_selectedModpacks;
        static std::unordered_set<std::string> s_selectedFurniture;
        static std::unordered_set<std::string> s_selectedSceneTags;
        static std::unordered_set<std::string> s_selectedActorTags;
        static std::unordered_set<std::string> s_selectedActions;
        static std::unordered_set<std::string> s_selectedActionTags;

        // Filter mode toggles (true = AND, false = OR)
        static bool s_sceneTagsAND = false;
        static bool s_actorTagsAND = false;
        static bool s_actionsAND = false;
        static bool s_actionTagsAND = false;

        // Description filter (0 = all, 1 = with description, 2 = without description)
        static int s_descriptionFilter = 0;

        // Filtered results
        static std::vector<SceneData*> s_filteredScenes;
        static int s_currentPage = 0;
        static int s_itemsPerPage = 50;

        // Empty highlight sets (no current scene for OStimNet)
        static std::unordered_set<std::string> s_emptyHighlightSet;

        // Scene editor window state
        static bool s_editorWindowOpen = false;
        static SceneData* s_editorScene = nullptr;
        static char s_editorDescriptionBuffer[4096] = "";
        static std::string s_editorSelectedFile = "";

        bool IsOStimNetAvailable() {
            auto* dataHandler = RE::TESDataHandler::GetSingleton();
            if (!dataHandler) {
                return false;
            }

            auto* ostimNetFile = dataHandler->LookupModByName("TT_OStimNet.esp");
            return ostimNetFile && ostimNetFile->compileIndex != 0xFF;
        }

        void LoadAnimationDescriptions() {
            if (s_descriptionsLoaded) {
                return;
            }

            s_animationDescriptions.clear();

            std::filesystem::path descriptionsPath = "Data/SKSE/Plugins/OStimNet/animationsDescriptions";

            if (!std::filesystem::exists(descriptionsPath)) {
                SKSE::log::warn("OStimNet animations descriptions directory not found: {}", descriptionsPath.string());
                s_descriptionsLoaded = true;
                return;
            }

            SKSE::log::info("Loading OStimNet animation descriptions from: {}", descriptionsPath.string());

            JsonUtils::LoadJsonFilesFromDirectory(descriptionsPath,
                [](const std::filesystem::path& filePath) {
                    try {
                        std::ifstream file(filePath);
                        if (!file.is_open()) {
                            SKSE::log::warn("Failed to open description file: {}", filePath.string());
                            return;
                        }

                        nlohmann::json j;
                        file >> j;

                        // Iterate through all animation IDs in the JSON file
                        // Format: { "AnimID": "description text", ... }
                        for (auto& [animId, animData] : j.items()) {
                            AnimationDescription desc;
                            desc.originalId = animId;  // Preserve original case
                            desc.fileName = filePath.filename().string();

                            if (animData.is_string()) {
                                desc.description = animData.get<std::string>();
                            } else {
                                desc.description = "No description available";
                            }

                            // Convert animation ID to lowercase for case-insensitive matching
                            std::string animIdLower = animId;
                            StringUtils::ToLower(animIdLower);
                            s_animationDescriptions[animIdLower] = desc;
                        }

                        SKSE::log::debug("Loaded descriptions from: {}", filePath.filename().string());
                    } catch (const std::exception& e) {
                        SKSE::log::error("Error parsing description file {}: {}", filePath.string(), e.what());
                    }
                });

            SKSE::log::info("Loaded {} animation descriptions", s_animationDescriptions.size());
            s_descriptionsLoaded = true;
        }

        const std::map<std::string, AnimationDescription>& GetAnimationDescriptions() {
            return s_animationDescriptions;
        }

        bool AreDescriptionsLoaded() {
            return s_descriptionsLoaded;
        }

        void ReloadDescriptions() {
            s_descriptionsLoaded = false;
            LoadAnimationDescriptions();
        }

        // Save description to JSON file
        static void SaveDescriptionToFile(const std::string& sceneId, const std::string& description, const std::string& targetFileName) {
            std::filesystem::path descriptionsPath = "Data/SKSE/Plugins/OStimNet/animationsDescriptions";

            // Create directory if it doesn't exist
            if (!std::filesystem::exists(descriptionsPath)) {
                std::filesystem::create_directories(descriptionsPath);
            }

            std::filesystem::path targetFile = descriptionsPath / targetFileName;

            // Load existing descriptions from the target file
            nlohmann::json descriptions;
            if (std::filesystem::exists(targetFile)) {
                try {
                    std::ifstream file(targetFile);
                    if (file.is_open()) {
                        file >> descriptions;
                        file.close();
                    }
                } catch (const std::exception& e) {
                    SKSE::log::warn("Failed to load descriptions file {}: {}", targetFile.string(), e.what());
                }
            }

            // Update or add the description (use original sceneId, not lowercase)
            descriptions[sceneId] = description;

            // Sort keys alphabetically (case-insensitive) by converting to ordered map
            auto caseInsensitiveCompare = [](const std::string& a, const std::string& b) {
                return _stricmp(a.c_str(), b.c_str()) < 0;
            };
            std::map<std::string, std::string, decltype(caseInsensitiveCompare)> sortedDescriptions(caseInsensitiveCompare);
            for (auto& [key, value] : descriptions.items()) {
                // Only include string values to prevent crashes
                if (value.is_string()) {
                    sortedDescriptions[key] = value.get<std::string>();
                } else {
                    SKSE::log::warn("Skipping non-string value for key '{}' in {}", key, targetFile.string());
                }
            }

            // Convert back to json with sorted keys
            nlohmann::json sortedJson(sortedDescriptions);

            // Save back to file
            try {
                std::ofstream file(targetFile);
                if (file.is_open()) {
                    file << sortedJson.dump(4);  // Pretty print with 4 spaces
                    file.close();
                    SKSE::log::info("Saved description for '{}' to {}", sceneId, targetFile.string());

                    // Update the in-memory map
                    std::string sceneIdLower = sceneId;
                    StringUtils::ToLower(sceneIdLower);
                    AnimationDescription& desc = s_animationDescriptions[sceneIdLower];
                    desc.originalId = sceneId;  // Preserve the original case from scene
                    desc.description = description;
                    desc.fileName = targetFileName;
                } else {
                    SKSE::log::error("Failed to open descriptions file for writing: {}", targetFile.string());
                }
            } catch (const std::exception& e) {
                SKSE::log::error("Failed to save descriptions file: {}", e.what());
            }
        }

        // Get list of existing description files
        static std::vector<std::string> GetDescriptionFiles() {
            std::vector<std::string> files;
            std::filesystem::path descriptionsPath = "Data/SKSE/Plugins/OStimNet/animationsDescriptions";

            if (!std::filesystem::exists(descriptionsPath)) {
                return files;
            }

            try {
                for (const auto& entry : std::filesystem::directory_iterator(descriptionsPath)) {
                    if (entry.is_regular_file() && entry.path().extension() == ".json") {
                        files.push_back(entry.path().filename().string());
                    }
                }
            } catch (const std::exception& e) {
                SKSE::log::error("Failed to list description files: {}", e.what());
            }

            std::sort(files.begin(), files.end());
            return files;
        }

        // Apply filters to scenes
        static void ApplyFilters() {
            auto& sceneDB = SceneDatabase::GetSingleton();
            auto& actionDB = ActionDatabase::GetSingleton();

            if (!sceneDB.IsLoaded()) {
                s_filteredScenes.clear();
                return;
            }

            // Get all scenes
            auto allScenes = sceneDB.GetAllScenes();
            s_filteredScenes.clear();

            for (auto* scene : allScenes) {
                if (!scene) continue;

                // Filter out swapped scenes (actor position variants that reuse animations)
                // Case-insensitive check for "swapped" anywhere in the scene ID
                std::string sceneIdLower = scene->id;
                StringUtils::ToLower(sceneIdLower);
                if (sceneIdLower.find("swapped") != std::string::npos) {
                    continue;
                }

                // Apply search filter
                if (s_searchBuffer[0] != '\0') {
                    std::string searchLower = s_searchBuffer;
                    StringUtils::ToLower(searchLower);
                    std::string sceneIDLower = scene->id;
                    std::string sceneNameLower = scene->name;
                    StringUtils::ToLower(sceneIDLower);
                    StringUtils::ToLower(sceneNameLower);

                    if (sceneIDLower.find(searchLower) == std::string::npos &&
                        sceneNameLower.find(searchLower) == std::string::npos) {
                        continue;
                    }
                }

                // Apply modpack filter
                if (!s_selectedModpacks.empty() && s_selectedModpacks.find(scene->modpack) == s_selectedModpacks.end()) {
                    continue;
                }

                // Apply furniture filter
                if (!s_selectedFurniture.empty()) {
                    if (scene->furnitureType.empty()) {
                        // Scene has no furniture requirement, check if "None" is selected
                        if (s_selectedFurniture.find("") == s_selectedFurniture.end()) {
                            continue;
                        }
                    } else {
                        // Scene has furniture requirement
                        if (s_selectedFurniture.find(scene->furnitureType) == s_selectedFurniture.end()) {
                            continue;
                        }
                    }
                }

                // Apply scene tags filter
                if (!s_selectedSceneTags.empty()) {
                    bool match = false;
                    if (s_sceneTagsAND) {
                        match = std::all_of(s_selectedSceneTags.begin(), s_selectedSceneTags.end(),
                            [&scene](const std::string& tag) {
                                return std::find(scene->tags.begin(), scene->tags.end(), tag) != scene->tags.end();
                            });
                    } else {
                        match = std::any_of(s_selectedSceneTags.begin(), s_selectedSceneTags.end(),
                            [&scene](const std::string& tag) {
                                return std::find(scene->tags.begin(), scene->tags.end(), tag) != scene->tags.end();
                            });
                    }
                    if (!match) continue;
                }

                // Apply actor tags filter
                if (!s_selectedActorTags.empty()) {
                    bool match = false;
                    for (const auto& actor : scene->actors) {
                        if (s_actorTagsAND) {
                            bool actorMatch = std::all_of(s_selectedActorTags.begin(), s_selectedActorTags.end(),
                                [&actor](const std::string& tag) {
                                    return std::find(actor.tags.begin(), actor.tags.end(), tag) != actor.tags.end();
                                });
                            if (actorMatch) {
                                match = true;
                                break;
                            }
                        } else {
                            bool actorMatch = std::any_of(s_selectedActorTags.begin(), s_selectedActorTags.end(),
                                [&actor](const std::string& tag) {
                                    return std::find(actor.tags.begin(), actor.tags.end(), tag) != actor.tags.end();
                                });
                            if (actorMatch) {
                                match = true;
                                break;
                            }
                        }
                    }
                    if (!match) continue;
                }

                // Apply actions filter
                if (!s_selectedActions.empty()) {
                    bool match = false;
                    if (s_actionsAND) {
                        match = std::all_of(s_selectedActions.begin(), s_selectedActions.end(),
                            [&scene](const std::string& action) {
                                return std::find_if(scene->actions.begin(), scene->actions.end(),
                                    [&action](const SceneActionData& a) { return a.type == action; }) != scene->actions.end();
                            });
                    } else {
                        match = std::any_of(s_selectedActions.begin(), s_selectedActions.end(),
                            [&scene](const std::string& action) {
                                return std::find_if(scene->actions.begin(), scene->actions.end(),
                                    [&action](const SceneActionData& a) { return a.type == action; }) != scene->actions.end();
                            });
                    }
                    if (!match) continue;
                }

                // Apply action tags filter
                if (!s_selectedActionTags.empty() && actionDB.IsLoaded()) {
                    bool match = false;
                    for (const auto& sceneAction : scene->actions) {
                        auto* actionData = actionDB.GetAction(sceneAction.type);
                        if (!actionData) continue;

                        if (s_actionTagsAND) {
                            bool actionMatch = std::all_of(s_selectedActionTags.begin(), s_selectedActionTags.end(),
                                [&actionData](const std::string& tag) {
                                    return std::find(actionData->tags.begin(), actionData->tags.end(), tag) != actionData->tags.end();
                                });
                            if (actionMatch) {
                                match = true;
                                break;
                            }
                        } else {
                            bool actionMatch = std::any_of(s_selectedActionTags.begin(), s_selectedActionTags.end(),
                                [&actionData](const std::string& tag) {
                                    return std::find(actionData->tags.begin(), actionData->tags.end(), tag) != actionData->tags.end();
                                });
                            if (actionMatch) {
                                match = true;
                                break;
                            }
                        }
                    }
                    if (!match) continue;
                }

                // Apply description filter
                if (s_descriptionFilter != 0) {
                    std::string sceneIdLowerDesc = scene->id;
                    StringUtils::ToLower(sceneIdLowerDesc);
                    auto descIt = s_animationDescriptions.find(sceneIdLowerDesc);
                    bool hasDescription = (descIt != s_animationDescriptions.end() && !descIt->second.description.empty());

                    if (s_descriptionFilter == 1 && !hasDescription) {
                        continue; // Filter: only with description
                    } else if (s_descriptionFilter == 2 && hasDescription) {
                        continue; // Filter: only without description
                    }
                }

                // Scene passed all filters
                s_filteredScenes.push_back(scene);
            }

            // Sort filtered scenes alphabetically by scene ID (case-insensitive)
            std::sort(s_filteredScenes.begin(), s_filteredScenes.end(),
                [](const SceneData* a, const SceneData* b) {
                    return _stricmp(a->id.c_str(), b->id.c_str()) < 0;
                });

            s_currentPage = 0;
        }

        static void RenderSceneRow(SceneData* scene, int index) {
            using namespace OStimNavigator::UI::SceneUIHelpers;

            // Push unique ID for this entire row
            ImGuiMCP::ImGui::PushID(index);

            // File Name
            ImGuiMCP::ImGui::TableSetColumnIndex(0);
            ImGuiMCP::ImGui::SetWindowFontScale(1.15f);
            RenderTableTextColumn(scene->id.c_str());
            ImGuiMCP::ImGui::SetWindowFontScale(1.0f);

            // Name
            ImGuiMCP::ImGui::TableSetColumnIndex(1);
            ImGuiMCP::ImGui::SetWindowFontScale(1.15f);
            RenderTableTextColumn(scene->name.c_str());
            ImGuiMCP::ImGui::SetWindowFontScale(1.0f);

            // Gender
            ImGuiMCP::ImGui::TableSetColumnIndex(2);
            RenderGenderComposition(scene->actors);

            // Modpack
            ImGuiMCP::ImGui::TableSetColumnIndex(3);
            RenderTableTextColumn(scene->modpack.c_str());

            // Actions (unique, as pills)
            ImGuiMCP::ImGui::TableSetColumnIndex(4);
            RenderActionPillCollection(scene->actions, s_emptyHighlightSet, UINT32_MAX, &s_selectedActions,
                []() {
                    ApplyFilters();
                });

            // Actor Tags (unique from all actors, as pills)
            ImGuiMCP::ImGui::TableSetColumnIndex(5);
            std::unordered_set<std::string> uniqueActorTags;
            for (const auto& actor : scene->actors) {
                for (const auto& tag : actor.tags) {
                    uniqueActorTags.insert(tag);
                }
            }
            RenderPillCollection(uniqueActorTags, s_emptyHighlightSet,
                [](const std::string& tag) -> const std::string& { return tag; },
                &s_selectedActorTags, nullptr, false,
                []() {
                    ApplyFilters();
                });

            // Scene Tags (as pills)
            ImGuiMCP::ImGui::TableSetColumnIndex(6);
            RenderPillCollection(scene->tags, s_emptyHighlightSet,
                [](const std::string& tag) -> const std::string& { return tag; },
                &s_selectedSceneTags, nullptr, false,
                []() {
                    ApplyFilters();
                });

            // Description Icon Indicator
            ImGuiMCP::ImGui::TableSetColumnIndex(7);
            std::string sceneIdLower = scene->id;
            StringUtils::ToLower(sceneIdLower);
            auto descIt = s_animationDescriptions.find(sceneIdLower);
            const AnimationDescription* desc = (descIt != s_animationDescriptions.end() && !descIt->second.description.empty()) ? &descIt->second : nullptr;
            FontAwesome::PushSolid();
            if (desc != nullptr) {
                ImGuiMCP::ImGui::TextColored(s_greenButtonColor, "%s", FontAwesome::UnicodeToUtf8(0xf15c).c_str());
                if (ImGuiMCP::ImGui::IsItemHovered()) {
                    ImGuiMCP::ImGui::SetTooltip("Has description");
                }
            } else {
                ImGuiMCP::ImGui::TextDisabled("%s", FontAwesome::UnicodeToUtf8(0xf15c).c_str());
                if (ImGuiMCP::ImGui::IsItemHovered()) {
                    ImGuiMCP::ImGui::SetTooltip("No description");
                }
            }
            FontAwesome::Pop();

            // Edit Button
            ImGuiMCP::ImGui::TableSetColumnIndex(8);
            std::string editButtonID = "Edit##" + std::to_string(index);
            if (RenderStyledButton(editButtonID.c_str(), ImGuiMCP::ImVec2(60, 0), s_blueButtonColor)) {
                s_editorScene = scene;
                s_editorWindowOpen = true;
                // Load existing description if available
                if (desc != nullptr) {
                    strncpy_s(s_editorDescriptionBuffer, desc->description.c_str(), sizeof(s_editorDescriptionBuffer) - 1);
                    s_editorSelectedFile = desc->fileName;
                } else {
                    s_editorDescriptionBuffer[0] = '\0';
                    s_editorSelectedFile = scene->modpack + ".json";
                }
            }

            // Pop the row ID
            ImGuiMCP::ImGui::PopID();
        }

        void __stdcall Render() {
            using namespace OStimNavigator::UI::SceneUIHelpers;

            if (!IsOStimNetAvailable()) {
                ImGuiMCP::ImGui::TextColored(s_orangeTextColor, "OStimNet not available");
                ImGuiMCP::ImGui::TextWrapped("Make sure TT_OStimNet.esp is installed and enabled.");
                return;
            }

            // Load descriptions on first render
            if (!s_descriptionsLoaded) {
                LoadAnimationDescriptions();
            }

            auto& sceneDB = SceneDatabase::GetSingleton();
            auto& actionDB = ActionDatabase::GetSingleton();

            ImGuiMCP::ImGui::SetWindowFontScale(1.2f);
            ImGuiMCP::ImGui::Text("OStimNet Animation Browser");
            ImGuiMCP::ImGui::SetWindowFontScale(1.0f);

            ImGuiMCP::ImGui::Text("Animation Descriptions Loaded: %zu", s_animationDescriptions.size());
            ImGuiMCP::ImGui::SameLine();
            if (ImGuiMCP::ImGui::Button("Reload Descriptions")) {
                ReloadDescriptions();
            }

            ImGuiMCP::ImGui::Separator();

            // ========== FILTERS ==========
            if (ImGuiMCP::ImGui::CollapsingHeader("Filters", ImGuiMCP::ImGuiTreeNodeFlags_DefaultOpen)) {
                ImGuiMCP::ImGui::Indent();

                // Row 1: Search | Modpack (2-column layout)
                ImGuiMCP::ImGui::Columns(2, "##filter_row1", false);

                // Left Column: Search
                ImGuiMCP::ImGui::AlignTextToFramePadding();
                bool hasSearchText = s_searchBuffer[0] != '\0';
                if (hasSearchText) {
                    ImGuiMCP::ImGui::TextColored(s_blueTextColor, "Search:");
                } else {
                    ImGuiMCP::ImGui::Text("Search:");
                }
                ImGuiMCP::ImGui::SetNextItemWidth(-10.0f);
                if (ImGuiMCP::ImGui::InputTextWithHint("##search", "Scene name or ID...", s_searchBuffer, sizeof(s_searchBuffer))) {
                    ApplyFilters();
                }

                // Right Column: Modpack
                ImGuiMCP::ImGui::NextColumn();
                ImGuiMCP::ImGui::AlignTextToFramePadding();
                bool hasModpackFilter = !s_selectedModpacks.empty();
                if (hasModpackFilter) {
                    ImGuiMCP::ImGui::TextColored(s_blueTextColor, "Modpack: (%zu)", s_selectedModpacks.size());
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
                                ApplyFilters();
                            }
                        }
                    }
                    ImGuiMCP::ImGui::EndCombo();
                }
                ImGuiMCP::ImGui::PopStyleColor();

                ImGuiMCP::ImGui::Columns(1);

                ImGuiMCP::ImGui::Spacing();

                // Row 1.5: Furniture (full width)
                auto& furnitureDB = FurnitureDatabase::GetSingleton();
                if (furnitureDB.IsLoaded()) {
                    ImGuiMCP::ImGui::AlignTextToFramePadding();
                    bool hasFurnitureFilter = !s_selectedFurniture.empty();
                    if (hasFurnitureFilter) {
                        ImGuiMCP::ImGui::TextColored(s_blueTextColor, "Furniture: (%zu)", s_selectedFurniture.size());
                    } else {
                        ImGuiMCP::ImGui::Text("Furniture:");
                    }

                    std::string furniturePreview = BuildPreviewText(s_selectedFurniture, "All");

                    ImGuiMCP::ImGui::SetNextItemWidth(-10.0f);
                    ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_PopupBg, ImGuiMCP::ImVec4(0.12f, 0.12f, 0.14f, 1.0f));
                    if (ImGuiMCP::ImGui::BeginCombo("##furniture_combo", furniturePreview.c_str())) {
                        // Add "None" option for scenes without furniture
                        bool noneSelected = s_selectedFurniture.find("") != s_selectedFurniture.end();
                        if (ImGuiMCP::ImGui::Checkbox("None", &noneSelected)) {
                            if (noneSelected) {
                                s_selectedFurniture.insert("");
                            } else {
                                s_selectedFurniture.erase("");
                            }
                            ApplyFilters();
                        }

                        // Get all furniture types from database
                        auto allFurnitureTypes = furnitureDB.GetAllFurnitureTypeIDs();
                        for (const auto& furnitureType : allFurnitureTypes) {
                            bool selected = s_selectedFurniture.find(furnitureType) != s_selectedFurniture.end();
                            if (ImGuiMCP::ImGui::Checkbox(furnitureType.c_str(), &selected)) {
                                if (selected) {
                                    s_selectedFurniture.insert(furnitureType);
                                } else {
                                    s_selectedFurniture.erase(furnitureType);
                                }
                                ApplyFilters();
                            }
                        }
                        ImGuiMCP::ImGui::EndCombo();
                    }
                    ImGuiMCP::ImGui::PopStyleColor();
                }

                ImGuiMCP::ImGui::Spacing();

                // Description filter
                ImGuiMCP::ImGui::AlignTextToFramePadding();
                bool hasDescriptionFilter = s_descriptionFilter != 0;
                if (hasDescriptionFilter) {
                    ImGuiMCP::ImGui::TextColored(s_blueTextColor, "Description:");
                } else {
                    ImGuiMCP::ImGui::Text("Description:");
                }
                ImGuiMCP::ImGui::SameLine();
                ImGuiMCP::ImGui::SetNextItemWidth(200.0f);
                const char* descFilterItems[] = { "All", "With Description", "Without Description" };
                if (ImGuiMCP::ImGui::Combo("##desc_filter", &s_descriptionFilter, descFilterItems, 3)) {
                    ApplyFilters();
                }

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
                        []() { ApplyFilters(); });

                    // Right Column: Actor Tags
                    ImGuiMCP::ImGui::NextColumn();

                    RenderFilterCombo("Actor Tags:", s_actorTagsAND,
                        "AND: At least one actor must have ALL selected tags", "OR: At least one actor must have ANY selected tag",
                        s_selectedActorTags, sceneDB.GetAllActorTags(), actorTagSearchBuffer, sizeof(actorTagSearchBuffer),
                        "##actor_tags_combo", "##actor_tag_search", "Search tags...", "##actor_tags_scroll",
                        []() { ApplyFilters(); });

                    ImGuiMCP::ImGui::Columns(1);

                    // Row 3: Actions | Action Tags (2-column layout)
                    ImGuiMCP::ImGui::Columns(2, "##filter_row3", false);

                    // Left Column: Actions
                    RenderFilterCombo("Actions:", s_actionsAND,
                        "AND: Scene must have ALL selected actions", "OR: Scene must have ANY selected action",
                        s_selectedActions, sceneDB.GetAllActions(), actionSearchBuffer, sizeof(actionSearchBuffer),
                        "##actions_combo", "##action_search", "Search actions...", "##actions_scroll",
                        []() { ApplyFilters(); });

                    // Right Column: Action Tags
                    ImGuiMCP::ImGui::NextColumn();

                    if (actionDB.IsLoaded()) {
                        static char actionTagSearchBuffer[128] = "";

                        RenderFilterCombo("Action Tags:", s_actionTagsAND,
                            "AND: Scene actions must have ALL selected tags", "OR: Scene actions must have ANY selected tag",
                            s_selectedActionTags, actionDB.GetAllTags(), actionTagSearchBuffer, sizeof(actionTagSearchBuffer),
                            "##action_tags_combo", "##action_tag_search", "Search action tags...", "##action_tags_scroll",
                            []() { ApplyFilters(); });
                    }

                    ImGuiMCP::ImGui::Columns(1);
                }

                ImGuiMCP::ImGui::Spacing();
                ImGuiMCP::ImGui::Separator();
                ImGuiMCP::ImGui::Spacing();

                // Reset button and Results
                if (ImGuiMCP::ImGui::Button("Reset All", ImGuiMCP::ImVec2(120, 0))) {
                    s_searchBuffer[0] = '\0';
                    s_selectedModpacks.clear();
                    s_selectedFurniture.clear();
                    s_selectedSceneTags.clear();
                    s_selectedActorTags.clear();
                    s_selectedActions.clear();
                    s_selectedActionTags.clear();
                    s_descriptionFilter = 0;
                    ApplyFilters();
                }

                ImGuiMCP::ImGui::Spacing();

                // Make results count more prominent
                ImGuiMCP::ImGui::SetWindowFontScale(1.3f);
                ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.4f, 0.8f, 1.0f, 1.0f), "Results: %zu scenes", s_filteredScenes.size());
                ImGuiMCP::ImGui::SetWindowFontScale(1.0f);

                ImGuiMCP::ImGui::Unindent();
            }

            ImGuiMCP::ImGui::Separator();

            // ========== SCENES TABLE ==========
            if (ImGuiMCP::ImGui::CollapsingHeader("Scenes", ImGuiMCP::ImGuiTreeNodeFlags_DefaultOpen)) {
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

                // Calculate available height
                ImGuiMCP::ImVec2 availRegion;
                ImGuiMCP::ImGui::GetContentRegionAvail(&availRegion);
                float availableHeight = availRegion.y - 20.0f;

                if (ImGuiMCP::ImGui::BeginTable("ScenesTable", 9, tableFlags, ImGuiMCP::ImVec2(0, availableHeight))) {
                    ImGuiMCP::ImGui::TableSetupColumn("File Name", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.15f);
                    ImGuiMCP::ImGui::TableSetupColumn("Name", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.15f);
                    ImGuiMCP::ImGui::TableSetupColumn("Gender", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed | ImGuiMCP::ImGuiTableColumnFlags_NoSort, 100.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Modpack", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.10f);
                    ImGuiMCP::ImGui::TableSetupColumn("Actions", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.20f);
                    ImGuiMCP::ImGui::TableSetupColumn("Actor Tags", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.15f);
                    ImGuiMCP::ImGui::TableSetupColumn("Scene Tags", ImGuiMCP::ImGuiTableColumnFlags_WidthStretch, 0.15f);
                    ImGuiMCP::ImGui::TableSetupColumn("Desc", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed | ImGuiMCP::ImGuiTableColumnFlags_NoSort, 50.0f);
                    ImGuiMCP::ImGui::TableSetupColumn("Edit", ImGuiMCP::ImGuiTableColumnFlags_WidthFixed | ImGuiMCP::ImGuiTableColumnFlags_NoSort, 80.0f);
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
                                            case 0:  // File Name (case-insensitive)
                                                delta = _stricmp(a->id.c_str(), b->id.c_str());
                                                break;
                                            case 1:  // Name (case-insensitive)
                                                delta = _stricmp(a->name.c_str(), b->name.c_str());
                                                break;
                                            case 2:  // Gender (not sortable, skip)
                                                delta = 0;
                                                break;
                                            case 3:  // Modpack (case-insensitive)
                                                delta = _stricmp(a->modpack.c_str(), b->modpack.c_str());
                                                break;
                                            case 4:  // Actions (compare count)
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
                        RenderSceneRow(scene, i);
                    }

                    if (s_filteredScenes.empty()) {
                        ImGuiMCP::ImGui::TableNextRow();
                        ImGuiMCP::ImGui::TableSetColumnIndex(0);
                        ImGuiMCP::ImGui::TextDisabled("No scenes match the current filters.");
                    }

                    ImGuiMCP::ImGui::EndTable();
                }

                ImGuiMCP::ImGui::Unindent();
            }

            // ========== SCENE EDITOR WINDOW ==========
            if (s_editorWindowOpen && s_editorScene) {
                ImGuiMCP::ImGui::SetNextWindowSize(ImGuiMCP::ImVec2(800, 1200), ImGuiMCP::ImGuiCond_FirstUseEver);
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_WindowBg, ImGuiMCP::ImVec4(0.10f, 0.10f, 0.12f, 1.0f));

                std::string windowTitle = "Scene Editor - " + s_editorScene->id;
                if (ImGuiMCP::ImGui::Begin(windowTitle.c_str(), &s_editorWindowOpen, ImGuiMCP::ImGuiWindowFlags_None)) {
                    // Scene ID
                    ImGuiMCP::ImGui::SetWindowFontScale(1.3f);
                    ImGuiMCP::ImGui::TextColored(s_blueTextColor, "Scene ID:");
                    ImGuiMCP::ImGui::SetWindowFontScale(1.0f);
                    ImGuiMCP::ImGui::SameLine();
                    ImGuiMCP::ImGui::SetWindowFontScale(1.2f);
                    ImGuiMCP::ImGui::Text("%s", s_editorScene->id.c_str());
                    ImGuiMCP::ImGui::SetWindowFontScale(1.0f);

                    // Scene Name
                    ImGuiMCP::ImGui::Text("Name:");
                    ImGuiMCP::ImGui::SameLine();
                    ImGuiMCP::ImGui::TextColored(s_grayTextColor, "%s", s_editorScene->name.c_str());

                    // Modpack
                    ImGuiMCP::ImGui::Text("Modpack:");
                    ImGuiMCP::ImGui::SameLine();
                    ImGuiMCP::ImGui::TextColored(s_grayTextColor, "%s", s_editorScene->modpack.c_str());

                    // Furniture
                    ImGuiMCP::ImGui::Text("Furniture:");
                    ImGuiMCP::ImGui::SameLine();
                    if (!s_editorScene->furnitureType.empty()) {
                        ImGuiMCP::ImGui::TextColored(s_grayTextColor, "%s", s_editorScene->furnitureType.c_str());
                    } else {
                        ImGuiMCP::ImGui::TextDisabled("None");
                    }

                    ImGuiMCP::ImGui::Spacing();
                    ImGuiMCP::ImGui::Separator();
                    ImGuiMCP::ImGui::Spacing();

                    // Actor Setup
                    ImGuiMCP::ImGui::Text("Actor Setup:");
                    ImGuiMCP::ImGui::SameLine();
                    RenderGenderComposition(s_editorScene->actors);

                    // Display actor tags
                    for (size_t i = 0; i < s_editorScene->actors.size(); ++i) {
                        ImGuiMCP::ImGui::Text("  Actor %zu:", i);
                        ImGuiMCP::ImGui::SameLine();
                        if (!s_editorScene->actors[i].tags.empty()) {
                            for (size_t j = 0; j < s_editorScene->actors[i].tags.size(); ++j) {
                                ImGuiMCP::ImVec4 color = GetColorForTag(s_editorScene->actors[i].tags[j], true);
                                RenderPill(s_editorScene->actors[i].tags[j].c_str(), color, false);
                                if (j < s_editorScene->actors[i].tags.size() - 1) {
                                    ImGuiMCP::ImGui::SameLine();
                                }
                            }
                        } else {
                            ImGuiMCP::ImGui::TextDisabled("No tags");
                        }
                    }

                    ImGuiMCP::ImGui::Spacing();

                    // Actions
                    if (!s_editorScene->actions.empty()) {
                        ImGuiMCP::ImGui::Text("Actions:");
                        ImGuiMCP::ImGui::SameLine();
                        RenderActionPillCollection(s_editorScene->actions, s_emptyHighlightSet, UINT32_MAX, nullptr, nullptr);
                    }

                    ImGuiMCP::ImGui::Spacing();

                    // Scene Tags
                    if (!s_editorScene->tags.empty()) {
                        ImGuiMCP::ImGui::Text("Scene Tags:");
                        ImGuiMCP::ImGui::SameLine();
                        RenderPillCollection(s_editorScene->tags, s_emptyHighlightSet,
                            [](const std::string& tag) -> const std::string& { return tag; },
                            nullptr, nullptr, false, nullptr);
                    }

                    ImGuiMCP::ImGui::Spacing();
                    ImGuiMCP::ImGui::Separator();
                    ImGuiMCP::ImGui::Spacing();

                    // Description Editor
                    ImGuiMCP::ImGui::SetWindowFontScale(1.2f);
                    ImGuiMCP::ImGui::Text("Description:");
                    ImGuiMCP::ImGui::SetWindowFontScale(1.0f);
                    ImGuiMCP::ImGui::Spacing();

                    // File selector
                    ImGuiMCP::ImGui::Text("Save to file:");
                    ImGuiMCP::ImGui::SameLine();
                    ImGuiMCP::ImGui::SetNextItemWidth(300.0f);
                    ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_PopupBg, ImGuiMCP::ImVec4(0.12f, 0.12f, 0.14f, 1.0f));
                    if (ImGuiMCP::ImGui::BeginCombo("##target_file", s_editorSelectedFile.c_str())) {
                        auto descFiles = GetDescriptionFiles();

                        // Add default modpack file if not in list
                        std::string defaultFile = s_editorScene->modpack + ".json";
                        if (std::find(descFiles.begin(), descFiles.end(), defaultFile) == descFiles.end()) {
                            descFiles.insert(descFiles.begin(), defaultFile);
                        }

                        for (const auto& file : descFiles) {
                            bool isSelected = (s_editorSelectedFile == file);
                            if (ImGuiMCP::ImGui::Selectable(file.c_str(), isSelected)) {
                                s_editorSelectedFile = file;
                            }
                            if (isSelected) {
                                ImGuiMCP::ImGui::SetItemDefaultFocus();
                            }
                        }
                        ImGuiMCP::ImGui::EndCombo();
                    }
                    ImGuiMCP::ImGui::PopStyleColor();

                    ImGuiMCP::ImGui::Spacing();

                    // Placeholder legend
                    ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.7f, 0.7f, 0.7f, 1.0f), "Placeholders:");
                    ImGuiMCP::ImGui::SameLine();
                    ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.4f, 0.8f, 1.0f, 1.0f), "{{scenedata.actors.0}}");
                    for (size_t i = 1; i < s_editorScene->actors.size(); ++i) {
                        ImGuiMCP::ImGui::SameLine();
                        ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.7f, 0.7f, 0.7f, 1.0f), ",");
                        ImGuiMCP::ImGui::SameLine();
                        std::string placeholder = "{{scenedata.actors." + std::to_string(i) + "}}";
                        ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.4f, 0.8f, 1.0f, 1.0f), "%s", placeholder.c_str());
                    }

                    ImGuiMCP::ImGui::Spacing();

                    // Calculate text area height with minimum
                    ImGuiMCP::ImVec2 availRegion;
                    ImGuiMCP::ImGui::GetContentRegionAvail(&availRegion);
                    float textAreaHeight = availRegion.y - 50.0f;
                    const float minTextAreaHeight = 200.0f;
                    if (textAreaHeight < minTextAreaHeight) {
                        textAreaHeight = minTextAreaHeight;
                    }

                    ImGuiMCP::ImGui::InputTextMultiline("##description",
                        s_editorDescriptionBuffer,
                        sizeof(s_editorDescriptionBuffer),
                        ImGuiMCP::ImVec2(-1.0f, textAreaHeight),
                        0, nullptr, nullptr);

                    ImGuiMCP::ImGui::Spacing();

                    // Save Button
                    if (RenderStyledButton("Save Description", ImGuiMCP::ImVec2(150, 0), s_greenButtonColor)) {
                        // Save to JSON file
                        SaveDescriptionToFile(s_editorScene->id, s_editorDescriptionBuffer, s_editorSelectedFile);
                    }

                    ImGuiMCP::ImGui::SameLine();

                    if (ImGuiMCP::ImGui::Button("Close", ImGuiMCP::ImVec2(100, 0))) {
                        s_editorWindowOpen = false;
                    }
                }
                ImGuiMCP::ImGui::End();
                ImGuiMCP::ImGui::PopStyleColor();
            }

            // Apply filters on first render
            static bool s_firstRender = true;
            if (s_firstRender) {
                ApplyFilters();
                s_firstRender = false;
            }
        }
    }
}
