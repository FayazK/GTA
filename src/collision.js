import { GRID_SIZE, CAR_COLLISION_RADIUS, COLLISION_SPEED_LOSS } from './config.js';
import { TILE_BUILDING } from './city.js';

function isSolid(map, col, row) {
  if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return true;
  return map[row][col] === TILE_BUILDING;
}

function getOverlappingTiles(x, y, halfSize) {
  return {
    minCol: Math.floor((x - halfSize) / GRID_SIZE),
    maxCol: Math.floor((x + halfSize) / GRID_SIZE),
    minRow: Math.floor((y - halfSize) / GRID_SIZE),
    maxRow: Math.floor((y + halfSize) / GRID_SIZE),
  };
}

export function resolveCollisions(state, map) {
  const R = CAR_COLLISION_RADIUS;
  let hitWall = false;

  // Resolve X axis (use new X, old Y)
  const tilesX = getOverlappingTiles(state.x, state.prevY, R);
  for (let row = tilesX.minRow; row <= tilesX.maxRow; row++) {
    for (let col = tilesX.minCol; col <= tilesX.maxCol; col++) {
      if (!isSolid(map, col, row)) continue;

      const tileLeft = col * GRID_SIZE;
      const tileRight = tileLeft + GRID_SIZE;
      const tileTop = row * GRID_SIZE;
      const tileBottom = tileTop + GRID_SIZE;

      if (state.x + R > tileLeft && state.x - R < tileRight &&
          state.prevY + R > tileTop && state.prevY - R < tileBottom) {
        if (state.x > state.prevX) {
          state.x = tileLeft - R;
        } else {
          state.x = tileRight + R;
        }
        hitWall = true;
      }
    }
  }

  // Resolve Y axis (use corrected X, new Y)
  const tilesY = getOverlappingTiles(state.x, state.y, R);
  for (let row = tilesY.minRow; row <= tilesY.maxRow; row++) {
    for (let col = tilesY.minCol; col <= tilesY.maxCol; col++) {
      if (!isSolid(map, col, row)) continue;

      const tileLeft = col * GRID_SIZE;
      const tileRight = tileLeft + GRID_SIZE;
      const tileTop = row * GRID_SIZE;
      const tileBottom = tileTop + GRID_SIZE;

      if (state.x + R > tileLeft && state.x - R < tileRight &&
          state.y + R > tileTop && state.y - R < tileBottom) {
        if (state.y > state.prevY) {
          state.y = tileTop - R;
        } else {
          state.y = tileBottom + R;
        }
        hitWall = true;
      }
    }
  }

  // Speed loss on wall hit
  if (hitWall) {
    state.speed *= COLLISION_SPEED_LOSS;
    state.lateralSpeed *= 0.5;
  }
}
