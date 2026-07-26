'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Check } from 'lucide-react';

/**
 * Email-capture form → POST /api/newsletter → `newsletter_subscribers`
 * (docs/plans/06). `source` tags where the signup came from for attribution.
 * Reused by the home band and the footer (pass `compact` for the tighter one).
 * Success replaces the form with a confirmation; 409 (already subscribed) reads
 * as success, not an error.
 */
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
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

  const inputPad = compact ? 'px-3.5 py-2.5' : 'px-4 py-3';
  const btnPad = compact ? 'px-4 py-2.5' : 'px-5 py-3';

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          autoComplete="email"
          className={`w-full rounded-full ${inputPad} text-sm text-ink outline-none transition placeholder:text-ink-muted focus:ring-2 focus:ring-accent`}
          style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`sm-cta inline-flex shrink-0 items-center justify-center rounded-full ${btnPad} text-sm font-medium transition-colors disabled:cursor-not-allowed`}
        >
          {status === 'submitting' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            buttonLabel
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-2 text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
