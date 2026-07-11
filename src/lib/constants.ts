import type {
  NavLink,
  CTAButton,
  PricingProduct,
  PricingHubCard,
  PricingComparisonRow,
  AlertTier,
  MembershipTier,
  FlightRoute,
  CaseStudy,
  StatItem,
  Feature,
  FAQItem,
  // PodcastEpisode, // Podcast disabled until we launch one
  TwoPathCard,
  MediaLogo,
  PageMeta,
} from "./types";

/* ========== SITE METADATA ========== */
export const SITE_NAME = "The Flights Club by iFLYflat";
export const SITE_TAGLINE = "Never Fly Economy Again.";
export const SITE_URL = "https://theflightsclub.com.au";

/* ========== COLORS ========== */
export const COLORS = {
  background: {
    primary: "#07090F",
    secondary: "#0E1220",
    card: "#13182A",
  },
  accent: {
    orange: "#E8963A",
    orange_light: "#F2AA5E",
    blue: "#3A6FE8",
    gold: "#C9A84C",
  },
  text: {
    primary: "#F5F5F0",
    secondary: "#9DA3B4",
    muted: "#5C6378",
  },
  border: {
    subtle: "#1E2538",
    glow: "rgba(232, 150, 58, 0.3)",
  },
};

/* ========== PRICING PRODUCTS ========== */
/**
 * The four product lines shown in the Pricing nav dropdown. Each links to its
 * dedicated detail page. The /pricing hub itself is driven by PRICING_HUB below.
 */
export const PRICING_PRODUCTS: PricingProduct[] = [
  {
    id: "flight-club",
    name: "Flight Club",
    href: "/membership",
    icon: "Users",
    tagline: "Ongoing membership",
    description:
      "Ongoing points strategy, concierge bookings, and guaranteed Business Class seats every year.",
    accent_color: "#E8963A",
  },
  {
    id: "points-concierge",
    name: "Points Concierge",
    href: "/points-concierge",
    icon: "Plane",
    tagline: "One trip, handled",
    description:
      "You already have the points. We find and book the Business Class seat for you.",
    accent_color: "#3A6FE8",
  },
  {
    id: "one-off-research",
    name: "One-off Research",
    href: "/research",
    icon: "FileSearch",
    tagline: "A single expert report",
    description:
      "A one-time deep-dive report on your best redemption options — no membership required.",
    accent_color: "#C9A84C",
  },
  {
    id: "alert-service",
    name: "Alert Service",
    href: "/alerts",
    icon: "BellRing",
    tagline: "Never miss a seat",
    description:
      "Real-time reward-seat availability alerts for the routes and dates you care about.",
    accent_color: "#F2AA5E",
  },
];

/* ========== STRIPE PRICE IDS (from NEXT_PUBLIC env vars) ========== */
/**
 * Central map of Stripe price IDs. NEXT_PUBLIC_* vars are inlined at build time,
 * so this is safe to reference from both server and client components.
 * Fill the *_RESEARCH and *_ALERTS_* vars in .env.local after creating the
 * products in Stripe (see the pricing plan's manual steps).
 */
export const STRIPE_PRICE_IDS = {
  explore:  process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPLORE  ?? "",
  platinum: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLATINUM ?? "",
  black:    process.env.NEXT_PUBLIC_STRIPE_PRICE_BLACK    ?? "",
  concierge: process.env.NEXT_PUBLIC_STRIPE_PRICE_CONCIERGE ?? "",
  research:  process.env.NEXT_PUBLIC_STRIPE_PRICE_RESEARCH  ?? "",
  alerts_essential_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_ESSENTIAL_MONTHLY ?? "",
  alerts_essential_annual:  process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_ESSENTIAL_ANNUAL  ?? "",
  alerts_pro_monthly:       process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_PRO_MONTHLY       ?? "",
  alerts_pro_annual:        process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_PRO_ANNUAL        ?? "",
} as const;

