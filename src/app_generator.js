// const input = require('./interface');
//const stream = require('./grblStream');
// const fs = require('fs');
//const readline = require('readline');
// const Gpio = require('onoff').Gpio;
//const spiral = require('./spiralLines');
const draw = require('./sketches/splineLandscape.js');
// const button = new Gpio(4, 'in', 'falling', {debounceTimeout: 20});
let line = '';
let drawLine = draw();
while(line = drawLine.next().value) {
  console.log(line);
}

// process.on('SIGINT', () => {
//   button.unexport();
//   console.log('buttons detached');
// });



// const sendFile = (file) => {
//   console.log(file);
//   const rl = readline.createInterface({
//     input: fs.createReadStream(file)
//   });
//   rl.on('line', (line) => {
//     stream.buffer(`${line}\n`);
//   });
// }


// while()
// draw();
// let file = '';

// setInterval(function(e) {
//   const file = writeFile.next().value;
//   if (file) {
//     console.log(file);
//   } else {
//     process.exit();
//   }
// }, 1);

// console.log(writeFile.next());

// setTimeout(function(e) {
//   sendFile(file);  
// }, 5000);



// const buttonFunction = randomGcode;

// stream.on('port-open', () => {
//   console.log('port open');
//   // button.watch(buttonFunction);
// //  sendConfig();
// //  streamRandomFile();
// //  home();
// //  sendFile('gcodes/bench.gcode')
// });

// stream.on('first-contact', () => {
//   //console.log('got first contact');
// });

// stream.on('grbl-empty', () => {
//   //this happens repeatedly during normal streaming, registering a million callbacks causing repeat homing error
//   //button.watch(buttonFunction);
//   //console.log('grbl empty event')
//   if (finished) {
//     process.exit();
//   }
// });

// stream.on('buffer-low', () => {
//   const nextLine = writeFile.next().value;
//   if (nextLine) {
//     stream.buffer(nextLine);
//   } else {
//     finished = true;
//   }
//   //console.log('buffer low event_____________________________________')
//   });
