#pragma once

#include "PCH.h"
#include "SceneDatabase.h"
#include "ActionDatabase.h"
#include "OStimIntegration.h"
#include <SKSEMenuFramework.h>
#include <string>
#include <vector>
#include <unordered_set>
#include <unordered_map>
#include <functional>

namespace OStimNavigator {
    namespace UI {
        namespace SceneUIHelpers {

            // ========== COLOR PALETTE ==========

            // DARKENED colors for good contrast with white text on dark backgrounds
            extern const ImGuiMCP::ImVec4 s_colorPalette[];
            extern const int s_colorPaletteSize;
            extern const ImGuiMCP::ImVec4 s_grayPillColor;

            // UI color constants
            extern const ImGuiMCP::ImVec4 s_greenButtonColor;
            extern const ImGuiMCP::ImVec4 s_blueButtonColor;
            extern const ImGuiMCP::ImVec4 s_blueTextColor;
            extern const ImGuiMCP::ImVec4 s_grayTextColor;
            extern const ImGuiMCP::ImVec4 s_orangeTextColor;
            extern const ImGuiMCP::ImVec4 s_redTextColor;

            // ========== PILL RENDERING ==========

            // Hash a string to get a consistent color from the palette
            ImGuiMCP::ImVec4 GetColorForTag(const std::string& tag, bool isHighlighted);

            // Render a pill-shaped badge with text (using colored button)
            bool RenderPill(const char* text, const ImGuiMCP::ImVec4& color, bool isSelected = false);

            // ========== PILL COLLECTION RENDERING ==========

            // Helper to render a collection of items as pills
            template<typename Container, typename Accessor>
            void RenderPillCollection(const Container& items,
                                     const std::unordered_set<std::string>& highlightSet,
                                     Accessor accessor,
                                     std::unordered_set<std::string>* filterSet = nullptr,
                                     std::function<void(const typename Container::value_type&)> customTooltipRenderer = nullptr,
                                     bool checkTruncation = false,
                                     std::function<void()> onChangeCallback = nullptr) {
                // Store cursor position to create an invisible button for tooltip
                ImGuiMCP::ImVec2 cursorPos;
                ImGuiMCP::ImGui::GetCursorScreenPos(&cursorPos);
                ImGuiMCP::ImVec2 cellMin = cursorPos;

                // Convert to vector and sort with priority: selected > highlighted > alphabetical
                std::vector<typename Container::value_type> sortedItems(items.begin(), items.end());
                std::sort(sortedItems.begin(), sortedItems.end(), [&](const auto& a, const auto& b) {
                    const std::string& tagA = accessor(a);
                    const std::string& tagB = accessor(b);

                    bool isSelectedA = filterSet && filterSet->count(tagA) > 0;
                    bool isSelectedB = filterSet && filterSet->count(tagB) > 0;
                    bool isHighlightedA = highlightSet.count(tagA) > 0;
                    bool isHighlightedB = highlightSet.count(tagB) > 0;

                    // Priority 1: Selected in filter
                    if (isSelectedA != isSelectedB) {
                        return isSelectedA;
                    }

                    // Priority 2: Highlighted (matches current scene)
                    if (isHighlightedA != isHighlightedB) {
                        return isHighlightedA;
                    }

                    // Priority 3: Alphabetical
                    return tagA < tagB;
                });

                // Track truncation if needed
                bool anyTruncated = false;
                float currentX = 0.0f;
                ImGuiMCP::ImVec2 availRegion = ImGuiMCP::ImVec2(0, 0);
                if (checkTruncation) {
                    ImGuiMCP::ImGui::GetContentRegionAvail(&availRegion);
                }

                // Track which item is being hovered (for custom tooltips)
                const typename Container::value_type* hoveredItem = nullptr;

                size_t count = 0;
                for (const auto& item : sortedItems) {
                    const std::string& tag = accessor(item);
                    bool isHighlighted = highlightSet.count(tag) > 0;
                    bool isSelected = filterSet && filterSet->count(tag) > 0;
                    ImGuiMCP::ImVec4 color = GetColorForTag(tag, isHighlighted);

                    // Push unique ID for this pill to avoid conflicts when same tag appears in multiple rows
                    ImGuiMCP::ImGui::PushID((int)count);

                    bool clicked = RenderPill(tag.c_str(), color, isSelected);

                    if (clicked) {
                        // When clicked, toggle the filter set if provided
                        if (filterSet) {
                            bool wasSelected = filterSet->count(tag) > 0;
                            if (wasSelected) {
                                filterSet->erase(tag);
                            } else {
                                filterSet->insert(tag);
                            }

                            if (onChangeCallback) {
                                onChangeCallback();
                            }
                        }
                    }

                    ImGuiMCP::ImGui::PopID();

                    // Track hovered item for custom tooltips
                    if (ImGuiMCP::ImGui::IsItemHovered()) {
                        hoveredItem = &item;
                    }

                    // Check truncation if needed
                    if (checkTruncation) {
                        ImGuiMCP::ImVec2 textSize;
                        ImGuiMCP::ImGui::CalcTextSize(&textSize, tag.c_str(), nullptr, false, -1.0f);
                        currentX += textSize.x + 16.0f;
                        if (currentX > availRegion.x) {
                            anyTruncated = true;
                        }
                    }

                    count++;
                    if (count < sortedItems.size()) {
                        ImGuiMCP::ImGui::SameLine();
                    }
                }

                // Handle tooltips
                ImGuiMCP::ImVec2 cellMax;
                ImGuiMCP::ImGui::GetItemRectMax(&cellMax);
                ImGuiMCP::ImGui::GetContentRegionAvail(&availRegion);
                cellMax.x = cellMin.x + availRegion.x + (cellMax.x - cellMin.x);

                if (ImGuiMCP::ImGui::IsMouseHoveringRect(cellMin, cellMax) && !items.empty()) {
                    // Show custom tooltip if provided and item is hovered
                    if (customTooltipRenderer && hoveredItem) {
                        ImGuiMCP::ImGui::BeginTooltip();

                        // Show truncated list first if needed
                        if (anyTruncated) {
                            std::vector<std::string> allTags;
                            for (const auto& item : items) {
                                allTags.push_back(accessor(item));
                            }
                            std::sort(allTags.begin(), allTags.end());

                            std::string allTagsStr;
                            for (size_t idx = 0; idx < allTags.size(); ++idx) {
                                if (idx > 0) allTagsStr += ", ";
                                allTagsStr += allTags[idx];
                            }
                            ImGuiMCP::ImGui::TextWrapped("%s", allTagsStr.c_str());
                            ImGuiMCP::ImGui::Spacing();
                            ImGuiMCP::ImGui::Separator();
                            ImGuiMCP::ImGui::Spacing();
                        }

                        // Custom tooltip content
                        customTooltipRenderer(*hoveredItem);

                        ImGuiMCP::ImGui::EndTooltip();
                    }
                    // Default tooltip: show all items if truncated or no custom renderer
                    else if (!customTooltipRenderer || anyTruncated) {
                        std::vector<std::string> tooltipItems;
                        for (const auto& item : items) {
                            tooltipItems.push_back(accessor(item));
                        }
                        std::sort(tooltipItems.begin(), tooltipItems.end());

                        std::string tooltipText;
                        for (size_t idx = 0; idx < tooltipItems.size(); ++idx) {
                            if (idx > 0) tooltipText += ", ";
                            tooltipText += tooltipItems[idx];
                        }
                        ImGuiMCP::ImGui::SetTooltip("%s", tooltipText.c_str());
                    }
                }
            }

