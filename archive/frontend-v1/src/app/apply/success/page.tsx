'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ApplySuccessPage() {
  return (
    <div className="min-h-screen bg-[#07090F] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-[480px] text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 16 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-[#E8963A]/10 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-[#E8963A]" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <p className="font-[family-name:var(--font-dm-mono)] text-[#E8963A] text-[10px] tracking-widest uppercase mb-4">
            Submitted
          </p>

          <h1 className="text-3xl font-semibold text-white mb-4">
            Application Received
          </h1>

          <p className="text-[#9DA3B4] text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            We'll review your application and be in touch within 2 business days.
            Check your email for a confirmation.
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-block bg-[#E8963A] hover:bg-[#F2AA5E] text-[#07090F] font-semibold text-sm px-8 py-3.5 rounded-lg transition-colors"
            >
              Back to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
