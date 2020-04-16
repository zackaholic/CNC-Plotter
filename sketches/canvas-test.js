const { createCanvas, loadImage  } = require('canvas');
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

function trimTo(resolution) {
  return (num) => {
    return num.toFixed(resolution);
  }
}

const trim = trimTo(2);

function grayscale(imageData) {
  const grayscale = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const grayValue = imageData[i] * 0.3 + imageData[i + 1] * 0.59 + imageData[i + 2] * 0.11;
    grayscale.push(grayValue);
    grayscale.push(grayValue);
    grayscale.push(grayValue);
    grayscale.push(255);
  }
  return grayscale;
}

function flattenImageData(imageData) {
  const flattened = [];
  for (let i = 0; i < imageData.data.length / 4; i++) {
    flattened.push(imageData.data[i * 4]);
  }
  return flattened;
}

function pixelDensityToPenHeight(pixelValue, penMin, penMax, pixelMin, pixelMax) {
  const pixelDensity = pixelMax - pixelValue;
  const pixelRange = pixelMax - pixelMin;
  const penRange = Math.abs(penMax - penMin);
  const pixelPercentage = pixelDensity / pixelRange;
  return trim(penMin - (penRange) * pixelPercentage);
}

function halfToneLine(pixelValues, pixelSize, penMin, penMax, pixelMin, pixelMax) {
  const line = [];
  for (let i = 0; i < pixelValues.length; i++) {
    line.push(`G1X${i * pixelSize}Z${pixelDensityToPenHeight(pixelValues[i], penMin, penMax, pixelMin, pixelMax)}`);
  }
  return line;
}

function halftone(pixelData, imageWidth, penMin, penMax, halftoneGcode = []){
  const row = pixelData.splice(0, imageWidth);
  halftoneGcode = [...halftoneGcode, ...halfToneLine(row, penMin, penMax)];
  if (pixelData.length !== 0) {
    return(halftone(pixelData, imageWidth, penMin, penMax, halftoneGcode));
  }
  return halftoneGcode;
}

loadImage('images/marx_low_contrast.jpg')
  .then(image => {
 //   const drawWidth = 100;
 //   const drawHeight = 100;
    const imgWidth = 200;
    const imgHeight = 200;
    ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
    const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
    const flattenedImage = flattenImageData(imageData);
    const minPixelDensity = Math.min(...flattenedImage);
    const maxPixelDensity = Math.max(...flattenedImage);
    const pixelSize = 1;
    const penMin = -0.5;
    const penMax = -2.5;
  //  console.log(minPixelDensity);
  //  console.log(maxPixelDensity);
    console.log('F3000');
    for (let i = 0; i < imgHeight; i++) {
        console.log(halfToneLine(flattenedImage.splice(0, imgWidth), pixelSize, penMin, penMax, minPixelDensity, maxPixelDensity).join('\n'));
        console.log('G0Z0');
        console.log(`G1X0Y${i * pixelSize}`);
      }

    console.log('G1X0Y0');
  });


