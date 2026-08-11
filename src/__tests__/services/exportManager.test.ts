import { describe, it, expect } from 'vitest';
import { ExportManager } from '@/services/exportManager';
import type { Page } from '@/stores/pages';

const page = (path: string, isHomePage = false): Page => ({
  id: path,
  name: path,
  slug: path.replace(/^\//, ''),
  path,
  components: [],
  isHomePage,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

/** The sitemap/robots writers are private — reach them the way the exporter does. */
const internals = new ExportManager() as unknown as {
  normalizeSiteUrl(url?: string): string | undefined;
  generateSitemap(pages: ReadonlyArray<Page>, siteUrl: string): string;
  generateRobots(siteUrl?: string): string;
};

describe('ExportManager SEO files', () => {
  it('writes sitemap URLs on the merchant domain, not example.com', () => {
    const xml = internals.generateSitemap([page('/', true), page('/about')], 'https://mystore.com');

    expect(xml).not.toContain('example.com');
    expect(xml).toContain('<loc>https://mystore.com/</loc>');
    expect(xml).toContain('<loc>https://mystore.com/about</loc>');
  });

  it('points robots.txt at the merchant sitemap and omits it when unknown', () => {
    expect(internals.generateRobots('https://mystore.com')).toContain(
      'Sitemap: https://mystore.com/sitemap.xml',
    );
    expect(internals.generateRobots(undefined)).not.toContain('Sitemap:');
    expect(internals.generateRobots(undefined)).not.toContain('example.com');
  });

  it('normalizes the site URL and rejects unusable values', () => {
    expect(internals.normalizeSiteUrl('https://mystore.com/')).toBe('https://mystore.com');
    expect(internals.normalizeSiteUrl('https://mystore.com/shop/')).toBe('https://mystore.com/shop');
    expect(internals.normalizeSiteUrl('  ')).toBeUndefined();
    expect(internals.normalizeSiteUrl('mystore.com')).toBeUndefined();
    expect(internals.normalizeSiteUrl('javascript:alert(1)')).toBeUndefined();
  });
});
