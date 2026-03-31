'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, animate, useMotionValue, useTransform, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import FlightSavingsSection from '@/components/sections/FlightSavingsSection';
import FAQSection from '@/components/sections/FAQSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import { CTAButton } from '@/components/ui/CTAButton';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { FAQ_ITEMS_CONCIERGE } from '@/lib/constants';
import {
  wordContainerVariant,
  wordVariant,
  staggerContainerVariant,
  staggerChildVariant,
  fadeUpVariant,
} from '@/lib/animations';

// ── Hero background data ───────────────────────────────────────────────────────
// viewBox: 1400 × 800. Cities placed at approximate relative screen positions.

const FLIGHT_PATHS = [
  // SYD → LAX (great-circle arc over Pacific)
  { d: 'M 1180,580 C 1350,200 800,50 170,330',   stroke: 'rgba(232,150,58,0.55)',  dot: '#E8963A', dur: 13, delay: 0   },
  // SYD → LHR (over Asia / Middle East)
  { d: 'M 1180,580 C 1100,150 900,80 660,175',    stroke: 'rgba(58,111,232,0.50)',  dot: '#3A6FE8', dur: 16, delay: 2   },
  // NRT → LHR
  { d: 'M 1060,260 C 950,100 810,95 660,175',     stroke: 'rgba(58,111,232,0.40)',  dot: '#3A6FE8', dur: 11, delay: 5   },
  // LAX → LHR (over North Atlantic)
  { d: 'M 170,330 C 300,80 500,60 660,175',       stroke: 'rgba(232,150,58,0.40)',  dot: '#E8963A', dur: 12, delay: 1   },
  // MEL → DXB (through Southeast Asia)
  { d: 'M 1140,630 C 1090,490 970,410 820,380',   stroke: 'rgba(201,168,76,0.45)', dot: '#C9A84C', dur: 10, delay: 3.5 },
  // SYD → SIN (short hop)
  { d: 'M 1180,580 C 1150,500 1060,465 980,470',  stroke: 'rgba(58,111,232,0.35)',  dot: '#3A6FE8', dur:  8, delay: 7   },
  // DXB → CDG
  { d: 'M 820,380 C 770,275 710,220 640,195',     stroke: 'rgba(232,150,58,0.35)', dot: '#E8963A', dur:  9, delay: 4   },
  // LAX → HKG (trans-Pacific)
  { d: 'M 170,330 C 420,100 720,160 1000,360',    stroke: 'rgba(201,168,76,0.40)', dot: '#C9A84C', dur: 14, delay: 6   },
  // JFK → LHR
  { d: 'M 265,280 C 380,95 520,75 660,175',       stroke: 'rgba(58,111,232,0.30)', dot: '#3A6FE8', dur: 10, delay: 8.5 },
];

const CITIES = [
  { x: 1180, y: 580, label: 'SYD' },
  { x: 1140, y: 630, label: 'MEL' },
  { x: 1060, y: 260, label: 'NRT' },
  { x: 1000, y: 360, label: 'HKG' },
  { x:  980, y: 470, label: 'SIN' },
  { x:  820, y: 380, label: 'DXB' },
  { x:  660, y: 175, label: 'LHR' },
  { x:  640, y: 195, label: 'CDG' },
  { x:  170, y: 330, label: 'LAX' },
  { x:  265, y: 280, label: 'JFK' },
];

// ── Section 1: Hero ────────────────────────────────────────────────────────────

