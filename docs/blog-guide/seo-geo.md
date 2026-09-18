# SEO and GEO for the Saver Miles blog

How to get a post ranked in Google and Bing and cited by answer engines (AI Overviews and
AI Mode, ChatGPT search, Copilot, Perplexity, Claude). Guidance current as of **2026-09-18**,
primary sources first. Cover images are covered in [`images.md`](images.md).

**Tags.** **Done in code**: the site already does it (file named). **Author rule**: the
writer or publisher does it for each post. **Gap**: a follow-up code change, listed for a
ticket, not done here. Keys like [S5] link to the sources at the end.

**The short version.** Google and Bing both say AI search runs on ordinary SEO
foundations, and neither needs special files or markup to include you ([S18], [S19], [S24]).
What works: one question per page, answered first, with facts that can be checked on
their own, real sources, and honest dates.

---

## 1. Pre-publish checklist

1. **One intent.** Write down the one question the post answers. The bold lead (~50 words) answers it in its first sentence.
2. **One primary phrase**, used naturally in `TITLE`, `SLUG`, the bold lead and one H2. Never repeated for its own sake.
3. **`META_TITLE` is 46 characters or fewer**, unique, and does **not** include "Saver Miles". The layout appends ` | Saver Miles` (14 characters), which brings it to about 60.
4. **`META_DESCRIPTION` is ~140–155 characters**, unique, and says what the reader gets. No hype, no unqualified "guarantee".
5. **`SLUG`**: lowercase, hyphenated, 3–6 meaningful words. It never changes after publishing.
6. **`EXCERPT`** is one or two plain sentences. It is the dek under the H1 and the summary in RSS and `/llms.txt`.
7. **`## Key takeaways`**: 4 bullets, each a complete sentence that makes sense quoted alone.
8. **Every H2 opens with a one- or two-sentence direct answer.** Headings are descriptive, not clever.
9. **Every number, ratio, price or program rule is real**, dated ("as of September 2026") and, where possible, linked to its primary source, usually the program's own page. No invented statistics.
10. **`## Frequently asked questions`** has exactly 4 H3 questions, worded the way a reader would ask them, each answered in 40–80 words that stand alone.
11. **After the last FAQ answer, the next thing is an H2.** A closing call to action goes under its own H2, or it leaks into the FAQPage JSON-LD (2.4).
12. **Internal links**: 2–4 in-context links to related posts, one to the pillar (`/blog/how-to-fly-for-free-with-credit-card-points`) and one to a product page (`/individual`, `/how-it-works`, `/pricing`, `/alerts`), each with anchor text that says where it goes.
13. **`COVER_ALT`** describes what is in the photo, in 125 characters or fewer.
14. **Voice**: no em dashes, no hype, no fake urgency, no founder names, no fabricated social proof. Byline stays "Saver Miles Team".
15. **Length** is whatever fully answers the question. The house ~1,800–2,000 words sets scope; never pad to reach it.
16. **Dry run**: `SEED_DRY_RUN=1 ONLY=<slug>` (PR #68, open). Check lengths, zero em dashes, 4 FAQ questions, and a "last answer" line with no CTA in it.
17. **Publish only that post** with `ONLY=<slug>`. Never a full reseed.
18. **After launch**: test the page in Google's Rich Results Test, then Search Console → URL Inspection → Request indexing.
19. **Edits**: reseed a live post only for a real change (facts, advice, sections, links). Typo fixes wait for the next real edit.

---

## 2. Recommendations by area

### 2.1 Search intent and content quality

- **Author rule.** Write for one reader with one question: will they "leave feeling they've learned enough about a topic to help achieve their goal?" [S1]. Bing asks for one topic per URL, with title, headings and intent in agreement [S24].
- **Author rule.** Show first-hand expertise [S1]: what a specialist actually sees when checking award space, where programs behave differently, what goes wrong. Google asks for "unique, non-commodity content" [S20]. Label hypothetical examples as hypothetical. Never pass off an invented booking as real.
- **Author rule.** AI-assisted drafting is fine. Mass-producing pages "without adding value for users" is scaled content abuse ([S2], [S3]), and since May 2026 the spam policies explicitly cover Google's AI answers too [S17]. So no templated series that only swaps the route, and a person checks every fact before publishing.
- **Gap (owner decision, not a rule).** Google asks whether any use of AI is "self-evident to visitors through disclosures" [S1]. The house rules don't cover this; consider a short "how we write these guides" note on `/about`.

### 2.2 Titles, meta descriptions, slugs

- **Done in code.** The layout's title template is `%s | Saver Miles` (`src/app/(frontend)/layout.tsx`). The post page (`src/app/(frontend)/blog/[slug]/page.tsx`) uses `meta.title`, falling back to `title`, and sets a canonical `www` URL, Open Graph `article` tags and a Twitter large-image card. The seed writes `META_TITLE` and `META_DESCRIPTION` into the SEO plugin fields.
- **Author rule.** Titles should be descriptive and concise, without keyword stuffing or boilerplate. Google sets no character limit but truncates to the device width, and it may rewrite a title using the H1 and other text [S4]. "About 60 characters" is an industry rule of thumb, not a Google figure. Keep `TITLE` (the H1) and `META_TITLE` saying the same thing.
- **Author rule.** Meta descriptions also have no limit and are truncated to fit. Google builds most snippets from the page itself [S5]. Make each one unique and specific. Bing warns that missing, duplicate or overly short titles and descriptions can reduce eligibility for citations [S24].
- **Author rule.** Use meaningful words in the URL [S6], and keep URLs stable [S24].
- **Gap.** `generateTitle` in `src/payload.config.ts` returns `"<title> | Saver Miles"`. If an author clicks the plugin's auto-generate button, the template adds the brand again ("… | Saver Miles | Saver Miles"), and the JSON-LD `headline` gets it too. Fix: return `doc.title`. Until then, never put "Saver Miles" in a meta title.
- **Current state.** Three `META_TITLE`s are over 46 characters (`phantom-award-space-why-seats-vanish` at 48, `transfer-partners-explained-guide` at 49, `qantas-points-condor-reward-seats` at 56), and five `META_DESCRIPTION`s run 158–164. Fix each one during that post's next real edit.

### 2.3 Structure and GEO

- **Author rule: answer first.** Bing: "Place essential information near the top… Avoid long introductions" [S24]. The bold lead plus Key takeaways do exactly this.
- **Author rule: statements that stand alone.** Bing wants facts made explicit and key statements that "do not rely on implied content" [S24]. Write "Qantas adds no carrier surcharge on Condor awards", not "it doesn't add one".
- **Author rule: name things the same way throughout.** Give a program's full name on first mention ("Amex Membership Rewards"), then one consistent short form [S24].
- **Author rule: cite sources and use real numbers.** The Princeton GEO paper (Aggarwal et al., KDD 2024) built a 10,000-query benchmark (GEO-bench) and, on its 1,000-query test split, rewrote one source per query in nine different ways [S33]. Its answer engine was GPT-3.5-turbo summarizing the top five Google results, and a 200-query sample was rechecked on Perplexity.ai. **It measured visibility:** how many words of the AI answer were attributed to a source, weighted by position, plus an LLM-judged impression score. Clicks, traffic and rankings were not measured. Adding citations, quotations or statistics raised the word-count metric about 30–40%. Keyword stuffing gave "little to no improvement", and on Perplexity it scored about 10% below baseline on that metric. **Caveats:** most of the gain went to lower-ranked sources (Cite Sources: +115% at rank 5, −30% at rank 1), the rewrites were machine-generated and never checked for accuracy, and the engines tested date from 2023–24. So the takeaway is "add real numbers and link their source", not "add numbers". The house ban on fabricated statistics stands.
- **Author rule.** Link primary sources (award charts, partner pages, program terms). As of 2026-09-18, only one post links outside the site, and both of its links go to third-party blogs.
- **Author rule: don't write for bots.** Google: "no requirement to break your content into tiny pieces" [S19]. Use natural sections with a logical H2/H3 hierarchy [S24]. No hidden text and nothing aimed at steering a model; Bing classes that as abuse [S24].
- **Done in code.** The H1 comes from `TITLE`, and the restricted markdown only allows H2 and H3 (`src/scripts/seed-articles.ts`), so the hierarchy is always valid.

### 2.4 Structured data

- **Done in code.** `BlogPosting` (`articleJsonLd` in `src/lib/seo.ts`) carries headline, description, image, `datePublished`, `dateModified`, `wordCount`, `articleSection` and `inLanguage`. Author and publisher are the `Organization`, with its name, homepage and logo. Google accepts an organization as author when it has a name and homepage [S13], so the team byline needs no invented person.
- **Done in code.** `BreadcrumbList` (Home › Blog › Category › Post) [S14], plus site-wide `Organization` and `WebSite` in `src/app/(frontend)/layout.tsx`. Breadcrumbs have shown only on desktop since January 2025 [S17].
- **Done in code.** `FAQPage` is built from the visible FAQ by `extractFaq` (`src/lib/blog.ts`). The H2 matching /frequently asked question/i starts it; each H3 is a question, and the paragraphs up to the next heading are its answer.
  - **What it no longer does.** FAQ rich results were limited to government and health sites in 2023 [S16] and removed from Google entirely on 2026-05-07 [S17].
  - **What it still does.** Unused markup "does not cause problems for Search" [S16]. Bing says structured data "may support clearer grounding but does not guarantee visibility" [S24]. We found no primary source saying any AI engine favors FAQPage when choosing citations.
  - **Verdict.** The visible Q&A is what earns citations. The markup is free, so keep it, but don't invest in it.
- **Author rule.** Never mark up what readers can't see ([S15], [S24]). A CTA sitting after the last FAQ answer gets published as part of that answer. PR #69 (open) fixes the four affected posts.
- **Gap.** The JSON-LD `image` is the generated title card (`/blog/<slug>/og`, 1200×630). Google wants a representative image, ideally in 16:9, 4:3 and 1:1 versions of at least 50,000 pixels [S13]. Add the cover photo's renders and keep the card for social.
- **Gap (minor).** `headline` uses `meta.title`. The visible H1 (`post.title`) would match the page more closely [S15].
- **Gap (low value).** `articleJsonLd` has a `keywords` option that nothing passes. Google doesn't list `keywords` for Article [S13] and ignores the keywords meta tag [S6]. Leave it unwired unless another consumer needs it.

### 2.5 Images

- **Done in code.** `next/image` serves a responsive `srcset`. Alt text is required on every upload (`src/collections/Media.ts`). The seed uploads each cover as `<slug>.jpg`, which gives it a descriptive filename [S8].
- **Author rule.** Alt text describes the image, not the post, and carries no keywords [S8]. Set `COVER_ALT` (PR #68). Without it, the seed writes `Editorial photograph for "<title>"`, which says nothing about the picture.
- **Author rule.** Key facts go in the text, never only in an image [S24].
- **Gap.** Post metadata doesn't set `max-image-preview:large`, which Google Discover recommends along with images at least 1200 px wide [S9]. Add `googleBot: { 'max-image-preview': 'large' }` in `generateMetadata`.

### 2.6 Internal linking

- **Done in code.** Related posts (same category first), a prev/next pager, category pages, the blog index, RSS, `/llms.txt` and the sitemap, all as crawlable `<a href>` links [S7].
- **Author rule.** Body links use descriptive anchors ("the transfer partners guide", never "click here") with no keyword stuffing ([S7], [S6]). "Every page you care about should have a link from at least one other page on your site" [S7].
- **Author rule.** When a new post goes live, link to it from one or two older posts. Google counts changed links as a significant update [S10], so reseeding those posts with `ONLY=` is honest. `qantas-points-condor-reward-seats` is currently the only post that doesn't link the pillar.
- **Gap.** The page has no visible breadcrumb trail, only "← All posts". A visible trail would match the `BreadcrumbList` and give readers another way around the site.

### 2.7 Freshness and lastmod

- **Done in code.** The sitemap `lastModified`, `dateModified` and OG `modifiedTime` all come from Payload's `updatedAt` (`src/app/sitemap.ts`, `src/lib/seo.ts`, the post page).
- **Author rule.** Google trusts `lastmod` only when it is "consistently and verifiably accurate". It should mark the last *significant* change (main content, structured data or links), not a copyright year ([S10], [S11]). Google also lists changing dates without real changes, and churning content to look "fresh", as search-engine-first behavior [S1]. Refresh a post when its facts change, then reseed it.
- **Gap (fix open in PR #68).** On `main`, `npm run seed:articles` re-saves every post, so publishing one moves every post's `lastmod`. Until `ONLY=` merges, the house rule "only reseed after real edits" can't be followed exactly.
- **Gap.** `updatedAt` changes on every save, including typo fixes and `RESEED_COVERS=1`. A separate "content updated" date field could drive `lastmod`, `dateModified` and a visible label.
- **Gap.** The page shows only an unlabeled publish date. Google asks for visible dates labeled "Published" or "Last updated" that match the structured data [S12].
- **Gap.** Static routes and category pages report `lastModified: now` (`src/app/sitemap.ts`). That is neither consistent nor verifiable, and it may teach Google to discount our `lastmod` in general (our inference from [S10] and [S11]). Google allows leaving `lastmod` off pages whose change date you don't know [S11].
- **Done in code (harmless).** `changeFrequency` and `priority` are set, but Google ignores both [S11].

### 2.8 Crawling, indexing, AI crawlers

- **Done in code.** `src/app/robots.ts` allows everything except `/admin/`, `/api/`, `/cms/` and `/cms-api/`, names the AI crawlers, and points to the sitemap.
  - **The search crawlers decide citations:** OAI-SearchBot for ChatGPT search [S27], PerplexityBot for Perplexity [S32], Claude-SearchBot for Claude [S31].
  - **The training crawlers don't:** GPTBot, ClaudeBot and CCBot are for training, and blocking them wouldn't remove us from ChatGPT or Claude search ([S27], [S31]). Google-Extended "does not impact a site's inclusion in Google Search" [S22].
  - Allowing all of them is a deliberate choice for content we want cited.
- **Gap (tidy, low priority).** The named list is missing `Claude-SearchBot` and `Claude-User`, and still includes `Claude-Web` and `anthropic-ai`, which Anthropic's current page no longer lists [S31]. Nothing is blocked today, because the `*` rule has the same allow list.
- **Done in code.** Posts set no `nosnippet`, `noarchive` or `nocache`. Google's AI features need a page that is indexed and eligible for a snippet [S18], and Bing says `NOARCHIVE` keeps content out of Copilot [S24]. **Author rule:** keep it that way.
- **Author rule (ops, at launch).** Every route returns 503 until `MAINTENANCE_MODE=off` (`docs/maintenance-mode.md`), so nothing is indexed yet. At launch, submit `/sitemap.xml` in Search Console and Bing Webmaster Tools; the ping endpoint was retired in 2023 [S11]. Bing counts beyond its own results: ChatGPT search uses third-party search providers, and OpenAI's help center names Bing ([S29], [S30]).
- **Done in code: `/llms.txt`** (`src/app/llms.txt/route.ts`). It is a **proposal** (Jeremy Howard, 2024; v2 August 2026), not a standard [S34]. Google says Search doesn't use it [S19]. SE Ranking found it on 10.13% of ~300,000 domains, with no correlation to AI citations [S35]. Keep it, since it's harmless and almost free, but expect nothing from it.
- **Gap: IndexNow. Worth it? A little, after launch.** It notifies Bing, Yandex, Naver, Seznam, Yep and Amazon, but not Google [S26]. Bing recommends it for keeping Copilot current [S24]. It doesn't guarantee indexing [S26]. With about ten posts and a sitemap, it mostly shortens Bing's pickup time. It's cheap (a key file plus one POST per `ONLY=` publish), so it's a reasonable small follow-up once Bing Webmaster Tools is set up.

### 2.9 Measurement

- **Done in code.** GA4 with Consent Mode v2 (`src/app/(frontend)/layout.tsx`). Analytics stays off until a visitor accepts, so GA4 undercounts.
- **Author rule.** Search Console is the source of truth for Google. AI Overviews and AI Mode are counted in the Performance report's "Web" search type [S18]. The Generative AI performance report (open to all sites since 2026-08-31) breaks impressions down by page, country, device and date [S21].
- **Author rule.** In Bing Webmaster Tools, AI Performance shows which pages Copilot cites, and the grounding queries behind them [S25].
- **Author rule.** ChatGPT referrals arrive tagged `utm_source=chatgpt.com` [S28]; segment on that in GA4.
- **Author rule.** Treat third-party "AI visibility" scores as estimates, and check any SEO or GEO advice against official documentation [S23].

---

## 3. Myths we ignore

| Myth | Reality |
|---|---|
| Aim for a keyword density. | Keyword stuffing breaks the spam policies [S3]. It gave no lift in the GEO study [S33], and Bing counts it as abuse [S24]. |
| Longer ranks better. | "No magical word count target, minimum or maximum" [S6]. Writing to a word count is search-engine-first [S1]. |
| Bump the date or `lastmod` to look fresh. | Google trusts only an accurate `lastmod`, and it counts dates changed without real change as search-engine-first ([S10], [S1]). |
| Meta keywords or schema `keywords` help. | Google doesn't use the keywords meta tag [S6] and doesn't list `keywords` for Article [S13]. |
| llms.txt gets you cited. | Google doesn't use it [S19], and no study has found a citation effect [S35]. |
| FAQ markup earns rich results. | Not for any site since 2026-05-07 [S17]. |
| Chunk everything for AI. | Google says it's not needed [S19]. |
| `changefreq` and `priority` steer crawling. | Google ignores both [S11]. |
| Ping the sitemap after publishing. | That endpoint now returns 404 [S11]. |
| E-E-A-T needs named author bios. | E-E-A-T is not a ranking factor [S6], and an organization can be the author [S13]. |
| There's an ideal number of headings. | "No magical, ideal amount of headings" [S6]. |
| AI-written content is penalized. | Using AI is fine. Scaled pages that add nothing are the problem ([S2], [S3]). |

---

## 4. Sources

All accessed 2026-09-18. Where a page shows its own "last updated" date, it is included.

- **S1.** Google Search Central, "Creating helpful, reliable, people-first content" (updated 2025-12-10). https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- **S2.** Google Search Central, "Google Search's guidance on using generative AI content on your website". https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- **S3.** Google Search Central, "Spam policies for Google web search" (updated 2026-08-28). https://developers.google.com/search/docs/essentials/spam-policies
- **S4.** Google Search Central, "Influencing title links in Google Search" (updated 2025-12-10). https://developers.google.com/search/docs/appearance/title-link
- **S5.** Google Search Central, "Control your snippets in search results" (updated 2026-04-20). https://developers.google.com/search/docs/appearance/snippet
- **S6.** Google Search Central, "SEO Starter Guide" (updated 2025-12-10). https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **S7.** Google Search Central, "Link best practices for Google" (updated 2025-12-10). https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- **S8.** Google Search Central, "Image SEO best practices" (updated 2026-03-02). https://developers.google.com/search/docs/appearance/google-images
- **S9.** Google Search Central, "Google Discover and your website" (updated 2026-03-09). https://developers.google.com/search/docs/appearance/google-discover
- **S10.** Google Search Central, "Build and submit a sitemap" (updated 2026-07-08). https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- **S11.** Google Search Central Blog, "Sitemaps ping endpoint is going away" (2023-06-26). https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
- **S12.** Google Search Central, "Influence your byline dates in Google Search". https://developers.google.com/search/docs/appearance/publication-dates
- **S13.** Google Search Central, "Article structured data" (updated 2026-09-08). https://developers.google.com/search/docs/appearance/structured-data/article
- **S14.** Google Search Central, "Breadcrumb structured data" (updated 2026-09-08). https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- **S15.** Google Search Central, "General structured data guidelines" (updated 2026-07-10). https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- **S16.** Google Search Central Blog, "Changes to HowTo and FAQ rich results" (2023-08-08). https://developers.google.com/search/blog/2023/08/howto-faq-changes
- **S17.** Google Search Central, "Latest documentation updates" (FAQ rich results gone from 2026-05-07, docs removed June 2026; spam policies cover AI responses, May 2026; breadcrumbs desktop-only, 2025-01-22). https://developers.google.com/search/updates
- **S18.** Google Search Central, "AI features and your website" (updated 2025-12-10). https://developers.google.com/search/docs/appearance/ai-features
- **S19.** Google Search Central, "Optimizing for generative AI features on Google Search" (updated 2026-07-10). https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- **S20.** Google Search Central Blog, "Top ways to ensure your content performs well in Google's AI experiences on Search" (2025-05-21). https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search
- **S21.** Google Search Central Blog, "Introducing Search Generative AI performance reports in Search Console" (2026-06-03; all sites since 2026-08-31). https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- **S22.** Google Crawling Infrastructure, "Google's common crawlers" (Google-Extended; updated 2026-07-14). https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- **S23.** Google Search Central, "Google Search's guidance on using third-party SEO tools, services, and advice" (2026-06-05). https://developers.google.com/search/docs/fundamentals/third-party-seo
- **S24.** Microsoft Bing, "Bing Webmaster Guidelines". https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- **S25.** Microsoft Bing, "AI Performance in Bing Webmaster Tools". https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
- **S26.** IndexNow.org, "FAQ". https://www.indexnow.org/faq
- **S27.** OpenAI, "Overview of OpenAI crawlers". https://developers.openai.com/api/docs/bots
- **S28.** OpenAI Help Center, "Publishers and developers FAQ". https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- **S29.** OpenAI, "Introducing ChatGPT search". https://openai.com/index/introducing-chatgpt-search
- **S30.** OpenAI Help Center, "ChatGPT search" (names Bing as a third-party search provider). https://help.openai.com/en/articles/9237897-chatgpt-search
- **S31.** Claude Help Center, "Does Anthropic crawl data from the web, and how can site owners block the crawler?". https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- **S32.** Perplexity, "Perplexity crawlers". https://docs.perplexity.ai/guides/bots
- **S33.** Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande, "GEO: Generative Engine Optimization", KDD 2024 (arXiv:2311.09735 v3). https://arxiv.org/abs/2311.09735 (full text: https://arxiv.org/html/2311.09735v3)
- **S34.** Jeremy Howard, "The /llms.txt file, v2" (proposal; published 2024-09-03, modified 2026-08-10). https://llmstxt.org/
- **S35.** SE Ranking (Yulia Deda), "Does LLMs.txt impact your AI visibility and citations?" (2025-11-07). https://seranking.com/blog/llms-txt/

[S1]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
[S2]: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
[S3]: https://developers.google.com/search/docs/essentials/spam-policies
[S4]: https://developers.google.com/search/docs/appearance/title-link
[S5]: https://developers.google.com/search/docs/appearance/snippet
[S6]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
[S7]: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
[S8]: https://developers.google.com/search/docs/appearance/google-images
[S9]: https://developers.google.com/search/docs/appearance/google-discover
[S10]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
[S11]: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
[S12]: https://developers.google.com/search/docs/appearance/publication-dates
[S13]: https://developers.google.com/search/docs/appearance/structured-data/article
[S14]: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
[S15]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
[S16]: https://developers.google.com/search/blog/2023/08/howto-faq-changes
[S17]: https://developers.google.com/search/updates
[S18]: https://developers.google.com/search/docs/appearance/ai-features
[S19]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
[S20]: https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search
[S21]: https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
[S22]: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
[S23]: https://developers.google.com/search/docs/fundamentals/third-party-seo
[S24]: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
[S25]: https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
[S26]: https://www.indexnow.org/faq
[S27]: https://developers.openai.com/api/docs/bots
[S28]: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
[S29]: https://openai.com/index/introducing-chatgpt-search
[S30]: https://help.openai.com/en/articles/9237897-chatgpt-search
[S31]: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
[S32]: https://docs.perplexity.ai/guides/bots
[S33]: https://arxiv.org/abs/2311.09735
[S34]: https://llmstxt.org/
[S35]: https://seranking.com/blog/llms-txt/
