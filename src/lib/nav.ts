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
 */
export type NavLink = { label: string; href: string };
export type NavGroup = { heading: string; links: NavLink[] };

/** The desktop bar. Order is deliberate: products first, then the blog. */
export const PRIMARY_NAV: NavLink[] = [
  { label: 'Individual', href: '/individual' },
  { label: 'Business', href: '/business' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  // Blog categories render a graceful empty state rather than 404-ing when the
  // CMS has no matching category, so these are safe even before seeding.
  { label: 'Guides', href: '/blog/category/guides' },
  { label: 'Deals', href: '/blog/category/deals' },
];

/** The mobile menu. Headings mirror the footer's column language. */
export const MOBILE_NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Individual', href: '/individual' },
      { label: 'Business', href: '/business' },
      { label: 'Alerts', href: '/alerts' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Calculator', href: '/calculator' },
    ],
  },
  {
    heading: 'Read',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Guides', href: '/blog/category/guides' },
      { label: 'Deals', href: '/blog/category/deals' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'About', href: '/about' },
      { label: 'Results', href: '/results' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];
