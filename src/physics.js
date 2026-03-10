import {
  ACCELERATION, BRAKE_FORCE, MAX_SPEED, MAX_REVERSE_SPEED,
  FRICTION, TURN_SPEED, TURN_FRICTION, MIN_TURN_SPEED_THRESHOLD,
  DRIFT_FACTOR, DRIFT_TRANSFER, DRIFT_THRESHOLD,
} from './config.js';
import { isAccelerating, isBraking, isTurningLeft, isTurningRight } from './input.js';

export function createPhysicsState() {
  return {
    x: 0,
    y: 0,
    rotation: 0,
    speed: 0,
    angularVelocity: 0,
    lateralSpeed: 0,
    drifting: false,
    prevX: 0,
    prevY: 0,
  };
}

export function updatePhysics(state, delta) {
  // Acceleration / braking
  if (isAccelerating()) state.speed += ACCELERATION * delta;
  if (isBraking()) state.speed -= BRAKE_FORCE * delta;

  // Clamp speed
  state.speed = Math.max(MAX_REVERSE_SPEED, Math.min(MAX_SPEED, state.speed));

  // Turning (only when moving)
  if (Math.abs(state.speed) > MIN_TURN_SPEED_THRESHOLD) {
    const turnFactor = state.speed / MAX_SPEED;
    if (isTurningLeft()) state.angularVelocity -= TURN_SPEED * turnFactor * delta;
    if (isTurningRight()) state.angularVelocity += TURN_SPEED * turnFactor * delta;
  }

  // Apply friction
  state.speed *= FRICTION;
  state.angularVelocity *= TURN_FRICTION;

  // Dead-zone
  if (Math.abs(state.speed) < 0.01) state.speed = 0;
  if (Math.abs(state.angularVelocity) < 0.0001) state.angularVelocity = 0;

  // Update rotation
  state.rotation += state.angularVelocity * delta;

  // Drift: transfer forward speed to lateral on sharp turns
  if (Math.abs(state.angularVelocity) > DRIFT_THRESHOLD && Math.abs(state.speed) > 2.0) {
    state.lateralSpeed += state.angularVelocity * state.speed * DRIFT_TRANSFER;
    state.drifting = true;
  } else {
    state.drifting = false;
  }

  // Lateral friction
  state.lateralSpeed *= DRIFT_FACTOR;
  if (Math.abs(state.lateralSpeed) < 0.01) state.lateralSpeed = 0;

  // Store previous position for collision resolution
  state.prevX = state.x;
  state.prevY = state.y;

  // Forward and lateral direction vectors
  const forwardX = Math.sin(state.rotation);
  const forwardY = -Math.cos(state.rotation);
  const lateralX = Math.cos(state.rotation);
  const lateralY = Math.sin(state.rotation);

  // Update position: forward + lateral components
  state.x += (forwardX * state.speed + lateralX * state.lateralSpeed) * delta;
  state.y += (forwardY * state.speed + lateralY * state.lateralSpeed) * delta;
}
