'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { staggerParent, inViewOnce } from '@/lib/animations';

/**
 * Wraps children in one scroll-triggered, staggered entrance (spec §5: one clean
 * orchestrated entrance, not per-element scattering). Children should be
 * motion.* elements with `variants={entrance}` and no own initial/animate — they
 * inherit "hidden"/"visible" from this parent.
 */
export default function StaggerGroup({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerParent} {...inViewOnce} className={className}>
      {children}
    </motion.div>
  );
}
