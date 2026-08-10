import { ChevronDown } from 'lucide-react';

/**
 * FAQ (Review v3 §8) — answers the top objections the site was silent on:
 * turnaround, whether we need your logins, who books, refunds, and what happens
 * if space vanishes. Native <details>/<summary> so it needs no client JS and stays
 * keyboard-accessible. Answers track existing site copy (docs/plans/03, the
 * transactional emails' "within 5 business days", and the "we hand you a seat you
 * can book" model) — nothing invented.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: 'What if you find nothing?',
    a: 'We tell you straight — no upsell, no “maybe”. On an individual search your $25 deposit comes back in full, to your original payment method.',
  },
  {
    q: 'How long does a search take?',
    a: 'Most searches come back within five business days, often sooner. Anything time-sensitive we flag the moment we find it.',
  },
  {
    q: 'Do you need my airline or credit-card logins?',
    a: 'No. Your points and your accounts stay yours. A specialist finds and confirms the space, then hands you the exact steps to book it yourself — we never ask for your passwords.',
  },
  {
    q: 'Who books the ticket — you or me?',
    a: 'You do. We do the finding and the verifying; you keep control and place the booking with the step-by-step we send. Prefer we handle more of it? Ask, and we’ll tell you what’s possible.',
  },
  {
    q: 'What if the seat disappears before I book it?',
    a: 'Award space can move. We flag anything time-sensitive, and if a seat we confirmed is gone before you book it, you don’t owe the $99 — we keep looking.',
  },
  {
    q: 'Is this a subscription?',
    a: 'A search is a one-off: a $25 deposit, plus $99 only when we confirm a seat you can book (business searches are a flat $25). Alerts are the only monthly option, and you can cancel anytime.',
  },
];

export default function FAQ() {
  return (
    <section className="relative border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">Questions</p>
        <h2 className="mt-3 font-display text-section font-bold text-ink">Answered before you ask.</h2>

        <div className="mt-8">
          {FAQS.map((item) => (
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
          Still unsure?{' '}
          <a href="/contact" className="text-accent underline underline-offset-4 hover:text-ink">
            Ask us directly
          </a>
          .
        </p>
      </div>
    </section>
  );
}
