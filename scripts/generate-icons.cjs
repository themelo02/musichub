const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }

  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'binary');
    const toCrc = Buffer.concat([typeBuf, data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = chunk('IHDR', ihdrData);
  const idat = chunk('IDAT', deflated);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Icon generator with audio wave / modern studio theme
function getStudioPixel(x, y, w, h, isMaskable) {
  const nx = x / w;
  const ny = y / h;

  // Background gradient: dark sleek slate #0a0f18 to #04060a
  let r = Math.round(10 - ny * 6);
  let g = Math.round(15 - ny * 9);
  let b = Math.round(24 - ny * 14);
  let a = 255;

  // Safe zone for maskable icons (15% padding)
  const margin = isMaskable ? 0.15 : 0.08;
  if (nx < margin || nx > 1 - margin || ny < margin || ny > 1 - margin) {
    return [r, g, b, a];
  }

  // Draw 5 audio equalizer bars in the center
  const bars = [
    { cx: 0.30, height: 0.28, color: [236, 72, 153] }, // pink
    { cx: 0.40, height: 0.45, color: [168, 85, 247] }, // purple
    { cx: 0.50, height: 0.60, color: [59, 130, 246] },  // blue
    { cx: 0.60, height: 0.48, color: [6, 182, 212] },  // cyan
    { cx: 0.70, height: 0.32, color: [132, 204, 22] },  // lime
  ];

  const barWidth = 0.055;
  const centerY = 0.5;

  for (const bar of bars) {
    const dx = Math.abs(nx - bar.cx);
    const dy = Math.abs(ny - centerY);
    if (dx <= barWidth / 2 && dy <= bar.height / 2) {
      // Rounded bar cap
      const cornerRadius = barWidth / 2;
      const cornerY = bar.height / 2 - cornerRadius;
      if (dy > cornerY) {
        const cdx = dx;
        const cdy = dy - cornerY;
        if (cdx * cdx + cdy * cdy > cornerRadius * cornerRadius) {
          continue;
        }
      }
      return [bar.color[0], bar.color[1], bar.color[2], 255];
    }
  }

  return [r, g, b, a];
}

const publicDir = path.resolve(__dirname, '../public');

// 1. 192x192
const p192 = createPng(192, 192, (x, y, w, h) => getStudioPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), p192);

// 2. 512x512
const p512 = createPng(512, 512, (x, y, w, h) => getStudioPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), p512);

// 3. maskable 512x512 (with 15% safe margin)
const pMaskable = createPng(512, 512, (x, y, w, h) => getStudioPixel(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pMaskable);

// 4. apple-touch-icon 180x180
const pApple = createPng(180, 180, (x, y, w, h) => getStudioPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pApple);

// 5. favicon.ico / 64x64
const pFavicon = createPng(64, 64, (x, y, w, h) => getStudioPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.png'), pFavicon);

console.log('All PWA icons successfully generated in /public!');
