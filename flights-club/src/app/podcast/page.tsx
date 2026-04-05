'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/* ─── Episode data ─── */
const EPISODES = [
  {
    ep: '01',
    title: 'Building a Billion Dollar Points Empire',
    guest: 'Mark Chen',
    role: 'Entrepreneur',
    duration: '42 min',
  },
  {
    ep: '02',
    title: 'From Economy to Business Class: The Mindset Shift',
    guest: 'Sarah Thompson',
    role: 'Founder',
    duration: '35 min',
  },
  {
    ep: '03',
    title: 'How Points Strategy Changed My Business',
    guest: 'Dollar Points Empire',
    role: '',
    duration: '28 min',
  },
  {
    ep: '04',
    title: 'The Hidden Value in Your Supplier Payments',
    guest: 'James Wu',
    role: 'CFO',
    duration: '51 min',
  },
  {
    ep: '05',
    title: 'Why Most Business Owners Never Fly Business',
    guest: 'Lisa Park',
    role: 'Business Coach',
    duration: '39 min',
  },
  {
    ep: '06',
    title: "The First Class Upgrade Nobody Talks About",
    guest: 'David Chen',
    role: 'Travel Hacker',
    duration: '44 min',
  },
];

/* ─── Platform badges ─── */
const PLATFORMS = [
  {
    label: 'Apple Podcasts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.141-.828 3.329-.236.995.499 1.806 1.476 1.806 1.771 0 3.133-1.867 3.133-4.563 0-2.387-1.715-4.055-4.163-4.055-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.774.741 2.276a.3.3 0 0 1 .069.283c-.075.314-.243.995-.276 1.134-.044.183-.146.221-.336.133-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Spotify',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.87 7.076-.496 9.713 1.115a.624.624 0 0 1 .206.857zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.786-2.131-9.965-1.166a.78.78 0 0 1-.966-.519.781.781 0 0 1 .519-.967c3.632-1.102 8.147-.568 11.228 1.329a.78.78 0 0 1 .256 1.066zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 1 1-.543-1.794c3.521-1.068 9.376-.861 13.072 1.235a.937.937 0 0 1-.912 1.636z" />
      </svg>
    ),
  },
  {
    label: 'Google Podcasts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 3 0v-6A1.5 1.5 0 0 0 12 3zm-6 6a1.5 1.5 0 0 0-1.5 1.5v.001a1.5 1.5 0 0 0 3 0V10.5A1.5 1.5 0 0 0 6 9zm12 0a1.5 1.5 0 0 0-1.5 1.5v.001a1.5 1.5 0 0 0 3 0V10.5A1.5 1.5 0 0 0 18 9zm-9 3.75a1.5 1.5 0 0 0-1.5 1.5v.001a1.5 1.5 0 0 0 3 0v-.001A1.5 1.5 0 0 0 9 12.75zm6 0a1.5 1.5 0 0 0-1.5 1.5v.001a1.5 1.5 0 0 0 3 0v-.001A1.5 1.5 0 0 0 15 12.75zm-3 3a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 3 0v-1.5A1.5 1.5 0 0 0 12 15.75z" />
      </svg>
    ),
  },
];

/* ─── Waveform bar heights (20 bars) ─── */
const BAR_HEIGHTS = [30, 55, 45, 70, 40, 60, 80, 35, 65, 50, 75, 42, 58, 68, 38, 72, 48, 62, 44, 56];

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-12" aria-hidden="true">
      {BAR_HEIGHTS.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-accent-orange origin-bottom"
          animate={
            active
              ? {
                  scaleY: [1, (h / 50) * 1.4, 0.6, (h / 50) * 1.2, 1],
                  opacity: [0.6, 1, 0.7, 1, 0.6],
                }
              : { scaleY: h / 80, opacity: 0.4 }
          }
          transition={
            active
              ? {
                  duration: 0.8 + (i % 4) * 0.1,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: i * 0.04,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
          style={{ height: '100%' }}
        />
      ))}
    </div>
  );
}

/* ─── Episode card ─── */
function EpisodeCard({ ep, title, guest, role, duration }: (typeof EPISODES)[0]) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-bg-card border border-border-subtle rounded-2xl overflow-hidden hover:border-accent-orange/40 transition-colors duration-300 flex flex-col"
    >
      {/* Waveform header */}
      <div className="relative bg-bg-secondary px-6 pt-6 pb-4 flex items-end justify-between">
        <Waveform active={hovered} />
        <span className="ml-4 flex-shrink-0 text-xs font-bold bg-accent-orange text-black px-3 py-1 rounded-full">
          Ep {ep}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-bold text-text-primary leading-snug group-hover:text-accent-orange transition-colors duration-200">
          {title}
        </h3>

        <div className="flex-1">
          <p className="text-text-secondary text-sm">
            {guest}{role ? `, ${role}` : ''}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-text-muted border border-border-subtle rounded-full px-3 py-1">
            {duration}
          </span>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-accent-orange hover:text-accent-orange-light transition-colors text-sm font-semibold"
          >
            Listen Now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function PodcastPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

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
            <SectionLabel label="ALWAYS BUSINESS CLASS PODCAST" className="mb-6" />

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-4">
              Real Conversations About
              <br />
              <span className="text-accent-orange">Flying Smarter</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10">
              Founders, business owners, and aviation insiders share how they
              turned everyday spending into premium travel.
            </p>

            {/* Platform badges */}
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((p) => (
                <a
                  key={p.label}
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm font-medium hover:border-accent-orange/50 hover:text-text-primary transition-colors duration-200"
                >
                  {p.icon}
                  {p.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — EPISODE GRID
      ══════════════════════════════════════ */}
      <section className="py-24 bg-bg-secondary border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <ScrollReveal className="mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">
              All Episodes
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EPISODES.map((ep, i) => (
              <ScrollReveal key={ep.ep} delay={i * 0.08}>
                <EpisodeCard {...ep} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — SUBSCRIBE STRIP
      ══════════════════════════════════════ */}
      <section className="py-12 bg-[#13182A]">
        <div className="max-w-2xl mx-auto px-6 lg:px-16 text-center">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
              Never miss an episode.
            </h2>

            {submitted ? (
              <p className="text-accent-orange font-semibold text-lg">
                You&apos;re subscribed. See you in the next episode.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3 rounded-full bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-orange/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-7 py-3 rounded-full bg-accent-orange text-black font-bold text-sm hover:bg-accent-orange-light transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
