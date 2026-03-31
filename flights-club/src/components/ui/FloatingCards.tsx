'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationControls,
  useScroll,
  type MotionValue,
} from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CardConfig {
  left: string; top: string;
  rx: number; ry: number; rz: number;
  scale: number; dur: number; del: number;
}
interface CardDesign {
  background: string; border?: string;
  network: 'VISA' | 'MASTERCARD'; last4: string;
}
interface FlightOffer {
  route: string; cabin: string; pts: string; retail: string;
}
interface DriftValues {
  x1: number; x2: number; y1: number; y2: number;
  dur: number; del: number;
}

// ── Static data ───────────────────────────────────────────────────────────────

const CARDS: CardConfig[] = [
  { left: '5%',  top: '5%',  rx: 12,  ry: -25, rz: -18, scale: 1.00, dur: 4.0, del: 0.0 },
  { left: '55%', top: '0%',  rx: -8,  ry: 20,  rz: 12,  scale: 0.88, dur: 5.2, del: 0.4 },
  { left: '30%', top: '28%', rx: 18,  ry: -18, rz: -6,  scale: 0.92, dur: 3.8, del: 0.9 },
  { left: '62%', top: '38%', rx: -14, ry: 22,  rz: 15,  scale: 0.80, dur: 6.0, del: 1.3 },
  { left: '0%',  top: '52%', rx: 10,  ry: -20, rz: -10, scale: 0.85, dur: 4.6, del: 0.6 },
  { left: '48%', top: '62%', rx: -18, ry: 12,  rz: 8,   scale: 0.75, dur: 5.4, del: 1.8 },
  { left: '18%', top: '70%', rx: 22,  ry: -8,  rz: -22, scale: 0.70, dur: 3.5, del: 1.1 },
  { left: '72%', top: '72%', rx: -6,  ry: 28,  rz: 18,  scale: 0.65, dur: 4.9, del: 2.2 },
];

