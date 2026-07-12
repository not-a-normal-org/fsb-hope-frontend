'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';

const INPUT =
  'w-full rounded-lg border border-border-subtle bg-bg-card px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-orange focus:outline-none transition-colors';

export default function IntakeForm({ reference }: { reference: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/research-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, reference }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong. Please try again.');
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <main className="w-full bg-bg-primary">
        <section className="pt-32 pb-28">
          <div className="max-w-lg mx-auto px-6 lg:px-16 text-center">
            <CheckCircle2 size={48} className="mx-auto mb-6 text-accent-gold" />
            <h1 className="mb-4 text-3xl font-display font-bold text-text-primary">
              Thank you — we&apos;ve got everything we need.
            </h1>
            <p className="mb-8 text-text-secondary leading-relaxed">
              Our team will research your best Business Class options and send your report within 5
              business days. Keep an eye on your inbox.
            </p>
            <Link
              href="/dashboard"
              className="inline-block rounded-full bg-accent-orange px-8 py-4 font-semibold text-bg-primary transition-colors hover:bg-accent-orange-light"
            >
              Go to your dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full bg-bg-primary">
      <section className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-10">
            <SectionLabel label="Research Report" className="flex justify-center" />
            <h1 className="mb-4 text-3xl sm:text-4xl font-display font-bold text-text-primary leading-tight">
              Tell us about your points and where you want to go
            </h1>
            <p className="text-text-secondary leading-relaxed">
              A few quick details so we can research your best Business Class redemptions. Takes about
              two minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">Full name</label>
                <input name="fullName" required className={INPUT} placeholder="Jane Smith" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
                <input name="email" type="email" required className={INPUT} placeholder="jane@business.com.au" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Your points balances
              </label>
              <textarea
                name="pointsBalances"
                rows={3}
                className={INPUT}
                placeholder="e.g. Qantas FF 250,000 · Velocity 120,000 · Amex MR 80,000"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">Destination 1</label>
                <input name="destination1" required className={INPUT} placeholder="London" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Destination 2 <span className="text-text-muted">(optional)</span>
                </label>
                <input name="destination2" className={INPUT} placeholder="Tokyo" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Rough travel dates
              </label>
              <input name="timeframe" className={INPUT} placeholder="e.g. March–April 2026, flexible" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Any flexibility or preferences? <span className="text-text-muted">(optional)</span>
              </label>
              <textarea
                name="flexibility"
                rows={3}
                className={INPUT}
                placeholder="Preferred airlines, cabin, willing to shift dates, number of travellers…"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-orange px-8 py-4 font-semibold text-bg-primary transition-colors hover:bg-accent-orange-light disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                'Submit my details'
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
