# Logo & Wordmark — LOCKED

Status: **Locked.** Final direction after wordmark concept review. Do not propose alternate logo concepts. Minor execution refinements (exact curve math, spacing) are fine if a real rendering problem is found; the construction itself does not change without an explicit new decision from Moon/Tanzil.

## 1. Construction

**Wordmark:** "SaverMiles," one word, single weight and color (not the two-tone mixed-weight treatment from the rejected Concept C). Set in Zilla Slab, weight 700, letter-spacing -0.01em, size scales contextually (nav ~20px, hero/footer larger, see `01-brand-design-system.md` type scale for reference sizing).

**Underline mark:** a rounded arc beneath the wordmark, curved enough to read as a smile, not a subtle flight-path line. This is the one signature graphic element of the mark.

Target proportions: the arc is **~64% of the wordmark width** (centered under it, not full-width) with **~15% curve depth** (sag ÷ chord), sitting close under the text. A full-width, shallow arc reads as a flight path, not a smile — do not flatten it back toward that; and do not deepen it much past ~18% (deeper reads as a bowl, not a smile). Options were reviewed in `logo-samples/index.html`; "Medium · Close" was chosen.

SVG reference (scale proportionally, don't redraw at different aspect ratios):

```html
<svg width="100" height="21" viewBox="0 0 100 21">
  <path d="M4 3 Q50 31 96 3" stroke="#0E7C50" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</svg>
```

## 2. Color rules

- **Wordmark text color** follows the standard mode-aware ink tokens from `01-brand-design-system.md` — `--sm-ink` in Dark/Light, `--sm-mono-ink` in Mono. No separate logo-specific text color.
- **Arc color is a hardcoded exception: `#0E7C50` (Emerald), fixed across all three modes.** This is the one deliberate break from "no green anywhere in the brand." It does not read from `--sm-accent` or any mode token — it is always this exact green, in Light, Dark, and Mono alike.
- **This is the deepest green that reliably survives all three modes.** Deeper greens (forest, hunter) were tested and rejected — they lose visible contrast against the Dark/Mono navy-black backgrounds, to the point of nearly disappearing. Do not darken this value without re-testing contrast on the actual Dark and Mono backgrounds, not just in isolation on white.
- **This green is logo-only.** Do not reuse `#0E7C50` anywhere else on the site: not as a link color, not as a highlight, not as a secondary CTA, not as a hover state. If it starts appearing outside the logo, that's a bug against this spec, not a style choice. Note also that this is a *different* green from `--sm-success` (#1F9D63) defined in the design system doc — the two are not meant to match, and the logo's green does not replace or reference the semantic success color.
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
