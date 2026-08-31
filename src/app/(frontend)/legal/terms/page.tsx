import type { Metadata } from 'next';

import LegalDoc from '@/components/site/LegalDoc';

/**
 * /legal/terms — Terms & Conditions. Grounded in the real fee model
 * (src/lib/products.ts) and the manual-search service. Refund/cancellation and
 * the illustrative-figures disclaimer are folded in as sections. US (Wyoming)
 * governing law. Entity: Saver Miles LLC. NOTE: reviewed for structure, not a
 * substitute for legal counsel — have a lawyer sign off before launch.
 */
export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'The terms that govern SaverMiles award-search and alert services: fees, the deposit and success fee, refunds and cancellations, and the limits of what we do.',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 31, 2026';
const EMAIL = 'hello@savermiles.com';

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms & Conditions"
      updated={UPDATED}
      intro="These terms explain how our award-search and alert services work, what they cost, and the limits of what we can promise. Please read them before engaging us."
    >
      <p>
        These Terms &amp; Conditions (the &ldquo;Terms&rdquo;) are a binding agreement between you
        and <strong>Saver Miles LLC</strong>, a Wyoming limited liability company (&ldquo;SaverMiles,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to and use of the
        website at savermiles.com and the services we provide (together, the &ldquo;Services&rdquo;). By
        using the Services, requesting a search, subscribing to an alert, or making a payment, you agree
        to these Terms. If you do not agree, do not use the Services.
      </p>

      <h2>1. Who we are, and what the Services are</h2>
      <p>
        SaverMiles is a manual, human-run points-and-miles concierge. A specialist searches award
        availability by hand across loyalty programs and transfer partners and reports what is bookable
        with the points you already hold, together with the point cost and the steps to book. We offer
        one-off searches (for individuals and for businesses) and ongoing route alerts.
      </p>
      <p>
        We are an independent service. We are <strong>not</strong> a travel agency of record, an airline,
        a bank, a card issuer, or a loyalty program, and we are not affiliated with, endorsed by, or
        acting on behalf of any of them. In most cases <strong>you</strong> hold and control your own
        loyalty and card accounts, and you complete any points transfer and the final booking yourself
        using the instructions we provide. Where a program requires it, the booking is yours to make.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and able to form a binding contract to use the Services. By
        using the Services you represent that you meet these requirements and that the information you
        provide is accurate and your own (or that you are authorized to provide it).
      </p>

      <h2>3. Fees and payment</h2>
      <p>Our current fees are set out on our pricing page and summarized here:</p>
      <ul>
        <li>
          <strong>Individual search.</strong> A <strong>$25 deposit</strong> to begin, plus a{' '}
          <strong>$99 success fee</strong> per person, per direction, charged only when we confirm a
          seat you can book that meets the criteria you gave us. The success fee is the same for any
          cabin.
        </li>
        <li>
          <strong>Business search.</strong> A <strong>flat $25 per search</strong>, charged once when
          you submit the request. Invoiced per search, never per seat.
        </li>
        <li>
          <strong>Weekly Lookup Alert.</strong> A subscription (currently $4.99/month or the stated
          annual rate) delivering an automated weekly scan of your routes.
        </li>
        <li>
          <strong>Human Search Alert.</strong> A subscription (currently $99.99/month or the stated
          annual rate) in which a specialist checks your routes each cycle.
        </li>
      </ul>
      <p>
        Payments are processed by our payment provider, Stripe. By providing a payment method you
        authorize us (through Stripe) to charge the applicable fees, including recurring subscription
        fees until you cancel. Fees are stated in US dollars and exclude any taxes, which are your
        responsibility. We may change our fees prospectively; the fees that apply to you are those shown
        at the time you engage a search or start or renew a subscription.
      </p>

      <h3>3.1 When the success fee is earned</h3>
      <p>
        For an individual search, the success fee is <strong>earned and payable when we deliver a
        bookable award option that meets the criteria you agreed to</strong> &mdash; even if you then
        choose not to book it, book a different itinerary, pay cash instead, or delay past the point
        where the space is still available. Award space is time-sensitive and controlled by third
        parties; we cannot hold it for you, and we are compensated for the search work once a qualifying
        result is delivered. If you change your criteria (dates, routes, travelers, cabin, or points
        available) after we have delivered results, that is treated as a new search and may incur a new
        fee.
      </p>

      <h2>4. Refunds and cancellations</h2>
      <ul>
        <li>
          <strong>The individual deposit is refundable if we find nothing bookable.</strong> If we
          cannot find an award option that meets your criteria, your <strong>$25 deposit is refunded in
          full</strong>. Once we have delivered a qualifying bookable result, the search work is
          complete and the deposit is applied to your search rather than refunded.
        </li>
        <li>
          <strong>Business search fees</strong> are charged for the work of the search and are not
          refundable once the search has been performed.
        </li>
        <li>
          <strong>Subscriptions</strong> (alerts) renew automatically until cancelled. You may cancel at
          any time through the billing portal or by contacting us; cancellation stops future renewals
          and your access continues through the end of the period you have already paid for. Except where
          required by law, subscription fees already charged are not refunded on a partial-period basis.
        </li>
        <li>
          Nothing in this section limits any non-waivable refund or cancellation right you may have under
          applicable consumer-protection law.
        </li>
      </ul>

      <h2>5. No guarantee of availability</h2>
      <p>
        Award availability is set and controlled entirely by airlines, hotels, and loyalty programs, not
        by us. It is limited, changes constantly, and can disappear between the moment it is found and
        the moment you book. Accordingly, we do <strong>not</strong> guarantee that any particular award
        space exists, that it will remain available until you book, or that a specific airline, aircraft,
        cabin, seat, route, or time will be obtainable. Availability shown by automated tools (including
        our Weekly Lookup Alert) may be &ldquo;phantom&rdquo; space that a program displays but will not
        confirm. We present the best options we can find and verify; the final booking, and its timing,
        is yours.
      </p>

      <h2>6. Your responsibilities</h2>
      <ul>
        <li>Provide accurate, complete information, and keep your points balances and travel needs current.</li>
        <li>
          Keep control of your own loyalty and card accounts. <strong>We never ask for your account
          passwords</strong>, and you should never share them. Where a transfer or booking must be made
          from your account, you make it, following the steps we provide.
        </li>
        <li>
          Pay any airline taxes, carrier-imposed surcharges, and other third-party charges associated
          with a booking.
        </li>
        <li>
          Ensure you meet all travel-document, passport, visa, health, and entry requirements for your
          trip. We are not responsible for these and do not advise on them.
        </li>
        <li>Comply with the terms of the loyalty programs, airlines, and card issuers you use.</li>
      </ul>

      <h2>7. Third-party programs, airlines, and services</h2>
      <p>
        Your loyalty accounts, points, transfers, and bookings are governed by the terms of the relevant
        program, airline, or card issuer. Those third parties may change award charts, transfer ratios,
        rules, or availability; may impose surcharges; may change or cancel flights; and may suspend,
        close, or seize accounts or miles, all outside our control. We are not responsible or liable for
        their acts, omissions, changes, or decisions. Our Services may rely on third-party providers
        (for example, hosting, payment, email, and data storage); their availability is not guaranteed.
      </p>

      <h2>8. Illustrative figures; not financial, tax, or travel advice</h2>
      <p>
        Point valuations, sample award prices, ranges, and examples shown on our website, in our blog, in
        our calculator, and in our communications are <strong>illustrative and educational only</strong>.
        They are not offers, quotes, guarantees, or a live availability feed, and they change frequently.
        Nothing we provide is financial, tax, accounting, legal, or professional travel advice. You are
        responsible for your own decisions and should consult a qualified professional where appropriate.
      </p>

      <h2>9. Acceptable use</h2>
      <p>
        You agree not to misuse the Services: no unlawful, fraudulent, or infringing activity; no
        attempts to disrupt, reverse-engineer, or gain unauthorized access to the Services; no scraping
        or bulk extraction except as expressly permitted; and no use that violates the rights of others
        or the terms of any loyalty program. We may suspend or terminate access for conduct that, in our
        reasonable judgment, violates these Terms or harms the Services or others.
      </p>

      <h2>10. Intellectual property</h2>
      <p>
        The website, its content, branding, and the SaverMiles name and marks are owned by us or our
        licensors and are protected by intellectual-property laws. We grant you a limited, personal,
        non-exclusive, non-transferable license to use the website for its intended purpose. You may not
        copy, reproduce, republish, or exploit our content except as expressly permitted or with our
        prior written consent.
      </p>

      <h2>11. Disclaimers</h2>
      <p>
        The Services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without
        warranties of any kind, whether express, implied, or statutory, including any implied warranties
        of merchantability, fitness for a particular purpose, title, and non-infringement, to the fullest
        extent permitted by law. We do not warrant that the Services will be uninterrupted, error-free,
        or that any result, saving, availability, or booking will be achieved.
      </p>

      <h2>12. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, SaverMiles and its members, officers, employees, and
        contractors will not be liable for any indirect, incidental, special, consequential, punitive, or
        exemplary damages, or for lost profits, points, miles, travel, opportunities, or data, arising out
        of or relating to the Services, even if advised of the possibility. Our total aggregate liability
        for any claim arising out of or relating to the Services will not exceed the amount of fees you
        actually paid us for the specific search or, for subscriptions, in the three months preceding the
        event giving rise to the claim. Some jurisdictions do not allow certain limitations, so parts of
        this section may not apply to you.
      </p>

      <h2>13. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless SaverMiles and its members, officers, employees, and
        contractors from any claims, damages, losses, liabilities, and expenses (including reasonable
        legal fees) arising out of your misuse of the Services, your violation of these Terms, or your
        violation of any law or third-party right, including the terms of any loyalty program.
      </p>

      <h2>14. Changes to the Services and these Terms</h2>
      <p>
        We may modify, suspend, or discontinue any part of the Services at any time. We may also update
        these Terms; when we do, we will change the &ldquo;Last updated&rdquo; date above and, where
        appropriate, provide additional notice. Your continued use of the Services after an update means
        you accept the revised Terms.
      </p>

      <h2>15. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the State of Wyoming, USA, without regard to its
        conflict-of-laws rules. Before filing any formal claim, you agree to contact us first at{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> so we can try to resolve the matter informally. Any
        dispute that cannot be resolved informally will be subject to the exclusive jurisdiction of the
        state and federal courts located in Wyoming, and you consent to venue there, except where
        applicable law grants you the right to bring a claim elsewhere.
      </p>

      <h2>16. General</h2>
      <p>
        If any provision of these Terms is found unenforceable, the remaining provisions stay in effect.
        Our failure to enforce a provision is not a waiver. You may not assign these Terms without our
        consent; we may assign them in connection with a merger, acquisition, or sale of assets. These
        Terms are the entire agreement between you and us regarding the Services. We are not liable for
        delays or failures caused by events beyond our reasonable control.
      </p>

      <h2>17. Contact</h2>
      <p>
        Questions about these Terms? Contact <strong>Saver Miles LLC</strong> at{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Registered address: [registered address to be completed].
      </p>
    </LegalDoc>
  );
}
