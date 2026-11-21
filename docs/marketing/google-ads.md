# Google Ads: setup and first campaign

The first campaign is one Search campaign, US only, at $10 a day ($300 a month).
This page covers the account setup, how conversions are tracked, the campaign
build (settings, keywords, ad text) and the weekly routine. The research behind
it was done on 2026-11-22. Google changes defaults often, so re-check a setting
if its screen doesn't match.

The code side is in `src/lib/ads.ts` and `src/lib/consent.ts` (PR #136). The
region block lets Google's crawlers through (PR #137), so ad review can reach the
landing pages.

---

## 1. Account setup (once)

1. **Create the account** at [ads.google.com](https://ads.google.com) with the
   company Google account.
   - **Choose the new-advertiser credit offer when you sign up.** On 2026-11-20 it
     was "spend $500 in the first 60 days, get $500 in credit". The offer has to be
     picked at sign-up, with the payment method added then, and only spend after
     that counts. $10 a day for 60 days qualifies.
   - Click **"Switch to Expert Mode"** and create the account **without a
     campaign**. The guided flow builds a Performance Max or Smart campaign, which
     is wrong for this budget.
   - **Time zone:** pick the team's working time zone. **It can't be changed
     later.** Currency: USD.
2. **Auto-tagging:** Admin → Account settings → Auto-tagging → on. This adds
   `?gclid=` to ad clicks, which everything below depends on.
3. **Advertiser verification:** start it now (Admin → Advertiser verification).
   It can take up to 5 business days.
4. **Link Google Analytics:** Tools → Data manager → Google Analytics (GA4) →
   link property `G-50ZT6S22C6`. Don't import GA4 events as **Primary**
   conversions: the Ads tag already counts leads, so they'd be counted twice.

## 2. Conversion actions

Create these in **Goals → Conversions → New conversion action**.

| Name | Source | Category | Count | Value | Goal |
|---|---|---|---|---|---|
| Lead form submit | Website, **manual setup with code** | Submit lead form | One | none | **Primary** |
| Deposit paid | Import → clicks (offline upload) | Purchase | One | $25 USD | Secondary at first |
| Search fee paid | Import → clicks (offline upload) | Purchase | One | $99 USD | Secondary at first |

- **Lead form submit:** Google shows a conversion ID (`AW-…`) and a conversion
  label. Put both in `src/lib/ads.ts` (`GOOGLE_ADS_ID`, `ADS_LEAD_LABEL`) and
  deploy. Until then no Ads tag loads.
- **Enhanced conversions:** turn it on in the conversion settings, choose
  "Google tag" as the method, and accept the customer data terms. The site already
  passes the email and phone (`trackLead()`); Google hashes them before sending.
- **Deposits and fees as Secondary for 2–3 weeks:** they're reported but not
  bid on. Switch them to Primary once uploads are flowing and they look right.
- **Checking it works:** Tag Assistant from the conversion's page, then submit a
  real test lead from a US connection. The status moves from Unverified to
  Recording within about a day. Enhanced conversions diagnostics need about 72
  hours.

## 3. Uploading deposits and fees (offline conversions)

Deposits and success fees are paid on Stripe Payment Links the team sends, so
the site can't report them. They're uploaded against the ad click instead:

1. In `/admin/leads`, open the lead. If the visit came from an ad, **Record**
   shows **Google Ads click (gclid)** (or `gbraid` / `wbraid`).
2. In Google Ads: **Goals → Uploads** (or **Data Manager**, which Google is moving
   uploads to). Download Google's CSV template and fill in one row per payment:
   - the click ID, in the column for its type
   - the conversion name, exactly "Deposit paid" or "Search fee paid"
   - the conversion time, with time zone, e.g. `2026-11-24 14:05:00-0500`
   - the value (`25` or `99`) and currency `USD`
3. Upload once a week. Rules:
   - Clicks are accepted for 90 days.
   - A click less than 6 hours old is rejected.
   - gbraid/wbraid rows can take up to 72 hours to process.

There's no click ID for visitors in the EEA, UK or Switzerland, or for visitors
who declined cookies. That's expected; the campaign targets the US. Automate the
upload (a Google Sheet that Data Manager pulls from) once there are more than
about 5 payments a month.

## 4. The campaign

### Settings

| Setting | Value |
|---|---|
| Campaign type | **Search** (not Performance Max, Demand Gen or Smart) |
| Goal | Leads, with "Lead form submit" as the conversion goal |
| Networks | **Search Partners off. Display Network off.** Both default to on. |
| AI Max for Search | **Off**: search-term matching, text customization and final-URL expansion. It's on by default in new campaigns, adds broad matching, and ignores pinned headlines. |
| Locations | United States. Location options: **Presence** ("people in or regularly in"), not the default "Presence or interest". |
| Excluded locations | India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Maldives. The site is blocked there, so a click would be wasted. |
| Languages | English |
| Budget | $10/day. Google can spend up to 2× on a single day, but never more than 30.4× in a month. |
| Bidding | **Maximize clicks, max CPC limit $3.50.** Move to Maximize conversions at about 15 conversions a month, which is probably months away at this budget. |
| Ad schedule | All hours to start; trim from the hour-of-day report later |
| Auto-applied recommendations | **Off** (Recommendations → Auto-apply) |
| Account-level automated assets | **Off** (Assets → Account-level automated assets) |
| Final URLs | Always `https://www.savermiles.com/…`. The bare domain redirects, which slows the ad check. |
| Audiences | Add **"All visitors (Google Ads)"** in **Observation** mode, not Targeting. See section 6. |

### Ad group A: "Award booking service" → `https://www.savermiles.com/individual`

Phrase match (in quotes) plus one exact match:

```
"award booking service"
[award booking service]
"award booking services"
"award flight booking service"
"award travel booking service"
"award travel agent"
"points and miles concierge"
"award booking concierge"
"miles booking service"
"help booking award flights"
```

### Ad group B: "Business class with points" → `https://www.savermiles.com/how-it-works`

```
"book business class with points"
"book first class with points"
"business class with miles"
"use credit card points for business class"
"business class award seat"
"first class award flights"
"redeem miles for business class"
"help using points for flights"
```

Don't use broad match: it needs Smart Bidding and spends a small budget on loose
matches. Don't bid on competitor brand names (point.me, Seats.aero, Roame,
AwardTool) for now. Those searchers mostly want that site, and AI text features
can put the brand name into our ad.

### Negative keywords (campaign level, phrase match)

Negative keywords don't match plurals or close variants, so the list includes them.

```
free, jobs, job, career, careers, hiring, salary, course, courses, certification,
login, "log in", "sign in", app, download, "customer service", "phone number",
"cheap flights", "cheap flight", apply, application, approval, "credit score",
"best credit card", "best credit cards", "credit card offers", "award chart",
calculator, reddit, flyertalk, "buy miles", "sell miles", hotel, hotels, cruise,
cruises, baggage, "check in", economy, refund, cancel, cancellation, expire, expiring
```

### Responsive search ad (one per ad group to start)

Every line was checked against Google's limits: headlines up to 30 characters,
descriptions up to 90. Leave headlines unpinned.

**Headlines (15)**

```
Award Seats Found by Humans
Saver Miles Award Concierge
A Real Person Checks Your Seat
Fly Business Class on Points
First Class With Card Points
Book Business Class With Miles
$25 Deposit, Back If No Seat
$99 Only If We Find a Seat
Verified Before You Transfer
Human Search, Not an Algorithm
Same-Business-Day Reply
Award Booking Concierge
Points & Miles Concierge
Tell Us Your Route & Dates
Start Your Award Search Today
```

**Descriptions (4)**

```
A real specialist finds a bookable business or first-class award seat for your points.
$25 deposit to start, refunded if we find nothing. $99 only when a seat is confirmed.
Some tools show seats that vanish. We check the seat is bookable before you transfer.
Send your route, dates and points balances. A specialist replies the same business day.
```

The copy follows the product rules in `AGENTS.md`: no customer counts, review
counts or dollar totals, no founder names, and "a real person checked this"
rather than "an algorithm found it". Prices and the turnaround must match the
site. If the deposit, the fee or the same-business-day promise changes, change
the ads the same day: Google treats a mismatch as misrepresentation.

### Assets (campaign level)

- **Sitelinks**, each with a short description:

  | Sitelink | Description | Page |
  |---|---|---|
  | How It Works | See how a specialist finds a seat | /how-it-works |
  | Pricing | $25 deposit, $99 only on success | /pricing |
  | Start a Search | Send your route and dates | /individual |
  | For Businesses | Award travel for your team | /business |

- **Callouts:** Human-Verified Seats · $25 Deposit to Start · $99 Only on Success ·
  Same-Business-Day Reply · No Logins Needed · You Keep Your Points
- **Structured snippet**, header "Service catalog": Award flight search · Seat
  verification · Award space alerts
- **Price asset** (needs at least 3 items, each matching `/pricing`; prices come
  from `PRICES_USD` in `src/lib/products.ts`): Search deposit $25 · Success fee $99
  · Weekly alerts $4.99/month.
- **Business name** "Saver Miles", and the **logo** from `public/img/`.

## 5. Launch checklist

- [ ] The $500 credit offer was applied at sign-up (Billing → Promotions).
- [ ] Auto-tagging is on; advertiser verification is started.
- [ ] `GOOGLE_ADS_ID` and `ADS_LEAD_LABEL` are deployed; Tag Assistant sees the Ads tag on `/` and `/individual`.
- [ ] A test lead from a US connection shows in Google Ads within a day, and the lead in `/admin/leads` shows a Google Ads click when it came from an ad click.
- [ ] Every setting in the table above matches, especially Search Partners, Display, AI Max, Presence and auto-apply.
- [ ] All ads and assets are "Eligible" or "Approved". Most are reviewed within 1 business day.

## 6. Remarketing

Visitors outside the EEA/UK/CH are added to Google's remarketing lists unless
they decline cookies or their browser sends Global Privacy Control. Google
creates the **"All visitors (Google Ads)"** segment automatically once the tag
is live.

- **Search ads:** a list must have about **1,000 active users** before it can
  target search ads. Until then, keep it on the campaign in **Observation**: it
  doesn't narrow anything, and the report shows whether returning visitors
  convert better. Then you can raise bids for them.
- **Display or YouTube remarketing** needs about **100 users**. A small
  remarketing campaign (e.g. $2–3/day taken from the $10) can make sense once
  the list is that big. Not before: it would spend on nobody.
- The banner, cookie policy and privacy policy already disclose remarketing (PR #136).

## 7. Weekly routine (first month)

Thanksgiving to Cyber Monday (Nov 26–30) is the first week, and clicks cost
more then.

- **Week 1:** confirm the ads are approved and serving. Every 2–3 days, check the
  **Search terms** report and add anything irrelevant as a negative keyword.
  Don't touch bidding.
- **Week 2:** look at impression share lost to rank (raise the CPC limit by
  about $1) versus lost to budget (leave it). Add search terms that convert as
  exact-match keywords. Check the location report.
- **Week 3:** check spend pace against the credit offer ($500 in 60 days is about
  $8.33/day). Add a second ad pointing to `/how-it-works`. Upload the week's
  deposits and fees (section 3).
- **Week 4:** compare against expectations, then decide whether to keep going,
  widen the keywords or stop.

**Expectations at $300/month** (travel benchmarks; niche search volume is
unverified until Keyword Planner is open):
- Clicks cost about $2–8, so roughly 40–140 clicks a month.
- That's about 2–8 lead-form submits a month, and fewer deposits.
- The campaign breaks even at about three paid searches with a found seat
  ($25 + $99 each).

**After 30 days, success looks like:**
- tracking proven end to end
- mostly relevant search terms
- a click-through rate near the travel average of about 9%
- 3 or more leads

**Warning signs:**
- Under 30 clicks: the keywords are too narrow.
- 100+ clicks with no leads: look at the landing page or the offer, not the ads.
