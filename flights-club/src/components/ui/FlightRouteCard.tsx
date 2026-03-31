'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import type { FlightRoute } from '@/lib/types';

// ── Animated dotted route line with flying plane ──────────────────────────────

function AnimatedRouteLine({ inView }: { inView: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineWidth, setLineWidth] = useState(0);

  // Measure container width; keep updated on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setLineWidth(el.offsetWidth);
    const observer = new ResizeObserver(() => setLineWidth(el.offsetWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = inView && lineWidth > 0;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 mx-3 overflow-hidden"
      style={{ height: '22px' }}
    >
      {/* Dotted track */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/15" />

      {/* Flying plane */}
      <motion.span
        className="absolute top-1/2 -translate-y-1/2 text-accent-orange text-sm leading-none pointer-events-none"
        style={{ left: 0 }}
        animate={
          shouldAnimate
            ? { x: [0, lineWidth + 24] }
            : { x: 0 }
        }
        transition={
          shouldAnimate
            ? {
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 2,
              }
            : { duration: 0 }
        }
      >
        ✈
      </motion.span>
    </div>
  );
}

// ── FlightRouteCard ───────────────────────────────────────────────────────────

interface FlightRouteCardProps {
  route: FlightRoute;
  /** Framer Motion stagger variants (desktop grid) */
  variants?: Variants;
  /** Extra classes on the root element */
  className?: string;
  /** Mobile mode — adds w-80 snap / CSS hover instead of framer whileHover */
  isMobile?: boolean;
}

export function FlightRouteCard({
  route,
  variants,
  className = '',
  isMobile = false,
}: FlightRouteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger once the card enters the viewport; keep looping after that
  const inView = useInView(cardRef, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={cardRef}
      variants={variants}
      whileHover={
        !isMobile
          ? {
              y: -4,
              borderColor: '#E8963A',
              boxShadow: '0 20px 60px rgba(232, 150, 58, 0.2)',
            }
          : undefined
      }
      transition={{ duration: 0.3 }}
      className={[
        'bg-bg-primary rounded-xl overflow-hidden border border-border-subtle transition-all group',
        isMobile
          ? 'w-80 flex-shrink-0 snap-center hover:border-accent-orange/50 hover:shadow-xl hover:shadow-accent-orange/20'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Destination image / placeholder */}
      <div className="h-48 bg-gradient-to-br from-accent-blue/20 to-accent-orange/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-text-muted group-hover:text-accent-orange transition-colors">
          <span className="text-sm font-semibold">
            {route.from} → {route.to}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-6">

        {/* Route row: City — animated line — City */}
        <div className="flex items-center mb-4">
          <div className="shrink-0">
            <p className="text-text-muted text-sm">From</p>
            <p className="text-2xl font-bold text-text-primary">{route.from}</p>
          </div>

          <AnimatedRouteLine inView={inView} />

          <div className="shrink-0 text-right">
            <p className="text-text-muted text-sm">To</p>
            <p className="text-2xl font-bold text-text-primary">{route.to}</p>
          </div>
        </div>

        {/* Points vs retail */}
        <div className="space-y-3 mb-6 border-t border-border-subtle pt-6">
          <div>
            <p className="text-text-muted text-sm">Using Points</p>
            <p className="text-xl font-bold text-accent-orange">{route.points_cost}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Cash Price</p>
            <p className="text-xl font-bold text-text-secondary">{route.retail_cost}</p>
          </div>
        </div>

        {/* Saving equivalent */}
        <div className="bg-bg-secondary rounded-lg p-4 border border-border-subtle">
          <p className="text-sm text-text-secondary italic">
            That's the same as:{' '}
            <span className="text-accent-orange font-semibold">
              {route.saving_equivalent}
            </span>
          </p>
        </div>

      </div>
    </motion.div>
  );
}
