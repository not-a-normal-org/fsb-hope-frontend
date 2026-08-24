/**
 * Foundation (pillar) blog post — "How to Fly for Free with Your Credit Card
 * Points? Award Travel".
 *
 * This replaces `seed-blog.ts`, which seeded four `[[SAMPLE]]` placeholder posts
 * so the /blog grid wasn't empty. Those are gone; this is real content.
 *
 * Run: `npm run seed:blog` (→ `payload run src/scripts/seed-foundation-post.ts`).
 * `payload run` loads `.env.local` (DATABASE_URI, PAYLOAD_SECRET) via @next/env.
 *
 * Idempotent: re-running UPDATES the post in place (matched by slug) rather than
 * creating a duplicate, so copy edits can be re-applied from source control.
 * Pass `--clear` to first delete the old sample posts + the `test-cat` category.
 *
 * The cover image is NOT set here — it's a Media upload, so an author attaches it
 * in the CMS. See docs/blog-images.md for the required resolution.
 */
import { getPayload } from 'payload';
import config from '@payload-config';

/* ────────────────────────────────────────────────────────────────────────────
 * Minimal Lexical builders
 *
 * Payload stores richText as Lexical JSON, so seeded prose has to be built as
 * nodes. These cover exactly the marks `.sm-prose` styles in globals.css —
 * h2/h3, paragraphs, ul/ol, blockquote, bold, italic, links. Anything else would
 * render unstyled on the post page.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Payload's generated Post type requires `type` + `version` on every node. */
type Node = { [k: string]: unknown; type: string; version: number };

const BOLD = 1;
const ITALIC = 2;

const text = (value: string, format = 0): Node => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
});

const b = (value: string): Node => text(value, BOLD);
const i = (value: string): Node => text(value, ITALIC);

const a = (value: string, url: string): Node => ({
  type: 'link',
  fields: { linkType: 'custom', url, newTab: false },
  format: '',
  indent: 0,
  direction: 'ltr',
  version: 3,
  children: [text(value)],
});

/** Inline content: bare strings become plain text nodes. */
type Inline = string | Node;
const inlines = (parts: Inline[]): Node[] =>
  parts.map((part) => (typeof part === 'string' ? text(part) : part));

const element = (
  type: string,
  children: Node[],
  extra: Record<string, unknown> = {},
): Node => ({
  format: '',
  indent: 0,
  direction: 'ltr' as const,
  children,
  ...extra,
  type,
  version: 1,
});

const p = (...parts: Inline[]): Node => element('paragraph', inlines(parts), { textFormat: 0 });
const h2 = (value: string): Node => element('heading', [text(value)], { tag: 'h2' });
const h3 = (value: string): Node => element('heading', [text(value)], { tag: 'h3' });
const quote = (...parts: Inline[]): Node => element('quote', inlines(parts));

const listItem = (parts: Inline[], value: number): Node =>
  element('listitem', inlines(parts), { value, checked: undefined });

const list = (tag: 'ul' | 'ol', items: Inline[][]): Node =>
  element('list', items.map((item, idx) => listItem(item, idx + 1)), {
    listType: tag === 'ul' ? 'bullet' : 'number',
    tag,
    start: 1,
  });

const ul = (...items: Inline[][]): Node => list('ul', items);
const ol = (...items: Inline[][]): Node => list('ol', items);

const doc = (children: Node[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children,
  },
});

/* ────────────────────────────────────────────────────────────────────────────
 * The post
 *
 * Editorial constraints (docs/plans/00-context.md): no founder names, no prior
 * company name, no fabricated social proof, and nothing that advertises a
 * product we haven't built. The differentiator stated here is the true one —
 * a person checks the space by hand.
 *
 * Deliberately free of current award prices: mileage rates change constantly
 * and a pillar post shouldn't rot. The one worked example is labelled
 * illustrative and teaches the arithmetic, not a price.
 * ──────────────────────────────────────────────────────────────────────────── */

const SLUG = 'how-to-fly-for-free-with-credit-card-points';

const TITLE = 'How to Fly for Free with Your Credit Card Points? Award Travel';

const EXCERPT =
  'Nobody flies for literally free — but you can pay for a $2,400 seat with points you already earned. The honest, step-by-step guide to award travel: which points to hold, what an award seat really is, and the one mistake that costs the most.';

