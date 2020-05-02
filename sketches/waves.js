const { Vec2d, Wave, random } = require('./drawLib/toxic');
const { trimToBounds } = require('./post-process');

const modFM = new Wave.SineWave(0, 0.1, 2, 0);
const modAM = new Wave.SineWave(0, 0.5, 9, 0);
const sin = new Wave.FMSineWave(0, .5, 10, 0, modFM);

function wave(length, start, stepSize, waveFn) {
  let x = start.x;

  console.log('F3000');

  while(x <= length) {
    console.log(`G1X${x}Y${start.y + waveFn.update()}`);
    x += stepSize;
  }
}
wave(100, new Vec2d(0, 10), 0.5, sin);
/*
for (let i = 0; i < 100; i++) {
  wave(100, new Vec2d(0, 10 + i), 1, new SineWave(0, .1 + .001 * i, 10, 0));
}
*/
