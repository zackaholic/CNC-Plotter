const stream = require('./grblStream');
const drawLine = require('./../../sketches/plotter-sketches/penDepthTest');

const draw = drawLine();

stream.on('port-open', () => {
  stream.buffer(draw.next().value);
});

stream.on('buffer-low', () => {
  const { value, done } = draw.next();
  if (!done) {
    stream.buffer(value);
  }
});

stream.on('grbl-empty', () => {
  console.log('Got grbl empty event; exiting.')
  // if (finished) {
  //   process.exit();
  // }
});