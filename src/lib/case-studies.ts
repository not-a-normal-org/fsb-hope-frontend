/**
 * Case-study types + presentational helpers. Client-SAFE (no server-only, no DB
 * import) so cards/teasers can use it in the client bundle. The Payload queries
 * live in `case-studies.server.ts`.
 */

export type Cabin = 'economy' | 'premium' | 'business' | 'first';

/** The structured summary shown on a card (no article body). */
export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  from: string;
  to: string;
  cabin: Cabin | null;
  pointsUsed: number | null;
  program: string | null;
  quote: string | null;
  attribution: string | null;
};

/** A case study plus its full write-up, for the /results/[slug] detail page. */
export type CaseStudyDetail = CaseStudy & { body: unknown };

const CABIN_LABELS: Record<Cabin, string> = {
  economy: 'Economy',
  premium: 'Premium Economy',
  business: 'Business',
  first: 'First',
};

export const cabinLabel = (cabin: Cabin | null): string | null =>
  cabin ? CABIN_LABELS[cabin] : null;

/** "95,000 pts", or an em dash when unknown. */
export const formatPoints = (points: number | null): string =>
  points ? `${points.toLocaleString('en-US')} pts` : '—';
