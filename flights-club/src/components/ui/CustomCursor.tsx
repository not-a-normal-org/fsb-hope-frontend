'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a[href], button, [role="button"], .card';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Raw mouse position — dot snaps here instantly
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring-lagged position — ring follows with inertia
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    // Don't render on touch / coarse-pointer devices
    if ('ontouchstart' in window) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) setHovered(true);
    };

    const onOut = (e: MouseEvent) => {
      // Only clear hover when truly leaving interactive territory
      const leaving  = (e.target        as Element | null)?.closest(INTERACTIVE);
      const entering = (e.relatedTarget as Element | null)?.closest(INTERACTIVE);
      if (leaving && !entering) setHovered(false);
    };

    const onDown = () => setPressed(true);
    const onUp   = () => setPressed(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout',  onOut,  { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout',  onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* ── Dot — 8px, snaps instantly to cursor ─────────────────────────── */}
      {/* top/left offset by half the element size so x/y represent centre  */}
      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9998] rounded-full bg-[#E8963A]"
        style={{ width: 8, height: 8, top: -4, left: -4, x: mouseX, y: mouseY }}
        animate={{ scale: pressed ? 0.8 : 1 }}
        transition={{ duration: 0.1 }}
      />

      {/* ── Ring — 36px, spring-lagged behind dot ────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9998] rounded-full border border-[#E8963A]/60"
        style={{ width: 36, height: 36, top: -18, left: -18, x: ringX, y: ringY }}
        animate={{
          scale:           hovered ? 1.5 : 1,
          backgroundColor: hovered ? 'rgba(232,150,58,0.10)' : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
    </>
  );
}
