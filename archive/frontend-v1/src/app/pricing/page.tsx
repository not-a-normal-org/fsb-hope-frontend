import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Plane, FileSearch, BellRing, ArrowRight } from 'lucide-react';
import { PRICING_HUB } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import HubCardCheckout from './HubCardCheckout';

export const metadata: Metadata = {
  title: 'Pricing — PointIQ',
  description:
    'Four ways to fly Business Class on points: the PointIQ membership, Points Concierge, a one-off research report, or reward-seat alerts. Compare, then buy or dig into the details.',
};

const ICONS = { Users, Plane, FileSearch, BellRing } as const;

// Colour the comparison cells by their leading marker.
function cellClass(value: string): string {
  if (value.startsWith('✓')) return 'text-emerald-400';
  if (value.startsWith('—')) return 'text-text-muted';
  if (value.startsWith('~')) return 'text-accent-orange';
  return 'text-text-secondary';
}

export default function PricingPage() {
  const { hero, cards, comparison, bottom_cta } = PRICING_HUB;

  return (
    <main className="w-full bg-bg-primary">
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 text-center">
          <SectionLabel label={hero.label} className="flex justify-center" />
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">{hero.subtitle}</p>
        </div>
      </section>

      {/* Self-selection cards — Order + Details */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-2">
            {cards.map((card, idx) => {
              const Icon = ICONS[card.icon as keyof typeof ICONS] ?? Users;
              return (
                <ScrollReveal key={card.id} delay={idx * 0.06}>
                  <div className="flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-card p-8">
                    <div
                      className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${card.accent_color}1A`, color: card.accent_color }}
                    >
                      <Icon size={24} />
                    </div>

                    <h2 className="mb-2 text-2xl font-display font-bold text-text-primary">
                      {card.name}
                    </h2>
                    <p className="mb-3 text-sm italic" style={{ color: card.accent_color }}>
                      &ldquo;{card.tagline}&rdquo;
                    </p>
                    <p className="mb-4 flex-grow text-text-secondary leading-relaxed">
                      {card.description}
                    </p>
                    <p className="mb-6 font-mono text-sm text-text-muted">{card.price_line}</p>

                    {/* Order */}
                    <HubCardCheckout
                      checkout={card.checkout}
                      checkoutOptions={card.checkoutOptions}
                      accentColor={card.accent_color}
                    />

                    {/* Details */}
                    <Link
                      href={card.href}
                      className="group mt-4 inline-flex items-center justify-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-accent-orange"
                    >
                      See full details
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <ScrollReveal>
            <h2 className="mb-8 text-center text-2xl font-display font-bold text-text-primary">
              Compare at a glance
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-border-subtle">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-secondary">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-muted">
                      Feature
                    </th>
                    {['Flight Club', 'Concierge', 'Research', 'Alerts'].map((c) => (
                      <th
                        key={c}
                        className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-muted"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-t border-border-subtle/60">
                      <td className="px-4 py-3 font-semibold text-text-primary">{row.feature}</td>
                      <td className={`px-4 py-3 ${cellClass(row.flightClub)}`}>{row.flightClub}</td>
                      <td className={`px-4 py-3 ${cellClass(row.concierge)}`}>{row.concierge}</td>
                      <td className={`px-4 py-3 ${cellClass(row.research)}`}>{row.research}</td>
                      <td className={`px-4 py-3 ${cellClass(row.alerts)}`}>{row.alerts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-28">
        <div className="max-w-2xl mx-auto px-6 lg:px-16 text-center">
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-display font-bold text-text-primary">
              {bottom_cta.headline}
            </h2>
            <p className="mb-8 text-text-secondary leading-relaxed">{bottom_cta.body}</p>
            <Link
              href={bottom_cta.cta_href}
              className="inline-block rounded-full bg-accent-orange px-8 py-4 font-semibold text-bg-primary transition-colors duration-300 hover:bg-accent-orange-light"
            >
              {bottom_cta.cta_label}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
