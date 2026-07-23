# Products & Pricing — Source of Truth

If any page copy conflicts with this file, this file wins. Update this file first, then propagate.

## 1. Business search (B2B / Enterprise)

- **Price:** $25 flat per search
- **What it is:** A business submits a route/need, Saver Miles manually searches 30+ programs, delivers results with screenshots and exact point cost.
- **Billing:** One-time per search, charged on submission.
- **Copy rule:** Position as the account-level entry point for companies. This is the proven, unchanged model — do not alter the mechanics, only the presentation.

## 2. Individual search

- **Price:** $25 deposit to initiate (refunded in full if nothing bookable is found) + $99 flat success fee per person, per direction, charged only once a bookable award is confirmed.
- **Flat across cabin classes** (economy, business, first) at launch. This is a known simplification, flagged internally for review after 20–30 real bookings — do not change without that review happening first.
- **Copy rule:** Be explicit about the refund condition ("if we find nothing, your deposit comes back") — this is a trust signal, feature it, don't bury it in fine print.

## 3. Weekly Lookup Alert (NEW)

- **Price:** $4.99/month
- **Cadence:** One alert delivered every Monday, running for the next 12 months from signup.
- **What it shows:** Which airlines currently have award space on the customer's route(s) of interest, which transferable card programs (Amex MR, Chase UR, Citi TYP, Capital One, etc.) can transfer into those airline programs, the dates availability exists, and the total points required.
- **What it explicitly does NOT show:** Specific flight numbers, exact flight details, or booking-ready confirmation. This is a discovery/monitoring tool, not a booking service.
- **Phantom flight disclosure required:** Because this tier is not manually verified, some listed availability may be "phantom" (shows as available but isn't actually bookable when attempted). This must be disclosed clearly in the product copy and at signup — do not let a customer discover this after paying. Suggested copy: *"This is an automated weekly scan across programs. Some listed space may be phantom availability that doesn't hold at booking. For guaranteed, human-verified results, see the Human Search Alert or a one-off manual search."*
- **Billing:** Recurring monthly subscription via Stripe. Cancel-anytime.

## 4. Human Search Alert (NEW)

- **Price:** $99.99/month
- **Billing cadence: confirmed monthly recurring.**
- **What it is:** Fully manual, human-executed search — the same rigor as the core search product, positioned as an ongoing/alert-style service — advertised at 99.99% phantom-flight-proof.
- **Copy rule:** This is the premium tier of the alert products. Contrast directly against the Weekly Lookup Alert: "automated scan vs. real person checking." Do not overpromise "100% guaranteed" language — "99.99% phantom-flight-proof" is the ceiling of the claim, don't round it up to 100% in marketing copy even though the product name says "100% human search."

## 5. Relationship between all four products (for copy/positioning)

Think of these as a ladder, cheapest/lightest to most involved:

```
Weekly Lookup Alert ($4.99/mo)  → ongoing automated monitoring, no guarantee
Individual Search ($25 + $99)   → one-off, human-verified, pay only on success
Human Search Alert ($99.99/mo)  → ongoing human-verified monitoring
Business Search ($25/search)    → account-level, human-verified, per-search billing
```

Cross-sell logic: someone who does a one-off Individual Search and doesn't book should be offered the Weekly Lookup Alert as a "we'll keep watching for you" path. Someone on the Weekly Lookup Alert who wants certainty should be upsold to Human Search Alert or a one-off manual search.

## 6. What is explicitly NOT a product yet

- Company-level membership — not scoped. Do not build a page, pricing card, or Stripe product for this.
- Points-earning strategy audit layer — not built. Do not build a page, pricing card, or Stripe product for this.
- **AI evaluation (roadmap, post-launch).** A tool-search + AI read of a points
  balance, returning an evaluation within a day. The AI pipeline and API do not
  exist yet. It is a *future* product: do not build a page, pricing card, or
  Stripe product for it, and — per `00-context.md`'s "don't advertise products
  that don't exist" — do not reference it in any launch copy. When it ships it
  slots in *below* the manual search as the fast/broad, machine-read (not
  human-verified) option; the manual search stays the differentiator.

## 7. Universal copy rules for all products

- Never use the word "guarantee" unqualified. Every product either has a refund condition (Individual Search) or an explicit accuracy ceiling (Human Search Alert: 99.99%, not 100%).
- Every phantom-flight-risk product (Weekly Lookup Alert) must disclose that risk in the same view as the price, not on a separate FAQ page.
- No pricing anywhere should reference "for a limited time," fake urgency, or countdown timers. The Deal of the Week component (see `04-components-spec.md`) is real weekly content, not manufactured scarcity.
