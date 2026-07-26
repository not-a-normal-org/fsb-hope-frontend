# Copy rewrite — current vs. updated

Voice: **customized for you, built for the AI era.** A concierge model, not self-serve. The core promise is "tell us your plans and forget them, a specialist is assigned to you, and getting the most out of your points is our job." We position against a broken award-travel system that we fix.

Deliberate word choices:
- Lead into **specialist / assigned to you / we take it from here / forget it**.
- The top-of-funnel lead magnet is a **points audit**, and the word **free** stays mostly on that one CTA rather than sprinkled everywhere.
- Ease off **"by hand"** and **"free"** repetition. The human is now framed as *your specialist*, not "a real person by hand" on every line.

Constraints still respected: no founder names or prior company name, no advertising a product that doesn't exist yet, no fabricated proof, no fake urgency, no unqualified "guarantee". No em-dashes in any new copy.

> Note: `AGENTS.md` lists "no AI claim in launch copy" as a non-negotiable. "Built for the AI era" is used here as brand positioning per direction from the owner. Flagged, not silently applied.

---

## 0. Site tagline — `src/lib/constants.ts`

**Current**
> Award search by hand, with AI when you want it

**Updated**
> Customized for you, built for the AI era

Also feeds the site `<title>` / `description` in `src/app/(frontend)/layout.tsx`.

A short positioning line to reuse (About hero, maintenance, decks):
> The award system was broken. We're here to fix it.

---

## 1. Nav bar — `src/components/site/NavBar.tsx`

**Current** (CTA)
> Check My Route

**Updated**
> Get a points audit

---

## 2. Home hero — `src/components/site/HomeHero.tsx`

**Eyebrow — current**
> 30+ Programs Checked By Hand

**Eyebrow — updated**
> Your Own Points Specialist

**Headline — current**
> Your points are sitting idle. We find out what they're actually worth.

**Headline — updated**
> The award system is broken. Your specialist makes it work for you.

**Body — current**
> A real person searches every major loyalty program by hand and sends proof — the exact seat and point cost. Real availability, not the stale inventory automated tools show.

**Body — updated**
> Tell us your plans and forget them. A specialist is assigned to your account, works every major loyalty program, and gets the most out of the points you already hold. You get a seat worth flying and the exact cost to book it.

**CTA (primary) — current**
> Check My Route — Free

**CTA (primary) — updated**
> Get a free points audit

**CTA (secondary)** — unchanged: `See How It Works`

---

## 3. Audience fork — `src/components/site/AudienceFork.tsx`

### Card 1 — Individual

**Title — current**
> Turn the points you earned into a seat worth flying.

**Title — updated**
> Hand your points to a specialist and forget the guesswork.

**Body — current**
> You have points and no clear way to use them well. We find the bookable award seat and show you exactly how to claim it.

**Body — updated**
> You have the points and no clear way to spend them well. We assign a specialist who finds the seat that's actually bookable and hands you exactly how to claim it.

### Card 2 — Business

**Title — current**
> Convert business travel spend into premium seats, reliably.

**Title — updated**
> Give your team's travel to a specialist who makes the points work.

**Body — current**
> Account-level search for teams that fly often. We handle the programs and the proof so your travel budget goes further.

**Body — updated**
> Account-level search for teams that fly often. A specialist handles the programs, the seats, and the proof, so your travel budget goes further and nobody on your side lifts a finger.

Kickers ("I'm booking for myself" / "I'm managing company travel") and CTAs stay.

---

## 4. Ghost vs. real — `src/components/site/GhostVsRealCompare.tsx`

**Headline — current**
> The tools show you availability. We show you a bookable seat.

**Headline — updated**
> The tools show you availability. Your specialist hands you a seat you can book.

**"What Saver Miles delivers" list — current**
> - A person opens the booking and confirms the seat
> - Proof: the exact seat and point cost
> - 30+ programs and transfer partners, searched together
> - Real availability on your dates, or an honest no

