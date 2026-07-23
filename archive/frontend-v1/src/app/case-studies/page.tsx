import type { Metadata } from 'next';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';

export const metadata: Metadata = {
  title: 'Case Studies — PointIQ',
  description:
    'Real member stories: how Australian business owners turned everyday spending into Business Class flights and premium travel.',
};

export default function CaseStudiesPage() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="pt-32 pb-12 bg-bg-primary">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 text-center">
          <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
            Case Studies
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary mb-5 leading-tight">
            Real Members. Real Savings.
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            See how business owners across Australia turned their everyday spending
            into Business Class seats, premium upgrades, and unforgettable journeys.
          </p>
        </div>
      </section>

      {/* Reuse the existing member-stories carousel */}
      <CaseStudiesSection />
    </main>
  );
}
