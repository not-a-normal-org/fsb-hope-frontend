import type { CollectionConfig } from 'payload';

import { contentAccess } from './access';

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: contentAccess,
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
};
