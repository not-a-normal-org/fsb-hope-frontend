import type { CollectionConfig } from 'payload';

import { contentAccess } from './access';

/**
 * Uploads — blog cover images and social/OG images. Stored in Supabase Storage
 * via the s3Storage plugin (see payload.config.ts); public read.
 *
 * Renders, smallest to largest: `thumbnail` (CMS list view), `card` (the 3-up
 * blog grid), `wide` (the blog index's "Latest" featured card, which is drawn
 * roughly twice as large as a grid card), and `og` (1200×630 social cards).
 * Cover images should be uploaded at 1600×1000 — see docs/blog-images.md; every
 * render above is derived down from that, and Payload never upscales.
 *
 * `alt` is required for accessibility.
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
      { name: 'wide', width: 1600 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
};
