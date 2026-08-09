/**
 * The 3-blob blurred backdrop that gives glass something to blur over
 * (docs/plans/01-brand-design-system.md §4, 04-components-spec.md).
 *
 * Colors come from --sm-blob-1/2/3, so blobs recolor per mode with no props and
 * no re-render. Decorative only: aria-hidden, non-interactive, behind content.
 *
 * variant="hero"    → larger, more present blobs for the top of a page.
 * variant="section" → smaller/subtler, so below-the-fold glass doesn't compete.
 */
type AmbientBackgroundProps = {
  variant?: 'hero' | 'section';
  className?: string;
};

export default function AmbientBackground({
  variant = 'section',
  className = '',
}: AmbientBackgroundProps) {
  const hero = variant === 'hero';

  const blobs = hero
    ? [
        { bg: 'var(--sm-blob-1)', size: 360, top: '-90px', left: '-70px' },
        { bg: 'var(--sm-blob-2)', size: 300, bottom: '-70px', right: '-50px' },
        { bg: 'var(--sm-blob-3)', size: 230, top: '30%', right: '12%' },
      ]
    : [
        { bg: 'var(--sm-blob-1)', size: 240, top: '-60px', left: '-40px' },
        { bg: 'var(--sm-blob-2)', size: 200, bottom: '-50px', right: '-30px' },
      ];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            background: b.bg,
            width: b.size,
            height: b.size,
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            filter: `blur(${hero ? 82 : 70}px)`,
          }}
        />
      ))}

      {/* Fine grain over the blurred wash. Large 8-bit gradients band into visible
          stripes (Review v3 §1); a low-opacity fractal-noise tile dithers them
          away. Inline SVG feTurbulence — no network asset, blends over the fill. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '140px 140px',
          opacity: hero ? 0.04 : 0.03,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
