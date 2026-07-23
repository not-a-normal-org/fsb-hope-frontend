import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import AboutBody from './AboutBody';

/**
 * /about (docs/plans/02) — company story, mission, the manual-search
 * differentiator, and experience stats. No founder names, no Upwork, no prior
 * company name (docs/plans/00). The transparent flat-fee model stands in for a
 * track record the brand doesn't have publicly yet.
 */
export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="About"
        title="We do by hand what everyone else automated."
        intro="Award tools are fast, free, and full of seats that aren’t really there. Saver Miles is the opposite: a real person searches, verifies, and hands you a seat you can actually book."
      />
      <AboutBody />
      <Footer />
    </>
  );
}
