import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import { getCaseStudyBySlug } from '@/lib/case-studies.server';
import { cabinLabel, formatPoints } from '@/lib/case-studies';

/**
 * /results/[slug] — the full write-up for one case study: the structured
 * redemption facts (route, cabin, points, program) plus the rich "how we did
 * it" body. Published (consented) only; 404 otherwise. Dynamic.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  return { title: study ? study.title : 'Case study' };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  const facts: { label: string; value: string }[] = [
    { label: 'From', value: study.from },
    { label: 'To', value: study.to },
    { label: 'Cabin', value: cabinLabel(study.cabin) ?? '—' },
    { label: 'Points used', value: formatPoints(study.pointsUsed) },
    { label: 'Program', value: study.program ?? '—' },
  ];

  return (
    <>
      <NavBar />

      <article className="relative">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-16 md:pt-20">
          <Link href="/results" className="text-sm text-ink-sub transition-colors hover:text-ink">
            ← All results
          </Link>

          <header className="mt-8">
            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
              Case study
            </p>
            <div className="mt-4 flex items-center gap-3 font-display text-hero font-bold text-ink">
              <span>{study.from}</span>
              <ArrowRight className="h-7 w-7 shrink-0 text-accent md:h-8 md:w-8" aria-hidden />
              <span>{study.to}</span>
            </div>
            <h1 className="mt-3 font-display text-xl font-medium text-ink-sub">{study.title}</h1>
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
            <div className="sm-prose mt-10 text-ink-sub">
              <RichText data={study.body as SerializedEditorState} />
            </div>
          ) : (
            <p className="mt-10 text-sm leading-relaxed text-ink-muted">
              The full write-up for this redemption is on the way.
            </p>
          )}
        </div>
      </article>

      <Footer />
    </>
  );
}
