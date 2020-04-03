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
  const maxPenDepth = -3;
  const numLines = 100;
  const lineSpacing = 2;
  let lineCnt = 0;
  const feed = 7000;

  while(lineCnt < 1) {
    const line = [];
    for (let i = 0; i < numLines; i++) {
	    line.push(lineTo(startX + lineLength / 2, startY, maxPenDepth, feed));
	    line.push(lineTo(startX + lineLength, startY, 0));
	    line.push(penUp());
	    startY += lineSpacing;
	    line.push(moveTo(startX, startY, feed));
    }
    line.push(moveTo(0, 0, feed));
    lineCnt++;
    yield line.join('\n');
  }
}

 const lineMaker = makeLine();
 const { value, done } = lineMaker.next();
// console.log(done);
 console.log(value);
// console.log(value);
//module.exports = makeLine;
