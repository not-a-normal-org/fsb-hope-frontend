/**
 * English UI copy — the source dictionary. `de.ts` is typed against this file's
 * shape, so adding a key here without its German twin fails `tsc`.
 *
 * Conventions:
 * - `{name}` is a placeholder, filled with `fmt()` from `src/i18n/format.ts`.
 * - `<tag>…</tag>` marks inline markup (a link, emphasis), rendered with `rich()`
 *   from `src/i18n/rich.tsx`. Tags never nest.
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
};

export default en;

export type Messages = typeof en;
