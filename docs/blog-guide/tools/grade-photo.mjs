/**
 * Grade a photograph into the blog's house look and export it at cover size.
 *
 *   node grade-photo.mjs grade.json
 *
 * Why this exists: when the image account has no credits, covers and body images
 * come from free-licence stock (Pexels / Unsplash) instead of generation. Stock
 * arrives in whatever grade the photographer chose, so it needs pulling toward the
 * set's look before it can sit next to the existing posts: warm amber highlights,
 * deep navy shadows, slightly held-back saturation (see images.md §1).
 *
 * It is a grader, not a retoucher. It will not remove a logo or fix a bad frame;
 * reject those at selection time instead.
 *
 * Config keys (all optional except `in` and `out`):
 *   in, out        source and destination paths
 *   width, height  output size, default 1600x893 (the cover format)
 *   position       crop anchor for the cover fit: centre | top | bottom | left | right
 *   saturation     1 = unchanged. 0.92 is the house default, slightly held back
 *   brightness     1 = unchanged
 *   contrast       S-curve strength via linear(); 1 = unchanged, 1.06 is gentle
 *   warmth         0-1, amber soft-light pass that warms the highlights
 *   shadowNavy     0-1, navy pass that pushes the shadows toward the brand navy
 *   vignette       0-1, radial darkening at the corners
 *   sharpen        true to apply a light output sharpen after resizing
 *   quality        JPEG quality, default 86 (drop to 80 if the file runs over 400 KB)
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH ?? 'sharp');

const NAVY = '#0E1220';
const AMBER = '#E8963A';

const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const W = cfg.width ?? 1600;
const H = cfg.height ?? 893;
const q = cfg.quality ?? 86;

/** A full-frame solid, used as a blend layer. */
const solid = async (hex, alpha) =>
  sharp({ create: { width: W, height: H, channels: 4, background: { ...hexToRgb(hex), alpha } } })
    .png()
    .toBuffer();

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Radial vignette: transparent in the middle, navy at the corners. */
const vignette = async (strength) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
       <defs>
         <radialGradient id="v" cx="50%" cy="50%" r="75%">
           <stop offset="55%" stop-color="${NAVY}" stop-opacity="0"/>
           <stop offset="100%" stop-color="${NAVY}" stop-opacity="${strength.toFixed(3)}"/>
         </radialGradient>
       </defs>
       <rect width="${W}" height="${H}" fill="url(#v)"/>
     </svg>`,
  );

const base = sharp(cfg.in)
  .resize({ width: W, height: H, fit: 'cover', position: cfg.position ?? 'centre' })
  .modulate({ saturation: cfg.saturation ?? 0.92, brightness: cfg.brightness ?? 1 });

// linear(a, b) is a straight gain/offset. Pivoting around mid-grey keeps the
// midtones put while the ends separate, which is what reads as contrast.
const c = cfg.contrast ?? 1;
const graded = c === 1 ? base : base.linear(c, -(128 * (c - 1)));

const layers = [];
if (cfg.warmth) layers.push({ input: await solid(AMBER, cfg.warmth), blend: 'soft-light' });
if (cfg.shadowNavy) layers.push({ input: await solid(NAVY, cfg.shadowNavy), blend: 'soft-light' });
if (cfg.vignette) layers.push({ input: await vignette(cfg.vignette), blend: 'over' });

let out = graded.composite(layers);
if (cfg.sharpen) out = out.sharpen({ sigma: 0.6 });

await out.jpeg({ quality: q, mozjpeg: true }).toFile(cfg.out);

const { size } = fs.statSync(cfg.out);
const kb = Math.round(size / 1024);
console.log(`wrote ${cfg.out}  ${W}x${H}  ${kb} KB`);
if (kb > 400) console.warn(`! ${kb} KB is over the 400 KB guide limit; lower "quality" (currently ${q})`);
