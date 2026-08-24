# Blog cover images — the spec

**Upload every post cover at `1600 × 1000` (16:10), JPEG, under ~400 KB.**
That single file feeds all four places a cover appears. Everything below is why.

---

## The short version

| | |
|---|---|
| **Resolution** | **1600 × 1000 px** |
| **Aspect ratio** | **16:10** (1.6:1) |
| **Format** | JPEG for photos; PNG only for flat graphics/screenshots |
| **File size** | aim ≤ 400 KB, hard ceiling ~800 KB |
| **Safe zone** | keep the subject inside the middle **60% horizontally**, and 10% clear of every edge |

Don't upload smaller than 1600 wide. Payload derives every render *down* from the
original and **never upscales**, so a 900 px upload permanently yields a soft
featured card. Don't upload much larger either — the post page serves the
original, so a 4000 px file is a slow page for no visible gain.

## Where a cover actually gets used

`src/collections/Media.ts` generates four renders on upload. Each surface picks
the smallest one that still covers its slot (`src/lib/blog.ts` → `toBlogCard`).

| Surface | Render used | Drawn at | Crop |
|---|---|---|---|
| `/blog` grid card (3-up) | `card` — 768w | 352 × 220 CSS px | `object-cover` to **16:10** — none, if you uploaded 16:10 |
| `/blog` **“Latest” featured card** | `wide` — 1600w | ~552 × 340–460 CSS px | `object-cover` to whatever height the text column ends up — **this one crops** |
| `/blog/[slug]` hero | the original | 624 CSS px wide | **none** — rendered at its native ratio, uncropped |
| CMS list view | `thumbnail` — 400w | small | none |

## The one gotcha: the featured card crops

The grid card is a fixed 16:10 box, so a 16:10 upload lands in it untouched.

The featured card is different. It's the left half of a two-column card
(`BlogIndex.tsx` → `FeaturedCard`), and at `md`+ it **stretches to match the
height of the text column beside it** — roughly 552 × 340–460 px, i.e. somewhere
between 1.6:1 and 1.2:1 depending on how long the title and excerpt run. Because
the box is *taller* than 16:10, `object-cover` trims the **left and right** —
up to about 20% off each side on a long excerpt.

So the rule is: **compose centred.** A subject in the middle 60% survives every
crop. A subject at the left edge, or text baked into the image near an edge, will
get sliced off on the featured card only — which is the card that sits at the top
of `/blog`, so it's the one people see first.

There is no crop on the post page itself, so a 16:10 image also reads correctly
as an editorial hero.

## Social / Open Graph

Cover images do **not** automatically become the social preview. A post's OG
image is either:

1. the SEO tab's **Meta Image**, if an author sets one, or
2. the auto-generated branded card at `/blog/<slug>/og` (1200 × 630, the post
   title on the brand background) — the default, and usually the right answer.

If you do want the cover to be the social image, set it in the SEO tab as well;
the `og` render (1200 × 630, centre crop) exists for exactly that.

## Alt text

`alt` is a **required** field on Media. Describe what's in the image, not the
post — the post title is already adjacent to it in every layout.

## If you change the sizes

Adding or resizing an entry in `Media.imageSizes` only affects **future**
uploads. Existing images keep the renders they were created with (`toBlogCard`
falls back to the next-smallest render, then to the original, so nothing breaks —
it just isn't crisp). Re-uploading the file regenerates the set.
