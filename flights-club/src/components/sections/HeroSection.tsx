'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  wordContainerVariant,
  wordVariant,
  fadeUpVariant,
} from '@/lib/animations';
import { HERO } from '@/lib/constants';
import { CTAButton } from '@/components/ui/CTAButton';
import FloatingCards from '@/components/ui/FloatingCards';

gsap.registerPlugin(ScrollTrigger);

// Module-level flag: persists across soft navigations (back/forward),
// resets to false on full page reload. This prevents Framer Motion from
// applying opacity:0 initial state on back navigation where the animation
// already played once in this session.
let heroHasAnimated = false;

export default function HeroSection() {
  const line1Words = HERO.headline_line1.split(' ');
  const line2Words = HERO.headline_line2.split(' ');

  // On first mount: heroHasAnimated=false → use initial="hidden" (animate in).
  // On back navigation (soft nav remount): heroHasAnimated=true → use initial=false
  // so elements start at their animate target and are immediately visible.
  const skipInitial = heroHasAnimated;

  const backgroundRef = useRef<HTMLDivElement>(null);

  // Mark animated after a short delay (enough for animation to start)
  useEffect(() => {
    const t = setTimeout(() => { heroHasAnimated = true; }, 500);
    return () => clearTimeout(t);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!backgroundRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(backgroundRef.current, {
        y: -150,
        scrollTrigger: {
          trigger: backgroundRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          markers: false,
        },
        ease: 'none',
      });
    }, backgroundRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">

      {/* Parallax background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#07090F] via-[#0E1220] to-[#13182A]" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-orange opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-blue opacity-10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left column: copy ─────────────────────────────────────────── */}
          <div>
            {/* Headline — word-by-word entrance */}
            <motion.h1
              variants={wordContainerVariant}
              initial={skipInitial ? false : 'hidden'}
              animate="visible"
              className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-6 leading-tight tracking-tight flex flex-wrap justify-start gap-2 sm:gap-3"
            >
              {line1Words.map((word, idx) => (
                <motion.span key={`line1-${idx}`} variants={wordVariant}>
                  {word}
                </motion.span>
              ))}
              {line2Words.map((word, idx) => (
                <motion.span
                  key={`line2-${idx}`}
                  variants={wordVariant}
                  className="text-accent-orange"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUpVariant}
              initial={skipInitial ? false : 'hidden'}
              animate="visible"
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mb-10 sm:mb-12 leading-relaxed"
            >
              {HERO.subheadline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={skipInitial ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start items-start mb-10 sm:mb-12"
            >
              <CTAButton
                label={HERO.cta_primary.label}
                href={HERO.cta_primary.href}
                variant="primary"
              />
              <CTAButton
                label={HERO.cta_secondary.label}
                href={HERO.cta_secondary.href}
                variant="ghost"
              />
            </motion.div>

            {/* Trust badge */}
            <motion.div
              initial={skipInitial ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="text-text-muted text-xs sm:text-sm font-medium tracking-wide"
            >
              <p>{HERO.trust_badge}</p>
            </motion.div>
          </div>

          {/* ── Right column: floating cards (desktop only) ────────────────── */}
          <div className="hidden lg:block relative h-[500px]">
            <FloatingCards />
          </div>

        </div>
      </div>
    </section>
  );
}
