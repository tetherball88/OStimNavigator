#pragma once

#include "PCH.h"
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace OStimNavigator {
    
    struct FurnitureTypeData {
        std::string id;                         // Furniture type ID
        std::string name;                       // Display name
        std::string supertypeID;                // Supertype ID (for inheritance)
        FurnitureTypeData* supertype = nullptr; // Pointer to supertype (resolved after loading)
        int priority = 0;                       // Priority for matching
        bool listIndividually = false;          // Whether to list separately
        std::vector<std::string> factionIDs;    // Faction form IDs (hex strings like "0x000801")
    };

    class FurnitureDatabase {
    public:
        static FurnitureDatabase& GetSingleton() {
            static FurnitureDatabase instance;
            return instance;
        }

        // Load all furniture types from Data/SKSE/Plugins/OStim/furniture types/
        void LoadFurnitureTypes();

        // Get furniture type by ID
        FurnitureTypeData* GetFurnitureType(const std::string& id);
        // Returns all furniture type IDs the actor can use (including supertypes via faction inheritance)
        std::unordered_set<std::string> GetFurnitureTypesFromActor(RE::Actor* actor);
        
        // Check if scene furniture is compatible with thread's furniture types
        // threadFurnitureTypes: all furniture types the thread can use (from actor factions)
        // sceneFurniture: the furniture required by the scene
        // Returns true if compatible (handles bed edge case: bed furniture allows scenes with no furniture)
        bool IsSceneCompatible(const std::unordered_set<std::string>& threadFurnitureTypes, const std::string& sceneFurniture);
        
        // Get all furniture type IDs
        std::vector<std::string> GetAllFurnitureTypeIDs() const;

        // Stats
        size_t GetFurnitureTypeCount() const { return m_furnitureTypes.size(); }
        bool IsLoaded() const { return m_loaded; }

    private:
        FurnitureDatabase() = default;
        ~FurnitureDatabase() = default;
        FurnitureDatabase(const FurnitureDatabase&) = delete;
        FurnitureDatabase& operator=(const FurnitureDatabase&) = delete;

        void LoadFurnitureTypesFromDirectory(const std::filesystem::path& directory);
        void ParseFurnitureFile(const std::filesystem::path& filePath);
        void ResolveSuperTypes();
        void AddSuperTypes(std::unordered_set<std::string>& furnitureTypes, const FurnitureTypeData* furniture);

        std::unordered_map<std::string, FurnitureTypeData> m_furnitureTypes;
        bool m_loaded = false;
    };
}
