/**
 * Helpers for coercing CSS prop values to and from their string / number forms.
 *
 * The editor needs to parse user input ("12px" → 12), build URLs from values
 * ("16px" → "16"), and bind both back into the v-model of inputs that only
 * accept strings. These tiny helpers centralise that boilerplate.
 */

export function cssString(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

export function cssNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const match = value.match(/-?\d+(\.\d+)?/);
    if (match) return Number(match[0]);
  }
  return fallback;
}

export function cssUnit(value: unknown, fallback = 'px'): string {
  if (typeof value !== 'string') return fallback;
  const match = value.match(/(px|rem|em|%|vh|vw|ch|fr|pt|cm|mm|in)$/);
  return match ? match[1] : fallback;
}
