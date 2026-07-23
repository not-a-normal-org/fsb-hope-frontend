/**
 * Saver Miles logo — docs/plans/08-logo-brand-mark.md (LOCKED).
 *
 * Wordmark "SaverMiles" (one word, Zilla Slab 700, mode-aware ink) over a
 * rounded green arc. The arc is the one deliberate green in the whole brand:
 * a hardcoded #0E7C50, fixed across all three modes, logo-only — never reused
 * as a link/accent/hover elsewhere, and NOT the same as --sm-success.
 *
 * Sizing is by font-size, not a fixed width: callers set the size via a text-*
 * class (e.g. `text-3xl`), the wordmark renders at that size, and the arc is
 * `w-full` of the wordmark's natural width so the two always align. The lockup
 * is inline-level, so a `text-center` parent centers it.
 *
 * variant="icon" renders the arc alone on a square, the standalone mark for
 * favicon / social avatar contexts where the wordmark won't be legible.
 */
const ARC_GREEN = '#0E7C50';

type LogoProps = {
  variant?: 'full' | 'icon';
  className?: string;
  /** Accessible name; pass "" only when a visible label sits beside it. */
  label?: string;
};

export default function Logo({ variant = 'full', className = '', label = 'Saver Miles' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 32 20"
        role="img"
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        className={className}
      >
        <path
          d="M4 7 Q16 14 28 7"
          stroke={ARC_GREEN}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      role="img"
      aria-label={label || undefined}
    >
      <span aria-hidden="true" className="font-display font-bold tracking-[-0.01em] text-ink">
        SaverMiles
      </span>
      {/* Arc underline — a smile, per docs/plans/08. Sized in em, NOT a % of the
          container: a percentage-width SVG has no intrinsic size and falls back
          to 300px, which inflates a flex ancestor (the nav) and balloons the
          arc. em is font-driven, so nav and every other context render
          identically. "SaverMiles" in Zilla Slab 700 measures 4.94em, so 4.2em
          ≈ 85% of the word (≈78% visible green after the path's end-padding) —
          a wide smile matching the construction page. ~15% curve depth. To
          widen/narrow, change only this em value; keep the path (the curve). */}
      <svg viewBox="0 0 100 21" style={{ width: '4.2em' }} aria-hidden="true">
        <path
          d="M4 3 Q50 31 96 3"
          stroke={ARC_GREEN}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