/* ========== PRICING HUB (/pricing) ========== */
export const PRICING_HUB: {
  hero: { label: string; title: string; subtitle: string };
  cards: PricingHubCard[];
  comparison: PricingComparisonRow[];
  bottom_cta: { headline: string; body: string; cta_label: string; cta_href: string };
} = {
  hero: {
    label: "Pricing",
    title: "Four ways to fly Business Class on points.",
    subtitle:
      "Whether you want us to handle everything, do it yourself with our help, or just know where your points stand — there's a path for where you are right now.",
  },
  cards: [
    {
      id: "flight-club",
      name: "Flight Club Membership",
      tagline: "I want Business Class every year, handled.",
      description:
        "Ongoing membership with strategy, concierge bookings, and guaranteed Business Class seats. For business owners ready to make this a habit.",
      price_line: "From A$2,997 + GST /year",
      href: "/membership",
      icon: "Users",
      accent_color: "#E8963A",
      checkoutOptions: [
        { label: "Explore — A$2,997/yr",  priceId: STRIPE_PRICE_IDS.explore,  mode: "subscription" },
        { label: "Platinum — A$7,997/yr", priceId: STRIPE_PRICE_IDS.platinum, mode: "subscription" },
        { label: "Black — by application", priceId: STRIPE_PRICE_IDS.black,   mode: "subscription" },
      ],
    },
    {
      id: "points-concierge",
      name: "Points Concierge",
      tagline: "I have points. I just need someone to book the seat.",
      description:
        "Done-for-you award booking. You have the points; we find and book the Business Class seat. One trip. No membership needed.",
      price_line: "From A$1,300 per return seat",
      href: "/points-concierge",
      icon: "Plane",
      accent_color: "#3A6FE8",
      checkout: {
        label: "Book Concierge",
        priceId: STRIPE_PRICE_IDS.concierge,
        mode: "payment",
        metadata: { product_key: "concierge" },
      },
    },
    {
      id: "one-off-research",
      name: "One-off Research Report",
      tagline: "I want to understand my options before I commit.",
      description:
        "A single expert report showing your best redemption options, exactly how many points you need, and a step-by-step plan — with no ongoing commitment.",
      price_line: "A$497 one-off",
      href: "/research",
      icon: "FileSearch",
      accent_color: "#C9A84C",
      checkout: {
        label: "Order Report — A$497",
        priceId: STRIPE_PRICE_IDS.research,
        mode: "payment",
        metadata: { product_key: "research" },
      },
    },
    {
      id: "alert-service",
      name: "Seat Alert Service",
      tagline: "I know what I want. Just tell me when seats open.",
      description:
        "Human-curated Business Class reward seat alerts for your routes and dates. We monitor and notify you the moment a seat appears. You book it yourself.",
      price_line: "From A$47/mo or A$397/year",
      href: "/alerts",
      icon: "BellRing",
      accent_color: "#F2AA5E",
      checkoutOptions: [
        { label: "Essential — A$47/mo",  priceId: STRIPE_PRICE_IDS.alerts_essential_monthly, mode: "subscription", metadata: { product_key: "alerts_essential" } },
        { label: "Essential — A$397/yr", priceId: STRIPE_PRICE_IDS.alerts_essential_annual,  mode: "subscription", metadata: { product_key: "alerts_essential" } },
        { label: "Pro — A$97/mo",        priceId: STRIPE_PRICE_IDS.alerts_pro_monthly,        mode: "subscription", metadata: { product_key: "alerts_pro" } },
        { label: "Pro — A$797/yr",       priceId: STRIPE_PRICE_IDS.alerts_pro_annual,         mode: "subscription", metadata: { product_key: "alerts_pro" } },
      ],
    },
  ],
  comparison: [
    { feature: "We book the seat for you", flightClub: "✓ Included",  concierge: "✓ Core service", research: "— Report only", alerts: "— You book" },
    { feature: "Points strategy session",  flightClub: "✓ Ongoing",   concierge: "—",              research: "✓ In report",   alerts: "—" },
    { feature: "Guaranteed annual seats",  flightClub: "✓ Platinum+", concierge: "—",              research: "—",             alerts: "—" },
    { feature: "Route monitoring",         flightClub: "✓ Ongoing",   concierge: "~ Per booking",  research: "—",             alerts: "✓ Core" },
    { feature: "Need existing points?",    flightClub: "No — we build", concierge: "Yes",          research: "No",            alerts: "Yes" },
    { feature: "Best for",                 flightClub: "Business owners, recurring", concierge: "One trip, points ready", research: "Research, first step", alerts: "DIY bookers, specific routes" },
    { feature: "Commitment",               flightClub: "Annual membership", concierge: "Per booking", research: "Once-off",   alerts: "Monthly or annual sub" },
    { feature: "Price",                    flightClub: "From A$2,997+GST/yr", concierge: "From A$1,300", research: "A$497",   alerts: "A$47/mo or A$397/yr" },
  ],
  bottom_cta: {
    headline: "Not sure where to start?",
    body:
      "Take the free Points Audit. In two minutes it shows what your business already earns, where value is leaking, and which path the numbers actually point to.",
    cta_label: "Take the Free Points Audit",
    cta_href: "/contact",
  },
};

