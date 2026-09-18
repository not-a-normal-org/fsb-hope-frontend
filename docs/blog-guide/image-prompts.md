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
