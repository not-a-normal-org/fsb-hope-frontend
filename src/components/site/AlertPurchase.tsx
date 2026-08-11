import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import AlertBuyBox from '@/components/site/AlertBuyBox';
import type { Product } from '@/lib/products';

/**
 * Shared body for the two alert purchase pages (/alerts/weekly, /alerts/human):
 * product detail on the left, the Stripe buy box on the right. The pages resolve
 * the monthly/annual price IDs from NEXT_PUBLIC_STRIPE_PRICE_* and hand them in.
 */
export default function AlertPurchase({
  product,
  eyebrow,
  monthlyPriceId,
  annualPriceId,
  cancelPath,
}: {
  product: Product;
  eyebrow: string;
  monthlyPriceId?: string;
  annualPriceId?: string;
  cancelPath: string;
}) {
  return (
    <>
      <NavBar />

      <PageHero compact eyebrow={eyebrow} title={product.name} intro={product.tagline} />

      <section className="relative">
        <AmbientBackground variant="section" />
        <div className="mx-auto grid max-w-5xl gap-8 px-6 pb-24 md:grid-cols-2 md:gap-10">
          {/* Detail */}
          <div>
            <p className="text-sm leading-relaxed text-ink-sub">{product.description}</p>

            <ul className="mt-6 space-y-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-sub">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: 'var(--sm-accent)' }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            {product.disclosure && (
              <div
                className="mt-7 rounded-lg px-3.5 py-3"
                style={{
                  background: 'color-mix(in srgb, var(--sm-warning) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--sm-warning) 28%, transparent)',
                }}
              >
                <p
                  className="font-mono text-[0.62rem] uppercase tracking-[0.12em]"
                  style={{ color: 'var(--sm-warning)' }}
                >
                  Automated — read this
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-sub">{product.disclosure}</p>
              </div>
            )}
          </div>

          {/* Buy box */}
          <GlassPanel as="div" className="h-fit">
            <AlertBuyBox
              productKey={product.id}
              monthly={{ priceId: monthlyPriceId, display: product.price }}
              annual={{ priceId: annualPriceId, display: product.priceAnnual ?? product.price }}
              cancelPath={cancelPath}
            />
          </GlassPanel>
        </div>
      </section>

      <Footer />
    </>
  );
}
