import type { ComponentDefinition, ComponentType, Component } from '@/types/component';
import { componentVariants } from './componentVariants';
import { formComponentDefinitions } from './formComponents';

// Helper function to add variants and theme support
function addVariantsToDefinition(definition: ComponentDefinition): ComponentDefinition {
  const variants = componentVariants[definition.type];
  return {
    ...definition,
    variants: variants || [],
    supportsTheme: true
  };
}

const baseComponentDefinitions: Record<ComponentType, ComponentDefinition> = {
  // Layout Components
  container: {
    type: 'container',
    displayName: 'Content Box',
    category: 'layout',
    icon: 'package',
    acceptsChildren: true,
    defaultProps: {
      attributes: {
        class: 'container'
      }
    },
    defaultStyles: {
      base: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        width: '100%'
      }
    },
    generateHTML: (component) => {
      const children = component.children?.map(c =>
        componentDefinitions[c.type] ? componentDefinitions[c.type].generateHTML(c) : ''
      ).join('\n') || '';
      return `<div class="c-${component.id}" id="${component.id}">\n${children}\n</div>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },
  
  section: {
    type: 'section',
    displayName: 'Page Section',
    category: 'layout',
    icon: 'layers',
    acceptsChildren: true,
    defaultProps: {
      attributes: {
        class: 'section'
      }
    },
    defaultStyles: {
      base: {
        padding: '60px 0',
        width: '100%'
      }
    },
    generateHTML: (component) => {
      const children = component.children?.map(c =>
        componentDefinitions[c.type] ? componentDefinitions[c.type].generateHTML(c) : ''
      ).join('\n') || '';
      return `<section class="c-${component.id}" id="${component.id}">\n${children}\n</section>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },

  div: {
    type: 'div' as any,
    displayName: 'Box',
    category: 'layout',
    icon: 'square',
    acceptsChildren: true,
    defaultProps: {},
    defaultStyles: {
      base: {
        display: 'block'
      }
    },
    generateHTML: (component) => {
      const children = component.children?.map(c =>
        componentDefinitions[c.type] ? componentDefinitions[c.type].generateHTML(c) : ''
      ).join('\n') || '';
      return `<div class="c-${component.id}" id="${component.id}">\n${children}\n</div>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },

  grid: {
    type: 'grid',
    displayName: 'Column Layout',
    category: 'layout',
    icon: 'grid',
    acceptsChildren: true,
    defaultProps: {
      attributes: {
        class: 'grid'
      },
      settings: {
        columns: 3,
        gap: '20px'
      }
    },
    defaultStyles: {
      base: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        width: '100%'
      }
    },
    generateHTML: (component) => {
      const children = component.children?.map(c =>
        componentDefinitions[c.type] ? componentDefinitions[c.type].generateHTML(c) : ''
      ).join('\n') || '';
      return `<div class="c-${component.id} grid" id="${component.id}">\n${children}\n</div>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },
  
  flex: {
    type: 'flex',
    displayName: 'Flex Container',
    category: 'layout',
    icon: 'move-horizontal',
    acceptsChildren: true,
    defaultProps: {
      attributes: {
        class: 'flex'
      }
    },
    defaultStyles: {
      base: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px'
      }
    },
    generateHTML: (component) => {
      const children = component.children?.map(c =>
        componentDefinitions[c.type] ? componentDefinitions[c.type].generateHTML(c) : ''
      ).join('\n') || '';
      return `<div class="c-${component.id} flex" id="${component.id}">\n${children}\n</div>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },
  
  spacer: {
    type: 'spacer',
    displayName: 'Spacer',
    category: 'layout',
    icon: 'separator-vertical',
    acceptsChildren: false,
    defaultProps: {},
    defaultStyles: {
      base: {
        height: '40px',
        width: '100%'
      }
    },
    generateHTML: (component) => {
      return `<div class="c-${component.id} spacer" id="${component.id}"></div>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },
  
  // Content Components
  heading: {
    type: 'heading',
    displayName: 'Heading',
    category: 'content',
    icon: 'heading',
    acceptsChildren: false,
    defaultProps: {
      content: 'Heading Text',
      attributes: {
        level: 'h2'
      }
    },
    defaultStyles: {
      base: {
        fontSize: '32px',
        fontWeight: '700',
        lineHeight: '1.2',
        marginBottom: '16px',
        color: '#1F2937'
      }
    },
    generateHTML: (component) => {
      const level = component.props.attributes?.level || 'h2';
      const content = component.props.content || 'Heading';
      return `<${level} class="c-${component.id}" id="${component.id}">${content}</${level}>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },
  
  text: {
    type: 'text',
    displayName: 'Text',
    category: 'content',
    icon: 'text',
    acceptsChildren: false,
    defaultProps: {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    defaultStyles: {
      base: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#4B5563',
        marginBottom: '16px'
      }
    },
    generateHTML: (component) => {
      const content = component.props.content || 'Text content';
      return `<p class="c-${component.id}" id="${component.id}">${content}</p>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },
  
  button: {
    type: 'button',
    displayName: 'Button',
    category: 'content',
    icon: 'rectangle-horizontal',
    acceptsChildren: false,
    defaultProps: {
      content: 'Click Me',
      attributes: {
        type: 'button',
        onclick: ''
      }
    },
    defaultStyles: {
      base: {
        padding: '12px 24px',
        backgroundColor: '#3B82F6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'inline-block'
      }
    },
    generateHTML: (component) => {
      const content = component.props.content || 'Button';
      const type = component.props.attributes?.type || 'button';
      const openTag = addAnimationAttributes(component, 'button', `type="${type}"`);
      return `${openTag}${content}</button>`;
    },
    generateCSS: (component) => {
      const css = generateResponsiveCSS(`.c-${component.id}`, component.styles);
      return css + `\n.c-${component.id}:hover { opacity: 0.9; transform: translateY(-1px); }`;
    }
  },
  
  link: {
    type: 'link',
    displayName: 'Link',
    category: 'content',
    icon: 'link',
    acceptsChildren: false,
    defaultProps: {
      content: 'Link Text',
      attributes: {
        href: '#',
        target: '_self'
      }
    },
    defaultStyles: {
      base: {
        color: '#3B82F6',
        textDecoration: 'underline',
        cursor: 'pointer',
        transition: 'color 0.2s'
      }
    },
    generateHTML: (component) => {
      const content = component.props.content || 'Link';
      const href = component.props.attributes?.href || '#';
      const target = component.props.attributes?.target || '_self';
      return `<a href="${href}" target="${target}" class="c-${component.id}" id="${component.id}">${content}</a>`;
    },
    generateCSS: (component) => {
      const css = generateResponsiveCSS(`.c-${component.id}`, component.styles);
      return css + `\n.c-${component.id}:hover { opacity: 0.8; }`;
    }
  },
  
  image: {
    type: 'image',
    displayName: 'Image',
    category: 'media',
    icon: 'image',
    acceptsChildren: false,
    defaultProps: {
      attributes: {
        src: 'https://via.placeholder.com/600x400',
        alt: 'Placeholder Image'
      }
    },
    defaultStyles: {
      base: {
        width: '100%',
        height: 'auto',
        display: 'block',
        borderRadius: '8px'
      }
    },
    generateHTML: (component) => {
      const src = component.props.src || component.props.attributes?.src || 'https://via.placeholder.com/600x400';
      const alt = component.props.alt || component.props.attributes?.alt || 'Image';
      const objectFit = component.props.objectFit || 'cover';
      const loading = component.props.loading || 'lazy';
      return `<img src="${src}" alt="${alt}" style="object-fit: ${objectFit};" loading="${loading}" class="c-${component.id}" id="${component.id}" />`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },

  icon: {
    type: 'icon' as any,
    displayName: 'Icon',
    category: 'media',
    icon: 'star',
    acceptsChildren: false,
    defaultProps: {
      iconName: 'star',
      size: 24,
      color: 'currentColor'
    },
    defaultStyles: {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    generateHTML: (component) => {
      const iconName = component.props.iconName || 'star';
      const size = component.props.size || 24;
      const color = component.props.color || 'currentColor';

      // Using common SVG icons as fallback
      const icons: Record<string, string> = {
        star: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
        check: `<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>`,
        heart: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`,
        settings: `<path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>`
      };

      const svgPath = icons[iconName] || icons.star;

      return `<svg class="c-${component.id}" id="${component.id}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">${svgPath}</svg>`;
    },
    generateCSS: (component) => {
      return generateResponsiveCSS(`.c-${component.id}`, component.styles);
    }
  },

  // Pre-built Blocks
  hero: {
    type: 'hero',
    displayName: 'Hero Section',
    category: 'blocks',
    icon: 'layout-template',
    acceptsChildren: true,
    defaultProps: {
      content: {
        heading: 'Welcome to Your Site',
        subheading: 'Build something amazing with OpenBuild',
        buttonText: 'Get Started'
      }
    },
    defaultStyles: {
      base: {
        padding: '100px 20px',
        textAlign: 'center',
        backgroundColor: '#F3F4F6',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    generateHTML: (component) => {
      const { heading, subheading, buttonText } = component.props.content as any;
      return `
        <section class="c-${component.id} hero" id="${component.id}">
          <div class="hero-content">
            <h1>${heading}</h1>
            <p>${subheading}</p>
            <button class="hero-btn">${buttonText}</button>
          </div>
        </section>
      `;
    },
    generateCSS: (component) => {
      const base = generateResponsiveCSS(`.c-${component.id}`, component.styles);
      return base + `
        .c-${component.id} h1 { font-size: 48px; margin-bottom: 16px; color: #1F2937; }
        .c-${component.id} p { font-size: 20px; margin-bottom: 32px; color: #6B7280; }
        .c-${component.id} .hero-btn { 
          padding: 14px 32px; 
          background: #3B82F6; 
          color: white; 
          border: none; 
          border-radius: 8px; 
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .c-${component.id} .hero-btn:hover { background: #2563EB; transform: translateY(-2px); }
      `;
    }
  },
  
  features: {
    type: 'features',
    displayName: 'Features Grid',
    category: 'blocks',
    icon: 'grid-3x3',
    acceptsChildren: false,
    defaultProps: {
      content: {
        features: [
          { icon: '🚀', title: 'Fast', description: 'Lightning quick performance' },
          { icon: '🎨', title: 'Beautiful', description: 'Stunning designs out of the box' },
          { icon: '🔧', title: 'Flexible', description: 'Customize everything' }
        ]
      }
    },
    defaultStyles: {
      base: {
        padding: '60px 20px',
        backgroundColor: 'white'
      }
    },
    generateHTML: (component) => {
      const { features } = component.props.content as any;
      const items = features.map((f: any) => `
        <div class="feature-item">
          <div class="feature-icon">${f.icon}</div>
          <h3>${f.title}</h3>
          <p>${f.description}</p>
        </div>
      `).join('');
      
      return `
        <section class="c-${component.id} features" id="${component.id}">
          <div class="features-grid">${items}</div>
        </section>
      `;
    },
    generateCSS: (component) => {
      const base = generateResponsiveCSS(`.c-${component.id}`, component.styles);
      return base + `
        .c-${component.id} .features-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .c-${component.id} .feature-item { text-align: center; }
        .c-${component.id} .feature-icon { font-size: 48px; margin-bottom: 16px; }
        .c-${component.id} .feature-item h3 { font-size: 24px; margin-bottom: 8px; color: #1F2937; }
        .c-${component.id} .feature-item p { color: #6B7280; line-height: 1.6; }
      `;
    }
  },
  
  cta: {
    type: 'cta',
    displayName: 'Call to Action',
    category: 'blocks',
    icon: 'megaphone',
    acceptsChildren: false,
    defaultProps: {
      content: {
        heading: 'Ready to get started?',
        description: 'Join thousands of satisfied customers today.',
        buttonText: 'Start Free Trial'
      }
    },
    defaultStyles: {
      base: {
        padding: '80px 20px',
        backgroundColor: '#3B82F6',
        textAlign: 'center',
        color: 'white'
      }
    },
    generateHTML: (component) => {
      const { heading, description, buttonText } = component.props.content as any;
      return `
        <section class="c-${component.id} cta" id="${component.id}">
          <div class="cta-content">
            <h2>${heading}</h2>
            <p>${description}</p>
            <button class="cta-btn">${buttonText}</button>
          </div>
        </section>
      `;
    },
    generateCSS: (component) => {
      const base = generateResponsiveCSS(`.c-${component.id}`, component.styles);
      return base + `
        .c-${component.id} .cta-content { max-width: 600px; margin: 0 auto; }
        .c-${component.id} h2 { font-size: 36px; margin-bottom: 16px; }
        .c-${component.id} p { font-size: 18px; margin-bottom: 32px; opacity: 0.95; }
        .c-${component.id} .cta-btn { 
          padding: 14px 32px; 
          background: white; 
          color: #3B82F6; 
          border: none; 
          border-radius: 8px; 
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .c-${component.id} .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
      `;
    }
  },
  
  footer: {
    type: 'footer',
    displayName: 'Footer',
    category: 'blocks',
    icon: 'layout-bottom',
    acceptsChildren: false,
    defaultProps: {
      content: {
        copyright: '© 2024 Your Company. All rights reserved.',
        links: ['Privacy', 'Terms', 'Contact']
      }
    },
    defaultStyles: {
      base: {
        padding: '40px 20px',
        backgroundColor: '#1F2937',
        color: 'white',
        textAlign: 'center'
      }
    },
    generateHTML: (component) => {
      const { copyright, links } = component.props.content as any;
      const linksHtml = links.map((l: string) => 
        `<a href="#" class="footer-link">${l}</a>`
      ).join(' · ');
      
      return `
        <footer class="c-${component.id}" id="${component.id}">
          <div class="footer-links">${linksHtml}</div>
          <p class="footer-copyright">${copyright}</p>
        </footer>
      `;
    },
    generateCSS: (component) => {
      const base = generateResponsiveCSS(`.c-${component.id}`, component.styles);
      return base + `
        .c-${component.id} .footer-links { margin-bottom: 16px; }
        .c-${component.id} .footer-link { 
          color: #9CA3AF; 
          text-decoration: none; 
          margin: 0 8px;
          transition: color 0.2s;
        }
        .c-${component.id} .footer-link:hover { color: white; }
        .c-${component.id} .footer-copyright { color: #6B7280; font-size: 14px; }
      `;
    }
  },
  
  navigation: {
    type: 'navigation',
    displayName: 'Navigation Bar',
    category: 'blocks',
    icon: 'menu',
    acceptsChildren: false,
    defaultProps: {
      content: {
        logo: 'Your Logo',
        links: [
          { text: 'Home', href: '#' },
          { text: 'About', href: '#about' },
          { text: 'Services', href: '#services' },
          { text: 'Contact', href: '#contact' }
        ]
      }
    },
    defaultStyles: {
      base: {
        padding: '16px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB'
      }
    },
    generateHTML: (component) => {
      const { logo, links } = component.props.content as any;
      const navLinks = links.map((l: any) => 
        `<a href="${l.href}" class="nav-link">${l.text}</a>`
      ).join('');
      
      return `
        <nav class="c-${component.id}" id="${component.id}">
          <div class="nav-container">
            <div class="nav-logo">${logo}</div>
            <div class="nav-links">${navLinks}</div>
          </div>
        </nav>
      `;
    },
    generateCSS: (component) => {
      const base = generateResponsiveCSS(`.c-${component.id}`, component.styles);
      return base + `
        .c-${component.id} .nav-container { 
          max-width: 1200px; 
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .c-${component.id} .nav-logo { 
          font-size: 24px; 
          font-weight: bold; 
          color: #1F2937;
        }
        .c-${component.id} .nav-links { display: flex; gap: 32px; }
        .c-${component.id} .nav-link { 
          color: #4B5563; 
          text-decoration: none;
          transition: color 0.2s;
        }
        .c-${component.id} .nav-link:hover { color: #3B82F6; }
      `;
    }
  }
};

// Merge base components with form components
export const componentDefinitions: Record<string, ComponentDefinition> = {
  ...baseComponentDefinitions,
  ...formComponentDefinitions
};

// Apply variants to all components
Object.keys(componentDefinitions).forEach(key => {
  const type = key as ComponentType;
  componentDefinitions[type] = addVariantsToDefinition(componentDefinitions[type]);
});

// Helper function to add animation attributes to HTML element
function addAnimationAttributes(component: Component, tagName: string, attributes: string = ''): string {
  const animations = component.props.animations || [];
  let animationAttrs = '';
  
  animations.forEach(animation => {
    if (animation.trigger === 'onScroll') {
      animationAttrs += ' data-scroll-animation="true"';
    } else if (animation.trigger === 'onClick') {
      animationAttrs += ' data-click-animation="true"';
      animationAttrs += ` data-animation-duration="${animation.options.duration}"`;
    }
  });
  
  const baseAttrs = `class="c-${component.id}" id="${component.id}"${animationAttrs}`;
  const allAttrs = attributes ? `${baseAttrs} ${attributes}` : baseAttrs;
  
  return `<${tagName} ${allAttrs}>`;
}

// Helper function for responsive CSS generation
function generateResponsiveCSS(selector: string, styles: any): string {
  let css = '';
  
  // Base styles
  if (styles.base) {
    const baseStyles = Object.entries(styles.base)
      .map(([prop, value]) => `  ${kebabCase(prop)}: ${value};`)
      .join('\n');
    css += `${selector} {\n${baseStyles}\n}\n`;
  }
  
  // Responsive breakpoints
  const breakpoints = {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px'
  };
  
  for (const [bp, minWidth] of Object.entries(breakpoints)) {
    if (styles[bp]) {
      const bpStyles = Object.entries(styles[bp])
        .map(([prop, value]) => `    ${kebabCase(prop)}: ${value};`)
        .join('\n');
      css += `@media (min-width: ${minWidth}) {\n  ${selector} {\n${bpStyles}\n  }\n}\n`;
    }
  }
  
  return css;
}

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}