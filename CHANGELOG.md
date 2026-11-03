# Changelog

## v2.3.0

### Added

- **Context-aware positions & activities for active and upcoming scenes (OStimNet integration)** — OStim Navigator can now check which sexual positions and activities are actually available in your installed animation packs for a specific group of characters and piece of furniture—both *before* a scene begins and *while* a scene is playing:
  - Ensures companion mods like **OStimNet** only offer the AI positions and actions that genuinely work for the current participants, their gender/body requirements, and the furniture being used.
  - Supports filtering available activities by intimacy stage (**Foreplay**, **Oral**, and **Intercourse/Sex**) so scenes progress naturally through stages using animations you actually have installed.
  - Pre-scene checks automatically match OStim's actor slot sorting (including support for female strap-on / futanari setups when **Intended Sex Only** is disabled).

### Changed

- **Significantly faster scene filtering & browsing** — Added background caching for compatible animations, positions, and actions, along with actor-count scene indexing:
  - Filtering scenes in the UI, querying available actions/positions, and searching for pull-out animations is now much faster and smoother, even with large animation load orders.
  - Automatically refreshes the cache whenever a scene is edited or hot-reloaded in-game.
- **Automatic OStim MCM settings support** — Scene filtering and the in-game Thread Explorer now automatically read and respect your OStim MCM settings for **Unrestricted Navigation** and **Intended Sex Only**.
- **Smarter nearby furniture & bed detection**:
  - Standing/floor sexual animations (which OStim also allows on beds) are now counted when checking if nearby beds have enough animations to use.
  - Nearby furniture scans now properly recognize parent furniture categories (for example, single beds and double beds counting toward general bed animations).
- **Improved scene phase classification** — Scene and action intimacy stages (**Foreplay**, **Oral**, **Sex**) are now pre-calculated at startup, and breast/butt smothering animations are now properly recognized as **Foreplay** activities.
- **Larger dropdown menus in the OStimNet tab** — Increased the height of the tag and position suggestion dropdowns in the in-game editor so more options are visible at once without scrolling.

### Fixed

- **Copy/paste text truncation in in-game editors** — Fixed an issue in the Scene JSON and Description editors where copying long blocks of text (over 500 characters) would cut off the copied text and insert `…` characters.
- **Keyboard word-navigation shortcuts in editors** — Restored standard word navigation and deletion shortcuts (`Ctrl+Left`, `Ctrl+Right`, `Ctrl+Shift+Left`, `Ctrl+Shift+Right`, `Ctrl+Backspace`, and `Ctrl+Delete`) inside the in-game JSON and Description text editors.
- **Keyboard focus stuck after saving JSON** — Saving changes in the Scene JSON editor now automatically unfocuses the text box so your normal in-game hotkeys and movement controls work immediately.

