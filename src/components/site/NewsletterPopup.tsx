'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

import NewsletterForm from './NewsletterForm';

/**
 * Newsletter popup (Review v3 §9b). Trigger rules matter more than the design:
 *  - desktop: exit-intent (pointer leaves via the top of the viewport);
 *  - mobile/touch: 60% scroll depth (exit-intent misfires on touch);
 *  - never a timer, never on first paint;
 *  - once per session, and a 30-day cooldown after a dismiss;
 *  - never again once subscribed.
 * It carries a different, home-airport-first hook than the passive footer form.
 * Mounted on the homepage only, so /pricing and the search/lead paths are never
 * interrupted (the §9b suppression rule) without any per-route bookkeeping.
 */
const DISMISS_KEY = 'sm-nl-dismissed'; // localStorage: dismiss timestamp
const DONE_KEY = 'sm-nl-done'; // localStorage: subscribed, never show again
const SEEN_KEY = 'sm-nl-seen'; // sessionStorage: shown this session
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function eligible(): boolean {
  try {
    if (localStorage.getItem(DONE_KEY)) return false;
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    const dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissed && Date.now() - dismissed < COOLDOWN_MS) return false;
  } catch {
    /* storage blocked — fall through and allow one show */
  }
  return true;
}

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const shownRef = useRef(false);

  useEffect(() => {
    if (!eligible()) return;

    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    function reveal() {
      if (shownRef.current) return;
      shownRef.current = true;
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* ignore */
      }
      setOpen(true);
      teardown();
    }

    function onMouseOut(e: MouseEvent) {
      // Exit-intent: pointer leaves through the top edge, not to another element.
      if (!e.relatedTarget && e.clientY <= 0) reveal();
    }
    function onScroll() {
      const doc = document.documentElement;
      const depth = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (depth >= 0.6) reveal();
    }
    function teardown() {
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
    }

    if (touch) window.addEventListener('scroll', onScroll, { passive: true });
    else document.addEventListener('mouseout', onMouseOut);

    return teardown;
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  function markDone() {
    try {
      localStorage.setItem(DONE_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={dismiss}
          style={{ background: 'rgba(2,6,14,0.55)', backdropFilter: 'blur(3px)' }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Newsletter signup"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.24 }}
            className="relative w-full max-w-md rounded-2xl p-6 sm:p-7"
            style={{
              background: 'var(--sm-bg-elevated)',
              border: '1px solid var(--sm-glass-border)',
              boxShadow: 'var(--sm-glass-shadow)',
            }}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="sm-icon-btn absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">Emailed every Monday</p>
            <h2 className="mt-2 max-w-xs font-display text-2xl font-bold leading-tight text-ink">
              Watching a route? We’ll watch it too.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-sub">
              Give us your home airport and we’ll email where your points can actually go from it —
              verified space, once a week.
            </p>

            <div className="mt-5">
              <NewsletterForm source="home-exit-popup" compact buttonLabel="Notify me" onSuccess={markDone} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
