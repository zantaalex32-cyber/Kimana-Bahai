const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Exact SVG representation of the user's uploaded logo
// Colors extracted directly from c712a31fadd503c0621a97ade93d7d17.jpg
const SVG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="soft-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background circle (optional soft tint matching the image) -->
  <rect width="512" height="512" rx="128" fill="#F0F4FA" />

  <g transform="translate(0, 5)">
    <!-- 1. Top Yellow Outer Arc -->
    <!-- path from ~330 deg to 35 deg, outer radius ~215, inner ~168 -->
    <path d="M 208 67 
             A 210 210 0 0 1 354 135 
             L 332 170 
             A 168 168 0 0 0 216 116 Z" 
          fill="#ECB834" />

    <!-- 2. Top-Left Purple Arc -->
    <!-- from ~280 deg to ~335 deg -->
    <path d="M 125 158 
             A 170 170 0 0 1 220 86 
             L 220 162 
             A 108 108 0 0 0 168 206 Z" 
          fill="#61418E" />

    <!-- 3. Left Blue Arc (Large Wedge) -->
    <!-- from ~215 deg to ~285 deg, radius ~185 -->
    <path d="M 132 165
             L 182 203
             A 108 108 0 0 0 178 300
             L 142 344
             A 180 180 0 0 1 109 238
             A 180 180 0 0 1 132 165 Z" 
          fill="#5293CE" />

    <!-- 4. Left-Bottom Small Dark Purple Wedge -->
    <path d="M 152 260
             A 108 108 0 0 0 198 328
             L 170 348
             A 140 140 0 0 1 152 260 Z" 
          fill="#543B77" />

    <!-- 5. Bottom Olive / Lime Green Arc -->
    <!-- from ~115 deg to ~220 deg -->
    <path d="M 166 322
             A 172 172 0 0 0 326 374
             L 302 316
             A 108 108 0 0 1 198 284 Z" 
          fill="#A1BA41" />

    <!-- 6. Right Main Orange Arc -->
    <!-- from ~340 deg to ~110 deg -->
    <path d="M 220 102
             A 168 168 0 0 1 382 238
             A 168 168 0 0 1 382 242
             L 364 242
             A 108 108 0 0 0 256 137
             L 220 102 Z" 
          fill="#E25A27" />

    <!-- 6b. Inner Orange Ring section extending down -->
    <path d="M 364 242
             A 108 108 0 0 1 346 312
             L 396 354
             A 168 168 0 0 0 382 242 Z"
          fill="#E25A27" />

    <!-- 7. Outer Golden Amber Flange / Tab -->
    <!-- on the middle-to-lower right, ~70 deg to ~125 deg -->
    <path d="M 346 238
             L 402 238
             A 200 200 0 0 1 354 354
             L 318 316
             A 155 155 0 0 0 346 238 Z" 
          fill="#E59E27" />

    <!-- 8. Red angled tail block of the "Q" extending downwards -->
    <path d="M 272 334 
             L 338 318 
             L 375 385 
             C 375 395, 368 408, 355 412
             L 288 420
             C 278 420, 275 412, 274 402
             L 272 334 Z" 
          fill="#DE4337" />

    <!-- 9. Pure White Annular Ring with White Gap for the tail -->
    <path d="M 256 137
             A 108 108 0 1 1 255.9 137
             M 256 187
             A 58 58 0 1 0 256.1 187 Z"
          fill="#FFFFFF" />

    <!-- White cutout / canal leading to the tail -->
    <polygon points="288,270 326,308 354,354 316,334" fill="#FFFFFF" />

    <!-- 10. Center Solid Coral Red Circle -->
    <circle cx="256" cy="245" r="50" fill="#DE4337" />
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  const assetsDir = path.resolve(__dirname, '../src/assets/images');

  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  // 1. Write public/icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), SVG_LOGO);
  fs.writeFileSync(path.join(assetsDir, 'app_logo.svg'), SVG_LOGO);
  console.log('Written icon.svg');

  const svgBuffer = Buffer.from(SVG_LOGO);

  // 2. Generate favicon.png (64x64)
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Written favicon.png');

  // 3. Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Written apple-touch-icon.png');

  // 4. Generate pwa-192x192.png (192x192)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Written pwa-192x192.png');

  // 5. Generate pwa-512x512.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Written pwa-512x512.png');

  // 6. Generate pwa-maskable-512x512.png (padded by 15% safe zone on #F0F4FA background)
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#F0F4FA'
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Written pwa-maskable-512x512.png');

  // 7. Generate raster logo in assets for AppLogo.tsx
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(assetsDir, 'kimana_cluster_logo.png'));
  console.log('Written kimana_cluster_logo.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
