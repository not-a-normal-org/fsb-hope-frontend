'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Check } from 'lucide-react';

import Link from '@/components/system/LocaleLink';
import { useI18n } from '@/i18n/LocaleProvider';
import { rich } from '@/i18n/rich';

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
  buttonLabel,
  compact = false,
  onSuccess,
}: {
  source: string;
  buttonLabel?: string;
  compact?: boolean;
  /** Fired once on a successful (or already-subscribed) signup — e.g. the popup
   *  uses it to record the subscription so it never reopens. */
  onSuccess?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [homeAirport, setHomeAirport] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const m = useI18n().m.newsletter;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!homeAirport.trim()) {
      setStatus('error');
      setMessage(m.errors.airport);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      setMessage(m.errors.email);
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
        setMessage(m.success);
        onSuccess?.();
        return;
      }
      if (res.status === 409) {
        setStatus('success');
        setMessage(m.already);
        onSuccess?.();
        return;
      }
      const detail = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(
        detail.error === 'Invalid email address'
          ? m.errors.email
          : detail.error || m.errors.generic,
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : m.errors.generic);
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
          placeholder={m.airportPlaceholder}
          aria-label={m.airportLabel}
          autoComplete="off"
          className={`${inputBase} ${inputPad} ${compact ? 'w-full' : 'w-full sm:w-44'}`}
          style={inputStyle}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={m.emailPlaceholder}
          aria-label={m.emailLabel}
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
        {status === 'submitting' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          (buttonLabel ?? m.subscribe)
        )}
      </button>
      <p className={`mt-2 text-ink-muted ${compact ? 'text-[11px]' : 'text-xs'}`}>
        {rich(m.consent, {
          link: (c) => (
            <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
              {c}
            </Link>
          ),
        })}
      </p>
      {status === 'error' && (
        <p className="mt-2 text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
