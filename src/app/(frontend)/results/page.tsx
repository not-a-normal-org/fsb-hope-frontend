import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';

/**
 * /results (docs/plans/02) — the case-study / testimonial wall. Ships with a
 * "coming soon" state at launch. Do NOT fabricate testimonials; real ones fill
 * in only once clients give publish permission.
 */
export const metadata: Metadata = {
  title: 'Results',
};

export default function ResultsPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Results"
        title="Real results, as they come in."
        intro="We’d rather show you nothing than show you something made up. Verified bookings and client stories will land here once they’re real and we have permission to share them."
      />
      <NoticeSection
        heading="Results are coming in"
        body="We’re a new brand doing the work by hand. Check back soon — or find out what your own points can book."
        cta={{ label: 'Check your route', href: '/individual' }}
      />
      <Footer />
    </>
  );
}