function ConciergeHero() {
  const line1 = 'You Have Points.'.split(' ');
  const line2 = "We'll Book the Seat.".split(' ');

  const sectionRef = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const bgX = useTransform(rawX, [-0.5, 0.5], [14, -14]);
  const bgY = useTransform(rawY, [-0.5, 0.5], [9, -9]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-bg-primary"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Deep background gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#07090F] via-[#0E1220] to-[#13182A]" />

      {/* ── Animated flight-path SVG (parallax layer) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgX, y: bgY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <svg
          className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
          viewBox="0 0 1400 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* Glow filter for traveling dots */}
            <filter id="hglow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Stronger glow for city dots */}
            <filter id="cglow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Flight paths ── */}
          {FLIGHT_PATHS.map((fp, i) => (
            <g key={i}>
              {/* Dashed route line — scrolling dash offset gives a "moving" feel */}
              <path
                d={fp.d}
                fill="none"
                stroke={fp.stroke}
                strokeWidth="1"
                strokeDasharray="6 5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-110"
                  dur={`${fp.dur * 0.6}s`}
                  repeatCount="indefinite"
                />
              </path>

              {/* Faint solid underline for depth */}
              <path
                d={fp.d}
                fill="none"
                stroke={fp.dot}
                strokeWidth="0.4"
                opacity="0.12"
              />

              {/* Traveling dot */}
              <circle r="3" fill={fp.dot} filter="url(#hglow)" opacity="0.95">
                <animateMotion
                  dur={`${fp.dur}s`}
                  repeatCount="indefinite"
                  begin={`-${fp.delay}s`}
                  path={fp.d}
                />
              </circle>

              {/* Smaller trailing dot for comet effect */}
              <circle r="1.5" fill={fp.dot} opacity="0.5">
                <animateMotion
                  dur={`${fp.dur}s`}
                  repeatCount="indefinite"
                  begin={`-${fp.delay + 0.4}s`}
                  path={fp.d}
                />
              </circle>
            </g>
          ))}

          {/* ── City dots with pulse rings ── */}
          {CITIES.map((city, i) => (
            <g key={city.label}>
              {/* Pulse ring 1 */}
              <circle cx={city.x} cy={city.y} r="4" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1">
                <animate attributeName="r"       values="4;14;4"    dur="4s" begin={`${i * 0.55}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0;0.25" dur="4s" begin={`${i * 0.55}s`} repeatCount="indefinite" />
              </circle>
              {/* Pulse ring 2 (offset) */}
              <circle cx={city.x} cy={city.y} r="4" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1">
                <animate attributeName="r"       values="4;20;4"    dur="4s" begin={`${i * 0.55 + 0.8}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0;0.15" dur="4s" begin={`${i * 0.55 + 0.8}s`} repeatCount="indefinite" />
              </circle>
              {/* Core dot */}
              <circle cx={city.x} cy={city.y} r="2.5" fill="rgba(255,255,255,0.7)" filter="url(#cglow)" />
              <circle cx={city.x} cy={city.y} r="1.2" fill="white" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* ── Left fog — keeps text readable over the flight paths ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, #07090F 28%, rgba(7,9,15,0.82) 52%, rgba(7,9,15,0.35) 72%, transparent 88%)',
        }}
      />

      {/* ── Accent colour orbs ── */}
      <div className="absolute -top-40 right-0 w-[560px] h-[560px] bg-accent-blue/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-orange/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* ── Plane window decoration — desktop ── */}
      <div className="absolute right-8 xl:right-24 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
        <div
          className="w-56 h-72 xl:w-72 xl:h-96"
          style={{
            borderRadius: '45% 45% 50% 50% / 35% 35% 45% 45%',
            border: '1px solid rgba(255,255,255,0.07)',
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(58,111,232,0.07) 50%, transparent 100%)',
            boxShadow:
              'inset 0 0 80px rgba(58,111,232,0.09), 0 0 60px rgba(58,111,232,0.06)',
          }}
        >
          <div
            className="absolute inset-4"
            style={{
              borderRadius: '45% 45% 50% 50% / 35% 35% 45% 45%',
              border: '1px solid rgba(255,255,255,0.04)',
              background: 'linear-gradient(160deg, rgba(255,255,255,0.02) 0%, transparent 60%)',
            }}
          />
          <div
            className="absolute inset-8"
            style={{
              borderRadius: '45% 45% 50% 50% / 35% 35% 45% 45%',
              background:
                'radial-gradient(ellipse at 40% 30%, rgba(58,111,232,0.13) 0%, transparent 70%)',
            }}
          />
        </div>
        <div className="mt-4 mx-auto w-32 xl:w-40 h-3 bg-white/[0.03] rounded-full border border-white/[0.04]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24 pt-36 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel label="Ad-Hoc Service" />
          </motion.div>

          {/* Headline — word by word */}
          <h1 className="font-display font-bold leading-tight mb-6">
            <motion.span
              className="flex flex-wrap gap-x-4 gap-y-1 text-5xl sm:text-6xl lg:text-7xl text-text-primary"
              variants={wordContainerVariant}
              initial="hidden"
              animate="visible"
            >
              {line1.map((word, i) => (
                <motion.span key={i} variants={wordVariant}>{word}</motion.span>
              ))}
            </motion.span>
            <motion.span
              className="flex flex-wrap gap-x-4 gap-y-1 text-5xl sm:text-6xl lg:text-7xl text-accent-orange mt-1"
              variants={wordContainerVariant}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.35 }}
            >
              {line2.map((word, i) => (
                <motion.span key={i} variants={wordVariant}>{word}</motion.span>
              ))}
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg sm:text-xl text-text-secondary max-w-xl leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            One Business Class return seat, fully handled by our expert team.
            No membership required.
          </motion.p>

          {/* Price pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block bg-accent-orange text-bg-primary text-sm font-bold px-5 py-2 rounded-full tracking-wide">
              $1,900 per return Business Class seat
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
          >
            <CTAButton label="Book With Your Points →" href="/contact" variant="primary" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Animated plane helpers ────────────────────────────────────────────────────

function AnimatedHorizontalPlane({
  inView,
  onStepChange,
}: {
  inView: boolean;
  onStepChange: (step: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.offsetWidth);
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Derive active step directly from x — perfectly in sync with the plane
  useEffect(() => {
    if (width === 0) return;
    return x.on('change', (v) => {
      const r = v / width;
      if (r < 0 || r > 1.02) { onStepChangeRef.current(-1); return; }
      if (r < 1 / 6)  { onStepChangeRef.current(0); return; }
      if (r < 1 / 2)  { onStepChangeRef.current(1); return; }
      if (r < 5 / 6)  { onStepChangeRef.current(2); return; }
      onStepChangeRef.current(3);
    });
  }, [x, width]);

  // Manual loop — gives us explicit control to clear the highlight during repeatDelay
  useEffect(() => {
    if (!inView || width === 0) return;
    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        x.set(0);
        await animate(x, width + 30, { duration: 8, ease: 'easeInOut' });
        if (cancelled) break;
        onStepChangeRef.current(-1);
        await new Promise<void>((r) => setTimeout(r, 3000));
      }
    }

    loop();
    return () => { cancelled = true; };
  }, [inView, width, x]);

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none overflow-hidden z-20"
      style={{ top: 'calc(2rem - 13px)', left: 'calc(12.5%)', right: 'calc(12.5%)', height: '28px' }}
    >
      <motion.span
        className="absolute top-1/2 -translate-y-1/2 text-accent-orange text-xl leading-none select-none"
        style={{ left: 0, x }}
      >
        ✈
      </motion.span>
    </div>
  );
}

function AnimatedVerticalPlane({
  inView,
  onStepChange,
}: {
  inView: boolean;
  onStepChange: (step: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const y = useMotionValue(0);
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setHeight(el.offsetHeight);
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (height === 0) return;
    return y.on('change', (v) => {
      const r = v / height;
      if (r < 0 || r > 1.02) { onStepChangeRef.current(-1); return; }
      if (r < 1 / 6)  { onStepChangeRef.current(0); return; }
      if (r < 1 / 2)  { onStepChangeRef.current(1); return; }
      if (r < 5 / 6)  { onStepChangeRef.current(2); return; }
      onStepChangeRef.current(3);
    });
  }, [y, height]);

  useEffect(() => {
    if (!inView || height === 0) return;
    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        y.set(0);
        await animate(y, height + 30, { duration: 8, ease: 'easeInOut' });
        if (cancelled) break;
        onStepChangeRef.current(-1);
        await new Promise<void>((r) => setTimeout(r, 3000));
      }
    }

    loop();
    return () => { cancelled = true; };
  }, [inView, height, y]);

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none overflow-hidden z-20"
      style={{ left: '11px', top: 0, bottom: 0, width: '28px' }}
    >
      <motion.span
        className="absolute left-1/2 -translate-x-1/2 text-accent-orange text-xl leading-none rotate-90 inline-block select-none"
        style={{ top: 0, y }}
      >
        ✈
      </motion.span>
    </div>
  );
}

// ── Section 2: How It Works ────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    title: 'Tell Us Where You Want to Go',
    body: 'Share your destination, travel dates, preferred airline, and points program.',
  },
  {
    num: '02',
    title: 'We Search for Availability',
    body: "Our team searches across all reward seat inventory — including partner airlines and hidden availability the public can't see.",
  },
  {
    num: '03',
    title: 'We Present Your Options',
    body: 'You receive 2–3 seat options with full details — points cost, airline, cabin specs, and timing.',
  },
  {
    num: '04',
    title: 'We Book and Confirm',
    body: 'Once you choose, we handle the redemption end-to-end. You get the confirmation email.',
  },
];

function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [activeStep, setActiveStep] = useState(-1);

  return (
    <section ref={sectionRef} className="relative py-28 bg-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <SectionLabel label="The Process" className="flex justify-center" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
            How the Concierge Works
          </h2>
        </motion.div>

        {/* Desktop: horizontal steps with connecting line */}
        <div className="hidden md:block relative">
          {/* Connecting line threaded through the step circles */}
          <div
            className="absolute top-8 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent"
            style={{ left: 'calc(12.5%)', right: 'calc(12.5%)' }}
          />

          <AnimatedHorizontalPlane inView={inView} onStepChange={setActiveStep} />

          <motion.div
            className="grid grid-cols-4 gap-6"
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {STEPS.map(({ num, title, body }, idx) => (
              <motion.div
                key={num}
                className="flex flex-col items-center text-center"
                variants={staggerChildVariant}
              >
                {/* Step circle */}
                <div
                  className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 z-10 relative transition-all duration-500 ${
                    activeStep === idx
                      ? 'border-accent-orange bg-accent-orange/10 shadow-[0_0_20px_rgba(232,150,58,0.4)]'
                      : 'border-border-subtle bg-bg-card'
                  }`}
                >
                  <span className="text-accent-orange font-mono font-bold text-sm">{num}</span>
                </div>
                <h3
                  className={`text-sm font-display font-bold mb-2 leading-snug transition-colors duration-500 ${
                    activeStep === idx ? 'text-accent-orange' : 'text-text-primary'
                  }`}
                >
                  {title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden relative">
          <AnimatedVerticalPlane inView={inView} onStepChange={setActiveStep} />

          <motion.div
            className="space-y-0"
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {STEPS.map(({ num, title, body }, idx) => (
              <motion.div key={num} className="flex gap-5" variants={staggerChildVariant}>
                {/* Number + vertical line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 ${
                      activeStep === idx
                        ? 'border-accent-orange bg-accent-orange/10 shadow-[0_0_16px_rgba(232,150,58,0.4)]'
                        : 'border-border-subtle bg-bg-card'
                    }`}
                  >
                    <span className="text-accent-orange font-mono font-bold text-xs">{num}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 w-px bg-border-subtle my-2 min-h-[2rem]" />
                  )}
                </div>
                {/* Content */}
                <div className={`${idx < STEPS.length - 1 ? 'pb-10' : 'pb-0'} pt-1`}>
                  <h3
                    className={`text-base font-display font-bold mb-2 leading-snug transition-colors duration-500 ${
                      activeStep === idx ? 'text-accent-orange' : 'text-text-primary'
                    }`}
                  >
                    {title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: What's Included ─────────────────────────────────────────────────

const INCLUDED = [
  'Full reward seat search across all programs',
  'Partner airline availability checked',
  'Up to 3 seat options presented',
  'Complete booking handled end-to-end',
  'Confirmation and itinerary sent to you',
  'Post-booking support if changes needed',
];

const NOT_INCLUDED = [
  'The points themselves (you provide these)',
  'Taxes and carrier surcharges (paid separately)',
  'Travel insurance',
  'Hotel or ground transport bookings',
];

function WhatsIncludedSection() {
  return (
    <section className="relative py-24 bg-bg-primary overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent-orange/[0.05] rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <SectionLabel label="What You Get" className="flex justify-center" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
            Everything Included for $1,900
          </h2>
        </motion.div>

        {/* Two columns */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Included */}
          <motion.div
            className="rounded-xl border border-border-subtle bg-bg-card p-8"
            variants={staggerChildVariant}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-green-400" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                Included in $1,900
              </h3>
            </div>
            <div className="space-y-4">
              {INCLUDED.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={15} className="text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-text-secondary text-sm leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Not included */}
          <motion.div
            className="rounded-xl border border-border-subtle bg-bg-card p-8"
            variants={staggerChildVariant}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <X size={16} className="text-text-muted" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-display font-bold text-text-secondary">
                Not Included
              </h3>
            </div>
            <div className="space-y-4">
              {NOT_INCLUDED.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <X size={15} className="text-text-muted flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-text-muted text-sm leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 5: Points Programs ─────────────────────────────────────────────────

const PROGRAMS = [
  'Qantas Frequent Flyer',
  'Velocity Frequent Flyer',
  'Amex Membership Rewards',
  'NAB Rewards',
  'ANZ Rewards',
  'Westpac Altitude',
  'CommBank Awards',
  'HSBC Rewards',
];

function PointsProgramsSection() {
  return (
    <section className="relative py-20 bg-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          className="text-center mb-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <SectionLabel label="Compatible Programs" className="flex justify-center" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
            Works With Your Existing Points
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PROGRAMS.map((program) => (
            <motion.span
              key={program}
              className="inline-block bg-bg-card border border-border-subtle rounded-full px-4 py-2 text-text-secondary text-sm cursor-default transition-all duration-200 hover:border-accent-orange/40 hover:text-text-primary"
              variants={staggerChildVariant}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {program}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PointsConciergePage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-bg-primary">
        <ConciergeHero />
        <HowItWorksSection />
        <WhatsIncludedSection />
        <FlightSavingsSection />
        <PointsProgramsSection />
        <FAQSection items={FAQ_ITEMS_CONCIERGE} />
        <FinalCTASection
          headline="Ready to Use Your Points?"
          subheadline="Tell us where you want to go and we'll take it from there."
          cta_label="Book Your Concierge Service →"
          cta_href="/contact"
          urgency_line="$1,900 flat fee · No hidden costs"
        />
      </main>
    </>
  );
}
