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
 * Case studies (docs/plans/02, 06) — real award redemptions we booked by hand,
 * shown on /results and the home proof teaser. The structured summary (route,
 * cabin, points, program) drives the card; the rich `body` is the full write-up
 * at /results/[slug].
 *
 * `publishConsent` MUST be true to render — enforced in the query, not just the
 * UI. NEVER fabricate (docs/plans/00). The collection slug stays `testimonials`
 * (to avoid a table rename); it is surfaced in the admin as "Case Studies".
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: contentAccess,
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'program', 'pointsUsed', 'publishConsent'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. “Two business seats to Tokyo”.' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto-generated from the title if left blank.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.title ? formatSlug(String(data.title)) : value),
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fromAirport',
          label: 'From',
          type: 'text',
          required: true,
          admin: { width: '50%', placeholder: 'JFK' },
        },
        {
          name: 'toAirport',
          label: 'To',
          type: 'text',
          required: true,
          admin: { width: '50%', placeholder: 'NRT' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cabin',
          type: 'select',
          admin: { width: '34%' },
          options: [
            { label: 'Economy', value: 'economy' },
            { label: 'Premium Economy', value: 'premium' },
            { label: 'Business', value: 'business' },
            { label: 'First', value: 'first' },
          ],
        },
        {
          name: 'pointsUsed',
          label: 'Points used',
          type: 'number',
          min: 0,
          admin: { width: '33%', placeholder: '95000' },
        },
        {
          name: 'program',
          label: 'Bank / award program',
          type: 'text',
          admin: { width: '33%', placeholder: 'Chase UR → ANA' },
        },
      ],
    },
    { name: 'body', label: 'Full write-up (the plan)', type: 'richText' },
    { name: 'quote', label: 'Client quote (optional)', type: 'textarea' },
    { name: 'attribution', type: 'text' },
    // Legacy free-text route from the original testimonials schema. Superseded by
    // the structured From/To fields; kept (hidden) so the DB column isn't dropped
    // — which would make Payload's push prompt whether new columns are renames.
    { name: 'route', type: 'text', admin: { hidden: true } },
    {
      name: 'publishConsent',
      label: 'Publish consent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Must be on to appear publicly — only with the client’s permission.',
      },
    },
  ],
};