**Updated**
> - A specialist opens the booking and confirms your seat is really there
> - Proof in hand: the exact seat and the point cost
> - 30+ programs and transfer partners, worked through for you
> - Real availability on your dates, or an honest no

The "What automated tools show" list stays unflattering and unchanged.

---

## 5. Proof teaser — `src/components/site/CaseStudyTeaserView.tsx`

**Body — current**
> Not an algorithm's guess — a booking our team confirmed by hand, shared with the traveler's permission.

**Body — updated**
> Not an algorithm's guess. A booking a specialist confirmed and shared with the traveler's permission.

Heading ("A real person found this seat.") — updated to `A specialist found this seat.`

---

## 6. Alerts teaser — `src/components/site/AlertsTeaser.tsx`

**Headline — current**
> Not ready to book? Keep watching your routes.

**Headline — updated**
> Not ready to book yet? We'll keep watch on your routes for you.

**Weekly card body — current**
> An automated weekly scan of your routes. Cheap and broad — and honest that some space it surfaces may be phantom.

**Weekly card body — updated**
> An automated weekly scan of your routes. Broad and low cost, and honest that some of the space it surfaces may be phantom.

**Human card body — current**
> A real person checks your routes each cycle and sends verified results. The opposite of an automated feed.

**Human card body — updated**
> A specialist checks your routes every cycle and sends back verified results. The opposite of an automated feed.

---

## 7. Calculator teaser — `src/components/site/CalculatorTeaser.tsx`

**Headline — current**
> See what your points are roughly worth.

**Headline — updated**
> See what your points could be worth to you.

**Body — current**
> A quick estimate, not a live search. Enter a balance for a rough travel value — then run a real search to see what's actually bookable.

**Body — updated**
> A quick estimate to get you started. Enter your balance for a rough travel value, then let a specialist run the real audit to see what's actually bookable.

---

## 8. Footer — `src/components/site/Footer.tsx`

**Blurb — current**
> Real award seats, found by hand across 30+ loyalty programs — not the ghost availability automated tools show.

**Blurb — updated**
> Award travel is broken. We assign you a specialist who fixes it, working 30+ loyalty programs to get you a seat worth flying.

---

## 9. Individual page — `src/app/(frontend)/individual/page.tsx` + `IndividualBody.tsx`

**Hero intro — current**
> You earned them. We find the seat they can actually book — searched by hand, with proof of the exact point cost — so you finally use them for something worth flying.

**Hero intro — updated**
> You earned them. We assign a specialist who gets the most out of them, finds the seat they can actually book, and hands you the exact point cost. You just tell us where you want to go.

Hero title ("200,000 points, and no idea what they're worth.") stays.

**Steps — current**
> - **Tell us the trip** — Where you want to go and the points you hold. No account, no long form.
> - **A person searches** — We search your points by hand across 30+ programs — the routings tools miss.
> - **You get proof** — A screenshot and the exact point cost. You only pay the $99 fee if we find a bookable seat.

**Steps — updated**
> - **Tell us the trip** — Where you want to go and the points you hold. No account, no long form. Then forget it.
> - **A specialist takes over** — Your specialist works your points across 30+ programs, including the routings the tools miss.
> - **You get proof** — A screenshot and the exact point cost, sent straight to you. You only pay the $99 fee if we find a seat you can book.

**Pricing blurb — current**
> Then a flat $99 — any cabin — charged only once we confirm a bookable seat. Find nothing? Your deposit comes back in full.

**Pricing blurb — updated**
> Then a flat $99, any cabin, charged only once your specialist confirms a seat you can book. If we find nothing, your deposit comes back in full.

**Cross-sell body — current**
> The Weekly Lookup Alert watches your routes and tells you when award space opens up — $4.99/mo, cancel anytime.

**Cross-sell body — updated**
> The Weekly Lookup Alert keeps watch on your routes and tells you the moment award space opens up. $4.99/mo, cancel anytime.

