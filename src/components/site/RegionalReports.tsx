'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { REGIONS } from '@/lib/reports';
import { EASE_OUT } from '@/lib/animations';
import SearchReportCard from './SearchReportCard';

/**
 * Bookmark-tabbed set of example Search Reports (Europe / Australia / Asia /
 * Africa). Clicking a bookmark swaps the card with a cross-fade; the plane inside
 * re-flies the new route. Tab semantics + arrow-key support. The active bookmark
 * merges into the card's elevated surface.
 */
export default function RegionalReports() {
  const [active, setActive] = useState(0);
  const region = REGIONS[active];

  const move = (delta: number) =>
    setActive((i) => (i + delta + REGIONS.length) % REGIONS.length);

  return (
    <div className="mx-auto w-full max-w-sm">
      {/* Bookmark tabs */}
      <div
        role="tablist"
        aria-label="Example award bookings by region"
        className="flex flex-wrap gap-1.5 pl-3"
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
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  move(1);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  move(-1);
                }
              }}
              className="-mb-px rounded-t-lg px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors"
              style={
                on
                  ? {
                      color: 'var(--sm-ink)',
                      background: 'var(--sm-bg-elevated)',
                      border: '1px solid var(--sm-glass-border)',
                      borderBottomColor: 'var(--sm-bg-elevated)',
                    }
                  : {
                      color: 'var(--sm-ink-sub)',
                      background: 'var(--sm-glass-bg)',
                      border: '1px solid var(--sm-glass-border)',
                      borderBottomColor: 'transparent',
                    }
              }
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Active report */}
      <div
        id="region-report-panel"
        role="tabpanel"
        aria-labelledby={`region-tab-${region.key}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={region.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <SearchReportCard report={region.report} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
