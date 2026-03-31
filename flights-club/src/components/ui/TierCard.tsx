'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Check } from 'lucide-react';
import { staggerChildVariant } from '@/lib/animations';
import type { MembershipTier } from '@/lib/types';

interface TierCardProps {
  tier: MembershipTier;
  /** Elevate the card (md:scale-105) — used on the Platinum tier */
  elevated?: boolean;
}

export default function TierCard({ tier, elevated = false }: TierCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isPopular = tier.id === 'platinum';
  const isElite   = tier.id === 'black';

  const mouseX        = useMotionValue(0);
  const mouseY        = useMotionValue(0);
  const overlayOpacity = useMotionValue(0);

  // Per-tier cursor spotlight size and color
  const circleSize = isElite ? 320 : 200;
  const gradientStops = isElite
    ? (x: number, y: number) =>
        `radial-gradient(circle ${circleSize}px at ${x}px ${y}px, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.08) 45%, transparent 70%)`
    : isPopular
    ? (x: number, y: number) =>
        `radial-gradient(circle ${circleSize}px at ${x}px ${y}px, rgba(232,150,58,0.12), transparent 70%)`
    : (x: number, y: number) =>
        `radial-gradient(circle ${circleSize}px at ${x}px ${y}px, rgba(58,111,232,0.10), transparent 70%)`;

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) => gradientStops(x, y)
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      if (overlayOpacity.get() < 1) animate(overlayOpacity, 1, { duration: 0.2 });
    },
    [mouseX, mouseY, overlayOpacity]
  );

  const onMouseLeave = useCallback(() => {
    animate(overlayOpacity, 0, { duration: 0.4 });
  }, [overlayOpacity]);

  const accentText = isElite
    ? 'text-accent-gold'
    : isPopular
    ? 'text-accent-orange'
    : 'text-text-primary';

  const checkColor = isElite
    ? 'text-accent-gold'
    : isPopular
    ? 'text-accent-orange'
    : 'text-accent-blue';

  const highlightBox = isElite
    ? 'border-accent-gold/30 bg-accent-gold/5'
    : isPopular
    ? 'border-accent-orange/30 bg-accent-orange/5'
    : 'border-accent-blue/20 bg-accent-blue/5';

  return (
    <motion.div
      ref={cardRef}
      className={`group relative rounded-xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isElite
          ? 'border-accent-gold bg-gradient-to-br from-bg-card via-bg-secondary to-bg-card shimmer-on-hover'
          : isPopular
          ? 'border-accent-orange/60 bg-gradient-to-br from-bg-card to-bg-secondary'
          : 'border-border-subtle bg-bg-card'
      } ${elevated && isPopular ? 'md:scale-105 md:z-10' : ''}`}
      variants={staggerChildVariant}
      whileHover={isElite ? { y: -6, scale: 1.01 } : { y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Cursor-following radial gradient spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background, opacity: overlayOpacity }}
      />

      {/* Accent top line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r z-10 ${
          isElite
            ? 'from-accent-gold to-accent-gold/50'
            : isPopular
            ? 'from-accent-orange to-accent-orange/50'
            : 'from-accent-blue to-accent-blue/50'
        }`}
      />

      {/* Badge */}
      {tier.badge && (
        <motion.div
          className={`absolute top-6 right-6 px-3 py-1 rounded-full text-bg-primary text-xs font-bold uppercase tracking-wider z-10 ${
            isElite ? 'bg-accent-gold' : 'bg-accent-orange'
          }`}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {tier.badge}
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8 sm:p-10 flex flex-col flex-1">
        {/* Tier name */}
        <h3 className={`text-3xl font-bold mb-2 ${accentText}`}>{tier.name}</h3>

        {/* Target spend */}
        <p className="text-text-secondary text-sm mb-6 leading-relaxed min-h-10">
          {tier.target}
        </p>

        {/* Key benefit highlight box */}
        <div className={`rounded-lg p-4 mb-8 border ${highlightBox}`}>
          <p
            className={`text-sm font-semibold leading-relaxed ${
              isElite || isPopular ? 'text-text-primary' : 'text-text-secondary'
            }`}
          >
            {tier.key_benefit}
          </p>
        </div>

        {/* Price (optional — shown on detail pages) */}
        {tier.price && (
          <div className="mb-6">
            <span className={`text-2xl font-bold ${accentText}`}>{tier.price}</span>
          </div>
        )}

        {/* Feature list */}
        <div className="space-y-3 mb-8 flex-1">
          {tier.included.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check
                size={16}
                className={`flex-shrink-0 mt-0.5 ${checkColor}`}
                strokeWidth={2.5}
              />
              <span className="text-text-secondary text-sm leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <motion.a
          href={tier.cta_href}
          className={`block w-full py-3 px-4 rounded-lg font-semibold text-center text-sm uppercase tracking-wide transition-all duration-300 ${
            isElite
              ? 'bg-accent-gold text-bg-primary hover:bg-accent-gold/90'
              : isPopular
              ? 'bg-accent-orange text-bg-primary hover:bg-accent-orange/90'
              : 'border border-accent-blue text-accent-blue hover:bg-accent-blue/10'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {tier.cta_label}
        </motion.a>
      </div>

      {/* Blue tier hover glow */}
      {!isPopular && !isElite && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/0 to-accent-blue/0 group-hover:from-accent-blue/5 group-hover:to-accent-blue/10 transition-all duration-300 pointer-events-none" />
      )}
    </motion.div>
  );
}
