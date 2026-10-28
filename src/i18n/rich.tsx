import { Fragment, type ReactNode } from 'react';

type Renderers = Record<string, (chunks: string) => ReactNode>;

/**
 * Render a message with inline markup: `'See our <link>Cookie Policy</link>.'`
 * with `{ link: (c) => <Link href="/legal/cookies">{c}</Link> }`. Tags don't nest;
 * a tag with no renderer is shown as its plain text, so nothing silently drops.
 * Works in server and client components alike.
 */
export function rich(template: string, renderers: Renderers): ReactNode {
  const parts: ReactNode[] = [];
  const tag = /<(\w+)>(.*?)<\/\1>/g;
  let last = 0;
  for (let m = tag.exec(template); m; m = tag.exec(template)) {
    if (m.index > last) parts.push(template.slice(last, m.index));
    const render = renderers[m[1]];
    parts.push(<Fragment key={m.index}>{render ? render(m[2]) : m[2]}</Fragment>);
    last = m.index + m[0].length;
  }
  if (last < template.length) parts.push(template.slice(last));
  return parts;
}
