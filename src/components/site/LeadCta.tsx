'use client';

import { useState, type ReactNode } from 'react';

import LeadModal from './LeadModal';
import type { LeadType } from './LeadForm';

/**
 * A call-to-action that opens the lead popup in place, instead of sending the
 * visitor to another page first. Styling comes from the caller (`sm-cta` etc.),
 * so it drops in wherever a CTA link used to sit.
 *
 * Leave `type` off for the general "Get started" entry: the popup then asks
 * "individual or business?" before the form. Pass it where the page already
 * answers that.
 *
 * Each instance owns its popup. NavBar doesn't use this — its popup has to
 * outlive the mobile menu that can open it, so NavBar holds that state itself.
 */
export default function LeadCta({
  children,
  className = '',
  type,
}: {
  children: ReactNode;
  className?: string;
  type?: LeadType;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`cursor-pointer ${className}`}
      >
        {children}
      </button>
      <LeadModal open={open} onClose={() => setOpen(false)} type={type} />
    </>
  );
}
