# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GTA 1-style top-down open-world game using Vite + PixiJS v8.

## Commands

- `npm run dev` — Start Vite dev server (hot reload)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build

## Architecture

**Vite vanilla JS project** with modular source files under `src/`.

### Source Files

| File | Purpose |
|------|---------|
| `src/main.js` | Entry point: inits PixiJS app, creates world, runs game loop |
| `src/config.js` | All tuning constants (physics, camera, grid) |
| `src/input.js` | Keyboard state tracking + intent helpers (WASD/arrows) |
| `src/car.js` | Car sprite creation (Graphics → generateTexture → Sprite) |
| `src/physics.js` | Arcade car physics (speed, friction, angular velocity, turning) |
| `src/camera.js` | Smooth lerp camera follow via worldContainer offset |
| `src/grid.js` | Infinite scrolling grid background (TilingSprite) |
| `src/style.css` | Reset styles (no margin, black background, no overflow) |

### Key Patterns

- **worldContainer**: All world objects live in a `Container` that moves opposite to the player (camera system). HUD elements go directly on `app.stage`.
- **Texture creation**: Use `Graphics` to draw shapes, then `app.renderer.generateTexture()` to create reusable textures at init time.
- **Physics state**: Plain object `{ x, y, rotation, speed, angularVelocity }` passed to update functions — no classes.
- **Input**: `keys` object tracks keydown/keyup state. Helper functions (`isAccelerating()`, etc.) abstract WASD vs arrow keys.
- **Rotation convention**: rotation=0 faces up (-Y). Position updates use `sin(rotation)` for X, `-cos(rotation)` for Y.

### Planned Game Systems (phases 2-7)

1. **City**: 100×100 tile map, procedural grid layout with road/building tiles
2. **Collisions**: AABB with buildings, wall sliding
3. **Pedestrians**: ~30 NPCs with wandering AI
4. **Shooting**: Bullet pool, spacebar fire, cooldown
5. **Missions/HUD**: Drive-to-marker missions, PIXI.Text HUD
6. **Wanted System**: 0-3 stars, police chase AI, game over

## Conventions

- Arcade physics — fun over realism
- Keep modules focused: one system per file
- All tuning values in `config.js`
