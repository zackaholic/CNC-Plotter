const toxi = require('./toxic.js');
const Spline2d = toxi.Spline2d;
const Vec2d = toxi.Vec2d;

function Spline(points) {
  const res = 1;
  this.vertices = points;
  this.points = new Spline2d(this.vertices).getDecimatedVertices(res, true);
}

Spline.prototype.render = function(ctx, width, height) {
  // const points = new Spline2d(this.vertices).getDecimatedVertices(res, true);
   ctx.lineWidth = .3;

  const renderable = this.points.filter((e) => {
    return (
        e.x > 0     &&
        e.x < width && 
        e.y > 0     && 
        e.y < height
      );
  });

  if (renderable.length) {
    ctx.beginPath();
    ctx.moveTo(renderable[0].x, renderable[0].y);
    for (let i = 1; i < renderable.length; i++) {
      ctx.lineTo(renderable[i].x, renderable[i].y);
    }
    ctx.stroke();
  }
}   

Spline.prototype.copy = function() {
  return new Spline(this.vertices);
}

Spline.prototype.shift = function(vec) {
  this.vertices = this.vertices.map(e => e.add(vec));
}

Spline.prototype.mutate = function(noise, scale, offsets) {
  this.vertices = this.vertices.map((e, i) => {
    const mutateVec = new Vec2d(noise(e.x * scale.x + offsets.x, e.y * scale.x + offsets.x, offsets.z),
                                noise(e.x * scale.y + offsets.y, e.y * scale.y + offsets.y, offsets.z));
    return e.add(mutateVec);
  });
}

Spline.prototype.mutateFromArray = function(mutateArray, scale) {
  this.vertices = this.vertices.map((e, i) => {
    return e.add(new Vec2d(mutateArray[Math.floor(e.x)] * scale, mutateArray[Math.floor(e.x)] * scale));
  });
}

Spline.prototype.mutateRandom = function(scale) {
  this.vertices = this.vertices.map((e) => {
    return e.add(new Vec2d(Math.random() * scale - scale / 2, Math.random() * scale - scale / 2));
  });
}

Spline.prototype.getPoints = function(resolution) {
  return new Spline2d(this.vertices).getDecimatedVertices(resolution, true);
}


module.exports = Spline;


