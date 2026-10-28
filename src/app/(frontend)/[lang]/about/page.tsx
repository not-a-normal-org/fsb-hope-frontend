import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import AboutBody from './AboutBody';
import { resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /about (docs/plans/02) — company story, mission, the manual-search
 * differentiator, and experience stats. No founder names, no Upwork, no prior
 * company name (docs/plans/00). The transparent flat-fee model stands in for a
 * track record the brand doesn't have publicly yet.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: 'About',
    ...localeMeta(locale, '/about'),
  };
}

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="About"
        title="The system was broken. We’re here to fix it."
        intro="Award tools are fast, cheap, and full of seats that aren’t really there. Saver Miles is the opposite: a specialist assigned to you who sorts through the mess, verifies the seat, and hands you one you can actually book."
      />
      <AboutBody />
      <Footer />
    </>
  );
}
