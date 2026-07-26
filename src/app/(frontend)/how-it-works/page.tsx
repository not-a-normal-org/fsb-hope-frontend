import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import AmbientBackground from '@/components/system/AmbientBackground';
import ShineText from '@/components/system/ShineText';
import Steps from './Steps';

/**
 * /how-it-works — the shared 3-step explainer (docs/plans/02), linked from the
 * nav and both audience tracks. Hero is static (server); the steps animate in a
 * colocated client component.
 */
export const metadata: Metadata = {
  title: 'How It Works',
};

export default function HowItWorksPage() {
  return (
    <>
      <NavBar />

      <section className="relative overflow-hidden">
        <AmbientBackground variant="hero" />
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{ background: 'var(--sm-bg-gradient)' }}
        />
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-20 md:pt-24">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
            How it works
          </p>
          <ShineText as="h1" className="mt-4 max-w-3xl text-hero font-bold">
            Three steps, and a specialist doing the work in the middle.
          </ShineText>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-sub">
            No automated tool surfacing seats that vanish at checkout. You tell us
            the plan, a specialist takes over, and you get proof you can act on.
          </p>
        </div>
      </section>

      <Steps />

      <Footer />
    </>
  );
}
