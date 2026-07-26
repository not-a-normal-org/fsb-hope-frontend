'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Check } from 'lucide-react';

/**
 * Email-capture form → POST /api/newsletter → `newsletter_subscribers`
 * (docs/plans/06). Captures the subscriber's home airport (so the newsletter can
 * be tailored to routes from it) plus email; `source` tags where the signup came
 * from. Reused by the home band and the footer (`compact`). Success replaces the
 * form; 409 (already subscribed) reads as success, not an error.
 */
const inputStyle = {
  background: 'var(--sm-glass-bg)',
  border: '1px solid var(--sm-glass-border)',
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({
  source,
  buttonLabel = 'Subscribe',
  compact = false,
}: {
  source: string;
  buttonLabel?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [homeAirport, setHomeAirport] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!homeAirport.trim()) {
      setStatus('error');
      setMessage('Please add your home airport.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email.');
      return;
    }
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), home_airport: homeAirport.trim(), source }),
      });
      if (res.ok) {
        setStatus('success');
        setMessage('You’re in — check your inbox.');
        return;
      }
      if (res.status === 409) {
        setStatus('success');
        setMessage('You’re already on the list.');
        return;
      }
      const detail = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(
        detail.error === 'Invalid email address'
          ? 'Please enter a valid email.'
          : detail.error || 'Something went wrong. Please try again.',
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <p className="inline-flex items-center gap-2 text-sm font-medium text-accent" role="status">
        <Check className="h-4 w-4" aria-hidden />
        {message}
      </p>
    );
  }

  const inputBase =
    'rounded-full text-sm text-ink outline-none transition placeholder:text-ink-muted focus:ring-2 focus:ring-accent';
  const inputPad = compact ? 'px-3.5 py-2.5' : 'px-4 py-3';
  const btnPad = compact ? 'px-4 py-2.5' : 'px-5 py-3';

  return (
    <form onSubmit={submit} noValidate>
      <div className={`flex gap-2 ${compact ? 'flex-col' : 'flex-col sm:flex-row'}`}>
        <input
          type="text"
          required
          value={homeAirport}
          onChange={(e) => setHomeAirport(e.target.value)}
          placeholder="Home airport (e.g. JFK)"
          aria-label="Home airport"
          autoComplete="off"
          className={`${inputBase} ${inputPad} ${compact ? 'w-full' : 'w-full sm:w-44'}`}
          style={inputStyle}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          autoComplete="email"
          className={`${inputBase} ${inputPad} w-full ${compact ? '' : 'sm:flex-1'}`}
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`sm-cta mt-2 inline-flex w-full items-center justify-center rounded-full ${btnPad} text-sm font-medium transition-colors disabled:cursor-not-allowed`}
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : buttonLabel}
      </button>
      {status === 'error' && (
        <p className="mt-2 text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