---

## 10. Business page — `src/app/(frontend)/business/page.tsx` + `BusinessBody.tsx`

**Hero intro — current**
> For teams that fly often. We run account-level award searches by hand across 30+ programs and deliver proof — so your travel budget reaches further, reliably.

**Hero intro — updated**
> For teams that fly often. A specialist runs account-level award searches across 30+ programs and delivers the proof, so your travel budget reaches further without adding to anyone's workload.

**Section heading — current:** `Account-level search, done by hand`
**Updated:** `Account-level search, handled by a specialist`

**Steps — current**
> - **Send us the route** — The trip your team needs and the points or programs you hold. One request — no procurement dance.
> - **We search by hand** — A person searches 30+ programs and transfer partners for real, bookable business-class space — not the phantom seats tools surface.
> - **You get proof to book** — A screenshot and the exact point cost, per seat. Reliable enough to plan a team's travel around.

**Steps — updated**
> - **Send us the route** — The trip your team needs and the points or programs you hold. One request, then forget it.
> - **A specialist takes it from here** — Your specialist works 30+ programs and transfer partners for real, bookable business-class space, not the phantom seats the tools surface.
> - **You get proof to book** — A screenshot and the exact point cost, per seat. Reliable enough to plan a whole team's travel around.

**Pricing blurb — current**
> Charged once, when you submit — no subscription, no retainer. The account-level entry point for a team that flies often.

**Pricing blurb — updated**
> Charged once, when you submit. No subscription, no retainer. The account-level entry point for a team that flies often.

**Cross-sell body — current**
> For accounts with high-stakes travel that repeats, the Human Search Alert puts a real person on your routes every cycle — $99.99/mo, cancel anytime.

**Cross-sell body — updated**
> For accounts with high-stakes travel that repeats, the Human Search Alert keeps a specialist on your routes every cycle. $99.99/mo, cancel anytime.

---

## 11. About page — `src/app/(frontend)/about/page.tsx` + `AboutBody.tsx`

**Hero title — current**
> We do by hand what everyone else automated.

**Hero title — updated**
> The system was broken. We're here to fix it.

**Hero intro — current**
> Award tools are fast, free, and full of seats that aren't really there. Saver Miles is the opposite: a real person searches, verifies, and hands you a seat you can actually book.

**Hero intro — updated**
> Award tools are fast, cheap, and full of seats that aren't really there. Saver Miles is the opposite: a specialist assigned to you who sorts through the mess, verifies the seat, and hands you one you can actually book.

**Lead paragraph 2 — current**
> The tools that are supposed to help are fast, free, and full of seats that vanish the moment you try to book them. We started Saver Miles to do it the slow, correct way — search by hand, verify before you pay, and hand you a seat you can actually book.

**Updated**
> The tools that are supposed to help are quick, cheap, and full of seats that vanish the moment you try to book them. We built Saver Miles to fix that: assign you a specialist, get the most out of what you already hold, verify before you pay, and hand you a seat you can actually book.

**"Searched by a person, not a feed" card — current**
> - Title: Searched by a person, not a feed
> - Body: Award space changes by the minute and cached data lies. A real person searches 30+ programs and transfer partners by hand — including the routings automated tools skip.

**Updated**
> - Title: A specialist, not a feed
> - Body: Award space changes by the minute and cached data lies. Your specialist works 30+ programs and transfer partners, including the routings automated tools skip.

**"Verified before you commit" body — current**
> We open the booking and confirm the seat is really there, at the price we quoted, before you spend a point or a dollar.

**Updated**
> Your specialist opens the booking and confirms the seat is really there, at the price we quoted, before you spend a point or a dollar.

**"Delivered as proof" body — current**
> You get a screenshot and the exact point cost — something you can book, not a lead or a maybe.

**Updated**
> You get a screenshot and the exact point cost, something you can book, not a lead or a maybe.

