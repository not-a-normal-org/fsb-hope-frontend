import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /contact (docs/plans/02) — general contact, for people who don't fit the
 * individual/business flows (press, partnerships, questions).
 *
 * The Cal.com booking widget and the message form are deferred to the backend
 * phase; for now the page routes to email, which is honest and works today.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: getMessages(locale).contact.title,
    ...localeMeta(locale, '/contact'),
  };
}

export default async function ContactPage({ params }: { params: LangParams }) {
  const { contact: m } = getMessages(await resolveLocale(params));
  return (
    <>
      <NavBar />
      <PageHero {...m.hero} />
      <NoticeSection
        heading={m.heading}
        body={
          <>
            <a
              href="mailto:hello@savermiles.com"
              className="text-accent underline underline-offset-4 transition-colors hover:text-ink"
            >
              hello@savermiles.com
            </a>
            <p className="mt-3 text-ink-muted">{m.calendar}</p>
          </>
        }
        cta={{ label: m.cta, href: '/how-it-works' }}
      />
      <Footer />
    </>
  );
}
