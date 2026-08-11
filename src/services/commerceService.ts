/**
 * Commerce service — pure functions for cart math, formatting, and checkout.
 *
 * Why pure? So that the same code runs in:
 *   - The editor (live preview while you build)
 *   - The exported static site (no Vue / Pinia)
 *   - Unit tests (no DOM, no network)
 */

import { telemetry } from '@/lib/telemetry';
import type {
  CartLineItem,
  CartTotals,
  CheckoutMode,
  CommerceSettings,
  CurrencyCode,
  DiscountCode,
  Money,
  Product,
  ShippingMethod,
  ShippingZone,
  TaxRule,
} from '@/types/commerce';

/** Currencies where the smallest unit IS the major unit (no cents). */
const ZERO_DECIMAL_CURRENCIES: ReadonlySet<CurrencyCode> = new Set([
  'JPY',
] as CurrencyCode[]);

function decimalsFor(currency: CurrencyCode): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2;
}

export function money(amount: number, currency: CurrencyCode): Money {
  if (!Number.isFinite(amount)) {
    throw new TypeError(`money(): amount must be finite, got ${amount}`);
  }
  return { amount: Math.round(amount), currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`addMoney(): currency mismatch ${a.currency} vs ${b.currency}`);
  }
  return { amount: a.amount + b.amount, currency: a.currency };
}

export function multiplyMoney(m: Money, factor: number): Money {
  return { amount: Math.round(m.amount * factor), currency: m.currency };
}

export function zeroMoney(currency: CurrencyCode): Money {
  return { amount: 0, currency };
}

/** Format Money for display. Uses Intl.NumberFormat — locale-aware. */
export function formatMoney(m: Money, locale = 'en-US'): string {
  const decimals = decimalsFor(m.currency);
  const major = m.amount / 10 ** decimals;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: m.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(major);
}

/** Resolve the unit price for a line item, accounting for variants. */
export function unitPriceFor(item: CartLineItem, product: Product | undefined): Money {
  if (!product) return item.capturedPrice;
  if (item.variantId) {
    const variant = product.variants.find((v) => v.id === item.variantId);
    if (variant) return variant.price;
  }
  return product.price;
}

export function lineSubtotal(item: CartLineItem, product?: Product): Money {
  const unit = unitPriceFor(item, product);
  return multiplyMoney(unit, item.quantity);
}

export function cartSubtotal(items: ReadonlyArray<CartLineItem>, products: ReadonlyArray<Product>): Money {
  if (items.length === 0) {
    return zeroMoney(products[0]?.price.currency ?? 'USD');
  }
  const productMap = new Map(products.map((p) => [p.id, p]));
  let total = zeroMoney(items[0].capturedPrice.currency);
  for (const item of items) {
    total = addMoney(total, lineSubtotal(item, productMap.get(item.productId)));
  }
  return total;
}

export function applyDiscount(subtotal: Money, code?: DiscountCode): Money {
  if (!code) return zeroMoney(subtotal.currency);
  if (code.minSubtotal && subtotal.amount < code.minSubtotal.amount) {
    return zeroMoney(subtotal.currency);
  }
  if (code.expiresAt && new Date(code.expiresAt).getTime() < Date.now()) {
    return zeroMoney(subtotal.currency);
  }
  if (code.type === 'percentage') {
    return multiplyMoney(subtotal, Math.min(Math.max(code.value, 0), 100) / 100);
  }
  return { amount: Math.min(code.value, subtotal.amount), currency: subtotal.currency };
}

export function chooseShipping(
  subtotalAfterDiscount: Money,
  zone: ShippingZone | undefined,
  preferredMethodId?: string,
): { method: ShippingMethod | undefined; price: Money } {
  if (!zone || zone.methods.length === 0) {
    return { method: undefined, price: zeroMoney(subtotalAfterDiscount.currency) };
  }
  const method = zone.methods.find((m) => m.id === preferredMethodId) ?? zone.methods[0];
  if (method.freeThreshold && subtotalAfterDiscount.amount >= method.freeThreshold.amount) {
    return { method, price: zeroMoney(subtotalAfterDiscount.currency) };
  }
  return { method, price: method.price };
}

/**
 * How well a rule matches a destination. -1 = does not apply.
 * Country+region (3) beats country (2) beats wildcard+region (1) beats wildcard (0),
 * so a catch-all rule can never shadow a country-specific VAT rate regardless of
 * the order the merchant happened to add them in.
 */
function taxRuleSpecificity(rule: TaxRule, country: string, region?: string): number {
  if (rule.country !== country && rule.country !== '*') return -1;
  if (rule.region && rule.region !== region) return -1;
  return (rule.country === country ? 2 : 0) + (rule.region ? 1 : 0);
}

export function calculateTax(
  taxableAmount: Money,
  rules: ReadonlyArray<TaxRule>,
  country: string,
  region?: string,
): Money {
  let applicable: TaxRule | undefined;
  let bestScore = -1;
  for (const rule of rules) {
    const score = taxRuleSpecificity(rule, country, region);
    if (score > bestScore) {
      applicable = rule;
      bestScore = score;
    }
  }
  if (!applicable || applicable.includedInPrice) {
    return zeroMoney(taxableAmount.currency);
  }
  return multiplyMoney(taxableAmount, applicable.rate);
}

