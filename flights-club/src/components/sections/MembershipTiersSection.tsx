'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { MEMBERSHIP_TIERS } from '@/lib/constants';
import { Check } from 'lucide-react';

export default function MembershipTiersSection() {
  return (
    <section className="relative py-24 bg-bg-primary overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent-gold rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />
      <div className="absolute bottom-10 left-5 w-96 h-96 bg-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-5 -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">MEMBERSHIP TIERS</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight max-w-3xl mx-auto">
            Choose Your Level
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Every business is different. Pick the tier that matches your ambition and growth.
          </p>
        </div>

        {/* Tiers grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {MEMBERSHIP_TIERS.map((tier) => {
            const isPopular = tier.id === 'platinum';
            const isElite = tier.id === 'black';
            const accentColor = isElite ? '#C9A84C' : isPopular ? '#E8963A' : '#3A6FE8';

            return (
              <motion.div
                key={tier.id}
                className={`group relative rounded-xl overflow-hidden border transition-all duration-300 ${
                  isElite
                    ? 'border-accent-gold bg-gradient-to-br from-bg-card via-bg-secondary to-bg-card shimmer-on-hover'
                    : isPopular
                    ? 'border-accent-orange/60 bg-gradient-to-br from-bg-card to-bg-secondary'
                    : 'border-border-subtle bg-bg-card'
                } ${isPopular ? 'md:scale-105 md:z-10' : ''}`}
                variants={staggerChildVariant}
                whileHover={isElite ? { y: -6, scale: 1.01 } : { y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Badge */}
                {isPopular && (
                  <motion.div
                    className="absolute top-6 right-6 px-3 py-1 rounded-full bg-accent-orange text-bg-primary text-xs font-bold uppercase tracking-wider"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Most Popular
                  </motion.div>
                )}

                {isElite && (
                  <motion.div
                    className="absolute top-6 right-6 px-3 py-1 rounded-full bg-accent-gold text-bg-primary text-xs font-bold uppercase tracking-wider"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Elite
                  </motion.div>
                )}

                {/* Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  isElite
                    ? 'from-accent-gold to-accent-gold/50'
                    : isPopular
                    ? 'from-accent-orange to-accent-orange/50'
                    : 'from-accent-blue to-accent-blue/50'
                }`} />

                {/* Content */}
                <div className="p-8 sm:p-10">
                  {/* Tier name */}
                  <h3 className={`text-3xl font-bold mb-2 ${
                    isElite
                      ? 'text-accent-gold'
                      : isPopular
                      ? 'text-accent-orange'
                      : 'text-text-primary'
                  }`}>
                    {tier.name}
                  </h3>

                  {/* Target */}
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed min-h-10">
                    {tier.target}
                  </p>

                  {/* Key benefit */}
                  <div className={`rounded-lg p-4 mb-8 border ${
                    isElite
                      ? 'border-accent-gold/30 bg-accent-gold/5'
                      : isPopular
                      ? 'border-accent-orange/30 bg-accent-orange/5'
                      : 'border-accent-blue/20 bg-accent-blue/5'
                  }`}>
                    <p className={`text-sm font-semibold leading-relaxed ${
                      isElite || isPopular ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {tier.key_benefit}
                    </p>
                  </div>

                  {/* Included items */}
                  <div className="space-y-3 mb-8">
                    {tier.included.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check
                          size={18}
                          className={`flex-shrink-0 mt-0.5 ${
                            isElite
                              ? 'text-accent-gold'
                              : isPopular
                              ? 'text-accent-orange'
                              : 'text-accent-blue'
                          }`}
                          strokeWidth={2.5}
                        />
                        <span className="text-text-secondary text-sm leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.a
                    href={tier.cta_href}
                    className={`block w-full py-3 px-4 rounded-lg font-semibold text-center text-sm uppercase tracking-wide transition-all duration-300 ${
                      isElite
                        ? 'bg-accent-gold text-bg-primary hover:bg-accent-gold/90'
                        : isPopular
                        ? 'bg-accent-orange text-bg-primary hover:bg-accent-orange/90'
                        : 'border border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.cta_label}
                  </motion.a>
                </div>

                {/* Hover glow effect for Blue tier */}
                {!isPopular && !isElite && (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/0 to-accent-blue/0 group-hover:from-accent-blue/5 group-hover:to-accent-blue/10 transition-all duration-300 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer text */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-text-secondary text-sm">
            Not sure which tier is right for you?{' '}
            <a href="/contact" className="text-accent-orange hover:text-accent-orange-light transition-colors">
              Schedule a consultation
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
