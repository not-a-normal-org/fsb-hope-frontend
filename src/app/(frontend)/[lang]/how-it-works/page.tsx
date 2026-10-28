import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import AmbientBackground from '@/components/system/AmbientBackground';
import ShineText from '@/components/system/ShineText';
import Steps from './Steps';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /how-it-works — the shared 3-step explainer (docs/plans/02), linked from the
 * nav and both audience tracks. Hero is static (server); the steps animate in a
 * colocated client component.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: getMessages(locale).howItWorks.title,
    ...localeMeta(locale, '/how-it-works'),
  };
}

export default async function HowItWorksPage({ params }: { params: LangParams }) {
  const { howItWorks: m } = getMessages(await resolveLocale(params));
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
            {m.eyebrow}
          </p>
          <ShineText as="h1" className="mt-4 max-w-3xl text-hero font-bold">
            {m.heading}
          </ShineText>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-sub">{m.intro}</p>
        </div>
      </section>

      <Steps m={m} />

      <Footer />
    </>
  );
}
