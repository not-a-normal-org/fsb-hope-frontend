'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  referralSource: string;
  // Step 2
  companyName: string;
  businessType: string;
  annualSpend: string;
  abn: string;
  goals: string;
  // Step 3
  selectedTier: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ── Static data ───────────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  referralSource: '',
  companyName: '',
  businessType: '',
  annualSpend: '',
  abn: '',
  goals: '',
  selectedTier: '',
};

const STEPS = ['About You', 'Your Business', 'Choose Your Tier'] as const;

const HOW_DID_YOU_HEAR = ['Google', 'Referral', 'Podcast', 'Social Media', 'Event', 'Other'];
const BUSINESS_TYPES = ['eCommerce', 'Construction', 'Professional Services', 'Retail', 'Hospitality', 'Healthcare', 'Finance', 'Other'];
const SPEND_RANGES = ['$300K - $500K', '$500K - $1M', '$1M - $3M', '$3M - $5M', '$5M+'];

const TIERS = [
  {
    id: 'explore',
    name: 'Explore',
    spend: '$300K–$1M annually',
    price: 'From $2,997/year',
    badge: null,
    accent: '#3A6FE8',
    benefits: [
      'Annual points strategy session',
      'Up to 2 concierge seat bookings/year',
      'The Flights Club community access',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    spend: '$1M–$5M annually',
    price: 'From $7,997/year',
    badge: 'MOST POPULAR',
    accent: '#E8963A',
    benefits: [
      'Guaranteed Business Class seat allocation',
      'Priority concierge — 24hr response',
      'Up to 6 concierge bookings/year',
    ],
  },
  {
    id: 'black',
    name: 'Black',
    spend: '$5M+ annually',
    price: 'By invitation / enquiry',
    badge: 'ELITE',
    accent: '#C9A84C',
    benefits: [
      '$100K+ guaranteed travel value/year',
      'First Class upgrades where available',
      'Dedicated full-time account manager',
    ],
  },
] as const;

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-[#13182A] border border-[#1E2538] text-white rounded-lg px-4 py-3 text-sm placeholder-[#5C6378] focus:outline-none focus:border-[#E8963A] transition-colors duration-200 appearance-none';
const labelCls =
  'block text-[#9DA3B4] text-[10px] font-medium mb-1.5 font-[family-name:var(--font-dm-mono)] tracking-widest uppercase';
const errCls = 'mt-1.5 text-red-400 text-xs';

// ── Framer Motion slide variants ──────────────────────────────────────────────

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0 }),
};

// ── Main form component (uses useSearchParams) ────────────────────────────────

function ApplyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTier = params.get('tier') ?? '';

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>({ ...INITIAL_FORM, selectedTier: initialTier });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Generic field setter — clears error on change
  function field(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };
  }

  // Per-step validation
  function validate(s: number): FormErrors {
    const e: FormErrors = {};
    if (s === 1) {
      if (!form.fullName.trim())        e.fullName     = 'Full name is required';
      if (!form.email.trim()) {
        e.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = 'Please enter a valid email address';
      }
      if (!form.phone.trim()) {
        e.phone = 'Phone number is required';
      } else if ((form.phone.match(/\d/g) ?? []).length < 8) {
        e.phone = 'Must contain at least 8 digits';
      }
      if (!form.referralSource)            e.referralSource  = 'Please select an option';
    }
    if (s === 2) {
      if (!form.companyName.trim())     e.companyName  = 'Company name is required';
      if (!form.businessType)           e.businessType = 'Please select a business type';
      if (!form.annualSpend)            e.annualSpend  = 'Please select your annual spend';
    }
    if (s === 3) {
      if (!form.selectedTier)           e.selectedTier = 'Please select a membership tier';
    }
    return e;
  }

  function handleNext() {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setDirection(1);
    setStep(s => s + 1);
  }

  function handleBack() {
    setErrors({});
    setDirection(-1);
    setStep(s => s - 1);
  }

  async function handleSubmit() {
    const e = validate(3);
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      router.push('/apply/success');
    } catch {
      setErrors({ selectedTier: 'Something went wrong. Please try again.' });
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#07090F] flex flex-col items-center px-4 py-16 pt-28">
      <div className="w-full max-w-[560px]">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="font-[family-name:var(--font-dm-mono)] text-[#E8963A] text-[10px] tracking-widest uppercase mb-3">
            Membership Application
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Join The Flights Club
          </h1>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative flex items-start justify-between">
            {/* Track */}
            <div className="absolute top-3.5 left-0 right-0 h-px bg-[#1E2538]" />
            {/* Fill */}
            <div
              className="absolute top-3.5 left-0 h-px bg-[#E8963A] transition-all duration-500"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />
            {STEPS.map((stepLabel, i) => {
              const n = i + 1;
              const done   = step > n;
              const active = step === n;
              return (
                <div key={stepLabel} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      done || active
                        ? 'bg-[#E8963A] text-[#07090F]'
                        : 'bg-[#0E1220] border border-[#1E2538] text-[#5C6378]'
                    } ${active ? 'ring-2 ring-[#E8963A]/25 ring-offset-2 ring-offset-[#07090F]' : ''}`}
                  >
                    {done ? <Check size={11} strokeWidth={3} /> : n}
                  </div>
                  <span
                    className={`text-[9px] font-[family-name:var(--font-dm-mono)] tracking-wider uppercase transition-colors duration-300 ${
                      active ? 'text-[#E8963A]' : done ? 'text-[#9DA3B4]' : 'text-[#5C6378]'
                    }`}
                  >
                    {stepLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form card */}
        <div className="bg-[#0E1220] border border-[#1E2538] rounded-2xl overflow-hidden">

          {/* Animated step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="p-6 md:p-8"
            >

              {/* ── Step 1: About You ─────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-white font-semibold text-lg mb-6">About You</h2>

                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      className={inputCls}
                      placeholder="Jane Smith"
                      value={form.fullName}
                      onChange={field('fullName')}
                      autoComplete="name"
                    />
                    {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input
                      className={inputCls}
                      type="email"
                      placeholder="jane@company.com.au"
                      value={form.email}
                      onChange={field('email')}
                      autoComplete="email"
                    />
                    {errors.email && <p className={errCls}>{errors.email}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      className={inputCls}
                      type="tel"
                      placeholder="+61 400 000 000"
                      value={form.phone}
                      onChange={field('phone')}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className={errCls}>{errors.phone}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>How Did You Hear About Us?</label>
                    <div className="relative">
                      <select
                        className={inputCls}
                        value={form.referralSource}
                        onChange={field('referralSource')}
                      >
                        <option value="" disabled>Select an option</option>
                        {HOW_DID_YOU_HEAR.map(o => (
                          <option key={o} value={o} className="bg-[#13182A]">{o}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6378] rotate-90 pointer-events-none" />
                    </div>
                    {errors.referralSource && <p className={errCls}>{errors.referralSource}</p>}
                  </div>
                </div>
              )}

              {/* ── Step 2: About Your Business ───────────────────────────── */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-white font-semibold text-lg mb-6">About Your Business</h2>

                  <div>
                    <label className={labelCls}>Company Name</label>
                    <input
                      className={inputCls}
                      placeholder="Acme Pty Ltd"
                      value={form.companyName}
                      onChange={field('companyName')}
                      autoComplete="organization"
                    />
                    {errors.companyName && <p className={errCls}>{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Business Type</label>
                    <div className="relative">
                      <select
                        className={inputCls}
                        value={form.businessType}
                        onChange={field('businessType')}
                      >
                        <option value="" disabled>Select a type</option>
                        {BUSINESS_TYPES.map(o => (
                          <option key={o} value={o} className="bg-[#13182A]">{o}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6378] rotate-90 pointer-events-none" />
                    </div>
                    {errors.businessType && <p className={errCls}>{errors.businessType}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Annual Business Spend on Cards / Expenses</label>
                    <div className="relative">
                      <select
                        className={inputCls}
                        value={form.annualSpend}
                        onChange={field('annualSpend')}
                      >
                        <option value="" disabled>Select a range</option>
                        {SPEND_RANGES.map(o => (
                          <option key={o} value={o} className="bg-[#13182A]">{o}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6378] rotate-90 pointer-events-none" />
                    </div>
                    {errors.annualSpend && <p className={errCls}>{errors.annualSpend}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>
                      ABN{' '}
                      <span className="text-[#5C6378] normal-case tracking-normal font-normal">(optional)</span>
                    </label>
                    <input
                      className={inputCls}
                      placeholder="12 345 678 901"
                      value={form.abn}
                      onChange={field('abn')}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      What Are You Hoping to Get From The Flights Club?{' '}
                      <span className="text-[#5C6378] normal-case tracking-normal font-normal">(optional)</span>
                    </label>
                    <textarea
                      className={`${inputCls} resize-none h-24`}
                      placeholder="E.g. Business Class flights for the team, points strategy, VIP travel experiences…"
                      value={form.goals}
                      onChange={field('goals')}
                    />
                  </div>
                </div>
              )}

              {/* ── Step 3: Choose Your Tier ──────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-3">
                  <h2 className="text-white font-semibold text-lg mb-6">Choose Your Tier</h2>

                  {TIERS.map(tier => {
                    const selected = form.selectedTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          setForm(prev => ({ ...prev, selectedTier: tier.id }));
                          if (errors.selectedTier) setErrors(prev => ({ ...prev, selectedTier: '' }));
                        }}
                        className="w-full text-left"
                      >
                        <motion.div
                          animate={{
                            borderColor: selected ? tier.accent : '#1E2538',
                            backgroundColor: selected ? `${tier.accent}0F` : '#13182A',
                          }}
                          transition={{ duration: 0.2 }}
                          className="relative rounded-xl border p-4"
                          style={{
                            boxShadow: selected ? `0 0 0 1px ${tier.accent}35` : 'none',
                          }}
                        >
                          {tier.badge && (
                            <span
                              className="absolute top-3 right-3 text-[9px] font-semibold tracking-widest px-2 py-0.5 rounded-full font-[family-name:var(--font-dm-mono)]"
                              style={{ color: tier.accent, backgroundColor: `${tier.accent}1A` }}
                            >
                              {tier.badge}
                            </span>
                          )}
                          <div className="flex items-start gap-3">
                            {/* Radio indicator */}
                            <div
                              className="mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200"
                              style={{
                                borderColor: selected ? tier.accent : '#2D3451',
                                backgroundColor: selected ? tier.accent : 'transparent',
                              }}
                            >
                              {selected && <Check size={8} strokeWidth={3.5} className="text-[#07090F]" />}
                            </div>

                            <div className="flex-1 min-w-0 pr-12">
                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                                <span className="font-semibold text-white">{tier.name}</span>
                                <span className="text-xs text-[#5C6378]">{tier.spend}</span>
                              </div>
                              <p className="text-xs font-semibold mb-2.5" style={{ color: tier.accent }}>
                                {tier.price}
                              </p>
                              <ul className="space-y-1.5">
                                {tier.benefits.map(b => (
                                  <li key={b} className="flex items-start gap-1.5 text-xs text-[#9DA3B4]">
                                    <Check
                                      size={10}
                                      strokeWidth={2.5}
                                      style={{ color: tier.accent }}
                                      className="flex-shrink-0 mt-0.5"
                                    />
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      </button>
                    );
                  })}

                  {errors.selectedTier && (
                    <p className={errCls}>{errors.selectedTier}</p>
                  )}

                  <p className="text-[11px] text-[#5C6378] text-center pt-2 leading-relaxed">
                    Your application will be reviewed within 2 business days.
                    <br />
                    We'll contact you to discuss next steps.
                  </p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation footer */}
          <div className="px-6 md:px-8 pb-7 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-[#9DA3B4] hover:text-white transition-colors"
              >
                <ChevronLeft size={15} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <motion.button
                type="button"
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#F2AA5E] text-[#07090F] font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
              >
                Next
                <ChevronRight size={15} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#F2AA5E] text-[#07090F] font-semibold text-sm px-6 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </motion.button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Page export (Suspense boundary for useSearchParams) ───────────────────────

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090F]" />}>
      <ApplyForm />
    </Suspense>
  );
}
