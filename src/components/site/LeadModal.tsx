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
  // individual
  route: '',
  dates: '',
  flexibility: '',
  passengers: '',
  cabin: '',
  points_held: '',
  whatsapp: '',
  // business
  yearly_spend: '',
  flight_need: '',
  points_budget: '',
  phone: '',
  // shared
  notes: '',
  email: '',
};

const TOTAL_STEPS = 4;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Multi-step lead-capture modal (docs/plans/02). Two flows behind one `type`:
 *  - individual: trip (route/dates/flexibility) → travelers → points → contact
 *  - business:   spend → team's routes → points/budget → callback
 * Each question step has an optional notes/preferences field. Posts to
 * /api/leads (typed columns + the rest in leads.details jsonb).
 *
 * The business callback step leaves a seam for a Cal.com booking embed (a later
 * slice, once the account exists); for now it captures a phone + emails to book.
 *
 * Accessible dialog: portalled, focus-trapped, Esc/backdrop to close, body
 * scroll locked, focus restored. Glass + reduced-motion-safe.
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
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('form');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(EMPTY);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const business = type === 'business';

  useEffect(() => setMounted(true), []);

  // Seed the route when opened from a deals tile (Review v3 §10). Runs on the
  // open transition, not on keystrokes, so it never clobbers the user's edits.
  useEffect(() => {
    if (open && initialRoute) {
      setData((d) => ({ ...d, route: initialRoute }));
    }
  }, [open, initialRoute]);

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setStatus('submitting');
    setError(null);
    try {
      const payload = business
        ? {
            type,
            yearly_spend: data.yearly_spend,
            flight_need: data.flight_need,
            points_budget: data.points_budget,
            email: data.email,
            phone: data.phone,
            details: { notes: data.notes },
          }
        : {
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
          };
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const canAdvance = !business && step === 0 ? data.route.trim().length > 0 : true;

  const goNext = () => {
    if (!canAdvance) {
      setError('Please tell us where you want to go.');
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  };
  const goBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const individualStep = (s: number) => {
    switch (s) {
      case 0:
        return (
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
        );
      case 1:
        return (
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
        );
      case 2:
        return (
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
        );
      default:
        return (
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
        );
    }
  };

  const businessStep = (s: number) => {
    switch (s) {
      case 0:
        return (
          <Step titleId={titleId} title="Your team’s travel" hint="Rough numbers are fine — this helps a specialist scope the account.">
            <Labeled label="Roughly, annual flight spend?">
              <Select value={data.yearly_spend} onChange={set('yearly_spend')} autoFocus>
                <option value="">Choose…</option>
                <option value="Under $50k">Under $50k</option>
                <option value="$50k–$150k">$50k–$150k</option>
                <option value="$150k–$500k">$150k–$500k</option>
                <option value="$500k+">$500k+</option>
                <option value="Not sure">Not sure</option>
              </Select>
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} />
          </Step>
        );
      case 1:
        return (
          <Step titleId={titleId} title="What does your team fly?" hint="Routes, cabins, and how often — as much or as little as you know.">
            <Labeled label="Routes & cabins">
              <textarea
                data-autofocus
                value={data.flight_need}
                onChange={set('flight_need')}
                rows={3}
                placeholder="e.g. SFO/JFK → London & Singapore, business class, ~monthly"
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} />
          </Step>
        );
      case 2:
        return (
          <Step titleId={titleId} title="Points, miles, or budget on hand?" hint="Any points pooled for travel, or a cash budget. Optional.">
            <Labeled label="Points / budget (optional)">
              <input
                data-autofocus
                type="text"
                value={data.points_budget}
                onChange={set('points_budget')}
                placeholder="e.g. 2M Amex Business MR, or ~$8k budget"
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} />
          </Step>
        );
      default:
        return (
          <Step titleId={titleId} title="Let’s set up a call" hint="A specialist will reach out to scope your account.">
            <Labeled label="Work email">
              <input
                data-autofocus
                type="email"
                value={data.email}
                onChange={set('email')}
                placeholder="you@company.com"
                autoComplete="email"
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            <Labeled label="Phone (optional)">
              <input
                type="tel"
                value={data.phone}
                onChange={set('phone')}
                placeholder="+1 555 000 0000"
                autoComplete="tel"
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            {/* Cal.com booking embed goes here once the account exists. */}
            <p className="text-xs leading-relaxed text-ink-muted">
              Prefer to pick a time? Calendar booking is coming soon — for now a specialist will
              email you to schedule.
            </p>
          </Step>
        );
    }
  };

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
              {status === 'success' ? (
                <div className="py-4 text-center">
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ background: 'color-mix(in srgb, var(--sm-accent) 16%, transparent)' }}
                  >
                    <Check className="h-6 w-6 text-accent" aria-hidden />
                  </div>
                  <h2 id={titleId} className="mt-5 font-display text-card font-bold text-ink">
                    {business ? 'Thanks — we’ll be in touch.' : 'We’re on it.'}
                  </h2>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-sub">
                    {business
                      ? 'A specialist will reach out to scope your account and set up a call, usually within a day.'
                      : 'A specialist is being assigned to your route and will email you the results, usually within a day. No account, and nothing to pay to look.'}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    data-autofocus
                    className="sm-cta mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
                    Step {step + 1} of {TOTAL_STEPS}
                  </p>

                  {business ? businessStep(step) : individualStep(step)}

                  {error && (
                    <p className="mt-4 text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
                      {error}
                    </p>
                  )}

                  <div className="mt-7 flex items-center justify-between gap-3">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="sm-cta-ghost inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium transition-colors"
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
                        onClick={goNext}
                        className="sm-cta inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium transition-colors"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submit}
                        disabled={status === 'submitting'}
                        className="sm-cta inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            Sending
                          </>
                        ) : business ? (
                          'Request a callback'
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
