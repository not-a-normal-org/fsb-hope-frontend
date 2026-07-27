'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch('/api/account/logout', { method: 'POST' });
        // Full navigation so the proxy re-evaluates without the session cookie.
        window.location.assign('/login');
      }}
      className="sm-cta-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:opacity-55"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
