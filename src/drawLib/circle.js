import Point from './point.js';
import Spline from './spline.js';
import { Vec2d } from './toxic.js';

const circlePoints = (center, radius, resolution) => {
  const circumference = radius * 2 * Math.PI;
  const numPoints = circumference / resolution;
  const unitAngle = Math.PI * 2 / numPoints;
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    points[i] = new vec2d(radius * Math.cos(i * unitAngle) + center.x,
                        radius * Math.sin(i * unitAngle) + center.y)
  }
  return points;
}

function Circle (center, radius, resolution) {
  this.center = center;
  this.points = circlePoints(center, radius, resolution);
}

Circle.prototype.render = function(ctx) {
  //spline render
  const s = new Spline(this.points);
  s.render(ctx);

  // if (!ctx) {
  //   throw new Error('ctx is undefined');
  // }
  // ctx.lineWidth = 0.25;
  // ctx.beginPath();
  // ctx.moveTo(this.points[0].x, this.points[0].y);
  // for (let i = 1; i < this.points.length; i++) {
  //   ctx.lineTo(this.points[i].x, this.points[i].y);
  // }
  // //close circle
  // ctx.closePath();
  // ctx.stroke();
}

Circle.prototype.shift = function(vec) {
  this.points = this.points.map(p => p.add(vec));
}

Circle.prototype.mutateRandom = function (scale) {
  this.points = this.points.map((p) => {
    return p.add(new vec2d(~~(Math.random() * scale - scale / 2), ~~(Math.random() * scale - scale / 2)));
  });
}

Circle.prototype.mutateNoise = function(mutateArray, scale) {
  //1d or 2d???
  this.points = this.points.map((p, i) => {
    return p.add(new vec2d(mutateArray[~~p.x][~~p.y] * scale, mutateArray[~~p.x][~~p.y] * scale));
  });
}

export default Circle;




