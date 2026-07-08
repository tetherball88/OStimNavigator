#pragma once

#include "PCH.h"
#include <functional>
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
        RE::TESFaction* faction = nullptr;      // Resolved faction (resolved after loading)
        std::function<bool(RE::TESObjectREFR*)> condition = [](RE::TESObjectREFR*) { return false; };
        uint32_t sceneCount = 0;                // Number of scenes with at least one sexual action using this furniture type
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
        // Get best matching furniture type for a placed object (checks conditions)
        FurnitureTypeData* GetFurnitureType(RE::TESObjectREFR* object);
        // Returns all furniture type IDs the actor can use (including supertypes via faction inheritance)
        std::unordered_set<std::string> GetFurnitureTypesFromActor(RE::Actor* actor);
        // Returns the single most specific furniture type ID for the actor (highest priority match), or empty string if none
        std::string GetFurnitureTypeFromActor(RE::Actor* actor);
        
        // Check if scene furniture is compatible with thread's furniture types
        // threadFurnitureTypes: all furniture types the thread can use (from actor factions)
        // sceneFurniture: the furniture required by the scene
        // Returns true if compatible (handles bed edge case: bed furniture allows scenes with no furniture)
        bool IsSceneCompatible(const std::unordered_set<std::string>& threadFurnitureTypes, const std::string& sceneFurniture);
        
        // Get all furniture type IDs
        std::vector<std::string> GetAllFurnitureTypeIDs() const;

        // Increment scene count for a furniture type (called by SceneDatabase during scene loading)
        void IncrementSceneCount(const std::string& id);

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
        void ResolveFactions();
        void AddSuperTypes(std::unordered_set<std::string>& furnitureTypes, const FurnitureTypeData* furniture);

        std::unordered_map<std::string, FurnitureTypeData> m_furnitureTypes;
        bool m_loaded = false;
    };
}
