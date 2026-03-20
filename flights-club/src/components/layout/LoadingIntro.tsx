'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function LoadingIntro() {
  const [showLoader, setShowLoader] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Check if user has already seen the intro in this session
    const introShown = sessionStorage.getItem('intro_shown');
    if (introShown) {
      setShowLoader(false);
      setIsAnimating(false);
      return;
    }
  }, []);

  // Don't render if already seen in this session
  if (!showLoader) {
    return null;
  }

  const handleSkip = () => {
    // Immediately hide and mark as shown
    setShowLoader(false);
    sessionStorage.setItem('intro_shown', 'true');
  };

  const handleAnimationComplete = () => {
    // Mark as shown and remove from DOM
    setShowLoader(false);
    sessionStorage.setItem('intro_shown', 'true');
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ delay: isAnimating ? 1.8 : 0, duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 bg-[#07090F] z-[9999] flex items-center justify-center"
      onAnimationComplete={handleAnimationComplete}
    >
      {/* Main content - centered */}
      <div className="text-center">
        {/* Logo: fade in + scale from 0.8 to 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight">
            ✈️ The Flights Club
          </h1>
        </motion.div>

        {/* Tagline: slide up + fade in */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
          className="text-[#9DA3B4] text-lg md:text-xl font-medium"
        >
          Never Fly Economy Again.
        </motion.p>
      </div>

      {/* Skip button - bottom right corner */}
      <motion.button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 flex items-center gap-2 text-[#5C6378] text-sm font-medium hover:text-text-secondary transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        aria-label="Skip intro animation"
      >
        <span>Skip</span>
        <X size={16} />
      </motion.button>
    </motion.div>
  );
}
