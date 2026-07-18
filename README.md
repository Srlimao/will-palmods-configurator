# Palmods Configurator

A modern, web-based React application for configuring Palworld mods. Currently supports:
- **HUD Locator**
- **Accessory Toggler**

## Features
- Clean, responsive glassmorphic UI.
- Drag and drop your existing `config.json` files to instantly load them.
- Live, visual preview for HUD element positioning and colors.
- Full support for all configuration schema options natively.
- Exports perfectly formatted `config.json` files ready to be dropped back into your game directory.

## Development Setup

This project was bootstrapped with [Vite](https://vitejs.dev/).

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```
   The static files will be generated in the `dist` directory, ready to be hosted on any static hosting provider (e.g., GitHub Pages, Vercel, Netlify).

## Architecture & Branch Structure

### Workspace Directories
- `react-app/`: The frontend application (and Git repository root).
- `backend/`: Node.js Express server providing Steam auth and database storage (not tracked by this repository).
- `docs/`: Shared mod files and centralized settings metadata (not tracked by this repository).

### Git Branches
- `main` (Serverless): Production-ready, client-side only mode. Deployed to GitHub Pages. All configuration parsing, schema validation, and file generation are handled securely in-browser.
- `cloud-sync` (Full Stack): Extends the frontend with Steam OpenID authentication and remote database synchronization, requiring a running `backend/` server instance.
