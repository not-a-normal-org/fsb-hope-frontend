'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check, Loader2, ChevronDown } from 'lucide-react';

import { DURATION, EASE_OUT } from '@/lib/animations';

type LeadType = 'individual' | 'business';
type Status = 'form' | 'submitting' | 'success';
type Change = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const EMPTY = {
  route: '',
  dates: '',
  flexibility: '',
  passengers: '',
  cabin: '',
  points_held: '',
  notes: '',
  email: '',
  whatsapp: '',
};

const TOTAL_STEPS = 4;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Multi-step lead-capture modal (docs/plans/02) — the individual search flow:
 * trip (route/dates/flexibility) → travelers (count/cabin) → points → contact,
 * with an optional notes/preferences field on each question step. Posts to
 * /api/leads (route + points_held + contact as columns; the rest in
 * leads.details jsonb).
 *
 * Accessible dialog: portalled, focus-trapped, Esc/backdrop to close, body
 * scroll locked, focus restored. Glass + reduced-motion-safe. `type` is plumbed
 * for the later business flow; today it renders the individual steps.
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

  const set = (key: keyof typeof EMPTY) => (e: Change) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const close = useCallback(() => {
    onClose();
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
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, [open, step, status]);

  const submit = async () => {
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          route: data.route,
          points_held: data.points_held,
          email: data.email,
          whatsapp: data.whatsapp,
          details: {
            dates: data.dates,
            flexibility: data.flexibility,
            passengers: data.passengers,
            cabin: data.cabin,
            notes: data.notes,
          },
        }),
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

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  const canAdvance = step === 0 ? data.route.trim().length > 0 : true;

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
              className="sm-cta-ghost absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="overflow-y-auto px-7 py-7 sm:px-8">
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
                    A specialist is being assigned to your route and will email you the results,
                    usually within a day. No account, and nothing to pay to look.
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
                    Step {step + 1} of {TOTAL_STEPS}
                  </p>

                  {step === 0 && (
                    <Step titleId={titleId} title="Where & when?" hint="Your destination and rough timing, exact dates optional.">
                      <Labeled label="Where to?">
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
                      </Labeled>
                      <Labeled label="When? (optional)">
                        <input
                          type="text"
                          value={data.dates}
                          onChange={set('dates')}
                          placeholder="e.g. mid-March, ~7 nights, or exact dates"
                          className={inputClass}
                          style={inputStyle}
                        />
                      </Labeled>
                      <Labeled label="How flexible are your dates?">
                        <Select value={data.flexibility} onChange={set('flexibility')}>
                          <option value="">Choose one…</option>
                          <option value="flexible">Flexible — find me the best value</option>
                          <option value="fixed">Fixed — these exact dates</option>
                          <option value="unsure">Not sure yet</option>
                        </Select>
                      </Labeled>
                      <NotesField value={data.notes} onChange={set('notes')} />
                    </Step>
                  )}

                  {step === 1 && (
                    <Step titleId={titleId} title="Who’s flying?" hint="Headcount and the cabin you’re after.">
                      <Labeled label="How many travelers?">
                        <Select value={data.passengers} onChange={set('passengers')} autoFocus>
                          <option value="">Choose…</option>
                          <option value="1">1 traveler</option>
                          <option value="2">2 travelers</option>
                          <option value="3">3 travelers</option>
                          <option value="4">4 travelers</option>
                          <option value="5">5 travelers</option>
                          <option value="6+">6+ travelers</option>
                        </Select>
                      </Labeled>
                      <Labeled label="Which cabin?">
                        <Select value={data.cabin} onChange={set('cabin')}>
                          <option value="">Choose…</option>
                          <option value="economy">Economy</option>
                          <option value="premium">Premium economy</option>
                          <option value="business">Business</option>
                          <option value="first">First</option>
                          <option value="any">Any / best value</option>
                        </Select>
                      </Labeled>
                      <NotesField value={data.notes} onChange={set('notes')} />
                    </Step>
                  )}

                  {step === 2 && (
                    <Step titleId={titleId} title="Which points do you have?" hint="Rough is fine. Not sure? Just say so, it helps your specialist find the best value.">
                      <Labeled label="Points & miles (optional)">
                        <input
                          data-autofocus
                          type="text"
                          value={data.points_held}
                          onChange={set('points_held')}
                          placeholder="e.g. ~120k Amex MR, 80k Chase UR — or “not sure”"
                          className={inputClass}
                          style={inputStyle}
                        />
                      </Labeled>
                      <NotesField value={data.notes} onChange={set('notes')} />
                    </Step>
                  )}

                  {step === 3 && (
                    <Step titleId={titleId} title="Where should we send your results?" hint="We’ll email a screenshot and the exact point cost. WhatsApp is optional.">
                      <Labeled label="Email">
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
                      </Labeled>
                      <Labeled label="WhatsApp (optional)">
                        <input
                          type="tel"
                          value={data.whatsapp}
                          onChange={set('whatsapp')}
                          placeholder="+1 555 000 0000"
                          autoComplete="tel"
                          className={inputClass}
                          style={inputStyle}
                        />
                      </Labeled>
                    </Step>
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

                    {step < TOTAL_STEPS - 1 ? (
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
                        disabled={!emailOk || status === 'submitting'}
                        className="sm-cta inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            Sending
                          </>
                        ) : (
                          'Get my points audit'
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
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

function Step({
  titleId,
  title,
  hint,
  children,
}: {
  titleId: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <h2 id={titleId} className="font-display text-card font-bold leading-snug text-ink">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-sub">{hint}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
  autoFocus,
}: {
  value: string;
  onChange: (e: Change) => void;
  children: React.ReactNode;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      <select
        data-autofocus={autoFocus || undefined}
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none pr-10`}
        style={inputStyle}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
    </div>
  );
}

function NotesField({ value, onChange }: { value: string; onChange: (e: Change) => void }) {
  return (
    <Labeled label="Notes / preferences (optional)">
      <textarea
        value={value}
        onChange={onChange}
        rows={2}
        placeholder="Anything else — airlines to avoid, occasion, layover limits…"
        className={`${inputClass} resize-none`}
        style={inputStyle}
      />
    </Labeled>
  );
}
