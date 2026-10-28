'use client';

interface Subscriber {
  email: string;
  full_name: string | null;
  subscribed_at: string | null;
}

export function ExportCSVButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    const header = 'email,name,subscribed_at\n';

    const rows = subscribers.map((s) => {
      // Wrap each field in double-quotes and escape any internal double-quotes
      const email  = `"${s.email.replace(/"/g, '""')}"`;
      const name   = `"${(s.full_name ?? '').replace(/"/g, '""')}"`;
      const date   = `"${s.subscribed_at ?? ''}"`;
      return [email, name, date].join(',');
    });

    const csv  = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    const anchor       = document.createElement('a');
    anchor.href        = url;
    anchor.download    = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      disabled={subscribers.length === 0}
      className="
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
        border border-[#1E2538] text-[#9DA3B4]
        hover:border-[#E8963A]/40 hover:text-[#E8963A]
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors duration-150
      "
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1v8M4 6l3 3 3-3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Export CSV ({subscribers.length})
    </button>
  );
}
