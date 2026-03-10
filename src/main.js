import './style.css';
import { Application, Container, Text } from 'pixi.js';
import { initInput, isFiring } from './input.js';
import { createCar } from './car.js';
import { createPhysicsState, updatePhysics } from './physics.js';
import { generateCityMap, createCitySprites, findSpawnPoint } from './city.js';
import { resolveCollisions } from './collision.js';
import { updateCamera } from './camera.js';
import { createPedTexture, spawnPedestrians, updatePedestrians, checkCarPedCollisions } from './pedestrians.js';
import { PED_SCORE_VALUE } from './config.js';
import { createBulletTexture, createBulletPool, tryFire, updateBullets, checkBulletPedCollisions } from './shooting.js';

const app = new Application();
await app.init({ background: '#000000', resizeTo: window });
document.body.appendChild(app.canvas);

initInput();

const worldContainer = new Container();
app.stage.addChild(worldContainer);

const cityMap = generateCityMap();
const city = createCitySprites(app, cityMap);
worldContainer.addChild(city);

const car = createCar(app);
worldContainer.addChild(car);

const player = createPhysicsState();
const spawn = findSpawnPoint(cityMap);
player.x = spawn.x;
player.y = spawn.y;

// Pedestrians
const pedTexture = createPedTexture(app);
const peds = spawnPedestrians(app, cityMap, worldContainer, pedTexture);

// Bullets
const bulletTexture = createBulletTexture(app);
const bulletPool = createBulletPool(bulletTexture, worldContainer);

// HUD
let score = 0;
const scoreText = new Text({ text: 'Score: 0', style: { fill: 0xffffff, fontSize: 20 } });
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);

// Set initial camera position to avoid lerp jump on first frame
worldContainer.x = app.screen.width / 2 - player.x;
worldContainer.y = app.screen.height / 2 - player.y;

app.ticker.add((ticker) => {
  const delta = ticker.deltaTime;
  updatePhysics(player, delta);
  resolveCollisions(player, cityMap);

  if (isFiring()) tryFire(bulletPool, player);
  updateBullets(bulletPool, cityMap, delta);

  updatePedestrians(peds, cityMap, delta);
  const carHits = checkCarPedCollisions(peds, player);
  const bulletHits = checkBulletPedCollisions(bulletPool, peds);
  const totalHits = carHits + bulletHits;
  if (totalHits > 0) {
    score += totalHits * PED_SCORE_VALUE;
    scoreText.text = `Score: ${score}`;
  }

  car.x = player.x;
  car.y = player.y;
  car.rotation = player.rotation;

  updateCamera(worldContainer, player, app);
});
