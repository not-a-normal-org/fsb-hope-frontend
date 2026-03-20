'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CTAButtonProps {
  label: string;
  href: string;
  variant?: 'primary' | 'ghost';
  className?: string;
  newTab?: boolean;
}

export function CTAButton({
  label,
  href,
  variant = 'primary',
  className = '',
  newTab = false,
}: CTAButtonProps) {
  const variantStyles = {
    primary:
      'bg-[#E8963A] text-[#07090F] font-semibold px-8 py-4 rounded-full hover:bg-[#F2AA5E]',
    ghost:
      'border border-white/30 text-white px-8 py-4 rounded-full hover:border-white/80 hover:bg-white/5',
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={`inline-block transition-all duration-300 ${variantStyles[variant]} ${className}`}
      >
        {label}
      </Link>
    </motion.div>
  );
}
