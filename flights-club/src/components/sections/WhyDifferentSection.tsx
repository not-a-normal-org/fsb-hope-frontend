'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { WHY_DIFFERENT_FEATURES } from '@/lib/constants';
import * as Icons from 'lucide-react';

const iconPulseVariant = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [1, 1.15, 1],
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 0.3,
      times: [0, 0.5, 1],
    },
  },
};

// Map icon names to lucide components
const iconMap: Record<string, any> = {
  Brain: Icons.Brain,
  Plane: Icons.Plane,
  Star: Icons.Star,
  Shield: Icons.Shield,
  Map: Icons.Map,
  Users: Icons.Users,
};

export default function WhyDifferentSection() {
  return (
    <section className="relative py-24 bg-bg-primary overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-10 left-5 w-96 h-96 bg-accent-orange rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">WHY WE'RE DIFFERENT</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
            Built for Business Owners Who Deserve Better
          </h2>
        </div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {WHY_DIFFERENT_FEATURES.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <motion.div
                key={index}
                className="group relative p-8 bg-bg-card border border-border-subtle rounded-xl cursor-default"
                variants={staggerChildVariant}
                whileHover={{ y: -2, backgroundColor: '#1A2035' }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon container with pulse animation */}
                <motion.div
                  className="mb-6 w-12 h-12 rounded-lg bg-gradient-to-br from-accent-orange to-accent-orange-light flex items-center justify-center"
                  variants={iconPulseVariant}
                  initial="initial"
                  whileInView="animate"
                  whileHover={{ scale: [1, 1.15, 1], transition: { duration: 0.4 } }}
                  viewport={{ once: true }}
                >
                  {IconComponent ? (
                    <IconComponent className="w-6 h-6 text-bg-primary" strokeWidth={2} />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-opacity-50" />
                  )}
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
          })}
        </motion.div>
      </div>
    </section>
  );
}
