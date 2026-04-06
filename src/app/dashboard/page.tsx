'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// ── Reusable fade-up variant matching sitewide style ──────────────────────────

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 28 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: 'easeOut' as const, delay },
});

// ── Success particles — deterministic (no hydration mismatch) ─────────────────

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id:       i,
  left:     ((i * 19 + 5) * 5.3) % 100,
  size:     i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  opacity:  0.2 + ((i * 0.13) % 0.3),
  duration: 9 + ((i * 0.71 + 1.3) % 6),
  delay:   -((i * 0.45 + 0.2) % 9),
}));

// ── Check-ring draw animation ─────────────────────────────────────────────────

function AnimatedCheck() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-[#E8963A]/10"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
      />

      {/* Pulsing ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-[#E8963A]/25"
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, delay: 0.8 }}
      />

      {/* SVG check circle */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        className="relative z-10"
      >
        {/* Circle */}
        <motion.circle
          cx="28"
          cy="28"
          r="25"
          stroke="#E8963A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
        />
        {/* Checkmark */}
        <motion.path
          d="M17 28.5 L24.5 36 L39 21"
          stroke="#E8963A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.72 }}
        />
      </svg>
    </motion.div>
  );
}

// ── Dashboard content ─────────────────────────────────────────────────────────

function DashboardContent() {
  const searchParams = useSearchParams();
  const isSuccess    = searchParams.get('success') === 'true';

  return (
    <main className="relative min-h-screen bg-[#07090F] flex items-center justify-center px-6 overflow-hidden">

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isSuccess
            ? 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(232,150,58,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(58,111,232,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating particles (success only) */}
      {isSuccess && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bottom-0 rounded-full bg-[#E8963A]"
              style={{
                left:   `${p.left}%`,
                width:  p.size,
                height: p.size,
                opacity: p.opacity,
              }}
              animate={{ y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 20 : 900)] }}
              transition={{
                duration: p.duration,
                repeat:   Infinity,
                ease:     'linear',
                delay:    p.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Content card */}
      <div className="relative z-10 text-center max-w-md w-full">

        {isSuccess ? (
          <>
            {/* Animated check */}
            <div className="flex justify-center mb-8">
              <AnimatedCheck />
            </div>

            {/* Eyebrow */}
            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-[#E8963A] font-semibold mb-4"
              {...fadeUp(0.9)}
            >
              Membership Confirmed
            </motion.p>

            {/* Headline — word by word */}
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-[#F5F5F0] mb-4 leading-tight"
              {...fadeUp(1.0)}
            >
              You&apos;re in.{' '}
              <span className="text-[#E8963A]">Welcome to<br />The Flights Club.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-[#9DA3B4] text-base leading-relaxed"
              {...fadeUp(1.15)}
            >
              Check your email for next steps.
            </motion.p>

            {/* Divider */}
            <motion.div
              className="my-8 h-px bg-gradient-to-r from-transparent via-[#E8963A]/20 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.3 }}
            />
          </>
        ) : (
          <>
            {/* Coming-soon state */}
            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-[#9DA3B4] font-semibold mb-4"
              {...fadeUp(0.1)}
            >
              The Flights Club
            </motion.p>

            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-[#F5F5F0] mb-4"
              {...fadeUp(0.2)}
            >
              Member Dashboard
            </motion.h1>

            <motion.p
              className="text-[#9DA3B4] text-base"
              {...fadeUp(0.3)}
            >
              Coming soon.
            </motion.p>

            <motion.div
              className="my-8 h-px bg-gradient-to-r from-transparent via-[#1E2538] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.45 }}
            />
          </>
        )}

        {/* Back link */}
        <motion.div {...fadeUp(isSuccess ? 1.4 : 0.5)}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#9DA3B4] hover:text-[#E8963A] transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </motion.div>

      </div>
    </main>
  );
}

// ── Page export — Suspense required for useSearchParams ───────────────────────

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
