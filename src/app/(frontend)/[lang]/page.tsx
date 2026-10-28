import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import HomeHero from '@/components/site/HomeHero';
import AudienceFork from '@/components/site/AudienceFork';
import GhostVsRealCompare from '@/components/site/GhostVsRealCompare';
import DealsGrid from '@/components/site/DealsGrid';
import CaseStudyTeaser from '@/components/site/CaseStudyTeaser';
import AlertsTeaser from '@/components/site/AlertsTeaser';
import CalculatorTeaser from '@/components/site/CalculatorTeaser';
import PricingBand from '@/components/site/PricingBand';
import NewsletterInline from '@/components/site/NewsletterInline';
import NewsletterPopup from '@/components/site/NewsletterPopup';
import FAQ from '@/components/site/FAQ';
import Footer from '@/components/site/Footer';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * Home — section order from docs/plans/02-site-structure.md.
 *
 * The proof teaser (CaseStudyTeaser) reads the Payload `testimonials` collection
 * and renders nothing until a real, consented story exists. Deal of the Week
 * (Payload) and the newsletter band (Supabase) are still deferred. Dynamic so
 * CMS content appears without a rebuild. The public does not see this yet —
 * src/proxy.ts rewrites anonymous requests to /maintenance (503).
 */
export const dynamic = 'force-dynamic';

// Home-page title override (absolute, so it bypasses the "%s | Saver Miles"
// template). The site-wide tagline still serves as the meta description; only the
// <title> and social titles change here.
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title } = getMessages(locale).home;
  return {
    title: { absolute: title },
    openGraph: { title },
    twitter: { title },
    ...localeMeta(locale, '/'),
  };
}

export default async function Home({ params }: { params: LangParams }) {
  const m = getMessages(await resolveLocale(params));
  return (
    <>
      <NavBar />
      <HomeHero m={m.home.hero} />
      <AudienceFork m={m.home.fork} />
      <PricingBand m={m.home.pricingBand} />
      <AlertsTeaser m={m.home.alertsTeaser} products={m.products} />
      <GhostVsRealCompare m={m.home.compare} />
      <DealsGrid m={m.home.deals} />
      <NewsletterInline />
      <CaseStudyTeaser m={m.home.caseStudies} />
      <CalculatorTeaser m={m.home.calculator} widget={m.calculator.widget} />
      <FAQ m={m.home.faq} />
      <Footer />
      <NewsletterPopup />
    </>
  );
}
