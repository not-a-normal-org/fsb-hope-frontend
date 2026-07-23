import NavBar from '@/components/site/NavBar';
import HomeHero from '@/components/site/HomeHero';
import AudienceFork from '@/components/site/AudienceFork';
import GhostVsRealCompare from '@/components/site/GhostVsRealCompare';
import Footer from '@/components/site/Footer';

/**
 * Home — section order from docs/plans/02-site-structure.md (first slice).
 *
 * Deal of the Week, alerts teaser, calculator teaser, and the newsletter band
 * are later slices. The public does not see this yet — src/proxy.ts rewrites
 * anonymous requests to /maintenance (503); signed-in admins see it.
 */
export default function Home() {
  return (
    <>
      <NavBar />
      <HomeHero />
      <AudienceFork />
      <GhostVsRealCompare />
      <Footer />
    </>
  );
}
