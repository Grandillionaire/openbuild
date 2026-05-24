/**
 * Escapes HTML special characters to prevent XSS in generated HTML.
 *
 * Accepts `unknown` so callers don't need to massage component props (which can
 * be `string | Record<string, any> | undefined`) before passing them through.
 * Non-string values are coerced via `String(...)` — objects become `[object Object]`,
 * which signals "this should never have happened" at runtime without crashing.
 */
export function escapeHtml(value: unknown): string {
  const str = value == null ? '' : String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates that a URL uses a safe scheme (http, https, mailto, tel, or relative).
 * Returns '#' for unsafe URLs like javascript: or data:.
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string' || !url) return '#';
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./')
  ) {
    return url;
  }
  return '#';
}
