import { saveAs } from 'file-saver';
import { codeGenerator } from './codeGenerator';
import type { Component } from '@/types/component';
import { useThemeStore } from '@/stores/theme';
import { useEditorStore } from '@/stores/editor';
import { useCommerceStore } from '@/stores/commerce';
import { usePagesStore, type Page } from '@/stores/pages';
import { useIntegrationsStore } from '@/stores/integrations';
import { telemetry } from '@/lib/telemetry';

export interface ExportOptions {
  includeConfig?: boolean;
  platform?: 'vercel' | 'netlify' | 'static';
  includeTheme?: boolean;
  /** Export all site pages, not just the current canvas. */
  multiPage?: boolean;
  /** Include the commerce runtime + catalog snapshot. */
  includeCommerce?: boolean;
}

/**
 * ExportManager produces a deployable ZIP from the in-memory project.
 * Output is platform-agnostic static HTML/CSS/JS plus the commerce runtime
 * and a sitemap when multi-page mode is on.
 */
export class ExportManager {
  async exportProject(
    components: Component[],
    projectName: string,
    options: ExportOptions = {},
  ): Promise<void> {
    const startTime = performance.now();

    try {
      const themeStore = options.includeTheme ? useThemeStore() : null;
      const themeVariables = themeStore?.cssVariables;

      const editorStore = useEditorStore();
      const globalCustomCode = editorStore.globalCustomCode;

      const commerceStore = options.includeCommerce ? useCommerceStore() : null;
      const commerce = commerceStore
        ? {
            enabled: true,
            products: commerceStore.activeProducts,
            settings: commerceStore.settings,
          }
        : undefined;

      const integrationsStore = useIntegrationsStore();
      const integrations = {
        analytics: integrationsStore.analytics,
        forms: integrationsStore.forms,
      };

      const pagesStore = options.multiPage ? usePagesStore() : null;
      const pages = pagesStore?.pages;

      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      if (pagesStore && pages && pages.length > 0) {
        await this.writeMultiPage(zip, pages, {
          projectName,
          includeTheme: !!options.includeTheme,
          themeVariables,
          globalCustomCode,
          commerce,
          integrations,
        });
        zip.file('sitemap.xml', this.generateSitemap(pages));
        zip.file('robots.txt', this.generateRobots());
      } else {
        const { css, fullPage } = await codeGenerator.generateProject(components, projectName, {
          includeTheme: options.includeTheme,
          themeVariables,
          globalCustomCode,
          commerce,
          integrations,
        });
        zip.file('index.html', fullPage);
        zip.file('styles.css', css);
      }

      if (options.includeConfig) {
        zip.file('package.json', this.generatePackageJson(projectName));
        zip.file('README.md', this.generateReadme(projectName));
        zip.file('.gitignore', this.generateGitignore());

        if (options.platform === 'vercel') {
          zip.file('vercel.json', this.generateVercelConfig());
        } else if (options.platform === 'netlify') {
          zip.file('netlify.toml', this.generateNetlifyConfig());
        }
      }

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      saveAs(blob, fileName);

      const _exportTime = performance.now() - startTime;
      void _exportTime;
    } catch (error) {
      telemetry.captureException(error, { scope: 'exportManager.exportProject' });
      console.error('Export failed:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to export project: ${error.message}`, { cause: error });
      }
      throw new Error(`Failed to export project: ${String(error)}`);
    }
  }

  private async writeMultiPage(
    zip: import('jszip'),
    pages: ReadonlyArray<Page>,
    ctx: {
      projectName: string;
      includeTheme: boolean;
      themeVariables: Record<string, string> | undefined;
      globalCustomCode: { css?: string; javascript?: string; headHTML?: string };
      commerce: { enabled: boolean; products: ReadonlyArray<unknown>; settings: unknown } | undefined;
      integrations: { analytics: unknown; forms: unknown };
    },
  ): Promise<void> {
    for (const page of pages) {
      const { fullPage } = await codeGenerator.generateProject(page.components, ctx.projectName, {
        includeTheme: ctx.includeTheme,
        themeVariables: ctx.themeVariables,
        globalCustomCode: ctx.globalCustomCode,
        commerce: ctx.commerce as never,
        integrations: ctx.integrations as never,
        seo: {
          title: page.seo?.title || page.name,
          description: page.seo?.description,
          ogImage: page.seo?.ogImage,
        },
      });
      const filename = page.isHomePage ? 'index.html' : `${page.slug || page.path.replace(/^\//, '')}.html`;
      zip.file(filename, fullPage);
    }
  }

  private generateSitemap(pages: ReadonlyArray<Page>): string {
    const urls = pages
      .map(
        (p) => `  <url>
    <loc>https://example.com${p.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p.isHomePage ? '1.0' : '0.7'}</priority>
  </url>`,
      )
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  }

  private generateRobots(): string {
    return `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
`;
  }

  private generatePackageJson(projectName: string): string {
    return JSON.stringify(
      {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: `${projectName} — built with OpenBuild`,
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
          serve: 'npx serve .',
        },
        devDependencies: {
          vite: '^7.0.0',
        },
      },
      null,
      2,
    );
  }

  private generateReadme(projectName: string): string {
    return `# ${projectName}

Built with [OpenBuild](https://github.com/Grandillionaire/openbuild) — the open-source visual website builder with built-in commerce.

## Run locally

\`\`\`bash
npx serve .
\`\`\`

## Deploy

- **Vercel:** \`npx vercel\`
- **Netlify:** \`npx netlify deploy\`
- **GitHub Pages:** push to a repo and enable Pages.

## License

MIT
`;
  }

  private generateGitignore(): string {
    return `node_modules
dist
.DS_Store
*.log
.env
.vscode
.idea
`;
  }

  private generateVercelConfig(): string {
    return JSON.stringify(
      {
        version: 2,
        cleanUrls: true,
        trailingSlash: false,
      },
      null,
      2,
    );
  }

  private generateNetlifyConfig(): string {
    return `[build]
  publish = "."
`;
  }
}

export const exportManager = new ExportManager();
