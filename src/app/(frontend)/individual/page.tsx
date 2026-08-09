import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import SearchReportCard from '@/components/site/SearchReportCard';
import { REGIONS } from '@/lib/reports';
import IndividualBody from './IndividualBody';

/**
 * /individual (docs/plans/02) — the personal-points track. Pain-first hero,
 * how it works for you, plainly-explained pricing (full breakdown on /pricing),
 * and the Weekly Lookup Alert cross-sell.
 *
 * The multi-step lead form and inline calculator are deferred to the backend
 * phase; the primary CTA is an interim mailto until the form ships.
 */
export const metadata: Metadata = {
  title: 'For Individuals',
};

export default function IndividualPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="For individuals"
        title="200,000 points, and no idea what they’re worth."
        intro="You earned them. We assign a specialist who gets the most out of them, finds the seat they can actually book, and hands you the exact point cost. You just tell us where you want to go."
        aside={<SearchReportCard report={REGIONS[0].report} />}
      />
      <IndividualBody />
      <Footer />
    </>
  );
}
