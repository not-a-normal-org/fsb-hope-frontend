import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import AlertPreviewCard from '@/components/site/AlertPreviewCard';
import StaggerGroup from '@/components/site/StaggerGroup';
import PriceCard from '@/components/site/PriceCard';
import { ALERT_PRODUCT_IDS, withCopy } from '@/lib/products';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /alerts — the two subscription alert products, side by side (docs/plans/02).
 * Reuses PriceCard, so the Weekly Lookup phantom disclosure renders inline here
 * too. The full pricing table lives on /pricing.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: getMessages(locale).alerts.title,
    ...localeMeta(locale, '/alerts'),
  };
}

export default async function AlertsPage({
  params,
  searchParams,
}: {
  params: LangParams;
  searchParams: Promise<{ checkout?: string }>;
}) {
  const [locale, { checkout }] = await Promise.all([resolveLocale(params), searchParams]);
  const all = getMessages(locale);
  const m = all.alerts;

  return (
    <>
      <NavBar />

      <PageHero {...m.hero} aside={<AlertPreviewCard m={all.alertPreview} />} />

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
            {m.subscribed}
          </p>
        </div>
      )}

      <section className="relative">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-16">
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {ALERT_PRODUCT_IDS.map((id) => (
              <PriceCard key={id} product={withCopy(id, all.products)} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      <Footer />
    </>
  );
}
