import { saveAs } from 'file-saver';
import { codeGenerator } from './codeGenerator';
import type { Component } from '@/types/component';
import { useThemeStore } from '@/stores/theme';
import { useEditorStore } from '@/stores/editor';

export class ExportManager {
  async exportProject(
    components: Component[],
    projectName: string,
    options: {
      includeConfig?: boolean;
      platform?: 'vercel' | 'netlify' | 'static';
      includeTheme?: boolean;
    } = {}
  ): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Get theme variables if needed
      let themeVariables: Record<string, string> | undefined;
      if (options.includeTheme) {
        const themeStore = useThemeStore();
        themeVariables = themeStore.cssVariables;
      }
      
      // Get global custom code
      const editorStore = useEditorStore();
      const globalCustomCode = editorStore.globalCustomCode;
      
      // Generate code
      const { html, css, fullPage } = await codeGenerator.generateProject(
        components,
        projectName,
        {
          includeTheme: options.includeTheme,
          themeVariables,
          globalCustomCode
        }
      );
      
      // Dynamic import to reduce bundle size
      const JSZip = (await import('jszip')).default;
      
      // Create ZIP
      const zip = new JSZip();
      
      // Main files
      zip.file('index.html', fullPage);
      zip.file('styles.css', css);
      
      // Package.json
      if (options.includeConfig) {
        zip.file('package.json', this.generatePackageJson(projectName));
        zip.file('README.md', this.generateReadme(projectName));
        zip.file('.gitignore', this.generateGitignore());
        
        // Platform-specific config
        if (options.platform === 'vercel') {
          zip.file('vercel.json', this.generateVercelConfig());
        } else if (options.platform === 'netlify') {
          zip.file('netlify.toml', this.generateNetlifyConfig());
        }
      }
      
      // Generate and download ZIP
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      saveAs(blob, fileName);
      
      const exportTime = performance.now() - startTime;
      
    } catch (error) {
      // Preserve original error information for debugging
      console.error('Export failed:', error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to export project: ${error.message}`, { cause: error });
      } else {
        throw new Error(`Failed to export project: ${String(error)}`);
      }
    }
  }
  
  private generatePackageJson(projectName: string): string {
    return JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: `${projectName} - Built with OpenBuild`,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        serve: 'python -m SimpleHTTPServer 8000'
      },
      devDependencies: {
        vite: '^5.0.0'
      }
    }, null, 2);
  }
  
  private generateReadme(projectName: string): string {
    return `# ${projectName}

Built with [OpenBuild](https://github.com/yourusername/openbuild) - Open Source Website Builder

## Getting Started

### Option 1: Simple HTTP Server
\`\`\`bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx serve
\`\`\`

### Option 2: Vite Dev Server
\`\`\`bash
npm install
npm run dev
\`\`\`

## Deployment

### Vercel
\`\`\`bash
npx vercel
\`\`\`

### Netlify
\`\`\`bash
npx netlify deploy
\`\`\`

### GitHub Pages
Push to a GitHub repository and enable Pages in settings.

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
.idea`;
  }
  
  private generateVercelConfig(): string {
    return JSON.stringify({
      version: 2,
      builds: [
        {
          src: 'index.html',
          use: '@vercel/static'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/index.html'
        }
      ]
    }, null, 2);
  }
  
  private generateNetlifyConfig(): string {
    return `[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;
  }
}

export const exportManager = new ExportManager();