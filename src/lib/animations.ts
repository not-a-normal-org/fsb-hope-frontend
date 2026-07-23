import type { Variants, Transition } from 'framer-motion';

/**
 * Motion tokens — the single source for timing and easing.
 *
 * docs/plans/01-brand-design-system.md §5: alive, not busy. One clean
 * orchestrated entrance per page, 60–120ms stagger, 300–400ms fade + 8px rise.
 * prefers-reduced-motion is enforced globally by MotionProvider
 * (MotionConfig reducedMotion="user") and the CSS media query in globals.css.
 */

const EASE_OUT: Transition['ease'] = [0.22, 1, 0.36, 1];

export const DURATION = {
  hover: 0.18,
  entrance: 0.38,
} as const;

/** Fade + 8px rise. The default entrance for a single element. */
export const entrance: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.entrance, ease: EASE_OUT },
  },
};

/** Parent for one orchestrated entrance: glass → stat strip → CTA row. */
export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/** Scroll-triggered entrance props — spread onto a motion element. Once only. */
export const inViewOnce = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.25 },
} as const;

/** Glass hover: a subtle 1.0→1.02 scale, 150–200ms, per spec §5. */
export const hoverGlass = {
  whileHover: { scale: 1.02 },
  transition: { duration: DURATION.hover, ease: EASE_OUT },
} as const;
