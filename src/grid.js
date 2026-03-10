import { Graphics, TilingSprite } from 'pixi.js';
import { GRID_SIZE } from './config.js';

export function createGrid(app) {
  const g = new Graphics();

  // Cell background
  g.rect(0, 0, GRID_SIZE, GRID_SIZE).fill({ color: 0x111111 });

  // Grid lines (top and left edges)
  g.rect(0, 0, GRID_SIZE, 1).fill({ color: 0x222222 });
  g.rect(0, 0, 1, GRID_SIZE).fill({ color: 0x222222 });

  const texture = app.renderer.generateTexture(g);

  const grid = new TilingSprite({
    texture,
    width: app.screen.width + GRID_SIZE * 2,
    height: app.screen.height + GRID_SIZE * 2,
  });

  return grid;
}

export function updateGrid(grid, player, app) {
  grid.width = app.screen.width + GRID_SIZE * 2;
  grid.height = app.screen.height + GRID_SIZE * 2;

  grid.x = player.x - app.screen.width / 2 - GRID_SIZE;
  grid.y = player.y - app.screen.height / 2 - GRID_SIZE;

  grid.tilePosition.x = -grid.x;
  grid.tilePosition.y = -grid.y;
}
