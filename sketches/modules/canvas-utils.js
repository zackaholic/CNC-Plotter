const displayPixels = (canvas, pixels) => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(pixels.length, pixels[0].length);

  for (let i = 0; i < pixels.length; i++) {
    for (let j = 0; j < pixels.length; j++) {
      imageData.data[(i * pixels.length + j) * 4 + 0] = pixels[i][j] * 128 + 128;
      imageData.data[(i * pixels.length + j) * 4 + 1] = pixels[i][j] * 128 + 128;
      imageData.data[(i * pixels.length + j) * 4 + 2] = pixels[i][j] * 128 + 128;
      imageData.data[(i * pixels.length + j) * 4 + 3] = 128;
    }
  }
  ctx.putImageData(imageData,0,0);
}

const renderVects = (ctx, vects, lineWidth = 0.5) => {
  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(vects[0].x, vects[0].y);
  for (let i = 1; i < vects.length; i++) {
    ctx.lineTo(vects[i].x, vects[i].y);
  }
  ctx.stroke();
}  

const renderLine = (ctx, line, lineWidth = 0.5) => {
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(line.a.x, line.a.y);
  ctx.lineTo(line.b.x, line.b.y);
  ctx.stroke();
}

module.exports = { displayPixels, renderVects, renderLine };