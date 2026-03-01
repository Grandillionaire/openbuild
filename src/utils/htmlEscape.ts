/**
 * Escapes HTML special characters to prevent XSS in generated HTML.
 */
export function escapeHtml(str: string): string {
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
export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') ||
      trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') ||
      trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return url;
  }
  return '#';
}
