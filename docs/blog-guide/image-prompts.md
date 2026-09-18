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

### travel-portal-vs-transfer-partners (2026-09-18)
- Model: requested nano_banana_pro, reported nano_banana_2; aspect 16:9
- Concepts tried: 4; rounds: 1; credits: 8 (2 of 4 first submissions hit 429 and were resubmitted once jobs drained)
- Shipped prompt:
  > Editorial travel-magazine photograph: a single cognac leather weekender bag resting on a polished travertine floor at the exact point where a calm, luxurious airport terminal corridor splits into two passages around a pale stone column, the left passage glowing with warm amber dawn light through tall glass, the right passage in cool blue-navy shade, low camera height near the floor, viewed slightly off-axis so the scene is natural and not perfectly symmetrical, centered composition on the bag and the split, empty and unhurried. Shot on full-frame camera, 35mm lens, natural available light, shallow depth of field with the far corridors softly out of focus, fine film grain, photorealistic, warm amber highlights and deep navy shadows, Conde Nast Traveler aesthetic. No text, no signage, no logos or brand marks on the bag, no watermark, no people.
- Why this one won: the clearest "two paths, one traveler" image in the round, with a warm path and a cool path, and it reads as a real photo in the set's amber and navy grade.
- Rejected: fork corridor without a bag: reads as one corridor with a pillar, and the receding vanishing-point symmetry is an AI tell; two jet bridges at blue hour: near-perfect mirror symmetry, aircraft parked nose to nose, bridges not meeting the doors, grade mostly cool; brass compass on a map: realistic but generic trip planning with no "two paths" idea, a world-map cliche, subject left of center.
- Lesson: an object anchoring the scene (the bag) plus "viewed slightly off-axis" beat pure architecture, which drifted into AI-symmetric vanishing points.
- Output: src/scripts/assets/blog/travel-portal-vs-transfer-partners.jpg, 1600 × 893, 379 KB
- COVER_ALT: Leather weekender bag on a stone floor where an airport corridor splits around a column into a sunlit path and a shaded one
