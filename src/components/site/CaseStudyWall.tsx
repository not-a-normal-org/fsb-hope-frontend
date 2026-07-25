'use client';

import { motion } from 'framer-motion';

import CaseStudyCard from './CaseStudyCard';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import type { CaseStudy } from '@/lib/case-studies';

/** The /results wall — a staggered grid of booked award redemptions. */
export default function CaseStudyWall({ items }: { items: CaseStudy[] }) {
  return (
    <motion.div
      variants={staggerParent}
      {...inViewOnce}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((study) => (
        <motion.div key={study.id} variants={entrance} className="h-full">
          <CaseStudyCard study={study} />
        </motion.div>
      ))}
    </motion.div>
  );
}
