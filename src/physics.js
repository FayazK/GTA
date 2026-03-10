import {
  ACCELERATION, BRAKE_FORCE, MAX_SPEED, MAX_REVERSE_SPEED,
  FRICTION, TURN_SPEED, TURN_FRICTION, MIN_TURN_SPEED_THRESHOLD,
} from './config.js';
import { isAccelerating, isBraking, isTurningLeft, isTurningRight } from './input.js';

export function createPhysicsState() {
  return {
    x: 0,
    y: 0,
    rotation: 0,
    speed: 0,
    angularVelocity: 0,
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

  // Update rotation and position
  state.rotation += state.angularVelocity * delta;
  state.x += Math.sin(state.rotation) * state.speed * delta;
  state.y -= Math.cos(state.rotation) * state.speed * delta;
}
