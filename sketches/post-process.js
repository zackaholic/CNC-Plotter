const penUp = 'G0Z0';
const X = /X\d+.\d+/g;
const Y = /Y\d+.\d+/g;

function removeAdjacentDuplicates(gcode) {
  return gcode.filter((e, i, a) => i === 0 || e !== a[i - 1]);
}

function trimToBounds(gcode, topLeft, bottomRight) {
  const trimmed =  gcode.map(e => {
    const xPos = parseFloat(e.match(X)[0].slice(1));
    const yPos = parseFloat(e.match(Y)[0].slice(1));
    return xPos > topLeft.x && xPos < bottomRight.x && yPos > topLeft.y && yPos < bottomRight.y
      ? e
      : penUp;
  });
  return removeAdjacentDuplicates(trimmed);
}

module.exports.trimToBounds = trimToBounds;


