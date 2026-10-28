/**
 * Fill `{name}` placeholders in a message: `fmt('Step {n} of {total}', { n: 1, total: 4 })`.
 * An unknown placeholder is left as written, so a typo shows up on the page
 * instead of vanishing.
 */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
