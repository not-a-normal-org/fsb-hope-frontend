import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — PointIQ',
  description:
    'The terms and conditions governing your use of PointIQ website, membership, and concierge services.',
};

const LAST_UPDATED = '8 June 2026';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: '1. Agreement to Terms',
    body: [
      'These Terms of Service ("Terms") govern your access to and use of the website, membership, and concierge services provided by PointIQ ("we", "us", "our"). By accessing our website or purchasing a membership or service, you agree to be bound by these Terms.',
      'This is a placeholder document and should be reviewed by legal counsel before launch.',
    ],
  },
  {
    heading: '2. Membership & Eligibility',
    body: [
      'Membership is offered at our discretion and may be subject to application and approval. You must provide accurate and complete information when applying and keep your account details up to date.',
      'Membership tiers, benefits, and pricing are described on our website and may be updated from time to time.',
    ],
  },
  {
    heading: '3. Fees & Payment',
    body: [
      'Membership fees and concierge service fees are billed as described at the point of purchase. Recurring memberships renew automatically unless cancelled in accordance with these Terms.',
      'All fees are stated in US Dollars (USD) unless otherwise noted and are processed securely through our payment provider.',
    ],
  },
  {
    heading: '4. Refunds & Cancellations',
    body: [
      'Memberships include a 30-day satisfaction review: if we have not delivered value in the first 30 days, we will refund your membership fee. Concierge service fees are subject to the cancellation terms provided at the time of booking.',
    ],
  },
  {
    heading: '5. Services & No Guarantee',
    body: [
      'Our concierge and points services are subject to availability of seats, fares, and points programs operated by third parties. While we use our expertise to secure the best outcomes, availability and pricing are outside our control and are not guaranteed unless expressly stated for a given tier.',
    ],
  },
  {
    heading: '6. Acceptable Use',
    body: [
      'You agree not to misuse our website or services, including by attempting to gain unauthorised access, interfering with the operation of the site, or using our services for any unlawful purpose.',
    ],
  },
  {
    heading: '7. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential loss arising from your use of our website or services. Nothing in these Terms excludes rights you may have under the Australian Consumer Law.',
    ],
  },
  {
    heading: '8. Changes & Contact',
    body: [
      'We may update these Terms from time to time. Continued use of our services after changes take effect constitutes acceptance of the revised Terms. If you have any questions, please contact us via our contact page.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="w-full">
      <section className="pt-32 pb-24 bg-bg-primary">
        <div className="max-w-3xl mx-auto px-6 lg:px-16">
          <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-text-muted text-sm mb-12">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-bold text-text-primary mb-3">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-text-secondary leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
