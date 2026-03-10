import { Graphics, Sprite } from 'pixi.js';

export function createCar(app) {
  const g = new Graphics();

  // Car body (red, 20x40, drawn centered at origin)
  g.rect(-10, -20, 20, 40).fill({ color: 0xff0000 });

  // Darker stripe at the front for direction cue
  g.rect(-8, -20, 16, 6).fill({ color: 0x880000 });

  const texture = app.renderer.generateTexture(g);
  const car = new Sprite(texture);
  car.anchor.set(0.5, 0.5);

  return car;
}