/* ========== NAVIGATION ========== */
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  {
    label: "Pricing",
    href: "/pricing",
    has_dropdown: true,
    dropdown_items: PRICING_PRODUCTS.map((p) => ({
      label: p.name,
      href: p.href,
    })),
  },
  {
    label: "Best Cards",
    href: "https://10xtravel.com/creditcards/",
    external: true,
    has_dropdown: true,
    dropdown_items: [
      { label: "Best Credit Cards", href: "https://10xtravel.com/best-credit-cards/", external: true },
      { label: "Best Business Cards", href: "https://10xtravel.com/best-business-credit-cards/", external: true },
      { label: "Best Airline Credit Cards", href: "https://10xtravel.com/best-airline-credit-cards/", external: true },
      { label: "Best Hotel Cards", href: "https://10xtravel.com/best-hotel-credit-cards/", external: true },
      { label: "Best Travel Credit Cards", href: "https://10xtravel.com/best-travel-credit-cards/", external: true },
      { label: "Best Cash Back Cards", href: "https://10xtravel.com/best-cash-back-credit-cards/", external: true },
    ],
  },
  { label: "Case Study", href: "/case-studies" },
  // { label: "Podcast", href: "/podcast" }, // Podcast disabled until we launch one
  { label: "Contact", href: "/contact" },
];

export const NAV_CTA_BUTTONS: CTAButton[] = [
  { label: "Book A Seat", href: "/points-concierge", variant: "ghost" },
  { label: "Join The Club", href: "/membership", variant: "primary" },
];

/* ========== HERO SECTION ========== */
export const HERO = {
  headline_line1: "The Ultimate Travel Advantage",
  headline_line2: "for Business Owners",
  subheadline:
    "Turn every dollar you spend into Business Class freedom, exclusive experiences, and a private community of leaders who never fly economy again.",
  cta_primary: { label: "Join The Flights Club", href: "/membership" },
  cta_secondary: { label: "Book One Seat With Points", href: "/points-concierge" },
  trust_badge: "6,000+ members · $1B+ points redeemed · 12 years",
};

/* ========== MEDIA LOGOS ========== */
export const MEDIA_LOGOS: string[] = [
  "9 News",
  "The Australian",
  "2GB",
  "news.com.au",
  "SBS News",
  "Sky News",
  "7 News",
  "10 News",
  "Sunrise",
  "Velocity Frequent Flyer",
];

/* ========== STATEMENT TEXT SECTION ========== */
export const STATEMENT = {
  line1: "YOU'RE SPENDING MILLIONS",
  line2: "FLYING ECONOMY.",
  line3: "THAT ENDS HERE.",
};

/* ========== TWO PATHS SECTION ========== */
export const TWO_PATHS: TwoPathCard[] = [
  {
    id: "concierge",
    label: "AD-HOC",
    title: "Points Flight Concierge",
    description:
      "You already have points. We find and book the Business Class seat for you. One trip, handled completely.",
    price: "$1,900 per return Business Class seat",
    cta_label: "Book With Points",
    cta_href: "/points-concierge",
    accent_color: "#3A6FE8",
  },
  {
    id: "membership",
    label: "ONGOING",
    title: "Flights Club Membership",
    description:
      "For business owners who want this every year. Ongoing strategy, bookings, and guaranteed Business Class returns.",
    price: "From $X,XXX/year — Members save $5K–$10K per seat",
    cta_label: "Explore Memberships",
    cta_href: "/membership",
    accent_color: "#E8963A",
  },
];

