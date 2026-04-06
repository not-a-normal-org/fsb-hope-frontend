'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariant, staggerChildVariant } from '@/lib/animations';
import { PODCAST_SECTION, PODCAST_EPISODES } from '@/lib/constants';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { CTAButton } from '@/components/ui/CTAButton';
import { Play } from 'lucide-react';

export default function PodcastSection() {
  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="mb-12">
          <SectionLabel label={PODCAST_SECTION.section_label} />
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            {PODCAST_SECTION.section_title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl">
            Listen to founders, business owners, and aviation experts share their stories about premium travel, points strategies, and building businesses that pay for Business Class.
          </p>
        </div>

        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {PODCAST_EPISODES.map((episode, idx) => (
            <motion.div
              key={`podcast-${idx}`}
              variants={staggerChildVariant}
              className="bg-bg-secondary rounded-xl overflow-hidden border border-border-subtle hover:border-accent-orange/50 transition-all group"
            >
              {/* Cover image placeholder */}
              <div className="relative aspect-square bg-gradient-to-br from-accent-orange/20 to-accent-blue/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent-orange/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={32} className="text-accent-orange fill-accent-orange" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-accent-orange text-black px-3 py-1 rounded-full text-xs font-bold">
                  Ep {episode.episode_number}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
                  {episode.title}
                </h3>
                <p className="text-text-secondary text-sm mb-1">
                  {episode.guest_name}
                </p>
                <p className="text-text-muted text-xs mb-4">
                  {episode.duration}
                </p>

                <a
                  href={episode.listen_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-accent-orange hover:text-accent-orange-light transition-colors text-sm font-semibold"
                >
                  <span>Listen Now</span>
                  <Play size={14} className="fill-current" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all CTA */}
        <div className="flex justify-center">
          <CTAButton
            label={PODCAST_SECTION.cta_label}
            href={PODCAST_SECTION.cta_href}
            variant="secondary"
          />
        </div>
      </div>
    </section>
  );
}
