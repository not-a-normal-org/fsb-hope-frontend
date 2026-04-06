'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ApplySuccessPage() {
  return (
    <div className="min-h-screen bg-[#07090F] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] bg-[#0E1220] border border-[#1E2538] rounded-2xl p-8 md:p-10 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#E8963A]/10 flex items-center justify-center">
            <CheckCircle size={32} className="text-[#E8963A]" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <p className="font-[family-name:var(--font-dm-mono)] text-[#E8963A] text-[10px] tracking-widest uppercase mb-3">
            Application Received
          </p>
          <h1 className="text-2xl font-semibold text-white mb-3">
            You&apos;re in the queue.
          </h1>
          <p className="text-[#9DA3B4] text-sm leading-relaxed mb-8">
            Thank you for applying to The Flights Club. We&apos;ll review your application
            and be in touch within 2 business days to discuss next steps.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-[#E8963A] hover:bg-[#F2AA5E] text-[#07090F] font-semibold text-sm px-6 py-3 rounded-lg transition-colors text-center"
            >
              Back to Home
            </Link>
            <Link
              href="/membership"
              className="block w-full text-[#9DA3B4] hover:text-white text-sm py-2 transition-colors"
            >
              Explore membership tiers
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
