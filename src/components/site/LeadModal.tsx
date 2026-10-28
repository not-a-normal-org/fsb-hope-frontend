'use client';

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { DURATION, EASE_OUT } from '@/lib/animations';
import { useOverlayChrome } from '@/lib/use-overlay-chrome';
import { useI18n } from '@/i18n/LocaleProvider';
import LeadForm, { type LeadType } from './LeadForm';

/** Never-changing subscription for the mount gate — the store value is constant. */
const subscribeNoop = () => () => {};

const AUDIENCES: LeadType[] = ['individual', 'business'];

/**
 * The question a "Get started" button opens on: which of the two flows fits.
 * Rendered in place of the form's first step, under the same dialog title id.
 */
function AudienceQuestion({ titleId, onChoose }: { titleId: string; onChoose: (type: LeadType) => void }) {
  const firstRef = useRef<HTMLButtonElement>(null);
  const m = useI18n().m.lead.audience;

  // The form focuses its own first field; this step has to do the same, or the
  // dialog opens with focus still on the page behind it.
  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  return (
    <>
      <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
        {m.eyebrow}
      </p>
      <div className="mt-3">
        <h2 id={titleId} className="font-display text-card font-bold leading-snug text-ink">
          {m.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-sub">{m.hint}</p>
        <div className="mt-6 grid gap-3">
          {AUDIENCES.map((type, i) => (
            <button
              key={type}
              ref={i === 0 ? firstRef : undefined}
              type="button"
              onClick={() => onChoose(type)}
              className="sm-cta-ghost cursor-pointer rounded-2xl px-5 py-4 text-left"
            >
              <span className="block text-sm font-medium">{m[type].label}</span>
              <span className="mt-0.5 block text-xs text-ink-sub">{m[type].hint}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * What the dialog holds: the form for a known audience, or the audience question
 * first. Mounted only while the dialog is open, so a reopened popup asks again
 * instead of remembering the last answer.
 */
function LeadFlow({
  type,
  initialRoute,
  onDone,
  titleId,
}: {
  type?: LeadType;
  initialRoute?: string;
  onDone: () => void;
  titleId: string;
}) {
  const [chosen, setChosen] = useState<LeadType | null>(null);
  const active = type ?? chosen;

  if (!active) return <AudienceQuestion titleId={titleId} onChoose={setChosen} />;

  return (
    <LeadForm
      type={active}
      initialRoute={initialRoute}
      onDone={onDone}
      // Only a visitor who came through the question can go back to it.
      onBack={type ? undefined : () => setChosen(null)}
      autoFocusOnMount
      titleId={titleId}
    />
  );
}

/**
 * Lead-capture popup — accessible dialog chrome (portalled, focus-trapped,
 * Esc/backdrop to close, body scroll locked, focus restored, glass +
 * reduced-motion-safe) around the shared {@link LeadForm}. Keep the multi-step
 * logic in the form, not here.
 */
export default function LeadModal({
  open,
  onClose,
  type,
  initialRoute,
}: {
  open: boolean;
  onClose: () => void;
  /** The flow to open on. Omit it to ask "individual or business?" first — the
   *  site-wide "Get started" buttons do; a page that already knows passes it. */
  type?: LeadType;
  /** Pre-fill the individual "Where to?" field — used when a deals tile hands a
   *  route to the form (Review v3 §10). */
  initialRoute?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const { lead } = useI18n().m;

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
              aria-label={lead.close}
              className="sm-icon-btn absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full"
            >
              <X className="h-[18px] w-[18px]" aria-hidden />
            </button>

            <div className="overflow-y-auto px-7 py-7 sm:px-8">
              <LeadFlow type={type} initialRoute={initialRoute} onDone={close} titleId={titleId} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
