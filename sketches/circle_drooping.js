import { renderVects, displayPixels } from './render.js';
import { simplex, Vec2d, random } from './toxic.js'
import Circle from './circle.js';
import pointsToGcode from './create-gcode.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

function noiseLookup (scale, offset) {
  return (x, y, z) => {
    return z === undefined
           ? simplex.noise(x * scale + offset, y * scale + offset)
           : simplex.noise(x * scale + offset, y * scale + offset, z * scale + offset);
  }
}

function makeCirclePoints(center, radius, res = 0.1) {
  const c = new Circle(center, radius, res);
  const points = c.getPoints();
  return points;
}

function mutatePoints(scale, multiplier, points) {
  const xMutator = noiseLookup(scale, 1);
  const yMutator = noiseLookup(scale, 10);
  return points.map(e => {
    return e.add(new Vec2d(xMutator(e.x, e.y) * multiplier, yMutator(e.x, e.y) * multiplier));
  });
}

const radius = 300;
const startCoords = new Vec2d(WIDTH / 2, radius);
let circlePoints = makeCirclePoints(startCoords, radius)

let i = 1;
const drawTimer = setInterval(() => {
  renderVects(ctx, circlePoints, 0.5);
  // console.log(pointsToGcode(renderable).join());
  circlePoints = mutatePoints(0.1, 0.1, circlePoints);
  circlePoints = circlePoints.map(e => {
    return e.add(0, 1);
  })
  i++;
  if (i === 2000) {
    clearTimer(drawTimer);
  }
}, 1);