            // ========== GENDER COMPOSITION ==========

            // Helper to render gender composition icons
            void RenderGenderComposition(const std::vector<ActorData>& actors);

            // ========== TABLE CELL RENDERERS ==========

            // Helper to render table column with text and tooltip
            void RenderTableTextColumn(const char* text);

            // Specialized function to render action pills with detailed tooltips
            void RenderActionPillCollection(const std::vector<SceneActionData>& actions,
                                           const std::unordered_set<std::string>& highlightSet,
                                           OStim::Thread* thread = nullptr,
                                           std::unordered_set<std::string>* filterSet = nullptr,
                                           std::function<void()> onChangeCallback = nullptr);

            // ========== FILTER UI COMPONENTS ==========

            // Build preview text for multi-select combo boxes
            std::string BuildPreviewText(const std::unordered_set<std::string>& selectedItems, const char* emptyText, int maxDisplay = 3);

            // Render OR/AND toggle button for filters
            bool RenderAndOrToggle(bool& andMode, const char* id, const char* andTooltip, const char* orTooltip);

            // Helper to render searchable tag/item selection list
            void RenderSearchableItemList(const std::vector<std::string>& allItems,
                                         std::unordered_set<std::string>& selectedItems,
                                         char* searchBuffer, size_t bufferSize,
                                         const char* searchId, const char* searchHint,
                                         const char* scrollId, float scrollHeight = 200.0f,
                                         std::function<void()> onChangeCallback = nullptr);

            // Helper to render complete filter combo with AND/OR toggle
            void RenderFilterCombo(const char* label, bool& andMode, const char* andTooltip, const char* orTooltip,
                                  std::unordered_set<std::string>& selectedItems, const std::vector<std::string>& allItems,
                                  char* searchBuffer, size_t bufferSize,
                                  const char* comboId, const char* searchId, const char* searchHint, const char* scrollId,
                                  std::function<void()> onChangeCallback = nullptr);

            // ========== PAGINATION ==========

            // Helper to render pagination controls
            void RenderPaginationControls(int& currentPage, int& itemsPerPage, size_t totalItems);

            // ========== UTILITY FUNCTIONS ==========

            // Helper to render styled button with color
            bool RenderStyledButton(const char* label, const ImGuiMCP::ImVec2& size, const ImGuiMCP::ImVec4& color);

            // Helper to render checkbox with tooltip
            bool RenderCheckboxWithTooltip(const char* label, bool* value, const char* tooltip);

            // Get RE::Actor from thread actor index
            RE::Actor* GetActorFromThread(OStim::Thread* thread, uint32_t index);

            // Helper to get actor name from RE::Actor
            std::string GetActorName(RE::Actor* actor);

            // Helper to build comma-separated list from collection (template for vector/set)
            template<typename Container>
            std::string BuildCommaSeparatedList(const Container& items, const std::string& prefix = "") {
                if (items.empty()) return prefix + "None";

                std::string result = prefix;
                bool first = true;
                for (const auto& item : items) {
                    if (!first) result += ", ";
                    result += item;
                    first = false;
                }
                return result;
            }
        }
    }
}
