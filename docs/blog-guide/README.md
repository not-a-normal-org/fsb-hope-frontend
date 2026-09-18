# Blog guide

Everything needed to research, write, illustrate, publish and verify a Saver Miles blog post.
Start here.

| Doc | What it's for |
|---|---|
| [`writing-guide.md`](writing-guide.md) | Voice, hard rules, post skeleton, links, front-matter, and the markdown the seed understands |
| [`seo-geo.md`](seo-geo.md) | Search and answer-engine best practice with sources, the **pre-publish checklist**, and what's already done in code |
| [`keyword-research.md`](keyword-research.md) | Coverage map of existing posts, ranked topic gaps, and the backlog. Re-run quarterly |
| [`images.md`](images.md) | Cover look, the generation recipe (model, prompt template), export, crop checks, alt text |
| [`image-prompts.md`](image-prompts.md) | Log of every cover prompt: what shipped and what didn't |
| [`publishing.md`](publishing.md) | Seeding to production safely (`ONLY=`, dry run), verification, rollback |

**Which doc wins in a conflict:** the non-negotiables in
[`docs/plans/00-context.md`](../plans/00-context.md) (no founder or prior-brand names, no fabricated
proof, human-first positioning), then `writing-guide.md`, then `seo-geo.md`. External SEO advice
never overrides a house rule. Where they differ, the differences are flagged in `seo-geo.md`.

Related specs (linked, not moved): [`docs/plans/03-products-and-pricing.md`](../plans/03-products-and-pricing.md)
§7 (copy rules), [`docs/plans/01-brand-design-system.md`](../plans/01-brand-design-system.md) §6
(imagery; blog covers are a scoped exception, see `images.md`),
[`docs/plans/02-site-structure.md`](../plans/02-site-structure.md) (`/blog` spec).

## The workflow

1. **Topic.** Pick the top open candidate in `keyword-research.md`. Check that it doesn't
   duplicate an existing post's main intent. The coverage map in `keyword-research.md` and the
   `ORDER` list in `src/scripts/seed-articles.ts` show every live post.
2. **Outline.** Title, slug, meta, the answer-first lead, 4 key takeaways, H2s and 4 FAQ
   questions, following `writing-guide.md` §3.
3. **Cover, in parallel with drafting.** Generate from the outline following `images.md`, and log
   the prompt in `image-prompts.md`.
4. **Draft** the markdown following `writing-guide.md`.
5. **Fact-check,** ideally by someone other than the writer: every price, ratio, partner,
   transfer time and policy against a primary source or two reputable outlets. Keep the source
   list for the PR.
6. **Preflight:** run the `seo-geo.md` checklist plus `ONLY=<slug> SEED_DRY_RUN=1 npm run seed:articles`.
7. **Publish** with `ONLY=<slug>` (production), logging to a file.
8. **Verify** on production: post, JSON-LD, sitemap (new URL with today's `lastmod`, other posts
   unchanged), llms.txt, RSS. See `publishing.md`.
9. **PR:** markdown, JPEG and the `ORDER` line, with the topic rationale, sources and verification
   output. Then request indexing in Search Console.

### Running it with parallel agents
The research steps split cleanly across Claude Code subagents:
- **Keyword research** and **SEO/GEO best practices** run in parallel. Each writes only its own
  doc here.
- **Cover image** starts once the outline exists, while the main thread drafts.
- **Fact-check** runs independently on the finished draft and edits nothing; it reports.

Keep all git work, seeding and verification in the main thread. Agents never run the seed or git.
