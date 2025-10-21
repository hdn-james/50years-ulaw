const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const pngToIco = require("png-to-ico").default;

const source = path.join(__dirname, "../public/logo.png");

const icons = [
  { name: "favicon-32.png", size: 32, format: "png" },
  { name: "icon-192.png", size: 192, format: "png" },
  { name: "icon-512.png", size: 512, format: "png" },
  { name: "apple-touch-icon.png", size: 180, format: "png" },
];

if (!fs.existsSync(source)) {
  console.error("Source logo not found:", source);
  process.exit(1);
}

Promise.all(
  icons.map((icon) =>
    sharp(source)
      .resize(icon.size, icon.size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toFormat(icon.format)
      .toFile(path.join(__dirname, `../public/${icon.name}`))
      .then(() => console.log(`Created: ${icon.name}`))
      .catch((err) => console.error(`Error creating ${icon.name}:`, err)),
  ),
).then(() => console.log("All icons generated."));

const faviconPngPath = path.join(__dirname, "../public/favicon-32.png");
const faviconIcoPath = path.join(__dirname, "../public/favicon.ico");

pngToIco([faviconPngPath])
  .then((buf) => fs.writeFileSync(faviconIcoPath, buf))
  .then(() => console.log("Created: favicon.ico"))
  .catch((err) => console.error("Error creating favicon.ico:", err));
