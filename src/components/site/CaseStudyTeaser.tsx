import { getPublishedCaseStudies } from '@/lib/case-studies.server';
import CaseStudyTeaserView from './CaseStudyTeaserView';

/**
 * Home proof teaser. Renders the newest consented case study — or nothing at all
 * until one exists. No placeholder or fabricated proof on the home page
 * (docs/plans/00); the section simply appears the moment a real story lands.
 */
export default async function CaseStudyTeaser() {
  const [featured] = await getPublishedCaseStudies(1);
  if (!featured) return null;
  return <CaseStudyTeaserView study={featured} />;
}
