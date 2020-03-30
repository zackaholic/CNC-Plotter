const POSITION_DECIMAL_PLACES = 2;

function trimTo(places) {
  return (num) => {
    return num.toFixed(places);
  }
}

const trim = trimTo(POSITION_DECIMAL_PLACES);

function penUp() {
  return 'G0Z0';
}

function lineTo(x, y, stroke, feed) {
  return `G1X${trim(x)}Y${trim(y)}Z${trim(stroke)}${feed !== undefined ? `F${feed}` : ''}`;
}

function moveTo(x, y, feed) {
  return (
    feed === undefined 
    ? `G0X${trim(x)}Y${trim(y)}`
    : `G1X${trim(x)}Y${trim(y)}F${feed}`
  );
}


function* makeLine() {
  let startX = 10;
  let startY = 0;
  const lineLength = 300;
  const maxPenDepth = -5;
  const numLines = 10;
  let lineCnt = 0;

  while(lineCnt < numLines) {
    const line = [];
    line.push(moveTo(startX, startY, 5000));
    for (let i = 0; i < lineLength / 2; i++) {
      line.push(lineTo(i + startX, startY, maxPenDepth / lineLength * i));
    }
    for (let i = lineLength / 2; i < lineLength; i++) {
      line.push(lineTo(i + startX, startY, maxPenDepth - (maxPenDepth / lineLength * i)));
    }
    line.push(penUp());
    startY += 5;
    line.push(moveTo(startX, startY, 5000));
    yield line.join('\n');
    lineCnt++;
  }
}

// const lineMaker = makeLine();
// const { value, done } = lineMaker.next();
// console.log(done);
// console.log(value);
module.exports = makeLine;