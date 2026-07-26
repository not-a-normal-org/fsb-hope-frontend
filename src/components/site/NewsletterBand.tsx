import AmbientBackground from '@/components/system/AmbientBackground';
import NewsletterForm from './NewsletterForm';

/**
 * Home newsletter band (docs/plans/02, 07) — email capture → `newsletter_subscribers`
 * via NewsletterForm. Server component; the form is the only client bit.
 */
export default function NewsletterBand() {
  return (
    <section className="relative overflow-hidden border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <AmbientBackground variant="section" />
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
        <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
          Stay in the loop
        </p>
        <h2 className="mt-3 font-display text-section font-bold text-ink">
          Points intel worth opening.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-sub">
          Occasional notes from our specialists — sweet spots, transfer bonuses, and award space
          worth knowing about. No spam, unsubscribe anytime.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <NewsletterForm source="home_band" buttonLabel="Subscribe" />
        </div>
      </div>
    </section>
  );
}
