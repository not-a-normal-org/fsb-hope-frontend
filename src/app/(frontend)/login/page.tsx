import type { Metadata } from 'next';
import { Suspense } from 'react';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import Logo from '@/components/site/Logo';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: 'noindex, nofollow',
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <AmbientBackground variant="hero" />

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo className="text-3xl" />
        </div>

        <GlassPanel className="w-full" padding="p-8 sm:p-10">
          <h1 className="mb-1 text-xl font-semibold text-ink">Sign in to your account</h1>
          <p className="mb-6 text-sm text-ink-sub">
            For SaverMiles team members and partners.
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </GlassPanel>
      </div>
    </main>
  );
}
