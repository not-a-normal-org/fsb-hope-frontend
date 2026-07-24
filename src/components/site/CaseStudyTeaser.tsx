import { getPublishedTestimonials } from '@/lib/testimonials';
import CaseStudyTeaserView from './CaseStudyTeaserView';

/**
 * Home proof teaser. Renders the newest consented client story — or nothing at
 * all until one exists. No placeholder or fabricated proof on the home page
 * (docs/plans/00); the section simply appears the moment a real story lands.
 */
export default async function CaseStudyTeaser() {
  const [featured] = await getPublishedTestimonials(1);
  if (!featured) return null;
  return <CaseStudyTeaserView testimonial={featured} />;
}
