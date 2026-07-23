# Cal.com

Bookings. Two separate integrations that are easy to conflate — one public
embed, one authenticated server-side API.

| | Embed | REST API v2 |
|---|---|---|
| Where | **deleted** (was `src/components/ui/CalEmbed.tsx`) | [`src/app/admin/appointments/page.tsx`](../../src/app/admin/appointments/page.tsx) |
| Host | `app.cal.com/embed/embed.js` | `api.cal.com/v2/bookings` |
| Auth | none | `Bearer ${CAL_API_KEY}` |
| Runs | browser | server |
| Risk if broken | a widget doesn't render | admin can't see bookings |

## Embed (deleted with the frontend)

`CalEmbed.tsx` was removed along with the rest of the presentation layer. It
injected the Cal.com script and called
`Cal('init', { origin: 'https://app.cal.com' })` — no key, no server call, none
of our data in transit. Nothing depends on it; the original is in
`archive/frontend-v1/src/components/ui/CalEmbed.tsx` if the new site wants a
reference.

Don't port it verbatim: it reached for `(window as any).Cal` and hand-rolled
script injection. Prefer the official `@calcom/embed-react` package.

The REST integration below is untouched and still live.

## REST API v2 (authenticated)

`/admin/appointments` fetches bookings server-side:

    GET https://api.cal.com/v2/bookings?take=100&sortStart=desc
    Authorization:   Bearer ${CAL_API_KEY}
    cal-api-version: ${CAL_API_VERSION}   # defaults to 2024-08-13

`export const dynamic = 'force-dynamic'` and `cache: 'no-store'` — bookings
are never cached.

### Appointments are not in our database

There is no `appointments` or `bookings` table. Cal.com is the system of
record; this page is a read-only view. Nothing reconciles the two, so a
rebuilt admin cannot source this data from Supabase.

### Currently unconfigured

`CAL_API_KEY` is **absent from both `.env` and `.env.local`**, so this page
renders a "Connect Cal.com" setup state today rather than real bookings. The
integration is written but dormant.

Two consequences:

- It has likely never run against the live API. Treat the response mapping as
  unverified.
- Its env vars are undocumented anywhere else. If the rebuild drops this page,
  `CAL_API_KEY` and `CAL_API_VERSION` disappear with no trace that Cal.com had
  a server-side integration at all.

### Response shape is version-dependent

`mapBooking()` reads defensively — `uid ?? id`, `start ?? startTime`,
`end ?? endTime` — because v2 responses vary by the `cal-api-version` header.
That header is a **pinned date** (`2024-08-13`). Bumping it can change the
payload shape; the defensive mapping is the only thing absorbing that today.

Failures degrade to an error state rather than throwing: a non-OK response
becomes `Cal.com API returned <status>`, and network errors are caught.
