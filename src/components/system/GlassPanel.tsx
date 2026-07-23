import type { ElementType, ReactNode } from 'react';

/**
 * Frosted glass surface — docs/plans/01-brand-design-system.md §4.
 *
 * Reads --sm-glass-* tokens, so it recolors across Light/Dark/Mono with no props.
 * Glass only reads as glass over something blurred — always pair it with an
 * <AmbientBackground /> behind the section, never place it on a flat fill.
 */
type GlassPanelProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Tailwind padding classes; defaults to a comfortable card pad. */
  padding?: string;
  /** Tailwind max-width class, e.g. "max-w-xl". */
  maxWidth?: string;
};

export default function GlassPanel({
  children,
  as: Tag = 'div',
  className = '',
  padding = 'p-8 sm:p-10',
  maxWidth = '',
}: GlassPanelProps) {
  return (
    <Tag
      className={`rounded-2xl ${padding} ${maxWidth} ${className}`}
      style={{
        background: 'var(--sm-glass-bg)',
        border: '1px solid var(--sm-glass-border)',
        backdropFilter: 'blur(22px) saturate(150%)',
        WebkitBackdropFilter: 'blur(22px) saturate(150%)',
        boxShadow: 'var(--sm-glass-shadow), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {children}
    </Tag>
  );
}
