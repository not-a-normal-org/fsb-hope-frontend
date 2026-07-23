# Site Structure

## Sitemap

```
/                       Home — the "middle" page, splits to both audiences
/individual             Individual / points-enthusiast track
/business               Business / enterprise track
/alerts                 The two alert subscription products
/calculator             Standalone points value calculator (shareable, also embedded elsewhere)
/pricing                Shared pricing page — search products + alert products side by side
/how-it-works           Shared explainer, linked from both audience tracks
/about                  Company story — no founder names, no Upwork
/results                Case studies / testimonials (empty at launch, fills in after outreach campaign)
/blog                   Payload-powered blog index
/blog/[slug]            Individual blog post
/contact                General contact form + Cal.com booking option
/legal/privacy          Privacy policy
/legal/terms            Terms of service
```

That's the full page count for launch. Do not add a `/membership` or `/audit` page — those products don't exist yet per `00-context.md`.

## Page-by-page spec

### `/` — Home
The "middle" page representing the whole brand before someone self-identifies as individual or business.

- Hero: glass panel, shine-sweep headline, stat strip (14+ yrs, 23,000+ searches, 30+ programs — **no Upwork stat**)
- Audience fork: two large glass cards, "I'm booking for myself" → `/individual`, "I'm managing company travel" → `/business`
- Ghost vs. real availability explainer (shared section, applies to both audiences)
- Deal of the Week component (see `04-components-spec.md`)
- Alerts teaser — short section introducing the two alert products, links to `/alerts`
- Calculator teaser — compact version of the calculator with a "see full calculator" link to `/calculator`
- Newsletter signup band
- Footer

### `/individual`
- Tone: still within the locked blue glass system, but copy speaks directly to personal points, not organizational spend
- Hero: pain-first framing ("200,000 points sitting there and no idea what they're worth")
- Pricing shown: $25 deposit + $99 success fee, explained plainly, linked to full breakdown on `/pricing`
- Lead form: the individual multi-step flow (destination → points held → email/WhatsApp)
- Alerts cross-sell: Weekly Lookup Alert ($4.99/mo) positioned here as the natural next step after a one-off search
- Calculator embedded inline

### `/business`
- Tone: same visual system, copy shifts to ROI and account-level reliability
- Hero: speaks to travel spend and points strategy at the company level
- Pricing shown: $25 flat per search, positioned as the account-level entry point, linked to `/pricing`
- Lead form: the business multi-step flow (spend → route need → points budget → callback request)
- Cal.com booking embedded directly in the callback step (see `06-integrations-tech-stack.md`) — don't just capture contact info, let them actually book a time
- Alerts cross-sell: Human Search Alert ($99.99) positioned here for accounts with recurring, high-stakes travel needs

### `/alerts`
Dedicated page for the two subscription alert products. See `03-products-and-pricing.md` for exact product copy and pricing rules. Layout: two glass cards side by side (stack on mobile), each with its own Stripe subscription checkout CTA.

### `/calculator`
Standalone version of the points-value calculator (see `05-calculator-spec.md`). Needs its own shareable URL because this is the most likely component to get shared on social/LinkedIn ("see what your points are worth"). Include an og:image / social share card.

### `/pricing`
All five products in one place: B2B search ($25), Individual search ($25 deposit + $99 success fee), Weekly Lookup Alert ($4.99/mo), Human Search Alert ($99.99), laid out as comparable glass cards. This is the source of truth for pricing — individual/business pages should link here rather than duplicating the full breakdown.

### `/how-it-works`
The 3-step process (tell us the route → we search manually → you get proof), shared, linked from nav and from both audience pages.

### `/about`
Company story, mission (help people actually use points they've earned), the manual-search differentiator, experience stats. No founder names, no Upwork, no prior company names.

### `/results`
Testimonial/case-study wall. Ships empty or with a "coming soon" state at launch — do not fabricate testimonials. Fills in once the first-client outreach campaign (already in progress) yields results with publish permission.

### `/blog` and `/blog/[slug]`
Payload-powered. See `06-integrations-tech-stack.md` for the CMS collection schema. Author byline should read "Saver Miles Team," never an individual name.

### `/contact`
General fallback contact form (not the primary conversion path — that's the individual/business lead flows) plus a Cal.com booking widget for anyone who wants to talk before submitting a search request.

## Navigation

Primary nav (all modes): Home · Individual · Business · Alerts · Pricing · How It Works · Blog · Contact, plus the 3-way mode switch (Light / Dark / Mono) and a primary CTA button ("Check My Route").

Footer: sitemap links, newsletter signup, legal links, mode switch repeated.
