'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Contrast } from 'lucide-react';

import { applyThemeMode, nextThemeMode, readThemeMode, type ThemeMode } from '@/lib/theme';

/**
 * Compact theme control for the nav — one icon that cycles Light → Dark → Mono
 * on each click (the fuller segmented ModeToggle lives in the footer). Shares the
 * theme mechanism in src/lib/theme.ts so the two never drift.
 */
const ICON: Record<ThemeMode, typeof Sun> = { light: Sun, dark: Moon, mono: Contrast };
const LABEL: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', mono: 'Mono' };

export default function ModeCycle({ className = '' }: { className?: string }) {
  // SSR default matches the dark default; corrected post-hydration from the live
  // attribute ThemeScript already resolved pre-paint (no flash, no mismatch).
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const current = readThemeMode();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (current) setMode(current);
  }, []);

  const Icon = ICON[mode];
  const next = nextThemeMode(mode);

  return (
    <button
      type="button"
      aria-label={`Theme: ${LABEL[mode]} — switch to ${LABEL[next]}`}
      title={`Theme: ${LABEL[mode]}`}
      onClick={() => {
        setMode(next);
        applyThemeMode(next);
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${className}`}
      style={{
        borderColor: 'var(--sm-glass-border)',
        background: 'var(--sm-glass-bg)',
        color: 'var(--sm-ink)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
