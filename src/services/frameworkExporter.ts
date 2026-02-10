/**
 * Framework Exporter Service
 * Generates React JSX and Vue SFC components from OpenBuild component tree.
 */

import type { Component, ResponsiveStyles } from '@/types/component';

export type ExportFramework = 'html' | 'react' | 'vue';

export interface ExportedFile {
  path: string;
  content: string;
  type: 'component' | 'style' | 'config' | 'index';
}

export interface ExportResult {
  files: ExportedFile[];
  framework: ExportFramework;
  componentCount: number;
}

class FrameworkExporter {
  /**
   * Export components to the specified framework
   */
  async export(
    components: Component[],
    framework: ExportFramework,
    projectName: string
  ): Promise<ExportResult> {
    switch (framework) {
      case 'react':
        return this.exportToReact(components, projectName);
      case 'vue':
        return this.exportToVue(components, projectName);
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  }

  /**
   * Export to React JSX components
   */
  private async exportToReact(components: Component[], projectName: string): Promise<ExportResult> {
    const files: ExportedFile[] = [];
    let componentCount = 0;

    // Generate main App component
    const appComponent = this.generateReactApp(components, projectName);
    files.push({
      path: 'src/App.jsx',
      content: appComponent,
      type: 'component'
    });

    // Generate individual components
    for (const component of components) {
      const { jsx, css } = this.componentToReact(component);
      const componentName = this.toPascalCase(component.displayName);
      
      files.push({
        path: `src/components/${componentName}.jsx`,
        content: jsx,
        type: 'component'
      });

      if (css) {
        files.push({
          path: `src/components/${componentName}.css`,
          content: css,
          type: 'style'
        });
      }

      componentCount++;
    }

    // Generate index.js
    files.push({
      path: 'src/index.js',
      content: this.generateReactIndex(),
      type: 'index'
    });

    // Generate package.json
    files.push({
      path: 'package.json',
      content: this.generateReactPackageJson(projectName),
      type: 'config'
    });

    // Generate global styles
    files.push({
      path: 'src/index.css',
      content: this.generateGlobalCSS(),
      type: 'style'
    });

    return { files, framework: 'react', componentCount };
  }

  /**
   * Export to Vue SFC components
   */
  private async exportToVue(components: Component[], projectName: string): Promise<ExportResult> {
    const files: ExportedFile[] = [];
    let componentCount = 0;

    // Generate main App component
    const appComponent = this.generateVueApp(components, projectName);
    files.push({
      path: 'src/App.vue',
      content: appComponent,
      type: 'component'
    });

    // Generate individual components
    for (const component of components) {
      const sfc = this.componentToVue(component);
      const componentName = this.toPascalCase(component.displayName);
      
      files.push({
        path: `src/components/${componentName}.vue`,
        content: sfc,
        type: 'component'
      });

      componentCount++;
    }

    // Generate main.js
    files.push({
      path: 'src/main.js',
      content: this.generateVueMain(),
      type: 'index'
    });

    // Generate package.json
    files.push({
      path: 'package.json',
      content: this.generateVuePackageJson(projectName),
      type: 'config'
    });

    // Generate vite.config.js
    files.push({
      path: 'vite.config.js',
      content: this.generateViteConfig(),
      type: 'config'
    });

    return { files, framework: 'vue', componentCount };
  }

  /**
   * Convert a component to React JSX
   */
  private componentToReact(component: Component): { jsx: string; css: string } {
    const componentName = this.toPascalCase(component.displayName);
    const className = this.toKebabCase(component.displayName);
    const css = this.stylesToCSS(component.styles, className);

    const childrenJsx = component.children?.length
      ? component.children.map(child => this.renderReactChild(child)).join('\n        ')
      : this.getComponentContent(component);

    const propsInterface = this.generatePropsInterface(component);
    
    const jsx = `import React from 'react';
import './${componentName}.css';

${propsInterface}

export function ${componentName}({ children, className = '', ...props }) {
  return (
    <${this.getHtmlTag(component.type)}
      className={\`${className} \${className}\`}
      {...props}
    >
      ${childrenJsx || '{children}'}
    </${this.getHtmlTag(component.type)}>
  );
}

export default ${componentName};
`;

    return { jsx, css };
  }

  /**
   * Convert a component to Vue SFC
   */
  private componentToVue(component: Component): string {
    const componentName = this.toPascalCase(component.displayName);
    const className = this.toKebabCase(component.displayName);
    const css = this.stylesToCSS(component.styles, className);

    const childrenTemplate = component.children?.length
      ? component.children.map(child => this.renderVueChild(child)).join('\n      ')
      : this.getComponentContent(component) || '<slot />';

    return `<template>
  <${this.getHtmlTag(component.type)}
    :class="['${className}', customClass]"
    v-bind="$attrs"
  >
    ${childrenTemplate}
  </${this.getHtmlTag(component.type)}>
</template>

<script setup>
defineOptions({
  name: '${componentName}',
  inheritAttrs: false
});

defineProps({
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
${css}
</style>
`;
  }

  /**
   * Render a child component for React
   */
  private renderReactChild(component: Component, depth: number = 0): string {
    const indent = '  '.repeat(depth);
    const className = this.toKebabCase(component.displayName);
    const tag = this.getHtmlTag(component.type);
    const content = this.getComponentContent(component);
    const styleObj = this.stylesToInlineObject(component.styles);

    if (component.children?.length) {
      const children = component.children
        .map(child => this.renderReactChild(child, depth + 1))
        .join('\n');
      return `${indent}<${tag} className="${className}" style={${styleObj}}>
${children}
${indent}</${tag}>`;
    }

    return `${indent}<${tag} className="${className}" style={${styleObj}}>${content || ''}</${tag}>`;
  }

  /**
   * Render a child component for Vue
   */
  private renderVueChild(component: Component, depth: number = 0): string {
    const indent = '  '.repeat(depth);
    const className = this.toKebabCase(component.displayName);
    const tag = this.getHtmlTag(component.type);
    const content = this.getComponentContent(component);
    const styleStr = this.stylesToInlineString(component.styles);

    if (component.children?.length) {
      const children = component.children
        .map(child => this.renderVueChild(child, depth + 1))
        .join('\n');
      return `${indent}<${tag} class="${className}" style="${styleStr}">
${children}
${indent}</${tag}>`;
    }

    return `${indent}<${tag} class="${className}" style="${styleStr}">${content || ''}</${tag}>`;
  }

  /**
   * Generate React App component
   */
  private generateReactApp(components: Component[], projectName: string): string {
    const imports = components
      .map(c => `import ${this.toPascalCase(c.displayName)} from './components/${this.toPascalCase(c.displayName)}';`)
      .join('\n');

    const componentUsage = components
      .map(c => `      <${this.toPascalCase(c.displayName)} />`)
      .join('\n');

    return `import React from 'react';
import './index.css';
${imports}

function App() {
  return (
    <div className="app">
${componentUsage}
    </div>
  );
}

export default App;
`;
  }

  /**
   * Generate Vue App component
   */
  private generateVueApp(components: Component[], projectName: string): string {
    const imports = components
      .map(c => `import ${this.toPascalCase(c.displayName)} from './components/${this.toPascalCase(c.displayName)}.vue';`)
      .join('\n');

    const componentUsage = components
      .map(c => `    <${this.toPascalCase(c.displayName)} />`)
      .join('\n');

    return `<template>
  <div class="app">
${componentUsage}
  </div>
</template>

<script setup>
${imports}
</script>

<style>
@import './assets/main.css';

.app {
  min-height: 100vh;
}
</style>
`;
  }

  /**
   * Generate React index.js
   */
  private generateReactIndex(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  }

  /**
   * Generate Vue main.js
   */
  private generateVueMain(): string {
    return `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
`;
  }

  /**
   * Generate React package.json
   */
  private generateReactPackageJson(projectName: string): string {
    return JSON.stringify({
      name: this.toKebabCase(projectName),
      version: '1.0.0',
      private: true,
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.2.0',
        'vite': '^5.0.0'
      },
      scripts: {
        'dev': 'vite',
        'build': 'vite build',
        'preview': 'vite preview'
      }
    }, null, 2);
  }

