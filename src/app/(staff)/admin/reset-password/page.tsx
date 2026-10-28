'use client';

import { Suspense, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResetForm() {
  const token = useSearchParams().get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm text-[#F5F5F0] bg-[#13182A] border border-[#1E2538] placeholder:text-[#5C6378] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/40 transition-colors';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/account/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? 'Reset failed.');
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.18em] uppercase text-[#E8963A] font-semibold mb-3">
            Saver Miles
          </p>
          <h1 className="text-2xl font-bold text-[#F5F5F0]">Set a new password</h1>
        </div>

        <div className="bg-[#0E1220] border border-[#1E2538] rounded-2xl p-8">
          {done ? (
            <div className="text-center">
              <p className="text-sm text-[#9DA3B4] mb-6">
                Your password has been reset. You can sign in with it now.
              </p>
              <Link
                href="/admin/login"
                className="inline-block w-full py-3 rounded-xl font-semibold text-sm text-[#07090F] bg-[#E8963A] hover:bg-[#F2AA5E] transition-colors"
              >
                Go to sign in
              </Link>
            </div>
          ) : !token ? (
            <p className="text-sm text-red-400">
              This reset link is missing its token. Request a new one from the{' '}
              <Link href="/admin/login" className="text-[#E8963A] underline">
                sign-in page
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-[#9DA3B4] mb-2">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="confirm" className="block text-sm font-medium text-[#9DA3B4] mb-2">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="w-full py-3 rounded-xl font-semibold text-sm text-[#07090F] bg-[#E8963A] hover:bg-[#F2AA5E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
