'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, ChevronDown } from 'lucide-react';

import Link from '@/components/system/LocaleLink';
import { fmt } from '@/i18n/format';
import { useI18n } from '@/i18n/LocaleProvider';
import { rich } from '@/i18n/rich';
import { TRIP_TYPE_OPTIONS, hasContactNumber } from '@/lib/leads';

export type LeadType = 'individual' | 'business';
type Status = 'form' | 'submitting' | 'success';
type Change = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const EMPTY = {
  // individual
  route: '',
  nearby_airports: 'yes',
  trip_type: 'round_trip',
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

// Option values are stored in leads.details and read by staff, so they stay
// stable English; the visible labels come from the message dictionaries.
const PASSENGERS = ['1', '2', '3', '4', '5', '6+'] as const;
const CABINS = ['economy', 'premium', 'business', 'first', 'any'] as const;
const FLEXIBILITY = ['flexible', 'fixed', 'unsure'] as const;
const YEARLY_SPEND = ['Under $50k', '$50k–$150k', '$150k–$500k', '$500k+', 'Not sure'] as const;

/**
 * Multi-step lead-capture form (docs/plans/02) — the reusable body shared by the
 * `LeadModal` popup and the standalone `/audit` page. Two flows behind one `type`:
 *  - individual: trip (route/nearby airports/trip type/dates/flexibility) → travelers → points → contact
 *  - business:   spend → team's routes → points/budget → callback
 * Posts to /api/leads (typed columns + the rest in leads.details jsonb), which
 * also emails hello@savermiles.com.
 *
 * Focus: on each step change the step's primary field is focused. `autoFocusOnMount`
 * controls whether that also happens on first render — true inside the modal (it
 * mounts on open), false on the page (so it doesn't yank scroll to the form on load).
 */
export default function LeadForm({
  type = 'individual',
  initialRoute,
  onDone,
  onBack,
  autoFocusOnMount = false,
  titleId: titleIdProp,
}: {
  type?: LeadType;
  /** Pre-fill the individual "Where to?" field (e.g. a deals tile hands a route). */
  initialRoute?: string;
  /** Called by the success "Done" button. When absent, success shows a home link. */
  onDone?: () => void;
  /** Gives the first step a Back button — for a wrapper with something before the
   *  form to return to (LeadModal's "individual or business?" question). */
  onBack?: () => void;
  autoFocusOnMount?: boolean;
  /** So a wrapping dialog can point aria-labelledby at the current step heading. */
  titleId?: string;
}) {
  const generatedId = useId();
  const titleId = titleIdProp ?? generatedId;
  const business = type === 'business';
  const m = useI18n().m.lead;
  const mi = m.individual;
  const mb = m.business;

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>('form');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(() => ({ ...EMPTY, route: initialRoute ?? '' }));

  const rootRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const set = (key: keyof typeof EMPTY) => (e: Change) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  // Focus the step's primary field on step change; on mount only if asked.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!autoFocusOnMount) return;
    }
    rootRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, [step, status, autoFocusOnMount]);

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      setError(m.errors.email);
      return;
    }
    if (!business && !hasContactNumber(data.whatsapp)) {
      setError(m.errors.contact);
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
              nearby_airports: data.nearby_airports,
              trip_type: data.trip_type,
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
        throw new Error(detail.error || m.errors.generic);
      }
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : m.errors.generic);
      setStatus('form');
    }
  };

  const canAdvance = !business && step === 0 ? data.route.trim().length > 0 : true;

  const goNext = () => {
    if (!canAdvance) {
      setError(m.errors.route);
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
          <Step titleId={titleId} title={mi.trip.title} hint={mi.trip.hint}>
            <Labeled label={mi.trip.where}>
              <input
                data-autofocus
                type="text"
                value={data.route}
                onChange={set('route')}
                placeholder={mi.trip.wherePlaceholder}
                className={inputClass}
                style={inputStyle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canAdvance) setStep(1);
                }}
              />
            </Labeled>
            <CheckboxField
              checked={data.nearby_airports === 'yes'}
              onChange={(checked) =>
                setData((d) => ({ ...d, nearby_airports: checked ? 'yes' : 'no' }))
              }
            >
              {mi.trip.nearby}
            </CheckboxField>
            <TripTypeToggle
              value={data.trip_type}
              onChange={set('trip_type')}
              legend={mi.trip.tripType}
              labels={mi.tripTypes}
            />
            <Labeled label={mi.trip.when}>
              <input
                type="text"
                value={data.dates}
                onChange={set('dates')}
                placeholder={
                  data.trip_type === 'one_way' ? mi.trip.whenOneWay : mi.trip.whenRoundTrip
                }
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            <Labeled label={mi.trip.flexibility}>
              <Select value={data.flexibility} onChange={set('flexibility')}>
                <option value="">{m.chooseOne}</option>
                {FLEXIBILITY.map((v) => (
                  <option key={v} value={v}>
                    {mi.flexibility[v]}
                  </option>
                ))}
              </Select>
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} m={m.notes} />
          </Step>
        );
      case 1:
        return (
          <Step titleId={titleId} title={mi.travelers.title} hint={mi.travelers.hint}>
            <Labeled label={mi.travelers.count}>
              <Select value={data.passengers} onChange={set('passengers')} autoFocus>
                <option value="">{m.choose}</option>
                {PASSENGERS.map((v) => (
                  <option key={v} value={v}>
                    {mi.travelerOptions[v]}
                  </option>
                ))}
              </Select>
            </Labeled>
            <Labeled label={mi.travelers.cabin}>
              <Select value={data.cabin} onChange={set('cabin')}>
                <option value="">{m.choose}</option>
                {CABINS.map((v) => (
                  <option key={v} value={v}>
                    {mi.cabinOptions[v]}
                  </option>
                ))}
              </Select>
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} m={m.notes} />
          </Step>
        );
      case 2:
        return (
          <Step titleId={titleId} title={mi.points.title} hint={mi.points.hint}>
            <Labeled label={mi.points.label}>
              <input
                data-autofocus
                type="text"
                value={data.points_held}
                onChange={set('points_held')}
                placeholder={mi.points.placeholder}
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} m={m.notes} />
          </Step>
        );
      default:
        return (
          <Step titleId={titleId} title={mi.contact.title} hint={mi.contact.hint}>
            <Labeled label={mi.contact.email}>
              <input
                data-autofocus
                type="email"
                value={data.email}
                onChange={set('email')}
                placeholder={m.emailPlaceholder}
                autoComplete="email"
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            <Labeled label={mi.contact.phone}>
              <input
                type="tel"
                required
                aria-required
                value={data.whatsapp}
                onChange={set('whatsapp')}
                placeholder={m.phonePlaceholder}
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
          <Step titleId={titleId} title={mb.spend.title} hint={mb.spend.hint}>
            <Labeled label={mb.spend.label}>
              <Select value={data.yearly_spend} onChange={set('yearly_spend')} autoFocus>
                <option value="">{m.choose}</option>
                {YEARLY_SPEND.map((v) => (
                  <option key={v} value={v}>
                    {mb.spendOptions[v]}
                  </option>
                ))}
              </Select>
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} m={m.notes} />
          </Step>
        );
      case 1:
        return (
          <Step titleId={titleId} title={mb.routes.title} hint={mb.routes.hint}>
            <Labeled label={mb.routes.label}>
              <textarea
                data-autofocus
                value={data.flight_need}
                onChange={set('flight_need')}
                rows={3}
                placeholder={mb.routes.placeholder}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} m={m.notes} />
          </Step>
        );
      case 2:
        return (
          <Step titleId={titleId} title={mb.budget.title} hint={mb.budget.hint}>
            <Labeled label={mb.budget.label}>
              <input
                data-autofocus
                type="text"
                value={data.points_budget}
                onChange={set('points_budget')}
                placeholder={mb.budget.placeholder}
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            <NotesField value={data.notes} onChange={set('notes')} m={m.notes} />
          </Step>
        );
      default:
        return (
          <Step titleId={titleId} title={mb.call.title} hint={mb.call.hint}>
            <Labeled label={mb.call.email}>
              <input
                data-autofocus
                type="email"
                value={data.email}
                onChange={set('email')}
                placeholder={mb.call.emailPlaceholder}
                autoComplete="email"
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            <Labeled label={mb.call.phone}>
              <input
                type="tel"
                value={data.phone}
                onChange={set('phone')}
                placeholder={m.phonePlaceholder}
                autoComplete="tel"
                className={inputClass}
                style={inputStyle}
              />
            </Labeled>
            {/* Cal.com booking embed goes here once the account exists. */}
            <p className="text-xs leading-relaxed text-ink-muted">{mb.call.calendar}</p>
          </Step>
        );
    }
  };

  return (
    <div ref={rootRef}>
      {status === 'success' ? (
        <div className="py-4 text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'color-mix(in srgb, var(--sm-accent) 16%, transparent)' }}
          >
            <Check className="h-6 w-6 text-accent" aria-hidden />
          </div>
          <h2 id={titleId} className="mt-5 font-display text-card font-bold text-ink">
            {business ? mb.successTitle : mi.successTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-sub">
            {business ? mb.successBody : mi.successBody}
          </p>
          {onDone ? (
            <button
              type="button"
              onClick={onDone}
              data-autofocus
              className="sm-cta mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors"
            >
              {m.done}
            </button>
          ) : (
            <Link
              href="/"
              data-autofocus
              className="sm-cta mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors"
            >
              {m.home}
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
            {fmt(m.step, { n: step + 1, total: TOTAL_STEPS })}
          </p>

          {business ? businessStep(step) : individualStep(step)}

          {error && (
            <p className="mt-4 text-sm" style={{ color: 'var(--sm-error)' }} role="alert">
              {error}
            </p>
          )}

          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 0 || onBack ? (
              <button
                type="button"
                onClick={step > 0 ? goBack : onBack}
                className="sm-cta-ghost inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {m.back}
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
                {m.next}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={status === 'submitting'}
                className="sm-cta inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    {m.sending}
                  </>
                ) : business ? (
                  mb.submit
                ) : (
                  mi.submit
                )}
              </button>
            )}
          </div>

          {step === TOTAL_STEPS - 1 && (
            <p className="mt-3 text-xs text-ink-muted">
              {rich(m.consent, {
                link: (c) => (
                  <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
                    {c}
                  </Link>
                ),
              })}
            </p>
          )}
        </>
      )}
    </div>
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

/**
 * A single yes/no answer as a checkbox with its sentence beside it. The box is
 * drawn from the CTA tokens rather than left to the browser: a native checkbox
 * ignores the theme, and `--sm-cta` / `--sm-cta-text` is the one pairing already
 * tuned to read in Light, Dark and Mono (it is what `.sm-cta` buttons use).
 */
function CheckboxField({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex h-[18px] w-[18px] shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-full w-full cursor-pointer appearance-none rounded-[5px] border border-[color-mix(in_srgb,var(--sm-ink)_30%,transparent)] outline-none transition-colors checked:bg-cta focus-visible:ring-2 focus-visible:ring-accent"
        />
        <Check
          className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-cta-text opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden
        />
      </span>
      <span className="text-sm leading-snug text-ink">{children}</span>
    </label>
  );
}

/**
 * One-way / round-trip pills. A fieldset of native radios (not `Labeled`: a radio
 * group can't live inside a single <label>), so arrow keys and screen readers get
 * real radio semantics; the pill styling hangs off `:checked` / `:focus-visible`.
 */
function TripTypeToggle({
  value,
  onChange,
  legend,
  labels,
}: {
  value: string;
  onChange: (e: Change) => void;
  legend: string;
  labels: Record<string, string>;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-muted">
        {legend}
      </legend>
      <div className="inline-flex rounded-full p-1" style={inputStyle}>
        {TRIP_TYPE_OPTIONS.map((o) => (
          <label
            key={o.value}
            className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-ink-sub transition-colors has-[:checked]:bg-cta has-[:checked]:text-cta-text has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
              className="sr-only"
            />
            {labels[o.value] ?? o.label}
          </label>
        ))}
      </div>
    </fieldset>
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

function NotesField({
  value,
  onChange,
  m,
}: {
  value: string;
  onChange: (e: Change) => void;
  m: { label: string; placeholder: string };
}) {
  return (
    <Labeled label={m.label}>
      <textarea
        value={value}
        onChange={onChange}
        rows={2}
        placeholder={m.placeholder}
        className={`${inputClass} resize-none`}
        style={inputStyle}
      />
    </Labeled>
  );
}
