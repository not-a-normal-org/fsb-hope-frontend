import { ChevronDown } from 'lucide-react';

import Link from '@/components/system/LocaleLink';
import { rich } from '@/i18n/rich';
import type { Messages } from '@/i18n/messages/en';

/**
 * FAQ (Review v3 §8) — answers the top objections the site was silent on:
 * turnaround, whether we need your logins, who books, refunds, and what happens
 * if space vanishes. Native <details>/<summary> so it needs no client JS and stays
 * keyboard-accessible. Answers track existing site copy (docs/plans/03, the
 * transactional emails' "within 5 business days", and the "we hand you a seat you
 * can book" model) — nothing invented.
 */
export default function FAQ({ m }: { m: Messages['home']['faq'] }) {
  return (
    <section className="relative border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{m.eyebrow}</p>
        <h2 className="mt-3 font-display text-section font-bold text-ink">{m.title}</h2>

        <div className="mt-8">
          {m.items.map((item) => (
            <details
              key={item.q}
              className="group border-t py-4 last:border-b"
              style={{ borderColor: 'var(--sm-glass-border)' }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-sub">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-sub">
          {rich(m.stillUnsure, {
            link: (c) => (
              <Link href="/contact" className="text-accent underline underline-offset-4 hover:text-ink">
                {c}
              </Link>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
