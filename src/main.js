import './style.css';
import { Application, Container, Text } from 'pixi.js';
import { initInput, isFiring, isRestarting } from './input.js';
import { createCar } from './car.js';
import { createPhysicsState, updatePhysics } from './physics.js';
import { generateCityMap, createCitySprites, findSpawnPoint } from './city.js';
import { resolveCollisions } from './collision.js';
import { updateCamera } from './camera.js';
import { createPedTexture, spawnPedestrians, updatePedestrians, checkCarPedCollisions } from './pedestrians.js';
import { PED_SCORE_VALUE, MISSION_REWARD } from './config.js';
import { createBulletTexture, createBulletPool, tryFire, updateBullets, checkBulletPedCollisions } from './shooting.js';
import { createMarkerSprite, placeNewMission, checkMissionComplete } from './missions.js';
import { createPoliceTexture, spawnPolice, updateWanted, updatePolice, checkPolicePlayerCollision } from './police.js';

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

// Missions
const missionMarker = createMarkerSprite(app, worldContainer);
let mission = placeNewMission(missionMarker, cityMap);

// Police
const policeTexture = createPoliceTexture(app);
const policeState = spawnPolice(policeTexture, worldContainer);

// HUD
let score = 0;
let money = 0;
const moneyText = new Text({ text: 'Money: $0', style: { fill: 0x00ff00, fontSize: 20 } });
moneyText.x = 10;
moneyText.y = 10;
app.stage.addChild(moneyText);

const scoreText = new Text({ text: 'Score: 0', style: { fill: 0xffffff, fontSize: 20 } });
scoreText.x = 10;
scoreText.y = 35;
app.stage.addChild(scoreText);

const missionText = new Text({ text: 'Mission: Drive to the marker!', style: { fill: 0xffff00, fontSize: 18 } });
missionText.x = 10;
missionText.y = 60;
app.stage.addChild(missionText);

const wantedText = new Text({ text: 'Wanted: ', style: { fill: 0xff0000, fontSize: 20 } });
wantedText.anchor.set(1, 0);
wantedText.x = app.screen.width - 10;
wantedText.y = 10;
app.stage.addChild(wantedText);

let gameOver = false;
const gameOverText = new Text({
  text: 'BUSTED!\nPress R to restart',
  style: { fill: 0xff0000, fontSize: 48, align: 'center' },
});
gameOverText.anchor.set(0.5, 0.5);
gameOverText.x = app.screen.width / 2;
gameOverText.y = app.screen.height / 2;
gameOverText.visible = false;
app.stage.addChild(gameOverText);

// Set initial camera position to avoid lerp jump on first frame
worldContainer.x = app.screen.width / 2 - player.x;
worldContainer.y = app.screen.height / 2 - player.y;

app.ticker.add((ticker) => {
  const delta = ticker.deltaTime;

  if (gameOver) {
    if (isRestarting()) location.reload();
    return;
  }

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

  const stars = updateWanted(policeState, totalHits, delta);
  updatePolice(policeState, player, cityMap, delta);
  if (checkPolicePlayerCollision(policeState, player)) {
    gameOver = true;
    gameOverText.visible = true;
    return;
  }

  if (checkMissionComplete(mission, player)) {
    money += MISSION_REWARD;
    moneyText.text = `Money: $${money}`;
    mission = placeNewMission(missionMarker, cityMap);
  }

  wantedText.text = 'Wanted: ' + '\u2605'.repeat(stars);

  car.x = player.x;
  car.y = player.y;
  car.rotation = player.rotation;

  updateCamera(worldContainer, player, app);
});
