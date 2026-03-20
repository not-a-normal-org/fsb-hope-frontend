'use client';

import { motion } from 'framer-motion';
import { slideInLeftVariant, slideInRightVariant } from '@/lib/animations';
import { TWO_PATHS } from '@/lib/constants';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CTAButton } from '@/components/ui/CTAButton';
import { SectionLabel } from '@/components/ui/SectionLabel';

export default function TwoPathsSection() {
  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left card - Concierge */}
          <motion.div
            variants={slideInLeftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-transparent rounded-2xl blur-xl" />
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(58, 111, 232, 0.2)' }}
              transition={{ duration: 0.3 }}
              className="relative bg-bg-card border border-border-subtle rounded-2xl p-8 hover:border-accent-blue/50 transition-colors duration-300"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-accent-blue mb-4">
                {TWO_PATHS[0].label}
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-4">
                {TWO_PATHS[0].title}
              </h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                {TWO_PATHS[0].description}
              </p>
              <div className="bg-bg-secondary rounded-lg p-4 mb-6">
                <p className="text-accent-blue font-semibold text-lg">
                  {TWO_PATHS[0].price}
                </p>
              </div>
              <CTAButton
                label={TWO_PATHS[0].cta_label}
                href={TWO_PATHS[0].cta_href}
                variant="ghost"
                className="w-full text-center"
              />
            </motion.div>
          </motion.div>

          {/* Right card - Membership */}
          <motion.div
            variants={slideInRightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-orange/20 to-transparent rounded-2xl blur-xl" />
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(232, 150, 58, 0.2)' }}
              transition={{ duration: 0.3 }}
              className="relative bg-bg-card border-2 border-accent-orange rounded-2xl p-8 hover:border-accent-orange/80 transition-colors duration-300"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-accent-orange mb-4">
                {TWO_PATHS[1].label}
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-4">
                {TWO_PATHS[1].title}
              </h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                {TWO_PATHS[1].description}
              </p>
              <div className="bg-bg-secondary rounded-lg p-4 mb-6">
                <p className="text-accent-orange font-semibold text-lg">
                  {TWO_PATHS[1].price}
                </p>
              </div>
              <CTAButton
                label={TWO_PATHS[1].cta_label}
                href={TWO_PATHS[1].cta_href}
                variant="primary"
                className="w-full text-center"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
