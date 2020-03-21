const fs = require('fs');
const Gcanvas = require('gcanvas');
const toxi = require('toxiclibsjs');
const renderVects = require('./modules/canvas-utils.js').renderVects;
const toxic = require('./modules/toxic.js');
const Vec2d = toxic.Vec2d;
const random = toxic.random;
const radians = toxic.radians;
const noise = toxic.simplex.noise;


const filename = `./gcodes/${new Date().getTime().toString()}.gcode`;;
var stream = fs.createWriteStream(filename, {flags:'a'});

let gcodeString = '';

const driver = new Gcanvas.GcodeDriver({
  write: function(cmd) {
    gcodeString += cmd + '\n';
  }
});

const ctx = new Gcanvas(driver);

ctx.toolDiameter = 0.5;
ctx.depth = 1;
ctx.ramping = false;

const opts = {
        width: 355.6,
        height: 431.8,
        gutterX: 40,
        gutterY: 80,
        noiseScale: 0.008,
        noiseOffset: 1,//random(1, 100),
        rotationScale: 1.5,
        stepSize: 0.2,
        maxLines: 500,
        maxPoints: 2000,
        lineWidth: 0.3
       };




function* wiggle() {
  let z = 0;
  let lines = 0;
  console.log('F2000');
  console.log('G0Z1');
  while (lines < opts.maxLines) {
    lines++;
    const points = [new Vec2d(random(0, opts.width), random(0, opts.height))];
    if (lines % 10 === 0) z = random(0, 0.07)//z += 0.001;
    
    let bg = noise(points[0].x * opts.noiseScale + opts.noiseOffset, points[0].y * opts.noiseScale + opts.noiseOffset, z);
    while (bg > 0.0 && bg < -0.9) {
      bg = noise(points[0].x * opts.noiseScale + opts.noiseOffset, points[0].y * opts.noiseScale + opts.noiseOffset, z);
    }

    for (let i = 0; i < opts.maxPoints; i++) {
      const n = noise(points[i].x * opts.noiseScale + opts.noiseOffset, points[i].y * opts.noiseScale + opts.noiseOffset, z);
      const rotation = Math.PI * n * opts.rotationScale;
      let newX = opts.stepSize * Math.cos(rotation*random(2)) + points[i].x;
      let newY = opts.stepSize * Math.sin(rotation*random(2)) + points[i].y;

      if (newX < 0 || newY < 0 || newX > opts.width || newY > opts.height) {
        break;
      }
      points.push(new Vec2d(newX, newY));
    }
    renderVects(ctx, points, opts.lineWidth);
    yield gcodeString;
  }
  // stream.write('G0Z0\n');
  // stream.write('G0X0Y0\n');
  // stream.write('G0Z-1\n');
  // stream.end();

  // return filename;
}


module.exports = wiggle;



