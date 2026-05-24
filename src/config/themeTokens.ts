/**
 * Theme tokens consumed by component generateCSS implementations.
 *
 * Each value is a CSS `var(--name, fallback)` expression so components stay
 * usable in exports that don't include the theme block — the fallback is
 * the v2 default palette / scale.
 *
 * Keep this file framework-free: it's imported by both editor code and
 * the exported runtime-free codegen output.
 */

export const T = {
  // Colours
  text: 'var(--color-text, #111827)',
  textMuted: 'var(--color-textSecondary, #6B7280)',
  textSubtle: 'var(--color-textSecondary, #9CA3AF)',
  bg: 'var(--color-background, #FFFFFF)',
  surface: 'var(--color-surface, #F9FAFB)',
  surfaceAlt: 'var(--color-surface, #F3F4F6)',
  border: 'var(--color-border, #E5E7EB)',
  borderHover: 'var(--color-border, #C7D2FE)',
  primary: 'var(--color-primary, #3B82F6)',
  primaryStrong: 'var(--color-primary, #2563EB)',
  primarySoft: 'var(--color-primary, #DBEAFE)',
  secondary: 'var(--color-secondary, #6366F1)',
  accent: 'var(--color-accent, #F59E0B)',
  success: 'var(--color-success, #10B981)',
  danger: 'var(--color-error, #EF4444)',
  ctaBg: 'var(--color-text, #111827)',
  ctaBgHover: 'var(--color-text, #1F2937)',

  // Radii
  radiusSm: 'var(--radius-sm, 6px)',
  radiusMd: 'var(--radius-md, 8px)',
  radiusLg: 'var(--radius-lg, 12px)',
  radiusXl: 'var(--radius-xl, 16px)',
  radiusFull: 'var(--radius-full, 9999px)',

  // Shadows
  shadowSm: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
  shadowMd: 'var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1))',
  shadowLg: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1))',

  // Spacing scale
  spaceXs: 'var(--spacing-xs, 0.5rem)',
  spaceSm: 'var(--spacing-sm, 1rem)',
  spaceMd: 'var(--spacing-md, 1.5rem)',
  spaceLg: 'var(--spacing-lg, 2rem)',
  spaceXl: 'var(--spacing-xl, 3rem)',

  // Typography
  fontBody: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  fontHeading: 'var(--font-family-heading, var(--font-family, sans-serif))',
} as const;

/**
 * Build a focus-ring shadow that respects the current primary colour.
 * Browsers render rgba(var(--x), 0.15) as invalid since CSS vars can't be
 * spliced into rgba like that — use color-mix where supported, plain rgba
 * fallback otherwise.
 */
export const FOCUS_RING = '0 0 0 3px color-mix(in srgb, var(--color-primary, #3B82F6) 25%, transparent)';
