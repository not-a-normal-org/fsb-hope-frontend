import NavBar from '@/components/site/NavBar';
import HomeHero from '@/components/site/HomeHero';
import AudienceFork from '@/components/site/AudienceFork';
import GhostVsRealCompare from '@/components/site/GhostVsRealCompare';
import AlertsTeaser from '@/components/site/AlertsTeaser';
import CalculatorTeaser from '@/components/site/CalculatorTeaser';
import Footer from '@/components/site/Footer';

/**
 * Home — section order from docs/plans/02-site-structure.md.
 *
 * Deal of the Week (Payload CMS) and the newsletter band (Supabase) are still
 * deferred to the backend track. The public does not see this yet — src/proxy.ts
 * rewrites anonymous requests to /maintenance (503); signed-in admins see it.
 */
export default function Home() {
  return (
    <>
      <NavBar />
      <HomeHero />
      <AudienceFork />
      <GhostVsRealCompare />
      <AlertsTeaser />
      <CalculatorTeaser />
      <Footer />
    </>
  );
}
