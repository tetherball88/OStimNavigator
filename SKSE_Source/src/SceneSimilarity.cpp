#include "SceneSimilarity.h"
#include "ActionDatabase.h"
#include <algorithm>
#include <unordered_set>

namespace OStimNavigator {
    
    PositionFeatures SceneSimilarity::GetPositionFeatures(const std::vector<std::string>& actorTags) {
        PositionFeatures features;
        
        // Convert all tags to lowercase for comparison
        std::unordered_set<std::string> tags;
        for (const auto& tag : actorTags) {
            std::string lowerTag = tag;
            std::transform(lowerTag.begin(), lowerTag.end(), lowerTag.begin(), ::tolower);
            tags.insert(lowerTag);
        }
        
        // Determine height level (priority: most specific first)
        if (tags.count("standing") || tags.count("suspended") || tags.count("handstanding")) {
            features.height = HeightLevel::High;
        } else if (tags.count("sitting") || tags.count("squatting")) {
            features.height = HeightLevel::MediumHigh;
        } else if (tags.count("kneeling") || tags.count("bendover")) {
            features.height = HeightLevel::MediumLow;
        } else if (tags.count("allfours") || tags.count("lyingback") || tags.count("lyingfront") || 
                   tags.count("lyingside") || tags.count("sleeping") || tags.count("drowsy") || tags.count("onbottom")) {
            features.height = HeightLevel::Low;
        }
        
        // Determine orientation
        if (tags.count("standing") || tags.count("kneeling") || tags.count("squatting") || 
            tags.count("sitting") || tags.count("suspended")) {
            features.orientation = Orientation::Vertical;
        } else if (tags.count("bendover") || tags.count("handstanding") || tags.count("upsidedown")) {
            features.orientation = Orientation::Diagonal;
        } else if (tags.count("lyingback") || tags.count("lyingfront") || tags.count("lyingside") || 
                   tags.count("sleeping") || tags.count("drowsy") || tags.count("allfours")) {
            features.orientation = Orientation::Horizontal;
        }
        
        // Determine activity level
        if (tags.count("standing") || tags.count("sitting") || tags.count("squatting") || tags.count("ontop")) {
            features.activity = Activity::Active;
        } else if (tags.count("sleeping") || tags.count("drowsy") || tags.count("onbottom") || tags.count("suspended")) {
            features.activity = Activity::Passive;
        } else if (tags.count("bendover") || tags.count("allfours") || tags.count("spreadlegs") || 
                   tags.count("kneeling") || tags.count("lyingback") || tags.count("lyingfront") || tags.count("lyingside")) {
            features.activity = Activity::Neutral;
        }
        
        return features;
    }
    
    float SceneSimilarity::CalculatePositionSimilarity(const PositionFeatures& featuresA, const PositionFeatures& featuresB) {
        float matchingDimensions = 0.0f;
        int totalDimensions = 0;
        
        // Height similarity
        if (featuresA.height != HeightLevel::None && featuresB.height != HeightLevel::None) {
            totalDimensions++;
            int heightDiff = abs(static_cast<int>(featuresA.height) - static_cast<int>(featuresB.height));
            // Perfect match = 1.0, adjacent = 0.66, two away = 0.33, opposite = 0.0
            float heightSimilarity = std::max(0.0f, 1.0f - (heightDiff * 0.33f));
            matchingDimensions += heightSimilarity;
        }
        
        // Orientation similarity
        if (featuresA.orientation != Orientation::None && featuresB.orientation != Orientation::None) {
            totalDimensions++;
            if (featuresA.orientation == featuresB.orientation) {
                matchingDimensions += 1.0f;
            } else {
                // Diagonal is somewhat similar to both vertical and horizontal
                int orientDiff = abs(static_cast<int>(featuresA.orientation) - static_cast<int>(featuresB.orientation));
                matchingDimensions += (orientDiff == 1) ? 0.5f : 0.0f;
            }
        }
        
        // Activity similarity
        if (featuresA.activity != Activity::None && featuresB.activity != Activity::None) {
            totalDimensions++;
            if (featuresA.activity == featuresB.activity) {
                matchingDimensions += 1.0f;
            } else {
                // Neutral is somewhat similar to both active and passive
                int activityDiff = abs(static_cast<int>(featuresA.activity) - static_cast<int>(featuresB.activity));
                matchingDimensions += (activityDiff == 1) ? 0.5f : 0.0f;
            }
        }
        
        return (totalDimensions > 0) ? (matchingDimensions / totalDimensions) : 0.0f;
    }
    
