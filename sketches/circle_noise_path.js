import { renderVects, displayPixels } from './render.js';
import renderGcode from './render-gcode.js';
import { simplex, Vec2d, random } from './toxic.js'
import Circle from './circle.js';
import Spline from './spline.js';

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

function pathPoints(controlPoints, separation, topLeft, bottomRight) {
  const points = [];
  for (let i = 0; i < controlPoints; i++) {
    points.push(new Vec2d(random(topLeft.x, bottomRight.x), random(topLeft.y, bottomRight.y)));
  }
  const s = new Spline(points);
  // s.render(ctx);
  return s.getPoints(separation);
}

const tl = new Vec2d(radius*2, radius*2);
const br = new Vec2d(WIDTH - radius * 2, HEIGHT - radius * 2);

const circlePath = pathPoints(5, 2, tl, br);

function makeCircle(center, radius) {
  const c = new Circle(center, radius, resolution);
  const points = c.getPoints().map((e) => {
    return e.add(Math.pow(3, xNoise(e.x, e.y) * 3), Math.pow(3, yNoise(e.x, e.y) * 3));
  });
  renderVects(ctx, points, 1);
}

let i = 0;
let r = radius;

setInterval(() => {
  makeCircle(circlePath[i], r);
  i++;
}, 10);

// for (let i = 0; i < circlePath.length; i++) {
//   //makeCircle(circlePath[i]);
// }
