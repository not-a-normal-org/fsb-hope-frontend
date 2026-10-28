/**
 * Public navigation data — the single source for what the site's nav surfaces
 * link to (docs/plans/02-site-structure.md).
 *
 * Two shapes, because the two surfaces have different jobs:
 *
 * - `PRIMARY_NAV` is the desktop bar. It stays short on purpose; a seven-item
 *   row is already near the width budget at the `md` breakpoint.
 * - `MOBILE_NAV_GROUPS` is the full public sitemap, grouped. The mobile menu is
 *   the only nav a phone visitor has, so it carries everything rather than
 *   making them scroll to the footer to reach /calculator or /contact.
 *
 * Legal links (privacy/terms/cookies) are deliberately absent from both — the
 * footer is still reachable on every page and remains their home.
 *
 * Known drift, not addressed here: `Footer.tsx` keeps its own `COLUMNS` array,
 * and the two sets disagree (the footer has no Guides/Deals; the bar has no
 * Calculator/How It Works/About/Results/Contact). Folding the footer into this
 * file is a separate change — it alters a shipped layout, this one does not.
 *
 * Labels are message keys, not text: each surface looks them up in the current
 * language (`m.links[key]`, `m.navGroups[heading]`, src/i18n/messages). Hrefs are
 * the English paths; LocaleLink adds the `/de` prefix on German pages.
 */
import type { Messages } from '@/i18n/messages/en';

export type LinkKey = keyof Messages['links'];
export type NavGroupKey = keyof Messages['navGroups'];

export type NavLink = { key: LinkKey; href: string };
export type NavGroup = { heading: NavGroupKey; links: NavLink[] };

/** The desktop bar. Order is deliberate: products first, then the blog. */
export const PRIMARY_NAV: NavLink[] = [
  { key: 'individual', href: '/individual' },
  { key: 'business', href: '/business' },
  { key: 'alerts', href: '/alerts' },
  { key: 'pricing', href: '/pricing' },
  { key: 'blog', href: '/blog' },
  // Blog categories render a graceful empty state rather than 404-ing when the
  // CMS has no matching category, so these are safe even before seeding.
  { key: 'guides', href: '/blog/category/guides' },
  { key: 'deals', href: '/blog/category/deals' },
];

/** The mobile menu. Headings mirror the footer's column language. */
export const MOBILE_NAV_GROUPS: NavGroup[] = [
  {
    heading: 'product',
    links: [
      { key: 'individual', href: '/individual' },
      { key: 'business', href: '/business' },
      { key: 'alerts', href: '/alerts' },
      { key: 'pricing', href: '/pricing' },
      { key: 'calculator', href: '/calculator' },
    ],
  },
  {
    heading: 'read',
    links: [
      { key: 'blog', href: '/blog' },
      { key: 'guides', href: '/blog/category/guides' },
      { key: 'deals', href: '/blog/category/deals' },
    ],
  },
  {
    heading: 'company',
    links: [
      { key: 'howItWorks', href: '/how-it-works' },
      { key: 'about', href: '/about' },
      { key: 'results', href: '/results' },
      { key: 'contact', href: '/contact' },
    ],
  },
];
