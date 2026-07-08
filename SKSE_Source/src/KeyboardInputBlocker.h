#pragma once
#include "PCH.h"
#include <vector>
#include <functional>

// Blocks all DirectInput keyboard events from reaching other mods/the game
// while OStim Navigator UI has a text input field focused, by patching
// BSWin32KeyboardDevice vtable slot 2 (Process).
namespace KeyboardInputBlocker {
    // Install the vtable hook. Call once at kInputLoaded.
    void Install();

    // Toggle input blocking.
    void SetBlocking(bool block);
}
