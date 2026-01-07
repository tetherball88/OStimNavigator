#pragma once

#include "PCH.h"
#include "SceneDatabase.h"
#include <vector>
#include <string>

namespace OStimNavigator {
    
    // Position feature dimensions for actor position similarity
    enum class HeightLevel { High, MediumHigh, MediumLow, Low, None };
    enum class Orientation { Vertical, Diagonal, Horizontal, None };
    enum class Activity { Active, Neutral, Passive, None };
    
    struct PositionFeatures {
        HeightLevel height = HeightLevel::None;
        Orientation orientation = Orientation::None;
        Activity activity = Activity::None;
    };
    
    class SceneSimilarity {
    public:
        // Extract position features from actor tags
        static PositionFeatures GetPositionFeatures(const std::vector<std::string>& actorTags);
        
        // Calculate similarity between two position feature sets (0.0 to 1.0)
        static float CalculatePositionSimilarity(const PositionFeatures& featuresA, const PositionFeatures& featuresB);
        
        // Calculate overall similarity score between two scenes (0.0 to 1.0)
        static float CalculateSimilarityScore(SceneData* sceneA, SceneData* sceneB);
    };
}