**"How we charge" body — current**
> Flat fees for the work, listed in full on the pricing page. A business search is $25. An individual booking is a $25 deposit plus a $99 fee — and if we find nothing bookable, the deposit comes back. Ongoing alerts are monthly. That's the whole model.

**Updated**
> Flat fees for the work, listed in full on the pricing page. A business search is $25. An individual booking is a $25 deposit plus a $99 fee, and if your specialist finds nothing bookable, the deposit comes back. Ongoing alerts are monthly. That's the whole model, nothing hidden.

**Closing CTA heading — current**
> Find out what your points can actually book.

**Updated**
> Put a specialist on your points.

---

## 12. How it works — `src/app/(frontend)/how-it-works/page.tsx` + `Steps.tsx`

**Hero headline — current**
> Three steps, and a real person in the middle of them.

**Updated**
> Three steps, and a specialist doing the work in the middle.

**Hero intro — current**
> No automated tool surfacing seats that vanish at checkout. You tell us the route, a person searches by hand, and you get proof you can act on.

**Updated**
> No automated tool surfacing seats that vanish at checkout. You tell us the plan, a specialist takes over, and you get proof you can act on.

**Step 01 — current**
> Send us where you want to go and the points you hold. No account, no drawn-out form — just the trip you have in mind.

**Updated** (title `Tell us the plan`)
> Send us where you want to go and the points you hold. No account, no drawn-out form, just the trip you have in mind. Then forget it.

**Step 02 — current**
> A real person searches live award space across 30+ loyalty programs and transfer partners — the routings an automated tool misses, and the seats it wrongly shows as bookable.

**Updated** (title `A specialist works 30+ programs`)
> Your specialist searches live award space across 30+ loyalty programs and transfer partners, finding the routings an automated tool misses and skipping the seats it wrongly shows as bookable.

Step 03 reads cleanly and stays.

**Step CTAs — current:** `Start an individual search` / `For business`
**Updated:** `Get a free points audit` / `For business`

---

## 13. Pricing page — `src/app/(frontend)/pricing/page.tsx`

**Hero title — current**
> Pay for a person to find the seat.

**Updated**
> Put a specialist on your points.

**Hero intro — current**
> Two ways to search — once, or ongoing — plus alerts that keep watching your routes. Prices are flat and stated up front, and the one automated product says so plainly, right on its card.

**Updated**
> Two ways to search, once or ongoing, plus alerts that keep watch on your routes. Prices are flat and stated up front, and the one automated product says so plainly, right on its card.

**One-off group title — current**
> Pay per search. A person does the work.

**Updated**
> Pay per search. A specialist does the work.

**One-off group sub — current**
> No subscription. Submit what you need and a real person searches 30+ programs by hand, then sends proof.

**Updated**
> No subscription. Tell us what you need, a specialist works 30+ programs, then sends you the proof.

**Ongoing group title — current**
> Two ways to keep watching — one automated, one human.

**Updated**
> Two ways to keep watch on your routes: one automated, one specialist.

**Ongoing group sub — current**
> The difference is the whole point, so it's on the cards: a cheap automated scan that can surface phantom space, or a person checking your routes for real.

**Updated**
> The difference is the whole point, so it's on the cards: a low-cost automated scan that can surface phantom space, or a specialist checking your routes for real.

**Closing note — current**
> No countdown timers, no fake deadlines. If we can't find something bookable, we tell you — and on an individual search, your deposit comes back.

**Updated**
> No countdown timers, no fake deadlines. If we can't find something bookable, we tell you straight, and on an individual search, your deposit comes back.

---

## 14. Products — `src/lib/products.ts`

### Business Search

**Description — current**
> Submit a route and what you need. A real person searches 30+ loyalty programs by hand and sends back results — with screenshots and the exact point cost. Charged once, when you submit.

**Updated**
> Send us a route and what you need. A specialist works 30+ loyalty programs and sends back the results, with screenshots and the exact point cost. Charged once, when you submit.

