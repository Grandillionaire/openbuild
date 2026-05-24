import { componentDefinitions } from '@/config/components';
import type { Component, Animation } from '@/types/component';
import type { CommerceSettings, Product } from '@/types/commerce';
import { getCommerceRuntimeScript } from './commerceRuntime';
import { findAnalyticsProvider } from './integrations/analytics';
import { findFormProvider } from './integrations/forms';
import type { IntegrationConfig } from './integrations/types';

export class CodeGenerator {
  private htmlTemplate: any;
  private Handlebars: any;
  private prettier: any;
  private htmlPlugin: any;
  private cssPlugin: any;
  private isInitialized = false;
  
  constructor() {
    // Lazy initialization
  }
  
  private async ensureInitialized() {
    if (this.isInitialized) return;
    
    // Dynamic imports to reduce initial bundle size
    const [handlebarsModule, prettierModule, htmlPluginModule, cssPluginModule] = await Promise.all([
      import('handlebars'),
      import('prettier'),
      import('prettier/plugins/html'),
      import('prettier/plugins/postcss')
    ]);
    
    this.Handlebars = handlebarsModule.default;
    this.prettier = prettierModule.default;
    this.htmlPlugin = htmlPluginModule.default;
    this.cssPlugin = cssPluginModule.default;
    
    this.registerTemplates();
    this.registerHelpers();
    this.isInitialized = true;
  }
  
