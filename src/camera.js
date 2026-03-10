import { CAMERA_LERP } from './config.js';

export function updateCamera(worldContainer, player, app) {
  const targetX = app.screen.width / 2 - player.x;
  const targetY = app.screen.height / 2 - player.y;

  worldContainer.x += (targetX - worldContainer.x) * CAMERA_LERP;
  worldContainer.y += (targetY - worldContainer.y) * CAMERA_LERP;
}
