/**
 * Central RBAC config — the single source of truth for which roles may reach
 * which /admin sections and the /cms panel.
 *
 * Pure constants + functions only: this module is imported by BOTH the edge
 * middleware (`src/proxy.ts`) and Node server components, so it must never pull
 * in `server-only`, `next/headers`, Node built-ins, or client-only libs.
 */

export type Role = 'admin' | 'agent' | 'searcher' | 'affiliate';

export const ROLES: Role[] = ['admin', 'agent', 'searcher', 'affiliate'];

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as string[]).includes(value);
}

/** Minimal shape the access checks need — matches Payload's `req.user`. */
export type SessionUser = { role?: string | null; status?: string | null };

export function hasRole(user: SessionUser | null | undefined, roles: readonly Role[]): boolean {
  return !!user && isRole(user.role) && roles.includes(user.role);
}

// ── Admin nav / page → roles map ───────────────────────────────────────────────

export type NavItem = {
  /** Stable key, also used to resolve the icon in the client shell. */
  key: string;
  label: string;
  href: string;
  roles: readonly Role[];
};

/** Ordered nav. Each item lists the roles allowed to see it AND open the page. */
export const ADMIN_NAV: readonly NavItem[] = [
  { key: 'dashboard',     label: 'Dashboard',     href: '/admin',               roles: ['admin', 'agent'] },
  { key: 'leads',         label: 'Leads',         href: '/admin/leads',         roles: ['admin', 'agent', 'searcher'] },
  { key: 'customers',     label: 'Customers',     href: '/admin/customers',     roles: ['admin', 'agent'] },
  { key: 'orders',        label: 'Orders',        href: '/admin/orders',        roles: ['admin', 'agent'] },
  { key: 'newsletter',    label: 'Newsletter',    href: '/admin/newsletter',    roles: ['admin', 'agent'] },
  { key: 'appointments',  label: 'Appointments',  href: '/admin/appointments',  roles: ['admin', 'agent'] },
  { key: 'applications',  label: 'Applications',  href: '/admin/applications',  roles: ['admin', 'agent'] },
  { key: 'subscriptions', label: 'Subscriptions', href: '/admin/subscriptions', roles: ['admin'] },
  { key: 'products',      label: 'Products',      href: '/admin/products',      roles: ['admin'] },
  { key: 'team',          label: 'Team',          href: '/admin/team',          roles: ['admin'] },
  { key: 'referrals',     label: 'Referrals',     href: '/admin/referrals',     roles: ['admin', 'affiliate'] },
  // Opens the Payload CMS (Posts/Deals/Testimonials/Media). Not an /admin path,
  // so it never matches in canAccessAdminPath — it's a link out to /cms.
  { key: 'blog',          label: 'Blog (CMS)',    href: '/cms/collections/posts', roles: ['admin', 'agent', 'searcher'] },
];

/** The nav a given role sees, in order. */
export function navForRole(role: Role): NavItem[] {
  return ADMIN_NAV.filter((item) => item.roles.includes(role));
}

/**
 * Which /admin section (if any) a pathname belongs to. Longest href wins so
 * `/admin/leads` beats `/admin`.
 */
function matchNav(pathname: string): NavItem | undefined {
  return [...ADMIN_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(item.href + '/'));
}

/**
 * Can this role open this /admin path? `/admin/login` is public and handled by
 * the caller. Unknown /admin subpaths default-deny.
 */
export function canAccessAdminPath(role: Role, pathname: string): boolean {
  if (pathname === '/admin/login') return true;
  const item = matchNav(pathname);
  return !!item && item.roles.includes(role);
}

/** Where a role lands by default — its first accessible section. */
export function adminHome(role: Role): string {
  return navForRole(role)[0]?.href ?? '/admin/login';
}

// ── CMS (/cms Payload panel) ───────────────────────────────────────────────────

/** Roles allowed to open the /cms panel and edit content collections. */
export const CMS_CONTENT_ROLES: readonly Role[] = ['admin', 'agent', 'searcher'];
/** Roles allowed to manage Users + settings and delete content. */
export const CMS_ADMIN_ROLES: readonly Role[] = ['admin'];
