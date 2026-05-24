/**
 * Commerce math is the part of OpenBuild that turns into "missing money" if
 * we get it wrong, so these tests are deliberately pedantic.
 */
import { describe, it, expect } from 'vitest';
import {
  addMoney,
  applyDiscount,
  availableQuantity,
  beginCheckout,
  calculateTax,
  calculateTotals,
  cartSubtotal,
  chooseShipping,
  formatMoney,
  isInStock,
  money,
  multiplyMoney,
  unitPriceFor,
} from '@/services/commerceService';
import type {
  CartLineItem,
  DiscountCode,
  Product,
  ShippingZone,
  TaxRule,
} from '@/types/commerce';

const usd = (cents: number) => money(cents, 'USD');

const tee: Product = {
  id: 'p1',
  slug: 'tee',
  name: 'Tee',
  description: '',
  status: 'active',
  price: usd(2500),
  images: [],
  variants: [
    {
      id: 'v1', name: 'L', price: usd(2700), inventory: 3,
      attributes: [{ name: 'Size', value: 'L' }],
    },
  ],
  inventory: 10,
  shipsTo: [],
  taxable: true,
  digitalDelivery: false,
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const hoodie: Product = {
  id: 'p2',
  slug: 'hoodie',
  name: 'Hoodie',
  description: '',
  status: 'active',
  price: usd(8000),
  images: [],
  variants: [],
  inventory: null,
  shipsTo: [],
  taxable: true,
  digitalDelivery: false,
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('money helpers', () => {
  it('rounds non-integer cents', () => {
    expect(money(199.6, 'USD')).toEqual({ amount: 200, currency: 'USD' });
  });

  it('addMoney refuses to mix currencies', () => {
    expect(() => addMoney(usd(100), money(100, 'EUR'))).toThrow(/currency mismatch/);
  });

  it('multiplyMoney rounds to whole cents', () => {
    expect(multiplyMoney(usd(333), 0.1)).toEqual({ amount: 33, currency: 'USD' });
  });

  it('formatMoney respects zero-decimal currencies', () => {
    expect(formatMoney(money(1500, 'JPY'), 'en-US')).toMatch(/¥1,500/);
    expect(formatMoney(usd(1234), 'en-US')).toBe('$12.34');
  });
});

describe('unitPriceFor', () => {
  it('uses variant price when variant matches', () => {
    const item: CartLineItem = { productId: 'p1', variantId: 'v1', quantity: 1, capturedPrice: usd(2700) };
    expect(unitPriceFor(item, tee)).toEqual(usd(2700));
  });

  it('falls back to base product price', () => {
    const item: CartLineItem = { productId: 'p1', quantity: 1, capturedPrice: usd(2500) };
    expect(unitPriceFor(item, tee)).toEqual(usd(2500));
  });

  it('returns captured price when product missing (price was right at add-to-cart time)', () => {
    const item: CartLineItem = { productId: 'gone', quantity: 1, capturedPrice: usd(999) };
    expect(unitPriceFor(item, undefined)).toEqual(usd(999));
  });
});

describe('cartSubtotal', () => {
  it('returns zero in default currency when cart is empty', () => {
    expect(cartSubtotal([], [tee])).toEqual(usd(0));
  });

  it('sums quantity × variant/base price per line', () => {
    const items: CartLineItem[] = [
      { productId: 'p1', variantId: 'v1', quantity: 2, capturedPrice: usd(2700) },
      { productId: 'p2', quantity: 1, capturedPrice: usd(8000) },
    ];
    expect(cartSubtotal(items, [tee, hoodie])).toEqual(usd(13400));
  });
});

describe('applyDiscount', () => {
  it('returns 0 when no discount given', () => {
    expect(applyDiscount(usd(1000), undefined)).toEqual(usd(0));
  });

  it('caps a fixed discount at the subtotal so totals never go negative', () => {
    const code: DiscountCode = { code: 'BIG', type: 'fixed', value: 9_999_99 };
    expect(applyDiscount(usd(2000), code)).toEqual(usd(2000));
  });

  it('clamps percentages to 0–100', () => {
    const insane: DiscountCode = { code: 'X', type: 'percentage', value: 500 };
    expect(applyDiscount(usd(1000), insane)).toEqual(usd(1000));
    const negative: DiscountCode = { code: 'X', type: 'percentage', value: -50 };
    expect(applyDiscount(usd(1000), negative)).toEqual(usd(0));
  });

  it('respects minSubtotal', () => {
    const code: DiscountCode = { code: 'SAVE', type: 'percentage', value: 10, minSubtotal: usd(5000) };
    expect(applyDiscount(usd(4999), code)).toEqual(usd(0));
    expect(applyDiscount(usd(5000), code)).toEqual(usd(500));
  });

  it('ignores expired codes', () => {
    const code: DiscountCode = {
      code: 'OLD', type: 'percentage', value: 50,
      expiresAt: '2020-01-01T00:00:00.000Z',
    };
    expect(applyDiscount(usd(1000), code)).toEqual(usd(0));
  });
});

describe('chooseShipping', () => {
  const zone: ShippingZone = {
    id: 'z1',
    name: 'US',
    countries: ['US'],
    methods: [
      { id: 'std', name: 'Standard', price: usd(500), freeThreshold: usd(7500) },
      { id: 'exp', name: 'Express', price: usd(1500) },
    ],
  };

  it('returns zero when no zone configured', () => {
    expect(chooseShipping(usd(1000), undefined).price).toEqual(usd(0));
  });

  it('defaults to first method', () => {
    expect(chooseShipping(usd(1000), zone).method?.id).toBe('std');
  });

  it('respects preferred method', () => {
    expect(chooseShipping(usd(1000), zone, 'exp').method?.id).toBe('exp');
    expect(chooseShipping(usd(1000), zone, 'exp').price).toEqual(usd(1500));
  });

  it('honors free-shipping threshold', () => {
    expect(chooseShipping(usd(7500), zone, 'std').price).toEqual(usd(0));
    expect(chooseShipping(usd(7499), zone, 'std').price).toEqual(usd(500));
  });
});

describe('calculateTax', () => {
  const rules: TaxRule[] = [
    { id: '1', name: 'UK VAT', country: 'GB', rate: 0.2, includedInPrice: false },
    { id: '2', name: 'CA-ON', country: 'CA', region: 'ON', rate: 0.13, includedInPrice: false },
    { id: '3', name: 'EU baseline', country: '*', rate: 0.21, includedInPrice: true },
  ];

  it('applies the right rule by country+region', () => {
    expect(calculateTax(usd(10000), rules, 'CA', 'ON')).toEqual(usd(1300));
  });

  it('falls back to wildcard', () => {
    expect(calculateTax(usd(10000), rules, 'FR')).toEqual(usd(0));
  });

  it('returns zero when tax is already included in price', () => {
    expect(calculateTax(usd(10000), [rules[2]], 'FR')).toEqual(usd(0));
  });

  it('applies UK VAT exclusive of price', () => {
    expect(calculateTax(usd(10000), rules, 'GB')).toEqual(usd(2000));
  });
});

describe('calculateTotals', () => {
  it('chains discount → shipping → tax in the right order', () => {
    const items: CartLineItem[] = [
      { productId: 'p2', quantity: 1, capturedPrice: usd(8000) },
    ];
    const totals = calculateTotals({
      items,
      products: [hoodie],
      discount: { code: 'TEN', type: 'percentage', value: 10 },
      shipping: {
        zone: {
          id: 'z', name: 'US', countries: ['US'],
          methods: [{ id: 'std', name: 'Std', price: usd(500) }],
        },
      },
      tax: {
        rules: [{ id: 't', name: 'US', country: 'US', rate: 0.08, includedInPrice: false }],
        country: 'US',
      },
    });
    // subtotal 8000, -10% = -800, after = 7200, +500 shipping = 7700, +8% tax = 616
    expect(totals.subtotal).toEqual(usd(8000));
    expect(totals.discount).toEqual(usd(800));
    expect(totals.shipping).toEqual(usd(500));
    expect(totals.tax).toEqual(usd(616));
    expect(totals.total).toEqual(usd(8316));
  });
});

describe('inventory', () => {
  it('isInStock treats null inventory as in-stock (untracked)', () => {
    expect(isInStock(hoodie)).toBe(true);
  });

  it('checks variant inventory when variantId given', () => {
    expect(isInStock(tee, 'v1')).toBe(true);
    expect(isInStock({ ...tee, variants: [{ ...tee.variants[0], inventory: 0 }] }, 'v1')).toBe(false);
  });

  it('availableQuantity returns variant or product number', () => {
    expect(availableQuantity(tee, 'v1')).toBe(3);
    expect(availableQuantity(hoodie)).toBe(null);
  });
});

describe('beginCheckout: payment-link mode', () => {
  it('rejects empty carts', async () => {
    await expect(
      beginCheckout({
        items: [],
        products: [tee],
        totals: calculateTotals({ items: [], products: [tee] }),
        settings: {
          storeName: 'X', contactEmail: '', defaultCurrency: 'USD',
          checkout: { type: 'stripe-payment-link' },
          enableCart: true, enableGuestCheckout: true, enableInventoryTracking: false,
          enableSocialProof: false, legal: {},
        },
        successUrl: 'https://x', cancelUrl: 'https://y',
      }),
    ).rejects.toThrow(/empty/i);
  });

  it('rejects multi-item carts (payment links are 1-product only)', async () => {
    const items: CartLineItem[] = [
      { productId: 'p1', quantity: 1, capturedPrice: usd(2500) },
      { productId: 'p2', quantity: 1, capturedPrice: usd(8000) },
    ];
    await expect(
      beginCheckout({
        items,
        products: [tee, hoodie],
        totals: calculateTotals({ items, products: [tee, hoodie] }),
        settings: {
          storeName: 'X', contactEmail: '', defaultCurrency: 'USD',
          checkout: { type: 'stripe-payment-link' },
          enableCart: true, enableGuestCheckout: true, enableInventoryTracking: false,
          enableSocialProof: false, legal: {},
        },
        successUrl: 'https://x', cancelUrl: 'https://y',
      }),
    ).rejects.toThrow(/single product/i);
  });

  it('builds a payment-link URL with quantity', async () => {
    const productWithLink: Product = { ...hoodie, stripePaymentLinkUrl: 'https://buy.stripe.com/abc' };
    const items: CartLineItem[] = [{ productId: 'p2', quantity: 3, capturedPrice: usd(8000) }];
    const res = await beginCheckout({
      items,
      products: [productWithLink],
      totals: calculateTotals({ items, products: [productWithLink] }),
      settings: {
        storeName: 'X', contactEmail: 'a@b.co', defaultCurrency: 'USD',
        checkout: { type: 'stripe-payment-link' },
        enableCart: true, enableGuestCheckout: true, enableInventoryTracking: false,
        enableSocialProof: false, legal: {},
      },
      customerEmail: 'buyer@example.com',
      successUrl: 'https://x', cancelUrl: 'https://y',
    });
    expect(res.redirectUrl).toContain('quantity=3');
    expect(res.redirectUrl).toContain('prefilled_email=buyer%40example.com');
  });
});
