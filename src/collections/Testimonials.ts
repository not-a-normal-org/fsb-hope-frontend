import type { CollectionConfig } from 'payload';

/** Testimonials (docs/plans/06). `publishConsent` must be true to render on
 *  /results — enforce at the query level, not just the UI. No fabricated
 *  testimonials (docs/plans/00). */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'attribution' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
    { name: 'route', type: 'text' },
    { name: 'publishConsent', type: 'checkbox', defaultValue: false },
  ],
};
