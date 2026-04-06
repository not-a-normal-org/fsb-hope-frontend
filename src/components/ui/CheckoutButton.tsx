'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckoutButtonProps {
  priceId: string;
  mode: 'subscription' | 'payment';
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  customerEmail?: string;
}

// ── Variant styles ─────────────────────────────────────────────────────────────

const VARIANT_CLASSES = {
  primary:
    'bg-[#E8963A] text-[#07090F] font-semibold hover:bg-[#F2AA5E]',
  secondary:
    'bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/30 hover:bg-[#E8963A]/20 hover:border-[#E8963A]/50',
  ghost:
    'border border-white/30 text-white hover:border-white/80 hover:bg-white/5',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutButton({
  priceId,
  mode,
  label,
  variant = 'primary',
  className = '',
  customerEmail,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleClick() {
    if (loading || !priceId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode, customerEmail }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? 'Something went wrong. Please try again.');
      }

      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <motion.button
        type="button"
        disabled={loading || !priceId}
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm uppercase tracking-wide transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
        whileHover={!loading ? { scale: 1.02 } : undefined}
        whileTap={!loading ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.15 }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Redirecting…</span>
          </>
        ) : (
          label
        )}
      </motion.button>

      {error && (
        <p className="text-xs text-red-400 max-w-xs text-center leading-snug">{error}</p>
      )}
    </div>
  );
}
