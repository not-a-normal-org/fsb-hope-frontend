'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import CaseStudyCard from './CaseStudyCard';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import type { CaseStudy } from '@/lib/case-studies';

/**
 * Home proof section — up to three confirmed redemptions in a filled, centered
 * row (no lone card stranded in a full-width section) + a link to /results.
 * A base-surface section; the page's one glow is the hero.
 */
export default function CaseStudyTeaserView({ studies }: { studies: CaseStudy[] }) {
  return (
    <section className="relative border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">Proof</p>
          <h2 className="mt-3 font-display text-section font-bold text-ink">
            A specialist found these seats.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-sub">
            Not an algorithm’s guess. Real bookings a specialist confirmed and shared with the
            traveler’s permission.
          </p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          {...inViewOnce}
          className="mt-10 flex flex-wrap justify-center gap-6 sm:justify-start"
        >
          {studies.map((study) => (
            <motion.div key={study.id} variants={entrance} className="w-full sm:w-[336px]">
              <CaseStudyCard study={study} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={entrance} {...inViewOnce} className="mt-8">
          <Link
            href="/results"
            className="text-sm text-ink-sub underline underline-offset-4 transition-colors hover:text-ink"
          >
            See more results →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
