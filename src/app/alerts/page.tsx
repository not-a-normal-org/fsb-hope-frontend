import type { Metadata } from 'next';
import Link from 'next/link';
import { BellRing, ArrowRight } from 'lucide-react';
import { ALERTS_CONTENT, FAQ_ITEMS_ALERTS } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import FAQSection from '@/components/sections/FAQSection';
import AlertsPricing from './AlertsPricing';

export const metadata: Metadata = {
  title: 'Business Class Seat Alert Service — PointIQ',
  description:
    'Human-curated Business Class reward-seat alerts for Australian routes. We monitor Qantas, Velocity and partners and text you the moment a seat opens. From $47/mo.',
};

export default function AlertsPage() {
  const { hero, how_it_works, differentiators, sample_alert } = ALERTS_CONTENT;

  return (
    <main className="w-full bg-bg-primary">
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 text-center">
          <SectionLabel label={hero.label} className="flex justify-center" />
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">{hero.subtitle}</p>
        </div>
      </section>

      {/* How alerts work */}
      <section className="py-16 bg-bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-3xl font-display font-bold text-text-primary">
              How the alerts work
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {how_it_works.map((step, idx) => (
              <ScrollReveal key={step.num} delay={idx * 0.08}>
                <div className="h-full rounded-xl border border-border-subtle bg-bg-card p-6">
                  <span className="mb-3 block font-mono text-sm text-accent-orange">{step.num}</span>
                  <h3 className="mb-2 text-lg font-display font-bold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-4 text-center text-3xl font-display font-bold text-text-primary">
              Not just another DIY tool
            </h2>
            <p className="mb-12 text-center text-text-secondary">
              What you get that raw seat-scanning tools don&apos;t.
            </p>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-3">
            {differentiators.map((d, idx) => (
              <ScrollReveal key={d.title} delay={idx * 0.08}>
                <div className="h-full rounded-2xl border border-border-subtle bg-bg-card p-7">
                  <h3 className="mb-3 text-lg font-display font-bold text-accent-orange">{d.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{d.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sample alert */}
      <section className="py-16 bg-bg-secondary/40">
        <div className="max-w-md mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-text-muted">
              A sample alert
            </p>
            <div className="rounded-2xl border border-accent-orange/40 bg-bg-card p-6 shadow-orange">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-orange/15 text-accent-orange">
                  <BellRing size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Business Class seat found</p>
                  <p className="text-xs text-text-muted">PointIQ · just now</p>
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  ['Route', sample_alert.route],
                  ['Date', sample_alert.date],
                  ['Program', sample_alert.program],
                  ['Points', sample_alert.points],
                  ['Taxes', sample_alert.taxes],
                  ['Available', sample_alert.seats],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border-subtle/50 pb-1.5">
                    <dt className="text-text-muted">{k}</dt>
                    <dd className="font-medium text-text-primary">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-accent-orange">Act fast — award seats can disappear within hours.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-3 text-center text-3xl font-display font-bold text-text-primary">
              Choose your plan
            </h2>
            <p className="mb-10 text-center text-text-secondary">
              Business Class only. Qantas, Velocity and partners. Human-verified.
            </p>
          </ScrollReveal>
          <AlertsPricing />
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={FAQ_ITEMS_ALERTS} />

      {/* Upsell */}
      <section className="pb-28">
        <div className="max-w-2xl mx-auto px-6 lg:px-16 text-center">
          <ScrollReveal>
            <p className="text-text-secondary">
              Found a seat and want us to book it?{' '}
              <Link
                href="/points-concierge"
                className="group inline-flex items-center gap-1 font-semibold text-accent-orange hover:underline"
              >
                Use our Points Concierge
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>{' '}
              — subscribers get 10% off.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
