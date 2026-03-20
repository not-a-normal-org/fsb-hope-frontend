'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FINAL_CTA } from '@/lib/constants';

const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
    },
  }),
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export default function FinalCTASection() {
  const headlineWords = FINAL_CTA.headline.split(' ');
  const [isPulsing, setIsPulsing] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle pulse animation trigger after 3s when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only set up timer if section becomes visible and not already pulsing
        if (entry.isIntersecting && !isPulsing) {
          const timer = setTimeout(() => {
            setIsPulsing(true);
          }, 3000);

          // Cleanup timer when component unmounts or section leaves view
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isPulsing]);

  return (
    <section ref={sectionRef} className="relative py-32 bg-bg-secondary/50 overflow-hidden border-t border-border-subtle">
      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent-orange rounded-full mix-blend-screen filter blur-3xl opacity-8 -z-10" />
      <div className="absolute bottom-10 left-5 w-96 h-96 bg-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-8 -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
        {/* Headline with word-by-word animation */}
        <motion.h2
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-primary mb-8 leading-tight flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {headlineWords.map((word, idx) => (
            <motion.span
              key={idx}
              variants={wordVariant}
              custom={idx}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {FINAL_CTA.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href={FINAL_CTA.cta_href}
            className={`inline-block px-8 sm:px-10 py-4 bg-accent-orange text-bg-primary font-bold text-lg uppercase tracking-wide rounded-lg hover:bg-accent-orange-light transition-all duration-300 shadow-lg hover:shadow-xl ${
              isPulsing ? 'animate-cta-pulse' : ''
            }`}
          >
            {FINAL_CTA.cta_label}
          </a>
        </motion.div>

        {/* Urgency line */}
        <motion.p
          className="text-sm text-text-muted italic mt-8 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {FINAL_CTA.urgency_line}
        </motion.p>
      </div>
    </section>
  );
}
