import { Graphics, Sprite } from 'pixi.js';
import {
  GRID_SIZE, MAP_COLS, MAP_ROWS,
  WANTED_PER_KILL, WANTED_MAX, WANTED_DECAY_DELAY, WANTED_DECAY_RATE,
  POLICE_SPEED, POLICE_TURN_SPEED, POLICE_SPAWN_DISTANCE,
  POLICE_CAR_HIT_RADIUS, POLICE_PER_STAR, CAR_COLLISION_RADIUS,
} from './config.js';
import { TILE_BUILDING } from './city.js';

export function createPoliceTexture(app) {
  const g = new Graphics();
  g.rect(-10, -20, 20, 40).fill({ color: 0xffffff });
  g.rect(-8, -20, 16, 6).fill({ color: 0x0044ff });
  return app.renderer.generateTexture(g);
}

export function spawnPolice(texture, worldContainer) {
  return { cars: [], wantedLevel: 0, calmTimer: 0, texture, worldContainer };
}

export function updateWanted(state, kills, delta) {
  if (kills > 0) {
    state.wantedLevel = Math.min(state.wantedLevel + kills * WANTED_PER_KILL, WANTED_MAX);
    state.calmTimer = WANTED_DECAY_DELAY;
  } else {
    state.calmTimer -= delta;
    if (state.calmTimer <= 0) {
      state.wantedLevel = Math.max(0, state.wantedLevel - WANTED_DECAY_RATE * delta);
    }
  }
  return Math.ceil(state.wantedLevel);
}

function spawnOneCop(state, player, map) {
  const angle = Math.random() * Math.PI * 2;
  let x = player.x + Math.cos(angle) * POLICE_SPAWN_DISTANCE;
  let y = player.y + Math.sin(angle) * POLICE_SPAWN_DISTANCE;

  // Clamp to map bounds
  x = Math.max(GRID_SIZE, Math.min(x, (MAP_COLS - 1) * GRID_SIZE));
  y = Math.max(GRID_SIZE, Math.min(y, (MAP_ROWS - 1) * GRID_SIZE));

  // Snap to nearest road tile
  let col = Math.floor(x / GRID_SIZE);
  let row = Math.floor(y / GRID_SIZE);
  if (row >= 0 && row < MAP_ROWS && col >= 0 && col < MAP_COLS && map[row][col] === TILE_BUILDING) {
    // Search nearby for a road tile
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < MAP_ROWS && nc >= 0 && nc < MAP_COLS && map[nr][nc] !== TILE_BUILDING) {
          row = nr;
          col = nc;
          r = 3; // break outer
          break;
        }
      }
    }
    x = col * GRID_SIZE + GRID_SIZE / 2;
    y = row * GRID_SIZE + GRID_SIZE / 2;
  }

  const sprite = new Sprite(state.texture);
  sprite.anchor.set(0.5, 0.5);
  state.worldContainer.addChild(sprite);
  sprite.x = x;
  sprite.y = y;

  const cop = { sprite, x, y, rotation: 0, active: true };
  state.cars.push(cop);
}

function normalizeAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export function updatePolice(state, player, map, delta) {
  const stars = Math.ceil(state.wantedLevel);
  const desired = stars * POLICE_PER_STAR;

  // Spawn new cops if needed
  while (state.cars.filter(c => c.active).length < desired) {
    spawnOneCop(state, player, map);
  }

  // Despawn excess cops if wanted dropped
  let activeCount = state.cars.filter(c => c.active).length;
  for (let i = state.cars.length - 1; i >= 0 && activeCount > desired; i--) {
    if (state.cars[i].active) {
      state.cars[i].active = false;
      state.cars[i].sprite.visible = false;
      activeCount--;
    }
  }

  // Update active cops
  for (const cop of state.cars) {
    if (!cop.active) continue;

    // Steer toward player
    const targetAngle = Math.atan2(player.x - cop.x, -(player.y - cop.y));
    const diff = normalizeAngle(targetAngle - cop.rotation);
    cop.rotation += Math.sign(diff) * Math.min(Math.abs(diff), POLICE_TURN_SPEED) * delta;

    // Move forward
    const prevX = cop.x;
    const prevY = cop.y;
    cop.x += Math.sin(cop.rotation) * POLICE_SPEED * delta;
    cop.y -= Math.cos(cop.rotation) * POLICE_SPEED * delta;

    // Building collision — revert if hitting a building
    const col = Math.floor(cop.x / GRID_SIZE);
    const row = Math.floor(cop.y / GRID_SIZE);
    if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS || map[row][col] === TILE_BUILDING) {
      cop.x = prevX;
      cop.y = prevY;
    }

    cop.sprite.x = cop.x;
    cop.sprite.y = cop.y;
    cop.sprite.rotation = cop.rotation;
  }
}

export function checkPolicePlayerCollision(state, player) {
  const hitRadius = POLICE_CAR_HIT_RADIUS + CAR_COLLISION_RADIUS;
  const hitRadiusSq = hitRadius * hitRadius;

  for (const cop of state.cars) {
    if (!cop.active) continue;
    const dx = cop.x - player.x;
    const dy = cop.y - player.y;
    if (dx * dx + dy * dy < hitRadiusSq) return true;
  }
  return false;
}
