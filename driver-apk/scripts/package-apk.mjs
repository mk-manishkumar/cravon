import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(BASE_DIR, "dist");
const CLIENT_PUBLIC_DIR = path.resolve(BASE_DIR, "..", "client", "public");
const OUTPUT_APK = path.join(CLIENT_PUBLIC_DIR, "cravon-driver.apk");
const LOCAL_APK = path.join(BASE_DIR, "cravon-driver.apk");

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function adler32(buf) {
  let a = 1;
  let b = 0;
  for (let i = 0; i < buf.length; i++) {
    a = (a + buf[i]) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

// Minimal Dalvik Executable (classes.dex)
function createMinimalDex() {
  const strings = ["<init>", "Lcom/cravon/driver/MainActivity;", "Ljava/lang/Object;", "MainActivity.java", "V"];

  const strDataOffsets = [];
  const strDataChunks = [];
  let strDataLen = 0;

  for (const s of strings) {
    strDataOffsets.push(strDataLen);
    const encoded = Buffer.from(s, "utf8");
    const chunk = Buffer.concat([Buffer.from([encoded.length]), encoded, Buffer.from([0])]);
    strDataChunks.push(chunk);
    strDataLen += chunk.length;
  }
  let strData = Buffer.concat(strDataChunks);

  const types = [1, 2, 4];
  const protos = [{ shorty: 4, returnType: 2, paramsOff: 0 }];

  const headerSize = 112;
  const stringIdsOff = headerSize;
  const stringIdsSize = strings.length;

  const typeIdsOff = stringIdsOff + stringIdsSize * 4;
  const typeIdsSize = types.length;

  const protoIdsOff = typeIdsOff + typeIdsSize * 4;
  const protoIdsSize = protos.length;

  const classDefsOff = protoIdsOff + protoIdsSize * 12;
  const classDefsSize = 1;

  const mapOff = classDefsOff + classDefsSize * 32;
  const mapItemsCount = 7;
  const stringDataStart = mapOff + 4 + mapItemsCount * 12;

  // Align string data
  const totalSizePreAlign = stringDataStart + strData.length;
  const alignPad = (4 - (totalSizePreAlign % 4)) % 4;
  const totalSize = totalSizePreAlign + alignPad;
  if (alignPad > 0) {
    strData = Buffer.concat([strData, Buffer.alloc(alignPad)]);
  }

  // Build String IDs
  const stringIds = Buffer.alloc(stringIdsSize * 4);
  for (let i = 0; i < strDataOffsets.length; i++) {
    stringIds.writeUInt32LE(stringDataStart + strDataOffsets[i], i * 4);
  }

  // Build Type IDs
  const typeIds = Buffer.alloc(typeIdsSize * 4);
  for (let i = 0; i < types.length; i++) {
    typeIds.writeUInt32LE(types[i], i * 4);
  }

  // Build Proto IDs
  const protoIds = Buffer.alloc(protoIdsSize * 12);
  protoIds.writeUInt32LE(protos[0].shorty, 0);
  protoIds.writeUInt32LE(protos[0].returnType, 4);
  protoIds.writeUInt32LE(protos[0].paramsOff, 8);

  // Build Class Defs
  const classDefs = Buffer.alloc(32);
  classDefs.writeUInt32LE(0, 0); // class_idx
  classDefs.writeUInt32LE(1, 4); // access_flags (public)
  classDefs.writeUInt32LE(1, 8); // superclass_idx
  classDefs.writeUInt32LE(0, 12); // interfaces_off
  classDefs.writeUInt32LE(3, 16); // source_file_idx
  classDefs.writeUInt32LE(0, 20); // annotations_off
  classDefs.writeUInt32LE(0, 24); // class_data_off
  classDefs.writeUInt32LE(0, 28); // static_values_off

  // Map List
  const mapItems = [
    [0x0000, 1, 0],
    [0x0001, stringIdsSize, stringIdsOff],
    [0x0002, typeIdsSize, typeIdsOff],
    [0x0003, protoIdsSize, protoIdsOff],
    [0x0006, classDefsSize, classDefsOff],
    [0x1000, 1, mapOff],
    [0x2002, stringIdsSize, stringDataStart],
  ];

  const mapList = Buffer.alloc(4 + mapItems.length * 12);
  mapList.writeUInt32LE(mapItems.length, 0);
  for (let i = 0; i < mapItems.length; i++) {
    const [itemType, size, offset] = mapItems[i];
    const itemOff = 4 + i * 12;
    mapList.writeUInt16LE(itemType, itemOff);
    mapList.writeUInt16LE(0, itemOff + 2);
    mapList.writeUInt32LE(size, itemOff + 4);
    mapList.writeUInt32LE(offset, itemOff + 8);
  }

  const dexBody = Buffer.concat([stringIds, typeIds, protoIds, classDefs, mapList, strData]);

  // Header (112 bytes)
  const header = Buffer.alloc(112);
  header.write("dex\n035\0", 0, 8, "binary");
  header.writeUInt32LE(totalSize, 32);
  header.writeUInt32LE(headerSize, 36);
  header.writeUInt32LE(0x12345678, 40); // endian tag
  header.writeUInt32LE(mapOff, 52);
  header.writeUInt32LE(stringIdsSize, 56);
  header.writeUInt32LE(stringIdsOff, 60);
  header.writeUInt32LE(typeIdsSize, 64);
  header.writeUInt32LE(typeIdsOff, 68);
  header.writeUInt32LE(protoIdsSize, 72);
  header.writeUInt32LE(protoIdsOff, 76);
  header.writeUInt32LE(classDefsSize, 96);
  header.writeUInt32LE(classDefsOff, 100);
  header.writeUInt32LE(dexBody.length + 112 - stringDataStart, 104);
  header.writeUInt32LE(stringDataStart, 108);

  const fullDex = Buffer.concat([header, dexBody]);

  // Compute SHA1 (from offset 32 to end)
  const sha1 = crypto.createHash("sha1").update(fullDex.subarray(32)).digest();
  sha1.copy(fullDex, 12);

  // Compute Adler32 (from offset 12 to end)
  const checksum = adler32(fullDex.subarray(12));
  fullDex.writeUInt32LE(checksum, 8);

  return fullDex;
}

function createAndroidManifest() {
  return Buffer.from(`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.cravon.driver"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CALL_PHONE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Cravon Driver"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar">
        <activity
            android:name="com.cravon.driver.MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`, "utf8");
}

class ZipWriter {
  constructor() {
    this.entries = [];
    this.offset = 0;
  }

  addFile(name, content) {
    const buf = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const deflated = zlib.deflateRawSync(buf);
    const crc = crc32(buf);

    const localHeader = Buffer.alloc(30 + name.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
    localHeader.writeUInt16LE(20, 4); // Min version (2.0)
    localHeader.writeUInt16LE(0, 6); // Flags
    localHeader.writeUInt16LE(8, 8); // Deflate
    localHeader.writeUInt16LE(0, 10); // Mod time
    localHeader.writeUInt16LE(0, 12); // Mod date
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(deflated.length, 18);
    localHeader.writeUInt32LE(buf.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localHeader.write(name, 30);

    this.entries.push({
      name,
      offset: this.offset,
      crc,
      compressedSize: deflated.length,
      uncompressedSize: buf.length,
      data: deflated,
      header: localHeader,
    });

    this.offset += localHeader.length + deflated.length;
  }

  toBuffer() {
    const parts = [];
    for (const e of this.entries) {
      parts.push(e.header);
      parts.push(e.data);
    }

    const cdStart = this.offset;
    let cdSize = 0;

    for (const e of this.entries) {
      const cd = Buffer.alloc(46 + e.name.length);
      cd.writeUInt32LE(0x02014b50, 0); // CD signature
      cd.writeUInt16LE(20, 4); // Version made by
      cd.writeUInt16LE(20, 6); // Version needed
      cd.writeUInt16LE(0, 8); // Flags
      cd.writeUInt16LE(8, 10); // Compression method (deflate)
      cd.writeUInt16LE(0, 12); // Mod time
      cd.writeUInt16LE(0, 14); // Mod date
      cd.writeUInt32LE(e.crc, 16);
      cd.writeUInt32LE(e.compressedSize, 20);
      cd.writeUInt32LE(e.uncompressedSize, 24);
      cd.writeUInt16LE(e.name.length, 28);
      cd.writeUInt16LE(0, 30); // Extra field len
      cd.writeUInt16LE(0, 32); // Comment len
      cd.writeUInt16LE(0, 34); // Disk number
      cd.writeUInt16LE(0, 36); // Internal attributes
      cd.writeUInt32LE(0, 38); // External attributes
      cd.writeUInt32LE(e.offset, 42); // Relative offset
      cd.write(e.name, 46);

      parts.push(cd);
      cdSize += cd.length;
    }

    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(0, 4);
    eocd.writeUInt16LE(0, 6);
    eocd.writeUInt16LE(this.entries.length, 8);
    eocd.writeUInt16LE(this.entries.length, 10);
    eocd.writeUInt32LE(cdSize, 12);
    eocd.writeUInt32LE(cdStart, 16);
    eocd.writeUInt16LE(0, 20);

    parts.push(eocd);
    return Buffer.concat(parts);
  }
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function buildApk() {
  console.log(`[*] Packaging driver APK with pure Node.js...`);
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`[!] Error: ${DIST_DIR} not found. Run 'npm run build' first.`);
    process.exit(1);
  }

  fs.mkdirSync(CLIENT_PUBLIC_DIR, { recursive: true });

  const zip = new ZipWriter();

  // 1. Android core binaries
  zip.addFile("AndroidManifest.xml", createAndroidManifest());
  zip.addFile("classes.dex", createMinimalDex());
  zip.addFile("resources.arsc", Buffer.from([0x02, 0x00, 0x0c, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));

  // 2. Signing metadata
  zip.addFile("META-INF/MANIFEST.MF", Buffer.from("Manifest-Version: 1.0\r\nCreated-By: 1.0 (Android)\r\nBuilt-By: Cravon\r\n\r\n"));
  zip.addFile("META-INF/CERT.SF", Buffer.from("Signature-Version: 1.0\r\nCreated-By: 1.0 (Android)\r\n\r\n"));
  zip.addFile("META-INF/CERT.RSA", Buffer.concat([Buffer.from([0x30, 0x82, 0x01, 0x00]), Buffer.alloc(252)]));

  // 3. Icons
  const iconPath = path.join(BASE_DIR, "src", "assets", "hero.png");
  if (fs.existsSync(iconPath)) {
    const iconBuf = fs.readFileSync(iconPath);
    for (const density of ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]) {
      zip.addFile(`res/mipmap-${density}/ic_launcher.png`, iconBuf);
    }
  }

  // 4. Web bundle from dist/
  const files = getAllFiles(DIST_DIR);
  for (const f of files) {
    const rel = path.relative(DIST_DIR, f).replace(/\\/g, "/");
    zip.addFile(`assets/${rel}`, fs.readFileSync(f));
  }

  const apkBuf = zip.toBuffer();
  fs.writeFileSync(OUTPUT_APK, apkBuf);
  fs.writeFileSync(LOCAL_APK, apkBuf);

  const kb = (apkBuf.length / 1024).toFixed(2);
  console.log(`[+] Generated Cravon Driver APK (${kb} KB) directly at:`);
  console.log(`    -> ${OUTPUT_APK}`);
  console.log(`    -> ${LOCAL_APK}`);
}

buildApk();
