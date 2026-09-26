# Blog cover images

How we make, check, and ship a post's hero image. Every cover is one file,
`src/scripts/assets/blog/<slug>.jpg`, that the seed uploads to the CMS.

**The spec: 1600 × 893 px (16:9), JPEG at quality ~86, aim for ≤ 400 KB (hard ceiling ~800 KB),
subject and any text in the middle 60%, no logos, never AI-rendered text.**

Log every prompt you run in [`image-prompts.md`](image-prompts.md).

---

## 0. Pick the cover type first

A cover has to tell the reader what the post is about at a glance, not just set a mood.

| Post type | Cover | Example |
|---|---|---|
| Comparison, "A vs. B" or decision posts | **Explanatory split cover:** two photo halves, each labeled with its option and 2–3 concrete examples, with a "VS" badge between them. See [Explanatory covers](#explanatory-covers-text-overlay). | `travel-portal-vs-transfer-partners` |
| Guides about one idea, news, destinations | **Editorial photo:** one subject tied to the article's single idea (section 1) | `phantom-award-space-why-seats-vanish`, `qantas-points-condor-reward-seats` |

When in doubt, go explanatory. A beautiful image that doesn't say what the post is about is the
wrong image. On 2026-09-19 the owner rejected the portal post's first cover (a weekender bag at a
forking corridor) as "not relevant". The fix was to show the two options, with examples and labels.

## 1. The look

Realistic editorial luxury-travel photography, like a spread in a travel magazine:

- **Real photography, not illustration.** Warm natural light, shallow depth of field, real
  textures (leather, linen, brushed metal, marble, wood), fine film grain.
- **A consistent grade across the set:** warm amber highlights and deep navy shadows. That matches
  the site palette, and it's what makes nine different subjects read as one blog.
- **Quiet luxury, not glitz.** Premium cabins, lounges, travel objects, destinations at golden or
  blue hour.
