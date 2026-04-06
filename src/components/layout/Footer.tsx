'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { FOOTER_COLUMNS, FOOTER } from '@/lib/constants';
import { fadeUpVariant, staggerContainerVariant, staggerChildVariant } from '@/lib/animations';

// Map social link names to icons and URLs
const SOCIAL_ICONS: Record<string, { Icon: React.ElementType; url: string }> = {
  Instagram: {
    Icon: Instagram,
    url: 'https://instagram.com/theflightsclub',
  },
  Facebook: {
    Icon: Facebook,
    url: 'https://facebook.com/theflightsclub',
  },
  LinkedIn: {
    Icon: Linkedin,
    url: 'https://linkedin.com/company/the-flights-club',
  },
  YouTube: {
    Icon: Youtube,
    url: 'https://youtube.com/@theflightsclub',
  },
};

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <footer className="relative bg-gradient-to-b from-bg-secondary to-bg-primary border-t border-border-subtle">
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-orange opacity-5 rounded-full blur-3xl" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-accent-blue opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* As Seen In Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="border-b border-border-subtle py-6 px-4 sm:px-6 lg:px-8 bg-bg-primary/40"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-text-muted text-xs font-semibold text-center tracking-wider uppercase">
              {FOOTER.as_seen_in}
            </p>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Top Section: Logo, Description, and Social */}
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 pb-16 border-b border-border-subtle"
          >
            {/* Logo and Description */}
            <motion.div variants={staggerChildVariant}>
              <Link href="/" className="inline-block group mb-4">
                <div className="text-2xl sm:text-3xl font-bold text-text-primary group-hover:text-accent-orange transition-colors duration-300">
                  ✈️ The Flights Club
                </div>
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
                Australia's premier Business Class travel membership for business owners.
                Turn everyday expenses into guaranteed flat-bed flights and VIP experiences.
              </p>
              <p className="text-text-muted text-xs mt-4 font-mono">
                Never fly economy again.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={staggerChildVariant} className="flex items-start md:justify-end">
              <div className="flex flex-wrap gap-4">
                {FOOTER.social_links.map((socialName) => {
                  const social = SOCIAL_ICONS[socialName];
                  if (!social) return null;
                  const { Icon, url } = social;

                  return (
                    <motion.a
                      key={socialName}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-lg bg-bg-card border border-border-subtle hover:border-accent-orange hover:bg-bg-card/80 transition-all duration-300 text-text-secondary hover:text-accent-orange group"
                      aria-label={socialName}
                    >
                      <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Three Columns */}
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 pb-16 border-b border-border-subtle"
          >
            {FOOTER_COLUMNS.map((column) => (
              <motion.div key={column.heading} variants={staggerChildVariant}>
                <h3 className="text-text-primary font-semibold mb-6 text-sm uppercase tracking-wider">
                  {column.heading}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-text-secondary hover:text-accent-orange transition-colors duration-300 text-sm group inline-flex items-center"
                      >
                        <span className="inline-block w-0 group-hover:w-1.5 h-0.5 bg-accent-orange mr-0 group-hover:mr-2 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Legal Section */}
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-center md:text-left space-y-4"
          >
            <motion.div variants={staggerChildVariant}>
              <p className="text-text-muted text-xs leading-relaxed">
                {FOOTER.copyright}
              </p>
            </motion.div>
            <motion.div variants={staggerChildVariant}>
              <p className="text-text-muted text-xs font-mono">
                {FOOTER.abn}
              </p>
            </motion.div>
            <motion.div
              variants={staggerChildVariant}
              className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs text-text-muted justify-center md:justify-start"
            >
              <Link href="/privacy" className="hover:text-accent-orange transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent-orange transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-accent-orange transition-colors">
                Contact
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-orange to-transparent opacity-20" />
    </footer>
  );
}
