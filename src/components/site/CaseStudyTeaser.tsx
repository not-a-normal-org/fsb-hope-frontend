import { getPublishedCaseStudies } from '@/lib/case-studies.server';
import CaseStudyTeaserView from './CaseStudyTeaserView';

/**
 * Home proof teaser. Renders up to three consented case studies as a filled row —
 * or nothing at all until one exists. No placeholder or fabricated proof on the
 * home page (docs/plans/00); SAMPLE rows are dropped in production by the guard in
 * case-studies.server.ts. The section simply appears the moment real stories land.
 */
export default async function CaseStudyTeaser() {
  const studies = await getPublishedCaseStudies(3);
  if (studies.length === 0) return null;
  return <CaseStudyTeaserView studies={studies} />;
}
