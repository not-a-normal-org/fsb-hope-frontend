'use client';

import { useEffect, useState } from 'react';

import { applyThemeMode, SELECTABLE_MODES, type ThemeMode } from '@/lib/theme';

/**
 * Segmented theme control — Light / Dark (docs/plans/04-components-spec.md). Mono
 * is held for launch (Review v3 §10/§11), so the pill is driven off
 * SELECTABLE_MODES; re-adding `mono` there brings the third segment back.
 *
 * The theme mechanism lives in src/lib/theme.ts (shared with the nav ModeCycle
 * icon). Glass segmented pill: radiogroup semantics, fully keyboard-operable,
 * stamps the ~320ms crossfade via applyThemeMode.
 */
const LABELS: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', mono: 'Mono' };
const MODES = SELECTABLE_MODES.map((value) => ({ value, label: LABELS[value] }));

type Mode = ThemeMode;

export default function ModeToggle({ className = '' }: { className?: string }) {
  // Default matches SSR (dark); corrected on mount from the live attribute the
  // pre-paint ThemeScript already resolved, so there is no flash and no mismatch.
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    // Post-hydration sync: SSR renders the dark default for a match, then this
    // corrects to the value ThemeScript already applied pre-paint (light/mono).
    // The one legitimate use of setState-in-effect — a client-only DOM read that
    // must run after the hydration-consistent first render.
    const current = document.documentElement.dataset.theme;
    if (current === 'light' || current === 'mono' || current === 'dark') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(current);
    }
  }, []);

  function select(next: Mode) {
    setMode(next);
    applyThemeMode(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color mode"
      className={`inline-flex overflow-hidden rounded-full border p-0.5 ${className}`}
      style={{
        borderColor: 'var(--sm-glass-border)',
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {MODES.map((m) => {
        const active = m.value === mode;
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => select(m.value)}
            className="rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors"
            style={{
              color: 'var(--sm-ink)',
              opacity: active ? 1 : 0.55,
              background: active ? 'var(--sm-glass-border)' : 'transparent',
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
