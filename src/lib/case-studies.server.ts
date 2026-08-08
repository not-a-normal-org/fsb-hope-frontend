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

/**
 * The placeholder case study (its attribution/title starts with "SAMPLE") lives
 * only in the database, so grep can't catch it — this is the render-time guard
 * the review asked for. In production a SAMPLE row is dropped even if it was left
 * consented in the CMS, so a fake proof can never reach a real visitor. It still
 * shows in dev, where it's a useful stand-in.
 */
const SAMPLE_RE = /^\s*sample\b/i;
function isSample(s: CaseStudy): boolean {
  return SAMPLE_RE.test(s.attribution ?? '') || SAMPLE_RE.test(s.title ?? '');
}
function guardSamplesInProd(studies: CaseStudy[]): CaseStudy[] {
  if (process.env.NODE_ENV !== 'production') return studies;
  const clean = studies.filter((s) => !isSample(s));
  if (clean.length !== studies.length) {
    console.warn('[case-studies] dropped SAMPLE placeholder(s) from a production render');
  }
  return clean;
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
    return guardSamplesInProd(
      docs.map((doc) => toCaseStudy(doc as unknown as Record<string, unknown>)),
    );
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
    const study = toCaseStudy(doc);
    if (process.env.NODE_ENV === 'production' && isSample(study)) return null;
    return { ...study, body: doc.body ?? null };
  } catch {
    return null;
  }
}
