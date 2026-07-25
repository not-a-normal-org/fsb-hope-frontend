'use client';

import { useState, FormEvent } from 'react';

/**
 * TEMPORARY — admin unlock for the maintenance wall.
 * Posts to the same `/api/admin/login` endpoint the admin portal uses, so
 * there is only ever one password and one cookie to reason about.
 */
export default function AdminUnlockForm() {
  const [open, setOpen]         = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });

      if (res.ok) {
        // Full reload rather than router.refresh(): this page was served as a
        // 503 rewrite, so we need the proxy to re-evaluate the fresh cookie on
        // a brand-new request and hand back the real site.
        window.location.assign('/');
        return;
      }

      const data = (await res.json()) as { error?: string };
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
        Admin sign in
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-xs mx-auto text-left">
      <label
        htmlFor="admin-password"
        className="mb-2 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted"
      >
        Admin password
      </label>

      <div className="flex gap-2">
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="min-w-0 flex-1 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted focus:outline-none"
          style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
        />
        <button
          type="submit"
          disabled={loading || !password}
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
