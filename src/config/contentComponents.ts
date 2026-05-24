/**
 * Component definitions for the expanded content / media / block library.
 *
 * Each definition emits semantic, accessible HTML and uses BEM-ish class names
 * scoped by component id (`.c-<id>`) so styles never leak between components.
 */

import type { Component, ComponentDefinition, ComponentType } from '@/types/component';
import { escapeHtml, sanitizeUrl } from '@/utils/htmlEscape';

function generateResponsiveCSS(selector: string, styles: Component['styles']): string {
  let css = '';
  if (styles.base) {
    const baseStyles = Object.entries(styles.base)
      .map(([prop, value]) => `  ${kebab(prop)}: ${value};`)
      .join('\n');
    css += `${selector} {\n${baseStyles}\n}\n`;
  }
  const breakpoints = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' } as const;
  for (const [bp, minWidth] of Object.entries(breakpoints)) {
    const bpStyles = styles[bp];
    if (bpStyles) {
      const rules = Object.entries(bpStyles)
        .map(([prop, value]) => `    ${kebab(prop)}: ${value};`)
        .join('\n');
      css += `@media (min-width: ${minWidth}) {\n  ${selector} {\n${rules}\n  }\n}\n`;
    }
  }
  return css;
}

function kebab(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function readObjectProp<T>(component: Component, fallback: T): T {
  const content = component.props.content;
  if (content && typeof content === 'object') return content as unknown as T;
  return fallback;
}

/* ------------------------------------------------------------------ */
/* Divider                                                            */
/* ------------------------------------------------------------------ */

const dividerDefinition: ComponentDefinition = {
  type: 'divider',
  displayName: 'Divider',
  category: 'layout',
  icon: 'minus',
  defaultProps: {
    content: { style: 'solid', thickness: 1, color: '#E5E7EB', label: '' },
  },
  defaultStyles: { base: { width: '100%', margin: '32px 0' } },
  generateHTML: (component) => {
    const { label = '' } = readObjectProp(component, { label: '' });
    if (label) {
      return `<div class="c-${component.id} divider-label" role="separator" aria-label="${escapeHtml(label)}">
  <span class="divider-line"></span>
  <span class="divider-text">${escapeHtml(label)}</span>
  <span class="divider-line"></span>
</div>`;
    }
    return `<hr class="c-${component.id}" role="separator" />`;
  },
  generateCSS: (component) => {
    const { style = 'solid', thickness = 1, color = '#E5E7EB' } = readObjectProp(component, {
      style: 'solid',
      thickness: 1,
      color: '#E5E7EB',
    });
    return `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id} { border: 0; border-top: ${thickness}px ${style} ${color}; }
.c-${component.id}.divider-label { display: flex; align-items: center; gap: 12px; border-top: 0; }
.c-${component.id} .divider-line { flex: 1; border-top: ${thickness}px ${style} ${color}; }
.c-${component.id} .divider-text { color: #6B7280; font-size: 0.875rem; letter-spacing: 0.05em; text-transform: uppercase; }`;
  },
};

/* ------------------------------------------------------------------ */
/* Video                                                              */
/* ------------------------------------------------------------------ */

const videoDefinition: ComponentDefinition = {
  type: 'video',
  displayName: 'Video',
  category: 'media',
  icon: 'video',
  defaultProps: {
    content: {
      provider: 'youtube',
      videoId: 'dQw4w9WgXcQ',
      url: '',
      autoplay: false,
      loop: false,
      muted: true,
      controls: true,
      aspectRatio: '16/9',
    },
  },
  defaultStyles: { base: { width: '100%', maxWidth: '900px', margin: '0 auto' } },
  generateHTML: (component) => {
    const cfg = readObjectProp(component, {
      provider: 'youtube',
      videoId: '',
      url: '',
      autoplay: false,
      loop: false,
      muted: true,
      controls: true,
    });
    const params: string[] = [];
    if (cfg.autoplay) params.push('autoplay=1');
    if (cfg.loop) params.push('loop=1');
    if (cfg.muted) params.push('mute=1');
    if (!cfg.controls) params.push('controls=0');
    let src = '';
    if (cfg.provider === 'youtube' && cfg.videoId) {
      src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(cfg.videoId)}${params.length ? `?${params.join('&')}` : ''}`;
    } else if (cfg.provider === 'vimeo' && cfg.videoId) {
      src = `https://player.vimeo.com/video/${encodeURIComponent(cfg.videoId)}${params.length ? `?${params.join('&')}` : ''}`;
    } else if (cfg.url) {
      src = sanitizeUrl(cfg.url);
    }
    if (cfg.provider === 'file') {
      return `<video class="c-${component.id}" ${cfg.controls ? 'controls' : ''} ${cfg.autoplay ? 'autoplay' : ''} ${cfg.muted ? 'muted' : ''} ${cfg.loop ? 'loop' : ''} playsinline>
  <source src="${sanitizeUrl(cfg.url)}" />
</video>`;
    }
    return `<div class="c-${component.id} video-wrap">
  <iframe src="${src}" title="Embedded video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
</div>`;
  },
  generateCSS: (component) => {
    const cfg = readObjectProp(component, { aspectRatio: '16/9' });
    return `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.video-wrap { position: relative; aspect-ratio: ${cfg.aspectRatio}; overflow: hidden; border-radius: 8px; background: #000; }
.c-${component.id}.video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.c-${component.id} video { width: 100%; height: 100%; border-radius: 8px; display: block; }`;
  },
};

