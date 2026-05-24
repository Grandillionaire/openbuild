import { describe, it, expect } from 'vitest';
import { responsiveImage } from '@/utils/imageOpt';

describe('responsiveImage', () => {
  it('emits a bare <img> with lazy + decoding for unknown hosts', () => {
    const html = responsiveImage({ src: 'https://example.com/cat.jpg', alt: 'A cat' });
    expect(html).toMatch(/^<img/);
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('alt="A cat"');
    expect(html).not.toContain('<picture');
  });

  it('emits <picture> with AVIF + WebP sources for Unsplash', () => {
    const html = responsiveImage({
      src: 'https://images.unsplash.com/photo-1?fm=jpg',
      alt: 'Sunset',
      sizes: '50vw',
    });
    expect(html).toContain('<picture>');
    expect(html).toContain('type="image/avif"');
    expect(html).toContain('type="image/webp"');
    expect(html).toContain('fm=avif');
    expect(html).toContain('fm=webp');
    expect(html).toMatch(/sizes="50vw"/);
    // Each srcset should contain multiple width-bucketed URLs
    expect(html).toMatch(/320w/);
    expect(html).toMatch(/1600w/);
  });

  it('rewrites Cloudinary URLs with transform segments', () => {
    const html = responsiveImage({
      src: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      alt: 'Sample',
    });
    expect(html).toContain('/upload/w_320,c_limit,q_auto,f_auto/');
    expect(html).toContain('/upload/w_1600,c_limit,q_auto,f_avif/');
  });

  it('escapes HTML special chars in alt text', () => {
    const html = responsiveImage({
      src: 'https://example.com/x.jpg',
      alt: 'Cool & "fun" <photo>',
    });
    expect(html).toContain('alt="Cool &amp; &quot;fun&quot; &lt;photo>"');
  });

  it('returns empty string when src is unsafe (e.g. javascript:)', () => {
    expect(responsiveImage({ src: 'javascript:alert(1)', alt: '' })).toBe('');
  });

  it('marks above-the-fold images as eager + high priority', () => {
    const html = responsiveImage({
      src: 'https://example.com/hero.jpg',
      alt: 'Hero',
      eager: true,
      highPriority: true,
    });
    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchpriority="high"');
  });

  it('emits width/height attributes when both are provided (prevents CLS)', () => {
    const html = responsiveImage({
      src: 'https://example.com/x.jpg',
      alt: '',
      width: 800,
      height: 600,
    });
    expect(html).toContain('width="800"');
    expect(html).toContain('height="600"');
  });
});
