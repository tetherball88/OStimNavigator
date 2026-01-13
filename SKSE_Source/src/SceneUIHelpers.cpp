#include "SceneUIHelpers.h"
#include "StringUtils.h"
#include <algorithm>

namespace OStimNavigator {
    namespace UI {
        namespace SceneUIHelpers {

            // ========== COLOR PALETTE DEFINITIONS ==========

            // DARKENED colors for good contrast with white text on dark backgrounds
            const ImGuiMCP::ImVec4 s_colorPalette[] = {
                ImGuiMCP::ImVec4(0.45f, 0.25f, 0.60f, 1.0f),  // Purple - darkened
                ImGuiMCP::ImVec4(0.20f, 0.40f, 0.70f, 1.0f),  // Blue - darkened
                ImGuiMCP::ImVec4(0.15f, 0.50f, 0.50f, 1.0f),  // Cyan - darkened
                ImGuiMCP::ImVec4(0.25f, 0.55f, 0.30f, 1.0f),  // Green - darkened
                ImGuiMCP::ImVec4(0.70f, 0.55f, 0.10f, 1.0f),  // Yellow - darkened
                ImGuiMCP::ImVec4(0.70f, 0.40f, 0.15f, 1.0f),  // Orange - darkened
                ImGuiMCP::ImVec4(0.65f, 0.20f, 0.20f, 1.0f),  // Red - darkened
                ImGuiMCP::ImVec4(0.70f, 0.30f, 0.50f, 1.0f),  // Pink - darkened
                ImGuiMCP::ImVec4(0.60f, 0.20f, 0.60f, 1.0f),  // Magenta - darkened
                ImGuiMCP::ImVec4(0.30f, 0.50f, 0.70f, 1.0f),  // Light Blue - darkened
                ImGuiMCP::ImVec4(0.45f, 0.60f, 0.30f, 1.0f),  // Lime - darkened
                ImGuiMCP::ImVec4(0.70f, 0.45f, 0.30f, 1.0f),  // Peach - darkened
                ImGuiMCP::ImVec4(0.50f, 0.35f, 0.70f, 1.0f),  // Lavender - darkened
                ImGuiMCP::ImVec4(0.25f, 0.60f, 0.60f, 1.0f),  // Turquoise - darkened
                ImGuiMCP::ImVec4(0.70f, 0.60f, 0.25f, 1.0f),  // Gold - darkened
                ImGuiMCP::ImVec4(0.60f, 0.30f, 0.35f, 1.0f),  // Rose - darkened
                ImGuiMCP::ImVec4(0.35f, 0.45f, 0.60f, 1.0f),  // Steel Blue - darkened
                ImGuiMCP::ImVec4(0.55f, 0.45f, 0.25f, 1.0f),  // Tan - darkened
                ImGuiMCP::ImVec4(0.35f, 0.60f, 0.45f, 1.0f),  // Mint - darkened
                ImGuiMCP::ImVec4(0.60f, 0.35f, 0.60f, 1.0f),  // Orchid - darkened
            };
            const int s_colorPaletteSize = sizeof(s_colorPalette) / sizeof(s_colorPalette[0]);
            const ImGuiMCP::ImVec4 s_grayPillColor = ImGuiMCP::ImVec4(0.35f, 0.35f, 0.35f, 1.0f);

            // UI color constants
            const ImGuiMCP::ImVec4 s_greenButtonColor = ImGuiMCP::ImVec4(0.36f, 0.72f, 0.36f, 1.0f);
            const ImGuiMCP::ImVec4 s_blueButtonColor = ImGuiMCP::ImVec4(0.29f, 0.62f, 1.0f, 1.0f);
            const ImGuiMCP::ImVec4 s_blueTextColor = ImGuiMCP::ImVec4(0.29f, 0.62f, 1.0f, 1.0f);
            const ImGuiMCP::ImVec4 s_grayTextColor = ImGuiMCP::ImVec4(0.7f, 0.7f, 0.7f, 1.0f);
            const ImGuiMCP::ImVec4 s_orangeTextColor = ImGuiMCP::ImVec4(1.0f, 0.5f, 0.0f, 1.0f);
            const ImGuiMCP::ImVec4 s_redTextColor = ImGuiMCP::ImVec4(1.0f, 0.0f, 0.0f, 1.0f);

            // ========== PILL RENDERING ==========

            ImGuiMCP::ImVec4 GetColorForTag(const std::string& tag, bool isHighlighted) {
                if (!isHighlighted) {
                    return s_grayPillColor;
                }

                // Simple hash function for consistent color assignment
                std::hash<std::string> hasher;
                size_t hash = hasher(tag);
                int colorIndex = hash % s_colorPaletteSize;
                return s_colorPalette[colorIndex];
            }

