import { createClient } from '@supabase/supabase-js';

/**
 * ⚠️  ADMIN CLIENT — SERVER-SIDE ONLY.
 *
 * Uses the service-role key which bypasses ALL Row Level Security policies.
 * This client has unrestricted read/write access to every table.
 *
 * NEVER import this file in a Client Component or any file that is
 * bundled for the browser. Exposing the service-role key client-side
 * would give any visitor full admin access to your database.
 *
 * Safe usage: Server Actions, API route handlers (/app/api/*), and
 * background scripts that run exclusively on the server.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      // Disable automatic session persistence — the admin client acts as a
      // service account, not on behalf of any individual user.
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
