import { Vec2d } from './toxic.js';

function Particle (location, velocity) {
  if (!(location instanceof Vec2d)) {
    throw new Error('Particle constructor takes vector arguments')
  }
  this.location = location;
  this.velocity = velocity;
}

Particle.prototype.move = function() {
  this.location = this.location.add(this.velocity);
}

Particle.prototype.accelerate = function(x, y) {
  this.velocity = this.velocity.add(new Vec2d(x, y));
}

export default Particle;