'use client';

import { useCallback, useId, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { DURATION, EASE_OUT } from '@/lib/animations';
import { useOverlayChrome } from '@/lib/use-overlay-chrome';
import LeadForm, { type LeadType } from './LeadForm';

/** Never-changing subscription for the mount gate — the store value is constant. */
const subscribeNoop = () => () => {};

/**
 * Lead-capture popup — accessible dialog chrome (portalled, focus-trapped,
 * Esc/backdrop to close, body scroll locked, focus restored, glass +
 * reduced-motion-safe) around the shared {@link LeadForm}. The same form renders
 * inline on the /audit page; keep the multi-step logic there, not here.
 */
export default function LeadModal({
  open,
  onClose,
  type = 'individual',
  initialRoute,
}: {
  open: boolean;
  onClose: () => void;
  type?: LeadType;
  /** Pre-fill the individual "Where to?" field — used when a deals tile hands a
   *  route to the audit (Review v3 §10). */
  initialRoute?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Client-mount gate for the portal — false during SSR (no document), true once
  // hydrated. useSyncExternalStore avoids a setState-in-effect.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const close = useCallback(() => onClose(), [onClose]);

  // Scroll lock, focus trap, Esc and focus restore — shared with MobileMenu.
  // No initialFocusRef: LeadForm focuses its own first field via autoFocusOnMount.
  useOverlayChrome({ open, onClose: close, containerRef: dialogRef });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          style={{ background: 'rgba(3, 6, 12, 0.62)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.hover, ease: EASE_OUT }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-3xl"
            style={{
              background: 'var(--sm-bg-elevated)',
              border: '1px solid var(--sm-glass-border)',
              boxShadow: 'var(--sm-glass-shadow)',
            }}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: DURATION.entrance, ease: EASE_OUT }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="sm-icon-btn absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full"
            >
              <X className="h-[18px] w-[18px]" aria-hidden />
            </button>

            <div className="overflow-y-auto px-7 py-7 sm:px-8">
              <LeadForm
                type={type}
                initialRoute={initialRoute}
                onDone={close}
                autoFocusOnMount
                titleId={titleId}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
