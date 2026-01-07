#pragma once

#include <string>
#include <algorithm>
#include <vector>
#include <unordered_set>

namespace OStimNavigator {
    namespace StringUtils {
        
        // Convert string to lowercase in-place
        inline void ToLower(std::string& str) {
            std::transform(str.begin(), str.end(), str.begin(), ::tolower);
        }
        
        // Convert string to lowercase and return new string
        inline std::string ToLowerCopy(const std::string& str) {
            std::string result = str;
            ToLower(result);
            return result;
        }
        
        // Convert unordered_set to sorted vector
        template<typename T>
        std::vector<T> SetToSortedVector(const std::unordered_set<T>& inputSet) {
            std::vector<T> result;
            result.reserve(inputSet.size());
            for (const auto& item : inputSet) {
                result.push_back(item);
            }
            std::sort(result.begin(), result.end());
            return result;
        }
    }
}
