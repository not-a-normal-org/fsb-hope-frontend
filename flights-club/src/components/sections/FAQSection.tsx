'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_ITEMS } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import type { FAQItem } from '@/lib/types';

interface FAQSectionProps {
  /** Override items — falls back to the global FAQ_ITEMS from constants */
  items?: FAQItem[];
}

export default function FAQSection({ items = FAQ_ITEMS }: FAQSectionProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        suppressHydrationWarning
      />

      <section className="relative py-24 bg-bg-primary overflow-hidden" id="faq">
        {/* Decorative orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-orange rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />
        <div className="absolute bottom-10 left-5 w-96 h-96 bg-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">COMMON QUESTIONS</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight">
              Everything You Need to Know
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Get answers to the most frequently asked questions about The Flights Club membership and our Concierge service.
            </p>
          </div>

          {/* FAQ Items */}
          <motion.div
            className="space-y-3"
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                className="group relative sm:pl-14"
                variants={staggerChildVariant}
              >
                {/* Animated question number */}
                <AnimatePresence>
                  {expandedIdx === idx && (
                    <motion.span
                      key={`num-${idx}`}
                      className="hidden sm:block absolute left-0 top-6 font-mono text-4xl font-bold text-[#E8963A]/40 pointer-events-none select-none leading-none"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Accordion container */}
                <motion.div
                  className="border border-border-subtle rounded-xl overflow-hidden bg-bg-card hover:bg-bg-secondary transition-colors duration-300"
                  whileHover={{ borderColor: 'rgba(232, 150, 58, 0.4)' }}
                >
                  {/* Question button */}
                  <button
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                    aria-expanded={expandedIdx === idx}
                  >
                    {/* Question text */}
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary pr-6 leading-relaxed flex-1 group-hover:text-accent-orange-light transition-colors duration-300">
                      {item.q}
                    </h3>

                    {/* Chevron icon */}
                    <motion.div
                      className="flex-shrink-0"
                      animate={{ rotate: expandedIdx === idx ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <ChevronDown
                        size={24}
                        className="text-accent-orange"
                        strokeWidth={2}
                      />
                    </motion.div>
                  </button>

                  {/* Answer section with height animation */}
                  <AnimatePresence mode="wait">
                    {expandedIdx === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          height: { duration: 0.3, ease: 'easeInOut' },
                          opacity: { duration: 0.3 },
                        }}
                        className="overflow-hidden border-t border-border-subtle"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="px-6 sm:px-8 py-6 sm:py-8 bg-bg-primary/50"
                        >
                          <p className="text-text-secondary leading-relaxed text-base sm:text-lg">
                            {item.a}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Accent line on bottom when expanded */}
                {expandedIdx === idx && (
                  <motion.div
                    layoutId={`accent-${idx}`}
                    className="absolute bottom-0 left-0 sm:left-14 right-0 h-1 bg-gradient-to-r from-accent-orange to-accent-orange/50 rounded-b-xl"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-text-secondary mb-4">
              Still have questions?
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 border border-accent-orange text-accent-orange hover:bg-accent-orange/10 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
