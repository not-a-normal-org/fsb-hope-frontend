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

/**
 * Modes the UI actually offers. Mono is HELD for launch (Review v3 §10/§11): its
 * CSS + `mono` as a valid ThemeMode stay intact (so a stored `mono` still renders,
 * and it can return by re-adding it here), but the nav + footer controls only
 * expose Light and Dark — dropping the QA surface from three themes to two.
 */
export const SELECTABLE_MODES = ['light', 'dark'] as const satisfies readonly ThemeMode[];

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

/**
 * The next mode in the cycle, restricted to the SELECTABLE modes (Light ⇄ Dark
 * while Mono is held). If the current mode is not selectable (e.g. a stored
 * `mono`), the cycle re-enters at the first selectable mode.
 */
export function nextThemeMode(mode: ThemeMode): ThemeMode {
  const i = SELECTABLE_MODES.indexOf(mode as (typeof SELECTABLE_MODES)[number]);
  return SELECTABLE_MODES[(i + 1) % SELECTABLE_MODES.length];
}
