/**
 * Case-study types. Client-SAFE (no server-only, no DB import) so cards/teasers
 * can use it in the client bundle. The Payload queries live in
 * `case-studies.server.ts`; labels (cabins, "pts") come from the message
 * dictionaries (`common`, `caseStudy`).
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
