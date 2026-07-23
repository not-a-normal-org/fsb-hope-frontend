import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';

/**
 * /legal/terms — placeholder. Deliberately NOT fabricated terms: real legal copy
 * is the owner's to write / have reviewed. Keeps the footer link live and states
 * honestly that the terms are being finalized.
 */
export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        intro="We’re finalizing our terms of service ahead of launch. They’ll cover how the search products work, billing, and refunds — in plain language."
      />
      <NoticeSection
        heading="Being finalized"
        body={
          <>
            This page will hold our full terms before the site goes live. Pricing and
            the refund condition are already spelled out on the{' '}
            <a
              href="/pricing"
              className="text-accent underline underline-offset-4 transition-colors hover:text-ink"
            >
              pricing page
            </a>
            .
          </>
        }
      />
      <Footer />
    </>
  );
}
