'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Mail, Star, Users, Clock, TrendingUp } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/* ─── Contact options (left column) ─── */
const CONTACT_OPTIONS = [
  {
    icon: Calendar,
    heading: 'Book a Discovery Call',
    body: "15 minutes, no pitch, no pressure. We'll tell you if we can help.",
    cta: { label: 'Book a Free Call →', href: '#' },
  },
  {
    icon: Mail,
    heading: 'Send a Message',
    body: 'Prefer to write? We respond within one business day.',
    cta: null,
  },
  {
    icon: Star,
    heading: 'Membership Application',
    body: "Ready to apply? Start your application and we'll be in touch within 48 hours.",
    cta: { label: 'Start Application →', href: '/membership' },
  },
];

/* ─── Trust signals ─── */
const TRUST = [
  { icon: Users, value: '6,000+', label: 'members helped' },
  { icon: Clock, value: '12 years', label: 'experience' },
  { icon: TrendingUp, value: '$1B+', label: 'points redeemed' },
];

const SPEND_OPTIONS = [
  { value: '', label: 'Select annual spend' },
  { value: 'under-300k', label: 'Under $300K' },
  { value: '300k-1m', label: '$300K – $1M' },
  { value: '1m-3m', label: '$1M – $3M' },
  { value: '3m-5m', label: '$3M – $5M' },
  { value: '5m-plus', label: '$5M+' },
];

/* ─── Shared input class ─── */
const inputClass =
  'w-full bg-[#13182A] border border-[#1E2538] rounded-xl px-4 py-3 text-[#F5F5F0] placeholder:text-[#5C6378] text-sm focus:border-[#E8963A]/60 focus:outline-none transition-colors duration-200';

const labelClass = 'block text-[#9DA3B4] text-sm mb-2';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    business: '',
    spend: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="w-full">

      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      <section className="pt-32 pb-20 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <SectionLabel label="GET IN TOUCH" className="mb-6" />

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-4">
              Let&apos;s Talk About
              <br />
              <span className="text-accent-orange">Your Travel Goals</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl">
              Whether you&apos;re ready to apply or just want to understand if
              you qualify, we&apos;re here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — TWO COLUMN LAYOUT
      ══════════════════════════════════════ */}
      <section className="pb-24 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* ── Left: contact options ── */}
            <div className="flex flex-col gap-6">
              {CONTACT_OPTIONS.map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <ScrollReveal key={opt.heading} delay={i * 0.1}>
                    <div className="group bg-bg-card border border-border-subtle rounded-2xl p-6 hover:border-accent-orange/30 transition-colors duration-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center mt-0.5">
                          <Icon size={18} className="text-accent-orange" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-text-primary mb-1">
                            {opt.heading}
                          </h3>
                          <p className="text-text-secondary text-sm leading-relaxed mb-3">
                            {opt.body}
                          </p>
                          {opt.cta && (
                            <Link
                              href={opt.cta.href}
                              className="inline-flex items-center text-accent-orange hover:text-accent-orange-light text-sm font-semibold transition-colors duration-200"
                            >
                              {opt.cta.label}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* ── Right: contact form ── */}
            <ScrollReveal delay={0.15} className="bg-bg-card border border-border-subtle rounded-2xl p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center py-16 text-center gap-6"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 16 }}
                      className="w-16 h-16 rounded-full bg-accent-orange/10 flex items-center justify-center"
                    >
                      {/* Animated checkmark */}
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        aria-hidden="true"
                      >
                        <motion.path
                          d="M7 16l7 7 11-13"
                          stroke="#E8963A"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        Message sent.
                      </h3>
                      <p className="text-text-secondary">
                        We&apos;ll be in touch within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Full Name <span className="text-accent-orange">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Jane Smith"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email <span className="text-accent-orange">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jane@company.com"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="business" className={labelClass}>
                        Business Name
                      </label>
                      <input
                        id="business"
                        name="business"
                        type="text"
                        value={form.business}
                        onChange={handleChange}
                        placeholder="Acme Pty Ltd"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="spend" className={labelClass}>
                        Annual Business Spend
                      </label>
                      <select
                        id="spend"
                        name="spend"
                        value={form.spend}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        {SPEND_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value} disabled={o.value === ''}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className={labelClass}>
                        How can we help?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us a bit about what you're looking for…"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#E8963A] text-black font-semibold rounded-full py-4 text-base hover:bg-[#F2AA5E] transition-colors duration-200 mt-1"
                    >
                      Send Message
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — TRUST STRIP
      ══════════════════════════════════════ */}
      <section className="py-14 bg-bg-secondary border-t border-border-subtle">
        <div className="max-w-3xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {TRUST.map((t, i) => {
              const Icon = t.icon;
              return (
                <ScrollReveal key={t.label} delay={i * 0.1}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center">
                      <Icon size={18} className="text-accent-orange" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary font-mono">
                      {t.value}
                    </p>
                    <p className="text-text-muted text-sm uppercase tracking-widest">
                      {t.label}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
