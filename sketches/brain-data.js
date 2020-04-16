const fs = require('fs');


function sum(arr) {
  return arr.reduce((acc, e) => {return e + acc}, 0);
}

function average(arr) {
  return sum(arr) / arr.length;
}
function averageTo(numValues) {
  function averageOf (values) {
    const samplesPerAverage = Math.floor(values.length / numValues);
    const averaged = [];
    while(values.length) {
      averaged.push(values.length >= samplesPerAverage
                    ? average(values.splice(0, samplesPerAverage))
                    : average(values.splice(0, values.length)));
    }
    return averaged.slice(0, numValues);
  }
  return averageOf;
}

function circumference(radius) {
  return Math.PI * radius * 2;
}


//now create a constructor, take in options object, return averaged data for selected
//fields in selected file at selected sample size?

//brain reading data points will usually be less than circle rendering points
//so always return full dataset.
//for example a value for every degree in a circle would take 6 minutes to record- :(

function brainReading(filename) {
  const fileContents = fs.readFileSync(filename);
  const brainData = JSON.parse(fileContents);

  //create ordered array of brain reading objects
  const readings = Object.keys(brainData)
  .reduce((acc, key) => [...acc, {[key]: brainData[key]}], [])
  .sort((a, b) =>  Object.keys(a)[0] < Object.keys(b)[0] ? a : b)
  .map((e) => e[Object.keys(e)[0]]);

  const result = {
    "meditation" : readings.map(e => parseInt(e.meditation)),
    "attention" : readings.map(e => parseInt(e.attention)),
    "delta" : readings.map(e => parseInt(e.delta)),
    "theta" : readings.map(e => parseInt(e.theta)),
    "low alpha" : readings.map(e => parseInt(e['low alpha'])),
    "high alpha" : readings.map(e => parseInt(e['high alpha'])),
    "low beta" : readings.map(e => parseInt(e['low beta'])),
    "high beta" : readings.map(e => parseInt(e['high beta'])),
    "low gamma" : readings.map(e => parseInt(e['low gamma'])),
    "high gamma" : readings.map(e => parseInt(e['high gamma'])),
  }
  return result;
}

module.exports = brainReading;

