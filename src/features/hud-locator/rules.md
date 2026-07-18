# HUD Locator Feature Context Map

This folder implements the configuration user interface and preview system for the HUD Locator mod in Palworld.

## Components Structure
- **`HUDLocatorConfig.jsx`**: The parent controller that orchestrates the configuration state. It receives a URL `config` parameter, processes JSON files, normalizes sections, updates states, and saves configs.
- **`components/HUDPreview.jsx`**: Render component for drawing the standard 1080p overlay simulation.
- **`components/GlobalTab.jsx`**: Form controls for Master Toggle, scan intervals, and menu navigation keybinds.
- **`components/SectionTab.jsx`**: Resusable form controller for managing target types (Players, Relics, Chests, Eggs, Caves).
- **`styles/hud.module.css`**: Scoped styles.