/* ========== FLIGHT SAVINGS ROUTES ========== */
export const FLIGHT_ROUTES: FlightRoute[] = [
  {
    from: "Sydney",
    to: "Los Angeles",
    cabin: "Business Class",
    points_cost: "204,000 pts",
    retail_cost: "$10,000+",
    saving_equivalent:
      "A business laptop, two months of software, or a family weekend away",
    image: "/images/los-angeles.jpg",
  },
  {
    from: "Sydney",
    to: "London",
    cabin: "Business Class",
    points_cost: "332,600 pts",
    retail_cost: "$12,000+",
    saving_equivalent: "Two months of office rent or a team offsite trip",
    image: "/images/london.jpg",
  },
  {
    from: "Sydney",
    to: "Paris",
    cabin: "Business Class",
    points_cost: "360,000 pts",
    retail_cost: "$12,000+",
    saving_equivalent:
      "A full marketing campaign or new hire onboarding budget",
    image: "/images/paris.jpg",
  },
];

/* ========== STATS ========== */
export const STATS: StatItem[] = [
  {
    value: 1000000,
    prefix: "",
    suffix: "+",
    label: "Points Redeemed for Australians",
    display: "1,000,000+",
  },
  {
    value: 6000,
    prefix: "",
    suffix: "+",
    label: "Business Owners Trust Us",
    display: "6,000+",
  },
  {
    value: 12,
    prefix: "",
    suffix: " Years",
    label: "Of Points Expertise",
    display: "12 Years",
  },
];

/* ========== CASE STUDIES ========== */
export const CASE_STUDIES: CaseStudy[] = [
  {
    name: "Clara",
    business_type: "eCommerce",
    turnover: "$1M",
    result: "3 Business Class return flights",
    saving: "$20,000+",
    quote: "I had no idea my supplier payments were worth this much.",
    tier: "Explore",
  },
  {
    name: "Sarah & Mitch",
    business_type: "Fashion Label",
    turnover: "$3M",
    result: "6 Business Class flights",
    saving: "$50,000+",
    quote: "We fly as a couple now. Business Class, every time.",
    tier: "Platinum",
  },
  {
    name: "Antony",
    business_type: "Local Builder",
    turnover: "$5M+",
    result: "10+ Business Class flights",
    saving: "$100,000+",
    quote: "My accountant couldn\'t believe how much we were leaving on the table.",
    tier: "Black",
  },
];

/* ========== WHY DIFFERENT SECTION ========== */
export const WHY_DIFFERENT_FEATURES: Feature[] = [
  {
    icon: "Brain",
    title: "Proven Strategy",
    description:
      "12+ years of expertise. Billions of points redeemed. A system that delivers results, not promises.",
  },
  {
    icon: "Plane",
    title: "Concierge Booking",
    description:
      "Our team handles everything — from complex redemptions to securing flatbed seats.",
  },
  {
    icon: "Star",
    title: "Exclusive Access",
    description:
      "Closed-group deals, private events, and VIP privileges that aren't available to the public.",
  },
  {
    icon: "Shield",
    title: "Guaranteed Value",
    description:
      "Members save $5K–$10K per seat every trip, or we keep working until you do.",
  },
  {
    icon: "Map",
    title: "Curated Experiences",
    description:
      "Retreats, events, and journeys across seven continents that go well beyond just getting a flight.",
  },
  {
    icon: "Users",
    title: "Premium Community",
    description:
      "A curated circle of ambitious business owners who treat travel as a competitive advantage.",
  },
];

/* ========== MEMBERSHIP TIERS ========== */
export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "explore",
    name: "Explore",
    target: "Business owners spending $300K–$1M annually",
    key_benefit: "Start turning everyday expenses into Business Class seats",
    included: [
      "Points strategy sessions",
      "Concierge bookings",
      "Member community access",
    ],
    cta_label: "Learn About Explore",
    cta_href: "/membership#explore",
    visual_style: "Standard dark card with blue accent border",
    price: "From $2,997/year",
  },
  {
    id: "platinum",
    name: "Platinum",
    target: "Founders spending $1M+ annually",
    key_benefit: "Guaranteed Business Class flights every year",
    included: [
      "Everything in Explore",
      "Guaranteed seat allocation",
      "Priority concierge",
      "Exclusive member events",
    ],
    cta_label: "Learn About Platinum",
    cta_href: "/membership#platinum",
    visual_style:
      "Slightly elevated card, orange accent border, badge: MOST POPULAR",
    price: "From $7,997/year",
  },
  {
    id: "black",
    name: "Black",
    target: "High-spenders wanting $100K+ in premium travel value",
    key_benefit: "VIP experiences, private events, and elite-level access",
    included: [
      "Everything in Platinum",
      "$100K+ travel value annually",
      "Private events",
      "Dedicated account manager",
      "First Class upgrades",
    ],
    cta_label: "Learn About Black",
    cta_href: "/membership#black",
    visual_style:
      "Dark charcoal card with gold border, shimmer animation, badge: ELITE",
    price: "By invitation / enquiry",
  },
];

