'use client';

import { useState } from 'react';

import CheckoutButton from './CheckoutButton';

type Interval = 'monthly' | 'annual';

/**
 * Buy widget for a subscription alert product: a monthly/annual toggle, an
 * optional email to pre-fill Stripe, and the CheckoutButton for the selected
 * interval. Price IDs are resolved on the server (from NEXT_PUBLIC_STRIPE_PRICE_*)
 * and handed in — this only picks which one to charge. A missing price ID renders
 * a safe "not configured" state rather than charging anything.
 */
export default function AlertBuyBox({
  productKey,
  monthly,
  annual,
  cancelPath,
}: {
  productKey: string;
  monthly: { priceId?: string; display: string };
  annual: { priceId?: string; display: string };
  cancelPath: string;
}) {
  const [interval, setInterval] = useState<Interval>('monthly');
  const [email, setEmail] = useState('');

  const active = interval === 'monthly' ? monthly : annual;
  const unit = interval === 'monthly' ? '/ month' : '/ year';

  return (
    <div className="space-y-5">
      {/* Interval toggle */}
      <div
        className="inline-flex rounded-full p-1"
        role="tablist"
        aria-label="Billing interval"
        style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
      >
        {(['monthly', 'annual'] as const).map((it) => {
          const on = interval === it;
          return (
            <button
              key={it}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setInterval(it)}
              className="rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors"
              style={
                on
                  ? { background: 'var(--sm-cta)', color: 'var(--sm-cta-text)' }
                  : { background: 'transparent', color: 'var(--sm-ink-sub)' }
              }
            >
              {it}
            </button>
          );
        })}
      </div>

      {/* Selected price */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-3xl font-medium text-ink">{active.display}</span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
          {unit}
        </span>
        {interval === 'annual' && (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent">
            2 months free
          </span>
        )}
      </div>

      {/* Optional email (pre-fills Stripe Checkout) */}
      <label className="block">
        <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-muted">
          Email (optional)
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          className="w-full rounded-xl px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:ring-2 focus:ring-accent"
          style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
        />
      </label>

      <CheckoutButton
        priceId={active.priceId}
        mode="subscription"
        label="Subscribe"
        customerEmail={email.trim() || undefined}
        metadata={{ product_key: productKey, interval }}
        cancelPath={cancelPath}
        className="w-full"
      />

      <p className="text-center text-xs leading-snug text-ink-muted">
        Secure checkout via Stripe. Cancel anytime.
      </p>
    </div>
  );
}
