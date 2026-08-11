import type { CollectionConfig } from 'payload';

import { contentAccess } from './access';

/**
 * Uploads — blog cover images and social/OG images. Stored in Supabase Storage
 * via the s3Storage plugin (see payload.config.ts); public read.
 *
 * `og` (1200×630) is the size used for social share cards. `alt` is required for
 * accessibility.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: contentAccess,
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
};