/* ========== MEMBERSHIP TIERS — DETAIL (membership page) ========== */
export const MEMBERSHIP_TIERS_DETAIL: MembershipTier[] = [
  {
    id: "explore",
    name: "Explore",
    badge: null,
    target: "$250K–$1.5M annual business spend",
    key_benefit: "Start turning everyday expenses into Business Class seats",
    included: [
      "Points Blueprint system",
      "Monthly group strategy calls with Steve Hui",
      "Partner benefit stack (Pay.com.au fee waiver $1,980, Velocity Gold, Accor Gold)",
      "10% discount on additional Concierge bookings",
      "Access to the member community",
    ],
    cta_label: "Apply for Explore",
    cta_href: "/apply?tier=explore",
    visual_style: "Standard dark card with blue accent border",
    price: "From A$2,997 + GST /yr",
  },
  {
    id: "platinum",
    name: "Platinum",
    badge: "MOST POPULAR",
    target: "$1.5M–$5M annual business spend",
    key_benefit: "Guaranteed Business Class flights every year",
    included: [
      "Everything in Explore",
      "Up to 4 guaranteed return Business Class bookings/year (using your points)",
      "Priority 1-on-1 strategy calls",
      "First access to partner deals and flight inventory",
      "30% discount on additional Concierge bookings",
      "Exclusive member events",
    ],
    cta_label: "Apply for Platinum",
    cta_href: "/apply?tier=platinum",
    visual_style: "Slightly elevated card, orange accent border, badge: MOST POPULAR",
    price: "From A$7,997 + GST /yr",
  },
  {
    id: "black",
    name: "Black",
    badge: "ELITE",
    target: "$5M+ annual business spend",
    key_benefit: "$100K+ in premium travel value annually",
    included: [
      "Everything in Platinum",
      "Dedicated account manager",
      "A$100K+ in premium travel value annually",
      "Private member events and retreats",
      "First Class upgrade access",
      "Custom travel strategy for complex itineraries",
      "Partner introductions",
    ],
    cta_label: "Apply for Black",
    cta_href: "/apply?tier=black",
    visual_style: "Dark charcoal card with gold border, shimmer animation, badge: ELITE",
    price: "By application",
  },
];

/* ========== PODCAST SECTION (disabled until we launch one) ========== */
/*
export const PODCAST_SECTION = {
  section_label: "ALWAYS BUSINESS CLASS PODCAST",
  section_title: "Real Conversations About Flying Smarter",
  cta_label: "See All Episodes",
  cta_href: "/podcast",
};

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    episode_number: 1,
    title: "Building a Billion Dollar Points Empire",
    guest_name: "Mark Chen",
    duration: "42 min",
    cover_image: "/images/podcast-episode-1.jpg",
    listen_url: "#",
  },
  {
    episode_number: 2,
    title: "From Economy to Business Class: The Mindset Shift",
    guest_name: "Sarah Thompson",
    duration: "35 min",
    cover_image: "/images/podcast-episode-2.jpg",
    listen_url: "#",
  },
  {
    episode_number: 3,
    title: "How Points Strategy Changed My Business",
    guest_name: "David Rodriguez",
    duration: "48 min",
    cover_image: "/images/podcast-episode-3.jpg",
    listen_url: "#",
  },
];
*/

/* ========== FAQ ========== */
export const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What points programs do you work with?",
    a: "We work with Qantas Frequent Flyer, Velocity, American Express Membership Rewards, and several bank transfer partners. Our team finds the best program for your situation.",
  },
  {
    q: "Do I need a lot of existing points to get started?",
    a: "Not necessarily. The Concierge service requires you already have points. The Flights Club Membership is about building and strategically using your points over time — we help you accumulate them through your existing business spend.",
  },
  {
    q: "What businesses qualify for membership?",
    a: "Any Australian business spending $300K+ annually on cards or eligible expenses. Sole traders, companies, and trusts all qualify.",
  },
  {
    q: "What is the difference between Concierge and Membership?",
    a: "Concierge is a one-off service — you have points, we book your seat. Membership is an ongoing relationship where we build your strategy, manage your points, and guarantee Business Class seats every year.",
  },
  {
    q: "How does the guaranteed value promise work?",
    a: "If your membership doesn't deliver at least $5,000–$10,000 in value per Business Class seat, we keep working until it does. We stand behind the numbers.",
  },
  {
    q: "Can my partner or family use the membership?",
    a: "Yes. Depending on your tier, membership benefits can extend to travel companions. Our team will walk you through what applies to your situation.",
  },
];

