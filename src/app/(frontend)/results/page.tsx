import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';
import TestimonialWall from '@/components/site/TestimonialWall';
import AmbientBackground from '@/components/system/AmbientBackground';
import { getPublishedTestimonials } from '@/lib/testimonials';

/**
 * /results (docs/plans/02) — the case-study / testimonial wall, driven by the
 * Payload `testimonials` collection. Only consented stories render (enforced in
 * the query); with none, it shows an honest "coming soon" state. Never fabricate
 * (docs/plans/00). Dynamic so new stories appear without a rebuild.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Results',
};

export default async function ResultsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Results"
        title="Real results, as they come in."
        intro="We’d rather show you nothing than show you something made up. Verified bookings and client stories land here once they’re real and we have permission to share them."
      />

      {testimonials.length === 0 ? (
        <NoticeSection
          heading="Results are coming in"
          body="We’re a new brand doing the work by hand. Check back soon — or find out what your own points can book."
          cta={{ label: 'Check your route', href: '/individual' }}
        />
      ) : (
        <section className="relative overflow-hidden border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
          <AmbientBackground variant="section" />
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <TestimonialWall items={testimonials} />
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