const CARD_DESIGNS: CardDesign[] = [
  { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',                                           network: 'VISA',       last4: '4521' },
  { background: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)',                                           network: 'MASTERCARD', last4: '8834' },
  { background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',                                           network: 'VISA',       last4: '2291' },
  { background: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',                                           network: 'MASTERCARD', last4: '6677' },
  { background: 'linear-gradient(135deg, #13182A 0%, #1E2538 50%, rgba(232,150,58,0.2) 100%)',                 network: 'VISA',       last4: '9923' },
  { background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', border: '1px solid rgba(201,168,76,0.4)', network: 'MASTERCARD', last4: '1122' },
  { background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b5e 100%)',                                           network: 'VISA',       last4: '5566' },
  { background: 'linear-gradient(135deg, #0d1b2a 0%, #16213e 100%)',                                           network: 'MASTERCARD', last4: '7788' },
];

const FLIGHT_OFFERS: FlightOffer[] = [
  { route: 'SYD → LAX', cabin: 'Business Class', pts: '204,000', retail: '$10,000+' },
  { route: 'SYD → LHR', cabin: 'Business Class', pts: '332,600', retail: '$12,000+' },
  { route: 'SYD → CDG', cabin: 'Business Class', pts: '360,000', retail: '$12,000+' },
  { route: 'MEL → DXB', cabin: 'Business Class', pts: '180,000', retail: '$8,000+'  },
  { route: 'SYD → NRT', cabin: 'Business Class', pts: '144,000', retail: '$6,500+'  },
  { route: 'BNE → SIN', cabin: 'Business Class', pts: '96,000',  retail: '$4,200+'  },
  { route: 'MEL → LAX', cabin: 'Business Class', pts: '204,000', retail: '$10,000+' },
  { route: 'SYD → HKG', cabin: 'Business Class', pts: '80,000',  retail: '$3,800+'  },
];

// ── Single card ───────────────────────────────────────────────────────────────

interface FloatingCardProps {
  config: CardConfig;
  design: CardDesign;
  offer: FlightOffer;
  drift: DriftValues;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollY: MotionValue<number>;
  isTeaser?: boolean;
  startFlipped?: boolean;
}

function FloatingCard({
  config, design, offer, drift, index,
  mouseX, mouseY, scrollY,
  isTeaser = false,
  startFlipped = false,
}: FloatingCardProps) {
  const [isFlipped, setIsFlipped]   = useState(startFlipped);
  const [isShaking, setIsShaking]   = useState(false);
  const controls                    = useAnimationControls();
  const isFirstMount                = useRef(true);

  // Refs — always current, no stale-closure issues
  const isHoveredRef        = useRef(false);
  const isClickPendingRef   = useRef(false);
  const autoFlipTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mouse parallax — ±5° tilt on front face
  const mouseRotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const mouseRotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  // Scroll drop
  const scrollYOffset = useTransform(scrollY, [0, 600], [0, 80 + index * 25]);
  const scrollOpacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0]);

  // Stable drift keyframes
  const driftAnim = useMemo(() => ({
    x:      [0, drift.x1, drift.x2, 0] as number[],
    y:      [0, drift.y1, drift.y2, 0] as number[],
    rotate: [config.rz, config.rz + 8, config.rz - 5, config.rz] as number[],
  }), [drift.x1, drift.x2, drift.y1, drift.y2, config.rz]);

  // Start / stop drift when flip state changes
  useEffect(() => {
    if (!isFlipped) {
      const delay = isFirstMount.current ? drift.del : 0;
      isFirstMount.current = false;
      controls.start({
        ...driftAnim,
        transition: {
          duration: drift.dur,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'loop',
          delay,
        },
      });
    } else {
      controls.stop();
    }
  }, [isFlipped]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-flip helpers ──────────────────────────────────────────────────────

  const clearAutoFlip = () => {
    if (autoFlipTimerRef.current) {
      clearTimeout(autoFlipTimerRef.current);
      autoFlipTimerRef.current = null;
    }
  };

  // scheduleAutoFlip only uses refs + stable setters — no stale closure risk
  const scheduleAutoFlip = () => {
    clearAutoFlip();
    if (isHoveredRef.current || isClickPendingRef.current) return;
    const delay = 3000 + Math.random() * 4000; // 3–7 s
    autoFlipTimerRef.current = setTimeout(() => {
      autoFlipTimerRef.current = null;
      setIsFlipped(prev => !prev);
      scheduleAutoFlip(); // schedule the next toggle
    }, delay);
  };

  // Kick off auto-flip on mount, staggered so cards don't all flip together
  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (!isHoveredRef.current && !isClickPendingRef.current) scheduleAutoFlip();
    }, index * 800);
    return () => {
      clearTimeout(initTimer);
      clearAutoFlip();
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Event handlers ─────────────────────────────────────────────────────────

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    clearAutoFlip(); // pause while hovered
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (!isClickPendingRef.current) scheduleAutoFlip(); // resume
  };

  const handleClick = () => {
    // Cancel current auto-flip schedule — user has expressed intent
    clearAutoFlip();
    // Reset any existing click-initiated sequence
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);

    // Flip immediately on click
    setIsFlipped(prev => !prev);

    isClickPendingRef.current = true;

    // After 5 s: shake, then flip back
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      setIsShaking(true);

      shakeTimerRef.current = setTimeout(() => {
        shakeTimerRef.current = null;
        setIsShaking(false);
        setIsFlipped(prev => !prev);
        isClickPendingRef.current = false;
        // Resume auto-flip unless still hovered
        if (!isHoveredRef.current) scheduleAutoFlip();
      }, 600); // shake lasts 0.5 s + 100 ms buffer
    }, 5000);
  };

  return (
    // ① Scroll drop
    <motion.div
      style={{
        position: 'absolute',
        left: config.left,
        top: config.top,
        zIndex: CARDS.length - index,
        y: scrollYOffset,
        opacity: scrollOpacity,
      }}
    >
      {/* ② Entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 60 }}
        animate={{ opacity: 1, scale: config.scale, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
        style={{ cursor: 'pointer' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* ③ Drift */}
        <motion.div
          initial={{ rotateX: config.rx, rotateY: config.ry, rotate: config.rz }}
          animate={controls}
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          {/* ④ Shake wrapper — translates on x/y only so drift rotation is unaffected */}
          <motion.div
            animate={isShaking
              ? { x: [0, -10, 10, -10, 10, -5, 5, 0], y: [0, -4, 4, -4, 4, 0] }
              : { x: 0, y: 0 }
            }
            transition={isShaking
              ? { duration: 0.5, ease: 'easeInOut' }
              : { duration: 0 }
            }
          >
            {/* ⑤ CSS flip wrapper */}
            <div
              style={{
                width: 224,
                height: 160,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                position: 'relative',
              }}
            >

              {/* ⑥ FRONT FACE */}
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
                style={{
                  background: design.background,
                  border: design.border,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
                  rotateX: mouseRotateX,
                  rotateY: mouseRotateY,
                }}
              >
                {/* Gloss */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />

                {/* Card content */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white/80 tracking-[0.25em]">TFC</span>
                  </div>
                  <div>
                    <div
                      className="w-10 h-7 rounded-md"
                      style={{
                        background: 'linear-gradient(135deg, #C9A84C 0%, #F2AA5E 100%)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                      }}
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-mono text-sm text-white/70 tracking-widest leading-none">
                      •••• •••• •••• {design.last4}
                    </span>
                    <span className="text-xs font-bold text-white/50 tracking-wide">
                      {design.network}
                    </span>
                  </div>
                </div>

                {/* Tap-to-flip hint */}
                {isTeaser ? (
                  <motion.span
                    className="absolute top-3 right-3 text-[9px] font-semibold tracking-wider text-[#E8963A] border border-[#E8963A]/40 rounded-full px-2 py-0.5 pointer-events-none"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  >
                    click me
                  </motion.span>
                ) : (
                  <motion.div
                    className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-white/30 pointer-events-none"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                )}
              </motion.div>

              {/* ⑦ BACK FACE — flight offer */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
                style={{
                  transform: 'rotateY(180deg)',
                  background: design.background,
                  border: design.border,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                {/* Gloss */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />

                {/* Offer content */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#E8963A]">
                      Redeem with Points
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white leading-none">
                      {offer.route}
                    </div>
                    <div className="text-xs text-white/60 mt-1">{offer.cabin}</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-base font-bold text-[#E8963A]">{offer.pts} pts</div>
                      <div className="text-[10px] text-white/50 mt-0.5">Using Points</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base text-white/40 line-through">{offer.retail}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">Retail Price</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40">
                      Saved with The Flights Club ✈
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const driftValues = useMemo<DriftValues[]>(() => CARDS.map((_, i) => ({
    x1:  (i * 47  % 160) - 80,
    x2:  (i * 83  % 160) - 80,
    y1:  (i * 61  % 120) - 60,
    y2:  (i * 97  % 120) - 60,
    dur: 12 + (i * 37  % 10),
    del: i * 0.6,
  })), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseX.set((e.clientX - (r.left + r.width  / 2)) / r.width);
      mouseY.set((e.clientY - (r.top  + r.height / 2)) / r.height);
    };
    const onLeave = () => { mouseX.set(0); mouseY.set(0); };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[560px]"
      style={{ perspective: '1200px', overflow: 'visible' }}
    >
      {CARDS.map((config, idx) => (
        <FloatingCard
          key={idx}
          config={config}
          design={CARD_DESIGNS[idx]}
          offer={FLIGHT_OFFERS[idx]}
          drift={driftValues[idx]}
          index={idx}
          mouseX={mouseX}
          mouseY={mouseY}
          scrollY={scrollY}
          isTeaser={idx === 0}
          startFlipped={idx === 2}
        />
      ))}
    </div>
  );
}
