'use client';

import { MotionConfig } from 'framer-motion';

/**
 * plan.json → animation_philosophy.rules: "Respect prefers-reduced-motion
 * everywhere, no exceptions."
 *
 * `reducedMotion="user"` makes Framer Motion drop transform/layout animation
 * for anyone with the OS setting on, so individual components don't each have
 * to remember. CSS-driven motion is handled by the media query in globals.css.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
