'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ value, label = 'Copy link' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard unavailable — no-op */
        }
      }}
      className="sm-cta-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {copied ? 'Copied' : label}
    </button>
  );
}
