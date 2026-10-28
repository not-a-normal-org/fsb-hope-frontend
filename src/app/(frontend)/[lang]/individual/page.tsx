import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import SearchReportCard from '@/components/site/SearchReportCard';
import { REGIONS } from '@/lib/reports';
import IndividualBody from './IndividualBody';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /individual (docs/plans/02) — the personal-points track. Pain-first hero,
 * how it works for you, plainly-explained pricing (full breakdown on /pricing),
 * and the Weekly Lookup Alert cross-sell.
 *
 * The multi-step lead form and inline calculator are deferred to the backend
 * phase; the primary CTA is an interim mailto until the form ships.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: getMessages(locale).individual.title,
    ...localeMeta(locale, '/individual'),
  };
}

export default async function IndividualPage({ params }: { params: LangParams }) {
  const { individual: m } = getMessages(await resolveLocale(params));
  return (
    <>
      <NavBar />
      <PageHero {...m.hero} aside={<SearchReportCard report={REGIONS[0].report} />} />
      <IndividualBody m={m} />
      <Footer />
    </>
  );
}
