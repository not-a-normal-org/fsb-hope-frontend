'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { FLIGHT_ROUTES } from '@/lib/constants';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

export default function FlightSavingsSection() {
  return (
    <section className="py-20 bg-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-12">
          <SectionLabel label="Flight Savings" />
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            See What Business Class Actually Costs
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl">
            Your Frequent Flyer points are worth a fortune. Here's what real seats cost vs. what you'll pay in points.
          </p>
        </div>

        {/* Desktop grid view */}
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {FLIGHT_ROUTES.map((route, idx) => (
            <motion.div
              key={`route-${idx}`}
              variants={staggerChildVariant}
              whileHover={{ y: -4, borderColor: '#E8963A', boxShadow: '0 20px 60px rgba(232, 150, 58, 0.2)' }}
              transition={{ duration: 0.3 }}
              className="bg-bg-primary rounded-xl overflow-hidden border border-border-subtle transition-all group"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-accent-blue/20 to-accent-orange/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-text-muted group-hover:text-accent-orange transition-colors">
                  <span className="text-sm font-semibold">{route.from} → {route.to}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-text-muted text-sm">From</p>
                    <p className="text-2xl font-bold text-text-primary">{route.from}</p>
                  </div>
                  <div className="text-2xl text-accent-orange">✈️</div>
                  <div>
                    <p className="text-text-muted text-sm">To</p>
                    <p className="text-2xl font-bold text-text-primary">{route.to}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 border-t border-border-subtle pt-6">
                  <div>
                    <p className="text-text-muted text-sm">Using Points</p>
                    <p className="text-xl font-bold text-accent-orange">{route.points_cost}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Cash Price</p>
                    <p className="text-xl font-bold text-text-secondary">{route.retail_cost}</p>
                  </div>
                </div>

                <div className="bg-bg-secondary rounded-lg p-4 border border-border-subtle">
                  <p className="text-sm text-text-secondary italic">
                    That's the same as: <span className="text-accent-orange font-semibold">{route.saving_equivalent}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile horizontal scroll view */}
        <div className="sm:hidden overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6">
          <div className="flex gap-6 min-w-max">
            {FLIGHT_ROUTES.map((route, idx) => (
              <div
                key={`route-mobile-${idx}`}
                className="w-80 flex-shrink-0 snap-center bg-bg-primary rounded-xl overflow-hidden border border-border-subtle hover:border-accent-orange/50 transition-all group hover:shadow-xl hover:shadow-accent-orange/20"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-accent-blue/20 to-accent-orange/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-text-muted group-hover:text-accent-orange transition-colors">
                    <span className="text-sm font-semibold">{route.from} → {route.to}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-text-muted text-sm">From</p>
                      <p className="text-2xl font-bold text-text-primary">{route.from}</p>
                    </div>
                    <div className="text-2xl text-accent-orange">✈️</div>
                    <div>
                      <p className="text-text-muted text-sm">To</p>
                      <p className="text-2xl font-bold text-text-primary">{route.to}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 border-t border-border-subtle pt-6">
                    <div>
                      <p className="text-text-muted text-sm">Using Points</p>
                      <p className="text-xl font-bold text-accent-orange">{route.points_cost}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Cash Price</p>
                      <p className="text-xl font-bold text-text-secondary">{route.retail_cost}</p>
                    </div>
                  </div>

                  <div className="bg-bg-secondary rounded-lg p-4 border border-border-subtle">
                    <p className="text-sm text-text-secondary italic">
                      That's the same as: <span className="text-accent-orange font-semibold">{route.saving_equivalent}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
