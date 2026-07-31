import type { CSSProperties, ReactNode } from 'react';

/**
 * Metallic shine-sweep headline (docs/plans/01 §5, 04-components-spec.md).
 *
 * The gradient is --sm-shine (mode-aware: blue-tinted in Light/Dark, silver in
 * Mono); .animate-shine only sweeps its position. Hero/section headlines only —
 * applying it to body copy loses its signature impact.
 *
 * The gradient is clipped to the text. A same-color solid fallback keeps the
 * text visible if background-clip:text fails, and under reduced-motion the CSS
 * media query in globals.css halts the sweep so it renders as a static gradient.
 */
type ShineTextProps = {
  children: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
  /** Merged after the clip styles — for per-use type sizing (e.g. the hero). */
  style?: CSSProperties;
};

export default function ShineText({ children, as: Tag = 'h1', className = '', style }: ShineTextProps) {
  return (
    <Tag
      className={`animate-shine font-display ${className}`}
      style={{
        backgroundImage: 'var(--sm-shine)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
