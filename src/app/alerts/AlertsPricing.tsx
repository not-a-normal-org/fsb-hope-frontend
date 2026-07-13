'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import CheckoutButton from '@/components/ui/CheckoutButton';
import { ALERT_TIERS } from '@/lib/constants';

type Interval = 'monthly' | 'annual';

export default function AlertsPricing() {
  const [interval, setInterval] = useState<Interval>('monthly');

  return (
    <div>
      {/* Monthly / annual toggle */}
      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-full border border-border-subtle bg-bg-card p-1">
          {(['monthly', 'annual'] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setInterval(val)}
              className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors ${
                interval === val
                  ? 'bg-accent-orange text-bg-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {val}
              {val === 'annual' && <span className="ml-1.5 text-xs opacity-80">save more</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {ALERT_TIERS.map((tier) => {
          const isPro = tier.id === 'pro';
          const price = interval === 'monthly' ? tier.price_monthly : tier.price_annual;
          const suffix = interval === 'monthly' ? '/mo' : '/yr';
          const priceId = interval === 'monthly' ? tier.priceId_monthly : tier.priceId_annual;

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border bg-bg-card p-8 ${
                isPro ? 'border-accent-orange/60' : 'border-border-subtle'
              }`}
            >
              {tier.badge && (
                <span className="absolute right-6 top-6 rounded-full bg-accent-orange px-3 py-1 text-xs font-bold uppercase tracking-wider text-bg-primary">
                  {tier.badge}
                </span>
              )}

              <h3 className={`mb-2 text-2xl font-display font-bold ${isPro ? 'text-accent-orange' : 'text-text-primary'}`}>
                {tier.name}
              </h3>

              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary">{price}</span>
                <span className="text-text-secondary">{suffix}</span>
              </div>
              {interval === 'annual' && (
                <p className="mb-5 text-xs font-medium text-accent-gold">{tier.annual_saving}</p>
              )}
              {interval === 'monthly' && <div className="mb-5 h-4" />}

              <div className="mb-6 space-y-1 text-sm text-text-secondary">
                <p><span className="text-text-primary font-medium">{tier.routes}</span></p>
                <p><span className="text-text-primary font-medium">{tier.alerts}</span></p>
              </div>

              <div className="mb-8 space-y-3">
                {tier.included.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check
                      size={16}
                      className={`mt-0.5 flex-shrink-0 ${isPro ? 'text-accent-orange' : 'text-accent-blue'}`}
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-text-secondary leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <CheckoutButton
                priceId={priceId}
                mode="subscription"
                metadata={{ product_key: `alerts_${tier.id}` }}
                label={`Start ${tier.name} — ${price}${suffix}`}
                variant={isPro ? 'primary' : 'secondary'}
                className="w-full justify-center"
              />
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-text-muted">
        Cancel any time. Annual plans run until the end of the paid period.
      </p>
    </div>
  );
}
