/**
 * Commerce store — catalog, cart, settings.
 *
 * Persisted to localStorage so a non-technical user can build a store, refresh,
 * and not lose their products. Real sites should export to their own backend.
 */

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { nanoid } from 'nanoid';
import {
  applyDiscount,
  calculateTotals,
  cartSubtotal,
  zeroMoney,
} from '@/services/commerceService';
import type {
  CartLineItem,
  CommerceSettings,
  CurrencyCode,
  DiscountCode,
  Money,
  Product,
  ProductCategory,
  ShippingZone,
  TaxRule,
} from '@/types/commerce';
import { telemetry } from '@/lib/telemetry';

const STORAGE_KEY = 'openbuild.commerce.v1';

interface PersistedState {
  settings: CommerceSettings;
  products: Product[];
  categories: ProductCategory[];
  discounts: DiscountCode[];
  shippingZones: ShippingZone[];
  taxRules: TaxRule[];
}

function defaultSettings(): CommerceSettings {
  return {
    storeName: 'My Store',
    contactEmail: '',
    defaultCurrency: 'USD',
    checkout: { type: 'mock' },
    enableCart: true,
    enableGuestCheckout: true,
    enableInventoryTracking: false,
    enableSocialProof: false,
    legal: {},
  };
}

function loadFromStorage(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedState;
  } catch (err) {
    telemetry.captureException(err, { scope: 'commerceStore.load' });
    return {};
  }
}

