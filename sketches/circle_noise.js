import { renderVects, displayPixels } from './render.js';
import renderGcode from './render-gcode.js';
import { simplex, Vec2d, random } from './toxic.js'
import Circle from './circle.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const numPoints = 10;

function noiseLookup (scale, offset) {
  return (x, y) => {
    return simplex.noise(x * scale + offset, y * scale + offset);
  }
}
const scale = 0.03;

const xNoise = noiseLookup(scale, 1);
const yNoise = noiseLookup(scale, 10);
const radius = 300;
const resolution = 0.5;

function makeCircle(center) {
  const c = new Circle(center, radius, resolution);
  const points = c.getPoints().map((e) => {
    return e.add(Math.pow(3, xNoise(e.x, e.y) * 3), Math.pow(3, yNoise(e.x, e.y) * 3));
  });
  renderVects(ctx, points, 1);
}
for (let i = -200; i < 600; i++) {
  makeCircle(new Vec2d(100 + i * 2, 400));
}
