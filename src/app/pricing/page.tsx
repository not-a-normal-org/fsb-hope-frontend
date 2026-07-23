import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import StaggerGroup from '@/components/site/StaggerGroup';
import PriceCard from '@/components/site/PriceCard';
import { SEARCH_PRODUCTS, ALERT_PRODUCTS } from '@/lib/products';

/**
 * /pricing — every product in one place (docs/plans/02, 03). This page is the
 * pricing source of truth for the site; other pages link here rather than
 * restating the breakdown.
 *
 * Grouped one-off searches vs ongoing alerts, so the required contrast between
 * the automated Weekly Lookup (phantom disclosure) and the human-run Human
 * Search Alert reads directly, side by side. No urgency, no countdown, no
 * unqualified "guarantee" (doc 03 §7).
 */
export const metadata: Metadata = {
  title: 'Pricing',
};

function GroupHeading({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{label}</p>
      <h2 className="mt-3 font-display text-section font-bold text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-sub">{sub}</p>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <NavBar />

      <PageHero
        eyebrow="Pricing"
        title="Pay for a person to find the seat."
        intro="Two ways to search — once, or ongoing — plus alerts that keep watching your routes. Prices are flat and stated up front, and the one automated product says so plainly, right on its card."
      />

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <GroupHeading
            label="One-off searches"
            title="Pay per search. A person does the work."
            sub="No subscription. Submit what you need and a real person searches 30+ programs by hand, then sends proof."
          />
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {SEARCH_PRODUCTS.map((p) => (
              <PriceCard key={p.id} product={p} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <GroupHeading
            label="Ongoing alerts"
            title="Two ways to keep watching — one automated, one human."
            sub="The difference is the whole point, so it's on the cards: a cheap automated scan that can surface phantom space, or a person checking your routes for real."
          />
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {ALERT_PRODUCTS.map((p) => (
              <PriceCard key={p.id} product={p} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ink-sub">
            No countdown timers, no fake deadlines. If we can’t find something
            bookable, we tell you — and on an individual search, your deposit
            comes back.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
