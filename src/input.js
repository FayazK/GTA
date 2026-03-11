const keys = {};

export function initInput() {
  window.addEventListener('keydown', (e) => { keys[e.code] = true; });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });
}

export function isAccelerating() {
  return keys['ArrowUp'] || keys['KeyW'];
}

export function isBraking() {
  return keys['ArrowDown'] || keys['KeyS'];
}

export function isTurningLeft() {
  return keys['ArrowLeft'] || keys['KeyA'];
}

export function isTurningRight() {
  return keys['ArrowRight'] || keys['KeyD'];
}

export function isFiring() {
  return keys['Space'];
}

export function isRestarting() {
  return keys['KeyR'];
}
