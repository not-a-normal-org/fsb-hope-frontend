'use client';

import { useEffect, useState } from 'react';

/**
 * 3-way theme control — Light / Dark / Mono (docs/plans/04-components-spec.md).
 *
 * Applies the choice by setting data-theme on <html>, which reassigns every
 * --sm-* token (see globals.css). Persists to localStorage under the same key
 * ThemeScript reads, so the pre-paint script and this component agree.
 *
 * The switch is a glass segmented pill. It carries radiogroup semantics and is
 * fully keyboard-operable. During a change it stamps [data-theme-anim] on <html>
 * so the ~300ms crossfade fires (and covers the CTA blue→off-white jump), then
 * clears it so hovers aren't transition-laden afterward.
 */
const STORAGE_KEY = 'sm-theme';
const MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'mono', label: 'Mono' },
] as const;

type Mode = (typeof MODES)[number]['value'];

function applyMode(mode: Mode) {
  const root = document.documentElement;
  root.setAttribute('data-theme-anim', '');
  root.dataset.theme = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* private mode / storage disabled — the switch still works for this session */
  }
  window.setTimeout(() => root.removeAttribute('data-theme-anim'), 320);
}

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
    applyMode(next);
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
