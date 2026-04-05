'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StatsSection from '@/components/sections/StatsSection';
import MediaLogosSection from '@/components/sections/MediaLogosSection';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/* ─── Founder data ─── */
const FOUNDERS = [
  {
    initials: 'SH',
    name: 'Steve Hui',
    title: "Australia's Points Whisperer",
    role: 'Co-Founder & Points Strategy Director',
    bio: "Steve has spent 12+ years helping Australians unlock the hidden value in their points programs. He's personally overseen more than $1 billion in points redemptions and has been featured in The Australian, Sky News, 9 News, and SBS.",
  },
  {
    initials: 'SP',
    name: 'Steve Pirie-Nally',
    title: 'Global Experience Architect',
    role: 'Co-Founder & Experience Director',
    bio: 'Steve brings 15+ years of luxury travel and high-end experience curation. He designed the curated retreat and event program that makes Black tier membership unlike anything else in Australia.',
  },
];

/* ─── Values data ─── */
const VALUES = [
  {
    heading: 'Results, not promises.',
    body: 'Every strategy we build is backed by 12 years of what actually works — not what sounds good in a pitch.',
  },
  {
    heading: 'Your time is the asset.',
    body: 'We handle everything. You show up at the gate and turn left.',
  },
  {
    heading: 'Members first, always.',
    body: "We only take on clients we can genuinely help. If it's not right for you, we'll say so.",
  },
];

/* ─── Pull quotes ─── */
const QUOTES = [
  {
    text: 'The go-to points expert for Australian business owners.',
    source: 'The Australian',
  },
  {
    text: 'Steve Hui has saved Australians millions in travel costs.',
    source: 'Sky News',
  },
];

export default function AboutPage() {
  return (
    <main className="w-full">

      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      <section className="pt-32 pb-24 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <SectionLabel label="OUR STORY" className="mb-6" />

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-6">
              We Started Because the System
              <br />
              <span className="text-accent-orange">Was Broken.</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl">
              Most Australians with points never use them properly. They expire.
              They get wasted on economy upgrades. Or they sit in an app nobody
              opens. We built The Flights Club to fix that — one business owner
              at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — FOUNDERS
      ══════════════════════════════════════ */}
      <section className="py-24 bg-bg-secondary border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">
              The Team Behind The Club
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {FOUNDERS.map((founder, i) => (
              <ScrollReveal key={founder.initials} delay={i * 0.1}>
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 flex flex-col gap-6">
                  {/* Avatar placeholder */}
                  <div className="w-24 h-24 rounded-2xl bg-[#13182A] border border-border-subtle flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#E8963A] font-mono">
                      {founder.initials}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-orange mb-1">
                      {founder.title}
                    </p>
                    <h3 className="text-2xl font-bold text-text-primary mb-1">
                      {founder.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-4">{founder.role}</p>
                    <p className="text-text-secondary leading-relaxed">
                      {founder.bio}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — BY THE NUMBERS
      ══════════════════════════════════════ */}
      <StatsSection />

      {/* ══════════════════════════════════════
          SECTION 4 — AS SEEN IN
      ══════════════════════════════════════ */}
      <section id="media" className="py-24 bg-bg-secondary border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">
              Trusted by Australia&apos;s Leading Media
            </h2>
          </ScrollReveal>
        </div>

        {/* Reuse the shared marquee component */}
        <MediaLogosSection />

        {/* Pull quotes */}
        <div className="max-w-5xl mx-auto px-6 lg:px-16 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {QUOTES.map((q, i) => (
              <ScrollReveal key={q.source} delay={i * 0.1}>
                <blockquote className="relative bg-bg-card border border-border-subtle rounded-2xl p-8">
                  {/* Decorative quotation mark */}
                  <span
                    className="absolute top-4 left-6 text-7xl font-serif leading-none select-none pointer-events-none"
                    style={{ color: 'rgba(232,150,58,0.3)' }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="relative italic text-text-primary text-lg leading-relaxed pt-8">
                    {q.text}
                  </p>
                  <footer className="mt-4 text-text-secondary text-sm">
                    — {q.source}
                  </footer>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — VALUES
      ══════════════════════════════════════ */}
      <section className="py-24 bg-bg-primary border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">
              What We Stand For
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.heading} delay={i * 0.1}>
                <div className="group relative bg-bg-card border border-border-subtle rounded-2xl p-8 hover:border-accent-orange/30 transition-colors duration-300">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative">
                    <div className="h-1 w-10 bg-accent-orange rounded-full mb-6" />
                    <h3 className="text-xl font-bold text-text-primary mb-3">
                      {value.heading}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {value.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — CTA
      ══════════════════════════════════════ */}
      <section className="py-24 bg-bg-secondary">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 text-center">
          <ScrollReveal className="flex flex-col items-center gap-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">
              Ready to Join the Club?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-orange text-black font-bold rounded-full hover:bg-accent-orange-light transition-colors duration-200 text-base"
              >
                View Membership Tiers →
              </Link>

              <Link
                href="/points-concierge"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border-subtle text-text-secondary font-medium rounded-full hover:border-accent-orange/50 hover:text-text-primary transition-colors duration-200 text-base"
              >
                Or book a concierge seat →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
