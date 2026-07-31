/**
 * Theme-mode mechanism, shared by the segmented ModeToggle (footer) and the
 * ModeCycle icon (nav) so they can never drift. Applying a mode sets `data-theme`
 * on <html> — which reassigns every --sm-* token in globals.css — stamps
 * `data-theme-anim` for the ~320ms crossfade, and persists to the same
 * localStorage key the pre-paint ThemeScript reads.
 *
 * Client-only helpers (touch document/window/localStorage); call from effects or
 * event handlers, never at module load.
 */

export const THEME_MODES = ['light', 'dark', 'mono'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** Must match ThemeScript + ModeToggle's original key. */
export const THEME_STORAGE_KEY = 'sm-theme';

export function applyThemeMode(mode: ThemeMode): void {
  const root = document.documentElement;
  root.setAttribute('data-theme-anim', '');
  root.dataset.theme = mode;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* private mode / storage disabled — the switch still works for this session */
  }
  window.setTimeout(() => root.removeAttribute('data-theme-anim'), 320);
}

/** The live mode ThemeScript already resolved pre-paint, or null if unset/odd. */
export function readThemeMode(): ThemeMode | null {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' || t === 'mono' ? t : null;
}

/** The next mode in the cycle: light → dark → mono → light. */
export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return THEME_MODES[(THEME_MODES.indexOf(mode) + 1) % THEME_MODES.length];
}
