import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';

/**
 * /contact (docs/plans/02) — general contact, for people who don't fit the
 * individual/business flows (press, partnerships, questions).
 *
 * The Cal.com booking widget and the message form are deferred to the backend
 * phase; for now the page routes to email, which is honest and works today.
 */
export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Contact"
        title="Talk to a person."
        intro="Press, partnerships, or a question that doesn’t fit a search request — reach us directly. If you’re ready to search, the individual and business pages are the faster path."
      />
      <NoticeSection
        heading="Email us"
        body={
          <>
            <a
              href="mailto:hello@savermiles.com"
              className="text-accent underline underline-offset-4 transition-colors hover:text-ink"
            >
              hello@savermiles.com
            </a>
            <p className="mt-3 text-ink-muted">
              A booking calendar is on the way. For now, email is the fastest way to
              reach a real person.
            </p>
          </>
        }
        cta={{ label: 'See how it works', href: '/how-it-works' }}
      />
      <Footer />
    </>
  );
}
