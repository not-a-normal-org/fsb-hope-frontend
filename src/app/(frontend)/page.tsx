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
const HOME_TITLE = 'Saver Miles - Done for You Award Concierge Service';
export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  openGraph: { title: HOME_TITLE },
  twitter: { title: HOME_TITLE },
};

export default function Home() {
  return (
    <>
      <NavBar />
      <HomeHero />
      <AudienceFork />
      <PricingBand />
      <AlertsTeaser />
      <GhostVsRealCompare />
      <DealsGrid />
      <NewsletterInline />
      <CaseStudyTeaser />
      <CalculatorTeaser />
      <FAQ />
      <Footer />
      <NewsletterPopup />
    </>
  );
}
