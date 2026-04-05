'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

interface CTAButtonProps {
  label: string;
  href: string;
  variant?: 'primary' | 'ghost';
  className?: string;
  newTab?: boolean;
}

const SPRING = { stiffness: 200, damping: 15 };
const MAX_OFFSET = 8;

export function CTAButton({
  label,
  href,
  variant = 'primary',
  className = '',
  newTab = false,
}: CTAButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const variantStyles = {
    primary:
      'bg-[#E8963A] text-[#07090F] font-semibold px-8 py-4 rounded-full hover:bg-[#F2AA5E]',
    ghost:
      'border border-white/30 text-white px-8 py-4 rounded-full hover:border-white/80 hover:bg-white/5',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant !== 'primary' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Normalise to ±MAX_OFFSET, stronger pull closer to center
    x.set((dx / (rect.width / 2)) * MAX_OFFSET);
    y.set((dy / (rect.height / 2)) * MAX_OFFSET);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={variant === 'primary' ? { x, y, display: 'inline-block' } : { display: 'inline-block' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
