/**
 * Saver Miles logo — docs/plans/08-logo-brand-mark.md (LOCKED).
 *
 * Wordmark "SaverMiles" (one word, Zilla Slab 700, mode-aware ink) over a
 * rounded green arc, with a plane lifting off the end of the arc so the mark
 * reads as a flight path. The arc + plane are the one deliberate green in the
 * whole brand: a hardcoded #0E7C50, fixed across all modes, logo-only — never
 * reused as a link/accent/hover elsewhere, and NOT the same as --sm-success.
 *
 * Drawn in code, not shipped as an image: it stays crisp at any size, weighs
 * nothing, and the wordmark inherits `text-ink` so it stays legible in Light and
 * Dark alike (a raster with a fixed ink color does not).
 *
 * Sizing is by font-size, not a fixed width: callers set the size via a text-*
 * class (e.g. `text-3xl`), the wordmark renders at that size, and the arc is
 * sized in em so the two always align. The lockup is inline-level, so a
 * `text-center` parent centers it.
 *
 * variant="icon" renders the arc alone on a square, the standalone mark for
 * favicon / social avatar contexts where the wordmark won't be legible.
 */
const ARC_GREEN = '#0E7C50';

/** lucide-react's `plane` glyph (24×24), drawn filled as part of the mark. */
const PLANE_PATH =
  'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z';

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
          strokeWidth="3.3"
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
      {/* Arc underline — a smile, per docs/plans/08 — with a plane at its right
          end. Sized in em, NOT a % of the container: a percentage-width SVG has
          no intrinsic size and falls back to 300px, which inflates a flex
          ancestor (the nav) and balloons the arc. em is font-driven, so nav and
          every other context render identically. The viewBox is extended above
          the baseline (y from -3) and past x=100 to give the plane room without
          moving the arc. "SaverMiles" in Zilla Slab 700 measures 4.94em, so the
          arc still spans ~85% of the word. To widen/narrow, change only the em
          width; keep the path (the curve) and the viewBox. */}
      <svg viewBox="0 -3 104 24" style={{ width: '4.37em' }} aria-hidden="true">
        <path
          d="M4 3 Q50 31 96 3"
          stroke={ARC_GREEN}
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        <g transform="translate(97 1.5) scale(0.36) translate(-12 -12)">
          <path d={PLANE_PATH} fill={ARC_GREEN} />
        </g>
      </svg>
    </span>
  );
}
