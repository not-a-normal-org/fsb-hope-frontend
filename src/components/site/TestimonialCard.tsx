import GlassPanel from '@/components/system/GlassPanel';
import type { Testimonial } from '@/lib/testimonials';

/**
 * One client story on glass — route eyebrow, the quote, attribution. Shared by
 * the /results wall and the home proof teaser. Purely presentational, so it
 * composes inside either server or client parents.
 */
export default function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: Testimonial;
  featured?: boolean;
}) {
  return (
    <GlassPanel
      as="figure"
      className="flex h-full flex-col"
      padding={featured ? 'p-8 sm:p-10' : 'p-6 sm:p-7'}
    >
      {testimonial.route && (
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          {testimonial.route}
        </span>
      )}
      <blockquote
        className={`mt-4 font-display font-medium leading-snug text-ink ${
          featured ? 'text-2xl md:text-[1.75rem]' : 'text-lg'
        }`}
      >
        “{testimonial.quote}”
      </blockquote>
      {testimonial.attribution && (
        <figcaption className="mt-auto pt-6 text-sm text-ink-sub">
          — {testimonial.attribution}
        </figcaption>
      )}
    </GlassPanel>
  );
}
