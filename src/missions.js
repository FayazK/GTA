import { Graphics, Sprite } from 'pixi.js';
import { GRID_SIZE, MISSION_MARKER_RADIUS, MISSION_REACH_RADIUS } from './config.js';
import { TILE_ROAD } from './city.js';

export function createMarkerSprite(app, worldContainer) {
  const g = new Graphics();
  g.circle(0, 0, MISSION_MARKER_RADIUS).fill({ color: 0xffff00, alpha: 0.5 });
  const texture = app.renderer.generateTexture(g);

  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5, 0.5);
  worldContainer.addChild(sprite);
  return sprite;
}

export function placeNewMission(marker, map) {
  const roadTiles = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === TILE_ROAD) roadTiles.push({ row, col });
    }
  }

  const tile = roadTiles[Math.floor(Math.random() * roadTiles.length)];
  const x = tile.col * GRID_SIZE + GRID_SIZE / 2;
  const y = tile.row * GRID_SIZE + GRID_SIZE / 2;

  marker.x = x;
  marker.y = y;
  marker.visible = true;

  return { x, y };
}

export function checkMissionComplete(mission, player) {
  const dx = player.x - mission.x;
  const dy = player.y - mission.y;
  return dx * dx + dy * dy < MISSION_REACH_RADIUS * MISSION_REACH_RADIUS;
}
