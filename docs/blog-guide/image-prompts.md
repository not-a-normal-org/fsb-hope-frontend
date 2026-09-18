# Cover image prompt log

One entry per cover, newest first. Record what shipped **and** what was rejected, so the next
cover starts from a prompt that is known to work. Style, model and checklist live in
[`images.md`](images.md).

The nine covers generated on 2026-09-10 (PR #64) have no recorded prompts; they were written in
chat and not saved. Their subjects are listed in PR #64. Don't try to reconstruct their prompts
from memory.

## Entry template

```
### <slug> (YYYY-MM-DD)
- Model: requested nano_banana_pro, reported <model>; aspect 16:9
- Concepts tried: <n>; rounds: <n>; credits: <n>
- Shipped prompt:
  > <full prompt>
- Why this one won: <one line>
- Rejected: <concept>: <reason>; <concept>: <reason>
- Output: src/scripts/assets/blog/<slug>.jpg, 1600 × 893, <size> KB
- COVER_ALT: <alt text>
```

---

### travel-portal-vs-transfer-partners v2, explanatory split cover (2026-09-19): SHIPPED
- Type: explanatory split cover, composed with `tools/compose-split-cover.mjs`
  (config: `tools/travel-portal-vs-transfer-partners.cover.json`); no text from the model.
- Model: requested nano_banana_pro, reported nano_banana_2; aspect 16:9; 4 images, 1 round, 8 credits
- Portal half, shipped prompt:
  > Editorial travel-magazine photograph: an open silver laptop on a warm walnut desk, its screen showing an out-of-focus online travel booking page with a list of flight results, screen content soft and indistinct with no readable text, a ceramic coffee cup and a folded paper itinerary beside it, warm golden late-afternoon window light, calm and simple. Centered composition, laptop in the middle of the frame. Shot on full-frame camera, 50mm lens, shallow depth of field, fine film grain, photorealistic, warm amber highlights and deep navy shadows. No readable text anywhere, no logos, no watermark, no people.
- Partners half, shipped prompt:
  > Editorial travel-magazine photograph: the tails of four widebody aircraft parked side by side at an airport gate area at blue hour, each tail painted a different plain solid color (deep red, navy blue, teal, cream), completely plain tails with no logos, no emblems, no liveries and no text, soft apron floodlights, cool navy sky with a thin warm amber glow on the horizon. Centered composition. Shot on full-frame camera, 85mm lens, shallow depth of field, fine film grain, photorealistic, deep navy shadows and warm amber highlights. No text, no logos, no watermark, no people.
- Rejected halves: a phone with a booking app (bright UI buttons fought the overlay text); jets
  seen through terminal glass (good, but read as "an airport", while distinct colored tails read as
  "several airlines").
- Composition: blur 2.2 and a navy scrim so the photos sit behind the type; focusX 0.52 / 0.40 (the
  0.40 slice shows the red, navy and teal tails; 0.56 showed only two).
- Output: src/scripts/assets/blog/travel-portal-vs-transfer-partners.jpg, 1600 × 893, 105 KB
- COVER_ALT: Travel portal vs. transfer partners: Chase, Amex and Capital One Travel beside United, Aeroplan and Virgin Atlantic

### travel-portal-vs-transfer-partners v1 (2026-09-18): REJECTED by the owner on 2026-09-19 ("not relevant"), replaced by v2
- Lesson: for a comparison post, a metaphor (a bag at a forking corridor) doesn't tell the reader the topic. Show the options. See images.md section 0.
- Model: requested nano_banana_pro, reported nano_banana_2; aspect 16:9
- Concepts tried: 4; rounds: 1; credits: 8 (2 of 4 first submissions hit 429 and were resubmitted once jobs drained)
- Shipped prompt:
  > Editorial travel-magazine photograph: a single cognac leather weekender bag resting on a polished travertine floor at the exact point where a calm, luxurious airport terminal corridor splits into two passages around a pale stone column, the left passage glowing with warm amber dawn light through tall glass, the right passage in cool blue-navy shade, low camera height near the floor, viewed slightly off-axis so the scene is natural and not perfectly symmetrical, centered composition on the bag and the split, empty and unhurried. Shot on full-frame camera, 35mm lens, natural available light, shallow depth of field with the far corridors softly out of focus, fine film grain, photorealistic, warm amber highlights and deep navy shadows, Conde Nast Traveler aesthetic. No text, no signage, no logos or brand marks on the bag, no watermark, no people.
- Why this one won: the clearest "two paths, one traveler" image in the round, with a warm path and a cool path, and it reads as a real photo in the set's amber and navy grade.
- Rejected: fork corridor without a bag: reads as one corridor with a pillar, and the receding vanishing-point symmetry is an AI tell; two jet bridges at blue hour: near-perfect mirror symmetry, aircraft parked nose to nose, bridges not meeting the doors, grade mostly cool; brass compass on a map: realistic but generic trip planning with no "two paths" idea, a world-map cliche, subject left of center.
- Lesson: an object anchoring the scene (the bag) plus "viewed slightly off-axis" beat pure architecture, which drifted into AI-symmetric vanishing points.
- Output: src/scripts/assets/blog/travel-portal-vs-transfer-partners.jpg, 1600 × 893, 379 KB
- COVER_ALT: Leather weekender bag on a stone floor where an airport corridor splits around a column into a sunlit path and a shaded one
