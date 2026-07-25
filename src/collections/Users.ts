import type { CollectionConfig } from 'payload';

/**
 * Auth collection for the Payload admin. Access is effectively restricted to the
 * Moon/Tanzil accounts created via Payload's first-user flow (docs/plans/06).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [],
};
