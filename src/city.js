import { Graphics, Sprite, Container } from 'pixi.js';
import { GRID_SIZE, MAP_COLS, MAP_ROWS, BLOCK_WIDTH, BLOCK_HEIGHT, ROAD_WIDTH } from './config.js';

export const TILE_ROAD = 0;
export const TILE_BUILDING = 1;

const PATTERN_W = BLOCK_WIDTH + ROAD_WIDTH;
const PATTERN_H = BLOCK_HEIGHT + ROAD_WIDTH;

export function generateCityMap() {
  const map = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < MAP_COLS; col++) {
      const inBlockX = col % PATTERN_W < BLOCK_WIDTH;
      const inBlockY = row % PATTERN_H < BLOCK_HEIGHT;
      map[row][col] = (inBlockX && inBlockY) ? TILE_BUILDING : TILE_ROAD;
    }
  }
  return map;
}

export function createCitySprites(app, map) {
  const roadGfx = new Graphics().rect(0, 0, GRID_SIZE, GRID_SIZE).fill({ color: 0x333333 });
  const buildingGfx = new Graphics().rect(0, 0, GRID_SIZE, GRID_SIZE).fill({ color: 0x888888 });

  const roadTexture = app.renderer.generateTexture(roadGfx);
  const buildingTexture = app.renderer.generateTexture(buildingGfx);

  const container = new Container();

  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
      const texture = map[row][col] === TILE_BUILDING ? buildingTexture : roadTexture;
      const sprite = new Sprite(texture);
      sprite.x = col * GRID_SIZE;
      sprite.y = row * GRID_SIZE;
      container.addChild(sprite);
    }
  }

  return container;
}

export function findSpawnPoint(map) {
  const centerCol = Math.floor(MAP_COLS / 2);
  const centerRow = Math.floor(MAP_ROWS / 2);

  // Spiral outward from center to find nearest road tile
  for (let radius = 0; radius < Math.max(MAP_COLS, MAP_ROWS); radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        const col = centerCol + dx;
        const row = centerRow + dy;
        if (col >= 0 && col < MAP_COLS && row >= 0 && row < MAP_ROWS) {
          if (map[row][col] === TILE_ROAD) {
            return {
              x: col * GRID_SIZE + GRID_SIZE / 2,
              y: row * GRID_SIZE + GRID_SIZE / 2,
            };
          }
        }
      }
    }
  }

  // Fallback: map center
  return { x: centerCol * GRID_SIZE + GRID_SIZE / 2, y: centerRow * GRID_SIZE + GRID_SIZE / 2 };
}