/* ========== FAQ — CONCIERGE PAGE ========== */
export const FAQ_ITEMS_CONCIERGE: FAQItem[] = [
  {
    q: "What programs can you book with?",
    a: "We search Qantas Frequent Flyer, Velocity Frequent Flyer, American Express Membership Rewards, Pay.com.au PayRewards, and their airline transfer partners — including Singapore KrisFlyer, Air Canada Aeroplan, and Cathay Pacific Asia Miles.",
  },
  {
    q: "What if you can't find a seat?",
    a: "You pay nothing. We only charge the service fee when we confirm a seat that you approve. If we can't find availability, we keep monitoring and come back with new options as they appear.",
  },
  {
    q: "Do you log into my points account?",
    a: "We never access your credit card or bank account. To make the booking, we log into your frequent flyer account (with your permission) — the airline may send you a one-time SMS code to approve the login.",
  },
  {
    q: "How long does it take to find a seat?",
    a: "First options on standard routes typically come back within 2–5 business days. Complex itineraries or hard-to-find routes may take longer. Award seats move fast — we run searches every 1–2 days.",
  },
  {
    q: "Can you book for my partner or family?",
    a: "Yes. Bookings can be made for any traveller using your points. We cap bookings at 4 seats per flight — finding multiple seats on the same flight is significantly harder than finding one.",
  },
  {
    q: "What if the seat disappears after I confirm?",
    a: "Award seats can disappear within hours of becoming available. We move quickly once you confirm, but if a seat is gone by the time we book, we find a replacement at no additional charge.",
  },
];

/* ========== FAQ — RESEARCH PAGE ========== */
export const FAQ_ITEMS_RESEARCH: FAQItem[] = [
  {
    q: "What information do I need to provide?",
    a: "After checkout you'll complete a short intake form: your points balances across each program, your top 2 destinations, approximate travel dates (even a rough month or season), and any flexibility on airlines or routing.",
  },
  {
    q: "Is this the same as a membership strategy session?",
    a: "No. The report is a standalone deliverable focused on your best current redemption options for specific trips. Membership includes an ongoing strategy, earn plan, and annual reviews — it's built for people who want Business Class as a regular outcome, not a one-time event.",
  },
  {
    q: "Can you research any destination?",
    a: "We cover any route from Australia in Business Class. We research across Qantas, Velocity, Amex MR, and their transfer partners. The report covers your top 2 destinations — additional destinations can be added for A$97 each.",
  },
  {
    q: "What if my points balance changes before I'm ready to book?",
    a: "The report reflects your situation at the time of research. If your balance changes significantly, you can order a refreshed report at a discounted rate, or simply use the step-by-step instructions as a guide and adjust quantities accordingly.",
  },
  {
    q: "Do I get a refund if I'm not happy?",
    a: "If the report doesn't answer your question or we couldn't find redemption options for your routes, we'll refund in full. We'd rather tell you upfront if we don't think we can find value than take your money.",
  },
];

/* ========== FAQ — ALERTS PAGE ========== */
export const FAQ_ITEMS_ALERTS: FAQItem[] = [
  {
    q: "How quickly will I get an alert when a seat appears?",
    a: "Our team runs checks multiple times daily on your routes. For high-demand routes, we check more frequently. When a seat appears, you get an alert within hours — not days. For routes where speed is critical, the Pro plan's SMS alerts let you act within minutes.",
  },
  {
    q: "Do I need to book the seat myself?",
    a: "Yes — the Alert Service tells you a seat is available and gives you the details to book it. If you'd rather we handle the booking, add our Points Concierge service. Alerts subscribers get 10% off Concierge fees.",
  },
  {
    q: "What routes can I set alerts for?",
    a: "Any route departing from an Australian airport in Business Class. Essential covers 3 routes; Pro covers 10. Routes can include flexible date ranges (e.g. \"Sydney to London, any date in March–April\") on the Pro plan.",
  },
  {
    q: "Which programs do you monitor?",
    a: "Qantas Frequent Flyer (and Oneworld partners), Velocity Frequent Flyer (and Star Alliance partners), American Express Membership Rewards transfer partners, and Pay.com.au PayRewards transfer partners.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, anytime. Monthly plans cancel before the next billing date. Annual plans can be cancelled and access continues until the end of the paid period — no partial refunds on annual plans.",
  },
];

