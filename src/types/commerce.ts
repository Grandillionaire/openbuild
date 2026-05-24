/**
 * Commerce domain model.
 *
 * Money is always represented as an integer amount of the smallest currency unit
 * (cents, pence, etc.) to avoid floating-point drift. Use the helpers in
 * `@/services/commerceService` to format for display.
 */

export type CurrencyCode =
  | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'CHF' | 'SEK' | 'NOK' | 'DKK'
  | 'JPY' | 'CNY' | 'HKD' | 'SGD' | 'INR' | 'BRL' | 'MXN' | 'NZD' | 'ZAR'
  | 'PLN' | 'CZK' | 'HUF' | 'TRY' | 'AED' | 'SAR' | 'ILS';

export interface Money {
  /** Integer amount in the smallest unit (cents for USD/EUR, yen for JPY, etc.) */
  readonly amount: number;
  readonly currency: CurrencyCode;
}

export interface ProductImage {
  readonly id: string;
  readonly url: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly isPrimary?: boolean;
}

export interface ProductVariantAttribute {
  /** e.g. "Size", "Color" */
  readonly name: string;
  /** e.g. "Large", "Red" */
  readonly value: string;
}

export interface ProductVariant {
  readonly id: string;
  /** e.g. "Large / Red" */
  readonly name: string;
  readonly sku?: string;
  readonly price: Money;
  readonly compareAtPrice?: Money;
  readonly inventory: number | null;
  readonly attributes: ReadonlyArray<ProductVariantAttribute>;
  readonly imageId?: string;
  readonly stripePriceId?: string;
  readonly stripePaymentLinkUrl?: string;
}

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  readonly id: string;
  readonly slug: string;
  name: string;
  description: string;
  status: ProductStatus;
  price: Money;
  compareAtPrice?: Money;
  images: ProductImage[];
  variants: ProductVariant[];
  /** Tracked inventory across all variants, null = untracked. */
  inventory: number | null;
  sku?: string;
  /** ISO-3166-1 alpha-2 country codes where this product can ship. Empty = anywhere. */
  shipsTo: string[];
  weight?: { value: number; unit: 'g' | 'kg' | 'oz' | 'lb' };
  taxable: boolean;
  digitalDelivery: boolean;
  tags: string[];
  categoryId?: string;
  stripeProductId?: string;
  stripePaymentLinkUrl?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  readonly id: string;
  readonly slug: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface CartLineItem {
  readonly productId: string;
  readonly variantId?: string;
  quantity: number;
  /** Price captured at add-to-cart time, so price changes mid-checkout don't surprise customers. */
  readonly capturedPrice: Money;
}

export interface CartTotals {
  readonly subtotal: Money;
  readonly discount: Money;
  readonly tax: Money;
  readonly shipping: Money;
  readonly total: Money;
}

export interface DiscountCode {
  readonly code: string;
  readonly type: 'percentage' | 'fixed';
  /** percentage 0–100, or fixed amount in smallest currency unit. */
  readonly value: number;
  readonly appliesTo?: ReadonlyArray<string>;
  readonly minSubtotal?: Money;
  readonly expiresAt?: string;
  readonly usageLimit?: number;
}

export interface ShippingMethod {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  /** Flat fee in smallest currency unit. */
  readonly price: Money;
  /** Free shipping triggered when subtotal >= this threshold. */
  readonly freeThreshold?: Money;
  /** Estimated delivery in business days. */
  readonly estimatedDays?: { min: number; max: number };
}

export interface ShippingZone {
  readonly id: string;
  readonly name: string;
  /** ISO-3166-1 alpha-2 codes. Empty = rest of world. */
  readonly countries: ReadonlyArray<string>;
  readonly methods: ReadonlyArray<ShippingMethod>;
}

export interface TaxRule {
  readonly id: string;
  readonly name: string;
  /** ISO-3166-1 alpha-2 code, or '*' for all. */
  readonly country: string;
  /** Optional sub-region code (US state, CA province, etc.) */
  readonly region?: string;
  /** Rate as 0–1 (0.20 = 20%). */
  readonly rate: number;
  /** When true, displayed prices already include tax. */
  readonly includedInPrice: boolean;
}

export type CheckoutMode =
  | { type: 'stripe-payment-link' }
  | { type: 'stripe-checkout-session'; endpoint: string }
  | { type: 'custom-webhook'; endpoint: string }
  | { type: 'mock' };

export interface CommerceSettings {
  storeName: string;
  contactEmail: string;
  defaultCurrency: CurrencyCode;
  /** Stripe publishable key (pk_live_… or pk_test_…). Safe to embed client-side. */
  stripePublishableKey?: string;
  checkout: CheckoutMode;
  enableCart: boolean;
  enableGuestCheckout: boolean;
  enableInventoryTracking: boolean;
  /** Show "X people are looking at this" social proof badges. */
  enableSocialProof: boolean;
  legal: {
    termsUrl?: string;
    privacyUrl?: string;
    refundPolicyUrl?: string;
  };
}

export interface Order {
  readonly id: string;
  readonly items: ReadonlyArray<CartLineItem>;
  readonly totals: CartTotals;
  readonly customer: { email: string; name?: string };
  readonly shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postalCode: string;
    country: string;
  };
  readonly status: 'pending' | 'paid' | 'fulfilled' | 'refunded' | 'cancelled';
  readonly stripeCheckoutSessionId?: string;
  readonly createdAt: string;
}
