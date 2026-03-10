import { Graphics, Sprite } from 'pixi.js';
import {
  GRID_SIZE, MAP_COLS, MAP_ROWS,
  BULLET_POOL_SIZE, BULLET_SPEED, BULLET_RADIUS,
  BULLET_LIFETIME, BULLET_PED_HIT_RADIUS, FIRE_COOLDOWN,
} from './config.js';
import { TILE_BUILDING } from './city.js';

export function createBulletTexture(app) {
  const g = new Graphics();
  g.circle(0, 0, BULLET_RADIUS).fill({ color: 0xffff00 });
  return app.renderer.generateTexture(g);
}

export function createBulletPool(texture, worldContainer) {
  const bullets = [];
  for (let i = 0; i < BULLET_POOL_SIZE; i++) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    sprite.visible = false;
    worldContainer.addChild(sprite);
    bullets.push({ sprite, x: 0, y: 0, vx: 0, vy: 0, lifetime: 0, active: false });
  }
  return { bullets, cooldown: 0 };
}

export function tryFire(pool, player) {
  if (pool.cooldown > 0) return;

  const bullet = pool.bullets.find(b => !b.active);
  if (!bullet) return;

  bullet.x = player.x;
  bullet.y = player.y;
  bullet.vx = Math.sin(player.rotation) * BULLET_SPEED;
  bullet.vy = -Math.cos(player.rotation) * BULLET_SPEED;
  bullet.lifetime = BULLET_LIFETIME;
  bullet.active = true;
  bullet.sprite.visible = true;
  bullet.sprite.x = bullet.x;
  bullet.sprite.y = bullet.y;

  pool.cooldown = FIRE_COOLDOWN;
}

function deactivate(bullet) {
  bullet.active = false;
  bullet.sprite.visible = false;
}

export function updateBullets(pool, map, delta) {
  pool.cooldown -= delta;

  for (const b of pool.bullets) {
    if (!b.active) continue;

    b.x += b.vx * delta;
    b.y += b.vy * delta;
    b.lifetime -= delta;

    if (b.lifetime <= 0) { deactivate(b); continue; }

    const col = Math.floor(b.x / GRID_SIZE);
    const row = Math.floor(b.y / GRID_SIZE);

    if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS || map[row][col] === TILE_BUILDING) {
      deactivate(b);
      continue;
    }

    b.sprite.x = b.x;
    b.sprite.y = b.y;
  }
}

export function checkBulletPedCollisions(pool, peds) {
  const hitRadiusSq = BULLET_PED_HIT_RADIUS * BULLET_PED_HIT_RADIUS;
  let hits = 0;

  for (const b of pool.bullets) {
    if (!b.active) continue;

    for (const ped of peds) {
      if (!ped.alive) continue;
      const dx = b.x - ped.x;
      const dy = b.y - ped.y;
      if (dx * dx + dy * dy < hitRadiusSq) {
        deactivate(b);
        ped.alive = false;
        ped.sprite.visible = false;
        hits++;
        break;
      }
    }
  }

  return hits;
}
