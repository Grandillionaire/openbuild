import Handlebars from 'handlebars';
import prettier from 'prettier';
import htmlPlugin from 'prettier/plugins/html';
import cssPlugin from 'prettier/plugins/postcss';
import { componentDefinitions } from '@/config/components';
import type { Component, Animation } from '@/types/component';

export class CodeGenerator {
  private htmlTemplate!: HandlebarsTemplateDelegate;
  
  constructor() {
    this.registerTemplates();
    this.registerHelpers();
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
    
    this.htmlTemplate = Handlebars.compile(htmlTemplateSource);
  }
  
  private registerHelpers() {
    Handlebars.registerHelper('json', (context) => {
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
  }): Promise<{
    html: string;
    css: string;
    fullPage: string;
  }> {
    // Generate HTML for all components
    const html = this.generateHTML(components);
    
    // Generate CSS for all components
    const css = this.generateCSS(components, options);
    
    // Format with Prettier
    const formattedHTML = await this.formatHTML(html);
    const formattedCSS = await this.formatCSS(css);
    
    // Generate all JavaScript (animations + custom code)
    let allJS = this.generateCustomJS(components);
    
    // Add global custom JavaScript
    if (options?.globalCustomCode?.javascript) {
      allJS = `${allJS}\n\n/* Global Custom JavaScript */\n${options.globalCustomCode.javascript}`;
    }
    
    // Generate full page
    const fullPage = this.htmlTemplate({
      title: projectName,
      description: `Built with OpenBuild`,
      html: formattedHTML,
      css: formattedCSS,
      js: allJS,
      headHTML: options?.globalCustomCode?.headHTML
    });
    
    return {
      html: formattedHTML,
      css: formattedCSS,
      fullPage: await this.formatHTML(fullPage)
    };
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
      .map(([key, value]) => `  ${key}: ${value};`)
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
      return await prettier.format(html, {
        parser: 'html',
        plugins: [htmlPlugin],
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
      return await prettier.format(css, {
        parser: 'css',
        plugins: [cssPlugin],
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