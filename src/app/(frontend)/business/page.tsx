import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import TeamBookingCard from '@/components/site/TeamBookingCard';
import BusinessBody from './BusinessBody';

/**
 * /business (docs/plans/02) — the company track. ROI / account-level framing,
 * the $25-per-search model, and the Human Search Alert cross-sell.
 *
 * The multi-step lead form and Cal.com callback booking are deferred to the
 * backend phase; the primary CTA is an interim mailto until they ship.
 */
export const metadata: Metadata = {
  title: 'For Business',
};

export default function BusinessPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="For business"
        title="Turn company travel spend into premium seats."
        intro="For teams that fly often. A specialist runs account-level award searches across 30+ programs and delivers the proof, so your travel budget reaches further without adding to anyone’s workload."
        aside={<TeamBookingCard />}
      />
      <BusinessBody />
      <Footer />
    </>
  );
}
