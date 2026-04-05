'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FINAL_CTA } from '@/lib/constants';

// Deterministic particle config — avoids hydration mismatch on SSR
// Negative delay pre-seeds each particle mid-loop so the section is
// populated with drifting dots from the very first frame.
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id:       i,
  left:     ((i * 17 + 7) * 4.97) % 100,                 // 0–100% x
  size:     i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,    // px: 3 / 2 / 1.5
  opacity:  0.25 + ((i * 0.11) % 0.35),                  // 0.25–0.60
  duration: 8 + ((i * 0.73 + 1.1) % 7),                  // 8–15 s
  delay:   -((i * 0.42 + 0.1) % 8),                      // negative = pre-seeded
}));

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

interface FinalCTASectionProps {
  headline?: string;
  subheadline?: string;
  cta_label?: string;
  cta_href?: string;
  urgency_line?: string;
  /** Word to render in accent-orange within the headline */
  highlight_word?: string;
  /** Optional secondary link below the primary CTA */
  secondary_link?: { label: string; href: string };
}

export default function FinalCTASection({
  headline      = FINAL_CTA.headline,
  subheadline   = FINAL_CTA.subheadline,
  cta_label     = FINAL_CTA.cta_label,
  cta_href      = FINAL_CTA.cta_href,
  urgency_line  = FINAL_CTA.urgency_line,
  highlight_word,
  secondary_link,
}: FinalCTASectionProps) {
  const headlineWords = headline.split(' ');
  const [isPulsing, setIsPulsing] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPulsing) {
          const timer = setTimeout(() => setIsPulsing(true), 3000);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [isPulsing]);

  return (
    <section ref={sectionRef} className="relative py-32 bg-bg-secondary/50 overflow-hidden border-t border-border-subtle">
      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent-orange rounded-full mix-blend-screen filter blur-3xl opacity-8 -z-10" />
      <div className="absolute bottom-10 left-5 w-96 h-96 bg-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-8 -z-10" />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            left:            `${p.left}%`,
            bottom:          '-8px',
            width:           p.size,
            height:          p.size,
            backgroundColor: `rgba(232, 150, 58, ${p.opacity})`,
          }}
          animate={{ y: [0, -900] }}
          transition={{
            duration:    p.duration,
            delay:       p.delay,
            repeat:      Infinity,
            ease:        'linear',
            repeatDelay: 0,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 text-center">
        {/* Headline — word-by-word, with optional highlighted word */}
        <motion.h2
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-primary mb-8 leading-tight flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {headlineWords.map((word, idx) => (
            <motion.span key={idx} variants={wordVariant} custom={idx}>
              {highlight_word && word === highlight_word
                ? <span className="text-accent-orange">{word}</span>
                : word}
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
          {subheadline}
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={secondary_link ? 'mb-5' : ''}
        >
          <a
            href={cta_href}
            className={`inline-block px-8 sm:px-10 py-4 bg-accent-orange text-bg-primary font-bold text-lg uppercase tracking-wide rounded-lg hover:bg-accent-orange-light transition-all duration-300 shadow-lg hover:shadow-xl ${
              isPulsing ? 'animate-cta-pulse' : ''
            }`}
          >
            {cta_label}
          </a>
        </motion.div>

        {/* Optional secondary link */}
        {secondary_link && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
            className="mb-8"
          >
            <a
              href={secondary_link.href}
              className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200 underline underline-offset-4 decoration-text-secondary/40 hover:decoration-text-primary/60"
            >
              {secondary_link.label}
            </a>
          </motion.div>
        )}

        {/* Urgency line */}
        <motion.p
          className="text-sm text-text-muted italic mt-8 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {urgency_line}
        </motion.p>
      </div>
    </section>
  );
}
