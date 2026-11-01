import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import AboutBody from './AboutBody';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { pageMeta } from '@/lib/seo';

/**
 * /about (docs/plans/02) — company story, mission, the manual-search
 * differentiator, and experience stats. No founder names, no Upwork, no prior
 * company name (docs/plans/00). The transparent flat-fee model stands in for a
 * track record the brand doesn't have publicly yet.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = getMessages(locale).about;
  return pageMeta(locale, '/about', { title, description });
}

export default async function AboutPage({ params }: { params: LangParams }) {
  const { about: m } = getMessages(await resolveLocale(params));
  return (
    <>
      <NavBar />
      <PageHero {...m.hero} />
      <AboutBody m={m} />
      <Footer />
    </>
  );
}
