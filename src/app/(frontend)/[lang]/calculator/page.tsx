import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import PointsCalculator from '@/components/site/PointsCalculator';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /calculator (docs/plans/05) — the standalone points-value calculator. Its own
 * shareable URL because it's the most likely thing to get shared. Estimates
 * only, placeholder numbers (flagged in src/lib/calculator.ts); it always routes
 * toward a real search rather than claiming precision itself.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: getMessages(locale).calculator.title,
    ...localeMeta(locale, '/calculator'),
  };
}

export default async function CalculatorPage({ params }: { params: LangParams }) {
  const { calculator: m } = getMessages(await resolveLocale(params));
  return (
    <>
      <NavBar />
      <PageHero {...m.hero} />
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <PointsCalculator variant="full" m={m.widget} />
        </div>
      </section>
      <Footer />
    </>
  );
}