/* ------------------------------------------------------------------ */
/* Embed                                                              */
/* ------------------------------------------------------------------ */

const embedDefinition: ComponentDefinition = {
  type: 'embed',
  displayName: 'Embed',
  category: 'media',
  icon: 'code',
  defaultProps: {
    content: { html: '<!-- Paste embed code -->', sandbox: true },
  },
  defaultStyles: { base: { width: '100%' } },
  generateHTML: (component) => {
    const { html = '' } = readObjectProp(component, { html: '' });
    // We intentionally do NOT sanitize embeds — by design they ship raw third-party HTML.
    // The editor warns about untrusted code and offers a sandboxed iframe wrapper.
    return `<div class="c-${component.id} embed-block">${html}</div>`;
  },
  generateCSS: (component) => generateResponsiveCSS(`.c-${component.id}`, component.styles),
};

/* ------------------------------------------------------------------ */
/* Gallery                                                            */
/* ------------------------------------------------------------------ */

interface GalleryConfig {
  images: ReadonlyArray<{ url: string; alt: string; caption?: string }>;
  columns: number;
  gap: number;
  lightbox: boolean;
}

const galleryDefinition: ComponentDefinition = {
  type: 'gallery',
  displayName: 'Image Gallery',
  category: 'media',
  icon: 'images',
  defaultProps: {
    content: {
      images: [
        { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', alt: 'Mountain landscape' },
        { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600', alt: 'Field of grass' },
        { url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600', alt: 'Forest path' },
      ],
      columns: 3,
      gap: 16,
      lightbox: true,
    },
  },
  defaultStyles: { base: { width: '100%', padding: '24px 0' } },
  generateHTML: (component) => {
    const cfg = readObjectProp<GalleryConfig>(component, {
      images: [], columns: 3, gap: 16, lightbox: true,
    });
    const items = cfg.images
      .map((img) => `<figure class="gallery-item">
  <img src="${sanitizeUrl(img.url)}" alt="${escapeHtml(img.alt)}" loading="lazy" />
  ${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ''}
</figure>`)
      .join('\n');
    return `<div class="c-${component.id} gallery"${cfg.lightbox ? ' data-lightbox="true"' : ''}>
${items}
</div>`;
  },
  generateCSS: (component) => {
    const cfg = readObjectProp<GalleryConfig>(component, {
      images: [], columns: 3, gap: 16, lightbox: false,
    });
    return `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.gallery { display: grid; grid-template-columns: repeat(${cfg.columns}, 1fr); gap: ${cfg.gap}px; }
.c-${component.id} .gallery-item { margin: 0; border-radius: 8px; overflow: hidden; background: #F9FAFB; }
.c-${component.id} .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.c-${component.id} .gallery-item:hover img { transform: scale(1.05); }
.c-${component.id} .gallery-item figcaption { padding: 8px 12px; font-size: 0.875rem; color: #4B5563; background: white; }
@media (max-width: 768px) {
  .c-${component.id}.gallery { grid-template-columns: repeat(${Math.max(1, Math.min(2, cfg.columns))}, 1fr); }
}`;
  },
};

/* ------------------------------------------------------------------ */
/* Accordion                                                          */
/* ------------------------------------------------------------------ */

interface AccordionConfig {
  items: ReadonlyArray<{ title: string; content: string }>;
  allowMultiple: boolean;
}

const accordionDefinition: ComponentDefinition = {
  type: 'accordion',
  displayName: 'Accordion',
  category: 'blocks',
  icon: 'list-collapse',
  defaultProps: {
    content: {
      items: [
        { title: 'What is OpenBuild?', content: 'A free, open-source visual website builder.' },
        { title: 'Do I need to code?', content: 'No — drag, drop, publish.' },
        { title: 'Can I export my site?', content: 'Yes, to clean HTML/CSS or framework code.' },
      ],
      allowMultiple: false,
    },
  },
  defaultStyles: { base: { width: '100%', maxWidth: '720px', margin: '0 auto' } },
  generateHTML: (component) => {
    const cfg = readObjectProp<AccordionConfig>(component, { items: [], allowMultiple: false });
    const items = cfg.items
      .map(
        (item, i) => `<details class="accordion-item"${i === 0 ? ' open' : ''}${cfg.allowMultiple ? '' : ` name="acc-${component.id}"`}>
  <summary>${escapeHtml(item.title)}</summary>
  <div class="accordion-body">${escapeHtml(item.content)}</div>
</details>`,
      )
      .join('\n');
    return `<div class="c-${component.id} accordion">\n${items}\n</div>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id} .accordion-item { border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 8px; overflow: hidden; background: white; }
.c-${component.id} .accordion-item summary { padding: 16px 20px; font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
.c-${component.id} .accordion-item summary::-webkit-details-marker { display: none; }
.c-${component.id} .accordion-item summary::after { content: '+'; font-size: 1.25rem; color: #6B7280; transition: transform 0.2s; }
.c-${component.id} .accordion-item[open] summary::after { content: '−'; }
.c-${component.id} .accordion-item .accordion-body { padding: 0 20px 16px; color: #4B5563; line-height: 1.6; }`,
};

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

interface TabsConfig {
  tabs: ReadonlyArray<{ label: string; content: string }>;
}

const tabsDefinition: ComponentDefinition = {
  type: 'tabs',
  displayName: 'Tabs',
  category: 'blocks',
  icon: 'rows-3',
  defaultProps: {
    content: {
      tabs: [
        { label: 'Overview', content: 'Quick summary of your offering.' },
        { label: 'Features', content: 'Bullet list of what makes you different.' },
        { label: 'FAQ', content: 'Common questions, common answers.' },
      ],
    },
  },
  defaultStyles: { base: { width: '100%', maxWidth: '900px', margin: '0 auto' } },
  generateHTML: (component) => {
    const cfg = readObjectProp<TabsConfig>(component, { tabs: [] });
    const name = `tabs-${component.id}`;
    const buttons = cfg.tabs
      .map(
        (t, i) =>
          `<input type="radio" id="${name}-${i}" name="${name}" class="tab-input"${i === 0 ? ' checked' : ''}>
  <label class="tab-label" for="${name}-${i}">${escapeHtml(t.label)}</label>`,
      )
      .join('\n');
    const panels = cfg.tabs
      .map((t, i) => `<div class="tab-panel tab-panel-${i}">${escapeHtml(t.content)}</div>`)
      .join('\n');
    return `<div class="c-${component.id} tabs">\n${buttons}\n<div class="tab-panels">\n${panels}\n</div>\n</div>`;
  },
  generateCSS: (component) => {
    const cfg = readObjectProp<TabsConfig>(component, { tabs: [] });
    let panelRules = '';
    cfg.tabs.forEach((_, i) => {
      panelRules += `.c-${component.id} #tabs-${component.id}-${i}:checked ~ .tab-panels .tab-panel-${i} { display: block; }\n`;
      panelRules += `.c-${component.id} #tabs-${component.id}-${i}:checked ~ label[for='tabs-${component.id}-${i}'] { color: #111827; border-bottom-color: #3B82F6; }\n`;
    });
    return `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.tabs { display: flex; flex-wrap: wrap; }
.c-${component.id} .tab-input { display: none; }
.c-${component.id} .tab-label { padding: 12px 24px; cursor: pointer; color: #6B7280; border-bottom: 2px solid transparent; font-weight: 500; }
.c-${component.id} .tab-label:hover { color: #111827; }
.c-${component.id} .tab-panels { flex: 1 0 100%; padding: 24px 0; }
.c-${component.id} .tab-panel { display: none; line-height: 1.7; color: #4B5563; }
${panelRules}`;
  },
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

const faqDefinition: ComponentDefinition = {
  type: 'faq',
  displayName: 'FAQ',
  category: 'blocks',
  icon: 'help-circle',
  defaultProps: {
    content: {
      title: 'Frequently asked questions',
      subtitle: 'Everything you need to know.',
      items: [
        { question: 'How does the free plan work?', answer: 'You self-host OpenBuild — there is no plan.' },
        { question: 'Can I accept payments?', answer: 'Yes, via Stripe Payment Links or your own backend.' },
        { question: 'Where is my data stored?', answer: 'In your browser by default. Export when you ship.' },
      ],
    },
  },
  defaultStyles: { base: { width: '100%', padding: '64px 24px' } },
  generateHTML: (component) => {
    const cfg = readObjectProp(component, {
      title: '', subtitle: '',
      items: [] as ReadonlyArray<{ question: string; answer: string }>,
    });
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cfg.items.map((i) => ({
        '@type': 'Question',
        name: i.question,
        acceptedAnswer: { '@type': 'Answer', text: i.answer },
      })),
    };
    const items = cfg.items
      .map(
        (item, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
  <summary>${escapeHtml(item.question)}</summary>
  <p>${escapeHtml(item.answer)}</p>
</details>`,
      )
      .join('\n');
    return `<section class="c-${component.id} faq">
  ${cfg.title ? `<h2 class="faq-title">${escapeHtml(cfg.title)}</h2>` : ''}
  ${cfg.subtitle ? `<p class="faq-subtitle">${escapeHtml(cfg.subtitle)}</p>` : ''}
  <div class="faq-list">${items}</div>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</section>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.faq { max-width: 820px; margin: 0 auto; }
.c-${component.id} .faq-title { font-size: 2.25rem; font-weight: 700; text-align: center; margin: 0 0 12px; color: #111827; }
.c-${component.id} .faq-subtitle { text-align: center; color: #6B7280; margin: 0 0 40px; }
.c-${component.id} .faq-list { display: flex; flex-direction: column; gap: 12px; }
.c-${component.id} .faq-item { border: 1px solid #E5E7EB; border-radius: 12px; padding: 4px 0; background: white; transition: border-color 0.2s; }
.c-${component.id} .faq-item:hover { border-color: #C7D2FE; }
.c-${component.id} .faq-item summary { padding: 18px 24px; font-weight: 600; color: #111827; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
.c-${component.id} .faq-item summary::-webkit-details-marker { display: none; }
.c-${component.id} .faq-item summary::after { content: '+'; font-size: 1.5rem; color: #6B7280; }
.c-${component.id} .faq-item[open] summary::after { content: '−'; }
.c-${component.id} .faq-item p { margin: 0; padding: 0 24px 20px; color: #4B5563; line-height: 1.7; }`,
};

/* ------------------------------------------------------------------ */
/* Testimonials                                                       */
/* ------------------------------------------------------------------ */

interface TestimonialsConfig {
  title: string;
  items: ReadonlyArray<{
    quote: string;
    name: string;
    title: string;
    avatarUrl?: string;
    rating?: number;
  }>;
}

const testimonialsDefinition: ComponentDefinition = {
  type: 'testimonials',
  displayName: 'Testimonials',
  category: 'blocks',
  icon: 'message-square-quote',
  defaultProps: {
    content: {
      title: 'Loved by builders',
      items: [
        { quote: 'Shipped my landing page in an afternoon.', name: 'Alex Rivera', title: 'Indie founder', rating: 5 },
        { quote: 'The export quality is genuinely impressive.', name: 'Priya Singh', title: 'Frontend dev', rating: 5 },
        { quote: 'Finally a builder that respects clean code.', name: 'Jordan Lee', title: 'Agency owner', rating: 5 },
      ],
    },
  },
  defaultStyles: { base: { width: '100%', padding: '80px 24px', background: '#F9FAFB' } },
  generateHTML: (component) => {
    const cfg = readObjectProp<TestimonialsConfig>(component, { title: '', items: [] });
    const cards = cfg.items
      .map((t) => {
        const stars = (t.rating ?? 5)
          ? Array.from({ length: t.rating ?? 5 }, () => '★').join('')
          : '';
        return `<figure class="testimonial-card">
  ${stars ? `<div class="testimonial-stars" aria-label="${t.rating ?? 5} out of 5 stars">${stars}</div>` : ''}
  <blockquote>${escapeHtml(t.quote)}</blockquote>
  <figcaption>
    ${t.avatarUrl ? `<img src="${sanitizeUrl(t.avatarUrl)}" alt="${escapeHtml(t.name)}" />` : ''}
    <div>
      <div class="testimonial-name">${escapeHtml(t.name)}</div>
      <div class="testimonial-title">${escapeHtml(t.title)}</div>
    </div>
  </figcaption>
</figure>`;
      })
      .join('\n');
    return `<section class="c-${component.id} testimonials">
  ${cfg.title ? `<h2 class="testimonials-title">${escapeHtml(cfg.title)}</h2>` : ''}
  <div class="testimonials-grid">${cards}</div>
</section>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.testimonials { max-width: 1200px; margin: 0 auto; }
.c-${component.id} .testimonials-title { font-size: 2.25rem; font-weight: 700; text-align: center; color: #111827; margin: 0 0 48px; }
.c-${component.id} .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.c-${component.id} .testimonial-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 28px; margin: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.c-${component.id} .testimonial-stars { color: #F59E0B; font-size: 1.125rem; margin-bottom: 12px; letter-spacing: 2px; }
.c-${component.id} .testimonial-card blockquote { margin: 0 0 20px; font-size: 1.0625rem; line-height: 1.6; color: #1F2937; }
.c-${component.id} .testimonial-card figcaption { display: flex; align-items: center; gap: 12px; }
.c-${component.id} .testimonial-card figcaption img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.c-${component.id} .testimonial-name { font-weight: 600; color: #111827; }
.c-${component.id} .testimonial-title { font-size: 0.875rem; color: #6B7280; }`,
};

/* ------------------------------------------------------------------ */
/* Pricing                                                            */
/* ------------------------------------------------------------------ */

interface PricingConfig {
  title: string;
  subtitle: string;
  tiers: ReadonlyArray<{
    name: string;
    price: string;
    period: string;
    description: string;
    features: ReadonlyArray<string>;
    ctaLabel: string;
    ctaHref: string;
    highlighted?: boolean;
  }>;
}

const pricingDefinition: ComponentDefinition = {
  type: 'pricing',
  displayName: 'Pricing Table',
  category: 'blocks',
  icon: 'badge-dollar-sign',
  defaultProps: {
    content: {
      title: 'Simple, transparent pricing',
      subtitle: 'Pick the plan that fits how you build.',
      tiers: [
        {
          name: 'Starter', price: '$0', period: '/month',
          description: 'Everything you need to launch.',
          features: ['Unlimited pages', 'Drag & drop editor', 'Free export'],
          ctaLabel: 'Get started', ctaHref: '#',
        },
        {
          name: 'Pro', price: '$19', period: '/month',
          description: 'For serious builders.',
          features: ['Everything in Starter', 'Custom domain', 'Priority support', 'Advanced commerce'],
          ctaLabel: 'Choose Pro', ctaHref: '#',
          highlighted: true,
        },
        {
          name: 'Team', price: '$49', period: '/month',
          description: 'For agencies & studios.',
          features: ['Everything in Pro', 'Team collaboration', 'White-label exports', 'SSO'],
          ctaLabel: 'Contact sales', ctaHref: '#',
        },
      ],
    },
  },
  defaultStyles: { base: { width: '100%', padding: '80px 24px' } },
  generateHTML: (component) => {
    const cfg = readObjectProp<PricingConfig>(component, {
      title: '', subtitle: '', tiers: [],
    });
    const tiers = cfg.tiers
      .map(
        (t) => `<div class="pricing-tier${t.highlighted ? ' highlighted' : ''}">
  ${t.highlighted ? '<div class="pricing-badge">Most popular</div>' : ''}
  <h3>${escapeHtml(t.name)}</h3>
  <div class="pricing-price"><span class="pricing-amount">${escapeHtml(t.price)}</span><span class="pricing-period">${escapeHtml(t.period)}</span></div>
  <p class="pricing-desc">${escapeHtml(t.description)}</p>
  <ul>${t.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
  <a href="${sanitizeUrl(t.ctaHref)}" class="pricing-cta">${escapeHtml(t.ctaLabel)}</a>
</div>`,
      )
      .join('\n');
    return `<section class="c-${component.id} pricing">
  ${cfg.title ? `<h2 class="pricing-title">${escapeHtml(cfg.title)}</h2>` : ''}
  ${cfg.subtitle ? `<p class="pricing-subtitle">${escapeHtml(cfg.subtitle)}</p>` : ''}
  <div class="pricing-grid">${tiers}</div>
</section>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.pricing { max-width: 1200px; margin: 0 auto; }
.c-${component.id} .pricing-title { font-size: 2.5rem; font-weight: 700; text-align: center; color: #111827; margin: 0 0 12px; }
.c-${component.id} .pricing-subtitle { text-align: center; color: #6B7280; margin: 0 0 48px; }
.c-${component.id} .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: stretch; }
.c-${component.id} .pricing-tier { position: relative; background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 32px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
.c-${component.id} .pricing-tier:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.1); }
.c-${component.id} .pricing-tier.highlighted { border-color: #3B82F6; box-shadow: 0 12px 28px -10px rgba(59,130,246,0.4); }
.c-${component.id} .pricing-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #3B82F6; color: white; font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 999px; letter-spacing: 0.05em; text-transform: uppercase; }
.c-${component.id} .pricing-tier h3 { margin: 0 0 12px; font-size: 1.25rem; color: #111827; }
.c-${component.id} .pricing-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 8px; }
.c-${component.id} .pricing-amount { font-size: 2.5rem; font-weight: 700; color: #111827; }
.c-${component.id} .pricing-period { color: #6B7280; }
.c-${component.id} .pricing-desc { color: #6B7280; margin: 0 0 24px; }
.c-${component.id} .pricing-tier ul { list-style: none; padding: 0; margin: 0 0 32px; flex: 1; }
.c-${component.id} .pricing-tier ul li { padding: 8px 0 8px 28px; position: relative; color: #1F2937; }
.c-${component.id} .pricing-tier ul li::before { content: '✓'; position: absolute; left: 0; color: #10B981; font-weight: 700; }
.c-${component.id} .pricing-cta { display: block; text-align: center; padding: 12px 24px; border-radius: 8px; background: #111827; color: white; text-decoration: none; font-weight: 600; transition: background 0.2s; }
.c-${component.id} .pricing-cta:hover { background: #1F2937; }
.c-${component.id} .pricing-tier.highlighted .pricing-cta { background: #3B82F6; }
.c-${component.id} .pricing-tier.highlighted .pricing-cta:hover { background: #2563EB; }`,
};

/* ------------------------------------------------------------------ */
/* Newsletter                                                         */
/* ------------------------------------------------------------------ */

const newsletterDefinition: ComponentDefinition = {
  type: 'newsletter',
  displayName: 'Newsletter Signup',
  category: 'blocks',
  icon: 'mail',
  defaultProps: {
    content: {
      title: 'Stay in the loop',
      subtitle: 'Monthly updates, new templates, zero spam.',
      placeholder: 'you@example.com',
      buttonLabel: 'Subscribe',
      action: 'https://example.com/subscribe',
    },
  },
  defaultStyles: { base: { width: '100%', padding: '64px 24px', textAlign: 'center' } },
  generateHTML: (component) => {
    const cfg = readObjectProp(component, {
      title: '', subtitle: '', placeholder: '', buttonLabel: '', action: '#',
    });
    return `<section class="c-${component.id} newsletter">
  ${cfg.title ? `<h2>${escapeHtml(cfg.title)}</h2>` : ''}
  ${cfg.subtitle ? `<p>${escapeHtml(cfg.subtitle)}</p>` : ''}
  <form action="${sanitizeUrl(cfg.action)}" method="post" class="newsletter-form">
    <input type="email" name="email" required placeholder="${escapeHtml(cfg.placeholder)}" aria-label="Email address" />
    <button type="submit">${escapeHtml(cfg.buttonLabel)}</button>
  </form>
</section>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.newsletter { max-width: 560px; margin: 0 auto; }
.c-${component.id} h2 { font-size: 2rem; font-weight: 700; color: #111827; margin: 0 0 12px; }
.c-${component.id} p { color: #6B7280; margin: 0 0 24px; }
.c-${component.id} .newsletter-form { display: flex; gap: 8px; max-width: 480px; margin: 0 auto; }
.c-${component.id} input[type='email'] { flex: 1; padding: 12px 16px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 1rem; }
.c-${component.id} input[type='email']:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.c-${component.id} button { padding: 12px 24px; background: #111827; color: white; border: 0; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.c-${component.id} button:hover { background: #1F2937; }
@media (max-width: 540px) {
  .c-${component.id} .newsletter-form { flex-direction: column; }
}`,
};

/* ------------------------------------------------------------------ */
/* Social Links                                                       */
/* ------------------------------------------------------------------ */

interface SocialLinksConfig {
  links: ReadonlyArray<{ platform: string; url: string }>;
  style: 'icons' | 'icons-labels' | 'buttons';
}

const socialIconSvgs: Record<string, string> = {
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.92 5.92 0 0 0-2.13 1.39A5.92 5.92 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.92 5.92 0 0 0 1.39 2.13 5.92 5.92 0 0 0 2.12 1.39c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.92 5.92 0 0 0 2.13-1.39 5.92 5.92 0 0 0 1.39-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.92 5.92 0 0 0-1.39-2.13A5.92 5.92 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.15a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .78 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.96 10.13 11.85V15.47H7.08V12h3.05V9.36c0-3.01 1.79-4.68 4.54-4.68 1.32 0 2.7.24 2.7.24v2.96h-1.52c-1.5 0-1.96.93-1.96 1.88V12h3.34l-.53 3.47h-2.81v8.38C19.61 22.96 24 17.99 24 12"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.4.52A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.13c1.9.52 9.4.52 9.4.52s7.5 0 9.4-.52a3 3 0 0 0 2.1-2.13C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.27 3.6z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.04c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 0z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.55a8.16 8.16 0 0 0 4.77 1.52V6.62a4.85 4.85 0 0 1-1.84-.05z"/></svg>',
};

const socialLinksDefinition: ComponentDefinition = {
  type: 'socialLinks',
  displayName: 'Social Links',
  category: 'blocks',
  icon: 'share-2',
  defaultProps: {
    content: {
      links: [
        { platform: 'twitter', url: 'https://twitter.com/' },
        { platform: 'instagram', url: 'https://instagram.com/' },
        { platform: 'github', url: 'https://github.com/' },
      ],
      style: 'icons',
    },
  },
  defaultStyles: { base: { display: 'flex', gap: '16px', justifyContent: 'center', padding: '16px 0' } },
  generateHTML: (component) => {
    const cfg = readObjectProp<SocialLinksConfig>(component, { links: [], style: 'icons' });
    const items = cfg.links
      .map((link) => {
        const platform = link.platform.toLowerCase();
        const icon = socialIconSvgs[platform] ?? socialIconSvgs.twitter;
        const label = `${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
        return `<a href="${sanitizeUrl(link.url)}" class="social-link social-${platform}" target="_blank" rel="noopener noreferrer" aria-label="${label}">
  ${icon}
  ${cfg.style !== 'icons' ? `<span>${label}</span>` : ''}
</a>`;
      })
      .join('\n');
    return `<div class="c-${component.id} social-links" data-style="${cfg.style}">${items}</div>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.social-links { align-items: center; }
.c-${component.id} .social-link { display: inline-flex; align-items: center; gap: 8px; color: #6B7280; text-decoration: none; transition: color 0.2s, transform 0.2s; }
.c-${component.id} .social-link:hover { color: #111827; transform: translateY(-2px); }
.c-${component.id} .social-link svg { width: 24px; height: 24px; display: block; }
.c-${component.id}[data-style='buttons'] .social-link { padding: 10px 14px; background: white; border: 1px solid #E5E7EB; border-radius: 8px; }`,
};

/* ------------------------------------------------------------------ */
/* Export                                                             */
/* ------------------------------------------------------------------ */

export const contentComponentDefinitions: Partial<Record<ComponentType, ComponentDefinition>> = {
  divider: dividerDefinition,
  video: videoDefinition,
  embed: embedDefinition,
  gallery: galleryDefinition,
  accordion: accordionDefinition,
  tabs: tabsDefinition,
  faq: faqDefinition,
  testimonials: testimonialsDefinition,
  pricing: pricingDefinition,
  newsletter: newsletterDefinition,
  socialLinks: socialLinksDefinition,
};
