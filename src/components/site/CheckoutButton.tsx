'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useI18n } from '@/i18n/LocaleProvider';

/**
 * Redirects to a Stripe Checkout session for a single price. POSTs the price +
 * mode to /api/checkout (which builds the session) and follows the returned URL.
 * Styled with the design-system `sm-cta` tokens so it recolors across all three
 * themes — never the archive's hardcoded hex.
 */
export default function CheckoutButton({
  priceId,
  mode,
  label,
  className = '',
  customerEmail,
  metadata,
  successPath,
  cancelPath,
}: {
  priceId?: string;
  mode: 'subscription' | 'payment';
  label: string;
  className?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  successPath?: string;
  cancelPath?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const m = useI18n().m.checkout;

  const disabled = loading || !priceId;

  async function handleClick() {
    if (disabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode, customerEmail, metadata, successPath, cancelPath }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? m.error);
      }
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : m.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`sm-cta inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {m.redirecting}
          </>
        ) : (
          label
        )}
      </button>
      {!priceId && (
        <p className="text-center text-xs leading-snug text-ink-muted">
          {m.notConfigured}
        </p>
      )}
      {error && (
        <p className="text-center text-xs leading-snug" style={{ color: 'var(--sm-error)' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
