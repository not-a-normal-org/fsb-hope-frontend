# Brand & Design System — LOCKED

Status: **Locked.** This is the final visual direction after four rounds of palette review. Do not propose alternate palettes. Refinements to exact values are allowed if a real accessibility or rendering problem is found, but the direction (blue material glass) does not change without an explicit new decision from Moon/Tanzil.

Reference implementation: see the approved mockup pattern (glass panel + blurred blob background + shine-sweep headline text) built during palette review. This document formalizes those values into usable design tokens.

## 1. Concept

**"Material Glass, Blue."** A tonal navy/steel-blue system with frosted glass panels floating over softly blurred color depth, and a slow metallic shine animation on hero headline text. No warm colors. No green. No gold. The one saturated color in the whole system is the CTA blue, which is used sparingly so it reads as an action, not a brand color.

This is a **dark-mode-default** brand. Light mode exists and must be built, but dark is the default served to new visitors.

**Three modes, not two.** In addition to Light and Dark (both on the blue system below), there is a third mode, **Mono** — the monochrome black/gray/white glass system from the earlier design round, kept as a selectable alternate. Mono is dark-only; it does not get its own light variant. That's a deliberate scope line — three total modes, not four. The mode switch is a 3-way control (Light / Dark / Mono), not a binary toggle. Default for new visitors remains Blue Dark.

## 2. Color tokens

Define these as CSS custom properties (or Tailwind theme extension) so every component pulls from the same source. Do not hardcode hex values in components.

### Dark mode (default)

```css
--sm-bg-base: #060B14;        /* page background, solid fallback */
--sm-bg-elevated: #0F2038;    /* gradient stop / elevated surface / cards without glass */
--sm-ink: #EAF1FB;            /* primary text */
--sm-ink-sub: #A9BBD1;        /* secondary / body text */
--sm-ink-muted: #7C8FA6;      /* tertiary text, stat labels, timestamps */
--sm-accent: #6FA8DC;         /* eyebrows, links, icon accents, borders on glass */
--sm-cta: #1877F2;            /* primary action color — buttons, active states only */
--sm-cta-hover: #3D8CF5;
--sm-glass-bg: rgba(120, 165, 220, 0.08);
--sm-glass-border: rgba(160, 195, 235, 0.18);
--sm-glass-shadow: 0 20px 60px -20px rgba(0,0,0,0.7);

/* blob / ambient background colors, used behind glass panels only */
--sm-blob-1: rgba(60, 120, 200, 0.28);
--sm-blob-2: rgba(24, 119, 242, 0.20);
--sm-blob-3: rgba(111, 168, 220, 0.20);
```

### Light mode

```css
--sm-bg-base: #DCE8F5;
--sm-bg-elevated: #F2F7FC;
--sm-ink: #0A2540;
--sm-ink-sub: #4B5A6B;
--sm-ink-muted: #7C8FA6;
--sm-accent: #3E7CB1;
--sm-cta: #1877F2;            /* same CTA blue in both modes — brand consistency */
--sm-cta-hover: #0A5FD1;
--sm-glass-bg: rgba(255, 255, 255, 0.55);
--sm-glass-border: rgba(255, 255, 255, 0.75);
--sm-glass-shadow: 0 20px 50px -20px rgba(10,37,64,0.18);

--sm-blob-1: rgba(62, 124, 177, 0.20);
--sm-blob-2: rgba(24, 119, 242, 0.14);
--sm-blob-3: rgba(160, 195, 235, 0.30);
```

### Mono mode (third option, dark-only)

Reuses the exact values validated in the original black/gray glass mockup. No hue anywhere — every color signal in this mode comes from a metallic-shine gradient on headline text, not from color.

```css
--sm-mono-bg-base: #0C0C0E;
--sm-mono-bg-elevated: #1C1D21;
--sm-mono-ink: #F2F2F0;
--sm-mono-ink-sub: #A8ACB3;
--sm-mono-ink-muted: #7C8089;
--sm-mono-accent: #C9CDD3;         /* eyebrows, borders on glass — silver, not blue */
--sm-mono-cta: rgba(255,255,255,0.92);   /* solid off-white button, dark text */
--sm-mono-cta-text: #111214;
--sm-mono-cta-hover: #FFFFFF;
--sm-mono-glass-bg: rgba(255,255,255,0.05);
--sm-mono-glass-border: rgba(255,255,255,0.12);
--sm-mono-glass-shadow: 0 20px 60px -20px rgba(0,0,0,0.7);

--sm-mono-blob-1: rgba(255,255,255,0.08);
--sm-mono-blob-2: rgba(180,185,196,0.10);
--sm-mono-blob-3: rgba(120,126,140,0.12);
```

The shine-sweep headline gradient in Mono runs white → light gray → silver (`linear-gradient(100deg, #E7E8EA, #FFFFFF, #9BA0AA, #F2F2F0, #C9CDD3)`), not the blue-tinted version used in Light/Dark.

