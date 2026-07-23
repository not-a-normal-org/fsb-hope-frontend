import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
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

export default function AlertsPage() {
  return (
    <>
      <NavBar />

      <PageHero
        eyebrow="Alerts"
        title="Keep watching your routes — automated, or by a person."
        intro="Award space comes and goes. Choose a cheap automated weekly scan, or a real person checking your routes each cycle. One can surface phantom space; the other is verified. The card says which."
      />

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