export const useCommerceStore = defineStore('commerce', () => {
  const persisted = loadFromStorage();

  const settings = ref<CommerceSettings>({ ...defaultSettings(), ...persisted.settings });
  const products = ref<Product[]>(persisted.products ?? []);
  const categories = ref<ProductCategory[]>(persisted.categories ?? []);
  const discounts = ref<DiscountCode[]>(persisted.discounts ?? []);
  const shippingZones = ref<ShippingZone[]>(persisted.shippingZones ?? []);
  const taxRules = ref<TaxRule[]>(persisted.taxRules ?? []);

  const cartItems = ref<CartLineItem[]>([]);
  const activeDiscountCode = ref<string | null>(null);

  /* ---------- Derived ---------- */

  const currency = computed<CurrencyCode>(() => settings.value.defaultCurrency);

  const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  const activeDiscount = computed<DiscountCode | undefined>(() =>
    activeDiscountCode.value
      ? discounts.value.find((d) => d.code === activeDiscountCode.value)
      : undefined,
  );

  const cartSubtotalMoney = computed<Money>(() =>
    cartItems.value.length === 0
      ? zeroMoney(currency.value)
      : cartSubtotal(cartItems.value, products.value),
  );

  const cartDiscountMoney = computed<Money>(() =>
    applyDiscount(cartSubtotalMoney.value, activeDiscount.value),
  );

  const cartTotals = computed(() =>
    calculateTotals({
      items: cartItems.value,
      products: products.value,
      discount: activeDiscount.value,
    }),
  );

  const activeProducts = computed(() => products.value.filter((p) => p.status === 'active'));

  /* ---------- Persist ---------- */

  watch(
    [settings, products, categories, discounts, shippingZones, taxRules],
    () => {
      try {
        const payload: PersistedState = {
          settings: settings.value,
          products: products.value,
          categories: categories.value,
          discounts: discounts.value,
          shippingZones: shippingZones.value,
          taxRules: taxRules.value,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        telemetry.captureException(err, { scope: 'commerceStore.persist' });
      }
    },
    { deep: true },
  );

  /* ---------- Product CRUD ---------- */

  function createProduct(input: Partial<Product> & { name: string; price: Money }): Product {
    const now = new Date().toISOString();
    const slug = input.slug ?? slugify(input.name);
    const product: Product = {
      id: input.id ?? nanoid(10),
      slug,
      name: input.name,
      description: input.description ?? '',
      status: input.status ?? 'draft',
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      images: input.images ?? [],
      variants: input.variants ?? [],
      inventory: input.inventory ?? null,
      sku: input.sku,
      shipsTo: input.shipsTo ?? [],
      weight: input.weight,
      taxable: input.taxable ?? true,
      digitalDelivery: input.digitalDelivery ?? false,
      tags: input.tags ?? [],
      categoryId: input.categoryId,
      stripeProductId: input.stripeProductId,
      stripePaymentLinkUrl: input.stripePaymentLinkUrl,
      seo: input.seo,
      createdAt: now,
      updatedAt: now,
    };
    products.value.push(product);
    return product;
  }

  function updateProduct(id: string, patch: Partial<Product>): void {
    const idx = products.value.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const next = { ...products.value[idx], ...patch, updatedAt: new Date().toISOString() };
    products.value.splice(idx, 1, next);
  }

  function deleteProduct(id: string): void {
    products.value = products.value.filter((p) => p.id !== id);
    cartItems.value = cartItems.value.filter((item) => item.productId !== id);
  }

  function getProduct(id: string): Product | undefined {
    return products.value.find((p) => p.id === id);
  }

  function getProductBySlug(slug: string): Product | undefined {
    return products.value.find((p) => p.slug === slug);
  }

  /* ---------- Category CRUD ---------- */

  function createCategory(name: string, parentId?: string): ProductCategory {
    const category: ProductCategory = {
      id: nanoid(8),
      slug: slugify(name),
      name,
      parentId,
    };
    categories.value.push(category);
    return category;
  }

  function deleteCategory(id: string): void {
    categories.value = categories.value.filter((c) => c.id !== id);
    for (const product of products.value) {
      if (product.categoryId === id) {
        updateProduct(product.id, { categoryId: undefined });
      }
    }
  }

  /* ---------- Cart ---------- */

  function addToCart(productId: string, opts: { variantId?: string; quantity?: number } = {}): void {
    const product = getProduct(productId);
    if (!product) {
      telemetry.captureMessage(`addToCart called for unknown product ${productId}`, 'warn', {
        scope: 'commerceStore.addToCart',
      });
      return;
    }
    const variantId = opts.variantId;
    const quantity = Math.max(1, opts.quantity ?? 1);
    const existing = cartItems.value.find(
      (item) => item.productId === productId && item.variantId === variantId,
    );
    if (existing) {
      existing.quantity += quantity;
      return;
    }
    const variant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
    cartItems.value.push({
      productId,
      variantId,
      quantity,
      capturedPrice: variant?.price ?? product.price,
    });
  }

  function updateCartItem(productId: string, variantId: string | undefined, quantity: number): void {
    const item = cartItems.value.find(
      (i) => i.productId === productId && i.variantId === variantId,
    );
    if (!item) return;
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    item.quantity = quantity;
  }

  function removeFromCart(productId: string, variantId?: string): void {
    cartItems.value = cartItems.value.filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    );
  }

  function clearCart(): void {
    cartItems.value = [];
    activeDiscountCode.value = null;
  }

  function applyDiscountCode(code: string): boolean {
    const found = discounts.value.find((d) => d.code.toLowerCase() === code.toLowerCase());
    if (!found) return false;
    activeDiscountCode.value = found.code;
    return true;
  }

  function clearDiscount(): void {
    activeDiscountCode.value = null;
  }

  /* ---------- Settings ---------- */

  function updateSettings(patch: Partial<CommerceSettings>): void {
    settings.value = { ...settings.value, ...patch };
  }

  /* ---------- Demo seed ---------- */

  function seedDemoCatalog(): void {
    if (products.value.length > 0) return;
    const cat = createCategory('Apparel');
    createProduct({
      name: 'Signature Tee',
      description: 'A 100% organic cotton tee with a structured collar.',
      status: 'active',
      price: { amount: 4900, currency: currency.value },
      compareAtPrice: { amount: 6500, currency: currency.value },
      images: [
        {
          id: nanoid(6),
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          alt: 'Folded white t-shirt',
          isPrimary: true,
        },
      ],
      categoryId: cat.id,
      tags: ['featured', 'bestseller'],
    });
    createProduct({
      name: 'Heavyweight Hoodie',
      description: 'Cozy, structured, made to outlast the season.',
      status: 'active',
      price: { amount: 12000, currency: currency.value },
      images: [
        {
          id: nanoid(6),
          url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
          alt: 'Heather-grey hoodie',
          isPrimary: true,
        },
      ],
      categoryId: cat.id,
      tags: ['featured'],
    });
  }

  return {
    settings,
    products,
    categories,
    discounts,
    shippingZones,
    taxRules,
    cartItems,
    activeDiscountCode,
    currency,
    cartCount,
    activeDiscount,
    cartSubtotalMoney,
    cartDiscountMoney,
    cartTotals,
    activeProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductBySlug,
    createCategory,
    deleteCategory,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyDiscountCode,
    clearDiscount,
    updateSettings,
    seedDemoCatalog,
  };
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