  /**
   * Generate Vue package.json
   */
  private generateVuePackageJson(projectName: string): string {
    return JSON.stringify({
      name: this.toKebabCase(projectName),
      version: '1.0.0',
      private: true,
      dependencies: {
        'vue': '^3.4.0'
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^5.0.0',
        'vite': '^5.0.0'
      },
      scripts: {
        'dev': 'vite',
        'build': 'vite build',
        'preview': 'vite preview'
      }
    }, null, 2);
  }

  /**
   * Generate Vite config
   */
  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
`;
  }

  /**
   * Generate global CSS
   */
  private generateGlobalCSS(): string {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  color: #1f2937;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hide-on-tablet {
    display: none !important;
  }
}

@media (min-width: 1025px) {
  .hide-on-desktop {
    display: none !important;
  }
}
`;
  }

  /**
   * Generate props interface for React component
   */
  private generatePropsInterface(component: Component): string {
    return `/**
 * Props for ${this.toPascalCase(component.displayName)} component
 * @typedef {Object} ${this.toPascalCase(component.displayName)}Props
 * @property {React.ReactNode} [children] - Child elements
 * @property {string} [className] - Additional CSS classes
 */`;
  }

  /**
   * Convert styles object to CSS string
   */
  private stylesToCSS(styles: ResponsiveStyles, className: string): string {
    const baseStyles = this.objectToCSSProperties(styles.base || {});
    
    let css = `.${className} {\n${baseStyles}}\n`;

    // Add responsive styles
    if (styles.sm) {
      css += `\n@media (max-width: 640px) {\n  .${className} {\n${this.objectToCSSProperties(styles.sm, '    ')}  }\n}\n`;
    }
    if (styles.md) {
      css += `\n@media (max-width: 768px) {\n  .${className} {\n${this.objectToCSSProperties(styles.md, '    ')}  }\n}\n`;
    }
    if (styles.lg) {
      css += `\n@media (max-width: 1024px) {\n  .${className} {\n${this.objectToCSSProperties(styles.lg, '    ')}  }\n}\n`;
    }

    return css;
  }

  /**
   * Convert styles to inline React style object string
   */
  private stylesToInlineObject(styles: ResponsiveStyles): string {
    const styleObj: Record<string, string | number> = {};
    const base = styles.base || {};

    for (const [key, value] of Object.entries(base)) {
      const camelKey = this.toCamelCase(key);
      styleObj[camelKey] = value;
    }

    return JSON.stringify(styleObj);
  }

  /**
   * Convert styles to inline style string for Vue
   */
  private stylesToInlineString(styles: ResponsiveStyles): string {
    const base = styles.base || {};
    return Object.entries(base)
      .map(([key, value]) => `${this.toKebabCase(key)}: ${value}`)
      .join('; ');
  }

  /**
   * Convert object to CSS properties string
   */
  private objectToCSSProperties(obj: Record<string, any>, indent: string = '  '): string {
    return Object.entries(obj)
      .map(([key, value]) => `${indent}${this.toKebabCase(key)}: ${value};`)
      .join('\n') + '\n';
  }

  /**
   * Get HTML tag for component type
   */
  private getHtmlTag(type: string): string {
    const tagMap: Record<string, string> = {
      container: 'div',
      section: 'section',
      div: 'div',
      grid: 'div',
      flex: 'div',
      heading: 'h2',
      text: 'p',
      button: 'button',
      link: 'a',
      image: 'img',
      hero: 'section',
      features: 'section',
      cta: 'section',
      footer: 'footer',
      navigation: 'nav',
      form: 'form',
      input: 'input',
      textarea: 'textarea',
      select: 'select',
    };
    return tagMap[type] || 'div';
  }

  /**
   * Get component content based on type and props
   */
  private getComponentContent(component: Component): string {
    if (component.type === 'image') {
      return ''; // Images are self-closing
    }
    
    const content = component.props?.content;
    if (typeof content === 'string') {
      return content;
    }
    
    return '';
  }

  /**
   * Convert string to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
      .replace(/^(.)/, (_, char) => char.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Convert string to kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Convert string to camelCase
   */
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }
}

export const frameworkExporter = new FrameworkExporter();
