import { Graphics, Sprite } from 'pixi.js';
import {
  GRID_SIZE, MAP_COLS, MAP_ROWS,
  PED_COUNT, PED_RADIUS, PED_SPEED,
  PED_DIRECTION_CHANGE_MIN, PED_DIRECTION_CHANGE_MAX,
  PED_CAR_HIT_RADIUS,
} from './config.js';
import { TILE_BUILDING } from './city.js';

function randomTimer() {
  return PED_DIRECTION_CHANGE_MIN + Math.random() * (PED_DIRECTION_CHANGE_MAX - PED_DIRECTION_CHANGE_MIN);
}

export function createPedTexture(app) {
  const g = new Graphics();
  g.circle(0, 0, PED_RADIUS).fill({ color: 0x4488ff });
  return app.renderer.generateTexture(g);
}

export function spawnPedestrians(app, map, worldContainer, texture) {
  const roadTiles = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
      if (map[row][col] !== TILE_BUILDING) roadTiles.push({ row, col });
    }
  }

  // Shuffle and pick PED_COUNT tiles
  for (let i = roadTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roadTiles[i], roadTiles[j]] = [roadTiles[j], roadTiles[i]];
  }

  const peds = [];
  const count = Math.min(PED_COUNT, roadTiles.length);

  for (let i = 0; i < count; i++) {
    const { row, col } = roadTiles[i];
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    sprite.x = col * GRID_SIZE + GRID_SIZE / 2;
    sprite.y = row * GRID_SIZE + GRID_SIZE / 2;
    worldContainer.addChild(sprite);

    peds.push({
      sprite,
      x: sprite.x,
      y: sprite.y,
      direction: Math.random() * Math.PI * 2,
      timer: randomTimer(),
      alive: true,
    });
  }

  return peds;
}

export function updatePedestrians(peds, map, delta) {
  for (const ped of peds) {
    if (!ped.alive) continue;

    ped.timer -= delta;
    if (ped.timer <= 0) {
      ped.direction = Math.random() * Math.PI * 2;
      ped.timer = randomTimer();
    }

    const nextX = ped.x + Math.sin(ped.direction) * PED_SPEED * delta;
    const nextY = ped.y - Math.cos(ped.direction) * PED_SPEED * delta;

    const col = Math.floor(nextX / GRID_SIZE);
    const row = Math.floor(nextY / GRID_SIZE);

    if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS || map[row][col] === TILE_BUILDING) {
      ped.timer = 0; // pick new direction next frame
      continue;
    }

    ped.x = nextX;
    ped.y = nextY;
    ped.sprite.x = ped.x;
    ped.sprite.y = ped.y;
  }
}

export function checkCarPedCollisions(peds, player) {
  const hitRadiusSq = PED_CAR_HIT_RADIUS * PED_CAR_HIT_RADIUS;
  let hits = 0;

  for (const ped of peds) {
    if (!ped.alive) continue;
    const dx = ped.x - player.x;
    const dy = ped.y - player.y;
    if (dx * dx + dy * dy < hitRadiusSq) {
      ped.alive = false;
      ped.sprite.visible = false;
      hits++;
    }
  }

  return hits;
}
