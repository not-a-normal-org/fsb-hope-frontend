# Points Value Calculator — Spec

**Status: logic below is placeholder/illustrative. Do not ship to production with these exact numbers without Moon/Tanzil validating them against current real-world redemption data.** An inaccurate calculator directly undermines the "we deal in real numbers, not guesses" brand promise — this is the one component where being wrong is worse than being late.

## Purpose

Let a visitor enter how many points they hold and get an approximate sense of what that's worth — both in dollar terms and in "what that could actually book." This is a lead-gen and engagement tool, not a booking engine. It should always route the visitor toward starting a real search for an exact answer, never claim to be precise itself.

## Inputs

1. **Points balance** (number input, required) — e.g. "185,000"
2. **Program** (optional dropdown) — Chase Ultimate Rewards, Amex Membership Rewards, Citi ThankYou Points, Capital One Miles, "an airline program directly" (with a sub-select of major US-relevant airline programs), "not sure / mixed"
3. **Home region** (optional, defaults to US) — affects which example routes are shown

## Output

Two things, always shown together:

1. **An estimated dollar value range**, using a blended conservative-to-strong redemption value per point (see valuation table below), displayed as a range, not a false-precision single number. E.g. "$1,850 – $3,700 in travel value" rather than "$2,775.00."
2. **Illustrative flight equivalents** — 2–3 example redemptions the balance could realistically cover, drawn from a threshold table (below), always labeled as illustrative. E.g. "That's roughly enough for one round-trip domestic economy ticket, or a one-way international business class seat on the right route."

Always include this exact disclaimer beneath the output, non-collapsible: *"These are estimates based on typical redemption values, not a live search. Actual value depends on real award availability on your dates. Run a free search to see what's actually bookable."* Follow with a CTA into the individual lead flow.

## Placeholder valuation table (needs real-data confirmation before launch)

Blended value per point, used to compute the dollar range (low end × points, high end × points):

| Program category | Low (¢/pt) | High (¢/pt) |
|---|---|---|
| Flexible transferable (Chase UR, Amex MR, Citi TYP, Cap One) | 1.3 | 2.2 |
| Major US airline program (direct-earned) | 1.0 | 1.8 |
| "Not sure / mixed" | 1.2 | 2.0 |

## Placeholder flight-equivalent threshold table (needs real-data confirmation before launch)

Used to generate the "illustrative flight equivalents" output. Pick the highest threshold the balance clears, show that plus one tier below if applicable.

| Points needed (approx) | Example redemption |
|---|---|
| 15,000 – 25,000 | Round-trip domestic economy |
| 50,000 – 80,000 | Round-trip domestic business / one-way international economy |
| 80,000 – 140,000 | One-way international business class |
| 150,000 – 220,000 | Round-trip international business class |
| 250,000+ | One-way international first class |

These thresholds are rough industry-typical figures and must be sanity-checked against what Saver Miles has actually seen in the 23,000+ searches performed before this ships — that real search history is a better source of truth than generic published averages, and using it would also be a genuine differentiator ("based on real searches we've run," not "based on published award charts").

## UI behavior

- Live-updates as the user types (debounced ~300ms), no submit button required for the estimate itself.
- `compact` variant (home page teaser): points input + single dollar-range output + "See full calculator" link.
- `full` variant (`/calculator` page): points input, program dropdown, region, dollar range, flight-equivalent cards, disclaimer, CTA into lead flow, and a shareable state (the result can be shared via a link with query params, and the page should render a social preview card showing the estimate — good organic-share mechanic for LinkedIn per the marketing plan).
- No data is required to be saved to use the calculator. Only if the visitor clicks through to the lead flow does actual lead capture begin.
