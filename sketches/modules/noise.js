const simplex = require('./toxic.js').simplex;
const random = require('./toxic.js').random;

const noiseArray = (size, scale, offset) => {
   const noise = [];
   for (let i = 0; i < size; i++) {
    noise[i] = [];
    for (let j = 0; j < size; j++) {
      noise[i][j] = (simplex.noise(i * scale + offset, j * scale + offset));
    }
  }
  return noise; 
}


  this.scale = scale;
  this.offset = Math.floor(Math.random() * 100);
  this.data = noiseArray(size, scale, this.offset);
  
  this.noise = function(x, y, z) {
    return simplex.noise(x, y, z);
  }

  this.noiseArray = function (size, scale, offset) {
    return noiseArray(size, scale, offset);
  }

  this.noise1d = function (index = 0) {
    //wrap to beginning of array?
    return this.data[index % this.data.length];
  }


module.exports = { noise, noise1d, noiseArray };