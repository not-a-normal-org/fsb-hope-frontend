import type { Metadata } from 'next';

import LegalDoc from '@/components/site/LegalDoc';

/**
 * /legal/privacy — Privacy Policy. Grounded in the real data inventory: the
 * lead / newsletter / contact / application / alert / research forms, Stripe
 * payments (no card data stored by us), and the processors Supabase, Stripe,
 * Resend, Vercel. US (Wyoming) entity with GDPR + California sections. NOTE:
 * structure-reviewed, not legal advice — have counsel sign off before launch.
 */
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Saver Miles collects, uses, shares, and protects your personal information, the processors we use, and your privacy rights (including GDPR and California).',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 31, 2026';
const EMAIL = 'hello@savermiles.com';

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated={UPDATED}
      intro="This policy explains what personal information we collect, how we use and share it, and the choices and rights you have."
    >
      <p>
        <strong>Saver Miles LLC</strong>, a Wyoming limited liability company (&ldquo;Saver Miles,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us&rdquo;), is the controller of the personal information described in
        this policy. It applies to savermiles.com and the services we provide (the &ldquo;Services&rdquo;).
        By using the Services you agree to this policy.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information you give us</h3>
      <p>Depending on how you use the Services, we may collect:</p>
      <ul>
        <li>
          <strong>Search requests.</strong> When you request an individual or business award search, we
          collect your email, phone or WhatsApp number, the routes and dates you want, cabin and traveler
          count, the points or programs you hold, budget or spend, and any notes you add.
        </li>
        <li>
          <strong>Newsletter and alerts.</strong> Your email address, your home airport, and (for alert
          preferences) the routes you want watched.
        </li>
        <li>
          <strong>Contact and applications.</strong> Your name, email, phone, company details, business
          type, spend range, and any message or goals you send when you contact us or apply.
        </li>
        <li>
          <strong>Payments.</strong> When you pay, our payment processor, Stripe, collects your card
          details and billing information directly. <strong>We do not receive or store your full card
          number.</strong> We retain only Stripe identifiers, the amount, the plan, and status, and a
          billing email.
        </li>
        <li>
          <strong>Accounts.</strong> If you are a staff member or affiliate with a login, we hold your
          name, email, role, and (for affiliates) a referral code.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <p>
        When you visit the website, our hosting and infrastructure providers automatically process
        technical data such as your IP address, browser and device type, pages viewed, and timestamps,
        as part of delivering and securing the site. We also use a small number of cookies and
        browser-storage items, described in our{' '}
        <a href="/legal/cookies">Cookie Policy</a>. We do <strong>not</strong> currently use analytics or
        advertising cookies or third-party tracking pixels.
      </p>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To provide the Services: run searches, deliver results and alerts, and respond to you.</li>
        <li>To process payments and manage subscriptions (through Stripe).</li>
        <li>
          To send you transactional messages (confirmations, results, service notices) and, where you
          have signed up, our newsletter and marketing emails. You can unsubscribe from marketing at any
          time.
        </li>
        <li>To attribute a referral when you arrive through an affiliate link (see the Cookie Policy).</li>
        <li>To operate, secure, debug, and improve the Services and prevent fraud and abuse.</li>
        <li>To comply with legal obligations and enforce our terms.</li>
      </ul>

      <h2>3. Legal bases (EEA/UK visitors)</h2>
      <p>
        Where the GDPR or UK GDPR applies, we rely on: <strong>performance of a contract</strong> (to
        provide a search or subscription you request); <strong>consent</strong> (for marketing emails,
        which you can withdraw at any time); our <strong>legitimate interests</strong> (to operate,
        secure, and improve the Services and communicate with you); and <strong>legal obligation</strong>
        {' '}(for example, tax and accounting records).
      </p>

      <h2>4. How we share information</h2>
      <p>
        We do <strong>not</strong> sell your personal information. We share it only as needed to run the
        Services, with:
      </p>
      <ul>
        <li>
          <strong>Service providers (processors)</strong> who act on our instructions:
          {' '}<strong>Supabase</strong> (database and file storage), <strong>Stripe</strong> (payment
          processing), <strong>Resend</strong> (transactional and newsletter email delivery), and{' '}
          <strong>Vercel</strong> (website hosting). Each receives only the data needed for its function.
        </li>
        <li>
          <strong>Affiliates.</strong> If you arrive through an affiliate link, we attribute your inquiry
          to that affiliate; affiliates see limited information about referred inquiries, not your full
          record.
        </li>
        <li>
          <strong>Legal and safety.</strong> Where required by law, legal process, or to protect the
          rights, safety, and property of Saver Miles, our users, or others.
        </li>
        <li>
          <strong>Business transfers.</strong> In connection with a merger, acquisition, financing, or
          sale of assets, subject to this policy.
        </li>
      </ul>

      <h2>5. International transfers</h2>
      <p>
        We are based in the United States and our providers may process data in the United States and
        other countries. Where we transfer personal information from the EEA, UK, or Switzerland, we rely
        on appropriate safeguards such as the European Commission&rsquo;s Standard Contractual Clauses.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We keep personal information for as long as needed to provide the Services, maintain our business
        records, comply with legal obligations, resolve disputes, and enforce our agreements. Newsletter
        subscriptions are kept until you unsubscribe (which marks you inactive). You can ask us to delete
        your information as described below, subject to legal exceptions.
      </p>

      <h2>7. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect personal information,
        including encrypted connections and access controls, and we rely on established providers
        (Supabase, Stripe, Resend, Vercel) with their own security programs. No method of transmission or
        storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>8. Your rights and choices</h2>
      <p>
        You can unsubscribe from marketing email at any time using the link in the email or by contacting
        us. Depending on where you live, you may have additional rights:
      </p>
      <h3>EEA / UK (GDPR)</h3>
      <p>
        You have the right to access, correct, delete, restrict, or object to processing of your personal
        data, to data portability, and to withdraw consent at any time. You also have the right to lodge
        a complaint with your data-protection authority.
      </p>
      <h3>California (CCPA/CPRA)</h3>
      <p>
        You have the right to know what personal information we collect and how we use and share it, to
        request deletion or correction, and to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo;
        of personal information. <strong>We do not sell or share your personal information</strong> as
        those terms are defined under California law. We will not discriminate against you for exercising
        your rights.
      </p>
      <p>
        To exercise any of these rights, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We may need
        to verify your identity before acting on a request.
      </p>

      <h2>9. Children</h2>
      <p>
        The Services are intended for adults and are not directed to children. We do not knowingly
        collect personal information from anyone under 18 (or under 16 in the EEA/UK). If you believe a
        child has provided us information, contact us and we will delete it.
      </p>

      <h2>10. Third-party links</h2>
      <p>
        Our website and emails may link to third-party sites (for example, airline or loyalty-program
        pages). Their privacy practices are their own, and we are not responsible for them. Review their
        policies before providing information.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will change the &ldquo;Last
        updated&rdquo; date above and, where appropriate, provide additional notice.
      </p>

      <h2>12. Contact us</h2>
      <p>
        For any privacy question or to exercise your rights, contact <strong>Saver Miles LLC</strong> at{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Registered address: [registered address to be completed].
      </p>
    </LegalDoc>
  );
}
