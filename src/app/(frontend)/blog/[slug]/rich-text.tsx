import Image from 'next/image';
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';

import { mediaPublicUrl } from '@/lib/blog';

/**
 * JSX converters for a post body. Only `upload` (an in-article image) is
 * overridden; everything else keeps the package defaults.
 *
 * The stock upload converter can't be used here: it points at Payload's own
 * `/cms-api/media/...` route, which the construction wall gates and which skips
 * next/image entirely. Covers already go straight to the public Supabase bucket
 * (see mediaPublicUrl), and body images do the same.
 */
type MediaValue = {
  filename?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
};

export const articleConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    // `value` is a bare id until Payload populates it (depth >= 1 on the query).
    const doc = typeof node.value === 'object' && node.value ? (node.value as MediaValue) : null;
    const src = mediaPublicUrl(doc?.filename);
    if (!src) return null;
    if (doc?.mimeType && !doc.mimeType.startsWith('image')) return null;

    const caption = (node.fields as { caption?: unknown } | undefined)?.caption;

    return (
      <figure>
        <Image
          src={src}
          alt={doc?.alt ?? ''}
          width={doc?.width ?? 1600}
          height={doc?.height ?? 900}
          sizes="(min-width: 720px) 672px, 100vw"
          className="h-auto w-full"
        />
        {typeof caption === 'string' && caption.trim() ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  },
});