    float SceneSimilarity::CalculateSimilarityScore(SceneData* sceneA, SceneData* sceneB) {
        if (!sceneA || !sceneB) return 0.0f;
        
        auto& actionDB = ActionDatabase::GetSingleton();
        if (!actionDB.IsLoaded()) return 0.0f;
        
        // Extract action types from both scenes
        auto extractActions = [&](SceneData* scene, const std::string& categoryTag) -> std::unordered_set<std::string> {
            std::unordered_set<std::string> actions;
            for (const auto& action : scene->actions) {
                // If categoryTag is specified, only include actions with that tag
                if (!categoryTag.empty()) {
                    if (actionDB.ActionHasTag(action.type, categoryTag)) {
                        actions.insert(action.type);
                    }
                } else {
                    actions.insert(action.type);
                }
            }
            return actions;
        };
        
        // Determine comparison category based on action tags
        auto hasActionsWithTag = [&](SceneData* scene, const std::string& tag) -> bool {
            for (const auto& action : scene->actions) {
                if (actionDB.ActionHasTag(action.type, tag)) {
                    return true;
                }
            }
            return false;
        };
        
        // Priority hierarchy: sexual > sensual/romantic > all
        std::string categoryTag;
        bool sceneAHasSexual = hasActionsWithTag(sceneA, "sexual");
        bool sceneBHasSexual = hasActionsWithTag(sceneB, "sexual");
        
        if (sceneAHasSexual || sceneBHasSexual) {
            // Compare sexual actions
            categoryTag = "sexual";
        } else {
            bool sceneAHasSensual = hasActionsWithTag(sceneA, "sensual") || hasActionsWithTag(sceneA, "romantic");
            bool sceneBHasSensual = hasActionsWithTag(sceneB, "sensual") || hasActionsWithTag(sceneB, "romantic");
            
            if (sceneAHasSensual || sceneBHasSensual) {
                // Compare sensual/romantic actions
                categoryTag = "sensual"; // Note: we'll check both sensual and romantic below
            } else {
                // Compare all actions
                categoryTag = "";
            }
        }
        
        // Extract action sets based on category
        std::unordered_set<std::string> actionsA, actionsB;
        
        if (categoryTag == "sexual") {
            // Extract only sexual actions
            actionsA = extractActions(sceneA, "sexual");
            actionsB = extractActions(sceneB, "sexual");
        } else if (categoryTag == "sensual") {
            // Special case: include both sensual and romantic
            auto sensualA = extractActions(sceneA, "sensual");
            auto romanticA = extractActions(sceneA, "romantic");
            actionsA.insert(sensualA.begin(), sensualA.end());
            actionsA.insert(romanticA.begin(), romanticA.end());
            
            auto sensualB = extractActions(sceneB, "sensual");
            auto romanticB = extractActions(sceneB, "romantic");
            actionsB.insert(sensualB.begin(), sensualB.end());
            actionsB.insert(romanticB.begin(), romanticB.end());
        } else {
            // Empty categoryTag: compare all actions
            actionsA = extractActions(sceneA, "");
            actionsB = extractActions(sceneB, "");
        }
        
        // If both scenes have no actions in this category, return 0
        if (actionsA.empty() && actionsB.empty()) {
            return 0.0f;
        }
        
        // If one scene has actions and the other doesn't, return 0
        if (actionsA.empty() || actionsB.empty()) {
            return 0.0f;
        }
        
        // Calculate Jaccard similarity: |A ∩ B| / |A ∪ B|
        std::unordered_set<std::string> intersection;
        std::unordered_set<std::string> unionSet;
        
        // Calculate intersection
        for (const auto& action : actionsA) {
            if (actionsB.find(action) != actionsB.end()) {
                intersection.insert(action);
            }
        }
        
        // Calculate union
        unionSet.insert(actionsA.begin(), actionsA.end());
        unionSet.insert(actionsB.begin(), actionsB.end());
        
        if (unionSet.empty()) return 0.0f;
        
        float actionSimilarity = static_cast<float>(intersection.size()) / static_cast<float>(unionSet.size());
        
        // Calculate position similarity for each actor
        float positionSimilarity = 0.0f;
        int actorCount = std::min(static_cast<int>(sceneA->actors.size()), static_cast<int>(sceneB->actors.size()));
        
        if (actorCount > 0) {
            float totalPositionSimilarity = 0.0f;
            for (int i = 0; i < actorCount; ++i) {
                PositionFeatures featuresA = GetPositionFeatures(sceneA->actors[i].tags);
                PositionFeatures featuresB = GetPositionFeatures(sceneB->actors[i].tags);
                totalPositionSimilarity += CalculatePositionSimilarity(featuresA, featuresB);
            }
            positionSimilarity = totalPositionSimilarity / actorCount;
        }
        
        // Weighted combination: 70% actions, 30% positions
        float finalSimilarity = (actionSimilarity * 0.7f) + (positionSimilarity * 0.3f);
        
        return finalSimilarity;
    }
}
