/**
 * Stamp a promo banner onto an already-composed blog cover.
 *
 *   node stamp-cover-promo.mjs promo.json
 *
 * Separate from `compose-split-cover.mjs` on purpose. A promo is the one piece of
 * a cover that **expires**, so it is applied as a last pass over a finished image
 * that is kept banner-free alongside it (`<slug>.base.jpg`). Taking the promo off
 * when it ends is then a copy, not a re-shoot:
 *
 *   cp src/scripts/assets/blog/<slug>.base.jpg src/scripts/assets/blog/<slug>.jpg
 *   ONLY=<slug> RESEED_COVERS=1 npm run seed:articles
 *
 * That matters because the source photographs behind a composed cover are not kept
 * in the repo — only the composite is — so there is no way back to an un-stamped
 * cover unless one is stored.
 *
 * Needs `sharp` (a repo dependency) and `opentype.js` (npm i --no-save opentype.js,
 * or OPENTYPE_PATH). Fonts as for compose-split-cover.mjs.
 *
 * Text is drawn as vector paths, never by a font lookup and never by an image
 * model: sharp's own text renderer silently falls back to Helvetica on macOS even
 * when handed a fontfile, and generated lettering garbles.
 *
 * Layout: the banner sits top-centre, inside x 290–1310, so it survives the
 * "Latest" featured-card crop (~1.2:1, which keeps only the middle ~1070 px) and
 * the 1200×630 OG crop. See docs/blog-guide/images.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH ?? 'sharp');
const opentype = require(process.env.OPENTYPE_PATH ?? 'opentype.js');

const NAVY = '#0E1220';
const AMBER = '#E8963A';
const CREAM = '#F5F5F0';

const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const font = (file) =>
  // opentype.js 2.x removed loadSync; parse(readFileSync(...)) works on 1.x and 2.x.
  opentype.parse(fs.readFileSync(path.join(cfg.fontsDir, file)).buffer);
const SLAB = font('ZillaSlab-Bold.ttf');
const SANS = font('IBMPlexSans-Medium.ttf');
const MONO = font('IBMPlexMono-Medium.ttf');

/**
 * Serialise a glyph path ourselves instead of using opentype's `toPathData`.
 *
 * `toPathData(n)` rounds via the string trick `+(Math.round(v + "e+" + n) + "e-" + n)`,
 * which yields **NaN** for any coordinate JavaScript stringifies in exponential
 * form. One NaN control point is enough for the rasteriser to abandon the rest of
 * that <path>, and the only symptom is a glyph quietly rendering as a blob near
 * the end of a line — invisible unless you zoom into the output JPEG. That is
 * exactly how "October 24, 2026" shipped as "October 24, 202<blob>".
 *
 * toFixed has no such failure mode, and the guard turns a silent corruption into
 * a crash.
 */
const num = (v) => {
  if (!Number.isFinite(v)) throw new Error(`non-finite path coordinate: ${v}`);
  return v.toFixed(2);
};
const pathData = (p) =>
  p.commands
    .map((c) => {
      switch (c.type) {
        case 'M':
          return `M${num(c.x)} ${num(c.y)}`;
        case 'L':
          return `L${num(c.x)} ${num(c.y)}`;
        case 'C':
          return `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}`;
        case 'Q':
          return `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}`;
        case 'Z':
          return 'Z';
        default:
          throw new Error(`unknown path command: ${c.type}`);
      }
    })
    .join('');

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

/** SVG path for a run of text with its left edge at `x`. */
function runAt(f, text, size, x, baseline, fill, { tracking = 0, opacity = 1 } = {}) {
  const m = measure(f, text, size, tracking);
  const d = m.glyphs.map((g, i) => pathData(g.getPath(x + m.xs[i], baseline, size))).join(' ');
  return { svg: `<path d="${d}" fill="${fill}" fill-opacity="${opacity}"/>`, width: m.width };
}

const src = sharp(cfg.in);
const { width: W, height: H } = await src.metadata();

/* ── Banner geometry ──────────────────────────────────────────────────────────
   One horizontal row inside a filled pill: the number oversized so it carries at
   card size, the label in tracked mono beside it. Sizes are scaled from the
   cover width so this holds if the cover format ever changes. */
const k = W / 1600;
const BIG = (cfg.bigSize ?? 96) * k;
const SMALL = (cfg.smallSize ?? 26) * k;
const TRACK = 0.12;
const PAD_X = 44 * k;
const GAP = 28 * k;
const PILL_H = 120 * k;
const PILL_Y = (cfg.top ?? 74) * k;

const bigW = measure(SLAB, cfg.big, BIG).width;
const smallW = cfg.small ? measure(MONO, cfg.small.toUpperCase(), SMALL, TRACK).width : 0;
const innerW = bigW + (cfg.small ? GAP + smallW : 0);
const pillW = innerW + PAD_X * 2;
const pillX = W / 2 - pillW / 2;

// Cap-height centring: Zilla Slab's caps are ~0.70em, so centre that, not the em box.
const baseline = PILL_Y + PILL_H / 2 + BIG * 0.70 * 0.5;

const big = runAt(SLAB, cfg.big, BIG, pillX + PAD_X, baseline, NAVY);
const small = cfg.small
  ? runAt(MONO, cfg.small.toUpperCase(), SMALL, pillX + PAD_X + bigW + GAP, baseline, NAVY, { tracking: TRACK })
  : { svg: '' };

// Dated note under the pill. Keeping the end date *in the image* is deliberate:
// an undated promo claim goes stale invisibly, a dated one announces itself.
let note = '';
if (cfg.note) {
  const size = (cfg.noteSize ?? 23) * k;
  const m = measure(SANS, cfg.note, size);
  note = runAt(SANS, cfg.note, size, W / 2 - m.width / 2, PILL_Y + PILL_H + 40 * k, CREAM, {
    opacity: 0.88,
  }).svg;
}

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="${pillX.toFixed(1)}" y="${PILL_Y.toFixed(1)}" width="${pillW.toFixed(1)}" height="${PILL_H.toFixed(1)}" rx="${(PILL_H / 2).toFixed(1)}" fill="${AMBER}"/>
  ${big.svg}
  ${small.svg}
  ${note}
</svg>`;

// Text bugs here are invisible until you look at a JPEG, so keep a way to get
// the exact SVG out: DUMP_SVG=/tmp/x.svg node stamp-cover-promo.mjs promo.json
if (process.env.DUMP_SVG) fs.writeFileSync(process.env.DUMP_SVG, overlay);
if (/NaN|undefined/.test(overlay)) throw new Error('overlay SVG contains NaN/undefined — text would render corrupted');

const right = Math.round(pillX + pillW);
if (Math.round(pillX) < 290 * k || right > 1310 * k) {
  console.warn(`! banner spans x ${Math.round(pillX)}–${right}; outside the 290–1310 safe area, it will crop on the featured card`);
}

await sharp(cfg.in)
  .composite([{ input: Buffer.from(overlay), left: 0, top: 0 }])
  .jpeg({ quality: cfg.quality ?? 90, mozjpeg: true })
  .toFile(cfg.out);
console.log(`wrote ${cfg.out}  (banner x ${Math.round(pillX)}–${right})`);
