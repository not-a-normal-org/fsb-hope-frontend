import type { Metadata } from 'next';

import LegalDoc from '@/components/site/LegalDoc';

/**
 * /legal/cookies — Cookie Policy. Lists the exact cookies/storage the site sets
 * today (referral, session, theme, newsletter-popup), notes there is no analytics
 * or advertising tracking yet, and flags that a consent mechanism will be added if
 * analytics are introduced. NOTE: structure-reviewed, not legal advice.
 */
export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'The cookies and browser storage SaverMiles uses, why we use them, and how to control them. We currently use no analytics or advertising cookies.',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 31, 2026';
const EMAIL = 'hello@savermiles.com';

export default function CookiePolicyPage() {
  return (
    <LegalDoc
      title="Cookie Policy"
      updated={UPDATED}
      intro="This policy explains the cookies and browser storage our website uses, what they do, and how you can control them."
    >
      <p>
        This Cookie Policy describes how <strong>Saver Miles LLC</strong> (&ldquo;SaverMiles,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us&rdquo;) uses cookies and similar browser-storage technologies on
        savermiles.com. It should be read together with our{' '}
        <a href="/legal/privacy">Privacy Policy</a>.
      </p>

      <h2>1. What cookies and browser storage are</h2>
      <p>
        Cookies are small text files a website stores in your browser. Related technologies,
        &ldquo;local storage&rdquo; and &ldquo;session storage,&rdquo; let a site remember small pieces
        of information on your device. They can be <em>strictly necessary</em> (needed for the site to
        work), <em>functional</em> (remembering your preferences), or used for <em>analytics</em> or{' '}
        <em>advertising</em>. We currently use only strictly-necessary and functional items.
      </p>

      <h2>2. What we use, and why</h2>
      <p>The items we set are:</p>
      <ul>
        <li>
          <strong>Referral attribution</strong> (cookie <code>sm_ref</code>, about 90 days) &mdash;
          <em> functional.</em> If you arrive through an affiliate link, this remembers which affiliate
          referred you so their referral is credited. It holds only a short referral code.
        </li>
        <li>
          <strong>Theme preference</strong> (local storage <code>sm-theme</code>) &mdash;{' '}
          <em>functional.</em> Remembers whether you chose the light, dark, or mono theme.
        </li>
        <li>
          <strong>Newsletter prompt</strong> (local/session storage <code>sm-nl-dismissed</code>,
          <code> sm-nl-done</code>, <code>sm-nl-seen</code>) &mdash; <em>functional.</em> Remembers that
          you dismissed or completed the newsletter prompt so we do not show it again.
        </li>
        <li>
          <strong>Sign-in session</strong> (cookie <code>payload-token</code>) &mdash;{' '}
          <em>strictly necessary.</em> Set only if you sign in to a staff or affiliate account; it keeps
          you logged in. It is not set for ordinary visitors.
        </li>
      </ul>

      <h2>3. Third-party cookies</h2>
      <p>
        When you make a payment, you are taken to a checkout page hosted by our payment processor,{' '}
        <strong>Stripe</strong>. Stripe sets its own cookies on its own pages to process the payment
        securely and prevent fraud. Those cookies are governed by{' '}
        <a href="https://stripe.com/privacy" rel="noopener noreferrer" target="_blank">Stripe&rsquo;s
        privacy policy</a>. We do not set advertising or social-media cookies.
      </p>

      <h2>4. Analytics and advertising</h2>
      <p>
        We do <strong>not</strong> currently use any analytics or advertising cookies or third-party
        tracking on the website. If we add analytics in the future, we will update this policy and, where
        the law requires it, ask for your consent (for example, through a cookie banner) before setting
        non-essential cookies.
      </p>

      <h2>5. How to control cookies</h2>
      <p>
        You can control or delete cookies through your browser settings, and clear local and session
        storage the same way. Because the items above are strictly necessary or functional, blocking them
        will not stop you browsing the site, but some features (such as remembering your theme, keeping
        you signed in, or crediting a referral) may not work as intended.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Cookie Policy as our practices change. When we do, we will update the
        &ldquo;Last updated&rdquo; date above.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about our use of cookies? Contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalDoc>
  );
}
