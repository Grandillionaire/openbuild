/**
 * Responsive image markup helpers.
 *
 * OpenBuild doesn't run an image pipeline (we're a client-side builder), but
 * we can still emit production-quality `<img>` and `<picture>` markup:
 *
 *   - srcset breakpoints when the source is on a known CDN (Unsplash,
 *     Cloudinary, Imgix, imagekit) that supports query-parameter resizing
 *   - WebP / AVIF source elements when the same CDNs support format negotiation
 *   - intrinsic width/height hints to prevent CLS
 *   - loading="lazy" and decoding="async" by default
 *
 * Users who self-host can plug in their own URL-rewrite function via the
 * plugin system; falling back to a bare <img> for unknown hosts is safe and
 * keeps existing exports working.
 */

import { sanitizeUrl } from './htmlEscape';

const DEFAULT_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1600] as const;

type Provider = 'unsplash' | 'cloudinary' | 'imgix' | 'imagekit' | 'unknown';

function detectProvider(url: string): Provider {
  const u = url.toLowerCase();
  if (u.includes('images.unsplash.com')) return 'unsplash';
  if (u.includes('res.cloudinary.com')) return 'cloudinary';
  if (u.includes('.imgix.net')) return 'imgix';
  if (u.includes('ik.imagekit.io')) return 'imagekit';
  return 'unknown';
}

function withWidth(url: string, provider: Provider, width: number, format?: 'webp' | 'avif'): string {
  try {
    const u = new URL(url);
    switch (provider) {
      case 'unsplash':
        u.searchParams.set('w', String(width));
        u.searchParams.set('auto', 'format');
        u.searchParams.set('q', '80');
        if (format) u.searchParams.set('fm', format);
        return u.toString();
      case 'imgix':
        u.searchParams.set('w', String(width));
        u.searchParams.set('auto', 'format,compress');
        if (format) u.searchParams.set('fm', format);
        return u.toString();
      case 'imagekit':
        u.searchParams.set('tr', `w-${width}${format ? `,f-${format}` : ',f-auto'}`);
        return u.toString();
      case 'cloudinary': {
        // Transform comes between /upload/ and the file path
        const parts = u.pathname.split('/upload/');
        if (parts.length === 2) {
          const transform = `w_${width},c_limit,q_auto${format ? `,f_${format}` : ',f_auto'}`;
          u.pathname = `${parts[0]}/upload/${transform}/${parts[1]}`;
        }
        return u.toString();
      }
      default:
        return url;
    }
  } catch {
    return url;
  }
}

function buildSrcset(url: string, provider: Provider, widths: readonly number[], format?: 'webp' | 'avif'): string {
  return widths.map((w) => `${withWidth(url, provider, w, format)} ${w}w`).join(', ');
}

export interface ResponsiveImageOpts {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Pixel widths to request. Defaults to a sensible set. */
  widths?: ReadonlyArray<number>;
  /** `sizes` attribute. Defaults to "100vw" — fine for above-the-fold hero images. */
  sizes?: string;
  /** Mark eager when the image is above the fold (LCP candidate). */
  eager?: boolean;
  /** Add `fetchpriority="high"` for hero images. */
  highPriority?: boolean;
  className?: string;
  style?: string;
}

export function responsiveImage(opts: ResponsiveImageOpts): string {
  const safeSrc = sanitizeUrl(opts.src);
  if (safeSrc === '#') return '';
  const alt = escapeAttr(opts.alt ?? '');
  const provider = detectProvider(safeSrc);
  const widths = opts.widths ?? DEFAULT_WIDTHS;
  const sizes = opts.sizes ?? '100vw';
  const loading = opts.eager ? 'eager' : 'lazy';
  const fetchpriority = opts.highPriority ? ' fetchpriority="high"' : '';
  const dims = opts.width && opts.height ? ` width="${opts.width}" height="${opts.height}"` : '';
  const cls = opts.className ? ` class="${escapeAttr(opts.className)}"` : '';
  const style = opts.style ? ` style="${escapeAttr(opts.style)}"` : '';

  if (provider === 'unknown') {
    return `<img src="${escapeAttr(safeSrc)}" alt="${alt}" loading="${loading}" decoding="async"${dims}${fetchpriority}${cls}${style} />`;
  }

  const avifSet = buildSrcset(safeSrc, provider, widths, 'avif');
  const webpSet = buildSrcset(safeSrc, provider, widths, 'webp');
  const fallbackSet = buildSrcset(safeSrc, provider, widths);
  const fallbackSrc = withWidth(safeSrc, provider, widths[Math.floor(widths.length / 2)]);

  return `<picture>
  <source type="image/avif" srcset="${avifSet}" sizes="${escapeAttr(sizes)}" />
  <source type="image/webp" srcset="${webpSet}" sizes="${escapeAttr(sizes)}" />
  <img src="${escapeAttr(fallbackSrc)}" srcset="${fallbackSet}" sizes="${escapeAttr(sizes)}" alt="${alt}" loading="${loading}" decoding="async"${dims}${fetchpriority}${cls}${style} />
</picture>`;
}

function escapeAttr(v: string): string {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
