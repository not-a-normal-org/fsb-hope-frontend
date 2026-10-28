import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import Link from '@/components/system/LocaleLink';
import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import { getCaseStudyBySlug } from '@/lib/case-studies.server';
import { fmt, formatNumber } from '@/i18n/format';
import { getMessages, resolveLocale } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /results/[slug] — the full write-up for one case study: the structured
 * redemption facts (route, cabin, points, program) plus the rich "how we did
 * it" body. Published (consented) only; 404 otherwise. Dynamic.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ lang: string; slug: string }> };

// One lookup per request, shared by generateMetadata and the page.
const getStudy = cache(getCaseStudyBySlug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const study = await getStudy(slug, locale);
  const path = `/results/${slug}`;
  // An untranslated German URL shows the English story, so its canonical is the
  // English URL; German hreflang appears once a German version exists.
  return {
    title: study ? study.title : getMessages(locale).caseStudy.fallbackTitle,
    alternates: localeMeta(study?.shown ?? locale, path, { de: study?.hasGerman ?? false }).alternates,
    ...(localeMeta(locale, path).robots ? { robots: localeMeta(locale, path).robots } : {}),
  };
}

export default async function CaseStudyDetailPage({ params }: Params) {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const study = await getStudy(slug, locale);
  if (!study) notFound();
  // The story's own language; the page chrome stays in the URL's language.
  const storyLang = study.shown !== locale ? study.shown : undefined;

  const { caseStudy: m, common, results } = getMessages(locale);
  const facts: { label: string; value: string }[] = [
    { label: m.from, value: study.from },
    { label: m.to, value: study.to },
    { label: m.cabin, value: study.cabin ? common.cabins[study.cabin] : '—' },
    {
      label: m.pointsUsed,
      value: study.pointsUsed
        ? fmt(common.points, { points: formatNumber(locale, study.pointsUsed) })
        : '—',
    },
    { label: m.program, value: study.program ?? '—' },
  ];

  return (
    <>
      <NavBar />

      <article className="relative">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-16 md:pt-20">
          <Link href="/results" className="text-sm text-ink-sub transition-colors hover:text-ink">
            {m.allResults}
          </Link>

          {storyLang && (
            <p
              className="mt-8 rounded-lg px-3.5 py-2.5 text-sm text-ink-sub"
              style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
            >
              {results.englishOnly}
            </p>
          )}

          <header className="mt-8">
            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
              {m.eyebrow}
            </p>
            <div className="mt-4 flex items-center gap-3 font-display text-hero font-bold text-ink">
              <span>{study.from}</span>
              <ArrowRight className="h-7 w-7 shrink-0 text-accent md:h-8 md:w-8" aria-hidden />
              <span>{study.to}</span>
            </div>
            <h1 lang={storyLang} className="mt-3 font-display text-xl font-medium text-ink-sub">
              {study.title}
            </h1>
          </header>

          <dl
            className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl p-6 sm:grid-cols-3 sm:p-7"
            style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
          >
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {study.quote && (
            <blockquote
              lang={storyLang}
              className="mt-8 border-l-2 pl-5 font-display text-lg italic leading-snug text-ink"
              style={{ borderColor: 'var(--sm-accent)' }}
            >
              “{study.quote}”
              {study.attribution && (
                <cite className="mt-2 block text-sm not-italic text-ink-sub">
                  — {study.attribution}
                </cite>
              )}
            </blockquote>
          )}

          {study.body ? (
            <div lang={storyLang} className="sm-prose mt-10 text-ink-sub">
              <RichText data={study.body as SerializedEditorState} />
            </div>
          ) : (
            <p className="mt-10 text-sm leading-relaxed text-ink-muted">
              {m.bodyPending}
            </p>
          )}
        </div>
      </article>

      <Footer />
    </>
  );
}