**Features — current**
> - A person searches 30+ programs by hand
> - Screenshots and the exact point cost
> - Per-search billing — no subscription

**Updated**
> - A specialist works 30+ programs for you
> - Screenshots and the exact point cost
> - Per-search billing, no subscription

### Individual Search

**Tagline — current**
> Pay the fee only if we find a real seat.

**Updated**
> Pay the fee only if your specialist finds a real seat.

**Price sub — current**
> + $99 per person, per direction — charged only once we confirm a bookable seat.

**Updated**
> + $99 per person, per direction, charged only once we confirm a seat you can book.

**Description — current**
> We search the points you already hold, by hand, across programs. The $99 fee is flat — same for economy, business, or first.

**Updated**
> A specialist works the points you already hold across every program that fits. The $99 fee is flat, the same for economy, business, or first.

**Features — current**
> - $99 flat success fee, any cabin
> - Human-verified before you owe the fee
> - Only pay the fee on a confirmed, bookable seat

**Updated**
> - $99 flat success fee, any cabin
> - Verified by your specialist before you owe the fee
> - Only pay the fee on a confirmed, bookable seat

Footnote ("Find nothing bookable? Your $25 deposit comes back in full.") stays.

### Weekly Lookup Alert

**Disclosure — current**
> This is an automated scan, not a manual search — it shows availability, not flight numbers or booking-ready confirmation. Some listed space may be phantom: it appears in the data but won't hold at booking. For human-verified results, use the Human Search Alert or a one-off search.

**Updated**
> This is an automated scan, not a specialist search. It shows availability, not flight numbers or booking-ready confirmation. Some listed space may be phantom: it appears in the data but won't hold at booking. For verified results, use the Human Search Alert or a one-off search.

Tagline, description, and features stay.

### Human Search Alert

**Tagline — current**
> A real person checks your routes — 99.99% phantom-flight-proof.

**Updated**
> A specialist checks your routes, 99.99% phantom-flight-proof.

**Description — current**
> The same rigor as our one-off search, run as an ongoing service. A person checks your routes each cycle and sends verified results — the opposite of an automated scan.

**Updated**
> The same rigor as our one-off search, run as an ongoing service. A specialist checks your routes each cycle and sends verified results, the opposite of an automated scan.

**Features — current**
> - Human-run search, every cycle
> - Verified bookable space, not raw feed data
> - Monthly — cancel anytime

**Updated**
> - Specialist-run search, every cycle
> - Verified bookable space, not raw feed data
> - Monthly, cancel anytime

---

## 15. Alerts page — `src/app/(frontend)/alerts/page.tsx`

**Hero title — current**
> Keep watching your routes — automated, or by a person.

**Updated**
> Keep watch on your routes: automated, or a specialist.

**Hero intro — current**
> Award space comes and goes. Choose a cheap automated weekly scan, or a real person checking your routes each cycle. One can surface phantom space; the other is verified. The card says which.

**Updated**
> Award space comes and goes. Choose a low-cost automated weekly scan, or a specialist checking your routes each cycle. One can surface phantom space, the other is verified. The card says which.

---

## 16. Calculator page — `src/app/(frontend)/calculator/page.tsx` + `PointsCalculator.tsx`

**Hero intro — current**
> A quick estimate of what a balance could be worth in travel — and what it could realistically book. It's an estimate, not a live search; the real answer comes from checking your dates.

**Updated**
> A quick estimate of what your balance could be worth in travel, and what it could realistically book. It's a starting point, not a live search. The real answer comes from a specialist checking your dates.

**Calculator CTA — current:** `Run a free search`
**Updated:** `Get a free points audit`

Hero title, the calculator's inline labels, and the mandatory disclaimer stay.

---

## 17. Contact page — `src/app/(frontend)/contact/page.tsx`

**Hero title — current**
> Talk to a person.

