'use client';

import { useId, useRef } from 'react';
import { Eye, X } from 'lucide-react';

import type { LeadViewSection } from '@/lib/leads';

/**
 * Read-only "view lead" control: an eye-icon button that opens every stored
 * answer for a lead in a native <dialog> (focus trap, Escape, and focus return
 * come from the platform). The sections are formatted server-side by
 * describeLead(), so this component never decides what a viewer may see.
 *
 * The admin console (fixed dark palette) and the portal (themed tokens) look
 * different, so each caller passes its own `skin` of class names rather than this
 * shared component hardcoding either.
 */
export type LeadDialogSkin = {
  trigger: string;
  /** Panel surface + text color, including the ::backdrop (via `backdrop:` classes). */
  panel: string;
  meta: string;
  sectionTitle: string;
  label: string;
  value: string;
  divider: string;
  close: string;
};

export default function LeadDetailsButton({
  heading,
  meta,
  sections,
  skin,
}: {
  heading: string;
  meta?: string;
  sections: LeadViewSection[];
  skin: LeadDialogSkin;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={`View details for ${heading}`}
        title="View details"
        className={skin.trigger}
      >
        <Eye className="h-4 w-4" aria-hidden />
      </button>

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        // A click on the backdrop lands on the <dialog> itself; the inner panel covers the box.
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        className={`m-auto max-h-[88vh] w-[min(38rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl p-0 ${skin.panel}`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id={titleId} className="break-words text-base font-semibold leading-snug">
                {heading}
              </h2>
              {meta && <p className={`mt-1 text-xs ${skin.meta}`}>{meta}</p>}
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${skin.close}`}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="mt-2">
            {sections.map((section) => (
              <section key={section.title} className={`mt-4 border-t pt-4 ${skin.divider}`}>
                <h3 className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${skin.sectionTitle}`}>
                  {section.title}
                </h3>
                <dl className="mt-3 grid gap-x-5 gap-y-2.5 text-sm sm:grid-cols-[9rem_1fr]">
                  {section.rows.map((row) => (
                    <div key={row.label} className="contents">
                      <dt className={`text-xs sm:pt-0.5 ${skin.label}`}>{row.label}</dt>
                      <dd className={`mb-1.5 whitespace-pre-wrap break-words sm:mb-0 ${skin.value}`}>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
