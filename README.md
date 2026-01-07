# OStim Navigator

A powerful SKSE plugin for Skyrim Special Edition that provides an advanced in-game interface for browsing, filtering, and navigating OStim NG scenes in real-time.

## Features

### Active Threads Monitor
- **Live Thread Tracking**: View all active OStim threads with automatic refresh
- **Thread Information Display**:
  - Thread ID and player thread indicator
  - Actor count and names
  - Current scene/animation
  - Quick access to thread explorer

### Advanced Scene Explorer
Navigate and filter thousands of OStim scenes with a comprehensive set of tools:

#### Scene Browser
- **Sortable Table View**: Browse scenes with columns for:
  - Similarity score (compared to current scene)
  - Scene ID and display name
  - Gender composition (visual icons: ♂ male, ♀ female, ⚥ other)
  - Modpack source
  - Actions (with interactive pills)
  - Actor tags (with interactive pills)
  - Scene tags (with interactive pills)
- **One-Click Navigation**: Warp to any scene instantly with the "Warp" button
- **Pagination**: Navigate through large scene lists efficiently

#### Current Thread Stats
Real-time information about the selected thread:
- Thread type classification (sexual/sensual/none)
- Gender composition with color-coded icons
- Current scene details with modpack information
- Active actions displayed as clickable filter pills
- Scene and actor tags displayed as clickable filter pills
- Participating actors with their tags
- Furniture type detection

#### Smart Similarity Scoring
Automatically calculates and displays similarity scores between the current scene and all available scenes based on:
- Shared actions
- Matching scene tags
- Common actor tags
- Visual color-coded indicators (green = high, yellow = medium, orange = low)

#### Powerful Filtering System

**Search**
- Real-time text search across scene IDs and names

**Modpack Filter**
- Select specific modpacks to include in results

**Scene Tags Filter**
- AND/OR mode toggle for combining multiple tags
- Click tags from current scene to quickly add them as filters
- Common tags: position types, locations, activities, etc.

**Actor Tags Filter**
- AND/OR mode toggle
- Click actor tags from current scene to filter
- Tags: body parts, properties, roles, etc.

**Actions Filter**
- AND/OR mode toggle
- Filter by specific animation actions
- Click actions from current scene to add filters
- Detailed action tooltips showing actor/target/performer roles

**Action Tags Filter**
- AND/OR mode toggle
- Filter by action categories (sexual, romantic, sensual, etc.)

**Compatibility Filters**
Automatically filter scenes based on thread compatibility:
- **Hide Transition Scenes**: Exclude navigation/transition animations
- **Use Intended Sex**: Filter by actor gender requirements (male/female)
- **Validate Actor Requirements**: Check for required properties (vampire, penis, specific body parts, etc.)
- **Hide Non-Random Scenes**: Exclude scenes not suitable for auto mode
- **Hide Intro/Idle Scenes**: Remove starting animations and idle poses

#### Interactive Features
- **Clickable Pills**: Click any tag or action pill in the Current Thread section to instantly add it as a filter
- **Automatic Re-filtering**: Scene list updates automatically when clicking pills or changing filters
- **Similarity Auto-Update**: Similarity scores recalculate automatically when the scene changes (via warp or natural progression)
- **Quick Clear**: One-click button to reset all filters
- **Live Results Counter**: See filtered scene count in real-time

## Requirements

- **Skyrim Special Edition**
- **SKSE64** (Skyrim Script Extender)
- **OStim NG** (OStim Next Generation)
- **SKSEMenuFramework** (for in-game UI)

## Installation

1. Install all requirements listed above
2. Download the latest release
3. Extract to your Skyrim Data folder
4. The plugin will load automatically with SKSE

## Usage

1. **Open the Menu**: Access via SKSEMenuFramework menu (default key configured in SKSEMenuFramework)
2. **Navigate to "OStim Navigator" → "Active Threads"**
3. **View Active Threads**: See all currently running OStim animations
4. **Click "Explore"**: Opens the Scene Explorer for that thread
5. **Use Filters**: Apply tags, actions, or search to find specific scenes
6. **Click Pills**: Click any tag/action in the thread stats to add it as a filter
7. **Warp to Scene**: Click the "Warp" button on any scene to navigate immediately

### Tips

- **Quick Filtering**: Click tags from your current scene to find similar animations
- **Combine Filters**: Use AND mode to narrow results, OR mode to broaden them
- **Use Similarity**: Sort by similarity score to find the most relevant transitions
- **Check Compatibility**: Enable compatibility filters to ensure scenes will work with your current actors
- **Gender Icons**: Quickly identify scene configurations by the colored gender symbols

## Technical Details

### Databases Loaded
- **Scene Database**: All OStim scene definitions from Data/SKSE/Plugins/OStim/scenes/
- **Action Database**: Action definitions and their tags
- **Actor Properties Database**: Actor requirement definitions
- **Furniture Database**: Furniture type mappings

### Similarity Algorithm
Calculates scene similarity using weighted factors:
- Action overlap
- Scene tag matching
- Actor tag compatibility
- Smart scoring system prioritizes playable transitions

### Performance
- Efficient caching of filtered results
- Lazy evaluation of similarity scores
- Automatic refresh intervals for thread monitoring
- Optimized rendering with pagination

## Credits

Built with:
- CommonLibSSE-NG
- SKSEMenuFramework
- OStim NG API
- nlohmann/json

## License

[Add your license here]

## Support

For issues, questions, or feature requests, please [create an issue on GitHub/Nexus].
