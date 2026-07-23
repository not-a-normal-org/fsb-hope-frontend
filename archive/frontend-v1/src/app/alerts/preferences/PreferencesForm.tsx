'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';

const INPUT =
  'w-full rounded-lg border border-border-subtle bg-bg-card px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-orange focus:outline-none transition-colors';

export default function PreferencesForm({ reference }: { reference: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch('/api/alerts-preferences', {
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
            <CheckCircle2 size={48} className="mx-auto mb-6 text-accent-orange" />
            <h1 className="mb-4 text-3xl font-display font-bold text-text-primary">
              Your alerts are set up.
            </h1>
            <p className="mb-8 text-text-secondary leading-relaxed">
              We&apos;ll start monitoring your routes and text/email you the moment a Business Class
              award seat appears.
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
            <SectionLabel label="Seat Alerts" className="flex justify-center" />
            <h1 className="mb-4 text-3xl sm:text-4xl font-display font-bold text-text-primary leading-tight">
              Which routes should we watch?
            </h1>
            <p className="text-text-secondary leading-relaxed">
              List the routes and dates you want Business Class award seats on. We&apos;ll take it from
              here.
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
                Mobile for SMS alerts <span className="text-text-muted">(Pro plan)</span>
              </label>
              <input name="phone" className={INPUT} placeholder="+61 4XX XXX XXX" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Routes &amp; dates to monitor
              </label>
              <textarea
                name="routes"
                required
                rows={4}
                className={INPUT}
                placeholder="e.g. Sydney → London, any date March–April 2026 · Melbourne → Tokyo, Sept 2026, 2 seats"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Anything else? <span className="text-text-muted">(optional)</span>
              </label>
              <textarea
                name="notes"
                rows={3}
                className={INPUT}
                placeholder="Preferred programs, airlines, cabin, number of travellers…"
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
                  Saving…
                </>
              ) : (
                'Start my alerts'
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
