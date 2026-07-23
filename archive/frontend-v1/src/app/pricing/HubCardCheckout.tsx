'use client';

import { useState } from 'react';
import CheckoutButton from '@/components/ui/CheckoutButton';
import type { HubCheckoutOption } from '@/lib/types';

interface HubCardCheckoutProps {
  /** Single-price product → one-click buy */
  checkout?: HubCheckoutOption;
  /** Multi-price product → inline plan picker */
  checkoutOptions?: HubCheckoutOption[];
  accentColor: string;
}

/**
 * The "Order" action on a /pricing hub card. Single-price products render a
 * direct CheckoutButton; multi-price products render a compact plan picker
 * (pills) followed by one CheckoutButton for the selected plan. Reuses the same
 * Stripe price IDs as the dedicated pages.
 */
export default function HubCardCheckout({
  checkout,
  checkoutOptions,
  accentColor,
}: HubCardCheckoutProps) {
  const [selected, setSelected] = useState(0);

  // Single-price → straight to checkout
  if (checkout) {
    return (
      <CheckoutButton
        priceId={checkout.priceId}
        mode={checkout.mode}
        metadata={checkout.metadata}
        label={checkout.label}
        variant="primary"
        className="w-full justify-center"
      />
    );
  }

  if (!checkoutOptions || checkoutOptions.length === 0) return null;

  const active = checkoutOptions[selected];

  return (
    <div className="w-full space-y-3">
      {/* Plan picker */}
      <div className="flex flex-wrap gap-2">
        {checkoutOptions.map((opt, idx) => {
          const isActive = idx === selected;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelected(idx)}
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200"
              style={
                isActive
                  ? { borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}1A` }
                  : { borderColor: 'rgba(255,255,255,0.14)', color: '#9DA3B4' }
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Buy the selected plan */}
      <CheckoutButton
        priceId={active.priceId}
        mode={active.mode}
        metadata={active.metadata}
        label={`Continue — ${active.label}`}
        variant="primary"
        className="w-full justify-center"
      />
    </div>
  );
}