- **No logos, watermarks, identifiable airline liveries or readable screens, and no text from
  the image model.** Labels are added afterwards in our own fonts; see
  [Explanatory covers](#explanatory-covers-text-overlay).
- **Prefer no faces.** Hands, objects and empty premium seats photograph better, and AI faces are
  the fastest giveaway.

This is a deliberate, scoped exception to `docs/plans/01-brand-design-system.md` §6 ("No stock
travel photography"). The owner asked for realistic luxury covers in PR #64. Marketing pages and the
UI keep the §6 rule. Even on the blog, skip the stock clichés: no wing-out-the-window shots, no
empty sunset beaches, no airplane silhouette against a sunset.

### What reads as "AI-made" (reject on sight)
- Flat vector or illustrated styles, or glossy CGI renders.
- Perfect bilateral symmetry, especially cabin rows that recede into a vanishing point.
- Glowing "network" lines or world maps.
- Garbled lettering, anywhere (passports, signs, screens, labels).
- Warped hands, melted objects, impossible reflections, and seats or windows that don't line up.

## 2. How to generate (higgs MCP)

These are the settings that worked for the current nine covers.

| Setting | Value |
|---|---|
| Tool | `mcp__claude_ai_higgs__generate_image_batch` (several prompts) or `generate_image` (one prompt) |
| Model | `nano_banana_pro` (the backend reports it as `nano_banana_2`) |
| Aspect | `16:9` (native output is 2752 × 1536 PNG, ~10 MB) |
| Billing | `use_unlim: false` (credits; omitting it can trigger an interactive question) |
| Concurrency | **4 jobs at a time.** More gives `429 rate_limit_reached`; resubmit the failures once jobs finish |
| Polling | `jobs_wait` with the returned job IDs; each job takes about 30 to 120 s |
| Result | A `result_url` on CloudFront. **Download it straight away** with `curl` |

Check `mcp__claude_ai_higgs__balance` before a batch. Budget one batch of 3 or 4 concepts, plus at
most one refinement round.

### Content-filter traps
Alcohol words ("champagne", "wine", "cocktail") have failed generation. Say "sparkling water",
"a glass", or leave drinks out.

### Prompt template

```
Editorial travel-magazine photograph: <ONE clear subject tied to the article>, <setting>,
<light: golden hour / blue hour / soft morning window light>, <2–3 tactile props>.
Shot on full-frame camera, <35mm for scenes | 50mm for desks & hands | 85mm for objects> lens,
natural available light, shallow depth of field, fine film grain, photorealistic,
warm amber highlights and deep navy shadows, Conde Nast Traveler aesthetic.
No text, no logos, no watermark, no people's faces.
```

Tips:
- **Tie the subject to the article's one idea**, not to "travel" in general. Some past examples:
  a lounge window with a fuel bowser under the wing (fuel surcharges); a specialist's hands routing
  flights in a notebook (human vs. tools); an empty first-class suite (phantom space).
- **Keep screens out of focus** ("screen content indistinct and out of focus") so no fake UI text
  appears.
- **Put the subject in the center.** Say "centered composition" if the concept tends to drift to
  an edge.

## 3. Export

```bash
# preview for review (Read the jpg to look at it)
sips -s format jpeg -Z 1000 -s formatOptions 80 in.png --out preview.jpg

# crop checks (from a 1600×893 export): 16:10 grid card, ~1.2:1 worst-case featured card
sips -c 893 1429 cover.jpg --out crop-16x10.jpg
sips -c 893 1072 cover.jpg --out crop-featured.jpg

# final file: 1600 wide, quality 86 (drop to 80 if over ~400 KB)
sips -s format jpeg -Z 1600 -s formatOptions 86 in.png --out src/scripts/assets/blog/<slug>.jpg
```

Keep the raw PNGs and previews in a scratch folder. Only the final JPEG goes in the repo.

## 4. Review checklist (before it ships)
1. It reads as a real photograph at 100% zoom: no AI tells from the list above.
2. No logos, liveries, readable screens or model-rendered text. Any text is the composed
   overlay, and it matches the article.
3. The subject survives the **16:10** and **~1.2:1** crop previews.
4. The grade matches the set: put it next to two existing covers and look.
5. It's about *this* article; a reader could guess the topic from it.
6. The file is 1600 × 893 and ≤ 400 KB (≤ 800 KB at most).
7. `COVER_ALT` is written: it describes what is **in the image**, ≤ 125 characters, and doesn't
   start with "Image of".

## Explanatory covers: text overlay

Text goes on a cover **only** through
[`tools/compose-split-cover.mjs`](tools/compose-split-cover.mjs), never through the image
prompt. The model garbles lettering (an older cover had a misspelled "PASSPORT") and can't use our
fonts.

1. **Generate each half separately** as a normal editorial photo **with no text**, using the
   section 2 template. For the portal post, the portal half was a laptop on a booking page with the
   screen out of focus, and the partners half was the plain, unbranded tails of several airlines.
   One batch of 4 (2 options per side) is enough.
2. **Write a config** like
   [`tools/travel-portal-vs-transfer-partners.cover.json`](tools/travel-portal-vs-transfer-partners.cover.json).
   Each side gets an eyebrow, a title, 2–3 examples and a one-line note, plus `focusX` to choose
   which 800 px slice of its photo to use.
3. **Get the fonts once** (the URLs are in the script header), then run:
   ```bash
   npm i --no-save opentype.js
   node docs/blog-guide/tools/compose-split-cover.mjs docs/blog-guide/tools/<slug>.cover.json
   ```
4. **Review the output and both crop previews** (section 3). The script keeps all text inside
   x 290–1310, the featured-card safe area.

Rules:
- **Names go in as plain text, never logos.** Program and issuer names are fine (the article
  names them too). Generated or pasted logos are not.
- **Cover copy must match the article.** "Usually about 1¢ a point" mirrors the article's portal
  section. Don't put a claim on the cover that isn't in the post.
- **Site fonts only.** Zilla Slab Bold for titles, IBM Plex Sans Medium for examples, IBM Plex
  Mono for eyebrows. Cream `#F5F5F0` and amber `#E8963A` on a navy `#0E1220` scrim.
- **Alt text includes the words on the image**, because screen readers can't read pixels.
- **Gotcha:** `sharp`'s built-in text renderer silently falls back to Helvetica on macOS even with
  `fontfile` set (a fontconfig issue). That's why the script draws each glyph as a vector path with
  opentype.js.
- **Gotcha:** opentype's `toPathData(n)` rounds by string concatenation and returns **NaN** for any
  coordinate JavaScript stringifies in exponential form. One NaN is enough for the rasteriser to
  abandon the rest of that `<path>`, and the only symptom is a glyph near the end of a line
  rendering as a blob — which is how "October 24, 2026" was nearly shipped as "October 24, 202▪".
  Both scripts now serialise path commands themselves and refuse to write an SVG containing NaN.
  **Always zoom into the finished JPEG and read every word before shipping it.**

## Promo banners (a number that expires)

A discount or bonus is the one thing on a cover with an end date, so it is stamped on as a **last
pass** by [`tools/stamp-cover-promo.mjs`](tools/stamp-cover-promo.mjs) over a finished cover that is
kept banner-free beside it as `<slug>.base.jpg`:

```bash
node docs/blog-guide/tools/stamp-cover-promo.mjs docs/blog-guide/tools/<slug>.promo.json
```

Taking it off when the promo ends is then a copy, not a re-shoot:

```bash
cp src/scripts/assets/blog/<slug>.base.jpg src/scripts/assets/blog/<slug>.jpg
ONLY=<slug> RESEED_COVERS=1 npm run seed:articles
```

Keeping the base matters because **the source photographs behind a composed cover are not kept in
the repo** — only the composite is — so without one there is no way back to an un-stamped cover.

Rules:
- **Put the end date in the image, under the number.** An undated promo claim goes stale invisibly;
  a dated one announces itself. Add a dated reminder to the blog follow-ups note as well.
- **The number is the only oversized thing.** One filled amber pill, top-centre, inside the
  x 290–1310 safe area so it survives the featured-card and OG crops.
- **The alt text has to change too**, because the cover now carries words.

## 5. Alt text

Set `COVER_ALT:` in the post's front-matter. The seed writes it to the Media `alt` field (which is
required). Describe what's in the picture, because the post title already sits next to it
everywhere. For an explanatory cover, include the words it shows, for example "Travel portal vs.
transfer partners: Chase, Amex and Capital One Travel beside United, Aeroplan and Virgin Atlantic". Without `COVER_ALT`, the seed falls back to `Editorial photograph for "<title>"`,
which is valid but less useful.

---

## Body images (in the middle of an article)

A long post earns 2 or 3 images inside the body. Same look and same rules as a cover, with a few
extras.

**Write them in the markdown** on their own line:

```
![Alt text describing the picture](<slug>-<descriptor>.jpg "Optional caption")
```

- The file lives beside the post in `src/scripts/assets/blog/` and **must** be named
  `<slug>-<descriptor>.jpg`. The seed refuses anything else: the prefix is what scopes its cleanup
  to images this post owns, so it never deletes something added by hand in `/cms`.
- **Alt is required** and describes the picture. The caption is optional, shows under the image, and
  is a place for a point the picture can't make on its own. Keep alt ≤125 and caption ≤160 chars.
- **Size them like covers:** 1600 px wide, 16:9, ≤400 KB. The column is 672 px, so 1600 covers a
  retina screen.
- **Place them between sections**, never inside the FAQ (the dry run warns). Two images with no
  prose between them is a smell.
- **Facts belong in the prose, not only in a picture.** Nobody can search, quote or screen-read a
  number that exists only inside a JPEG.

**How it works:** the seed uploads each file once and writes a lexical `upload` node carrying a
stable node id. Re-running reuses the same media rather than uploading duplicates; an image you
remove from the markdown has its media deleted after the post saves. `RESEED_COVERS=1` re-uploads
every image a post owns, cover and body, and deletes what it replaced.

`ONLY=<slug> SEED_DRY_RUN=1 npm run seed:articles` lists each body image with its dimensions, file
size, alt and caption, and the section it follows, so you can check placement before publishing.

## Reference: where a cover is used

`src/collections/Media.ts` generates four renders on upload. Each surface picks the smallest one
that still covers its slot (`src/lib/blog.ts` → `toBlogCard`). Payload never upscales, so never
upload narrower than 1600 px. Much wider only slows the post page, which serves the original.

| Surface | Render used | Drawn at | Crop |
|---|---|---|---|
| `/blog` grid card (3-up) | `card` (768w) | 352 × 220 CSS px | `object-cover` to 16:10: trims ~5% off each side of a 16:9 cover |
| `/blog` "Latest" featured card | `wide` (1600w) | ~552 × 340–460 CSS px | `object-cover` to the text column's height (1.6:1 to ~1.2:1): trims up to ~17% off each side |
| `/blog/[slug]` hero | the original | 624 CSS px wide | none, native ratio |
| CMS list view | `thumbnail` (400w) | small | none |

**Why we keep 16:9 instead of the old 1600 × 1000 (16:10) spec:** 16:9 is the model's native
ratio, all nine existing covers are 1600 × 893, and a centered subject survives both crops above.
Cropping every export to 16:10 would throw away width for nothing, and would make new covers sit
differently from the existing set on the post page.

### Social / Open Graph
A cover does not automatically become the social preview. A post's OG image is either the SEO
tab's **Meta Image**, if an author sets one in `/cms`, or the auto-generated branded card at
`/blog/<slug>/og` (1200 × 630). The branded card is the default and usually the right choice.

### If you change the sizes
Adding or resizing entries in `Media.imageSizes` only affects future uploads. Existing images keep
their renders, and `toBlogCard` falls back to the next render down. To regenerate them, re-upload:
`RESEED_COVERS=1 ONLY=<slug> npm run seed:articles` (see [`publishing.md`](publishing.md)).
