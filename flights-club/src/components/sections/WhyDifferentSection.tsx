'use client';

import { useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { WHY_DIFFERENT_FEATURES } from '@/lib/constants';
import * as Icons from 'lucide-react';

const iconPulseVariant = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [1, 1.15, 1],
    opacity: 1,
    transition: { duration: 0.6, delay: 0.3, times: [0, 0.5, 1] },
  },
};

const iconMap: Record<string, any> = {
  Brain: Icons.Brain,
  Plane: Icons.Plane,
  Star: Icons.Star,
  Shield: Icons.Shield,
  Map: Icons.Map,
  Users: Icons.Users,
};

// ── Feature card ──────────────────────────────────────────────────────────────
// Mouse tracking via onMouseMove on the card (React synthetic events hit Framer
// directly). Global window listeners have a Strict Mode subscription timing bug.

function FeatureCard({ feature }: { feature: typeof WHY_DIFFERENT_FEATURES[number] }) {
  const IconComponent = iconMap[feature.icon];

  // Magnetic x/y for the icon
  const iconRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 80) {
      const cap = 12;
      x.set(Math.max(-cap, Math.min(cap, dx * 0.3)));
      y.set(Math.max(-cap, Math.min(cap, dy * 0.3)));
    } else {
      x.set(0);
      y.set(0);
    }
  }, [x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      className="group relative p-8 bg-bg-card border border-border-subtle rounded-xl cursor-default"
      variants={staggerChildVariant}
      whileHover={{ y: -2, backgroundColor: '#1A2035' }}
      transition={{ duration: 0.3 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Magnetic wrapper — x/y only, no variant conflict */}
      <motion.div ref={iconRef} style={{ x: springX, y: springY }} className="mb-6 w-fit">
        {/* Inner — pulse + hover scale */}
        <motion.div
          className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-orange to-accent-orange-light flex items-center justify-center"
          variants={iconPulseVariant}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.25 }}
          viewport={{ once: true }}
        >
          {IconComponent
            ? <IconComponent className="w-6 h-6 text-bg-primary" strokeWidth={2} />
            : <div className="w-6 h-6 rounded-full bg-opacity-50" />
          }
        </motion.div>
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-accent-orange-light transition-colors duration-300">
        {feature.title}
      </h3>
      <p className="text-text-secondary leading-relaxed text-sm">
        {feature.description}
      </p>

      {/* Accent line on hover */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent-orange to-accent-orange-light rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function WhyDifferentSection() {
  return (
    <section className="relative py-24 bg-bg-primary overflow-hidden">
      <div className="absolute top-10 left-5 w-96 h-96 bg-accent-orange rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="max-w-2xl mb-16">
          <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">WHY WE'RE DIFFERENT</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
            Built for Business Owners Who Deserve Better
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {WHY_DIFFERENT_FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
