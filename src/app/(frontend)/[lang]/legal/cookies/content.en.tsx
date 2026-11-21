import Link from '@/components/system/LocaleLink';
import type { LegalContent } from '@/components/site/LegalDoc';
import { SITE_EMAIL } from '@/lib/constants';

const EMAIL = SITE_EMAIL;

function Body() {
  return (
    <>
      <p>
        This Cookie Policy describes how <strong>Saver Miles LLC</strong> (&ldquo;Saver Miles,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us&rdquo;) uses cookies and similar browser-storage technologies on
        savermiles.com. It should be read together with our{' '}
        <Link href="/legal/privacy">Privacy Policy</Link>. Any translation of this policy is provided for
        convenience only; if it differs from this English version, the English version governs.
      </p>

      <h2>1. What cookies and browser storage are</h2>
      <p>
        Cookies are small text files a website stores in your browser. Related technologies,
        &ldquo;local storage&rdquo; and &ldquo;session storage,&rdquo; let a site remember small pieces
        of information on your device. They can be <em>strictly necessary</em> (needed for the site to
        work), <em>functional</em> (remembering your preferences), or used for <em>analytics</em> or{' '}
        <em>advertising</em>. We use strictly-necessary and functional items, two <em>analytics</em>{' '}
        tools (Google Analytics and Microsoft Clarity) to measure aggregate traffic and see how pages are
        used, and one <em>advertising</em> tool, Google Ads, to measure which of our ads lead to search
        requests and to show our ads to people who have visited our site (&ldquo;remarketing&rdquo;).
      </p>
      <p>
        <strong>Where you are decides the default.</strong> If you are in the European Economic Area,
        the United Kingdom, or Switzerland, no analytics or advertising cookie is set until you click
        &ldquo;Accept&rdquo; in the cookie banner. Everywhere else, Google Analytics and Google Ads are on
        by default and you can turn them off at any time by clicking &ldquo;Decline&rdquo; (or, later,
        &ldquo;Cookie preferences&rdquo; in the footer). Microsoft Clarity is never loaded unless you click
        &ldquo;Accept&rdquo;, wherever you are. If your browser sends a Global Privacy Control signal, we
        never use remarketing for you.
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
          <strong>Language preference</strong> (cookie <code>sm-locale</code>, 1 year) &mdash;{' '}
          <em>functional.</em> Set only when you choose a language in the language switcher. It
          remembers that choice (English or German) so we show the site in that language rather than the
          one we would otherwise pick from your approximate location. It is a first-party cookie
          (<code>SameSite=Lax</code>).
        </li>
        <li>
          <strong>Cookie choice</strong> (local storage <code>sm-consent-v2</code>, and the older{' '}
          <code>sm-consent</code>) &mdash; <em>strictly necessary.</em> Remembers whether you accepted or
          declined analytics and advertising in the cookie banner, so we respect that choice and do not ask
          again on every page.
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
        <li>
          <strong>Analytics</strong> (cookies <code>_ga</code> and <code>_ga_&lt;id&gt;</code>, set by
          Google Analytics, up to about 13 months) &mdash; <em>analytics.</em> These help us measure
          aggregate traffic: how many people visit, which pages and articles are read, and broadly
          where visitors arrive from, including from our ads. They do not tell us who you are. See
          section 4 for how to opt out.
        </li>
        <li>
          <strong>Advertising</strong> (cookies <code>_gcl_au</code>, <code>_gcl_aw</code> and similar{' '}
          <code>_gcl_*</code> cookies, set by Google Ads on savermiles.com, about 90 days; and, where
          remarketing is allowed, Google&rsquo;s own advertising cookies on its domains, such as{' '}
          <code>IDE</code> on <code>doubleclick.net</code>) &mdash; <em>advertising.</em> These record that
          you arrived from one of our ads and whether you went on to send a search request, so we can tell
          which ads work, and let Google show our ads to people who have visited our site. See section 4.
        </li>
        <li>
          <strong>Ad-click attribution</strong> (cookie <code>sm_gclick</code>, 90 days) &mdash;{' '}
          <em>advertising.</em> If you arrive by clicking one of our Google ads, this first-party cookie
          remembers that click&rsquo;s ID, so that if you request a search we can later report a payment to
          Google Ads as coming from that ad. It is never set for visitors in the EEA, UK, or Switzerland,
          and it is deleted when you click &ldquo;Decline&rdquo;.
        </li>
        <li>
          <strong>Product analytics and session replay</strong> (cookies <code>_clck</code> and{' '}
          <code>_clsk</code>, set by Microsoft Clarity, plus the Microsoft cookies{' '}
          <code>CLID</code>, <code>ANONCHK</code>, <code>MR</code>, <code>MUID</code> and{' '}
          <code>SM</code> on the <code>clarity.ms</code> domain) &mdash; <em>analytics.</em> These are
          set <strong>only if you accept</strong> in the cookie banner; decline and Clarity is never
          loaded at all. They let us see which parts of a page people actually use, and replay an
          anonymized reconstruction of a visit so we can find what confused someone. See section 4.
        </li>
      </ul>

      <h2>3. Third-party cookies</h2>
      <p>
        When you make a payment, you are taken to a checkout page hosted by our payment processor,{' '}
        <strong>Stripe</strong>. Stripe sets its own cookies on its own pages to process the payment
        securely and prevent fraud. Those cookies are governed by{' '}
        <a href="https://stripe.com/privacy" rel="noopener noreferrer" target="_blank">Stripe&rsquo;s
        privacy policy</a>. Google sets the advertising cookies described in sections 2 and 4. We use no
        social-media cookies.
      </p>

      <h2>4. Analytics and advertising</h2>
      <p>
        We use <strong>Google Analytics 4</strong>, a web-analytics service provided by Google, to
        understand how the website is used in aggregate so we can improve it. Google Analytics sets the
        cookies listed above (<code>_ga</code> and <code>_ga_&lt;id&gt;</code>) and processes usage data
        such as pages viewed, approximate location (derived from a truncated IP address, not stored), and
        device and browser type. It is linked to our Google Ads account so we can see which ads bring
        visitors. We do not sell this data. Google&rsquo;s handling of the data is governed by{' '}
        <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Google&rsquo;s
        privacy policy</a>.
      </p>
      <p>
        We use <strong>Google Ads</strong> to advertise Saver Miles in Google search results and to
        measure whether those ads work. When you arrive from one of our ads, Google Ads records the click;
        if you then send a search request, it records that as a conversion. To match the request to the
        ad, the page passes the email address and phone number you entered to Google&rsquo;s tag, which
        hashes them (turns them into a code that cannot be read back) in your browser before sending them
        (&ldquo;enhanced conversions&rdquo;); it does this only if advertising is allowed for you. Where
        remarketing is allowed, Google also uses its cookies to show our ads to people who have visited
        our site, on Google services and partner sites. Google may use your IP address to estimate your
        general location and to measure ad conversions. You can read{' '}
        <a href="https://business.safety.google/privacy/" rel="noopener noreferrer" target="_blank">how
        Google uses information from sites that use its services</a>.
      </p>
      <p>You can turn off Google Analytics and Google Ads at any time:</p>
      <ul>
        <li>
          Click &ldquo;Decline&rdquo; in the cookie banner, or &ldquo;Cookie preferences&rdquo; in the
          footer and then &ldquo;Decline&rdquo;. This turns off analytics, ad measurement and remarketing
          on this site and deletes our ad-click cookie.
        </li>
        <li>
          Turn on Global Privacy Control in your browser: we treat it as an opt-out of remarketing.
        </li>
        <li>
          Manage the ads Google shows you in{' '}
          <a href="https://myadcenter.google.com/" rel="noopener noreferrer" target="_blank">My Ad Center</a>,
          or install the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank">Google
          Analytics Opt-out Browser Add-on</a>, which stops Google Analytics on every site you visit.
        </li>
        <li>
          Block or delete the <code>_ga</code> and <code>_gcl</code> cookies through your browser settings
          (see section 5).
        </li>
      </ul>
      <p>
        We also use <strong>Microsoft Clarity</strong>, a product-analytics service provided by
        Microsoft, to see how pages are used: aggregate heatmaps of clicks and scrolling, and session
        replay, which reconstructs a visit as a sequence of interactions (pages, clicks, scrolls, mouse
        movement) rather than recording your screen. Clarity masks text entered into form fields, and we
        use it for usability only: we do <strong>not</strong> use it for advertising or ad
        personalization, and we do not sell or share this data. Microsoft&rsquo;s handling of the data is
        governed by the{' '}
        <a href="https://privacy.microsoft.com/privacystatement" rel="noopener noreferrer" target="_blank">Microsoft
        privacy statement</a>.
      </p>
      <p>
        Clarity is loaded <strong>only after you accept analytics</strong> in the cookie banner. If you
        decline, the Clarity script is never requested and none of its cookies are set. If you accept and
        later change your mind, use &ldquo;Cookie preferences&rdquo; in the footer and decline: we tell
        Clarity to erase its cookies and end the session.
      </p>
      <p>
        We use no social-media tracking cookies. In the EEA, UK, and Switzerland, where the law requires
        consent before non-essential cookies are set, the analytics and advertising cookies above are set
        only after you click &ldquo;Accept&rdquo;, and you can withdraw that consent at any time the same
        way you gave it.
      </p>

      <h2>5. How to control cookies</h2>
      <p>
        You can control or delete cookies through your browser settings, and clear local and session
        storage the same way. Blocking analytics and advertising cookies has no effect on what you can
        do on the site. Blocking the strictly-necessary or functional items will not stop you browsing
        either, but some features (such as remembering your theme or language, keeping you signed in, or
        crediting a referral) may not work as intended.
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
    </>
  );
}

const cookies: LegalContent = {
  title: 'Cookie Policy',
  description:
    'The cookies and browser storage Saver Miles uses, including Google Analytics, Google Ads and Microsoft Clarity, and how to turn them off.',
  intro:
    'This policy explains the cookies and browser storage our website uses, what they do, and how you can control them.',
  Body,
};

export default cookies;
