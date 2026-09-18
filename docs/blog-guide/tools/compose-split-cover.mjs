/**
 * Compose a split "A vs. B" blog cover: two photographs side by side with
 * typography set in the site's own fonts (Zilla Slab / IBM Plex), drawn as vector
 * paths so no font lookup or AI-rendered lettering is involved.
 *
 *   node compose-split-cover.mjs cover.json
 *
 * Needs: `sharp` (a repo dependency) and `opentype.js` (npm i --no-save opentype.js,
 * or set OPENTYPE_PATH to an install elsewhere). Fonts (OFL), downloaded once into
 * `fontsDir`:
 *   ZillaSlab-Bold.ttf      github.com/google/fonts/raw/main/ofl/zillaslab/ZillaSlab-Bold.ttf
 *   IBMPlexSans-Medium.ttf  github.com/IBM/plex/raw/master/packages/plex-sans/fonts/complete/ttf/IBMPlexSans-Medium.ttf
 *   IBMPlexMono-Medium.ttf  github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf
 *
 * Layout rules (see docs/blog-guide/images.md): output is 1600×893; every piece of
 * text stays inside x 290–1310 so it survives the "Latest" featured-card crop
 * (~1.2:1, which keeps only the middle ~1070 px).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH ?? 'sharp');
const opentype = require(process.env.OPENTYPE_PATH ?? 'opentype.js');

const W = 1600;
const H = 893;
const NAVY = '#0E1220';
const AMBER = '#E8963A';
const CREAM = '#F5F5F0';

const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const font = (file) => opentype.loadSync(path.join(cfg.fontsDir, file));
const SLAB = font('ZillaSlab-Bold.ttf');
const SANS = font('IBMPlexSans-Medium.ttf');
const MONO = font('IBMPlexMono-Medium.ttf');

/** Width of a line at `size`, with kerning and optional tracking (em units). */
function measure(f, text, size, tracking = 0) {
  const glyphs = f.stringToGlyphs(text);
  let x = 0;
  const xs = [];
  glyphs.forEach((g, i) => {
    xs.push(x);
    x += (g.advanceWidth * size) / f.unitsPerEm;
    if (i < glyphs.length - 1) {
      x += (f.getKerningValue(g, glyphs[i + 1]) * size) / f.unitsPerEm + tracking * size;
    }
  });
  return { glyphs, xs, width: x };
}

/** SVG path for one centered line; shrinks to fit `maxWidth` if needed. */
function line(f, text, size, cx, baseline, fill, { tracking = 0, maxWidth = 460, opacity = 1 } = {}) {
  let s = size;
  let m = measure(f, text, s, tracking);
  if (m.width > maxWidth) {
    s = (size * maxWidth) / m.width;
    m = measure(f, text, s, tracking);
  }
  const x0 = cx - m.width / 2;
  const d = m.glyphs.map((g, i) => g.getPath(x0 + m.xs[i], baseline, s).toPathData(2)).join(' ');
  return `<path d="${d}" fill="${fill}" fill-opacity="${opacity}"/>`;
}

/** One side's text block, vertically centred on the image. */
function block(side, cx) {
  const out = [];
  const itemGap = 46;
  const total = 74 + 22 + 30 + side.items.length * itemGap + 70;
  let y = H / 2 - total / 2 + 22; // eyebrow baseline
  out.push(line(MONO, side.eyebrow.toUpperCase(), 21, cx, y, AMBER, { tracking: 0.14 }));
  y += 74;
  out.push(line(SLAB, side.title, 62, cx, y, CREAM));
  y += 22;
  out.push(`<rect x="${cx - 28}" y="${y}" width="56" height="3" rx="1.5" fill="${AMBER}"/>`);
  y += 30;
  for (const item of side.items) {
    y += itemGap;
    out.push(line(SANS, item, 31, cx, y, CREAM, { opacity: 0.94 }));
  }
  y += 70;
  out.push(line(SANS, side.note, 24, cx, y, CREAM, { opacity: 0.78 }));
  return out.join('\n');
}

/**
 * One photo half: scale to the full cover size, take an 800-wide slice centred on
 * `focusX` (0 = left edge, 1 = right edge of the source), then soften it slightly
 * so the photo reads as backdrop and the type stays in front.
 */
async function half(side) {
  const full = await sharp(side.image).resize({ width: W, height: H, fit: 'cover' }).toBuffer();
  const left = Math.min(W / 2, Math.max(0, Math.round((side.focusX ?? 0.5) * W - W / 4)));
  return sharp(full)
    .extract({ left, top: 0, width: W / 2, height: H })
    .blur(cfg.blur ?? 2.2)
    .toBuffer();
}

const leftCx = 800 - 270;
const rightCx = 800 + 270;
const r = 46;
const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY}" stop-opacity="0.52"/>
      <stop offset="0.5" stop-color="${NAVY}" stop-opacity="0.66"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0.54"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#shade)"/>
  <rect x="${W / 2 - 1}" y="0" width="2" height="${H / 2 - r - 14}" fill="${AMBER}" fill-opacity="0.55"/>
  <rect x="${W / 2 - 1}" y="${H / 2 + r + 14}" width="2" height="${H / 2 - r - 14}" fill="${AMBER}" fill-opacity="0.55"/>
  <circle cx="${W / 2}" cy="${H / 2}" r="${r}" fill="${NAVY}" stroke="${AMBER}" stroke-width="2.5"/>
  ${line(MONO, cfg.badge ?? 'VS', 28, W / 2, H / 2 + 10, CREAM, { tracking: 0.08 })}
  ${block(cfg.left, leftCx)}
  ${block(cfg.right, rightCx)}
</svg>`;

const [left, right] = await Promise.all([half(cfg.left), half(cfg.right)]);
await sharp({ create: { width: W, height: H, channels: 3, background: NAVY } })
  .composite([
    { input: left, left: 0, top: 0 },
    { input: right, left: W / 2, top: 0 },
    { input: Buffer.from(overlay), left: 0, top: 0 },
  ])
  .jpeg({ quality: cfg.quality ?? 86, mozjpeg: true })
  .toFile(cfg.out);
console.log(`wrote ${cfg.out}`);
