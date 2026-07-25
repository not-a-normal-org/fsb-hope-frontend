import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';

/**
 * /legal/privacy — placeholder. Deliberately NOT a fabricated policy: real legal
 * copy is the owner's to write / have reviewed. This keeps the footer link live
 * and honestly states the policy is being finalized.
 */
export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro="We’re finalizing our privacy policy ahead of launch. It will explain, in plain terms, what we collect, why, and how we protect it."
      />
      <NoticeSection
        heading="Being finalized"
        body={
          <>
            This page will hold our full privacy policy before the site goes live.
            Have a question about your data in the meantime?{' '}
            <a
              href="mailto:hello@savermiles.com"
              className="text-accent underline underline-offset-4 transition-colors hover:text-ink"
            >
              hello@savermiles.com
            </a>
            .
          </>
        }
      />
      <Footer />
    </>
  );
}
