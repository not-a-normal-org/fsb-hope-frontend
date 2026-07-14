'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2, Mail, Star, ArrowRight } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CustomerProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  business_type: string | null;
  annual_spend_range: string | null;
  tags: string[] | null;
  status: string | null;
  email: string | null;
}

interface ProfileForm {
  fullName: string;
  phone: string;
  companyName: string;
  businessType: string;
  photoFileName: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  'eCommerce', 'Construction', 'Professional Services', 'Retail',
  'Hospitality', 'Healthcare', 'Finance', 'Other',
];

// ── Shared input styles ───────────────────────────────────────────────────────

const inputCls =
  'w-full bg-[#13182A] border border-[#1E2538] text-white rounded-lg px-4 py-3 text-sm placeholder-[#5C6378] focus:outline-none focus:border-[#E8963A] transition-colors appearance-none';
const labelCls =
  'block text-[#9DA3B4] text-[10px] font-medium mb-1.5 font-[family-name:var(--font-dm-mono)] tracking-widest uppercase';

// ── Particles ─────────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id:       i,
  left:     ((i * 19 + 5) * 5.3) % 100,
  size:     i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  opacity:  0.2 + ((i * 0.13) % 0.3),
  duration: 9 + ((i * 0.71 + 1.3) % 6),
  delay:   -((i * 0.45 + 0.2) % 9),
}));

// ── State A — profile setup form ──────────────────────────────────────────────

