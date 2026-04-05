'use client';

import { motion } from 'framer-motion';
import { Search, Map, Plane } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import FAQSection from '@/components/sections/FAQSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import TierCard from '@/components/ui/TierCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MEMBERSHIP_TIERS_DETAIL } from '@/lib/constants';


// ── Section 1: Hero ────────────────────────────────────────────────────────────

function MembershipHero() {
  const line1 = 'Choose Your Level of'.split(' ');
  const line2 = 'Business Class Freedom'.split(' ');

  return (
    <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1a2e 0%, #07090F 70%)',
        }}
      />
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-blue/10 rounded-full blur-3xl -z-10" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-16 text-center pt-32 pb-24">
        {/* Label */}
        <motion.p
          className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          The Flights Club
        </motion.p>

        {/* Headline — word by word */}
        <h1 className="font-display font-bold leading-tight mb-8">
          <span className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-2">
            {line1.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-5xl sm:text-6xl lg:text-7xl text-accent-orange">
            {line2.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          Every tier is built around one goal — making sure your business spend
          works as hard as you do.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-accent-orange/60 to-transparent"
            animate={{ scaleY: [1, 0.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 2: How It Works ────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'We Audit Your Spend',
    body: 'We look at your existing business expenses — suppliers, rent, wages, subscriptions — and identify where points are being left behind.',
  },
  {
    num: '02',
    icon: Map,
    title: 'We Build Your Strategy',
    body: 'Your dedicated advisor maps out the fastest path to Business Class using your specific spend patterns and preferred programs.',
  },
  {
    num: '03',
    icon: Plane,
    title: 'We Book Your Seats',
    body: 'Our concierge team handles every redemption. You get the confirmation. We handle the rest.',
  },
];

function HowItWorksSection() {
  return (
    <section className="relative py-28 bg-bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-secondary/30 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-4">
            The Process
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
            Three Steps to Business Class
          </h2>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ num, icon: Icon, title, body }, idx) => (
            <ScrollReveal key={num} delay={idx * 0.1}>
              <motion.div
                className="group relative rounded-xl border border-border-subtle bg-bg-card p-8 overflow-hidden hover:border-accent-orange/30 transition-colors duration-300"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Faded step number */}
                <span
                  className="absolute -top-4 -left-2 text-[7rem] font-display font-black leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(232,150,58,0.08)' }}
                >
                  {num}
                </span>

                {/* Icon */}
                <div className="relative z-10 mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent-orange/10 border border-accent-orange/20">
                  <Icon size={22} className="text-accent-orange" strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-xl font-display font-bold text-text-primary mb-3">
                  {title}
                </h3>

                {/* Body */}
                <p className="relative z-10 text-text-secondary text-sm leading-relaxed">
                  {body}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/0 to-accent-orange/0 group-hover:from-accent-orange/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Tier Comparison ─────────────────────────────────────────────────

function TierComparisonSection() {
  return (
    <section id="tiers" className="relative py-28 bg-bg-secondary/40 overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent-gold rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />
      <div className="absolute bottom-10 left-5 w-96 h-96 bg-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-4">
            Membership Tiers
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5 leading-tight">
            Find Your Tier
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Built for Australian business owners at every stage of growth.
          </p>
        </ScrollReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {MEMBERSHIP_TIERS_DETAIL.map((tier, i) => (
            <ScrollReveal key={tier.id} delay={i * 0.1}>
              <TierCard tier={tier} elevated />
            </ScrollReveal>
          ))}
        </div>

        {/* Satisfaction guarantee */}
        <ScrollReveal className="text-center mt-12 max-w-xl mx-auto">
          <p className="text-[#9DA3B4] text-sm leading-relaxed">
            All memberships include a 30-day satisfaction review. If we haven&apos;t
            delivered value in the first 30 days, we&apos;ll refund your membership fee.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function MembershipPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-bg-primary">
        <MembershipHero />
        <HowItWorksSection />
        <TierComparisonSection />
        <CaseStudiesSection />
        <FAQSection />
        <FinalCTASection
          headline="Ready to Never Fly Economy Again?"
          highlight_word="Economy"
          subheadline="Applications are reviewed monthly. We personally review every application to ensure the fit is right — for you and for the club."
          cta_label="Submit Your Application"
          cta_href="/apply"
          urgency_line="Next intake opens April. Limited spots."
          secondary_link={{ label: 'Or book a free 15-min discovery call →', href: '/contact' }}
        />
      </main>
    </>
  );
}
