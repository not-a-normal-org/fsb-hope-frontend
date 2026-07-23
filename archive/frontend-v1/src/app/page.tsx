import LoadingIntro from '@/components/layout/LoadingIntro';
import HeroSection from '@/components/sections/HeroSection';
import MediaLogosSection from '@/components/sections/MediaLogosSection';
import StatementTextSection from '@/components/sections/StatementTextSection';
import TwoPathsSection from '@/components/sections/TwoPathsSection';
import FlightSavingsSection from '@/components/sections/FlightSavingsSection';
import StatsSection from '@/components/sections/StatsSection';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import WhyDifferentSection from '@/components/sections/WhyDifferentSection';
import MembershipTiersSection from '@/components/sections/MembershipTiersSection';
// import PodcastSection from '@/components/sections/PodcastSection'; // Podcast disabled until we launch one
import FAQSection from '@/components/sections/FAQSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

export default function Home() {
  return (
    <>
      <LoadingIntro />
      <main className="w-full">
        <HeroSection />
        <MediaLogosSection />
        <StatementTextSection />
        <TwoPathsSection />
        <FlightSavingsSection />
        <MembershipTiersSection />
        <StatsSection />
        <CaseStudiesSection />
        <WhyDifferentSection />
        {/* <PodcastSection /> */}
        <FAQSection />
        <FinalCTASection />
      </main>
    </>
  );
}
