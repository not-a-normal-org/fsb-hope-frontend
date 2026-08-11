'use client';

import { useState, FormEvent } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * TEMPORARY — staff unlock for the maintenance wall. Signs in with a Payload
 * staff account (the same `/api/account/login` + `payload-token` session that
 * gates /admin), so any active staff member can view the real site pre-launch.
 */
export default function AdminUnlockForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.ok) {
        // Full reload: this page was served as a 503 rewrite, so the proxy must
        // re-evaluate the fresh cookie on a new request and return the real site.
        window.location.assign('/');
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? 'Login failed');
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted transition-colors duration-200 hover:text-ink-sub"
      >
        Staff sign in
      </button>
    );
  }

  const inputStyle = {
    background: 'var(--sm-glass-bg)',
    border: '1px solid var(--sm-glass-border)',
  } as const;

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-xs mx-auto text-left">
      <label
        htmlFor="staff-email"
        className="mb-2 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted"
      >
        Staff sign in
      </label>
      <input
        id="staff-email"
        type="email"
        autoComplete="email"
        autoFocus
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@savermiles.com"
        className="mb-2 w-full rounded-lg px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted focus:outline-none"
        style={inputStyle}
      />
      <div className="flex gap-2">
        <input
          id="staff-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="min-w-0 flex-1 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted focus:outline-none"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm-cta"
        >
          {loading ? '…' : 'Enter'}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg px-3 py-2 text-xs"
          style={{ background: 'rgba(217,83,79,0.1)', border: '1px solid rgba(217,83,79,0.25)', color: 'var(--sm-error)' }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
