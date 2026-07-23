import type { ReactNode } from 'react';
import Link from 'next/link';

import GlassPanel from '@/components/system/GlassPanel';

/**
 * A centered glass notice — used by the lighter content pages (/results, legal
 * placeholders, /contact) that are a short message plus an optional CTA. Server
 * component; no motion needed on these.
 */
export default function NoticeSection({
  heading,
  body,
  cta,
}: {
  heading: string;
  body: ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-2xl px-6 pb-24">
        <GlassPanel as="div" className="text-center">
          <h2 className="font-display text-card font-bold text-ink">{heading}</h2>
          <div className="mt-4 text-sm leading-relaxed text-ink-sub">{body}</div>
          {cta && (
            <Link
              href={cta.href}
              className="mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors"
              style={{ background: 'var(--sm-cta)', color: 'var(--sm-cta-text)' }}
            >
              {cta.label}
            </Link>
          )}
        </GlassPanel>
      </div>
    </section>
  );
}
