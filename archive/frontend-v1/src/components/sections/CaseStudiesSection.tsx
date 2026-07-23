'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CASE_STUDIES } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';

// ── Drag icon ─────────────────────────────────────────────────────────────────

function DragIcon() {
  return (
    <svg
      width="22" height="12" viewBox="0 0 22 12"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      {/* left arrow */}
      <path d="M7 6H1M1 6L4 3M1 6L4 9" />
      {/* right arrow */}
      <path d="M15 6H21M21 6L18 3M21 6L18 9" />
      {/* centre grip */}
      <line x1="10" y1="2" x2="10" y2="10" strokeDasharray="2 2" />
      <line x1="12" y1="2" x2="12" y2="10" strokeDasharray="2 2" />
    </svg>
  );
}

// ── Shared card body ──────────────────────────────────────────────────────────

function CaseStudyCard({ study }: { study: typeof CASE_STUDIES[number] }) {
  return (
    <>
      <div className="absolute -inset-3 bg-accent-orange/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      <div className="bg-bg-secondary rounded-xl p-8 border border-border-subtle hover:border-accent-orange/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent-orange/20 h-full">

        {/* Tier badge */}
        <div className="inline-block mb-4">
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            study.tier === 'Explore'
              ? 'bg-accent-blue/20 text-accent-blue'
              : study.tier === 'Platinum'
                ? 'bg-accent-orange/20 text-accent-orange'
                : 'bg-accent-gold/20 text-accent-gold'
          }`}>
            {study.tier}
          </span>
        </div>

        {/* Quote */}
        <blockquote className="text-lg font-semibold text-text-primary mb-6 italic line-clamp-3">
          "{study.quote}"
        </blockquote>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Name</p>
            <p className="font-bold text-text-primary text-lg">{study.name}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Business</p>
            <p className="font-semibold text-text-secondary">{study.business_type}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Turnover</p>
            <p className="font-semibold text-text-secondary">{study.turnover}</p>
          </div>
        </div>

        <div className="border-t border-border-subtle mb-6" />

        {/* Results */}
        <div className="space-y-2">
          <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Result</p>
          <p className="text-lg font-bold text-accent-orange">{study.result}</p>
          <p className="text-sm text-text-secondary">{study.saving}</p>
        </div>

      </div>
    </>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function CaseStudiesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [hasDragged, setHasDragged] = useState(false);
  // Explicit pixel constraint — avoids Framer's broken ref-inside-overflow calc
  const [dragLeft, setDragLeft] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !rowRef.current) return;
      const overflow = rowRef.current.scrollWidth - containerRef.current.offsetWidth;
      setDragLeft(-Math.max(overflow, 0));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-12">
          <SectionLabel label="Real Stories" />
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            How Our Members Turned Spend Into Business Class
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl">
            These aren't hypothetical numbers. These are actual business owners who now fly smarter.
          </p>
        </div>

        {/* ── Desktop: drag-to-scroll ──────────────────────────────────── */}
        <div ref={containerRef} className="hidden sm:block overflow-hidden">
          <motion.div
            ref={rowRef}
            drag="x"
            dragConstraints={{ left: dragLeft, right: 0 }}
            dragElastic={0.05}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
            whileDrag={{ scale: 0.98 }}
            onDragStart={() => setHasDragged(true)}
            className="flex gap-6 cursor-grab active:cursor-grabbing pb-2"
          >
            {CASE_STUDIES.map((study, idx) => (
              <motion.div
                key={`case-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: 'easeOut' }}
                className="min-w-[380px] flex-shrink-0"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="relative group h-full"
                >
                  <CaseStudyCard study={study} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Drag hint — fades out after first drag */}
        <motion.div
          className="hidden sm:flex items-center gap-2 text-sm text-[#5C6378] mt-3 select-none pointer-events-none"
          animate={{ opacity: hasDragged ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <DragIcon />
          <span>drag to explore</span>
        </motion.div>

        {/* ── Mobile: native snap scroll ───────────────────────────────── */}
        <div className="sm:hidden overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-4">
          <div className="flex gap-6 min-w-max">
            {CASE_STUDIES.map((study, idx) => (
              <div
                key={`case-mob-${idx}`}
                className="w-80 flex-shrink-0 snap-center relative group"
              >
                <CaseStudyCard study={study} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
