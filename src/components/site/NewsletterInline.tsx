'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

/**
 * In-flow newsletter capture below the deals grid (Review v3 §9b). One field in
 * flow: the visitor has just spent attention on the grid, so we ask the low-
 * friction home-airport first, then reveal the email as step two — never the
 * footer's two-field form. Posts to /api/newsletter (email + home_airport +
 * source). 409 (already subscribed) reads as success.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  'w-full rounded-full px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:ring-2 focus:ring-accent';
const inputStyle = { background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' } as const;

export default function NewsletterInline({ source = 'home-deals' }: { source?: string }) {
  const [airport, setAirport] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'airport' | 'email'>('airport');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  function toEmailStep(e: FormEvent) {
    e.preventDefault();
    if (!airport.trim()) {
      setStatus('error');
      setMessage('Add your home airport first.');
      return;
    }
    setStatus('idle');
    setMessage('');
    setStep('email');
    window.setTimeout(() => emailRef.current?.focus(), 40);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      setMessage('Enter a valid email.');
      return;
    }
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), home_airport: airport.trim(), source }),
      });
      if (res.ok || res.status === 409) {
        setStatus('success');
        setMessage(res.status === 409 ? 'You’re already on the list.' : 'You’re in — award space, every Monday.');
        return;
      }
      const detail = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(detail.error === 'Invalid email address' ? 'Enter a valid email.' : detail.error || 'Something went wrong.');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <section className="relative border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-5 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
        <div className="max-w-md">
          <h2 className="font-display text-card font-bold text-ink">Award space on your routes, emailed Monday.</h2>
          <p className="mt-1.5 text-sm text-ink-sub">Tell us your home airport — we’ll show you where your points can go from it.</p>
        </div>

        <div className="w-full md:max-w-sm">
          {status === 'success' ? (
            <p className="inline-flex items-center gap-2 text-sm font-medium text-accent" role="status">
              <Check className="h-4 w-4" aria-hidden />
              {message}
            </p>
          ) : step === 'airport' ? (
            <form onSubmit={toEmailStep} noValidate className="flex gap-2">
              <input
                type="text"
                value={airport}
                onChange={(e) => setAirport(e.target.value)}
                placeholder="Home airport (e.g. JFK)"
                aria-label="Home airport"
                autoComplete="off"
                className={inputBase}
                style={inputStyle}
              />
              <button type="submit" className="sm-cta inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-3 text-sm font-medium transition-colors">
                Notify me
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          ) : (
            <form onSubmit={submit} noValidate className="flex gap-2">
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                autoComplete="email"
                className={inputBase}
                style={inputStyle}
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="sm-cta inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55"
              >
                {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Confirm'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-2 text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
              {message}
            </p>
          )}
          {step === 'email' && status !== 'success' && (
            <p className="mt-2 text-xs text-ink-muted">
              Watching {airport.trim().toUpperCase()} — where should we send it? By confirming you agree to our{' '}
              <a href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
