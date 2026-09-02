import { ImageResponse } from 'next/og';

import { getPayloadClient } from '@/lib/payload';

/**
 * Auto-generated, branded Open Graph image for a post — 1200×630, the post
 * title on the Saver Miles dark-blue look. Used as the default social preview;
 * a per-post `meta.image` override (SEO plugin) takes precedence in the page's
 * metadata. Dynamic (queries the CMS for the title).
 */
export const dynamic = 'force-dynamic';
const SIZE = { width: 1200, height: 630 };

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = 'Saver Miles';
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    if (docs[0]?.title) title = String(docs[0].title);
  } catch {
    /* fall back to the brand title */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #0F2038 0%, #060B14 72%)',
          color: '#EAF1FB',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.01em' }}>Saver Miles</div>
          <div style={{ width: 120, height: 4, borderRadius: 4, background: '#0E7C50' }} />
        </div>

        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>
          {title}
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#6FA8DC', letterSpacing: '0.04em' }}>
          Award search, by hand · savermiles.com
        </div>
      </div>
    ),
    SIZE,
  );
}
