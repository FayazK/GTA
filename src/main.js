import './style.css';
import { Application, Container } from 'pixi.js';
import { initInput } from './input.js';
import { createCar } from './car.js';
import { createPhysicsState, updatePhysics } from './physics.js';
import { createGrid, updateGrid } from './grid.js';
import { updateCamera } from './camera.js';

const app = new Application();
await app.init({ background: '#000000', resizeTo: window });
document.body.appendChild(app.canvas);

initInput();

const worldContainer = new Container();
app.stage.addChild(worldContainer);

const grid = createGrid(app);
worldContainer.addChild(grid);

const car = createCar(app);
worldContainer.addChild(car);

const player = createPhysicsState();

app.ticker.add((ticker) => {
  const delta = ticker.deltaTime;
  updatePhysics(player, delta);

  car.x = player.x;
  car.y = player.y;
  car.rotation = player.rotation;

  updateCamera(worldContainer, player, app);
  updateGrid(grid, player, app);
});
