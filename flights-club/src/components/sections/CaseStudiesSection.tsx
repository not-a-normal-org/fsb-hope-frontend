'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { CASE_STUDIES } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';

export default function CaseStudiesSection() {
  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-12">
          <SectionLabel label="Real Stories" />
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            How Our Members Turned Spend Into Business Class
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl">
            These aren't hypothetical numbers. These are actual business owners who now fly smarter.
          </p>
        </div>

        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={`case-${idx}`}
              variants={staggerChildVariant}
              whileHover={{ y: -4, rotateY: 2 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Background glow on hover */}
              <div className="absolute -inset-3 bg-accent-orange/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              
              <div className="bg-bg-secondary rounded-xl p-8 border border-border-subtle hover:border-accent-orange/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent-orange/20 h-full">
              {/* Tier badge */}
              <div className="inline-block mb-4">
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    study.tier === 'Explore'
                      ? 'bg-accent-blue/20 text-accent-blue'
                      : study.tier === 'Platinum'
                        ? 'bg-accent-orange/20 text-accent-orange'
                        : 'bg-accent-gold/20 text-accent-gold'
                  }`}
                >
                  {study.tier}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-lg font-semibold text-text-primary mb-6 italic line-clamp-3">
                "{study.quote}"
              </blockquote>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Name</p>
                  <p className="font-bold text-text-primary text-lg">{study.name}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Business</p>
                  <p className="font-semibold text-text-secondary">{study.business_type}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Turnover</p>
                  <p className="font-semibold text-text-secondary">{study.turnover}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border-subtle mb-6" />

              {/* Results */}
              <div className="space-y-2">
                <p className="text-text-muted text-xs uppercase tracking-widest font-semibold">Result</p>
                <p className="text-lg font-bold text-accent-orange">{study.result}</p>
                <p className="text-sm text-text-secondary">{study.saving}</p>
              </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
