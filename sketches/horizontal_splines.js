import { renderVects, displayPixels } from './render.js';
import renderGcode from './render-gcode.js';
import { simplex, Vec2d, random } from './toxic.js'
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

const noise = noiseLookup(0.008, 1);

function makeSpline(y) {
  const splinePoints = [];

  for (let i = 0; i <= numPoints; i++) {
    const noiseVal = noise((WIDTH / numPoints) * i, y) * 30;
    splinePoints[i] = new Vec2d((WIDTH / numPoints) * i, y + noiseVal);
  }
  const s = new Spline(splinePoints);
  s.render(ctx, 1);
}

const verticalNoise = noiseLookup(0.01, 10);

for (let i = 0; i < 1500; i++) {
  makeSpline(i * 0.5 + verticalNoise(0, i * 2) * 6);
}
