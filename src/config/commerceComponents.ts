/**
 * Component definitions for commerce.
 *
 * These render meaningful placeholders inside the editor (so users can build a
 * store visually) and emit production-ready HTML/CSS/JS in the exported site.
 * The exported site uses the small `commerce-runtime.ts` module to drive cart
 * behavior — no framework required at runtime.
 */

import type { Component, ComponentDefinition, ComponentType } from '@/types/component';
import { escapeHtml } from '@/utils/htmlEscape';
import { T } from './themeTokens';

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

function readObject<T>(component: Component, fallback: T): T {
  const c = component.props.content;
  if (c && typeof c === 'object') return c as unknown as T;
  return fallback;
}

/* ------------------------------------------------------------------ */
/* Product card                                                       */
/* ------------------------------------------------------------------ */

interface ProductCardConfig {
  productId?: string;
  showPrice: boolean;
  showCompareAtPrice: boolean;
  showAddToCart: boolean;
  layout: 'card' | 'minimal' | 'overlay';
}

const productDefinition: ComponentDefinition = {
  type: 'product',
  displayName: 'Product Card',
  category: 'blocks',
  icon: 'package',
  defaultProps: {
    content: {
      productId: '',
      showPrice: true,
      showCompareAtPrice: true,
      showAddToCart: true,
      layout: 'card',
    },
  },
  defaultStyles: { base: { width: '100%', maxWidth: '320px' } },
  generateHTML: (component) => {
    const cfg = readObject<ProductCardConfig>(component, {
      productId: '', showPrice: true, showCompareAtPrice: true, showAddToCart: true, layout: 'card',
    });
    if (!cfg.productId) {
      return `<div class="c-${component.id} product-card product-card--empty">
  <div class="product-card__placeholder">Choose a product in the editor</div>
</div>`;
    }
    return `<article class="c-${component.id} product-card product-card--${cfg.layout}" data-ob-product="${escapeHtml(cfg.productId)}">
  <a class="product-card__media" data-ob-product-link="${escapeHtml(cfg.productId)}" href="#" aria-label="View product">
    <img data-ob-product-image alt="" loading="lazy" />
  </a>
  <div class="product-card__body">
    <h3 data-ob-product-name></h3>
    <div class="product-card__price">
      ${cfg.showPrice ? '<span data-ob-product-price></span>' : ''}
      ${cfg.showCompareAtPrice ? '<span class="product-card__compare" data-ob-product-compare></span>' : ''}
    </div>
    ${cfg.showAddToCart ? `<button class="product-card__cta" data-ob-add-to-cart="${escapeHtml(cfg.productId)}">Add to cart</button>` : ''}
  </div>
</article>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.product-card { display: flex; flex-direction: column; background: white; border: 1px solid ${T.border}; border-radius: 16px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
.c-${component.id}.product-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -10px rgba(0,0,0,0.15); }
.c-${component.id} .product-card__media { display: block; aspect-ratio: 4/5; background: ${T.surface}; overflow: hidden; }
.c-${component.id} .product-card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.c-${component.id}.product-card:hover .product-card__media img { transform: scale(1.05); }
.c-${component.id} .product-card__body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.c-${component.id} .product-card__body h3 { margin: 0; font-size: 1rem; font-weight: 600; color: ${T.text}; }
.c-${component.id} .product-card__price { display: flex; align-items: baseline; gap: 8px; font-weight: 600; color: ${T.text}; }
.c-${component.id} .product-card__compare { text-decoration: line-through; color: ${T.textSubtle}; font-weight: 400; font-size: 0.875rem; }
.c-${component.id} .product-card__cta { margin-top: 4px; padding: 10px 16px; background: ${T.text}; color: white; border: 0; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.c-${component.id} .product-card__cta:hover { background: ${T.ctaBgHover}; }
.c-${component.id} .product-card__cta:disabled { opacity: 0.5; cursor: not-allowed; }
.c-${component.id}.product-card--minimal { border: 0; }
.c-${component.id}.product-card--overlay { position: relative; }
.c-${component.id}.product-card--overlay .product-card__body { position: absolute; inset: auto 0 0 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; }
.c-${component.id}.product-card--overlay .product-card__body h3, .c-${component.id}.product-card--overlay .product-card__price { color: white; }
.c-${component.id} .product-card__placeholder { padding: 64px 24px; text-align: center; color: ${T.textSubtle}; border: 2px dashed ${T.border}; border-radius: 16px; }`,
};

/* ------------------------------------------------------------------ */
/* Product grid                                                       */
/* ------------------------------------------------------------------ */

interface ProductGridConfig {
  /** Which products to render. 'all' = all active products. */
  source: 'all' | 'category' | 'tag' | 'manual';
  categoryId?: string;
  tag?: string;
  productIds?: ReadonlyArray<string>;
  columns: number;
  limit?: number;
  showPrice: boolean;
  showAddToCart: boolean;
}

const productGridDefinition: ComponentDefinition = {
  type: 'productGrid',
  displayName: 'Product Grid',
  category: 'blocks',
  icon: 'layout-grid',
  defaultProps: {
    content: {
      source: 'all',
      columns: 3,
      showPrice: true,
      showAddToCart: true,
    },
  },
  defaultStyles: { base: { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' } },
  generateHTML: (component) => {
    const cfg = readObject<ProductGridConfig>(component, {
      source: 'all', columns: 3, showPrice: true, showAddToCart: true,
    });
    return `<div class="c-${component.id} product-grid" data-ob-product-grid='${escapeHtml(
      JSON.stringify({
        source: cfg.source,
        categoryId: cfg.categoryId,
        tag: cfg.tag,
        productIds: cfg.productIds,
        limit: cfg.limit,
        showPrice: cfg.showPrice,
        showAddToCart: cfg.showAddToCart,
      }),
    )}'>
  <!-- products injected by commerce-runtime.js -->
</div>`;
  },
  generateCSS: (component) => {
    const cfg = readObject<ProductGridConfig>(component, {
      source: 'all', columns: 3, showPrice: true, showAddToCart: true,
    });
    return `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.product-grid { display: grid; grid-template-columns: repeat(${cfg.columns}, 1fr); gap: 24px; }
.c-${component.id} .product-grid__item { background: white; border: 1px solid ${T.border}; border-radius: 16px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
.c-${component.id} .product-grid__item:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -10px rgba(0,0,0,0.15); }
.c-${component.id} .product-grid__media { aspect-ratio: 4/5; overflow: hidden; background: ${T.surface}; }
.c-${component.id} .product-grid__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.c-${component.id} .product-grid__item:hover .product-grid__media img { transform: scale(1.05); }
.c-${component.id} .product-grid__body { padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.c-${component.id} .product-grid__name { margin: 0; font-size: 1rem; font-weight: 600; color: ${T.text}; }
.c-${component.id} .product-grid__price { font-weight: 600; color: ${T.text}; display: flex; gap: 8px; align-items: baseline; }
.c-${component.id} .product-grid__compare { text-decoration: line-through; color: ${T.textSubtle}; font-weight: 400; font-size: 0.875rem; }
.c-${component.id} .product-grid__cta { margin-top: auto; padding: 10px 16px; background: ${T.text}; color: white; border: 0; border-radius: 8px; font-weight: 600; cursor: pointer; }
.c-${component.id} .product-grid__cta:hover { background: ${T.ctaBgHover}; }
.c-${component.id} .product-grid__empty { grid-column: 1 / -1; padding: 64px; text-align: center; color: ${T.textSubtle}; border: 2px dashed ${T.border}; border-radius: 16px; }
@media (max-width: 768px) {
  .c-${component.id}.product-grid { grid-template-columns: repeat(${Math.max(1, Math.min(2, cfg.columns))}, 1fr); }
}
@media (max-width: 480px) {
  .c-${component.id}.product-grid { grid-template-columns: 1fr; }
}`;
  },
};

/* ------------------------------------------------------------------ */
/* Cart icon                                                          */
/* ------------------------------------------------------------------ */

const cartIconDefinition: ComponentDefinition = {
  type: 'cartIcon',
  displayName: 'Cart Icon',
  category: 'blocks',
  icon: 'shopping-cart',
  defaultProps: { content: { label: 'Cart' } },
  defaultStyles: { base: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
  generateHTML: (component) => `<button class="c-${component.id} cart-icon" data-ob-cart-toggle aria-label="Open cart">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
  <span class="cart-icon__count" data-ob-cart-count>0</span>
</button>`,
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.cart-icon { position: relative; padding: 8px; background: transparent; border: 0; cursor: pointer; color: ${T.text}; }
.c-${component.id} .cart-icon__count { position: absolute; top: -2px; right: -2px; min-width: 18px; height: 18px; padding: 0 5px; background: ${T.danger}; color: white; font-size: 0.6875rem; font-weight: 700; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; }
.c-${component.id} .cart-icon__count:empty, .c-${component.id} .cart-icon__count[data-empty='true'] { display: none; }`,
};

/* ------------------------------------------------------------------ */
/* Add-to-cart button                                                 */
/* ------------------------------------------------------------------ */

const addToCartDefinition: ComponentDefinition = {
  type: 'addToCart',
  displayName: 'Add to Cart Button',
  category: 'blocks',
  icon: 'shopping-bag',
  defaultProps: {
    content: { productId: '', label: 'Add to cart', variantId: '' },
  },
  defaultStyles: { base: { display: 'inline-block' } },
  generateHTML: (component) => {
    const cfg = readObject(component, { productId: '', label: 'Add to cart', variantId: '' });
    return `<button class="c-${component.id} add-to-cart" data-ob-add-to-cart="${escapeHtml(cfg.productId)}"${
      cfg.variantId ? ` data-ob-variant="${escapeHtml(cfg.variantId)}"` : ''
    }>${escapeHtml(cfg.label)}</button>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.add-to-cart { padding: 12px 24px; background: ${T.text}; color: white; border: 0; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.1s; }
.c-${component.id}.add-to-cart:hover { background: ${T.ctaBgHover}; }
.c-${component.id}.add-to-cart:active { transform: scale(0.98); }
.c-${component.id}.add-to-cart:disabled { background: ${T.textSubtle}; cursor: not-allowed; }`,
};

/* ------------------------------------------------------------------ */
/* Checkout button                                                    */
/* ------------------------------------------------------------------ */

const checkoutButtonDefinition: ComponentDefinition = {
  type: 'checkoutButton',
  displayName: 'Checkout Button',
  category: 'blocks',
  icon: 'credit-card',
  defaultProps: { content: { label: 'Proceed to checkout' } },
  defaultStyles: { base: { display: 'inline-block' } },
  generateHTML: (component) => {
    const { label = 'Proceed to checkout' } = readObject(component, { label: 'Proceed to checkout' });
    return `<button class="c-${component.id} checkout-button" data-ob-checkout>${escapeHtml(label)}</button>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.checkout-button { padding: 14px 28px; background: linear-gradient(135deg, ${T.primary}, ${T.secondary}); color: white; border: 0; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; box-shadow: 0 6px 16px -4px rgba(99, 102, 241, 0.5); transition: transform 0.1s, box-shadow 0.2s; }
.c-${component.id}.checkout-button:hover { transform: translateY(-1px); box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.6); }
.c-${component.id}.checkout-button:active { transform: translateY(0); }`,
};

/* ------------------------------------------------------------------ */
/* Price tag (standalone price display)                               */
/* ------------------------------------------------------------------ */

const priceTagDefinition: ComponentDefinition = {
  type: 'priceTag',
  displayName: 'Price Tag',
  category: 'blocks',
  icon: 'tag',
  defaultProps: {
    content: { productId: '', size: 'medium' },
  },
  defaultStyles: { base: { display: 'inline-block' } },
  generateHTML: (component) => {
    const cfg = readObject(component, { productId: '', size: 'medium' });
    return `<span class="c-${component.id} price-tag price-tag--${cfg.size}" data-ob-price="${escapeHtml(cfg.productId)}">
  <span data-ob-product-price>$0.00</span>
</span>`;
  },
  generateCSS: (component) => `${generateResponsiveCSS(`.c-${component.id}`, component.styles)}
.c-${component.id}.price-tag { color: ${T.text}; font-weight: 700; }
.c-${component.id}.price-tag--small { font-size: 0.875rem; }
.c-${component.id}.price-tag--medium { font-size: 1.125rem; }
.c-${component.id}.price-tag--large { font-size: 1.75rem; }`,
};

/* ------------------------------------------------------------------ */

export const commerceComponentDefinitions: Partial<Record<ComponentType, ComponentDefinition>> = {
  product: productDefinition,
  productGrid: productGridDefinition,
  cartIcon: cartIconDefinition,
  addToCart: addToCartDefinition,
  checkoutButton: checkoutButtonDefinition,
  priceTag: priceTagDefinition,
};
