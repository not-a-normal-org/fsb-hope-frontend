/**
 * English UI copy — the source dictionary. `de.ts` is typed against this file's
 * shape, so adding a key here without its German twin fails `tsc`.
 *
 * Conventions:
 * - `{name}` is a placeholder, filled with `fmt()` from `src/i18n/format.ts`.
 * - `<tag>…</tag>` marks inline markup (a link, emphasis), rendered with `rich()`
 *   from `src/i18n/rich.tsx`. Tags never nest.
 * - Prices are never written out: `{deposit}`, `{successFee}`, `{weeklyMonthly}`,
 *   `{weeklyAnnual}`, `{humanMonthly}`, `{humanAnnual}` and `{zero}` are filled in
 *   every string, in the locale's currency format, by `getMessages()` from
 *   `PRICES_USD` in src/lib/products.ts — so a price change is a one-line edit.
 * - Client components read only the namespaces listed in `CLIENT_NAMESPACES`
 *   (src/i18n/get-messages.ts) through `useI18n()`; page copy reaches its
 *   sections as props.
 * - Product copy rules still come from docs/plans/03-products-and-pricing.md, and
 *   the non-negotiables in docs/plans/00-context.md apply to every language.
 */
import { SITE_TAGLINE } from '@/lib/constants';

const en = {
  meta: {
    tagline: SITE_TAGLINE,
    organization:
      'A manual, human-run points-and-miles concierge. A real specialist searches award space by hand across 30+ loyalty programs and hands you a bookable seat with the exact point cost.',
  },

  /** Labels for every public route, shared by the nav bar, mobile menu, and footer. */
  links: {
    individual: 'Individual',
    business: 'Business',
    alerts: 'Alerts',
    pricing: 'Pricing',
    calculator: 'Calculator',
    blog: 'Blog',
    guides: 'Guides',
    deals: 'Deals',
    howItWorks: 'How It Works',
    about: 'About',
    results: 'Results',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
  },

  navGroups: {
    product: 'Product',
    read: 'Read',
    company: 'Company',
    legal: 'Legal',
  },

  nav: {
    home: 'Saver Miles home',
    getStarted: 'Get started',
    menu: 'Menu',
    closeMenu: 'Close menu',
    siteMenu: 'Site menu',
    theme: 'Theme',
  },

  footer: {
    blurb:
      'Award travel is broken. We assign you a specialist who fixes it, working 30+ loyalty programs to get you a seat worth flying.',
    newsletterHeading: 'Points intel, occasionally',
    newsletterButton: 'Join',
    copyright: '© {year} Saver Miles',
  },

  theme: {
    colorMode: 'Color mode',
    light: 'Light',
    dark: 'Dark',
    mono: 'Mono',
    current: 'Theme: {current}',
    cycle: 'Theme: {current} — switch to {next}',
  },

  language: {
    label: 'Language',
    /** Each language's own name, shown to readers of the other one. */
    names: { en: 'English', de: 'Deutsch' },
  },

  consent: {
    dialog: 'Cookie consent',
    eyebrow: 'Cookies',
    body: 'We use essential cookies to run the site and Google Analytics to measure aggregate traffic so we can improve it. No advertising, ever. See our <link>Cookie Policy</link>.',
    decline: 'Decline',
    accept: 'Accept',
    preferences: 'Cookie preferences',
  },

  notFound: {
    title: 'Page not found',
    eyebrow: '404',
    body: 'That page does not exist, or it moved. The home page is a good place to start again.',
    home: 'Back to the home page',
  },

  /** Structured data (JSON-LD) wording; never shown on the page. */
  seo: {
    serviceType: 'Award flight search by a human specialist',
  },

  /* ───────────── Shared widgets (client namespaces) ───────────── */

  /** Small pieces several components share. */
  common: {
    automatedLabel: 'Automated — read this',
    cabins: { economy: 'Economy', premium: 'Premium Economy', business: 'Business', first: 'First' },
    points: '{points} pts',
    startFlightRequest: 'Start your flight request',
    seeFullPricing: 'See full pricing',
    seeAlertPlans: 'See alert plans',
    seeFullProcess: 'See the full process →',
  },

  /** The track-record strip (home hero, /about). */
  stats: [
    { value: '14+', label: 'Years of experience' },
    { value: '23,000+', label: 'Searches run by hand' },
    { value: '30+', label: 'Loyalty programs' },
  ],

  /** The example Search Report card and its region tabs. */
  report: {
    regionsLabel: 'Example award bookings by region',
    regions: {
      asia: 'Asia',
      europe: 'Europe',
      australia: 'Australia',
      africa: 'Africa',
      americas: 'Americas',
    },
    example: 'Example report · #{id}',
    confirmed: 'Confirmed',
    taxes: '{taxes} taxes',
    retailFare: 'Retail fare',
    youPayPoints: ' · you pay points',
    transferFrom: 'Transfer from',
    seats: { one: '{n} seat · confirmed available', other: '{n} seats · confirmed available' },
    verified: 'Verified by hand',
  },

  /** Case-study cards and the /results/[slug] detail page. */
  caseStudy: {
    eyebrow: 'Case study',
    fallbackTitle: 'Case study',
    allResults: '← All results',
    from: 'From',
    to: 'To',
    cabin: 'Cabin',
    pointsUsed: 'Points used',
    program: 'Program',
    seeDetails: 'See details',
    bodyPending: 'The full write-up for this redemption is on the way.',
  },

  /**
   * The lead popup and its multi-step form. Option VALUES stay in the component
   * (they are stored in the database and read by staff); only labels live here.
   */
  lead: {
    close: 'Close',
    audience: {
      eyebrow: 'Get started',
      title: 'Are you an individual or a business?',
      hint: 'Pick one and we’ll ask the few questions that fit.',
      individual: { label: 'I’m an individual', hint: 'Booking for myself' },
      business: { label: 'I’m a business', hint: 'Managing company travel' },
    },
    step: 'Step {n} of {total}',
    back: 'Back',
    next: 'Next',
    sending: 'Sending',
    choose: 'Choose…',
    chooseOne: 'Choose one…',
    emailPlaceholder: 'you@email.com',
    phonePlaceholder: '+1 555 000 0000',
    notes: {
      label: 'Notes / preferences (optional)',
      placeholder: 'Anything else — airlines to avoid, occasion, layover limits…',
    },
    consent: 'By submitting you agree to our <link>Privacy Policy</link>.',
    errors: {
      email: 'Please enter a valid email address.',
      contact: 'Please add a WhatsApp or phone number so we can reach you.',
      route: 'Please tell us where you want to go.',
      generic: 'Something went wrong. Please try again.',
    },
    individual: {
      trip: {
        title: 'Where & when?',
        hint: 'Your destination and rough timing, exact dates optional.',
        where: 'Where to?',
        wherePlaceholder: 'e.g. New York → Tokyo, or JFK–NRT',
        nearby: 'I am flexible with nearby airports if there is a great deal',
        tripType: 'Trip type',
        when: 'When? (optional)',
        whenOneWay: 'e.g. mid-March, or an exact date',
        whenRoundTrip: 'e.g. mid-March, ~7 nights, or exact dates',
        flexibility: 'How flexible are your dates?',
      },
      tripTypes: { round_trip: 'Round trip', one_way: 'One-way' },
      flexibility: {
        flexible: 'Flexible — find me the best value',
        fixed: 'Fixed — these exact dates',
        unsure: 'Not sure yet',
      },
      travelers: {
        title: 'Who’s flying?',
        hint: 'Headcount and the cabin you’re after.',
        count: 'How many travelers?',
        cabin: 'Which cabin?',
      },
      travelerOptions: {
        '1': '1 traveler',
        '2': '2 travelers',
        '3': '3 travelers',
        '4': '4 travelers',
        '5': '5 travelers',
        '6+': '6+ travelers',
      },
      cabinOptions: {
        economy: 'Economy',
        premium: 'Premium economy',
        business: 'Business',
        first: 'First',
        any: 'Any / best value',
      },
      points: {
        title: 'Which points do you have?',
        hint: 'Rough is fine. Not sure? Just say so, it helps your specialist find the best value.',
        label: 'Points & miles (optional)',
        placeholder: 'e.g. ~120k Amex MR, 80k Chase UR — or “not sure”',
      },
      contact: {
        title: 'Where should we send your results?',
        hint: 'We’ll email a screenshot and the exact point cost, and message you if something needs a quick answer.',
        email: 'Email',
        phone: 'WhatsApp or phone',
      },
      submit: 'Send my flight request',
      successTitle: 'We’re on it.',
      successBody:
        'A specialist is being assigned to your route and will email you the results, usually within a day. No account, and nothing to pay to look.',
    },
    business: {
      spend: {
        title: 'Your team’s travel',
        hint: 'Rough numbers are fine — this helps a specialist scope the account.',
        label: 'Roughly, annual flight spend?',
      },
      spendOptions: {
        'Under $50k': 'Under $50k',
        '$50k–$150k': '$50k–$150k',
        '$150k–$500k': '$150k–$500k',
        '$500k+': '$500k+',
        'Not sure': 'Not sure',
      },
      routes: {
        title: 'What does your team fly?',
        hint: 'Routes, cabins, and how often — as much or as little as you know.',
        label: 'Routes & cabins',
        placeholder: 'e.g. SFO/JFK → London & Singapore, business class, ~monthly',
      },
      budget: {
        title: 'Points, miles, or budget on hand?',
        hint: 'Any points pooled for travel, or a cash budget. Optional.',
        label: 'Points / budget (optional)',
        placeholder: 'e.g. 2M Amex Business MR, or ~$8k budget',
      },
      call: {
        title: 'Let’s set up a call',
        hint: 'A specialist will reach out to scope your account.',
        email: 'Work email',
        emailPlaceholder: 'you@company.com',
        phone: 'Phone (optional)',
        calendar:
          'Prefer to pick a time? Calendar booking is coming soon — for now a specialist will email you to schedule.',
      },
      submit: 'Request a callback',
      successTitle: 'Thanks — we’ll be in touch.',
      successBody:
        'A specialist will reach out to scope your account and set up a call, usually within a day.',
    },
    done: 'Done',
    home: 'Back to home',
  },

  /** The newsletter forms: footer, home band, and exit popup. */
  newsletter: {
    subscribe: 'Subscribe',
    airportLabel: 'Home airport',
    airportPlaceholder: 'Home airport (e.g. JFK)',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@email.com',
    consent: 'By subscribing you agree to our <link>Privacy Policy</link>.',
    errors: {
      airport: 'Please add your home airport.',
      email: 'Please enter a valid email.',
      generic: 'Something went wrong. Please try again.',
    },
    success: 'You’re in — check your inbox.',
    already: 'You’re already on the list.',
    inline: {
      title: 'Award space on your routes, emailed Monday.',
      body: 'Tell us your home airport — we’ll show you where your points can go from it.',
      notify: 'Notify me',
      confirm: 'Confirm',
      errors: {
        airport: 'Add your home airport first.',
        email: 'Enter a valid email.',
        generic: 'Something went wrong.',
      },
      success: 'You’re in — award space, every Monday.',
      watching:
        'Watching {airport} — where should we send it? By confirming you agree to our <link>Privacy Policy</link>.',
    },
    popup: {
      dialog: 'Newsletter signup',
      dismiss: 'Dismiss',
      eyebrow: 'Emailed every Monday',
      title: 'Watching a route? We’ll watch it too.',
      body: 'Give us your home airport and we’ll email where your points can actually go from it — verified space, once a week.',
      button: 'Notify me',
    },
  },

  /** The alert buy box and its Stripe checkout button. */
  checkout: {
    intervalLabel: 'Billing interval',
    monthly: 'monthly',
    annual: 'annual',
    perMonth: '/ month',
    perYear: '/ year',
    twoMonthsFree: '2 months free',
    emailLabel: 'Email (optional)',
    emailPlaceholder: 'you@email.com',
    subscribe: 'Subscribe',
    secure: 'Secure checkout via Stripe. Cancel anytime.',
    redirecting: 'Redirecting…',
    notConfigured: 'Checkout isn’t configured yet — this price is missing.',
    error: 'Something went wrong. Please try again.',
  },

  /* ───────────── Products (docs/plans/03 is the source of truth) ───────────── */

  /**
   * Product copy, keyed by product id. Ids, hrefs, and Stripe wiring live in
   * src/lib/products.ts; prices are the `{deposit}`-style placeholders above.
   * Copy rules (doc 03 §7): no unqualified "guarantee"; the phantom-risk product
   * discloses the risk in the same view as its price; no fake urgency.
   */
  products: {
    business: {
      name: 'Business Search',
      price: 'Custom',
      priceUnit: 'let’s talk',
      tagline: 'The account-level entry point for company travel.',
      description:
        'Send us a route and what you need. A specialist works 30+ loyalty programs and sends back the results, with screenshots and the exact point cost.',
      features: [
        'A specialist works 30+ programs for you',
        'Screenshots and the exact point cost',
        'Priced around your team’s travel',
      ],
      note: 'Tell us what your team needs and we’ll come back with a quote.',
      cta: 'Start a business search',
    },
    individual: {
      name: 'Individual Search',
      price: '{deposit}',
      priceUnit: 'deposit to start',
      priceSub:
        '+ {successFee} per person, per direction, charged only once we confirm a seat you can book.',
      tagline: 'Pay the fee only if your specialist finds a real seat.',
      description:
        'A specialist works the points you already hold across every program that fits. The {successFee} fee is flat, the same for economy, business, or first.',
      features: [
        '{successFee} flat success fee, any cabin',
        'Verified by your specialist before you owe the fee',
        'Only pay the fee on a confirmed, bookable seat',
      ],
      footnote: 'Find nothing bookable? Your {deposit} deposit comes back in full.',
      cta: 'Start an individual search',
    },
    weekly: {
      name: 'Weekly Lookup Alert',
      price: '{weeklyMonthly}',
      priceAnnual: '{weeklyAnnual}',
      priceUnit: '/ month',
      tagline: 'An early signal on routes you’re watching casually.',
      description:
        'Every Monday for 12 months, a scan of your routes: which airlines show award space, which card programs transfer in, the dates, and the points. Cheap enough to set and forget — a heads-up, not a booking.',
      features: [
        'Delivered every Monday, for 12 months',
        'Airlines, transfer partners, dates, points',
        'Cancel anytime',
      ],
      disclosure:
        'Automated scan — shows availability, not a confirmed seat, and some space may be phantom. For a booking you can rely on, use the Human Search Alert or a one-off search.',
      cta: 'Get weekly alerts',
    },
    human: {
      name: 'Human Search Alert',
      price: '{humanMonthly}',
      priceAnnual: '{humanAnnual}',
      priceUnit: '/ month',
      tagline: 'A specialist confirms the seat before you hear from us.',
      description:
        'The same rigor as our one-off search, run as an ongoing service. A specialist checks your routes each cycle and sends verified results, the opposite of an automated scan.',
      features: [
        'Specialist-run search, every cycle',
        'Verified bookable space, not raw feed data',
        'Monthly, cancel anytime',
      ],
      cta: 'Get human alerts',
    },
  },

  /* ───────────── Pages (passed to their sections as props) ───────────── */

  home: {
    title: 'Saver Miles - Done for You Award Concierge Service',
    hero: {
      eyebrow: 'Your Own Points Specialist',
      title: 'The award system is broken. Your specialist makes it work.',
      body: 'A real specialist works every major loyalty program with the points you already hold — and hands back a seat worth flying, with the exact cost to book it.',
      secondary: 'See How It Works',
      noCard: 'No card, no commitment.',
    },
    fork: {
      individual: {
        kicker: "I'm booking for myself",
        title: 'Hand your points to a specialist and forget the guesswork.',
        body: 'You have the points and no clear way to spend them well. We assign a specialist who finds the seat that’s actually bookable and hands you exactly how to claim it.',
        cta: 'For individuals',
      },
      business: {
        kicker: "I'm managing company travel",
        title: 'Give your team’s travel to a specialist who makes the points work.',
        body: 'Account-level search for teams that fly often. A specialist handles the programs, the seats, and the proof, so your travel budget goes further and nobody on your side lifts a finger.',
        cta: 'For business',
      },
    },
    pricingBand: {
      eyebrow: 'Straightforward pricing',
      title: '{successFee} per person, per direction. All cabins.',
      titleAccent: 'Only if you fly.',
      body: 'A {deposit} deposit starts your search — refunded in full if we find nothing bookable. The {successFee} success fee is charged only once your seat is confirmed.',
    },
    alertsTeaser: {
      eyebrow: 'Alerts',
      title: 'Not ready to book yet? We’ll keep watch on your routes for you.',
      weeklyPrice: '{weeklyMonthly}/mo',
      weeklyBody: 'An automated weekly scan of your routes — broad and low cost.',
      weeklyNote:
        'Automated scan: some listed space may be phantom and not hold at booking. It can’t confirm a seat or hand you a booking-ready result.',
      badge: 'Most accurate',
      humanPrice: '{humanMonthly}/mo',
      humanBody:
        'A specialist checks your routes every cycle — the opposite of an automated feed. <strong>They open the booking and confirm the seat before you hear from us.</strong>',
      compare: 'Compare the alert plans →',
    },
    compare: {
      eyebrow: 'Automated vs. by hand',
      title: 'The tools show you availability. Your specialist hands you a seat you can book.',
      ghostHeading: 'What automated tools show',
      realHeading: 'What a specialist delivers',
      ghost: [
        'Cached availability that may not book',
        'Phantom seats that vanish at checkout',
        'One program at a time, on the dates you thought to try',
        'A screenshot of a search, not a seat',
      ],
      real: [
        'A specialist opens the booking and confirms your seat is really there',
        'Proof in hand: the exact seat and the point cost',
        '30+ programs and transfer partners, worked through for you',
        'Real availability on your dates, or an honest no',
      ],
    },
    deals: {
      eyebrow: 'Where your points go',
      title: 'What your points are actually worth.',
      body: 'Typical business- and first-class award prices a specialist finds on these routes — with the cash fare you’d otherwise pay. Your dates and balance decide the real number; a search is where we find it.',
      cities: {
        tokyo: 'Tokyo',
        paris: 'Paris',
        sydney: 'Sydney',
        london: 'London',
        lisbon: 'Lisbon',
      },
      retail: 'retail',
      typicalRate: {
        economy: 'typical economy rate',
        premium: 'typical premium economy rate',
        business: 'typical business rate',
        first: 'typical first rate',
      },
      from: 'from',
      pts: 'pts',
      tileLabel: '{city}: {from} to {to}, {cabin}, from {points} points — start a flight request',
      footnote:
        'Illustrative typical award prices, not a live availability feed. A real person confirms the seat before you book.',
    },
    caseStudies: {
      eyebrow: 'Proof',
      title: 'A specialist found these seats.',
      body: 'Not an algorithm’s guess. Real bookings a specialist confirmed and shared with the traveler’s permission.',
      more: 'See more results →',
    },
    calculator: {
      eyebrow: 'Calculator',
      title: 'See what your points could be worth to you.',
      body: 'A quick estimate to get you started. Enter your balance for a rough travel value, then let a specialist run the real search to see what’s actually bookable.',
    },
    faq: {
      eyebrow: 'Questions',
      title: 'Answered before you ask.',
      items: [
        {
          q: 'What if you find nothing?',
          a: 'We tell you straight — no upsell, no “maybe”. On an individual search your {deposit} deposit comes back in full, to your original payment method.',
        },
        {
          q: 'How long does a search take?',
          a: 'Most searches come back within five business days, often sooner. Anything time-sensitive we flag the moment we find it.',
        },
        {
          q: 'Do you need my airline or credit-card logins?',
          a: 'No. Your points and your accounts stay yours. A specialist finds and confirms the space, then hands you the exact steps to book it yourself — we never ask for your passwords.',
        },
        {
          q: 'Who books the ticket — you or me?',
          a: 'You do. We do the finding and the verifying; you keep control and place the booking with the step-by-step we send. Prefer we handle more of it? Ask, and we’ll tell you what’s possible.',
        },
        {
          q: 'What if the seat disappears before I book it?',
          a: 'Award space can move. We flag anything time-sensitive, and if a seat we confirmed is gone before you book it, you don’t owe the {successFee} — we keep looking.',
        },
        {
          q: 'Is this a subscription?',
          a: 'An individual search is a one-off: a {deposit} deposit, plus {successFee} only when we confirm a seat you can book. Business pricing is custom, so we talk it through with you first. Alerts are the only monthly option, and you can cancel anytime.',
        },
      ],
      stillUnsure: 'Still unsure? <link>Ask us directly</link>.',
    },
  },

  /** Pricing-hero receipt: how the charge flows. */
  receipt: {
    heading: 'How you’re charged',
    badge: 'Only if you fly',
    rows: [
      { amount: '{deposit}', label: 'Deposit to start', sub: 'Refundable — held, not spent.' },
      { amount: '{successFee}', label: 'When a seat is confirmed', sub: 'Per person, per direction. Any cabin.' },
      { amount: '{zero}', label: 'If nothing’s bookable', sub: 'Your deposit comes back in full.' },
    ],
  },

  /** Alerts-hero example alert. */
  alertPreview: {
    label: 'Route alert · example',
    title: 'Award space found.',
    details: 'ANA · Business · 24 Oct · 2 seats',
    verified: 'Verified by hand — a specialist confirmed it this cycle.',
  },

  /** Business-hero example team booking. */
  teamBooking: {
    label: 'Team booking · example',
    confirmed: 'Confirmed',
    details: '4 travelers · Business · Mar 3–10',
    points: '320,000 pts',
    seats: '4 seats',
    retail: 'Retail',
    retailValue: '$34,800',
    bookedOnPoints: ' · booked on points',
    footer: 'Point cost per traveller, screenshots, one invoice.',
  },

  pricing: {
    title: 'Pricing',
    hero: {
      eyebrow: 'Pricing',
      title: 'Put a specialist on your points.',
      intro:
        'Two ways to search, once or ongoing, plus alerts that keep watch on your routes. Prices are flat and stated up front (business is quoted per account), and the one automated product says so plainly, right on its card.',
    },
    search: {
      label: 'One-off searches',
      title: 'Pay per search. A specialist does the work.',
      sub: 'No subscription. Tell us what you need, a specialist works 30+ programs, then sends you the proof.',
    },
    alerts: {
      label: 'Ongoing alerts',
      title: 'Two ways to keep watch on your routes: one automated, one specialist.',
      sub: "The difference is the whole point, so it's on the cards: a low-cost automated scan that can surface phantom space, or a specialist checking your routes for real.",
    },
    closing:
      'No countdown timers, no fake deadlines. If we can’t find something bookable, we tell you straight, and on an individual search, your deposit comes back.',
    /** Shown under the closing line when non-empty. English prices need no note. */
    currencyNote: '',
  },

  alerts: {
    title: 'Alerts',
    hero: {
      eyebrow: 'Alerts',
      title: 'Keep watch on your routes: automated, or a specialist.',
      intro:
        'Award space comes and goes. Choose an automated weekly scan, or a specialist checking your routes each cycle. One can surface phantom space, the other is verified. The card says which.',
    },
    subscribed: 'You’re subscribed — thank you. A confirmation is on its way to your email.',
    weeklyEyebrow: 'Weekly alert',
    humanEyebrow: 'Human alert',
  },

  individual: {
    title: 'For Individuals',
    hero: {
      eyebrow: 'For individuals',
      title: '200,000 points, and no idea what they’re worth.',
      intro:
        'You earned them. We assign a specialist who gets the most out of them, finds the seat they can actually book, and hands you the exact point cost. You just tell us where you want to go.',
    },
    howTitle: 'How it works for you',
    steps: [
      {
        title: 'Tell us the trip',
        body: 'Where you want to go and the points you hold. No account, no long form. Then forget it.',
      },
      {
        title: 'A specialist takes over',
        body: 'Your specialist works your points across 30+ programs, including the routings the tools miss.',
      },
      {
        title: 'You get proof',
        body: 'A screenshot and the exact point cost, sent straight to you. You only pay the {successFee} fee if we find a seat you can book.',
      },
    ],
    cost: {
      eyebrow: 'What it costs',
      price: '{deposit}',
      unit: 'deposit to start',
      body: 'Then a flat <strong>{successFee}</strong>, any cabin, charged only once your specialist confirms a seat you can book. If we find nothing, your deposit comes back in full.',
      cta: 'Start your search',
    },
    alerts: {
      title: 'Not ready to book a trip yet?',
      body: 'The Weekly Lookup Alert keeps watch on your routes and tells you the moment award space opens up. {weeklyMonthly}/mo, cancel anytime.',
    },
  },

  business: {
    title: 'For Business',
    hero: {
      eyebrow: 'For business',
      title: 'Turn company travel spend into premium seats.',
      intro:
        'For teams that fly often. A specialist runs account-level award searches across 30+ programs and delivers the proof, so your travel budget reaches further without adding to anyone’s workload.',
    },
    howTitle: 'Account-level search, handled by a specialist',
    steps: [
      {
        title: 'Send us the route',
        body: 'The trip your team needs and the points or programs you hold. One request, then forget it.',
      },
      {
        title: 'A specialist takes it from here',
        body: 'Your specialist works 30+ programs and transfer partners for real, bookable business-class space, not the phantom seats the tools surface.',
      },
      {
        title: 'You get proof to book',
        body: 'A screenshot and the exact point cost, per seat. Reliable enough to plan a whole team’s travel around.',
      },
    ],
    value: {
      eyebrow: 'What account-level search is worth',
      title: 'One quarter of team travel, on points instead of cash.',
      body: 'An illustrative quarter — the kind of spread a specialist turns into bookable business-class space across your team’s routes.',
      columns: { route: 'Route', team: 'Team', cash: 'Cash fare', points: 'On points' },
      rows: [
        { route: 'SFO → LHR · Business', team: '4 seats', cash: '$34,800', points: '320,000 pts' },
        { route: 'LAX → NRT · Business', team: '3 seats', cash: '$18,600', points: '225,000 pts' },
        { route: 'JFK → GRU · Business', team: '2 seats', cash: '$9,400', points: '150,000 pts' },
      ],
      total: 'Quarter total',
      totalCash: '$62,800',
      totalPoints: '695,000 pts',
      footer:
        'One invoice, the point cost per traveller, and a summary your finance team can sign off — not a pile of receipts.',
    },
    cost: {
      eyebrow: 'What it costs',
      price: 'Custom',
      unit: 'let’s talk',
      body: 'Every team flies differently, so business pricing is quoted per account. Tell us what you need and we’ll come back with a quote. The account-level entry point for a team that flies often.',
      cta: 'Start a business search',
    },
    alerts: {
      title: 'Recurring routes, watched by a person',
      body: 'For accounts with high-stakes travel that repeats, the Human Search Alert keeps a specialist on your routes every cycle. {humanMonthly}/mo, cancel anytime.',
    },
  },

  about: {
    title: 'About',
    hero: {
      eyebrow: 'About',
      title: 'The system was broken. We’re here to fix it.',
      intro:
        'Award tools are fast, cheap, and full of seats that aren’t really there. Saver Miles is the opposite: a specialist assigned to you who sorts through the mess, verifies the seat, and hands you one you can actually book.',
    },
    lead: 'Most people are sitting on points they can’t turn into anything good.',
    story:
      'The tools that are supposed to help are quick, cheap, and full of seats that vanish the moment you try to book them. We built Saver Miles to fix that: assign you a specialist, get the most out of what you already hold, verify before you pay, and hand you a seat you can actually book.',
    howTitle: 'How we actually work',
    how: [
      {
        title: 'A specialist, not a feed',
        body: 'Award space changes by the minute and cached data lies. Your specialist works 30+ programs and transfer partners, including the routings automated tools skip.',
      },
      {
        title: 'Verified before you commit',
        body: 'Your specialist opens the booking and confirms the seat is really there, at the price we quoted, before you spend a point or a dollar.',
      },
      {
        title: 'Delivered as proof',
        body: 'You get a screenshot and the exact point cost, something you can book, not a lead or a maybe.',
      },
    ],
    numbers: 'The numbers behind it',
    chargeTitle: 'How we charge',
    charge:
      'Flat fees for the work, listed in full on the pricing page. An individual booking is a {deposit} deposit plus a {successFee} fee, and if your specialist finds nothing bookable, the deposit comes back. Business pricing is quoted per account. Ongoing alerts are monthly. That’s the whole model, nothing hidden.',
    closing: 'Put a specialist on your points.',
    checkRoute: 'Check your route',
    seeHow: 'See how it works',
  },

  howItWorks: {
    title: 'How It Works',
    eyebrow: 'How it works',
    heading: 'Three steps, and a specialist doing the work in the middle.',
    intro:
      'No automated tool surfacing seats that vanish at checkout. You tell us the plan, a specialist takes over, and you get proof you can act on.',
    steps: [
      {
        title: 'Tell us the plan',
        body: 'Send us where you want to go and the points you hold. No account, no drawn-out form, just the trip you have in mind. Then forget it.',
      },
      {
        title: 'A specialist works 30+ programs',
        body: 'Your specialist searches live award space across 30+ loyalty programs and transfer partners, finding the routings an automated tool misses and skipping the seats it wrongly shows as bookable.',
      },
      {
        title: 'You get proof',
        body: 'We send back what’s actually bookable: a screenshot and the exact point cost. Real availability on your dates, or an honest “not yet.”',
      },
    ],
    forBusiness: 'For business',
  },

  calculator: {
    title: 'Points Calculator',
    hero: {
      eyebrow: 'Calculator',
      title: 'What are your points actually worth?',
      intro:
        'A quick estimate of what your balance could be worth in travel, and what it could realistically book. It’s a starting point, not a live search. The real answer comes from a specialist checking your dates.',
    },
    /** The calculator widget itself (full page and the home teaser). */
    widget: {
      balance: 'Points balance',
      /** Also the seeded starting value, so the result reads as a working example. */
      example: '185,000',
      roughly: 'Roughly worth',
      travelValue: 'in travel value · estimate only',
      startThat: '≈ {flight} — start that search →',
      openFull: 'Open the full calculator →',
      program: 'Program',
      programs: {
        flexible: 'Flexible / transferable (Amex, Chase, Citi, Cap One)',
        airline: 'A US airline program directly',
        mixed: 'Not sure / mixed',
      },
      estimated: 'Estimated travel value',
      enterBalance: 'Enter a balance',
      enoughFor: 'That’s roughly enough for',
      /** Rough, industry-typical flight equivalents — thresholds in src/lib/calculator.ts. */
      tiers: {
        domesticEconomy: 'a round-trip domestic economy ticket',
        domesticBusiness: 'a round-trip domestic business seat, or a one-way international economy ticket',
        intlBusinessOneWay: 'a one-way international business-class seat',
        intlBusinessRoundTrip: 'a round-trip international business-class trip',
        intlFirstOneWay: 'a one-way international first-class seat',
      },
      /** The exact, non-collapsible disclaimer required by docs/plans/05. */
      disclaimer:
        'These are estimates based on typical redemption values, not a live search. Actual value depends on real award availability on your dates. Run a free search to see what’s actually bookable.',
    },
  },

  contact: {
    title: 'Contact',
    hero: {
      eyebrow: 'Contact',
      title: 'Talk to a specialist.',
      intro:
        'Press, partnerships, or a question that doesn’t fit a search request: reach us directly. If you’re ready to get the most from your points, the individual and business pages are the faster path.',
    },
    heading: 'Email us',
    calendar:
      'A booking calendar is on the way. For now, email is the fastest way to reach a specialist.',
    cta: 'See how it works',
  },

  results: {
    title: 'Results',
    hero: {
      eyebrow: 'Results',
      title: 'Real results, as they come in.',
      intro:
        'We’d rather show you nothing than show you something made up. Verified bookings and client stories land here once they’re real and we have permission to share them.',
    },
    /** Shown above an English case study on a German URL until it is translated. */
    englishOnly: 'This case study is only available in English for now.',
    empty: {
      heading: 'Results are coming in',
      body: 'We’re a new brand, and every result here is one a specialist actually delivered. Check back soon, or find out what your own points can book.',
      cta: 'Check your route',
    },
  },

  blog: {
    title: 'Blog',
    description:
      'Guides to booking flights with points and miles, checked by a real specialist — not an algorithm.',
    home: 'Home',
    hero: {
      eyebrow: 'Blog',
      title: 'Notes on points, seats, and doing it by hand.',
      intro:
        'Field notes from working award space the slow, correct way: what the tools miss, and how to actually use the points you have.',
    },
    /** The searchable post grid (index and category pages). */
    index: {
      searchPlaceholder: 'Search posts…',
      searchLabel: 'Search posts',
      all: 'All',
      latest: 'Latest',
      readPost: 'Read the post',
      minutes: '{n} min',
      minutesRead: '{n} min read',
      results: { one: '{n} result', other: '{n} results' },
      empty: 'We’re just getting started. The first posts are on the way, so check back soon.',
      noMatch: 'No posts match “{query}”.',
      noneInCategory: 'No posts in this category yet.',
      clear: 'Clear filters',
    },
    post: {
      allPosts: '← All posts',
      minutesRead: '{n} min read',
      related: 'Related posts',
      pager: 'More posts',
      previous: 'Previous',
      next: 'Next',
      notFound: 'Not found',
      /** Shown above an English post on a German URL until it is translated. */
      englishOnly: 'This post is only available in English for now.',
    },
    /** Tailored hero copy for the categories the nav links to; others use their name. */
    category: {
      filedUnder: 'Everything we’ve filed under {name}.',
      guides: {
        title: 'Guides',
        intro:
          'How award travel actually works — step-by-step playbooks from real, by-hand searches, not an algorithm’s guess.',
      },
      deals: {
        title: 'Deals',
        intro:
          'Standout award space and fare finds our team turned up by hand. Time-sensitive by nature — move while they last.',
      },
    },
    feed: {
      description: 'Guides to booking flights with points and miles, checked by a real specialist.',
    },
    og: {
      tagline: 'Award search, by hand · savermiles.com',
    },
  },

  /* ───────────── Emails (server only; rendered in src/lib/*-email.ts) ───────────── */

  emails: {
    /** Sent by /api/newsletter on signup, in the language of the page it came from. */
    welcome: {
      subject: 'Welcome to Saver Miles ✈',
      title: 'Welcome to Saver Miles',
      greeting: 'Welcome aboard, {name}.',
      greetingNoName: 'Welcome aboard, there.',
      intro:
        "You're on the list. Saver Miles is a points-and-miles concierge: a real specialist searches award availability by hand, so you can fly premium cabins on the points you already hold. No algorithm, no guesswork — a person who does this all day.",
      listIntro: "Here's what we'll send your way:",
      items: [
        'Practical tips on earning and redeeming points',
        'Business- and first-class sweet spots most travelers miss',
        'How transfer partners and award charts actually work',
        'The occasional standout award we spot worth flying for',
      ],
      headStart:
        'Want a head start? Read our <link>points guides</link> or see exactly how a search works.',
      cta: 'See how it works →',
      /** Shown under the CTA when non-empty. */
      languageNote: '',
      footer:
        "You're receiving this because you signed up at savermiles.com. If this was a mistake, you can safely ignore this email.",
    },
  },
};

export default en;

export type Messages = typeof en;
