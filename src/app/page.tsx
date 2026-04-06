import LoadingIntro from '@/components/layout/LoadingIntro';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import MediaLogosSection from '@/components/sections/MediaLogosSection';
import StatementTextSection from '@/components/sections/StatementTextSection';
import TwoPathsSection from '@/components/sections/TwoPathsSection';
import FlightSavingsSection from '@/components/sections/FlightSavingsSection';
import StatsSection from '@/components/sections/StatsSection';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import WhyDifferentSection from '@/components/sections/WhyDifferentSection';
import MembershipTiersSection from '@/components/sections/MembershipTiersSection';
import PodcastSection from '@/components/sections/PodcastSection';
import FAQSection from '@/components/sections/FAQSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

export default function Home() {
  return (
    <>
      <LoadingIntro />
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <MediaLogosSection />
        <StatementTextSection />
        <TwoPathsSection />
        <FlightSavingsSection />
        <StatsSection />
        <CaseStudiesSection />
        <WhyDifferentSection />
        <MembershipTiersSection />
        <PodcastSection />
        <FAQSection />
        <FinalCTASection />
      </main>
    </>
  );
}
