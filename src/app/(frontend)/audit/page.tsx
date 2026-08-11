import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import LeadForm from '@/components/site/LeadForm';

/**
 * /audit — the free points audit. A brief intro, then the multi-step lead form
 * inline (the same {@link LeadForm} the popup uses, no modal). Every "Get a free
 * points audit" CTA across the site points here. Submitting writes to Supabase
 * and emails hello@savermiles.com (see api/leads).
 */
export const metadata: Metadata = {
  title: 'Free points audit',
  description:
    'Tell us the trip. A specialist checks the points you already hold and emails you a real, bookable seat — no card, no commitment.',
};

export default function AuditPage() {
  return (
    <>
      <NavBar />

      <PageHero
        compact
        eyebrow="Free points audit"
        title="Tell us the trip. A real person finds the seat."
        intro="No card, no commitment. A specialist works the points you already hold across every program that fits, then emails you a real, bookable option with the exact cost. Takes about a minute."
      />

      <section className="relative">
        <AmbientBackground variant="section" />
        <div className="mx-auto max-w-xl px-6 pb-24">
          <GlassPanel>
            <LeadForm type="individual" />
          </GlassPanel>
        </div>
      </section>

      <Footer />
    </>
  );
}
