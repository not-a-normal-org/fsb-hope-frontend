# Blog writing guide

The house rules for a Saver Miles post. They're drawn from `docs/plans/00-context.md`,
`docs/plans/03-products-and-pricing.md` §7, and the rules set while building the first nine posts
(PRs #50, #51/#53, #56, #64, #65). When two rules conflict, the non-negotiables in
`docs/plans/00-context.md` win, then this guide, then [`seo-geo.md`](seo-geo.md).

## 1. Who we're writing for, and how we sound

**Reader:** a US traveler holding transferable points (Amex Membership Rewards, Chase Ultimate
Rewards, Citi ThankYou, Capital One, Bilt). They're smart and busy, and they are burned out on
award charts.

**Voice** (`docs/plans/00-context.md`): *"Precise, competent, quietly premium… Confident, short
sentences, no filler adjectives, no hype words ("game-changing," "revolutionary," "unlock")."*

**The differentiator runs through every post:** a real specialist checks the seat by hand; an
algorithm doesn't. Show it with specifics (what a person verifies, and why a tool can't), not with
slogans.

The "built for the AI era" line in `copy-rewrite.md` is retired. Since PR #55 the positioning is
human-first.

## 2. Hard rules (break one and the post doesn't ship)

- **No em dashes (—), anywhere:** body, title, excerpt, meta, alt. Use commas, colons,
  parentheses, or a new sentence. En dashes in numeric ranges ("2–4", "US–Tokyo") are fine.
- **No unqualified "guarantee".** No fake urgency ("for a limited time", countdowns).
- **No invented statistics or proof.** No customer counts, dollar totals, reviews, "studies show"
  without a source, or outcomes we can't cite.
- **No founder names, no Upwork, no prior company or brand name.** The byline is always
  **Saver Miles Team** (set by the CMS; don't add a byline in the body).
- **Don't advertise products that don't exist yet.**
- **Award prices are typical ranges, not quotes.** Say "at the time of writing", "typically",
  "around". Fact-check every number once, and cite the source in the PR.

## 3. Post skeleton

Every post follows this shape, which the answer-first and FAQ structured-data setup relies on:

1. **Bold answer-first lead:** one paragraph of ~50–75 words. It answers the post's core question
   outright in the first sentence, then gives the two or three facts that matter. It must make sense
   on its own when an AI engine quotes it.
2. **`## Key takeaways`:** 4 bullets, each a full, standalone sentence.
3. **Narrative intro:** one or two paragraphs that set the scene.
4. **H2 sections** that follow the reader's actual questions. Use `###` only inside a section.
5. **"Where we come in"** section: the honest version of what a specialist does here. Link
   [`/how-it-works`](/how-it-works) or [`/pricing`](/pricing).
6. **`## Frequently asked questions`** with 4 `###` questions, phrased the way people actually ask
   them. **Each answer is exactly one self-contained paragraph.** The FAQPage JSON-LD takes every
   paragraph after a `###` until the next heading as the answer.
7. **Closing CTA under its own `## ` heading** (for example "Start with a free points audit").
   Never put a paragraph after the last FAQ answer without a heading first, or it leaks into that
   answer's structured data. That happened in four posts until PR #69.

**Length:** about 1,800–2,000 words. The seed's dry run warns outside 1,500–2,400.

## 4. Links

- **Internal:** the pillar ([how to fly free with credit card points](/blog/how-to-fly-for-free-with-credit-card-points)),
  2–4 sibling posts where they genuinely help, and at least one product page. Descriptive anchor
  text only, never "click here". Only link slugs that exist in `ORDER`.
- **Main CTA:** "Get a free points audit" / "start with a free points audit", linking to
  [`/individual`](/individual). Keep "free" mostly to this CTA.
- **External:** sparingly. Use primary sources (program or issuer pages, press releases) when a
  claim needs one.

## 5. News and deals posts (category `deals`)

Use this when a program change, new partner or sweet spot is the hook (for example the Condor post,
PR #56):

- Fact-check against the **press release plus at least two reputable loyalty outlets**.
- State the date the change took effect, and make the post still true after the news cycle ends.
- Keep the honest caveats in: surcharges, phantom space on new partners, a weak cabin, thin
  networks.
- Bridge back to evergreen posts (transfer partners, phantom space, surcharges).

## 6. Front-matter

```
SLUG: kebab-case-slug                 (must match the file name, and be added to the TOP of ORDER)
CATEGORY: guides | deals              (anything else is refused by the seed)
TITLE: Human title, ~50–65 chars      (the H1 on the page)
EXCERPT: ≤200 chars                   (cards, RSS, llms.txt)
META_TITLE: ≤46 chars                 (" | Saver Miles" is appended → ≤60 total)
META_DESCRIPTION: ~140–155 chars      (snippet text; plain, specific, no quotes needed)
COVER_ALT: ≤125 chars                 (describes the image; see images.md)
---BODY---
```

One `KEY: value` per line. The header ends at the line `---BODY---`.

## 7. The markdown the seed understands

`src/scripts/seed-articles.ts` converts a restricted markdown into the CMS rich text. Only these
render:

| Write | Renders as |
|---|---|
| `## Heading` / `### Heading` | h2 / h3 (no h1: the title is the h1) |
| blank-line-separated lines | paragraphs (consecutive lines join into one) |
| `- item` | bullet list |
| `1. item` | numbered list |
| `> text` | blockquote (one line only) |
| `**bold**`, `*italic*`, `[text](/url)` | inline formatting and links |
| `![alt](<slug>-<descriptor>.jpg "caption")` | an in-article image, on its own line (see [`images.md`](images.md)) |

Not supported: tables, code, nested lists, h1, HTML.

**Traps:**
- A paragraph line that happens to start with `- ` or `1. ` turns into a list.
- A lone `*` (for example "5*") starts italics. Rephrase.
- A `)` inside a URL ends the link early.
- An image directive has to be alone on its line, or it is swallowed into the paragraph and rendered
  as a stray `!` plus a broken link.
- `&amp;` and other entities are decoded; plain `&` also works.

Run the dry run (see [`publishing.md`](publishing.md)). It prints the outline, word count, em-dash
count, and FAQ questions with the last answer, so you can check the structure before anything is
published.
