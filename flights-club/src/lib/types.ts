/* Navigation & Layout */
export interface NavLink {
  label: string;
  href: string;
  has_dropdown?: boolean;
  external?: boolean;
}

export interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

/* Membership Tiers */
export interface MembershipTier {
  id: "explore" | "platinum" | "black";
  name: string;
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
