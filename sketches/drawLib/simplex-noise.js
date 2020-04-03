const simplex = require('./toxic.js').simplex;

function* noiseGen(scale, amplitude, offset) {
  let s = scale;
  let a = amplitude;
  let x = offset;
  let y = offset;

  while(1) {
    yield simplex.noise(x, y) * amplitude;
    x += scale;
  }
}

function SimplexNoise1d(scale, amplitude, offset) {
  //1d noise generator
  this.makeSomeNoise = noiseGen(scale, amplitude, offset);
  this.noise = function() {
    return this.makeSomeNoise.next().value;
  }
}

module.exports = SimplexNoise1d;