const CONTENT = doc([
  p(
    'You have points. You have a trip in mind. Somewhere between those two facts is a system that almost nobody explains properly, so here it is properly — what award travel actually is, how the pieces fit, and where people lose money without realising it.',
  ),

  h2('First, the honest version of “free”'),
  p(
    'Nobody flies for free. What you can do — and what this entire pursuit is about — is pay for a seat with points you earned on spending you were doing anyway, and hand over ',
    b('$43 instead of $2,400'),
    '. The airline still collects taxes. Sometimes it collects considerably more than taxes. But the fare, which is the expensive part, gets covered by a currency you never bought.',
  ),
  p(
    'That is award travel. It is not a loophole or a hack. It is a second pricing system that airlines run deliberately, alongside the cash one, and it has rules. This guide is the rules.',
  ),

  h2('Step 1 — Earn the right kind of points'),
  p(
    'Not all points are equally useful, and the gap between the tiers is the gap between a $200 economy ticket and a $6,000 business class seat.',
  ),

  h3('Transferable bank points — the flexible ones'),
  p(
    'These live with the bank rather than an airline: Amex Membership Rewards, Chase Ultimate Rewards, Capital One miles, Citi ThankYou, Bilt Rewards, and a few others. You can move them into a range of airline and hotel loyalty programs — commonly at 1:1 — and crucially, you choose ',
    i('which'),
    ' program at the moment you book. That optionality is the whole ballgame. It is what lets you book the seat through whichever program prices it cheapest.',
  ),

  h3('Airline and hotel co-brand points'),
  p(
    'A co-branded airline card earns that airline’s miles and nothing else. Genuinely useful if you live in that airline’s hub and fly it constantly. The trade-off is that you are locked in: when that program reprices its awards — and programs do, with little or no notice — you have no escape hatch.',
  ),

  h3('Cashback'),
  p(
    'Fine. Boring. Roughly one to two cents per point, forever, with no homework. If you know you will never do the work described below and won’t hand it to someone who will, take the cashback — that is a real answer, not a consolation prize. Award travel only pays off if somebody actually does the searching.',
  ),
  quote(
    'Rule of thumb: if you can’t name your card’s transfer partners, you are probably earning the wrong currency for the trip you want.',
  ),

  h2('Step 2 — Understand what an “award seat” actually is'),
  p(
    'This is the part almost everyone gets wrong, and getting it right explains most of the frustration people have with points.',
  ),
  p(
    'An award seat is ',
    b('not'),
    ' “any seat on the plane, priced in miles.” It is inventory — a specific number of seats that the airline has chosen to release for points, on a specific flight, on a specific date, to its own members and sometimes to its partners.',
  ),
  p('Two consequences follow:'),
  ol(
    [
      'A flight can be wide open for cash and have zero award space. The plane being empty tells you nothing at all about whether you can book it with points.',
    ],
    [
      'The same physical seat can cost wildly different amounts depending on which program you book it through. That is Step 4, and it is where the money is.',
    ],
  ),
  p(
    'Programs broadly price awards one of two ways. ',
    b('Chart-based or “saver” pricing'),
    ' holds a fixed points price for a route and releases a limited number of seats at it — this is where the outsized value lives. ',
    b('Dynamic pricing'),
    ' floats the points price against the cash fare, which means a cheap cash day is a cheap award day and an expensive one is rarely worth booking. Many programs now do both, depending on whether it is their own aircraft or a partner’s.',
  ),

  h2('Step 3 — Find the seat first. Always.'),
  quote('Never transfer points before you have confirmed the seat is bookable.'),
  p(
    'Transfers are one-way and, in nearly every case, irreversible. Move 90,000 points into an airline program for a seat that disappears while the transfer is in flight, and those points now live in that program permanently. You have not lost them — you have lost every other option you had for them.',
  ),
  p(
    'The correct order is: find the space, confirm the program you intend to use can actually book it, ',
    i('then'),
    ' start the transfer, then book. Some transfers land in seconds; others take days. That lag is exactly where people get burned, and it is why knowing which of your programs transfer instantly is worth more than it sounds.',
  ),

  h2('Step 4 — Book through the cheapest program, not the obvious one'),
  p(
    'This is the highest-leverage idea in award travel, so it is worth reading twice: ',
    b('the airline flying the plane is often not the cheapest way to book the plane.'),
  ),
  p(
    'Airlines sit inside alliances and bilateral partnerships. When one of them releases a seat to partners, several other programs can each sell you that same physical seat — each at its own points price, in its own currency, with its own fees. One of them is usually far cheaper than the rest, and it is frequently a program you have never flown and never will.',
  ),
  p(
    'So the question is never “how many miles does this airline want?” It is: ',
    i('of every program that can book this seat, which one wants the fewest points and the least cash — and can I get points into it in time?'),
  ),

  h2('Step 5 — Check the fees before you celebrate'),
  p('Points cover the fare. They do not always cover everything else.'),
  p(
    'Some programs pass on the operating airline’s carrier-imposed surcharges, which on a long-haul premium ticket can run into the hundreds of dollars per passenger. Other programs don’t pass them on at all — on the identical seat, on the identical flight. Departure taxes vary by country on top of that.',
  ),
  p(
    'A “free” flight that costs $800 in fees is a different product from one that costs $43, and the only way to know which you are being offered is to price the seat in each program that can sell it before you commit anything.',
  ),

  h2('Step 6 — Book it, then keep looking'),
  p(
    'Award tickets are usually more flexible than cheap cash fares: many programs let you change or cancel and redeposit the points for a modest fee, or none. That asymmetry works in your favour. Lock in a workable itinerary as soon as you find one, then keep watching for the better one — if the seat you actually wanted opens up later, you switch and redeposit the first booking.',
  ),

  h2('So why is this hard?'),
  p('Reading the six steps takes four minutes. Executing them takes hours, because:'),
  ul(
    ['Award space appears and vanishes without notice, and nobody sends you a notification when it does.'],
    [
      'Several programs don’t display partner award space online at all. Finding it means calling, and knowing what to ask for.',
    ],
    [
      'Transfer bonuses, fee structures, routing rules and stopover allowances shift constantly, and programs rarely announce changes in advance.',
    ],
    [
      'Search tools each cover a subset of programs and cache aggressively. A seat one tool reports as unavailable frequently is available.',
    ],
  ),
  p(
    'None of that is a pitch — it is just the shape of the problem. It is a lot of manual checking against sources that disagree with each other. Some people love that part, and if you are one of them, everything above is enough to get started. Go and do it.',
  ),

  h2('The valuation maths (the only formula you need)'),
  p(
    'An illustrative example — these are not current award prices, they are arithmetic. Say a one-way business class seat prices at 60,000 points plus $180 in taxes and surcharges, and the cash fare for that same seat is $2,400.',
  ),
  p(
    'Take the cash value, subtract the cash you still pay, and divide by the points you spent: ',
    b('($2,400 − $180) ÷ 60,000 = 3.7 cents per point.'),
    ' Against the roughly one cent you would have got taking cashback, that seat is worth about 3.7× more redeemed as an award.',
  ),
  p(
    'Run that every single time. If it comes out anywhere near a cent, don’t book the award — pay cash and keep the points for a redemption that earns its keep. You can run the numbers on your own balances with our ',
    a('points calculator', '/calculator'),
    '.',
  ),

  h2('The five mistakes that cost people the most'),
  ol(
    [
      b('Transferring points speculatively.'),
      ' Covered above, and it is the expensive one. Confirm the seat, then move the points.',
    ],
    [
      b('Concentrating everything in one airline program'),
      ' because you “usually fly them.” Unless you are chasing status, flexibility beats loyalty.',
    ],
    [
      b('Checking one airline’s website and concluding there’s no space.'),
      ' You checked one seller out of many that can sell that seat.',
    ],
    [
      b('Booking a dynamically-priced award on an expensive cash day.'),
      ' That converts points into dollars at a terrible rate — precisely the trade the airline wants you to make.',
    ],
    [
      b('Hoarding.'),
      ' Points are a currency issued by a company that can reprice it overnight, and several have. Earn toward a specific trip, then take the trip.',
    ],
  ),

  h2('Frequently asked'),

  h3('Can you really fly for free with credit card points?'),
  p(
    'You can cover the fare — the large number — with points, which is what “free flight” means in practice. You will still pay taxes, and depending on the program and route, carrier-imposed surcharges. On a good redemption that is tens of dollars; on a poor one it can be many hundreds. The programs you book through determine which of those you get.',
  ),

  h3('How many points do I need for a flight?'),
  p(
    'There is no single answer, because the same seat carries a different price in every program that can sell it, and chart-based programs price by region while dynamic ones price against the cash fare. That is why the honest first step is not “how many points do I need” but “what can the points I already have actually reach?”',
  ),

  h3('Do points expire?'),
  p(
    'It depends on where they sit. Transferable bank points generally persist while the account is open and in good standing; many airline programs expire miles after a period of account inactivity, and the qualifying activity differs by program. Once you transfer, you inherit that airline’s expiry rules — another reason not to move points until you need to.',
  ),

  h3('Is it better to just take the cashback?'),
  p(
    'Sometimes, genuinely. Cashback is about one cent per point with zero effort. Award travel routinely beats that by several times over — but only on redemptions somebody actually found. If the points sit unredeemed for years, cashback would have been the better product.',
  ),

  h2('Where to start this week'),
  ol(
    ['Write down every points balance you hold, and which bank or program holds it.'],
    ['For each one, look up its transfer partners. That list is your real route map — it is what your points can actually reach.'],
    ['Pick one trip you genuinely want, plus a second set of dates you would accept.'],
    ['Find the space before you move anything. Then move it, then book.'],
  ),
  p(
    'And if that is more homework than you want to take on, that is exactly what we are for. We check award space by hand — a real person working the programs that actually price your route, rather than an algorithm handing back whatever a cache last saw. It is slower. It finds seats the tools miss.',
  ),
  p(
    a('Get a free points audit', '/audit'),
    ' — tell us what you are holding and where you want to go, and we will tell you what it can actually buy. Or read ',
    a('how it works', '/how-it-works'),
    ' first.',
  ),
]);

