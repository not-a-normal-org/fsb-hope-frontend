import type { CollectionConfig } from 'payload';

import { contentAccess } from './access';

/** Deal of the Week (docs/plans/06). Only one should be `active` at a time; the
 *  frontend queries the active one. */
export const DealsOfWeek: CollectionConfig = {
  slug: 'deals-of-week',
  access: contentAccess,
  admin: { useAsTitle: 'route' },
  fields: [
    { name: 'route', type: 'text', required: true },
    { name: 'cabin', type: 'text' },
    { name: 'program', type: 'text' },
    { name: 'pointsCost', type: 'number' },
    { name: 'note', type: 'text' },
    { name: 'verifiedAt', type: 'date' },
    { name: 'active', type: 'checkbox', defaultValue: false },
  ],
};
