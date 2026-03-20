'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { STATS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  stat: (typeof STATS)[0];
  index: number;
}

function StatCounter({ stat, index }: CounterProps) {
  const counterRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState('0');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!counterRef.current) return;

      const obj = { value: 0 };

      gsap.to(obj, {
        value: stat.value,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counterRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
        onUpdate: () => {
          // Format the number based on the stat type
          let formattedValue: string;

          if (stat.suffix === ' Years') {
            formattedValue = Math.floor(obj.value).toString();
          } else {
            formattedValue = Math.floor(obj.value).toLocaleString();
          }

          // Add prefix and suffix
          setDisplayValue(`${stat.prefix}${formattedValue}${stat.suffix}`);
        },
      });
    });

    return () => ctx.revert();
  }, [stat]);

  return (
    <motion.div
      variants={staggerChildVariant}
      className="relative text-center group"
    >
      {/* Subtle background glow */}
      <div className="absolute -inset-4 bg-accent-orange/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <p className="text-sm uppercase tracking-widest text-text-muted font-semibold mb-4">
          {stat.label}
        </p>
        <div
          ref={counterRef}
          className="font-mono text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-bold text-accent-orange mb-4 leading-none whitespace-nowrap"
        >
          {displayValue}
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-accent-orange via-accent-orange to-transparent mx-auto" />
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 bg-bg-primary border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Pure Authority
          </h2>
          <p className="text-lg text-text-secondary">
            The numbers speak for themselves
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-3 gap-8"
        >
          {STATS.map((stat, idx) => (
            <StatCounter key={`stat-${idx}`} stat={stat} index={idx} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16 pt-12 border-t border-border-subtle"
        >
          <p className="text-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
            These aren't just numbers. They represent{' '}
            <span className="text-accent-orange font-semibold">
              12+ years of expertise
            </span>{' '}
            delivering Business Class results to ambitious Australian business
            owners.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
