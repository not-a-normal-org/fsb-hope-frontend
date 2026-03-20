import { Variants } from "framer-motion";

/* ========== FRAMER MOTION VARIANTS ========== */

/**
 * Default entrance animation for sections
 * Fade up effect with easeOut timing
 */
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/**
 * Fade in animation
 */
export const fadeInVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

/**
 * Slide in from left
 */
export const slideInLeftVariant: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from right
 */
export const slideInRightVariant: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Slide up animation
 */
export const slideUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Scale and fade in
 */
export const scaleInVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Container for staggered children animations
 */
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0,
    },
  },
};

/**
 * Child variant for stagger animation
 */
export const staggerChildVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/* ========== HOVER ANIMATIONS ========== */

/**
 * Card hover animation - lift and glow
 */
export const cardHoverAnimation = {
  whileHover: {
    y: -4,
    boxShadow: "0 20px 60px rgba(232, 150, 58, 0.12)",
  },
  transition: {
    duration: 0.3,
  },
};

/**
 * Hover scale animation
 */
export const hoverScaleVariant = {
  whileHover: {
    scale: 1.02,
  },
  transition: {
    duration: 0.3,
  },
};

/* ========== WORD-BY-WORD ANIMATION ========== */

/**
 * Container for word-by-word animation
 */
export const wordContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

/**
 * Individual word animation for word-by-word text
 */
export const wordVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/* ========== LOADING ANIMATION ========== */

/**
 * Loading intro sequence - logo fade in and scale
 */
export const logoFadeInVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Loading intro - tagline slide up
 */
export const taglineSlideUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.8,
      ease: "easeOut",
    },
  },
};

/**
 * Loading intro - fade out overlay
 */
export const overlayFadeOutVariant: Variants = {
  visible: {
    opacity: 0,
    transition: {
      duration: 0.5,
      delay: 1.8,
    },
  },
};

/* ========== PAGE TRANSITIONS ========== */

/**
 * Page entrance animation
 */
export const pageEntranceVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
    },
  },
};

/* ========== PARALLAX HELPERS ========== */

/**
 * Parallax offset calculation
 * Use with useTransform hook
 */
export const parallaxOffset = {
  y: (scrollProgress: number) => scrollProgress * 40,
};

/* ========== GSAP HELPERS ========== */

/**
 * Counter animation configuration for GSAP
 */
export const counterAnimationConfig = {
  scrollTrigger: {
    trigger: "",
    start: "top 80%",
    end: "top 20%",
    once: true,
  },
  duration: 2.5,
  ease: "power2.out",
};

/**
 * Scroll-pinned text configuration
 */
export const scrollPinnedConfig = {
  pin: true,
  scrub: 1.5,
  duration: 1,
};

/* ========== MISC ANIMATIONS ========== */

/**
 * Pulse animation for buttons or elements
 */
export const pulseVariant: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(232, 150, 58, 0.4)",
      "0 0 0 10px rgba(232, 150, 58, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

/**
 * Shimmer animation for premium elements
 */
export const shimmerVariant: Variants = {
  animate: {
    backgroundPosition: ["200% 0%", "-200% 0%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

/**
 * Tilt on hover (3D effect)
 */
export const tiltHoverVariant = {
  whileHover: {
    rotateY: 5,
    rotateX: -5,
  },
  transition: {
    duration: 0.3,
  },
};
