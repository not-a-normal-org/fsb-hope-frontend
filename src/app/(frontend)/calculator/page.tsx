import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import PointsCalculator from '@/components/site/PointsCalculator';

/**
 * /calculator (docs/plans/05) — the standalone points-value calculator. Its own
 * shareable URL because it's the most likely thing to get shared. Estimates
 * only, placeholder numbers (flagged in src/lib/calculator.ts); it always routes
 * toward a real search rather than claiming precision itself.
 */
export const metadata: Metadata = {
  title: 'Points Calculator',
};

export default function CalculatorPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Calculator"
        title="What are your points actually worth?"
        intro="A quick estimate of what your balance could be worth in travel, and what it could realistically book. It’s a starting point, not a live search. The real answer comes from a specialist checking your dates."
      />
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <PointsCalculator variant="full" />
        </div>
      </section>
      <Footer />
    </>
  );
}
