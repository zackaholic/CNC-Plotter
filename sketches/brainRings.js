const brainReading = require('./brain-data');
const Circle = require('./drawLib/circle');
const { Vec2d } = require('./drawLib/toxic');
const circumference = rad => Math.PI * rad * 2;

function trimTo(res) {
  return (val) => val.toFixed(res);
}

const trim = trimTo(2);

function mapRange(value, inMin, inMax, outMin, outMax) {
  const inputRange = inMax - inMin;
  const outputRange = outMax - outMin;
  //console.log(inMin);
  return (value - inMin) / inputRange * outputRange + outMin;
}

//brain activity readings will usually be less than render points in a circle
//and their number will be less variable
//data is fixed but circle size should be variable
//
//record a standard number of readings and spread then out over circle coordinates
//maybe 180? 3min worth?
//

/* Data
 * Attention
 * Meditation
 * Delta: Dreamless sleep
 * Theta: Drowsy
 * Low Alpha: Relaxed
 * High Alpha: Relaxed
 * Low Beta: Alert
 * High Beta: Alert
 * Low Gamma: Multi-sensory processing
 * High Gamma: ???
 */

function averageArrays(a, b) {
  return a.map((e, i) => {
    return (e + b[i]) / 2;
  });
}

function addArrays(a, b) {
  return a.map((e, i) => e + b[i]);
}

function subArrays(a, b) {
  return a.map((e, i) => e - b[i]);
}

function scaleArray(a, scaleFactor) {
  return a.map(e => e * scaleFactor);
}

function smoothAbberations(arr, deviation) {
  const average = arr.reduce((acc, e) => {return acc + e}, 0) / arr.length;
  const max = Math.max(...arr);
  return arr.map((e, i, a) => {
    //replace very large or small elements with value of their neighbors or average
    //if it's the first value
    return (e < average * deviation && e > average - average * deviation)
      ? e
      : i === 0 ? average : a[i - 1];
  });
}

function midValue(arr) {
  return (Math.max(...arr) - Math.min(...arr)) / 2 + Math.min(...arr);
}

function centerOnZero(arr) {
  const midVal = midValue(arr);
  return arr.map(e => e - midVal);
}

function interfereArrays(a, b) {
  aNormal = centerOnZero(a);
  bNormal = centerOnZero(b);
  const interfered = addArrays(aNormal, bNormal);
  const newMin = Math.min(...interfered);
  return interfered.map(e => e + Math.abs(newMin));
}

function aggregateData(lowAlpha, highAlpha, lowBeta, highBeta) {
  const alpha = averageArrays(lowAlpha, highAlpha);
  const beta = averageArrays(lowBeta, highBeta);
  const cleanedAlpha = smoothAbberations(alpha, 2.5);
  const cleanedBeta = smoothAbberations(beta, 2.5);
  //return averageArrays(cleanedAlpha, cleanedBeta);
  return interfereArrays(cleanedBeta, cleanedAlpha);
}

function pumpCheck(dutyCycle, numMoves) {
  //this will not work if all line lengths are < frequency number of moves long
  //in that case have to use a stepper motor?
  //or might not work at all in such cases due to mechanical limitations of pump

  //const frequency = 20; // rate in units of number of drawing moves to pulse at; this is also max resolution
  //or calculate frequency based on number of total segments?
  const frequency = numMoves / 20;  // 36mm circle has about 220 segments at 0.5mm intervals
  const segmentsOn = Math.floor(frequency * dutyCycle);
  const segmentsOff = Math.floor(frequency - segmentsOn);
  return (index) => {
    return  index % Math.floor(frequency) <= segmentsOn;
  }
}

function pumpAndMove(start, dest, duration) {
  //move for duration in seconds with pump active to prime brush
  const distance = start.distanceTo(dest);
  const rate = distance/(duration / 60);
  return `G1X${dest.x}Y${dest.y}F${trim(rate)}S${1000}`;
}

function writeGcode(cmds) {
  console.log(cmds.join('\n'));
}

const G1 = (x, y, z, f) => `G1X${trim(x)}Y${trim(y)}${z === undefined ? '' : `Z${trim(z)}`}${f === undefined ? '' : `F${trim(f)}`}`;
const G0 = (x, y, z) => `G0X${x}Y${y}Z${z}`;
const setFeed = (f) => `F${f}`;
const setFlow = (f) => `S${f}`;
const clearPen = () => 'G0Z0';
const laserMode = () => 'M3'; //User defined Laser Power Mode

const data = brainReading(process.argv[2]);
const attention = data['attention'];
const meditation = data['meditation'];
const lowAlpha = data['low alpha'];
const highAlpha = data['high alpha'];
const lowBeta = data['low beta'];
const highBeta = data['high beta'];
const aggregated = aggregateData(lowAlpha, highAlpha, lowBeta, highBeta);

const pumpRate = 1000;
const footerGcode = [setFlow(0), clearPen(), G1(0, 0, 0)];
const radius = 36;
const primingFeed = 3000;
const paperDepth = -2;
const maxPenDepth = -6;
const feed = 4000;
const inkRate = 0.05;
const doubleStroke = false; //use a second stroke with zero ink flow to even out ink distribution?
//start ink flow during move-to-start to prime pen
//use pumpAndMove() to fine tune priming duration
//or slow down initial move to circle start (done here)
const setupGcode = [laserMode(), setFeed(feed), clearPen()];


function makeRing(data, radius, center, flow) {
  let pumping = false;
  const minBrainValue = Math.min(...data);
  const maxBrainValue = Math.max(...data);
  const circlePoints = new Circle(center, radius, 1).points;
  const calcInkState = pumpCheck(inkRate, circlePoints.length);
  const ring = [];
 //move to start while priming pump??
  ring.push(setFlow(pumpRate));
  ring.push(setFeed(primingFeed));
  ring.push(G1(circlePoints[0].x, circlePoints[0].y));
  ring.push(setFlow(0));
  ring.push(setFeed(feed));

//now draw ring
  for (let i = 0; i < circlePoints.length; i++) {
    const { x, y } = circlePoints[i];
    const dataPoint = Math.floor((data.length / circlePoints.length) * i);
    const z = mapRange(data[dataPoint], minBrainValue, maxBrainValue, paperDepth, maxPenDepth);
    if (calcInkState(i) && !pumping) {
      ring.push(setFlow(flow));
      pumping = true;
    }
    if (!calcInkState(i) && pumping) {
      ring.push(setFlow(0));
      pumping = false;
    }
    ring.push(G1(x, y, z));
  }
  return ring;
}
writeGcode([
  ...setupGcode,
  ...makeRing(attention, radius, new Vec2d(40, 40), pumpRate),
  ...makeRing(attention, radius, new Vec2d(40, 40), 0),
  ...footerGcode
]);

