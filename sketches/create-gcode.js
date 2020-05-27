//2d only; useful for converting canvas-renderable code to gcode

function pointsToGcode(points, paperDepth) {
  if (Array.isArray(points) === false) {
    throw new Error('Points must be an array');
  }

  const gcode = [];
  gcode.push('G0Z0');
  gcode.push(`G1X${points[0].x}Y${points[0].y}`);
  gcode.push(`G0Z${paperDepth}`);
  for (let i = 1; i < points.length; i++) {
    gcode.push(`G1X${points[i].x}Y${points[i].y}`);
  }
  gcode.push('G0Z0');
  return gcode;
}

export default pointsToGcode;