import type { Access, CollectionConfig, FieldAccess } from 'payload';

import { hasRole, CMS_CONTENT_ROLES } from '../lib/access';

/**
 * Auth collection — the single identity store for every internal/partner account
 * (docs/plans/06 + the admin-user-management plan). Payload owns the auth
 * mechanics (password hashing, sessions, login); we add a `role` taxonomy on top.
 *
 * Roles:
 *  - admin     — full access, the only role allowed into the Payload `/cms` panel.
 *  - agent     — customer-facing staff.
 *  - searcher  — the manual-search team.
 *  - affiliate — external referral partners (accountants/bookkeepers).
 *
 * The tiered *customer* ("user") is NOT here — customers live in the Supabase
 * `customers` table (Stripe-driven, no login) and are managed on /admin/customers.
 *
 * Access model (enforced for the `/cms` panel + Payload REST/GraphQL API):
 *  - Only `admin` can reach the panel, create/delete users, or change a user's
 *    role/status. Non-admins can read/update only their own record — the seam a
 *    future per-role portal will build on.
 *  - The app's own admin console (/admin/team) manages users through the *local
 *    API* with `overrideAccess` on, so it is intentionally not constrained by
 *    these rules; it is gated instead by the shared-secret wall in `src/proxy.ts`.
 *
 * Legacy note: the original seeded operators had no `role` column. `role` is
 * `required` with `defaultValue: 'admin'`, so Payload's push backfills those rows
 * to `admin` (no interactive NOT-NULL prompt, no lockout).
 */

const isAdmin = (user: { role?: string | null } | null | undefined): boolean =>
  user?.role === 'admin';

const adminOnly: Access = ({ req: { user } }) => isAdmin(user);

// Admins see everyone; anyone else sees only themselves.
const adminOrSelf: Access = ({ req: { user } }) => {
  if (isAdmin(user)) return true;
  if (!user) return false;
  return { id: { equals: user.id } };
};

// Field-level: only admins may set/change privileged fields.
const adminFieldOnly: FieldAccess = ({ req: { user } }) => isAdmin(user);

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'status'],
  },
  access: {
    // Content editors (admin/agent/searcher) may open the /cms panel; affiliates
    // cannot. Managing users stays admin-only via the rules below.
    admin: ({ req: { user } }) => hasRole(user, CMS_CONTENT_ROLES),
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      // defaultValue makes the NOT NULL column add non-interactively over any
      // pre-existing seeded rows (they backfill to ''); `required` still enforces
      // a real name on every create through the CMS and the Team console.
      defaultValue: '',
      admin: { description: 'Full name of the account holder.' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      saveToJWT: true, // exposes role on req.user for access checks without a refetch
      access: { create: adminFieldOnly, update: adminFieldOnly },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Agent', value: 'agent' },
        { label: 'Searcher', value: 'searcher' },
        { label: 'Affiliate', value: 'affiliate' },
      ],
      admin: {
        description: 'Determines access. Only Admin can enter the Payload CMS panel.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      saveToJWT: true,
      access: { create: adminFieldOnly, update: adminFieldOnly },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
      admin: { position: 'sidebar' },
    },
    // Affiliate-only context (shown conditionally in the CMS).
    {
      name: 'company',
      type: 'text',
      admin: {
        condition: (data) => data?.role === 'affiliate',
        description: 'Affiliate’s firm / practice.',
      },
    },
    {
      name: 'referralCode',
      type: 'text',
      admin: {
        condition: (data) => data?.role === 'affiliate',
        description: 'Code used to attribute referred clients.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes — never shown to the account holder.' },
    },
  ],
};
