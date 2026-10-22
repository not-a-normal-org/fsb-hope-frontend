/**
 * Compare every post's committed cover against the one production actually serves.
 *
 *   node docs/blog-guide/tools/audit-cover-drift.mjs [--base https://www.savermiles.com]
 *
 * Why this exists: changing `<slug>.jpg` in the repo does **nothing** to a live post.
 * A plain `npm run seed:articles` reuses the cover media already attached and never
 * uploads the new file; only `RESEED_COVERS=1` replaces it. So a cover can be fixed,
 * reviewed, merged, and still never ship, with the repo and the site disagreeing and
 * nothing anywhere complaining.
 *
 * That is not hypothetical. PR #64 replaced nine AI-looking covers with real
 * photography in September 2026; the reseed never ran, and the rejected images stayed
 * live for a month while the repo looked correct.
 *
 * Reports one line per post:
 *   identical    bytes match — the repo file is what production serves
 *   recompressed same picture, different bytes (re-encoded somewhere in the pipeline)
 *   DIFFERENT    a different picture: either the repo never shipped, or production was
 *                changed without committing the file
 * Exits non-zero if anything is DIFFERENT, so it can gate a release.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH ?? 'sharp');

const baseArg = process.argv.indexOf('--base');
const BASE = baseArg > -1 ? process.argv[baseArg + 1] : 'https://www.savermiles.com';
const ASSETS = path.resolve('src/scripts/assets/blog');

/** Downscale to a fixed grid and compare luma — tells "same picture" from "different picture". */
async function meanDiff(a, b) {
  const norm = (buf) => sharp(buf).resize(160, 89, { fit: 'fill' }).greyscale().raw().toBuffer();
  const [x, y] = await Promise.all([norm(a), norm(b)]);
  let sum = 0;
  for (let i = 0; i < x.length; i++) sum += Math.abs(x[i] - y[i]);
  return sum / x.length;
}

const slugs = readdirSync(ASSETS)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .filter((s) => existsSync(path.join(ASSETS, `${s}.jpg`)))
  .sort();

let drifted = 0;
console.log(`Comparing ${slugs.length} covers against ${BASE}\n`);

for (const slug of slugs) {
  const local = path.join(ASSETS, `${slug}.jpg`);
  const page = await fetch(`${BASE}/blog/${slug}`);
  if (!page.ok) {
    console.log(`  ?  ${slug.padEnd(46)} post returned ${page.status}`);
    continue;
  }
  const html = await page.text();
  // The post page renders the ORIGINAL upload; skip Payload's -WxH size variants.
  const url = [...html.matchAll(new RegExp(`https://[^"&]*/media/${slug}[^"&]*\\.jpg`, 'g'))]
    .map((m) => m[0])
    .find((u) => !/-\d+x\d+\.jpg$/.test(u));
  if (!url) {
    console.log(`  ?  ${slug.padEnd(46)} no cover URL on the live page`);
    continue;
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`  ?  ${slug.padEnd(46)} cover returned ${res.status}`);
    continue;
  }
  const live = Buffer.from(await res.arrayBuffer());
  const repo = readFileSync(local);

  if (repo.equals(live)) {
    console.log(`  ok ${slug.padEnd(46)} identical`);
    continue;
  }
  const diff = await meanDiff(repo, live);
  if (diff < 2) {
    console.log(`  ~  ${slug.padEnd(46)} recompressed (same picture, Δ${diff.toFixed(2)})`);
  } else {
    drifted++;
    console.log(`  !! ${slug.padEnd(46)} DIFFERENT PICTURE (Δ${diff.toFixed(2)})  ${path.basename(url)}`);
  }
}

if (drifted) {
  console.log(
    `\n${drifted} cover(s) differ from production.\n` +
      `If the repo file is the one you want live:  ONLY=<slug> RESEED_COVERS=1 npm run seed:articles\n` +
      `If production is right and the repo is stale: download the live file over the asset and commit it.`,
  );
  process.exit(1);
}
console.log('\nNo cover drift.');