/* ========== RESEARCH REPORT (/research) ========== */
export const RESEARCH = {
  hero: {
    label: "One-off Research",
    title: "Find out exactly what your points are worth — and how to use them.",
    subtitle:
      "A personalised expert report on your best Business Class redemption options. Your programs, your destinations, your points. Delivered in 5 business days. No membership required.",
    price_line: "A$497 one-off · Delivered in 5 business days",
  },
  includes: [
    "Full audit of your current points balances across all programs you provide",
    "Best available Business Class redemption options for your top 2 destinations",
    "Points required, transfer partners, and airline routing for each option",
    "Comparison: which program gets you there for the fewest points and lowest taxes",
    "Step-by-step booking instructions you can follow yourself",
    "Estimated cash value saved vs. retail airfare",
    "Delivered within 5 business days as a PDF report + 15-min Loom video walkthrough",
  ],
  who_for: [
    "You have points but don't know what they're worth.",
    "You want Business Class but aren't sure if you have enough.",
    "You want to understand your options before committing to a membership.",
  ],
  process: [
    {
      num: "01",
      title: "Submit your details",
      body: "After checkout, tell us your points balances and your top 2 destinations via a short intake form.",
    },
    {
      num: "02",
      title: "We research",
      body: "Our team maps your best Business Class redemptions across every program and transfer partner you hold.",
    },
    {
      num: "03",
      title: "You receive the report",
      body: "A written PDF plus a 15-min Loom walkthrough lands in your inbox within 5 business days.",
    },
  ],
  pricing: [
    {
      name: "Redemption Research Report",
      price: "A$497 one-off",
      includes:
        "Written PDF report covering 2 destinations · Transfer partner analysis · Step-by-step booking instructions · 15-min Loom video walkthrough · 1 round of follow-up questions via email",
      delivery: "5 business days",
    },
    {
      name: "Report + Booking Upgrade",
      price: "A$497 + Concierge fee",
      includes:
        "Everything above, plus we book the seat for you if you want us to. Concierge fee applies at standard rate (A$1,300–A$1,900 return).",
      delivery: "Report: 5 days · Booking: 2–5 days after",
    },
  ],
};

/* ========== SEAT ALERT SERVICE (/alerts) ========== */
export const ALERTS_CONTENT = {
  hero: {
    label: "Seat Alert Service",
    title: "Business Class award seats disappear in hours. We'll tell you the moment one opens.",
    subtitle:
      "Set your routes. We monitor Qantas, Velocity, and their partner airlines around the clock. The moment a Business Class award seat appears on your route, we send you a text with the details — points required, taxes, program, and how many seats are available. You book it yourself, fast.",
  },
  how_it_works: [
    { num: "01", title: "You set your routes", body: "Tell us the routes and dates you want Business Class award seats on." },
    { num: "02", title: "We monitor", body: "Our team checks Qantas, Velocity, and partner inventory around the clock." },
    { num: "03", title: "A seat appears", body: "The instant a seat opens on your route, we verify it's really bookable." },
    { num: "04", title: "You get an alert", body: "You receive a text + email with points required, taxes, program, and seats available — then book it yourself." },
  ],
  differentiators: [
    {
      title: "Australian-first",
      body: "We monitor departures from Australian airports on Australian programs (Qantas FF, Velocity) and their international partners — not a US-centric tool repurposed for AU routes.",
    },
    {
      title: "Human-verified",
      body: "Before we alert you, a team member checks the seat is still bookable and the redemption math is sound. No stale cache alerts that waste your time.",
    },
    {
      title: "Context-rich alerts",
      body: "You don't just get \"seat found.\" You get: route, date, airline, program to use, points required, taxes payable, seats available, and how fast you need to act.",
    },
  ],
  sample_alert: {
    route: "SYD → LHR",
    date: "14 Mar 2026",
    program: "Qantas FF",
    points: "90,000 pts",
    taxes: "A$350",
    seats: "2 seats",
  },
};

