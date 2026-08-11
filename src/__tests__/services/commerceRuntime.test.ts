import { describe, it, expect, beforeEach } from 'vitest';
import { getCommerceRuntimeScript } from '@/services/commerceRuntime';
import type { CommerceSettings, Product } from '@/types/commerce';

const settings: CommerceSettings = {
  storeName: 'Test Store',
  contactEmail: '',
  defaultCurrency: 'USD',
  checkout: { type: 'mock' },
  enableCart: true,
  enableGuestCheckout: true,
  enableInventoryTracking: false,
  enableSocialProof: false,
  legal: {},
};

const product = (overrides?: Partial<Product>): Product => ({
  id: 'p1',
  slug: 'tee',
  name: 'Tee',
  description: '',
  status: 'active',
  price: { amount: 2500, currency: 'USD' },
  images: [],
  variants: [],
  inventory: null,
  shipsTo: [],
  taxable: true,
  digitalDelivery: false,
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

/** Evaluate the runtime the way an exported page would, then fire DOM ready. */
function bootRuntime(catalog: Product[]): void {
  new Function(getCommerceRuntimeScript(catalog, settings))();
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

/** happy-dom leaves `localStorage` as a bare object, so give the runtime a real one. */
function installMemoryStorage(): Storage {
  const data = new Map<string, string>();
  const storage = {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, String(v)),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
    key: (i: number) => [...data.keys()][i] ?? null,
    get length() {
      return data.size;
    },
  } as Storage;
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
  return storage;
}

describe('Commerce runtime script', () => {
  beforeEach(() => {
    installMemoryStorage();
    document.body.innerHTML = '';
    document.getElementById('ob-cart-drawer')?.remove();
  });

  it('never emits a literal </script> from catalog data', () => {
    const hostile = product({ name: '</script><img src=x onerror=alert(1)>' });
    const script = getCommerceRuntimeScript([hostile], settings);

    expect(script).not.toContain('</script>');
    expect(script).toContain('\\u003c/script>');
  });

  it('escapes catalog text and image URLs when rendering a product grid', () => {
    const hostile = product({
      name: '<img src=x onerror=alert(1)>',
      images: [{ id: 'i1', url: '/a.png" onerror="alert(1)', alt: 'a' }],
    });
    document.body.innerHTML = '<div data-ob-product-grid=\'{"source":"all"}\'></div>';

    bootRuntime([hostile]);

    const grid = document.querySelector('[data-ob-product-grid]')!;
    expect(grid.querySelector('[onerror]')).toBeNull();
    expect(grid.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('prices the cart from the live catalog, not the price captured at add-to-cart time', () => {
    localStorage.setItem(
      'openbuild_cart_v1',
      JSON.stringify([
        { productId: 'p1', quantity: 2, capturedPrice: { amount: 1000, currency: 'USD' } },
      ]),
    );

    bootRuntime([product()]);

    const subtotal = document.querySelector('[data-ob-cart-subtotal]')!;
    expect(subtotal.textContent).toBe('$50.00');
  });

  it('records a checkout return as pending, never as paid', () => {
    localStorage.setItem(
      'openbuild_cart_v1',
      JSON.stringify([
        { productId: 'p1', quantity: 1, capturedPrice: { amount: 2500, currency: 'USD' } },
      ]),
    );
    const happyDOM = (window as unknown as { happyDOM?: { setURL(url: string): void } }).happyDOM;
    happyDOM?.setURL('https://store.example/thanks?ob_checkout=success');

    bootRuntime([product()]);

    const pending = JSON.parse(localStorage.getItem('openbuild_orders_pending') || '[]');
    expect(pending).toHaveLength(1);
    expect(pending[0].status).toBe('pending');
  });
});