function ProfileSetupForm({
  sessionId,
  initialProfile,
  onComplete,
}: {
  sessionId: string;
  initialProfile: CustomerProfile | null;
  onComplete: (profile: CustomerProfile) => void;
}) {
  const [form, setForm] = useState<ProfileForm>({
    fullName:      initialProfile?.full_name     ?? '',
    phone:         initialProfile?.phone          ?? '',
    companyName:   initialProfile?.company_name   ?? '',
    businessType:  initialProfile?.business_type  ?? '',
    photoFileName: '',
  });
  const [errors, setErrors]   = useState<Partial<ProfileForm>>({});
  const [loading, setLoading] = useState(false);
  const [submitErr, setSubmitErr] = useState('');

  function field(key: keyof ProfileForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };
  }

  function validate(): boolean {
    const e: Partial<ProfileForm> = {};
    if (!form.fullName.trim())    e.fullName    = 'Required';
    if (!form.phone.trim())       e.phone       = 'Required';
    if (!form.companyName.trim()) e.companyName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitErr('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          fullName:     form.fullName,
          phone:        form.phone,
          companyName:  form.companyName,
          businessType: form.businessType,
        }),
      });
      if (!res.ok) throw new Error('Profile update failed');
      // Re-fetch to get updated data
      const lookupRes = await fetch(`/api/profile/lookup?session_id=${encodeURIComponent(sessionId)}`);
      const lookupData = await lookupRes.json();
      onComplete(lookupData.customer);
    } catch (e) {
      setSubmitErr(e instanceof Error ? e.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <motion.div
      key="profile-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[520px]"
    >
      <div className="text-center mb-8">
        <p className="font-[family-name:var(--font-dm-mono)] text-[#E8963A] text-[10px] tracking-widest uppercase mb-3">
          Welcome to PointIQ
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          You&apos;re in. Let&apos;s set up your profile.
        </h1>
        <p className="text-[#9DA3B4] text-sm">
          Takes 30 seconds — so we can personalise your onboarding.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0E1220] border border-[#1E2538] rounded-2xl p-6 md:p-8 space-y-5"
      >
        <div>
          <label className={labelCls}>Full Name</label>
          <input className={inputCls} placeholder="Jane Smith" value={form.fullName} onChange={field('fullName')} autoComplete="name" />
          {errors.fullName && <p className="mt-1.5 text-red-400 text-xs">{errors.fullName}</p>}
        </div>

        <div>
          <label className={labelCls}>Phone Number</label>
          <input className={inputCls} type="tel" placeholder="+61 400 000 000" value={form.phone} onChange={field('phone')} autoComplete="tel" />
          {errors.phone && <p className="mt-1.5 text-red-400 text-xs">{errors.phone}</p>}
        </div>

        <div>
          <label className={labelCls}>Company Name</label>
          <input className={inputCls} placeholder="Acme Pty Ltd" value={form.companyName} onChange={field('companyName')} autoComplete="organization" />
          {errors.companyName && <p className="mt-1.5 text-red-400 text-xs">{errors.companyName}</p>}
        </div>

        <div>
          <label className={labelCls}>
            Business Type <span className="text-[#5C6378] normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <div className="relative">
            <select className={inputCls} value={form.businessType} onChange={field('businessType')}>
              <option value="">Select a type</option>
              {BUSINESS_TYPES.map(o => (
                <option key={o} value={o} className="bg-[#13182A]">{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>
            Profile Photo <span className="text-[#5C6378] normal-case tracking-normal font-normal">(optional — coming soon)</span>
          </label>
          <div className="w-full bg-[#13182A] border border-dashed border-[#1E2538] rounded-lg px-4 py-6 text-center text-xs text-[#5C6378]">
            Photo upload available in next update
          </div>
        </div>

        {submitErr && <p className="text-red-400 text-sm text-center">{submitErr}</p>}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="w-full flex items-center justify-center gap-2 bg-[#E8963A] hover:bg-[#F2AA5E] text-[#07090F] font-semibold text-sm px-6 py-3.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Complete My Profile'}
        </motion.button>
      </form>
    </motion.div>
  );
}

// ── State B — dashboard ───────────────────────────────────────────────────────

function DashboardComplete({ profile }: { profile: CustomerProfile | null }) {
  const tier = profile?.tags?.[0];

  const cards = [
    {
      icon: <ArrowRight size={18} className="text-[#E8963A]" />,
      label: 'Next Step',
      value: 'Check your email for onboarding instructions',
    },
    {
      icon: <Star size={18} className="text-[#E8963A]" />,
      label: 'Your Tier',
      value: tier
        ? tier.charAt(0).toUpperCase() + tier.slice(1)
        : 'Membership Active',
    },
    {
      icon: <Mail size={18} className="text-[#E8963A]" />,
      label: 'Questions?',
      value: 'hello@pointiq.club',
      href: 'mailto:hello@pointiq.club',
    },
  ];

  return (
    <motion.div
      key="dashboard-complete"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg text-center"
    >
      {/* Check icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#E8963A]/10 scale-150" />
          <motion.div
            className="absolute inset-0 rounded-full border border-[#E8963A]/25"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
          <CheckCircle2 size={52} className="relative text-[#E8963A]" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="font-[family-name:var(--font-dm-mono)] text-[#E8963A] text-[10px] tracking-widest uppercase mb-3"
      >
        Membership Active
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-3xl font-semibold text-white mb-3"
      >
        Welcome to PointIQ
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-[#9DA3B4] text-sm leading-relaxed mb-8 max-w-sm mx-auto"
      >
        Your account is active. Our team will be in touch shortly to begin your onboarding.
      </motion.p>

      {/* Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="grid gap-3 mb-8"
      >
        {cards.map(({ icon, label, value, href }) => (
          <div
            key={label}
            className="bg-[#0E1220] border border-[#1E2538] rounded-xl px-5 py-4 flex items-center gap-4 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8963A]/10 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-[family-name:var(--font-dm-mono)] uppercase tracking-widest text-[#5C6378] mb-0.5">
                {label}
              </p>
              {href ? (
                <a href={href} className="text-sm text-[#E8963A] hover:text-[#F2AA5E] transition-colors truncate block">
                  {value}
                </a>
              ) : (
                <p className="text-sm text-[#F5F5F0] truncate">{value}</p>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#9DA3B4] hover:text-[#E8963A] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Dashboard content ─────────────────────────────────────────────────────────

function DashboardContent() {
  const searchParams = useSearchParams();
  const isSuccess    = searchParams.get('success') === 'true';
  const sessionId    = searchParams.get('session_id');

  const [state, setState]       = useState<'loading' | 'setup' | 'complete'>('loading');
  const [profile, setProfile]   = useState<CustomerProfile | null>(null);

  useEffect(() => {
    if (!isSuccess || !sessionId) {
      setState('complete');
      return;
    }

    async function resolveProfile() {
      try {
        // lookup derives the email from the Stripe session server-side
        const res = await fetch(`/api/profile/lookup?session_id=${encodeURIComponent(sessionId!)}`);
        if (!res.ok) {
          setState('complete');
          return;
        }
        const data = await res.json();
        if (!data.email) {
          setState('complete');
          return;
        }
        setProfile(data.customer ?? null);
        setState(data.complete ? 'complete' : 'setup');
      } catch {
        setState('complete');
      }
    }

    resolveProfile();
  }, [isSuccess, sessionId]);

  return (
    <main className="relative min-h-screen bg-[#07090F] flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(232,150,58,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bottom-0 rounded-full bg-[#E8963A]"
            style={{ left: `${p.left}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ y: [0, -900] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[#5C6378] text-sm"
            >
              <Loader2 size={16} className="animate-spin" />
              Loading…
            </motion.div>
          )}

          {state === 'setup' && sessionId && (
            <ProfileSetupForm
              sessionId={sessionId}
              initialProfile={profile}
              onComplete={(updated) => {
                setProfile(updated);
                setState('complete');
              }}
            />
          )}

          {state === 'complete' && (
            <DashboardComplete profile={profile} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
