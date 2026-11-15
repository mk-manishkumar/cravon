import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ICONS_DIR = path.resolve(__dirname, "..", "public", "icons");

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crcBuf = Buffer.concat([t, data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, t, data, c]);
}

function createPng(size, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const raw = Buffer.alloc(size * (1 + size * 4));
  let offset = 0;

  const cx = size / 2;
  const cy = size / 2;
  const badgeRadius = isMaskable ? size * 0.44 : size * 0.40;
  const innerRadius = size * 0.28;

  for (let y = 0; y < size; y++) {
    raw[offset++] = 0; // Filter byte: None
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: Dark theme #0F0F11
      let r = 15;
      let g = 15;
      let b = 17;
      let a = 255;

      if (dist <= badgeRadius) {
        // Red badge #FF3D57
        r = 255;
        g = 61;
        b = 87;

        // Steering wheel / Delivery icon drawing in center
        if (dist <= innerRadius) {
          const angle = Math.atan2(dy, dx);
          const ringWidth = size * 0.055;
          const isOuterRing = dist >= innerRadius - ringWidth && dist <= innerRadius;
          const isCenterHub = dist <= size * 0.08;
          const isSpoke =
            (Math.abs(dy) <= size * 0.025 && dx <= 0) || // Left spoke
            (Math.abs(dy) <= size * 0.025 && dx >= 0) || // Right spoke
            (Math.abs(dx) <= size * 0.025 && dy >= 0); // Bottom spoke

          if (isOuterRing || isCenterHub || (isSpoke && dist <= innerRadius)) {
            // White #FFFFFF
            r = 255;
            g = 255;
            b = 255;
          }
        }
      }

      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const p192 = createPng(192, false);
fs.writeFileSync(path.join(ICONS_DIR, "icon-192x192.png"), p192);

const p512 = createPng(512, false);
fs.writeFileSync(path.join(ICONS_DIR, "icon-512x512.png"), p512);

const pMaskable = createPng(512, true);
fs.writeFileSync(path.join(ICONS_DIR, "icon-maskable-512x512.png"), pMaskable);

const pApple = createPng(180, false);
fs.writeFileSync(path.join(ICONS_DIR, "apple-touch-icon.png"), pApple);

console.log("PWA Icons generated successfully in driver-apk/public/icons!");
