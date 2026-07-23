# Component Spec

Build these as reusable components (React/Next.js). Every component pulls colors from the design tokens in `01-brand-design-system.md` — no hardcoded hex in component files.

## Layout / system components

### `<AmbientBackground mode="dark|light" variant="hero|section" />`
The 3-blob blurred background used behind every glass surface. Renders 3 absolutely-positioned blurred circles using `--sm-blob-1/2/3`. `variant="hero"` uses larger, more visible blobs; `variant="section"` uses smaller/subtler ones for below-the-fold sections so glass panels there don't compete with the hero.

### `<GlassPanel>`
Wraps children in the glass-panel recipe from the design system doc. Props: `padding`, `maxWidth`, `as` (for semantic HTML tag). Every card, form, and pricing tile composes this.

### `<ShineText as="h1|h2">`
Applies the metallic gradient shine-sweep animation to its text content. Used for hero headlines and major section headlines only — do not apply to body copy or it loses its impact as a signature element.

### `<ModeToggle />`
Three-way switch — **Light / Dark / Mono** — not a binary toggle. Persists choice (localStorage is fine for this specific UI preference, not for lead data), crossfades the whole page per the motion spec in `01-brand-design-system.md`. Every component that reads color tokens must handle all three states, including Mono's dark-only, no-hue token set — don't build components against just Light/Dark and bolt Mono on later, or CTAs and accents will silently fall back to blue in Mono mode.

### `<NavBar />` / `<Footer />`
Per sitemap in `02-site-structure.md`. NavBar is sticky, gets a backdrop-blur treatment consistent with the glass system when scrolled (not transparent-on-white).

## Marketing components

### `<StatStrip stats={[...]} />`
The 14+ yrs / 23,000+ searches / 30+ programs row. **Do not include an Upwork or ranking stat** — confirmed removed per `00-context.md`. Numeric values render in IBM Plex Mono.

### `<GhostVsRealCompare />`
Two-column comparison, "what automated tools show" vs "what Saver Miles delivers." Reuse the content pattern already written for the prelaunch page, restyle into glass cards side by side rather than the flat dark box used previously.

### `<AudienceFork />`
Home page only. Two large glass cards side by side ("I'm booking for myself" / "I'm managing company travel"), each routes to `/individual` or `/business`. This is the primary navigation decision of the entire site — give it real visual weight, not a small toggle.

### `<DealOfTheWeek />`
Displays one featured, real, human-verified award deal, refreshed weekly.

- Data source: a Payload CMS collection (`deals-of-week`, see `06-integrations-tech-stack.md`), so it's editable by Moon/Tanzil without a code deploy.
- Fields to display: route (e.g. "JFK → NRT"), cabin, points program + cost, a short one-line note on why it's a good value, and a "valid as of [date]" timestamp so it doesn't read as stale/evergreen.
- Must include a small disclosure that this specific deal may no longer be available by the time it's viewed — it's illustrative of real deals we find, not a live inventory feed. Suggested microcopy: *"Found and verified this week. Availability changes fast — request your own search to check your dates."*
- CTA: routes into the individual or business lead flow, pre-filling the route if the form supports query-param prefill.

### `<AlertProductCard product="weekly|human" />`
Renders one of the two alert products per the exact copy rules in `03-products-and-pricing.md`. Must render the phantom-flight disclosure inline, not hidden behind a tooltip or accordion — this is a trust requirement, not just a design choice.

### `<NewsletterBand />`
Single email field + submit, used in the footer and as a dedicated home page section. Copy should promise something specific, not generic ("Deal of the Week and points-value tips, once a week, no spam" rather than "Subscribe to our newsletter"). Submits to the newsletter capture endpoint — see integrations doc for schema.

### `<PointsCalculator variant="compact|full" />`
See `05-calculator-spec.md` for full logic. `compact` is the home-page teaser version (points input + single headline estimate), `full` is the `/calculator` page version (points input, program selector, multiple output scenarios).

## Lead capture components

### `<LeadFlowIndividual />`
Existing multi-step flow: destination/route → points held → email (required) + WhatsApp (optional) → confirmation. Rebuild inside the new glass system (each step is a `<GlassPanel>`), keep the existing validation logic and copy, which already matches brand voice.

### `<LeadFlowBusiness />`
Existing multi-step flow: yearly spend → yearly business-class need by region pair → current points budget → contact/callback request. On the final step, embed the Cal.com booking widget (see `06-integrations-tech-stack.md`) so the "request a free callback" action results in an actual booked time slot, not just a stored contact record.

### `<ContactForm />`
General-purpose form for `/contact`: name, email, message, submit. Separate from the two lead flows above — this is for people who don't fit neatly into "individual" or "business" self-identification (press, partnerships, general questions).

## Content components (Payload-driven)

### `<BlogIndex />` / `<BlogPost />`
Standard listing + detail rendering from the Payload `posts` collection. Byline always renders as "Saver Miles Team," pulled from a constant, not from a per-post author field that could leak a real name.

### `<TestimonialCard />`
Renders one testimonial from the `results` page. Ships with an empty-state variant ("Results are coming in — check back soon") for use before the first-client campaign yields published testimonials, per `02-site-structure.md`.

## State/data notes for all lead-capturing components

Every component that captures a lead (LeadFlowIndividual, LeadFlowBusiness, NewsletterBand, ContactForm, AlertProductCard checkout) must write to Supabase, not to artifact-style local/window storage — this is a real production site now, not the prelaunch prototype. See `06-integrations-tech-stack.md` for the schema.
