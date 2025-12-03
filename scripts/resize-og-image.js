const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Source logo path (update if needed)
const source = path.join(__dirname, '../public/logo.webp'); // <-- Change 'logo.webp' to your actual filename

// Output paths
const outputOg = path.join(__dirname, '../public/og-image.png');
const outputSquare = path.join(__dirname, '../public/og-image-square.png');

// Ensure source exists
if (!fs.existsSync(source)) {
  console.error('Source logo not found:', source);
  process.exit(1);
}

// Resize for Open Graph (1200x630)
sharp(source)
  .resize(1200, 630, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 0 }, // transparent background
  })
  .toFile(outputOg)
  .then(() => {
    console.log('Created:', outputOg);
    // Resize for Square (800x800)
    return sharp(source)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toFile(outputSquare);
  })
  .then(() => {
    console.log('Created:', outputSquare);
  })
  .catch((err) => {
    console.error('Error processing images:', err);
  });
