'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get('from') ?? '/admin';

  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

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
        router.push(from);
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / brand */}
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.18em] uppercase text-[#E8963A] font-semibold mb-3">
            The Flights Club
          </p>
          <h1 className="text-2xl font-bold text-[#F5F5F0]">Admin Portal</h1>
          <p className="mt-1 text-sm text-[#9DA3B4]">Sign in to manage your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-[#0E1220] border border-[#1E2538] rounded-2xl p-8">
          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#9DA3B4] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="
                  w-full px-4 py-3 rounded-xl text-sm text-[#F5F5F0]
                  bg-[#13182A] border border-[#1E2538]
                  placeholder:text-[#5C6378]
                  focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/40
                  transition-colors
                "
              />
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="
                w-full py-3 rounded-xl font-semibold text-sm text-[#07090F]
                bg-[#E8963A] hover:bg-[#F2AA5E]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
