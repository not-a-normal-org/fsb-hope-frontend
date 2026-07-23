'use client';

import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { TWO_PATHS } from '@/lib/constants';
import { CTAButton } from '@/components/ui/CTAButton';

const MAX_ROT = 8;   // degrees
const MAX_SHIFT = 6; // px for inner parallax
const SPRING = { stiffness: 180, damping: 18 };

interface TiltCardProps {
  path: (typeof TWO_PATHS)[0];
  accentClass: string;
  borderClass: string;
  glowClass: string;
  priceClass: string;
  ctaVariant: 'primary' | 'ghost';
}

function TiltCard({ path, accentClass, borderClass, glowClass, priceClass, ctaVariant }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rotX = useSpring(0, SPRING);
  const rotY = useSpring(0, SPRING);
  // Inner parallax — opposite direction, smaller magnitude
  const innerX = useSpring(0, SPRING);
  const innerY = useSpring(0, SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 … 1
    const dy = (e.clientY - cy) / (rect.height / 2);  // -1 … 1

    // rotateY tilts left/right, rotateX tilts up/down (inverted)
    rotY.set(dx * MAX_ROT);
    rotX.set(-dy * MAX_ROT);

    // Inner elements drift opposite — depth illusion
    innerX.set(-dx * MAX_SHIFT);
    innerY.set(-dy * MAX_SHIFT);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  return (
    <div className="relative group" style={{ perspective: '800px' }}>
      {/* Ambient glow */}
      <div className={`absolute inset-0 ${glowClass} rounded-2xl blur-xl`} />

      {/* Tilt wrapper */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative bg-bg-card ${borderClass} rounded-2xl p-8 transition-colors duration-300`}
      >
        {/* Inner content — subtle counter-parallax */}
        <motion.div style={{ x: innerX, y: innerY }}>
          <div className={`text-xs font-bold uppercase tracking-widest ${accentClass} mb-4`}>
            {path.label}
          </div>
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            {path.title}
          </h3>
          <p className="text-text-secondary mb-6 leading-relaxed">
            {path.description}
          </p>
          <div className="bg-bg-secondary rounded-lg p-4 mb-6">
            <p className={`${priceClass} font-semibold text-lg`}>
              {path.price}
            </p>
          </div>
          <CTAButton
            label={path.cta_label}
            href={path.cta_href}
            variant={ctaVariant}
            className="w-full text-center"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function TwoPathsSection() {
  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TiltCard
            path={TWO_PATHS[0]}
            accentClass="text-accent-blue"
            borderClass="border border-border-subtle hover:border-accent-blue/50"
            glowClass="bg-gradient-to-r from-accent-blue/20 to-transparent"
            priceClass="text-accent-blue"
            ctaVariant="ghost"
          />
          <TiltCard
            path={TWO_PATHS[1]}
            accentClass="text-accent-orange"
            borderClass="border-2 border-accent-orange hover:border-accent-orange/80"
            glowClass="bg-gradient-to-r from-accent-orange/20 to-transparent"
            priceClass="text-accent-orange"
            ctaVariant="primary"
          />
        </div>
      </div>
    </section>
  );
}
