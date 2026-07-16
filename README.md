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

## Architecture
- **React + Vite** for fast development and lightweight client-side rendering.
- **Vanilla CSS** with CSS variables for dynamic theming and layout.
- Modular component structure located in `src/components`.
- No backend required! File processing is handled securely inside your local browser via the HTML5 File API.
