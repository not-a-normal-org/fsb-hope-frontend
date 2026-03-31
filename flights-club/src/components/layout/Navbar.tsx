'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_LINKS, NAV_CTA_BUTTONS } from '@/lib/constants';
import { CTAButton } from '@/components/ui/CTAButton';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const { scrollY } = useScroll();

  // Navbar background opacity: 0 at top, 1 after 80px scroll
  const navBgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const navBgColor = useTransform(
    navBgOpacity,
    (opacity) => `rgba(7, 9, 15, ${opacity})`
  );

  // Dropdown menu items for "The Flights Club"
  const membershipDropdownItems = [
    { label: 'Explore Tier', href: '/membership#explore' },
    { label: 'Platinum Tier', href: '/membership#platinum' },
    { label: 'Black Tier', href: '/membership#black' },
    { label: 'How It Works', href: '/membership#how-it-works' },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 border-b border-border-subtle/50"
        style={{
          backgroundColor: navBgColor,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-accent-orange transition-colors duration-300">
                ✈️ The Flights Club
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 xl:space-x-4 flex-grow justify-center">
              {NAV_LINKS.map((link) => {
                // Handle dropdown for "The Flights Club" link
                if (link.has_dropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative group"
                      onMouseEnter={() => setDesktopDropdownOpen(true)}
                      onMouseLeave={() => setDesktopDropdownOpen(false)}
                    >
                      <button className="flex items-center space-x-1 text-text-secondary hover:text-accent-orange transition-colors duration-300 text-sm py-2 px-3 rounded-lg hover:bg-bg-secondary/30">
                        <span>{link.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            desktopDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {desktopDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-bg-secondary border border-border-subtle rounded-lg shadow-2xl overflow-hidden z-50"
                          >
                            {membershipDropdownItems.map((item, idx) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setDesktopDropdownOpen(false)}
                                className={`block px-4 py-3 text-sm text-text-secondary hover:text-accent-orange hover:bg-bg-card/50 transition-all duration-200 ${
                                  idx !== membershipDropdownItems.length - 1
                                    ? 'border-b border-border-subtle/30'
                                    : ''
                                }`}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Regular links
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-text-secondary hover:text-accent-orange transition-colors duration-300 text-sm py-2 px-3 rounded-lg hover:bg-bg-secondary/30"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              {NAV_CTA_BUTTONS.map((btn) => (
                <CTAButton
                  key={btn.label}
                  label={btn.label}
                  href={btn.href}
                  variant={btn.variant as 'primary' | 'ghost'}
                />
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text-primary p-2 hover:text-accent-orange transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu - Slide-in panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden bg-gradient-to-b from-bg-secondary to-bg-card border-t border-border-subtle"
              >
                <div className="px-4 py-4 space-y-2">
                  {NAV_LINKS.map((link) => {
                    // Handle dropdown for mobile
                    if (link.has_dropdown) {
                      return (
                        <div key={link.label}>
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-text-secondary hover:text-accent-orange transition-colors py-2 px-3 text-sm font-medium hover:bg-bg-card/50 rounded-lg"
                          >
                            {link.label}
                          </Link>
                          <div className="pl-4 space-y-1 mt-1">
                            {membershipDropdownItems.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-text-muted hover:text-accent-orange transition-colors py-1.5 px-3 text-xs font-medium hover:bg-bg-primary/50 rounded-lg"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="block text-text-secondary hover:text-accent-orange transition-colors py-2 px-3 text-sm font-medium hover:bg-bg-card/50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="pt-4 border-t border-border-subtle space-y-2">
                    {NAV_CTA_BUTTONS.map((btn) => (
                      <div key={btn.label} onClick={() => setMobileMenuOpen(false)}>
                        <CTAButton
                          label={btn.label}
                          href={btn.href}
                          variant={btn.variant as 'primary' | 'ghost'}
                          className="w-full text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Navbar spacer - adjust height to match navbar */}
      <div className="h-16" />
    </>
  );
}
