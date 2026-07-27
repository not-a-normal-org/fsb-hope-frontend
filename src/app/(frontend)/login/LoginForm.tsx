'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full rounded-xl px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:ring-2 focus:ring-accent';
const inputStyle = {
  background: 'var(--sm-glass-bg)',
  border: '1px solid var(--sm-glass-border)',
} as const;
const labelClass =
  'mb-1.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-muted';

export default function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setError('');
    setStatus('submitting');
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Login failed. Please try again.');
        setStatus('idle');
        return;
      }
      // Full navigation so the proxy re-evaluates with the fresh session cookie.
      const dest = params.get('from') ?? '/portal';
      window.location.assign(dest.startsWith('/portal') ? dest : '/portal');
    } catch {
      setError('Network error. Please try again.');
      setStatus('idle');
    }
  }

  const submitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <label className="block">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
          style={inputStyle}
          disabled={submitting}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
          style={inputStyle}
          disabled={submitting}
        />
      </label>

      {error && (
        <p className="text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="sm-cta flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium disabled:opacity-55 disabled:cursor-not-allowed"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
