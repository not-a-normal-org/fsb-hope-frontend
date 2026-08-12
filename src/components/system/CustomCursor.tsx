'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor — a small dot that snaps to the pointer plus a spring-lagged
 * ring that grows and fills over interactive elements. Colour comes from
 * --sm-accent, so it recolours across dark / light / mono with the theme (see
 * globals.css `.sm-cursor-*`).
 *
 * The dot/ring always render but start off-screen; the effect only wires up the
 * listeners (and hides the native cursor via `data-custom-cursor` on <html>) on
 * fine-pointer, hover-capable devices that aren't in reduced-motion. Touch /
 * coarse / reduced-motion never get listeners, so the cursor stays parked
 * off-screen and the native cursor is untouched.
 */
const INTERACTIVE =
  'a[href], button, [role="button"], input, select, textarea, summary, label, [data-cursor="hover"]';

export default function CustomCursor() {
  // The dot cursor is a marketing flourish — the /admin console wants the native
  // cursor for precise, data-dense work.
  const disabled = (usePathname() ?? '').startsWith('/admin');
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Dot tracks the raw pointer; ring follows with spring inertia. Motion values
  // update without re-rendering React on every mousemove.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (disabled) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    root.setAttribute('data-custom-cursor', '');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) setHovered(true);
    };
    const onOut = (e: MouseEvent) => {
      const leaving = (e.target as Element | null)?.closest?.(INTERACTIVE);
      const entering = (e.relatedTarget as Element | null)?.closest?.(INTERACTIVE);
      if (leaving && !entering) setHovered(false);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout', onOut, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      root.removeAttribute('data-custom-cursor');
    };
  }, [x, y, disabled]);

  if (disabled) return null;

  return (
    <>
      <motion.div className="sm-cursor-pos" style={{ x, y }} aria-hidden>
        <span className="sm-cursor-dot" data-pressed={pressed || undefined} />
      </motion.div>
      <motion.div className="sm-cursor-pos" style={{ x: ringX, y: ringY }} aria-hidden>
        <span className="sm-cursor-ring" data-hovered={hovered || undefined} />
      </motion.div>
    </>
  );
}
