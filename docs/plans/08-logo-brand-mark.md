# Logo & Wordmark — LOCKED

Status: **Locked.** Do not propose alternate logo concepts.

> **Superseded construction (2026-08):** the lockup is now the supplied artwork
> (`public/savermiles-logo.png`), not drawn in code — an explicit decision by Moon.
> Sections 1 and 2 below are updated to match; the discipline rules (green is
> logo-only, clear space, minimum size) are unchanged and still binding. The
> previous code-drawn construction is kept at the end of §1 for reference.

## 1. Construction

**Wordmark:** "SaverMiles," one word, set in a custom heavy slab with a dark
outline — part of the supplied artwork, NOT a webfont. It is deliberately
chunkier than the site's Zilla Slab display face. Because the letterforms are
artwork, the lockup ships as a raster asset; redrawing it in Zilla Slab was tried
and rejected (it reads as a different logo).

**Asset:** `public/savermiles-logo.png` — trimmed to the artwork's bounds
(640×198, ~3.23:1), real alpha channel, so it sits on Dark and Light alike; the
dark outline is what keeps the cream lettering legible on light surfaces. Sized
in `em` by `src/components/site/Logo.tsx` (height `1.5em`) so it scales with the
caller's `text-*` class. Social exports, all generated from the same asset on the
brand base: `og-image.png` / `twitter-image.png` (1200×630 link previews),
`img/savermiles-avatar.png` (1000×1000 profile picture),
`img/rsz_savermiles-avatar.png` (267×208) and `img/nav_icon.png` (512×512).

**Underline mark:** a rounded arc beneath the wordmark ending in a **plane** at
the upper right, with an **arrowhead** at the left — it reads as a return flight
path as well as a smile. Part of the same artwork.

**Underline mark:** a rounded arc beneath the wordmark, curved enough to read as a smile, not a subtle flight-path line. This is the one signature graphic element of the mark.

Target proportions: the arc is **~64% of the wordmark width** (centered under it, not full-width) with **~15% curve depth** (sag ÷ chord), sitting close under the text. A full-width, shallow arc reads as a flight path, not a smile — do not flatten it back toward that; and do not deepen it much past ~18% (deeper reads as a bowl, not a smile). Options were reviewed in `logo-samples/index.html`; "Medium · Close" was chosen.

Previous code-drawn construction (retired — kept for reference only):

```html
<svg width="100" height="21" viewBox="0 0 100 21">
  <path d="M4 3 Q50 31 96 3" stroke="#0E7C50" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</svg>
```

## 2. Color rules

- **Wordmark text color** follows the standard mode-aware ink tokens from `01-brand-design-system.md` — `--sm-ink` in Dark/Light, `--sm-mono-ink` in Mono. No separate logo-specific text color.
- **Arc color is a hardcoded exception: `#74F12C` (bright lime), baked into the artwork and therefore identical in every mode.** This is the one deliberate break from "no green anywhere in the brand." It does not read from `--sm-accent` or any mode token. (The previous code-drawn arc used `#0E7C50` Emerald; that value is retired with the drawn construction.)
- **This is the deepest green that reliably survives all three modes.** Deeper greens (forest, hunter) were tested and rejected — they lose visible contrast against the Dark/Mono navy-black backgrounds, to the point of nearly disappearing. Do not darken this value without re-testing contrast on the actual Dark and Mono backgrounds, not just in isolation on white.
- **This green is logo-only.** Do not reuse the logo green anywhere else on the site: not as a link color, not as a highlight, not as a secondary CTA, not as a hover state. If it starts appearing outside the logo, that's a bug against this spec, not a style choice. Note also that this is a *different* green from `--sm-success` (#1F9D63) defined in the design system doc — the two are not meant to match, and the logo's green does not replace or reference the semantic success color.
- Rest of the site's single-accent-blue discipline is unaffected. This is intentionally the one exception, not a precedent for adding more color elsewhere.

## 3. Clear space & minimum size

- Maintain clear space around the full lockup (wordmark + arc) equal to the height of the wordmark's cap-height on all sides — don't crowd it against nav edges or card borders.
- Minimum usable size for the full lockup (wordmark + arc) is roughly 90px wide before the arc's curve starts to visually break down. Below that, use the icon-only variant (below).

## 4. Icon-only variant (favicon, app icon, social avatar)

The arc alone, isolated, doubles as a minimal standalone mark for contexts where the full wordmark won't be legible: browser favicon, app icon, LinkedIn/social profile picture, email signature avatar.

- Render the arc centered on a square canvas, background per context (transparent for favicon, solid `--sm-bg-base` dark navy for a social avatar where transparency isn't supported), arc in the same fixed `#0E7C50`.
- This gives a real standalone icon mark essentially for free from the wordmark's underline element, without commissioning separate icon design work right now. Treat it as the placeholder icon mark until/unless a dedicated pictorial mark is designed later (see open item in `00-context.md`, now narrowed to "icon mark beyond the arc," not "no mark at all").

## 5. Required export set

Before this ships to any external surface (site header, favicon, social profiles, email signature, Stripe receipt logo), produce:

- Full lockup, ink-navy wordmark + green arc, on transparent background (for use on Light mode / white surfaces)
- Full lockup, off-white wordmark + green arc, on transparent background (for use on Dark/Mono surfaces)
- Icon-only (arc on transparent, and arc on solid dark navy for social avatar contexts) at minimum 512×512 source resolution, scaled down as needed
- Favicon set generated from the icon-only variant (standard multi-size .ico + PNG set)

## 6. Usage don'ts

- Don't recolor the arc to match mode accent tokens — it's fixed green, always.
- Don't stretch or distort the arc's aspect ratio independent of the wordmark.
- Don't add a second color to the wordmark text (the two-tone treatment was reviewed and rejected).
- Don't use the arc shape as a decorative element elsewhere on the site (e.g., as a generic divider graphic) — it's reserved for the logo so it keeps its meaning as "the mark," not "a shape we use sometimes."
