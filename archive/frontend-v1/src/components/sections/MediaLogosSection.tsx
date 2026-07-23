import { MEDIA_LOGOS } from '@/lib/constants';

export default function MediaLogosSection() {
  return (
    <section className="py-12 bg-bg-secondary border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <p className="text-xs font-semibold uppercase text-text-muted text-center mb-8 tracking-widest">
          Trusted and Featured In
        </p>

        {/* Infinite scroll container */}
        <div className="overflow-hidden">
          <div className="flex animate-infinite-scroll">
            {/* First set */}
            {MEDIA_LOGOS.map((logo, idx) => (
              <div key={`1-${idx}`} className="flex items-center">
                <div className="flex-shrink-0 px-8 text-text-secondary text-sm font-medium whitespace-nowrap hover:text-accent-orange transition-colors">
                  {logo}
                </div>
                {idx < MEDIA_LOGOS.length - 1 && (
                  <div className="text-text-muted text-sm px-2">·</div>
                )}
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {MEDIA_LOGOS.map((logo, idx) => (
              <div key={`2-${idx}`} className="flex items-center">
                <div className="flex-shrink-0 px-8 text-text-secondary text-sm font-medium whitespace-nowrap hover:text-accent-orange transition-colors">
                  {logo}
                </div>
                {idx < MEDIA_LOGOS.length - 1 && (
                  <div className="text-text-muted text-sm px-2">·</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
