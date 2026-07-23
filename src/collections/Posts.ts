import type { CollectionConfig } from 'payload';

/**
 * Blog posts (docs/plans/06). Byline is a fixed constant — NEVER a real-name
 * author field (non-negotiable in docs/plans/00). It's read-only in the admin
 * and defaults to "Saver Miles Team".
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Saver Miles Team',
      admin: { readOnly: true },
    },
  ],
};
