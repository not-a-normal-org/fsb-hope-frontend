import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import AlertPreviewCard from '@/components/site/AlertPreviewCard';
import StaggerGroup from '@/components/site/StaggerGroup';
import PriceCard from '@/components/site/PriceCard';
import { ALERT_PRODUCTS } from '@/lib/products';

/**
 * /alerts — the two subscription alert products, side by side (docs/plans/02).
 * Reuses PriceCard, so the Weekly Lookup phantom disclosure renders inline here
 * too. The full pricing table lives on /pricing.
 */
export const metadata: Metadata = {
  title: 'Alerts',
};

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;

  return (
    <>
      <NavBar />

      <PageHero
        eyebrow="Alerts"
        title="Keep watch on your routes: automated, or a specialist."
        intro="Award space comes and goes. Choose an automated weekly scan, or a specialist checking your routes each cycle. One can surface phantom space, the other is verified. The card says which."
        aside={<AlertPreviewCard />}
      />

      {checkout === 'success' && (
        <div className="mx-auto max-w-4xl px-6">
          <p
            className="rounded-xl px-4 py-3 text-sm font-medium"
            style={{
              color: 'var(--sm-success)',
              background: 'color-mix(in srgb, var(--sm-success) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--sm-success) 28%, transparent)',
            }}
          >
            You’re subscribed — thank you. A confirmation is on its way to your email.
          </p>
        </div>
      )}

      <section className="relative">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {ALERT_PRODUCTS.map((p) => (
              <PriceCard key={p.id} product={p} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      <Footer />
    </>
  );
}