**Updated**
> Talk to a specialist.

**Hero intro — current**
> Press, partnerships, or a question that doesn't fit a search request — reach us directly. If you're ready to search, the individual and business pages are the faster path.

**Updated**
> Press, partnerships, or a question that doesn't fit a search request: reach us directly. If you're ready to get the most from your points, the individual and business pages are the faster path.

**Notice body — current**
> A booking calendar is on the way. For now, email is the fastest way to reach a real person.

**Updated**
> A booking calendar is on the way. For now, email is the fastest way to reach a specialist.

---

## 18. Results page — `src/app/(frontend)/results/page.tsx`

**Empty-state body — current**
> We're a new brand doing the work by hand. Check back soon — or find out what your own points can book.

**Updated**
> We're a new brand, and every result here is one a specialist actually delivered. Check back soon, or find out what your own points can book.

Hero and empty-state heading stay.

---

## 19. Blog index — `src/app/(frontend)/blog/page.tsx` + `BlogIndex.tsx`

**Hero intro — current**
> Field notes from searching award space the manual way — what the tools miss, and how to actually use the points you have.

**Updated**
> Field notes from working award space the slow, correct way: what the tools miss, and how to actually use the points you have.

**Empty state — current**
> We're just getting started — the first posts are on the way. Check back soon.

**Updated**
> We're just getting started. The first posts are on the way, so check back soon.

---

## 20. Lead modal — `src/components/site/LeadModal.tsx`

**Success body — current**
> A real person will search your route by hand and email you the results — usually within a day. No account, no charge to look.

**Updated**
> A specialist is being assigned to your route and will email you the results, usually within a day. No account, and nothing to pay to look.

**Step 1 hint — current**
> One route or a few — wherever you're dreaming of.

**Updated**
> One route or a few, wherever you're dreaming of.

**Step 2 hint — current**
> Rough is fine — not sure? Just say so. It helps us find the best value.

**Updated**
> Rough is fine. Not sure? Just say so, it helps your specialist find the best value.

**Submit button — current:** `Start my search`
**Updated:** `Get my points audit`

Success heading ("We're on it."), step labels, and step 3 hint stay.

---

## 21. Maintenance page — `src/app/(frontend)/maintenance/page.tsx`

**Body — current**
> Award tools are full of seats that aren't there. We're building the fix — real award seats, found by hand. Launching soon.

**Updated**
> Award travel is broken, full of seats that aren't really there. We're building the fix: a specialist assigned to your points, getting you a seat worth flying. Launching soon.

Heading ("Under construction") and the email line stay.

---

## 22. Legal pages — `src/app/(frontend)/legal/privacy/page.tsx`, `terms/page.tsx`

Both read cleanly with no em-dashes. No changes needed.

---

## CTA map (top-of-funnel)

The lead entry point is now a **points audit**. These primary CTAs change:

| Location | Current | Updated |
|---|---|---|
| Nav bar | Check My Route | Get a points audit |
| Home hero | Check My Route — Free | Get a free points audit |
| How it works | Start an individual search | Get a free points audit |
| Calculator | Run a free search | Get a free points audit |
| Lead modal submit | Start my search | Get my points audit |

Product-action buttons that start a specific paid flow ("Start an individual search", "Start a business search", "Get weekly alerts", "Get human alerts") stay as-is, since they name the product, not the funnel.

---

## Notes for whoever applies this

- Match each file's existing quote/entity style (`&rsquo;`, curly `'`, `—`) when editing; replace any `—` with the punctuation shown above.
- "Built for the AI era" in the tagline is the one item that sits against the `AGENTS.md` "no AI claim" rule. Confirm it's intended before it ships publicly (the site is behind the construction wall and `noindex` today, so there's room to decide).
- `StatStrip` values (`14+ yrs`, `23,000+`) still carry the separate "confirm provenance before public" flag from `StatStrip.tsx`. Not a tone issue.
