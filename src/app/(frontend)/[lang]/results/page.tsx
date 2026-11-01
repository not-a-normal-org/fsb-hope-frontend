import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';
import CaseStudyWall from '@/components/site/CaseStudyWall';
import AmbientBackground from '@/components/system/AmbientBackground';
import { getPublishedCaseStudies } from '@/lib/case-studies.server';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { pageMeta } from '@/lib/seo';

/**
 * /results (docs/plans/02) — the case-study wall, driven by the Payload
 * `testimonials` collection (surfaced as "Case Studies"). Only consented stories
 * render (enforced in the query); with none, it shows an honest "coming soon"
 * state. Never fabricate (docs/plans/00). Dynamic so new stories appear without
 * a rebuild.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = getMessages(locale).results;
  return pageMeta(locale, '/results', { title, description });
}

export default async function ResultsPage({ params }: { params: LangParams }) {
  const locale = await resolveLocale(params);
  const studies = await getPublishedCaseStudies(locale);
  const { results: m } = getMessages(locale);

  return (
    <>
      <NavBar />
      <PageHero {...m.hero} />

      {studies.length === 0 ? (
        <NoticeSection
          heading={m.empty.heading}
          body={m.empty.body}
          cta={{ label: m.empty.cta, href: '/individual' }}
        />
      ) : (
        <section className="relative overflow-hidden border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
          <AmbientBackground variant="section" />
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <CaseStudyWall items={studies} />
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