/* SEO plugin `meta` (payload.config.ts). Set explicitly rather than relying on
 * the fallbacks in the post page: the excerpt is written for the card grid and
 * runs longer than a meta description should. `meta.title` stays short because
 * the root layout appends " | Saver Miles" via its title template. */
const META_TITLE = 'How to Fly for Free with Credit Card Points';
const META_DESCRIPTION =
  'What award travel actually is, which points to hold, and the transfer mistake that costs the most. A plain-English guide to booking flights with credit card points.';

/** Sample content from the retired seed-blog.ts, plus leftover test records. */
const SAMPLE_POST_SLUGS = [
  'how-award-availability-actually-works',
  'transfer-partners-explained',
  'business-class-to-tokyo-on-points',
  'europe-in-summer-without-the-cash-price',
  'new-dummy-of-a-great-journey',
];
const SAMPLE_CATEGORY_SLUGS = ['test-cat'];

const CATEGORY = { name: 'Guides', slug: 'guides' };

async function main() {
  const payload = await getPayload({ config });
  const clear = process.argv.includes('--clear');

  // ── Clear the placeholder content ──────────────────────────────────────────
  // Opt-in: the seed is meant to be re-runnable for copy edits without wiping
  // anything an author has since written.
  if (clear) {
    for (const slug of SAMPLE_POST_SLUGS) {
      const { docs } = await payload.delete({
        collection: 'posts',
        where: { slug: { equals: slug } },
      });
      console.log(docs.length ? `✓ deleted post "${slug}"` : `• post "${slug}" not present`);
    }
    for (const slug of SAMPLE_CATEGORY_SLUGS) {
      const { docs } = await payload.delete({
        collection: 'categories',
        where: { slug: { equals: slug } },
      });
      console.log(docs.length ? `✓ deleted category "${slug}"` : `• category "${slug}" not present`);
    }
  }

  // ── Category ───────────────────────────────────────────────────────────────
  // The NavBar links /blog/category/guides, so this row has to exist.
  const found = await payload.find({
    collection: 'categories',
    where: { slug: { equals: CATEGORY.slug } },
    limit: 1,
    depth: 0,
  });
  const categoryId =
    found.docs[0]?.id ?? (await payload.create({ collection: 'categories', data: CATEGORY })).id;
  console.log(`✓ category "${CATEGORY.slug}" → id ${categoryId}`);

  // ── The post ───────────────────────────────────────────────────────────────
  // `_status: 'published'` matters: the /blog queries filter on it, so a draft
  // would seed successfully and then be invisible on the site.
  const data = {
    title: TITLE,
    slug: SLUG,
    excerpt: EXCERPT,
    category: categoryId,
    content: CONTENT,
    meta: { title: META_TITLE, description: META_DESCRIPTION },
    _status: 'published' as const,
  };

  const existing = await payload.find({
    collection: 'posts',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: 'posts',
      id: existing.docs[0].id,
      data, // publishedAt left alone — don't reset the original publish date
    });
    console.log(`✓ updated post "${SLUG}"`);
  } else {
    await payload.create({
      collection: 'posts',
      data: { ...data, publishedAt: new Date().toISOString() },
    });
    console.log(`✓ created post "${SLUG}"`);
  }

  console.log('\nFoundation post seed complete.');
}

/** Drain stdout/stderr before the process exits — otherwise piped output is lost. */
const flush = () =>
  new Promise<void>((resolve) => {
    let pending = 2;
    const done = () => --pending === 0 && resolve();
    process.stdout.write('', done);
    process.stderr.write('', done);
  });

// Top-level await runs main() to completion; the explicit process.exit closes
// the open Postgres pool so the process doesn't hang.
try {
  await main();
  await flush();
  process.exit(0);
} catch (err) {
  console.error('Foundation post seed failed:', err);
  await flush();
  process.exit(1);
}
