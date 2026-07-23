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
    </div>
  );
}
