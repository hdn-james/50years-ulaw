const pngToIco = require("png-to-ico");

const faviconPngPath = path.join(__dirname, "../public/favicon-32.png");
const faviconIcoPath = path.join(__dirname, "../public/favicon.ico");

pngToIco([faviconPngPath])
  .then((buf) => fs.writeFileSync(faviconIcoPath, buf))
  .then(() => console.log("Created: favicon.ico"))
  .catch((err) => console.error("Error creating favicon.ico:", err));