export interface TotalsInput {
  items: ReadonlyArray<CartLineItem>;
  products: ReadonlyArray<Product>;
  discount?: DiscountCode;
  shipping?: { zone?: ShippingZone; methodId?: string };
  tax?: { rules: ReadonlyArray<TaxRule>; country?: string; region?: string };
}

export function calculateTotals(input: TotalsInput): CartTotals {
  const subtotal = cartSubtotal(input.items, input.products);
  const discount = applyDiscount(subtotal, input.discount);
  const subtotalAfterDiscount: Money = {
    amount: subtotal.amount - discount.amount,
    currency: subtotal.currency,
  };
  const { price: shippingPrice } = chooseShipping(
    subtotalAfterDiscount,
    input.shipping?.zone,
    input.shipping?.methodId,
  );
  const taxBase = addMoney(subtotalAfterDiscount, shippingPrice);
  const tax = input.tax
    ? calculateTax(taxBase, input.tax.rules, input.tax.country ?? '*', input.tax.region)
    : zeroMoney(subtotal.currency);

  return {
    subtotal,
    discount,
    shipping: shippingPrice,
    tax,
    total: { amount: taxBase.amount + tax.amount, currency: subtotal.currency },
  };
}

/* ---------- Checkout ---------- */

export interface CheckoutPayload {
  items: ReadonlyArray<CartLineItem>;
  products: ReadonlyArray<Product>;
  totals: CartTotals;
  settings: CommerceSettings;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  /** URL to redirect the customer to. null means handled in-page (mock mode). */
  redirectUrl: string | null;
  sessionId?: string;
  raw?: unknown;
}

export async function beginCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
  const mode = payload.settings.checkout;
  try {
    switch (mode.type) {
      case 'stripe-payment-link':
        return checkoutViaPaymentLink(payload);
      case 'stripe-checkout-session':
        return checkoutViaServer(payload, mode);
      case 'custom-webhook':
        return checkoutViaWebhook(payload, mode);
      case 'mock':
        return { redirectUrl: null };
    }
  } catch (err) {
    telemetry.captureException(err, { scope: 'commerce.beginCheckout' });
    throw err;
  }
}

function checkoutViaPaymentLink(payload: CheckoutPayload): CheckoutResult {
  if (payload.items.length === 0) {
    throw new Error('Cart is empty.');
  }
  if (payload.items.length > 1) {
    throw new Error(
      'Stripe Payment Links only support a single product per checkout. ' +
        'Configure a Checkout Session endpoint for multi-line carts.',
    );
  }
  const item = payload.items[0];
  const product = payload.products.find((p) => p.id === item.productId);
  const variant = product?.variants.find((v) => v.id === item.variantId);
  const url = variant?.stripePaymentLinkUrl ?? product?.stripePaymentLinkUrl;
  if (!url) {
    throw new Error('No Stripe Payment Link configured for this product. Add one in the product editor.');
  }
  const u = new URL(url);
  u.searchParams.set('quantity', String(item.quantity));
  if (payload.customerEmail) u.searchParams.set('prefilled_email', payload.customerEmail);
  return { redirectUrl: u.toString() };
}

async function checkoutViaServer(
  payload: CheckoutPayload,
  mode: Extract<CheckoutMode, { type: 'stripe-checkout-session' }>,
): Promise<CheckoutResult> {
  const response = await fetch(mode.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: payload.items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      customerEmail: payload.customerEmail,
      successUrl: payload.successUrl,
      cancelUrl: payload.cancelUrl,
      currency: payload.totals.total.currency,
    }),
  });
  if (!response.ok) {
    throw new Error(`Checkout endpoint returned ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as { url?: string; id?: string };
  if (!data.url) throw new Error('Checkout endpoint did not return a redirect URL.');
  return { redirectUrl: data.url, sessionId: data.id, raw: data };
}

async function checkoutViaWebhook(
  payload: CheckoutPayload,
  mode: Extract<CheckoutMode, { type: 'custom-webhook' }>,
): Promise<CheckoutResult> {
  const response = await fetch(mode.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}`);
  }
  const data = (await response.json().catch(() => ({}))) as { redirectUrl?: string };
  return { redirectUrl: data.redirectUrl ?? null, raw: data };
}

/* ---------- Inventory ---------- */

export function isInStock(product: Product, variantId?: string): boolean {
  if (variantId) {
    const v = product.variants.find((x) => x.id === variantId);
    if (!v) return false;
    return v.inventory === null || v.inventory > 0;
  }
  return product.inventory === null || product.inventory > 0;
}

export function availableQuantity(product: Product, variantId?: string): number | null {
  if (variantId) {
    const v = product.variants.find((x) => x.id === variantId);
    return v ? v.inventory : 0;
  }
  return product.inventory;
}
