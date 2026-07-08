#pragma once

#define WIN32_LEAN_AND_MEAN

#include "RE/Skyrim.h"
#include "SKSE/SKSE.h"

// wingdi.h defines GetObject as a macro (GetObjectW), which collides with
// RE::BSScript::Variable::GetObject. Undefine it after the Windows headers.
#ifdef GetObject
#  undef GetObject
#endif

#include <shared_mutex>
#include <set>
#include <vector>
#include <string>
#include <algorithm>

using namespace std::literals;
