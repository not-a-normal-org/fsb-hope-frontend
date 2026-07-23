# Maintenance mode

**Temporary.** The public site is walled off behind an under-construction
notice until launch. Admins sign in to see through the wall. Delete all of it
at launch — the removal checklist is at the bottom.

("Maintenance mode" is the internal name for the mechanism, the standard term
for a 503 wall. Nothing a visitor sees uses that word: the notice and the
crawler-facing 503s all say *under construction*.)

## Behaviour

| Request | Response |
|---|---|
| Anonymous → any page | `503` + the maintenance notice, at the URL they asked for |
| Anonymous → `/api/*` | `503` JSON |
| Anonymous → `/admin/*` | `307` → `/admin/login` |
| Anonymous → `/api/admin/*` | `401` JSON |
| Admin → anything | The real site |
| **Stripe → `/api/webhooks/stripe`** | **Always through — never walled** |

## How to get in

Open the site, click **Admin sign in** at the bottom of the notice, enter
`ADMIN_SECRET`. It posts to the existing `/api/admin/login`, so there is one
password and one cookie for both the wall and the admin portal — signing in
here also signs you into `/admin`.

The cookie is `admin_token`: httpOnly, `sameSite: lax`, 24-hour expiry,
`secure` in production. It expires after a day; sign in again.

To sign out, `POST /api/admin/logout`.

## Why the webhook is exempt

Stripe cannot present a cookie. `/api/webhooks/stripe` authenticates itself by
verifying the signature (`stripe.webhooks.constructEvent`), so it is not
unprotected — it uses a different mechanism.

Walling it off would have been silent and expensive: Stripe would receive
503s, retry for days, then drop the events. Payments would keep succeeding
while our database quietly stopped hearing about them. Any future change to
the wall must keep `ALWAYS_OPEN` intact.

## Why 503 and not a redirect

The proxy **rewrites** to `/maintenance` rather than redirecting: the visitor
keeps their URL, and the response carries `503` + `Retry-After`. A 200 would
invite crawlers to index the notice as the site's real content and blow away
existing rankings; a redirect would rewrite every URL in their index. The page
also sets `robots: noindex, nofollow`, and responses are `Cache-Control:
no-store` so no CDN pins the notice in place after the wall comes down.

## Switching it off

`MAINTENANCE_MODE=off` disables the wall without a deploy.

It is **on by default** — a deploy that forgets the variable fails closed
(public sees the notice) rather than open (public sees a half-built site).

While building the new frontend, put `MAINTENANCE_MODE=off` in `.env.local` so
you are not signing in constantly.

## Files

| File | Role |
|---|---|
| [`src/lib/maintenance.ts`](../src/lib/maintenance.ts) | Flag, cookie name, `isAdminToken()` |
| [`src/app/maintenance/page.tsx`](../src/app/maintenance/page.tsx) | The notice |
| [`src/app/maintenance/AdminUnlockForm.tsx`](../src/app/maintenance/AdminUnlockForm.tsx) | Unlock form |
| [`src/proxy.ts`](../src/proxy.ts) | The wall + the pre-existing admin gate |

`src/lib/maintenance.ts` is imported by `src/proxy.ts`, which runs in the edge
runtime. It must stay free of `server-only`, `next/headers`, and Node
built-ins.

### Two things that were fixed along the way

**`isAdminToken()` checks that `ADMIN_SECRET` exists.** The previous
`token !== process.env.ADMIN_SECRET` comparison passed when *both* sides were
`undefined` — an environment missing the secret treated every anonymous
visitor as an admin. Keep the presence check when this code is removed.

**The proxy matcher is now a catch-all**, which still covers `/admin/*` and
`/api/admin/*`. The old matcher listed both explicitly. If you narrow it during
removal, keep both prefixes: `/api/admin/*` is **not** covered by
`/admin/:path*`, and a version that matched only the latter leaked customer PII
from `applications-data` and `products-data`.

## Removal checklist

1. Delete `src/lib/maintenance.ts` and `src/app/maintenance/`.
2. In `src/proxy.ts`: drop the maintenance branch, the `ADMIN_COOKIE` /
   `MAINTENANCE_ENABLED` / `isAdminToken` import, and `/maintenance` from
   `PUBLIC_PATHS`. **Keep** `ALWAYS_OPEN`, the admin gate, and the
   `ADMIN_SECRET` presence check (inline it).
3. Restore the matcher to `['/admin/:path*', '/api/admin/:path*']` — the wall
   is the only reason it runs site-wide.
4. Remove `MAINTENANCE_MODE` from all environments.
5. Drop `robots: "noindex, nofollow"` from `src/app/layout.tsx` and add the real
   routes to `src/app/sitemap.ts` — both are currently set for a site that
   should not be indexed.
6. Fix the dangling redirect targets first — a launch that leaves them pointing
   at deleted pages sends paying customers to dead URLs. See
   [README.md](README.md#dangling-references--read-before-launch).
7. Verify: `curl -I https://<host>/` is `200`, and
   `curl -i https://<host>/api/admin/applications-data` is still `401`.
