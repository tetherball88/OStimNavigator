#pragma once

#include "PCH.h"
#include "SceneDatabase.h"
#include <string>

namespace OStimNavigator {

    // Builds a human-readable scene description string from a SceneData.
    // Actor references use the template form {{scenedata.actors.N}}.
    //
    // threadID: the OStim thread to fetch actors from for furniture type detection.
    std::string BuildSceneDescription(const SceneData& scene, uint32_t threadID);

}
