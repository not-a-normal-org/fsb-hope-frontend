'use client';

import { useLayoutEffect, useRef } from 'react';
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

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  // Split headline into words for animation
  const line1Words = HERO.headline_line1.split(' ');
  const line2Words = HERO.headline_line2.split(' ');

  const backgroundRef = useRef<HTMLDivElement>(null);

  // Set up GSAP parallax on background
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!backgroundRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect: background moves at 0.4x scroll speed
      // Moves -150px over full page scroll using ScrollTrigger
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
      {/* Parallax Background Container */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Placeholder gradient background */}
        {/* TODO: Replace with Next.js Image component when hero-bg.jpg is available */}
        {/* Usage: <Image src="/public/images/hero-bg.jpg" alt="Hero background" fill objectFit="cover" /> */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#07090F] via-[#0E1220] to-[#13182A]" />

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Gradient orbs for atmosphere */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-orange opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-blue opacity-10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content wrapper with z-index to appear above background */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 text-center py-20">
        {/* Headline - Word by word animation (0.05s stagger per word) */}
        <motion.h1
          variants={wordContainerVariant}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-text-primary mb-6 leading-tight tracking-tight flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4"
        >
          {line1Words.map((word, idx) => (
            <motion.span
              key={`line1-${idx}`}
              variants={wordVariant}
            >
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

        {/* Subheadline - fade in after headline, 0.8s delay from start */}
        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed"
        >
          {HERO.subheadline}
        </motion.p>

        {/* CTA Buttons - fade in from below, 1.2s delay from start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 1.2, duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10 sm:mb-12"
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

        {/* Trust Badge - fade in last, 1.5s delay from start */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-text-muted text-xs sm:text-sm font-medium tracking-wide"
        >
          <p>{HERO.trust_badge}</p>
        </motion.div>
      </div>
    </section>
  );
}