Semantic colors (success/warning/error, defined below) stay the same across all three modes — Mono does not desaturate them. A green success checkmark in Mono mode is the one intentional exception to "no hue," since status feedback needs to stay legible and consistent regardless of theme.

### Semantic colors (all three modes — for status/feedback only)

```css
--sm-success: #1F9D63;   /* confirmed award found, form success */
--sm-warning: #C9922E;   /* phantom-flight risk notices, non-critical alerts */
--sm-error:   #D9534F;   /* form validation errors */
```

Do not use green anywhere as a brand or decorative color. Green is reserved exclusively for the semantic "success" state above, used sparingly (a small checkmark, an inline confirmation), never as a section background or large surface.

**One fixed exception:** the logo's underline arc is a hardcoded green (`#0E7C50`, Emerald), independent of mode tokens and independent of the `--sm-success` value above. This is documented in full in `08-logo-brand-mark.md` and is scoped to the logo only — it does not license green use anywhere else on the site.

## 3. Typography

- **Display / headlines:** Zilla Slab, weight 600–700. Used for H1/H2, hero headline, section titles. This is what carries the shine-sweep animation on hero text.
- **Body / UI:** IBM Plex Sans, weight 400–500. All body copy, buttons, form labels, nav.
- **Utility / data:** IBM Plex Mono, weight 400–600. Eyebrows (uppercase labels above headlines), stat numbers' labels, point counts, dates, form field hints, timestamps, the calculator's numeric output. Monospace is intentional — it signals "this is a precise number," reinforcing the brand's "real data, not guesses" positioning.

Type scale (base 16px):

```
H1 / hero:      40–48px desktop, 30px mobile, line-height 1.1
H2 / section:   30–34px desktop, 24px mobile, line-height 1.2
H3 / card:      20–22px, line-height 1.25
Body:           15–16px, line-height 1.6
Small / label:  12–13px, line-height 1.4
Eyebrow:        11px, letter-spacing 0.12em, uppercase
```

## 4. Glass panel spec

Every "glass" surface (hero panel, pricing cards, alert product cards, calculator card, form cards) follows this recipe:

```css
.glass-panel {
  background: var(--sm-glass-bg);
  border: 1px solid var(--sm-glass-border);
  border-radius: 14px;
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  box-shadow: var(--sm-glass-shadow), inset 0 1px 0 rgba(255,255,255,0.08);
}
```

**Glass panels only work with something behind them to blur.** Never place a glass panel directly on a flat solid background — it will look like a plain gray box, not glass. Every section that uses glass panels needs ambient blurred "blob" shapes behind it, using `--sm-blob-1/2/3`, positioned absolutely, `filter: blur(70–90px)`, sized 200–360px.

Reuse a shared `<AmbientBackground />` component (see `04-components-spec.md`) rather than reimplementing blobs per page — the same 3-blob pattern with mode-aware colors should back every glass section.

## 5. Motion (Framer Motion)

The site should feel alive, not busy. Rules:

- **Hero shine sweep:** the metallic gradient text animation on hero headlines runs continuously, 5–6s linear loop, `background-position` sweep. Already validated in the mockup — keep exact timing.
- **Page load:** stagger-fade elements in on load/route change — glass panel first, then stat strip, then CTA row. 60–120ms stagger, 300–400ms fade+8px translateY per element. Do not overdo it; one clean orchestrated entrance per page, not per element scattering.
- **Scroll reveals:** sections below the fold fade+rise in on scroll into view (Framer Motion `whileInView`), once only, not on every scroll pass.
- **Hover states:** glass buttons get a subtle scale (1.0 → 1.02) and background opacity increase on hover, 150–200ms ease. CTA primary buttons get the solid-to-hover color transition already defined in tokens.
- **Respect `prefers-reduced-motion`.** All animation must degrade to instant/no-motion when that's set. This is not optional.
- **Mode switch transition:** switching between any of the three modes (Light / Dark / Mono) should crossfade background and recolor tokens over ~300ms, not hard-cut. This includes the Blue↔Mono transition, which is a bigger visual jump (hue disappearing/appearing) than Light↔Dark — make sure the crossfade covers the CTA color change too, since it moves from blue to off-white/back.

## 6. Iconography & imagery

- No stock travel photography (airplane wings, sunset beaches). It undercuts the precise/data-driven positioning and every competitor already uses it.
- Where visual interest is needed beyond glass/blobs, prefer abstract data-driven visuals: the departure-board/flip motif from the original prelaunch page is on-brand and can be reintroduced as a component within this new system (recolored to the blue glass tokens), not photography.
- Icons: a single consistent icon set (Lucide, since it's already available in the component library) at consistent stroke width. No mixed icon styles.

## 7. Accessibility floor

- Text on glass must maintain WCAG AA contrast against the *worst-case* blob position behind it, not just the average. Test with blobs at full opacity overlap.
- All interactive elements need visible keyboard focus states (a ring using `--sm-accent`, not just a color change).
- Mode toggle, form fields, and calculator must be fully operable via keyboard alone.
