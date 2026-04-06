import type {
  NavLink,
  CTAButton,
  MembershipTier,
  FlightRoute,
  CaseStudy,
  StatItem,
  Feature,
  FAQItem,
  PodcastEpisode,
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

/* ========== NAVIGATION ========== */
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "The Flights Club", href: "/membership", has_dropdown: true },
  { label: "Points Concierge", href: "/points-concierge" },
  { label: "Podcast", href: "/podcast" },
  {
    label: "Events",
    href: "https://events.humanitix.com/host/the-iflyflat-flights-club",
    external: true,
  },
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
  },
];

/* ========== MEMBERSHIP TIERS — DETAIL (membership page) ========== */
export const MEMBERSHIP_TIERS_DETAIL: MembershipTier[] = [
  {
    id: "explore",
    name: "Explore",
    badge: null,
    target: "Spending $300K–$1M annually",
    key_benefit: "Start turning everyday expenses into Business Class seats",
    included: [
      "Annual points strategy session",
      "Up to 2 concierge seat bookings/year",
      "Access to member-only deals",
      "The Flights Club community access",
      "Quarterly points program updates",
    ],
    cta_label: "Apply for Explore",
    cta_href: "/apply?tier=explore",
    visual_style: "Standard dark card with blue accent border",
    price: "From $2,997/year",
  },
  {
    id: "platinum",
    name: "Platinum",
    badge: "MOST POPULAR",
    target: "Spending $1M–$5M annually",
    key_benefit: "Guaranteed Business Class flights every year",
    included: [
      "Everything in Explore",
      "Guaranteed Business Class seat allocation",
      "Priority concierge — 24hr response",
      "Up to 6 concierge bookings/year",
      "Exclusive member events and retreats",
      "Dedicated points advisor",
    ],
    cta_label: "Apply for Platinum",
    cta_href: "/apply?tier=platinum",
    visual_style: "Slightly elevated card, orange accent border, badge: MOST POPULAR",
    price: "From $7,997/year",
  },
  {
    id: "black",
    name: "Black",
    badge: "ELITE",
    target: "Spending $5M+ annually",
    key_benefit: "$100K+ in premium travel value annually",
    included: [
      "Everything in Platinum",
      "$100K+ guaranteed travel value/year",
      "First Class upgrades where available",
      "Private events and experiences",
      "Dedicated full-time account manager",
      "Bespoke travel itinerary planning",
      "VIP airport lounge access globally",
    ],
    cta_label: "Enquire About Black",
    cta_href: "/apply?tier=black",
    visual_style: "Dark charcoal card with gold border, shimmer animation, badge: ELITE",
    price: "By invitation / enquiry",
  },
];

/* ========== PODCAST SECTION ========== */
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
    q: "Do I need a lot of points to get started?",
    a: "You need enough to cover the redemption — typically 80,000–360,000 points depending on the route. We'll tell you if you have enough before you commit.",
  },
  {
    q: "What if no reward seats are available?",
    a: "We'll tell you upfront if your route has limited availability. If we can't find suitable seats, you don't pay.",
  },
  {
    q: "How long does it take?",
    a: "Most bookings are presented within 48 hours. Complex or high-demand routes may take 3–5 business days.",
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
      { label: "Podcast", href: "/podcast" },
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
      "stats",
      "case_studies",
      "why_different",
      "membership_tiers",
      "podcast",
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
