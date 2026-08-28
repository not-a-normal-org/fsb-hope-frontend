import type { CollectionConfig } from 'payload';

import { contentAccess } from './access';

/** Slugify a title: lowercase, strip punctuation, hyphenate. */
const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Blog posts (docs/plans/06).
 * - Drafts enabled (autosave): authors write privately and publish explicitly;
 *   only `_status: published` renders publicly (see the /blog queries).
 * - `slug` auto-generates from the title when left blank.
 * - Byline is a fixed constant — NEVER a real-name author field
 *   (non-negotiable in docs/plans/00).
 * - Per-post SEO (meta title/description/image) is added by the SEO plugin in
 *   payload.config.ts as a "Meta" tab.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: contentAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'publishedAt'],
  },
  versions: {
    drafts: { autosave: true },
    maxPerDoc: 20,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title if left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.title ? formatSlug(String(data.title)) : value),
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary — used for previews and the meta description.' },
    },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Upload at 1600×1000 (16:10). The blog grid crops to 16:10, but the ' +
          '“Latest” featured card crops tighter — keep the subject in the middle ' +
          'and no text near the edges. See docs/blog-images.md.',
      },
    },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Saver Miles Team',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
};
