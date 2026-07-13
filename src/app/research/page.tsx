import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { RESEARCH, FAQ_ITEMS_RESEARCH, STRIPE_PRICE_IDS } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import FAQSection from '@/components/sections/FAQSection';
import CheckoutButton from '@/components/ui/CheckoutButton';

export const metadata: Metadata = {
  title: 'One-off Research Report — The Flights Club by iFLYflat',
  description:
    'A personalised expert report on your best Business Class redemption options. Your programs, your destinations, your points. Delivered in 5 business days. A$497, no membership required.',
};

export default function ResearchPage() {
  const { hero, includes, who_for, process, pricing } = RESEARCH;

  return (
    <main className="w-full bg-bg-primary">
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 text-center">
          <SectionLabel label={hero.label} className="flex justify-center" />
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-6">{hero.subtitle}</p>
          <p className="mb-8 font-mono text-sm text-accent-gold">{hero.price_line}</p>
          <div className="flex justify-center">
            <CheckoutButton
              priceId={STRIPE_PRICE_IDS.research}
              mode="payment"
              metadata={{ product_key: 'research' }}
              label="Order My Report — A$497"
              variant="primary"
            />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 bg-bg-secondary/40">
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-8 text-center text-3xl font-display font-bold text-text-primary">
              What&apos;s in your report
            </h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {includes.map((item, idx) => (
              <ScrollReveal key={item} delay={idx * 0.05}>
                <div className="flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-card p-5">
                  <Check size={18} className="mt-0.5 flex-shrink-0 text-accent-gold" strokeWidth={2.5} />
                  <span className="text-sm text-text-secondary leading-relaxed">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-10 text-center text-3xl font-display font-bold text-text-primary">
              This is for you if…
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-3">
            {who_for.map((scenario, idx) => (
              <ScrollReveal key={scenario} delay={idx * 0.08}>
                <div className="h-full rounded-2xl border border-border-subtle bg-bg-card p-6">
                  <p className="text-lg italic text-text-primary leading-relaxed">
                    &ldquo;{scenario}&rdquo;
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-bg-secondary/40">
        <div className="max-w-5xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-3xl font-display font-bold text-text-primary">
              How it works
            </h2>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-3">
            {process.map((step, idx) => (
              <ScrollReveal key={step.num} delay={idx * 0.1}>
                <div className="relative rounded-xl border border-border-subtle bg-bg-card p-8">
                  <span
                    className="absolute -top-4 -left-2 select-none font-display text-[6rem] font-black leading-none"
                    style={{ color: 'rgba(201,168,76,0.10)' }}
                  >
                    {step.num}
                  </span>
                  <h3 className="relative z-10 mb-3 text-xl font-display font-bold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="relative z-10 text-sm text-text-secondary leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-10 text-center text-3xl font-display font-bold text-text-primary">
              Pricing
            </h2>
          </ScrollReveal>
          <div className="space-y-5">
            {pricing.map((tier, idx) => (
              <ScrollReveal key={tier.name} delay={idx * 0.08}>
                <div className="rounded-2xl border border-border-subtle bg-bg-card p-7">
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-display font-bold text-text-primary">{tier.name}</h3>
                    <span className="font-mono text-lg font-bold text-accent-gold">{tier.price}</span>
                  </div>
                  <p className="mb-3 text-sm text-text-secondary leading-relaxed">{tier.includes}</p>
                  <p className="text-xs uppercase tracking-wider text-text-muted">
                    Delivery: {tier.delivery}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <CheckoutButton
              priceId={STRIPE_PRICE_IDS.research}
              mode="payment"
              metadata={{ product_key: 'research' }}
              label="Order My Report — A$497"
              variant="primary"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={FAQ_ITEMS_RESEARCH} />

      {/* Upsell */}
      <section className="pb-28">
        <div className="max-w-2xl mx-auto px-6 lg:px-16 text-center">
          <ScrollReveal>
            <p className="text-text-secondary">
              Report recommends a specific redemption?{' '}
              <Link
                href="/points-concierge"
                className="group inline-flex items-center gap-1 font-semibold text-accent-orange hover:underline"
              >
                Let us book it for you
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