            bool RenderPill(const char* text, const ImGuiMCP::ImVec4& color, bool isSelected) {
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_Button, color);

                // Darker shade for hover
                ImGuiMCP::ImVec4 hoverColor = ImGuiMCP::ImVec4(
                    color.x * 0.8f, color.y * 0.8f, color.z * 0.8f, color.w
                );
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_ButtonHovered, hoverColor);
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_ButtonActive, hoverColor);

                // Add thicker, more prominent border for selected items
                if (isSelected) {
                    ImGuiMCP::ImGui::PushStyleVar(ImGuiMCP::ImGuiStyleVar_FrameBorderSize, 2.5f);
                    ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_Border, ImGuiMCP::ImVec4(1.0f, 0.85f, 0.0f, 1.0f));  // Gold border
                }

                bool clicked = ImGuiMCP::ImGui::SmallButton(text);

                if (isSelected) {
                    ImGuiMCP::ImGui::PopStyleColor();  // Border color
                    ImGuiMCP::ImGui::PopStyleVar();     // Border size
                }

                ImGuiMCP::ImGui::PopStyleColor(3);

                return clicked;
            }

            // ========== GENDER COMPOSITION ==========

            void RenderGenderComposition(const std::vector<ActorData>& actors) {
                if (actors.empty()) return;

                // Collect and sort actors by gender (males first, then females, then others)
                std::vector<std::string> genderList;
                for (const auto& actor : actors) {
                    std::string intendedSex = actor.intendedSex;
                    StringUtils::ToLower(intendedSex);
                    genderList.push_back(intendedSex);
                }

                // Sort: males first, females second, others last
                std::sort(genderList.begin(), genderList.end(), [](const std::string& a, const std::string& b) {
                    int priorityA = (a == "male") ? 0 : (a == "female") ? 1 : 2;
                    int priorityB = (b == "male") ? 0 : (b == "female") ? 1 : 2;
                    return priorityA < priorityB;
                });

                // Display gender icons
                FontAwesome::PushSolid();
                for (const auto& gender : genderList) {
                    if (gender == "male") {
                        ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.4f, 0.6f, 1.0f, 1.0f), "%s", FontAwesome::UnicodeToUtf8(0xf222).c_str());
                    } else if (gender == "female") {
                        ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(1.0f, 0.45f, 0.7f, 1.0f), "%s", FontAwesome::UnicodeToUtf8(0xf221).c_str());
                    } else {
                        ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.75f, 0.55f, 1.0f, 1.0f), "%s", FontAwesome::UnicodeToUtf8(0xf224).c_str());
                    }
                    if (&gender != &genderList.back()) {
                        ImGuiMCP::ImGui::SameLine();
                    }
                }
                FontAwesome::Pop();
            }

            // ========== TABLE CELL RENDERERS ==========

            void RenderTableTextColumn(const char* text) {
                // Get available width for the cell
                ImGuiMCP::ImVec2 availRegion;
                ImGuiMCP::ImGui::GetContentRegionAvail(&availRegion);
                float availWidth = availRegion.x;

                // Calculate text size
                ImGuiMCP::ImVec2 textSize;
                ImGuiMCP::ImGui::CalcTextSize(&textSize, text, nullptr, false, -1.0f);

                // If text is too wide, truncate with ellipsis
                if (textSize.x > availWidth) {
                    std::string truncated = text;
                    const char* ellipsis = "...";
                    ImGuiMCP::ImVec2 ellipsisSize;
                    ImGuiMCP::ImGui::CalcTextSize(&ellipsisSize, ellipsis, nullptr, false, -1.0f);

                    // Binary search for the right truncation point
                    int len = truncated.length();
                    while (len > 0) {
                        std::string testStr = truncated.substr(0, len) + ellipsis;
                        ImGuiMCP::ImVec2 testSize;
                        ImGuiMCP::ImGui::CalcTextSize(&testSize, testStr.c_str(), nullptr, false, -1.0f);
                        if (testSize.x <= availWidth) {
                            ImGuiMCP::ImGui::TextUnformatted(testStr.c_str());
                            break;
                        }
                        len--;
                    }

                    // Show full text in tooltip
                    if (ImGuiMCP::ImGui::IsItemHovered()) {
                        ImGuiMCP::ImGui::SetTooltip("%s", text);
                    }
                } else {
                    ImGuiMCP::ImGui::TextUnformatted(text);
                    if (ImGuiMCP::ImGui::IsItemHovered()) {
                        ImGuiMCP::ImGui::SetTooltip("%s", text);
                    }
                }
            }

            void RenderActionPillCollection(const std::vector<SceneActionData>& actions,
                                           const std::unordered_set<std::string>& highlightSet,
                                           uint32_t threadID,
                                           std::unordered_set<std::string>* filterSet,
                                           std::function<void()> onChangeCallback) {
                RenderPillCollection(
                    actions,
                    highlightSet,
                    [](const SceneActionData& action) -> const std::string& { return action.type; },
                    filterSet,
                    [threadID](const SceneActionData& action) {
                        // Custom tooltip for action details
                        ImGuiMCP::ImGui::TextColored(ImGuiMCP::ImVec4(0.8f, 0.8f, 1.0f, 1.0f), "Action: %s", action.type.c_str());

                        if (threadID != -1) {
                            if (action.actor >= 0) {
                                RE::Actor* actor = GetActorFromThread(threadID, action.actor);
                                ImGuiMCP::ImGui::Text("Actor: %s (Index %d)", GetActorName(actor).c_str(), action.actor);
                            }
                            if (action.target >= 0) {
                                RE::Actor* target = GetActorFromThread(threadID, action.target);
                                ImGuiMCP::ImGui::Text("Target: %s (Index %d)", GetActorName(target).c_str(), action.target);
                            }
                            if (action.performer >= 0) {
                                RE::Actor* performer = GetActorFromThread(threadID, action.performer);
                                ImGuiMCP::ImGui::Text("Performer: %s (Index %d)", GetActorName(performer).c_str(), action.performer);
                            }
                        } else {
                            // Show actor indexes when no thread available
                            if (action.actor >= 0)
                                ImGuiMCP::ImGui::Text("Actor: Index %d", action.actor);
                            if (action.target >= 0)
                                ImGuiMCP::ImGui::Text("Target: Index %d", action.target);
                            if (action.performer >= 0)
                                ImGuiMCP::ImGui::Text("Performer: Index %d", action.performer);
                        }
                    },
                    true,  // Enable truncation checking
                    onChangeCallback
                );
            }

            // ========== FILTER UI COMPONENTS ==========

            std::string BuildPreviewText(const std::unordered_set<std::string>& selectedItems, const char* emptyText, int maxDisplay) {
                if (selectedItems.empty()) {
                    return emptyText;
                }

                std::string preview;
                int count = 0;
                for (const auto& item : selectedItems) {
                    if (count > 0) preview += ", ";
                    preview += item;
                    count++;
                    if (count >= maxDisplay) {
                        preview += "...";
                        break;
                    }
                }
                return preview;
            }

            bool RenderAndOrToggle(bool& andMode, const char* id, const char* andTooltip, const char* orTooltip) {
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_Button, andMode ? s_greenButtonColor : s_blueButtonColor);
                std::string label = andMode ? "AND##" : "OR##";
                label += id;
                bool clicked = false;
                if (ImGuiMCP::ImGui::SmallButton(label.c_str())) {
                    andMode = !andMode;
                    clicked = true;
                }
                ImGuiMCP::ImGui::PopStyleColor();
                if (ImGuiMCP::ImGui::IsItemHovered()) {
                    ImGuiMCP::ImGui::SetTooltip(andMode ? andTooltip : orTooltip);
                }
                return clicked;
            }

            void RenderSearchableItemList(const std::vector<std::string>& allItems,
                                         std::unordered_set<std::string>& selectedItems,
                                         char* searchBuffer, size_t bufferSize,
                                         const char* searchId, const char* searchHint,
                                         const char* scrollId, float scrollHeight,
                                         std::function<void()> onChangeCallback) {
                ImGuiMCP::ImGui::InputTextWithHint(searchId, searchHint, searchBuffer, bufferSize);
                ImGuiMCP::ImGui::Separator();

                if (ImGuiMCP::ImGui::BeginChild(scrollId, ImGuiMCP::ImVec2(0, scrollHeight))) {
                    std::string searchLower = searchBuffer;
                    std::transform(searchLower.begin(), searchLower.end(), searchLower.begin(), ::tolower);

                    for (const auto& item : allItems) {
                        if (searchLower.length() > 0) {
                            std::string itemLower = item;
                            std::transform(itemLower.begin(), itemLower.end(), itemLower.begin(), ::tolower);
                            if (itemLower.find(searchLower) == std::string::npos) {
                                continue;
                            }
                        }

                        bool selected = selectedItems.find(item) != selectedItems.end();
                        if (ImGuiMCP::ImGui::Checkbox(item.c_str(), &selected)) {
                            if (selected) {
                                selectedItems.insert(item);
                            } else {
                                selectedItems.erase(item);
                            }
                            if (onChangeCallback) {
                                onChangeCallback();
                            }
                        }
                    }
                }
                ImGuiMCP::ImGui::EndChild();
            }

            void RenderFilterCombo(const char* label, bool& andMode, const char* andTooltip, const char* orTooltip,
                                  std::unordered_set<std::string>& selectedItems, const std::vector<std::string>& allItems,
                                  char* searchBuffer, size_t bufferSize,
                                  const char* comboId, const char* searchId, const char* searchHint, const char* scrollId,
                                  std::function<void()> onChangeCallback) {
                ImGuiMCP::ImGui::AlignTextToFramePadding();

                // Highlight label if filter is active
                bool hasActiveFilter = !selectedItems.empty();
                if (hasActiveFilter) {
                    ImGuiMCP::ImGui::TextColored(s_blueTextColor, "%s (%zu)", label, selectedItems.size());
                } else {
                    ImGuiMCP::ImGui::Text("%s", label);
                }
                ImGuiMCP::ImGui::SameLine();

                if (RenderAndOrToggle(andMode, comboId, andTooltip, orTooltip)) {
                    if (onChangeCallback) {
                        onChangeCallback();
                    }
                }
                ImGuiMCP::ImGui::SameLine();

                std::string preview = BuildPreviewText(selectedItems, "None");

                ImGuiMCP::ImGui::SetNextItemWidth(-100.0f);
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_PopupBg, ImGuiMCP::ImVec4(0.12f, 0.12f, 0.14f, 1.0f));
                if (ImGuiMCP::ImGui::BeginCombo(comboId, preview.c_str())) {
                    RenderSearchableItemList(allItems, selectedItems, searchBuffer, bufferSize, searchId, searchHint, scrollId, 200.0f, onChangeCallback);
                    ImGuiMCP::ImGui::EndCombo();
                }
                ImGuiMCP::ImGui::PopStyleColor();

                ImGuiMCP::ImGui::Spacing();
            }

            // ========== PAGINATION ==========

            void RenderPaginationControls(int& currentPage, int& itemsPerPage, size_t totalItems) {
                if (totalItems == 0) return;

                int totalPages = ((int)totalItems + itemsPerPage - 1) / itemsPerPage;

                if (ImGuiMCP::ImGui::Button("< Prev", ImGuiMCP::ImVec2(80, 0))) {
                    if (currentPage > 0) currentPage--;
                }
                ImGuiMCP::ImGui::SameLine();
                ImGuiMCP::ImGui::Text("Page %d of %d", currentPage + 1, totalPages);
                ImGuiMCP::ImGui::SameLine();
                if (ImGuiMCP::ImGui::Button("Next >", ImGuiMCP::ImVec2(80, 0))) {
                    if (currentPage < totalPages - 1) currentPage++;
                }

                ImGuiMCP::ImGui::SameLine();
                ImGuiMCP::ImGui::SetCursorPosX(ImGuiMCP::ImGui::GetCursorPosX() + 20.0f);
                ImGuiMCP::ImGui::Text("Per Page:");
                ImGuiMCP::ImGui::SameLine();
                ImGuiMCP::ImGui::SetNextItemWidth(80.0f);
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_PopupBg, ImGuiMCP::ImVec4(0.12f, 0.12f, 0.14f, 1.0f));
                if (ImGuiMCP::ImGui::BeginCombo("##perpage", std::to_string(itemsPerPage).c_str())) {
                    if (ImGuiMCP::ImGui::Selectable("25", itemsPerPage == 25)) itemsPerPage = 25;
                    if (ImGuiMCP::ImGui::Selectable("50", itemsPerPage == 50)) itemsPerPage = 50;
                    if (ImGuiMCP::ImGui::Selectable("100", itemsPerPage == 100)) itemsPerPage = 100;
                    ImGuiMCP::ImGui::EndCombo();
                }
                ImGuiMCP::ImGui::PopStyleColor();

                ImGuiMCP::ImGui::Spacing();
            }

            // ========== UTILITY FUNCTIONS ==========

            bool RenderStyledButton(const char* label, const ImGuiMCP::ImVec2& size, const ImGuiMCP::ImVec4& color) {
                ImGuiMCP::ImGui::PushStyleColor(ImGuiMCP::ImGuiCol_Button, color);
                bool clicked = ImGuiMCP::ImGui::Button(label, size);
                ImGuiMCP::ImGui::PopStyleColor();
                return clicked;
            }

            bool RenderCheckboxWithTooltip(const char* label, bool* value, const char* tooltip) {
                bool changed = ImGuiMCP::ImGui::Checkbox(label, value);
                if (ImGuiMCP::ImGui::IsItemHovered()) {
                    ImGuiMCP::ImGui::SetTooltip("%s", tooltip);
                }
                return changed;
            }

            RE::Actor* GetActorFromThread(uint32_t threadID, uint32_t index) {
                return OStimNavigator::OStimIntegration::GetSingleton().GetActorFromThread(threadID, index);
            }

            std::string GetActorName(RE::Actor* actor) {
                if (!actor) return "Unknown";
                const char* name = actor->GetName();
                return (name && name[0] != '\0') ? name : "Unknown";
            }
        }
    }
}
