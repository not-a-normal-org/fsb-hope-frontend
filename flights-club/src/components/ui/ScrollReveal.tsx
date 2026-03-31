'use client';

import { motion, Variants } from 'framer-motion';
import { fadeUpVariant } from '@/lib/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: Variants;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = fadeUpVariant,
  className = '',
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variant}
      className={className}
    >
      {children}
    </motion.div>
  );
}