  private registerTemplates() {
    const htmlTemplateSource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    <style>
        {{{css}}}
    </style>
    {{#if headHTML}}
    {{{headHTML}}}
    {{/if}}
</head>
<body>
    {{{html}}}
    {{#if js}}
    <script>
        {{{js}}}
    </script>
    {{/if}}
</body>
</html>`;
    
    this.htmlTemplate = this.Handlebars.compile(htmlTemplateSource);
  }
  
  private registerHelpers() {
    this.Handlebars.registerHelper('json', (context: unknown) => {
      return JSON.stringify(context, null, 2);
    });
  }
  
  async generateProject(components: Component[], projectName: string, options?: {
    includeTheme?: boolean;
    themeVariables?: Record<string, string>;
    globalCustomCode?: {
      css?: string;
      javascript?: string;
      headHTML?: string;
    };
    commerce?: {
      enabled: boolean;
      products: ReadonlyArray<Product>;
      settings: CommerceSettings;
    };
    seo?: {
      title?: string;
      description?: string;
      ogImage?: string;
      canonicalUrl?: string;
    };
    integrations?: {
      analytics?: IntegrationConfig | null;
      forms?: IntegrationConfig | null;
    };
  }): Promise<{
    html: string;
    css: string;
    fullPage: string;
  }> {
    await this.ensureInitialized();
    // Generate HTML for all components
    let html = this.generateHTML(components);

    // Inject form-provider action + hidden fields into [data-ob-form] elements
    if (options?.integrations?.forms?.enabled) {
      html = this.applyFormProvider(html, options.integrations.forms);
    }

    // Generate CSS for all components
    const css = this.generateCSS(components, options);

    // Format with Prettier
    const formattedHTML = await this.formatHTML(html);
    const formattedCSS = await this.formatCSS(css);

    // Generate all JavaScript (animations + custom code)
    let allJS = this.generateCustomJS(components);

    // Inject commerce runtime if enabled
    if (options?.commerce?.enabled) {
      allJS = `${getCommerceRuntimeScript(options.commerce.products, options.commerce.settings)}\n\n${allJS}`;
    }

    // Inject newsletter/form AJAX runtime if any form provider is configured
    if (options?.integrations?.forms?.enabled) {
      allJS = `${this.getFormRuntimeScript()}\n\n${allJS}`;
    }

    // Add global custom JavaScript
    if (options?.globalCustomCode?.javascript) {
      allJS = `${allJS}\n\n/* Global Custom JavaScript */\n${options.globalCustomCode.javascript}`;
    }

    const seoMeta = this.buildSeoMeta(projectName, options?.seo);
    const analyticsHead = this.buildAnalyticsHead(options?.integrations?.analytics);
    const analyticsBody = this.buildAnalyticsBodyEnd(options?.integrations?.analytics);

    // Generate full page
    const fullPage = this.htmlTemplate({
      title: options?.seo?.title || projectName,
      description: options?.seo?.description || 'Built with OpenBuild',
      html: formattedHTML + (analyticsBody ? `\n${analyticsBody}` : ''),
      css: formattedCSS,
      js: allJS,
      headHTML: `${seoMeta}\n${analyticsHead}\n${options?.globalCustomCode?.headHTML ?? ''}`,
    });
    
    return {
      html: formattedHTML,
      css: formattedCSS,
      fullPage: await this.formatHTML(fullPage)
    };
  }

  /**
   * Replace `data-ob-form-action="<kind>"` placeholders with the configured
   * form provider's action URL, and inject any required hidden inputs before
   * the closing `</form>`. Forms without the marker (manual action URLs) are
   * left untouched.
   */
  private applyFormProvider(html: string, cfg: IntegrationConfig): string {
    const provider = findFormProvider(cfg.providerId);
    if (!provider) return html;
    const built = provider.buildFormAction(cfg.values);
    const hiddenFields = built.hiddenFields
      .map(
        (f) =>
          `<input type="hidden" name="${this.attr(f.name)}" value="${this.attr(f.value)}">`,
      )
      .join('');

    // Replace the marker with action="…" method="…"
    let out = html.replace(
      /data-ob-form-action="[^"]*"/g,
      `action="${this.attr(built.action)}" method="${built.method}"`,
    );

    // For each <form data-ob-form="…"> insert hidden fields before </form>.
    out = out.replace(
      /(<form\b[^>]*data-ob-form="[^"]+"[^>]*>)([\s\S]*?)(<\/form>)/g,
      (_match, open, inner, close) => `${open}${inner}${hiddenFields}${close}`,
    );
    return out;
  }

  /** Tiny vanilla-JS AJAX submitter for forms tagged with `data-ob-form`. */
  private getFormRuntimeScript(): string {
    return `(function(){
  document.addEventListener('submit', async function(e){
    var form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute('data-ob-form')) return;
    e.preventDefault();
    var status = form.parentElement ? form.parentElement.querySelector('.newsletter-status, [data-ob-form-status]') : null;
    var setStatus = function(msg, state){
      if (!status) return;
      status.textContent = msg;
      if (state) status.setAttribute('data-state', state); else status.removeAttribute('data-state');
    };
    setStatus('');
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    try {
      var data = new FormData(form);
      var resp = await fetch(form.action, {
        method: form.method || 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (resp.ok || resp.status === 200) {
        setStatus(form.getAttribute('data-ob-success') || 'Thanks!', null);
        form.reset();
      } else {
        setStatus('Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      setStatus('Network error. Please try again.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();`;
  }

  private attr(v: string): string {
    return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  /** Build the analytics <script> snippets to inject in <head>. */
  private buildAnalyticsHead(cfg?: IntegrationConfig | null): string {
    if (!cfg?.enabled) return '';
    const provider = findAnalyticsProvider(cfg.providerId);
    if (!provider) return '';
    try {
      return provider.buildSnippet(cfg.values).head ?? '';
    } catch {
      return '';
    }
  }

  /** Build the analytics snippets to inject just before </body>. */
  private buildAnalyticsBodyEnd(cfg?: IntegrationConfig | null): string {
    if (!cfg?.enabled) return '';
    const provider = findAnalyticsProvider(cfg.providerId);
    if (!provider) return '';
    try {
      return provider.buildSnippet(cfg.values).bodyEnd ?? '';
    } catch {
      return '';
    }
  }

  /**
   * Build SEO / social metadata for the <head>. Caller passes optional values
   * — anything we don't get is synthesized from the project name so exports
   * always include the minimum recommended set.
   */
  private buildSeoMeta(
    projectName: string,
    seo?: { title?: string; description?: string; ogImage?: string; canonicalUrl?: string },
  ): string {
    const title = seo?.title || projectName;
    const description = seo?.description || `${projectName} — built with OpenBuild`;
    const ogImage = seo?.ogImage;
    const canonical = seo?.canonicalUrl;
    const esc = (s: string) =>
      String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const tags: string[] = [
      `<meta name="generator" content="OpenBuild">`,
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(description)}">`,
      `<meta property="og:type" content="website">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(title)}">`,
      `<meta name="twitter:description" content="${esc(description)}">`,
    ];
    if (ogImage) {
      tags.push(`<meta property="og:image" content="${esc(ogImage)}">`);
      tags.push(`<meta name="twitter:image" content="${esc(ogImage)}">`);
    }
    if (canonical) {
      tags.push(`<link rel="canonical" href="${esc(canonical)}">`);
      tags.push(`<meta property="og:url" content="${esc(canonical)}">`);
    }
    return tags.join('\n');
  }


  private generateHTML(components: Component[]): string {
    return components.map(component => 
      this.generateComponentHTML(component)
    ).join('\n\n');
  }
  
  private generateComponentHTML(component: Component): string {
    const definition = componentDefinitions[component.type];
    if (!definition) return '';
    
    return definition.generateHTML(component);
  }
  
  private generateCSS(components: Component[], options?: {
    includeTheme?: boolean;
    themeVariables?: Record<string, string>;
    globalCustomCode?: {
      css?: string;
      javascript?: string;
      headHTML?: string;
    };
  }): string {
    // CSS Reset
    const reset = this.getCSSReset();
    
    // Theme variables
    let themeCSS = '';
    if (options?.includeTheme && options.themeVariables) {
      themeCSS = this.generateThemeCSS(options.themeVariables);
    }
    
    // Component styles
    const componentCSS = components.map(component => 
      this.generateComponentCSS(component)
    ).join('\n\n');
    
    // Animation styles
    const animationCSS = this.generateAnimationCSS(components);
    
    // Custom CSS
    const customCSS = this.generateCustomCSS(components);
    
    // Global custom CSS
    const globalCSS = options?.globalCustomCode?.css ? `\n/* Global Custom CSS */\n${options.globalCustomCode.css}` : '';
    
    return `${reset}\n\n${themeCSS}\n\n${animationCSS}\n\n${componentCSS}\n\n${customCSS}${globalCSS}`;
  }
  
  private generateThemeCSS(variables: Record<string, string>): string {
    const cssVars = Object.entries(variables)
      .filter(([key]) => /^--[a-zA-Z0-9-]+$/.test(key))
      .map(([key, value]) => {
        // Sanitize CSS values - remove anything that could break out of the declaration
        const safeValue = value.replace(/[{}]/g, '').replace(/;(?!$)/g, '');
        return `  ${key}: ${safeValue};`;
      })
      .join('\n');

    return `:root {\n${cssVars}\n}`;
  }
  
  private generateComponentCSS(component: Component): string {
    const definition = componentDefinitions[component.type];
    if (!definition) return '';
    
    let css = definition.generateCSS(component);
    
    // Add animation classes if component has animations
    if (component.props.animations && component.props.animations.length > 0) {
      css += '\n' + this.generateComponentAnimationClasses(component);
    }
    
    // Recursively generate CSS for children
    if (component.children) {
      css += '\n' + component.children.map(child => 
        this.generateComponentCSS(child)
      ).join('\n');
    }
    
    return css;
  }

  private generateAnimationCSS(components: Component[]): string {
    const allAnimations: Animation[] = [];
    
    // Collect all animations from all components
    function collectAnimations(comps: Component[]) {
      comps.forEach(component => {
        if (component.props.animations) {
          allAnimations.push(...component.props.animations);
        }
        if (component.children) {
          collectAnimations(component.children);
        }
      });
    }
    
    collectAnimations(components);
    
    if (allAnimations.length === 0) return '';
    
    // Generate keyframes for all animations
    const keyframes = allAnimations
      .map(animation => this.generateAnimationKeyframes(animation))
      .join('\n\n');
    
    return `/* Animations */\n${keyframes}`;
  }

  private generateAnimationKeyframes(animation: Animation): string {
    const animationId = `animation-${animation.id}`;
    
    // Map animation names to preset keyframes
    const presetKeyframes: Record<string, string> = {
      'Fade In': `@keyframes ${animationId} {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
      'Slide In Left': `@keyframes ${animationId} {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
      'Slide In Right': `@keyframes ${animationId} {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
      'Slide In Top': `@keyframes ${animationId} {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
      'Slide In Bottom': `@keyframes ${animationId} {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
      'Scale In': `@keyframes ${animationId} {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
      'Bounce In': `@keyframes ${animationId} {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}`,
      'Pulse': `@keyframes ${animationId} {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}`,
      'Shake': `@keyframes ${animationId} {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}`,
      'Float': `@keyframes ${animationId} {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}`,
      'Spin': `@keyframes ${animationId} {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`
    };
    
    // If animation has custom timeline, generate from that
    if (animation.timeline && animation.timeline.length > 0) {
      const keyframes = animation.timeline.map((keyframe) => {
        const percentage = keyframe.time * 100;
        const properties = Object.entries(keyframe.properties)
          .map(([key, value]) => {
            const cssKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            return `${cssKey}: ${value}`;
          })
          .join('; ');
        return `  ${percentage}% { ${properties} }`;
      }).join('\n');
      
      return `@keyframes ${animationId} {\n${keyframes}\n}`;
    }
    
    // Otherwise use preset
    return presetKeyframes[animation.name] || presetKeyframes['Fade In'];
  }

  private generateComponentAnimationClasses(component: Component): string {
    const animations = component.props.animations || [];
    const componentSelector = `#${component.id}`;
    
    const animationRules = animations.map(animation => {
      const animationName = `animation-${animation.id}`;
      const duration = `${animation.options.duration}ms`;
      const delay = `${animation.options.delay}ms`;
      const easing = animation.options.easing;
      const direction = animation.options.direction || 'normal';
      const iterations = animation.options.loop ? 'infinite' : '1';
      
      // Base animation property
      const animationProperty = `${animationName} ${duration} ${easing} ${delay} ${iterations} ${direction} both`;
      
      // Generate CSS based on trigger type
      switch (animation.trigger) {
        case 'onLoad':
          return `${componentSelector} {
  animation: ${animationProperty};
}`;
        
        case 'onHover':
          return `${componentSelector}:hover {
  animation: ${animationProperty};
}`;
        
        case 'onScroll':
          // For scroll animations, we'll add a class when in view
          return `${componentSelector}.in-view {
  animation: ${animationProperty};
}`;
        
        case 'onClick':
          return `${componentSelector}.clicked {
  animation: ${animationProperty};
}`;
        
        case 'continuous':
          return `${componentSelector} {
  animation: ${animationProperty};
}`;
        
        default:
          return '';
      }
    }).filter(rule => rule !== '');
    
    return animationRules.join('\n\n');
  }
  
  private generateAnimationJS(components: Component[]): string {
    const hasScrollAnimations = this.hasAnimationType(components, 'onScroll');
    const hasClickAnimations = this.hasAnimationType(components, 'onClick');
    
    if (!hasScrollAnimations && !hasClickAnimations) return '';
    
    let js = '';
    
    // Scroll animation observer
    if (hasScrollAnimations) {
      js += `
// Scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, {
  threshold: 0.5,
  rootMargin: '0px'
});

// Observe all elements with scroll animations
document.querySelectorAll('[data-scroll-animation]').forEach((element) => {
  scrollObserver.observe(element);
});`;
    }
    
    // Click animations
    if (hasClickAnimations) {
      js += `
      
// Click animations
document.querySelectorAll('[data-click-animation]').forEach((element) => {
  element.addEventListener('click', function() {
    this.classList.remove('clicked');
    // Force reflow
    void this.offsetWidth;
    this.classList.add('clicked');
    
    // Remove class after animation completes
    const animationDuration = parseInt(this.getAttribute('data-animation-duration') || '1000');
    setTimeout(() => {
      this.classList.remove('clicked');
    }, animationDuration);
  });
});`;
    }
    
    return js.trim();
  }
  
  private hasAnimationType(components: Component[], trigger: string): boolean {
    function checkComponents(comps: Component[]): boolean {
      return comps.some(component => {
        const hasAnimation = component.props.animations?.some(anim => anim.trigger === trigger) || false;
        const childrenHaveAnimation = component.children ? checkComponents(component.children) : false;
        return hasAnimation || childrenHaveAnimation;
      });
    }
    return checkComponents(components);
  }

  private generateCustomCSS(components: Component[]): string {
    const customStyles: string[] = [];
    
    // Collect custom CSS from all components
    function collectCustomCSS(comps: Component[]) {
      comps.forEach(component => {
        // Ensure customCode exists and has proper structure
        const customCode = component.props?.customCode;
        if (!customCode || !customCode.css) {
          return;
        }
        
        // Ensure css is a string
        const cssContent = typeof customCode.css === 'string' ? customCode.css : '';
        
        if (cssContent.trim()) {
          const lines = cssContent.split('\n');
          const scopedCSS = lines
            .map(line => {
              // Simple scoping - prepend component ID to selectors
              if (line.trim() && !line.trim().startsWith('/*') && !line.trim().startsWith('*')) {
                if (line.includes('{')) {
                  return `#${component.id} ${line}`;
                }
              }
              return line;
            })
            .join('\n');
          
          customStyles.push(`/* Custom CSS for #${component.id} */\n${scopedCSS}`);
        }
        
        if (component.children) {
          collectCustomCSS(component.children);
        }
      });
    }
    
    collectCustomCSS(components);
    
    return customStyles.length > 0 
      ? `\n/* Custom Component Styles */\n${customStyles.join('\n\n')}`
      : '';
  }

  private generateCustomJS(components: Component[]): string {
    const jsCode: string[] = [];
    
    // Collect all custom JS
    function collectCustomJS(comps: Component[]) {
      comps.forEach(component => {
        const customCode = component.props.customCode;
        if (!customCode) return;
        
        const componentJS: string[] = [];
        
        // Component-scoped wrapper
        componentJS.push(`// Custom code for #${component.id}`);
        componentJS.push(`(function() {`);
        componentJS.push(`  const element = document.getElementById('${component.id}');`);
        componentJS.push(`  if (!element) return;`);
        componentJS.push('');
        
        // Lifecycle hooks
        if (customCode.beforeMount) {
          componentJS.push(`  // Before Mount`);
          componentJS.push(`  ${customCode.beforeMount}`);
          componentJS.push('');
        }
        
        if (customCode.onMount) {
          componentJS.push(`  // On Mount`);
          componentJS.push(`  ${customCode.onMount}`);
          componentJS.push('');
        }
        
        // Event handlers
        if (customCode.onClick) {
          componentJS.push(`  // Click handler`);
          componentJS.push(`  element.addEventListener('click', function(event) {`);
          componentJS.push(`    ${customCode.onClick}`);
          componentJS.push(`  });`);
          componentJS.push('');
        }
        
        if (customCode.onHover) {
          componentJS.push(`  // Hover handler`);
          componentJS.push(`  element.addEventListener('mouseenter', function(event) {`);
          componentJS.push(`    ${customCode.onHover}`);
          componentJS.push(`  });`);
          componentJS.push('');
        }
        
        if (customCode.onScroll) {
          componentJS.push(`  // Scroll handler`);
          componentJS.push(`  const scrollHandler = function() {`);
          componentJS.push(`    const rect = element.getBoundingClientRect();`);
          componentJS.push(`    const inView = rect.top < window.innerHeight && rect.bottom > 0;`);
          componentJS.push(`    if (inView) {`);
          componentJS.push(`      ${customCode.onScroll}`);
          componentJS.push(`    }`);
          componentJS.push(`  };`);
          componentJS.push(`  window.addEventListener('scroll', scrollHandler);`);
          componentJS.push(`  scrollHandler(); // Check initial state`);
          componentJS.push('');
        }
        
        // General JavaScript
        if (customCode.javascript) {
          componentJS.push(`  // Custom JavaScript`);
          componentJS.push(`  ${customCode.javascript}`);
        }
        
        componentJS.push(`})();`);
        
        if (componentJS.length > 4) { // Only add if there's actual content
          jsCode.push(componentJS.join('\n'));
        }
        
        if (component.children) {
          collectCustomJS(component.children);
        }
      });
    }
    
    collectCustomJS(components);
    
    // Combine with animation JS
    const animationJS = this.generateAnimationJS(components);
    const customComponentJS = jsCode.join('\n\n');
    
    const allJS = [animationJS, customComponentJS].filter(js => js).join('\n\n');
    
    return allJS;
  }

  private getCSSReset(): string {
    return `/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: #1F2937;
  background: white;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  font-size: inherit;
}

/* Gradient Animations */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}`;
  }
  
  private async formatHTML(html: string): Promise<string> {
    try {
      return await this.prettier.format(html, {
        parser: 'html',
        plugins: [this.htmlPlugin],
        printWidth: 100,
        tabWidth: 2,
        useTabs: false
      });
    } catch (error) {
      console.error('HTML formatting error:', error);
      return html;
    }
  }
  
  private async formatCSS(css: string): Promise<string> {
    try {
      return await this.prettier.format(css, {
        parser: 'css',
        plugins: [this.cssPlugin],
        printWidth: 100,
        tabWidth: 2,
        useTabs: false
      });
    } catch (error) {
      console.error('CSS formatting error:', error);
      return css;
    }
  }
}

export const codeGenerator = new CodeGenerator();