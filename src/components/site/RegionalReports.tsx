'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion';

import { REGIONS } from '@/lib/reports';
import { EASE_OUT } from '@/lib/animations';
import SearchReportCard from './SearchReportCard';

const AUTO_MS = 5000; // auto-advance cadence
const MANUAL_MS = 10000; // longer pause after a manual pick, so it can be read

/**
 * Region-tabbed example Search Reports. Vertical index-card bookmarks run down the
 * LEFT edge; the ACTIVE bookmark sits above the card seam (never clipped) while
 * inactive ones tuck behind it (Review v3 §3 — the old layout hid AUSTRALIA/
 * AFRICA/AMERICAS behind the card). Behaviour:
 *  - auto-advances every 5s; the active bookmark carries a thin progress bar that
 *    tracks the countdown, so a static screenshot and the live page look different;
 *  - pauses (bar + advance) while the pointer is over it;
 *  - a click (or arrow key) selects that region with a pop, and holds it for 10s;
 *  - the card shakes on each change.
 * Under reduced motion the auto-advance, shake, and progress bar are disabled;
 * clicks still work.
 */
export default function RegionalReports() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const delayRef = useRef(AUTO_MS);
  const region = REGIONS[active];

  // Manual pick: change now, pop, and hold longer before the next auto-advance.
  function pick(i: number) {
    delayRef.current = MANUAL_MS;
    setActive(((i % REGIONS.length) + REGIONS.length) % REGIONS.length);
    if (!reduce) {
      controls.start({
        scale: [1, 1.04, 1],
        x: [0, -6, 6, -4, 4, -2, 2, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      });
    }
  }

  // Auto-advance timer — re-arms on every change; skipped while paused / reduced.
  useEffect(() => {
    if (reduce || paused) return;
    const id = setTimeout(() => {
      delayRef.current = AUTO_MS;
      setActive((a) => (a + 1) % REGIONS.length);
      controls.start({
        x: [0, -7, 7, -5, 5, -2, 2, 0],
        transition: { duration: 0.45, ease: 'easeInOut' },
      });
    }, delayRef.current);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, reduce]);

  return (
    <div
      className="mx-auto flex w-full max-w-md items-start"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Vertical side bookmarks */}
      <div
        role="tablist"
        aria-label="Example award bookings by region"
        aria-orientation="vertical"
        className="relative flex flex-col items-stretch gap-1.5 pt-10"
      >
        {REGIONS.map((r, i) => {
          const on = i === active;
          return (
            <button
              key={r.key}
              role="tab"
              id={`region-tab-${r.key}`}
              aria-selected={on}
              aria-controls="region-report-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => pick(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  pick(active + 1);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  pick(active - 1);
                }
              }}
              className={`relative overflow-hidden rounded-l-lg py-2.5 pl-3.5 pr-7 text-right font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em] transition-all ${
                // Active bookmark rides ABOVE the card seam so its label is never
                // clipped; inactive ones tuck a touch behind and to the right.
                on ? 'z-20 translate-x-px' : 'z-0 opacity-90 hover:opacity-100'
              }`}
              style={
                on
                  ? {
                      color: 'var(--sm-ink)',
                      background: 'var(--sm-bg-elevated)',
                      boxShadow:
                        'inset 2px 0 0 var(--sm-accent), inset 0 1px 0 var(--sm-glass-border), inset 0 -1px 0 var(--sm-glass-border)',
                    }
                  : {
                      color: 'var(--sm-ink-sub)',
                      background: 'var(--sm-glass-bg)',
                      boxShadow: 'inset 0 0 0 1px var(--sm-glass-border)',
                    }
              }
            >
              {r.label}
              {/* Countdown bar — remounts on each change and on un-pause (key), so
                  it always tracks the freshly-armed timer; frozen while paused. */}
              {on && !reduce && (
                <span
                  key={`${active}-${paused ? 'p' : 'r'}`}
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left"
                  style={{
                    background: 'var(--sm-accent)',
                    animation: `sm-progress ${delayRef.current}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Card — shakes on change; sits over the inactive bookmarks' right edge. */}
      <motion.div animate={controls} className="relative z-10 -ml-2 min-w-0 flex-1">
        <div id="region-report-panel" role="tabpanel" aria-labelledby={`region-tab-${region.key}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={region.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <SearchReportCard report={region.report} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
