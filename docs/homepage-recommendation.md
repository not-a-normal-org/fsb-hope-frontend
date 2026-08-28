
# Saver Miles — Landing Page Critique & Fix Plan

**Reviewed:** saver-miles.vercel.app homepage (dark theme), 30 Jul 2026

---

## The core diagnosis

The page is *tasteful but inert*. Nothing is wrong with any single element — the serif headlines are good, the mono eyebrows are a nice touch, the copy is sharp. It reads dull for three structural reasons:

1. **No value contrast.** Every section sits on the same near-black with the same navy radial glow. Six sections, one visual temperature. The eye has nothing to anchor to, so it slides.
2. **No structural variation.** Hero → 2 cards → 2 cards → 2 cards → split → centered form. Four consecutive 50/50 grids. The rhythm is a metronome.
3. **You're selling proof and showing none.** Your entire differentiator is *"a human opens the booking and confirms the seat is really there, with screenshots and exact point costs."* There is not one image of that deliverable anywhere on the page. You're describing evidence instead of displaying it.

Fix #3 and the hero's empty right side solves itself.

---

## Priority 1 — The hero (biggest single win)

### What's wrong

- The text is trapped in a **card inside a section**. The card boundary caps how large the headline can go and creates a visual "box" that reads timid. It also causes the right-hand void: a 560px card in a 1200px container = 600px of nothing.
- The headline is set at maybe 40px when it should be 64–80px. It's the thesis of the business and it's whispering.
- **The stats row (14+ yrs / 23,000+ / 30+) is your strongest asset and your weakest visual element** — tiny, gray, orphaned outside the card. 23,000 completed searches and 14 years is the whole reason to trust you over a $395 competitor. It's currently 11px type.
- Vertical dead space below the stats is enormous — roughly 200px of nothing before the fold ends.

### Fix — put the deliverable in the right column

Kill the card wrapper. Two-column hero, ~52% / 48%:

**Left:** eyebrow → headline at 68–76px → 2-line subhead (cut the current 4 lines to 2) → CTA pair.

**Right: a mock "Search Report" card** — the actual artifact a client receives. This is the single highest-leverage element you can add to the site:

```
┌────────────────────────────────────┐
│ SEARCH REPORT · #4412  ✓ CONFIRMED │
│                                    │
│ JFK ──────────────────────→ NRT    │
│ ANA · Business · 24 Oct             │
│                                    │
│ 75,000 pts  +  $64.30 taxes        │
│ Retail fare: $6,240                │
│ ─────────────────────────────      │
│ Transfer from: Amex MR 1:1         │
│ [screenshot thumbnail]             │
│ Verified by hand · 02:14 to find   │
└────────────────────────────────────┘
```

Give it a slight tilt (2–3°), a soft drop shadow, and a subtle float animation on load. Optionally cycle through 3 real past searches every 5s. This does four jobs at once: fills the space, demonstrates the product, proves the claim, and creates your signature element.

**Then move the stats into a full-bleed bordered strip** across the bottom of the hero — hairline top/bottom rule, numbers at 32–40px in the mono face, labels in 10px letterspaced caps. Same content, ten times the authority.

---

## Priority 2 — Break the flatness

- **Alternate section surfaces.** Pick two: base `#07090E` and a raised panel `#101725`. Alternate them. Even a 4% lift gives the page a pulse.
- **One inverted section.** Put the "automated vs. by hand" comparison on a light or near-white background. A single tonal inversion mid-page does more than any amount of gradient tuning.
- **One glow, not six.** The radial navy blur repeats in every section, which is why they all read as the same slab. Keep it in the hero only.
- **Add a second accent.** Right now the only color on the page is generic SaaS blue `#2E7BFF`. Award travel has a vocabulary — boarding pass ink, departure-board amber, cabin lighting. Introduce a warm accent (amber `#E8A33D` or a pale gold) reserved *exclusively* for confirmation/proof moments: the ✓ CONFIRMED badge, the verified checkmarks, point totals. Blue = navigation, amber = proof. Now your differentiator has a color.
- **Cut vertical padding ~30%.** Sections are padded like a page with 2× the content. Currently the page feels emptier than it is.

---

## Priority 3 — Layout rhythm

Vary the grid so no two adjacent sections share a shape:

| Section               | Now                    | Change to                                                                                                                                                                                                                                                                                                |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Individual / Business | 50/50 cards            | Keep — the symmetry is meaningful here (two audiences)                                                                                                                                                                                                                                                  |
| Automated vs. by hand | 50/50 cards            | **One table with a hard center divider**, not two floating cards. It's a comparison — make it read as one artifact, not two. Inverted background.                                                                                                                                                 |
| Alerts                | 50/50 cards            | **Asymmetric 40/60.** Feature the $99.99 Human Search Alert: larger, bordered in amber, "Most accurate" tag. The $4.99 tier is a decoy that makes the real product look reasonable — right now they're visual equals, which makes $99.99 look like a 20× markup instead of a different category. |
| Calculator            | Text left, input right | Make the input**larger and live** — big mono number, animated value counting up. Currently the result is an em dash, which reads as broken.                                                                                                                                                       |

---

## Priority 4 — What's missing entirely

- **Pricing on the homepage.** Competitors run $70–395/person. You're at $99 flat, all cabins. That number is a weapon and it's buried behind a nav link. Put a one-line pricing band above the newsletter: "$99 per person, per way. All cabins. Only if you fly."
- **A face.** You are selling *a specialist*, singular and human — the word appears 9 times on this page — and the site is faceless. One real photo (or even a signature + first name) converts better than any amount of copy about human verification.
- **Testimonials.** Per the outreach plan, Upwork proof is the plan. Nothing on the page yet. Even one quote with a name and route beats the abstract stats.
- **Trust markers near the CTA.** "No charge until a seat is confirmed" under the primary button removes the biggest hesitation for a stranger service.

---

## Bugs & cleanup

- **Blank third page in the render.** Something below the footer is producing ~1100px of empty dark canvas with only the copyright bar. Check for a stray section with `min-height` or an unclosed container.
- **Stray element above the nav** — small circle floating at top center, partially cut off. Looks unintentional.
- **Two identical newsletter forms** (mid-page + footer) with the same two fields. Keep the footer one; replace the mid-page section with the pricing band or testimonials.
- **Theme switcher appears twice** (nav + footer bottom-left) and the nav instance sits directly beside your primary CTA, competing with it. Move it to the footer only.
- **CTA label mismatch:** nav says "Get a points audit", hero says "Get a free points audit". Pick one and use it everywhere including the toast/confirmation.
- **Body copy contrast is too low.** Gray on near-black at ~14px fails comfortable reading. Lift body text to `#A8B3C4` minimum, size to 16px.
- **Nav is crowded:** 6 links + toggle + CTA. Fold "Guides" and "Deals" under a single "Resources", or drop "Deals" if it isn't live.

---

## Sequence

1. Rebuild the hero: kill the card, scale the headline, add the Search Report mock, promote the stats to a full-width strip.
2. Add the amber proof accent + alternate section surfaces + remove repeated glows.
3. Convert the comparison to a single inverted table; make the Human Search Alert the featured tier.
4. Fix the blank-page bug, dedupe the newsletter and theme toggle, unify CTA copy.
5. Add pricing band, one testimonial, one face.

Steps 1 and 2 alone will change the impression of the whole site.
