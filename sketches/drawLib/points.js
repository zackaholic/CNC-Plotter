const shiftPoints = (points, vec) => {
  return points.map(e => e.add(vec));
}

const mutatePoints = (points, mutateArray) => {
  return points.map((e, i) => e.add(mutateArray[i]));
}

// Spline.prototype.mutateRandom = function(scale) {
//   this.vertices = this.vertices.map((e) => {
//     return e.add(new Vec2d(Math.random() * scale - scale / 2, Math.random() * scale - scale / 2));
//   });
// }

export { shiftPoints, mutatePoints };