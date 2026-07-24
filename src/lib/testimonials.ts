import 'server-only';

import { getPayloadClient } from './payload';

/** A consented, publishable client story (docs/plans/00: no fabrication). */
export type Testimonial = {
  id: string;
  quote: string;
  attribution: string | null;
  route: string | null;
};

/**
 * Published testimonials only — `publishConsent: true` is enforced at the query
 * level, not just the UI, so an un-consented story can never leak onto /results
 * or the home teaser. Wrapped in try/catch so a DB-less build/render degrades to
 * the honest empty state instead of crashing.
 */
export async function getPublishedTestimonials(limit = 24): Promise<Testimonial[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'testimonials',
      where: { publishConsent: { equals: true } },
      sort: '-createdAt',
      limit,
      depth: 0,
    });
    return docs.map((doc) => ({
      id: String(doc.id),
      quote: String(doc.quote ?? ''),
      attribution: (doc.attribution as string | undefined) || null,
      route: (doc.route as string | undefined) || null,
    }));
  } catch {
    return [];
  }
}
