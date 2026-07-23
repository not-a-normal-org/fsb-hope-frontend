import type { CollectionConfig } from 'payload';

/** Uploads (e.g. blog cover images). Local disk for now; swap to a storage
 *  adapter (S3 / Supabase Storage) before production — serverless has no
 *  persistent local disk. */
export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  fields: [{ name: 'alt', type: 'text' }],
};
