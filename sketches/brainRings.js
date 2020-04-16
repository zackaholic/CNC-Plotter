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

function aggregateData(lowAlpha, highAlpha, lowBeta, highBeta) {
  const alpha = averageArrays(lowAlpha, highAlpha);
  const beta = averageArrays(lowBeta, highBeta);

  //now do something
}

const data = brainReading(process.argv[2], {dataPoints: 278});
const lowAlpha = data['low alpha'];
const highAlpha = data['high alpha'];
const lowBeta = data['low beta'];
const highBeta = data['high beta'];
aggregateData(lowAlpha, highAlpha, lowBeta, highBeta);

const { attention } = data;

function makeRing(data, radius, center) {
  const circlePoints = new Circle(center, radius, 1).points;
  const paperDepth = -2;
  const maxPenDepth = -6;
  const minBrainValue = Math.min(...data);
  const maxBrainValue = Math.max(...data);
  const feed = 4000;

  console.log(`F${feed}`);
  console.log(`G1X${trim(circlePoints[0].x)}Y${trim(circlePoints[0].y)}`);

  for (let i = 0; i < circlePoints.length; i++) {
    const { x, y } = circlePoints[i];
    const dataPoint = Math.floor((data.length / circlePoints.length) * i);
    const z = mapRange(data[dataPoint], minBrainValue, maxBrainValue, paperDepth, maxPenDepth);
    console.log(`G1X${trim(circlePoints[i].x)}Y${trim(circlePoints[i].y)}Z${trim(z)}`);
  }
  console.log('g0z0');
  console.log('G1X0Y0');
}

makeRing(attention, 36, new Vec2d(40, 40));

