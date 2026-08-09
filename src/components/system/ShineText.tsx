'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Metallic shine-sweep headline (docs/plans/01 §5, 04-components-spec.md).
 *
 * The gradient is --sm-shine (mode-aware: blue-tinted in Light/Dark, silver in
 * Mono); .animate-shine sweeps its position. Hero/section headlines only —
 * applying it to body copy loses its signature impact.
 *
 * Plays the sweep ONCE on load, then settles to uniform, full-contrast --sm-ink
 * (Review v3 §2). The still frame — which is what a visitor actually reads, and
 * every screenshot / OG image — must be clean, legible type, not a mid-sweep
 * gradient that reads as arbitrary two-tone emphasis. Under reduced motion it
 * renders solid immediately, no sweep.
 */
type ShineTextProps = {
  children: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
  /** Merged after the clip styles — for per-use type sizing (e.g. the hero). */
  style?: CSSProperties;
};

// One 6s sweep (matches .animate-shine in globals.css) + a small margin.
const SWEEP_MS = 6200;

export default function ShineText({ children, as: Tag = 'h1', className = '', style }: ShineTextProps) {
  const reduce = useReducedMotion();
  // Start unsettled so SSR + first paint show the sweep; settle after one pass.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    // Reduced motion settles on the next tick (no sweep); otherwise after one
    // 6s pass. Both go through the timeout callback so no setState fires
    // synchronously in the effect body.
    const id = setTimeout(() => setSettled(true), reduce ? 0 : SWEEP_MS);
    return () => clearTimeout(id);
  }, [reduce]);

  if (settled) {
    // Resting state: solid ink, no clip, no animation.
    return (
      <Tag className={`font-display ${className}`} style={{ color: 'var(--sm-ink)', ...style }}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={`animate-shine font-display ${className}`}
      style={{
        backgroundImage: 'var(--sm-shine)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        // Override the class's `infinite` so it runs a single pass and holds.
        animationIterationCount: 1,
        animationFillMode: 'both',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
