import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import ReceiptCard from '@/components/site/ReceiptCard';
import StaggerGroup from '@/components/site/StaggerGroup';
import PriceCard from '@/components/site/PriceCard';
import { SEARCH_PRODUCT_IDS, ALERT_PRODUCT_IDS, withCopy } from '@/lib/products';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { pageMeta, serviceJsonLd } from '@/lib/seo';

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
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = getMessages(locale).pricing;
  return pageMeta(locale, '/pricing', { title, description });
}

function GroupHeading({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{label}</p>
      <h2 className="mt-3 font-display text-section font-bold text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-sub">{sub}</p>
    </div>
  );
}

export default async function PricingPage({ params }: { params: LangParams }) {
  const locale = await resolveLocale(params);
  const all = getMessages(locale);
  const m = all.pricing;
  return (
    <>
      {/* The offer and its prices, machine-readable (what this page shows). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(locale)) }}
      />
      <NavBar />

      <PageHero {...m.hero} aside={<ReceiptCard m={all.receipt} />} />

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <GroupHeading {...m.search} />
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {SEARCH_PRODUCT_IDS.map((id) => (
              <PriceCard key={id} product={withCopy(id, all.products)} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <GroupHeading {...m.alerts} />
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {ALERT_PRODUCT_IDS.map((id) => (
              <PriceCard key={id} product={withCopy(id, all.products)} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ink-sub">{m.closing}</p>
          {m.currencyNote && <p className="mt-3 text-xs text-ink-muted">{m.currencyNote}</p>}
        </div>
      </section>

      <Footer />
    </>
  );
}
