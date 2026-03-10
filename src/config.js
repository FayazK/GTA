export const ACCELERATION = 0.15;
export const BRAKE_FORCE = 0.1;
export const MAX_SPEED = 6.0;
export const MAX_REVERSE_SPEED = -2.5;
export const FRICTION = 0.97;
export const TURN_SPEED = 0.04;
export const TURN_FRICTION = 0.85;
export const MIN_TURN_SPEED_THRESHOLD = 0.5;
export const GRID_SIZE = 64;
export const CAMERA_LERP = 0.1;

// Drift
export const DRIFT_FACTOR = 0.92;
export const DRIFT_TRANSFER = 0.08;
export const DRIFT_THRESHOLD = 0.02;

// Collision
export const COLLISION_SPEED_LOSS = 0.4;
export const CAR_COLLISION_RADIUS = 12;

// City map
export const MAP_COLS = 100;
export const MAP_ROWS = 100;
export const BLOCK_WIDTH = 7;
export const BLOCK_HEIGHT = 7;
export const ROAD_WIDTH = 2;

// Pedestrians
export const PED_COUNT = 30;
export const PED_RADIUS = 5;
export const PED_SPEED = 0.5;
export const PED_DIRECTION_CHANGE_MIN = 120; // ~2s at 60fps
export const PED_DIRECTION_CHANGE_MAX = 240; // ~4s at 60fps
export const PED_CAR_HIT_RADIUS = 17;       // CAR_COLLISION_RADIUS + PED_RADIUS
export const PED_SCORE_VALUE = 10;

// Shooting
export const BULLET_POOL_SIZE = 20;
export const BULLET_SPEED = 8;
export const BULLET_RADIUS = 3;
export const BULLET_LIFETIME = 180;        // ~3s at 60fps
export const BULLET_PED_HIT_RADIUS = 8;   // BULLET_RADIUS + PED_RADIUS
export const FIRE_COOLDOWN = 15;           // ~0.25s at 60fps
