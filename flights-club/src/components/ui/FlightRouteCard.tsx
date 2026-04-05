'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import type { FlightRoute } from '@/lib/types';

// ── Animated dotted SVG route line with flying plane ─────────────────────────

function AnimatedRouteLine({
  inView,
  hovered,
}: {
  inView: boolean;
  hovered: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setLineWidth(el.offsetWidth);
    const observer = new ResizeObserver(() => setLineWidth(el.offsetWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = inView && lineWidth > 0;
  const duration = hovered ? 0.8 : 2;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 mx-3 overflow-hidden"
      style={{ height: '22px' }}
    >
      {/* SVG dotted track */}
      {lineWidth > 0 && (
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 overflow-visible"
          width={lineWidth}
          height={2}
          aria-hidden="true"
        >
          <line
            x1={0}
            y1={1}
            x2={lineWidth}
            y2={1}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={2}
            strokeDasharray="3 6"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Flying plane */}
      <motion.span
        key={`plane-${duration}`}
        className="absolute top-1/2 -translate-y-1/2 text-accent-orange text-sm leading-none pointer-events-none select-none"
        style={{ left: 0 }}
        animate={
          shouldAnimate
            ? { x: [0, lineWidth + 24] }
            : { x: 0 }
        }
        transition={
          shouldAnimate
            ? {
                duration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: duration === 0.8 ? 0.5 : 2,
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
  variants?: Variants;
  className?: string;
  isMobile?: boolean;
}

export function FlightRouteCard({
  route,
  variants,
  className = '',
  isMobile = false,
}: FlightRouteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      variants={variants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
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

          <AnimatedRouteLine inView={inView} hovered={hovered} />

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
            That&apos;s the same as:{' '}
            <span className="text-accent-orange font-semibold">
              {route.saving_equivalent}
            </span>
          </p>
        </div>

      </div>
    </motion.div>
  );
}
