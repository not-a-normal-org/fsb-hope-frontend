'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * The shared behavior every modal overlay needs: body scroll lock, focus trap,
 * Esc to close, and focus restored to whatever opened it.
 *
 * Lifted out of LeadModal when the mobile menu became the second consumer, so
 * the two can't drift. Behavior is unchanged from that original, with one
 * addition the extraction made cheap: the scroll lock is **ref-counted**. The
 * inline version reset `body.style.overflow` to `''` on cleanup, so if two
 * overlays were ever open at once the first to close would unlock the page
 * underneath the second. Counting means the last one out restores the page, and
 * restores the value the page actually had rather than assuming it was empty.
 *
 * Not handled, deliberately: scrollbar-width compensation. Locking overflow on a
 * desktop page that has a scrollbar shifts the layout a few pixels. Fixing it
 * here would change how the existing lead modal renders, which this extraction
 * is not the place for.
 *
 * Known pre-existing quirk, carried over rather than introduced: the opener is
 * captured as `document.activeElement` when this effect runs, and React runs
 * child effects before the parent's. So if the overlay's content focuses itself
 * on mount (LeadForm does), the capture sees that field instead of the button
 * that opened the overlay, and on close focus "restores" to a node that is
 * unmounting — i.e. it lands on <body>. Verified identical before and after this
 * extraction. The fix is for the caller to hand over the trigger element, which
 * is its own change. MobileMenu is unaffected: nothing inside it self-focuses,
 * so the capture gets the menu button and focus returns there correctly.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Module-level so every overlay on the page shares one count. */
let lockCount = 0;
let restoreOverflow = '';

function lockScroll() {
  if (lockCount === 0) {
    restoreOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = restoreOverflow;
}

export function useOverlayChrome({
  open,
  onClose,
  containerRef,
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  /** The dialog element whose focusable children the trap cycles through. */
  containerRef: RefObject<HTMLElement | null>;
  /**
   * Focused when the overlay opens. Omit it when the content focuses itself —
   * LeadForm already does via its own `autoFocusOnMount`, and two competing
   * focus calls in the same tick is how you get a cursor in the wrong field.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  // Read through a ref so an un-memoized onClose can't re-run (and so re-arm)
  // the effect on every parent render — re-arming would unlock the page and
  // yank focus back mid-interaction. Assigned in an effect, not during render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const restoreFocusTo = document.activeElement as HTMLElement | null;
    lockScroll();
    initialFocusRef?.current?.focus?.();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      // Queried fresh each Tab: the panel's contents can change while open.
      const nodes = containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
      restoreFocusTo?.focus?.();
    };
  }, [open, containerRef, initialFocusRef]);
}
