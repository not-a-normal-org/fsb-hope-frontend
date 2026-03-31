'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariant } from '@/lib/animations';
import { MEMBERSHIP_TIERS } from '@/lib/constants';
import TierCard from '@/components/ui/TierCard';

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
          {MEMBERSHIP_TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} elevated />
          ))}
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
