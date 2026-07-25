import 'server-only';

import { getPayloadClient } from './payload';
import type { Cabin, CaseStudy, CaseStudyDetail } from './case-studies';

/**
 * Server-only Payload queries for case studies (collection slug `testimonials`,
 * surfaced as "Case Studies"). `publishConsent: true` is enforced in the query,
 * not just the UI — an un-consented story can never leak (docs/plans/00).
 * try/catch so a DB-less build/render degrades to the honest empty state.
 */

function toCaseStudy(doc: Record<string, unknown>): CaseStudy {
  return {
    id: String(doc.id),
    title: String(doc.title ?? ''),
    slug: String(doc.slug ?? ''),
    from: String(doc.fromAirport ?? ''),
    to: String(doc.toAirport ?? ''),
    cabin: (doc.cabin as Cabin | undefined) ?? null,
    pointsUsed: typeof doc.pointsUsed === 'number' ? doc.pointsUsed : null,
    program: (doc.program as string | undefined) || null,
    quote: (doc.quote as string | undefined) || null,
    attribution: (doc.attribution as string | undefined) || null,
  };
}

export async function getPublishedCaseStudies(limit = 24): Promise<CaseStudy[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'testimonials',
      where: { publishConsent: { equals: true } },
      sort: '-createdAt',
      limit,
      depth: 0,
    });
    return docs.map((doc) => toCaseStudy(doc as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyDetail | null> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'testimonials',
      where: { and: [{ publishConsent: { equals: true } }, { slug: { equals: slug } }] },
      limit: 1,
      depth: 0,
    });
    const doc = docs[0] as unknown as Record<string, unknown> | undefined;
    if (!doc) return null;
    return { ...toCaseStudy(doc), body: doc.body ?? null };
  } catch {
    return null;
  }
}
