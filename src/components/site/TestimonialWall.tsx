'use client';

import { motion } from 'framer-motion';

import TestimonialCard from './TestimonialCard';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import type { Testimonial } from '@/lib/testimonials';

/** The /results wall — a staggered grid of consented client stories. */
export default function TestimonialWall({ items }: { items: Testimonial[] }) {
  return (
    <motion.div
      variants={staggerParent}
      {...inViewOnce}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((testimonial) => (
        <motion.div key={testimonial.id} variants={entrance} className="h-full">
          <TestimonialCard testimonial={testimonial} />
        </motion.div>
      ))}
    </motion.div>
  );
}
