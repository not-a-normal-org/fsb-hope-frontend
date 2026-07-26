'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import CaseStudyCard from './CaseStudyCard';
import { entrance, inViewOnce } from '@/lib/animations';
import type { CaseStudy } from '@/lib/case-studies';

/** Home proof section presentation — one featured redemption + link to /results. */
export default function CaseStudyTeaserView({ study }: { study: CaseStudy }) {
  return (
    <section
      className="relative overflow-hidden border-t"
      style={{ borderColor: 'var(--sm-glass-border)' }}
    >
      <AmbientBackground variant="section" />
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">Proof</p>
          <h2 className="mt-3 font-display text-section font-bold text-ink">
            A specialist found this seat.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-sub">
            Not an algorithm’s guess. A booking a specialist confirmed and shared with the
            traveler’s permission.
          </p>
        </motion.div>

        <motion.div variants={entrance} {...inViewOnce} className="mt-10 max-w-md">
          <CaseStudyCard study={study} featured />
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
