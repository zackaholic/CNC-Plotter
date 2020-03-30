 const Vec2d = require('./toxic.js').Vec2d;
// const radians = require('./modules/toxic.js').radians;
 const tLine = require('./toxic.js').tLine;

const toxic = require('./toxic.js');

function Line (start, end, resolution = 0.2) {
    // if (!(start instanceof vec2d)) {
    //   throw new Error('start and end must be of type vec2d');
    // }
    this.points = tLine.splitIntoSegments(start, end, resolution, this.points, true);
    // this.resolution = resolution;
    this.start = start;
    this.end = end;
}

Line.prototype.render = function (ctx, width = 0.25) {
    if (!ctx) {
    throw new Error('ctx is undefined');
  }
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(this.start.x, this.start.y);
  ctx.lineTo(this.end.x, this.end.y);
  ctx.stroke();
}

Line.prototype.copy = function() {
  return Object.assign(new Line(new Vec2d(0, 0), new Vec2d(0, 0)), this);
}

Line.prototype.renderPoints = function(ctx, width = 0.25) {
  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);
  for (let i = 1; i < this.points.length; i++) {
    ctx.lineTo(this.points[i].x, this.points[i].y);
  }
  ctx.stroke();  
}

Line.prototype.getMidPoint = function() {
  return new tLine(this.start, this.end).getMidPoint();
}

Line.prototype.verticalMagnitude = function() {
  return this.end.y - this.start.y;
}

Line.prototype.horizontalMagnitude = function() {
  return this.end.x - this.start.x;
}

Line.prototype.shiftPoints = function (x, y) {
  this.points = this.points.map(p => p.add(x, y));
}

Line.prototype.mutate = function (noise, noiseOffset, noiseScale, xScale, yScale) {
  this.points = this.points.map((e, i) => {
    const offsetVec = new Vec2d(xScale * noise(i * noiseScale + noiseOffset, 1),
                                yScale * noise(i * noiseScale + noiseOffset, 1));
    //don't touch first point (or last point???)
    return i === 0 ? e : e.add(offsetVec);
  });
}

Line.prototype.trim = function (maxLength) {
  let length = 0;
  this.points = this.points.filter((e, i, a) => {
    if (i < a.length) {
      length += e.distanceTo(a[i + 1]);
      return length < maxLength ? true : false;
    }
    /*last point reached*/
    return true;
  });
}

Line.prototype.deflect = function (noise, noiseOffset, noiseScale, xScale, yScale) {
  let deflection = new Vec2d(xScale * noise(noiseScale + noiseOffset, 1),
                             yScale * noise(noiseScale + noiseOffset, 1));
  let scale = xScale;

  this.points = this.points.map((e, i) => {
    deflection = deflection.add(scale * noise(i * noiseScale + noiseOffset, 1),
                                   yScale * noise(i * noiseScale + noiseOffset, 1));
    /*increase scale to create bend instead of slant*/
    scale += .0005;
    /*don't touch first point (or last point???)*/
    return i === 0 ? e : e.add(deflection);
  });
}

//TODO: this shifts whole line? Not so good?
Line.prototype.mutatePoints = function (mutateArray, scale = 1) {
  this.points = this.points.map((p, i) => {
    return p.add(mutateArray[i] * scale, mutateArray[i] * scale);
  });
}

module.exports = Line;

