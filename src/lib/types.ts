/* Navigation & Layout */
export interface NavLink {
  label: string;
  href: string;
  has_dropdown?: boolean;
  /** Items shown in the dropdown when has_dropdown is true */
  dropdown_items?: { label: string; href: string; external?: boolean }[];
  external?: boolean;
}

export interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

/* Pricing Products (shown on /pricing hub + Pricing nav dropdown) */
export interface PricingProduct {
  id: "flight-club" | "points-concierge" | "one-off-research" | "alert-service";
  name: string;
  href: string;
  /** lucide-react icon name */
  icon: string;
  tagline: string;
  description: string;
  accent_color: string;
}

/* A single one-click checkout target (a Stripe price) */
export interface HubCheckoutOption {
  label: string;
  priceId: string;
  mode: "payment" | "subscription";
  metadata?: Record<string, string>;
}

/* A card on the /pricing hub — carries both a "details" route and a way to buy now */
export interface PricingHubCard {
  id: PricingProduct["id"];
  name: string;
  /** italic, quote-style positioning line */
  tagline: string;
  description: string;
  /** e.g. "From $2,997 + GST /year" */
  price_line: string;
  /** dedicated detail page */
  href: string;
  /** lucide-react icon name */
  icon: string;
  accent_color: string;
  /** Single-price product → one-click buy button */
  checkout?: HubCheckoutOption;
  /** Multi-price product → inline plan picker */
  checkoutOptions?: HubCheckoutOption[];
}

/* One row of the /pricing comparison table (cells are display strings; a leading
   "✓" renders green, "—" renders muted). */
export interface PricingComparisonRow {
  feature: string;
  flightClub: string;
  concierge: string;
  research: string;
  alerts: string;
}

/* Seat Alert Service tier */
export interface AlertTier {
  id: "essential" | "pro";
  name: string;
  badge?: string | null;
  price_monthly: string;
  price_annual: string;
  /** e.g. "save $167" */
  annual_saving: string;
  routes: string;
  alerts: string;
  included: string[];
  priceId_monthly: string;
  priceId_annual: string;
}

/* Membership Tiers */
export interface MembershipTier {
  id: "explore" | "platinum" | "black";
  name: string;
  badge?: string | null;
  target: string;
  key_benefit: string;
  included: string[];
  cta_label: string;
  cta_href: string;
  visual_style: string;
  price?: string;
}

/* Flight Routes & Savings */
export interface FlightRoute {
  from: string;
  to: string;
  cabin: string;
  points_cost: string;
  retail_cost: string;
  saving_equivalent: string;
  image: string;
}

/* Case Studies / Member Stories */
export interface CaseStudy {
  name: string;
  business_type: string;
  turnover: string;
  result: string;
  saving: string;
  quote: string;
  tier: "Explore" | "Platinum" | "Black";
}

/* Stats & Counters */
export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  display: string;
}

/* Features */
export interface Feature {
  icon: string;
  title: string;
  description: string;
}

/* FAQ */
export interface FAQItem {
  q: string;
  a: string;
}

/* Podcast Episodes */
export interface PodcastEpisode {
  episode_number: number;
  title: string;
  guest_name: string;
  duration: string;
  cover_image: string;
  listen_url: string;
}

/* Two Paths Cards */
export interface TwoPathCard {
  id: "concierge" | "membership";
  label: string;
  title: string;
  description: string;
  price: string;
  cta_label: string;
  cta_href: string;
  accent_color: string;
}

/* Media Logos */
export interface MediaLogo {
  name: string;
}

/* Animation Variants */
export interface AnimationVariant {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition?: Record<string, any>;
  exit?: Record<string, any>;
}

/* Page Metadata */
export interface PageMeta {
  path: string;
  title: string;
  description: string;
  sections_order: string[];
}
