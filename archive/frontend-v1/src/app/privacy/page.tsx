import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PointIQ',
  description:
    'How PointIQ collects, uses, and protects your personal information.',
};

const LAST_UPDATED = '8 June 2026';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: '1. Introduction',
    body: [
      'This Privacy Policy explains how PointIQ ("we", "us", "our") collects, uses, discloses, and protects your personal information when you visit our website, apply for membership, or use our concierge services.',
      'By using our website or services you consent to the practices described in this policy. This is a placeholder document and should be reviewed by legal counsel before launch.',
    ],
  },
  {
    heading: '2. Information We Collect',
    body: [
      'We may collect information you provide directly, such as your name, email address, phone number, business details, and payment information when you apply for membership or book a concierge service.',
      'We also automatically collect certain technical information, including your IP address, browser type, device information, and usage data, through cookies and similar technologies.',
    ],
  },
  {
    heading: '3. How We Use Your Information',
    body: [
      'We use your information to provide and improve our services, process applications and payments, communicate with you about your membership, respond to enquiries, and send relevant updates where you have opted in.',
      'We may also use aggregated, de-identified data for analytics and to improve the performance of our website.',
    ],
  },
  {
    heading: '4. How We Share Your Information',
    body: [
      'We do not sell your personal information. We may share it with trusted service providers (such as payment processors and email providers) who assist us in operating our business, and where required by law.',
    ],
  },
  {
    heading: '5. Data Security & Retention',
    body: [
      'We take reasonable steps to protect your personal information from misuse, loss, unauthorised access, and disclosure. We retain your information only for as long as necessary to fulfil the purposes described in this policy or as required by law.',
    ],
  },
  {
    heading: '6. Your Rights',
    body: [
      'You may request access to, correction of, or deletion of your personal information at any time. To make a request, please contact us using the details below.',
    ],
  },
  {
    heading: '7. Contact Us',
    body: [
      'If you have any questions about this Privacy Policy or how we handle your personal information, please contact us via our contact page.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="w-full">
      <section className="pt-32 pb-24 bg-bg-primary">
        <div className="max-w-3xl mx-auto px-6 lg:px-16">
          <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary mb-4">
            Privacy Policy
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
