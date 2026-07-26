'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';

import { DURATION, EASE_OUT } from '@/lib/animations';

type LeadType = 'individual' | 'business';
type Status = 'form' | 'submitting' | 'success';

const EMPTY = { route: '', points_held: '', email: '', whatsapp: '' };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Multi-step lead-capture modal (docs/plans/02) — the individual search flow:
 * route → points held → contact, posting to /api/leads. Accessible dialog:
 * portalled, focus-trapped, Esc/backdrop to close, body scroll locked, focus
 * restored on close. Glass + reduced-motion-safe (framer via MotionProvider).
 *
 * type is plumbed through for the business flow (a later slice); today it only
 * renders the individual steps.
 */
export default function LeadModal({
  open,
  onClose,
  type = 'individual',
}: {
  open: boolean;
  onClose: () => void;
  type?: LeadType;
}) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('form');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(EMPTY);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const close = useCallback(() => {
    onClose();
    // The instance stays mounted (renders nothing when closed), so resetting here
    // means the next open starts fresh.
    setStep(0);
    setStatus('form');
    setError(null);
    setData(EMPTY);
  }, [onClose]);

  // Scroll lock + focus trap + Esc, while open.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
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
      document.body.style.overflow = '';
      restoreFocusRef.current?.focus?.();
    };
  }, [open, close]);

  // Focus the step's primary field on open / step change.
  useEffect(() => {
    if (!open) return;
    const field = dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]');
    field?.focus();
  }, [open, step, status]);

  const submit = async () => {
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data }),
      });
      if (!res.ok) {
        const detail = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(detail.error || 'Something went wrong. Please try again.');
      }
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('form');
    }
  };

  if (!mounted) return null;

  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  const canAdvance = step === 0 ? data.route.trim().length > 0 : true;
  const totalSteps = 3;

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
            className="relative w-full max-w-md overflow-hidden rounded-3xl p-7 sm:p-8"
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
              className="sm-cta-ghost absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            {status === 'success' ? (
              <div className="py-4 text-center">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: 'color-mix(in srgb, var(--sm-accent) 16%, transparent)' }}
                >
                  <Check className="h-6 w-6 text-accent" aria-hidden />
                </div>
                <h2 id={titleId} className="mt-5 font-display text-card font-bold text-ink">
                  We’re on it.
                </h2>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-sub">
                  A real person will search your route by hand and email you the results — usually
                  within a day. No account, no charge to look.
                </p>
                <button
                  type="button"
                  onClick={close}
                  data-autofocus
                  className="sm-cta mt-7 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
                  Step {step + 1} of {totalSteps}
                </p>

                {step === 0 && (
                  <Field
                    titleId={titleId}
                    label="Where do you want to go?"
                    hint="One route or a few — wherever you’re dreaming of."
                  >
                    <input
                      data-autofocus
                      type="text"
                      value={data.route}
                      onChange={set('route')}
                      placeholder="e.g. New York → Tokyo, or JFK–NRT"
                      className={inputClass}
                      style={inputStyle}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canAdvance) setStep(1);
                      }}
                    />
                  </Field>
                )}

                {step === 1 && (
                  <Field
                    titleId={titleId}
                    label="Which points or miles do you have?"
                    hint="Rough is fine — not sure? Just say so. It helps us find the best value."
                  >
                    <input
                      data-autofocus
                      type="text"
                      value={data.points_held}
                      onChange={set('points_held')}
                      placeholder="e.g. ~120k Amex MR, 80k Chase UR — or “not sure”"
                      className={inputClass}
                      style={inputStyle}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setStep(2);
                      }}
                    />
                  </Field>
                )}

                {step === 2 && (
                  <Field
                    titleId={titleId}
                    label="Where should we send your results?"
                    hint="We’ll email you a screenshot and the exact point cost. WhatsApp is optional."
                  >
                    <input
                      data-autofocus
                      type="email"
                      value={data.email}
                      onChange={set('email')}
                      placeholder="you@email.com"
                      autoComplete="email"
                      className={inputClass}
                      style={inputStyle}
                    />
                    <input
                      type="tel"
                      value={data.whatsapp}
                      onChange={set('whatsapp')}
                      placeholder="WhatsApp (optional)"
                      autoComplete="tel"
                      className={`${inputClass} mt-3`}
                      style={inputStyle}
                    />
                  </Field>
                )}

                {error && (
                  <p className="mt-4 text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
                    {error}
                  </p>
                )}

                <div className="mt-7 flex items-center justify-between gap-3">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="sm-cta-ghost inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canAdvance}
                      className="sm-cta inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!EMAIL_OK || status === 'submitting'}
                      className="sm-cta inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Sending
                        </>
                      ) : (
                        'Start my search'
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const inputClass =
  'w-full rounded-xl px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:ring-2 focus:ring-accent';
const inputStyle = {
  background: 'var(--sm-glass-bg)',
  border: '1px solid var(--sm-glass-border)',
} as const;

function Field({
  titleId,
  label,
  hint,
  children,
}: {
  titleId: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <h2 id={titleId} className="font-display text-card font-bold leading-snug text-ink">
        {label}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-sub">{hint}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
