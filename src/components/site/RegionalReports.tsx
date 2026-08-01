'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { REGIONS } from '@/lib/reports';
import { EASE_OUT } from '@/lib/animations';
import SearchReportCard from './SearchReportCard';

/**
 * Region-tabbed example Search Reports. Vertical index-card bookmarks run down the
 * LEFT edge; the card overlaps their right edge so they read as bookmarks tucked
 * behind it. Clicking swaps the card (cross-fade) and the plane re-flies. Tab
 * semantics + up/down arrow support.
 */
export default function RegionalReports() {
  const [active, setActive] = useState(0);
  const region = REGIONS[active];

  const move = (delta: number) =>
    setActive((i) => (i + delta + REGIONS.length) % REGIONS.length);

  return (
    <div className="mx-auto flex w-full max-w-md items-start">
      {/* Vertical side bookmarks */}
      <div
        role="tablist"
        aria-label="Example award bookings by region"
        aria-orientation="vertical"
        className="relative z-0 flex flex-col items-stretch gap-1.5 pt-10"
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
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  move(1);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  move(-1);
                }
              }}
              className={`rounded-l-xl py-2.5 pl-3.5 pr-6 text-right font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors ${
                on ? '' : 'opacity-80 hover:opacity-100'
              }`}
              style={
                on
                  ? {
                      color: 'var(--sm-ink)',
                      background: 'var(--sm-bg-elevated)',
                      boxShadow:
                        'inset 1px 0 0 var(--sm-glass-border), inset 0 1px 0 var(--sm-glass-border), inset 0 -1px 0 var(--sm-glass-border)',
                    }
                  : { color: 'var(--sm-ink-sub)', background: 'var(--sm-glass-bg)' }
              }
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Card — overlaps the tabs' right edge so they read as bookmarks behind it */}
      <div
        id="region-report-panel"
        role="tabpanel"
        aria-labelledby={`region-tab-${region.key}`}
        className="relative z-10 -ml-2 min-w-0 flex-1"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={region.key}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <SearchReportCard report={region.report} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