export const ALERT_TIERS: AlertTier[] = [
  {
    id: "essential",
    name: "Essential",
    badge: null,
    price_monthly: "A$47",
    price_annual: "A$397",
    annual_saving: "save A$167",
    routes: "Up to 3 routes",
    alerts: "Email alerts",
    included: [
      "Business Class only",
      "Qantas + Velocity + partners",
      "Human-verified seats",
      "Cancel any time",
    ],
    priceId_monthly: STRIPE_PRICE_IDS.alerts_essential_monthly,
    priceId_annual: STRIPE_PRICE_IDS.alerts_essential_annual,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "MOST POPULAR",
    price_monthly: "A$97",
    price_annual: "A$797",
    annual_saving: "save A$367",
    routes: "Up to 10 routes",
    alerts: "SMS + Email",
    included: [
      "Everything in Essential",
      "Priority SMS alerts",
      "Partner airline monitoring",
      "Flexible date ranges (not just specific dates)",
      "10% off Concierge bookings",
    ],
    priceId_monthly: STRIPE_PRICE_IDS.alerts_pro_monthly,
    priceId_annual: STRIPE_PRICE_IDS.alerts_pro_annual,
  },
];

/* ========== FINAL CTA ========== */
export const FINAL_CTA = {
  headline: "Stop Leaving Business Class on the Table",
  subheadline:
    "Your business is already spending the money. The only question is whether you're getting anything back from it.",
  cta_label: "Apply for Membership",
  cta_href: "/membership",
  urgency_line:
    "Membership applications are reviewed monthly. Spots are limited per intake.",
};

/* ========== FOOTER ========== */
export const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Join The Flights Club", href: "/membership" },
      { label: "Membership Tiers", href: "/membership#tiers" },
      { label: "Points Concierge", href: "/points-concierge" },
      {
        label: "Events",
        href: "https://events.humanitix.com/host/the-iflyflat-flights-club",
      },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      // { label: "Podcast", href: "/podcast" }, // Podcast disabled until we launch one
      { label: "Contact", href: "/contact" },
      { label: "Media & Press", href: "/about#media" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "How It Works", href: "/membership#how-it-works" },
      { label: "FAQ", href: "/#faq" },
      { label: "Member Stories", href: "/membership#case-studies" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export const FOOTER = {
  social_links: ["Instagram", "Facebook", "LinkedIn", "YouTube"],
  copyright: "© 2025 The Flights Club by iFLYflat. All rights reserved.",
  abn: "ABN: [INSERT]",
  as_seen_in: "AS SEEN IN: 9 News · The Australian · Sky News · SBS · 7 News · 10 News",
};

/* ========== PAGE METADATA ========== */
export const PAGES: PageMeta[] = [
  {
    path: "/",
    title: "The Flights Club by iFLYflat — Never Fly Economy Again",
    description:
      "Australia's premier Business Class travel membership for business owners. Turn everyday expenses into guaranteed flat-bed flights and VIP experiences.",
    sections_order: [
      "loading_intro",
      "navbar",
      "hero",
      "media_logos",
      "statement_text",
      "two_paths",
      "flight_savings",
      "membership_tiers",
      "stats",
      "case_studies",
      "why_different",
      // "podcast", // Podcast disabled until we launch one
      "faq",
      "final_cta",
      "footer",
    ],
  },
  {
    path: "/membership",
    title: "Membership Tiers — Explore, Platinum, Black | The Flights Club",
    description:
      "Choose the membership that fits your business spend. From $300K to $5M+, we have a tier that turns your expenses into Business Class freedom.",
    sections_order: [
      "navbar",
      "membership_hero",
      "tier_detail_explore",
      "tier_detail_platinum",
      "tier_detail_black",
      "how_it_works_steps",
      "member_stories",
      "faq",
      "final_cta",
      "footer",
    ],
  },
  {
    path: "/points-concierge",
    title: "Points Flight Concierge — Book Business Class With Your Points",
    description:
      "Already have Qantas or Velocity points? Our expert team finds and books your Business Class seat. One trip, handled completely. $1,900 per return seat.",
    sections_order: [
      "navbar",
      "concierge_hero",
      "how_concierge_works",
      "example_routes",
      "pricing_clear",
      "trust_signals",
      "faq_concierge",
      "cta",
      "footer",
    ],
  },
];
