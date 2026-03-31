'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { FLIGHT_ROUTES } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { FlightRouteCard } from '@/components/ui/FlightRouteCard';

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

        {/* Desktop grid */}
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {FLIGHT_ROUTES.map((route, idx) => (
            <FlightRouteCard
              key={`route-${idx}`}
              route={route}
              variants={staggerChildVariant}
            />
          ))}
        </motion.div>

        {/* Mobile horizontal scroll */}
        <div className="sm:hidden overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6">
          <div className="flex gap-6 min-w-max">
            {FLIGHT_ROUTES.map((route, idx) => (
              <FlightRouteCard
                key={`route-mobile-${idx}`}
                route={route}
                isMobile
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
