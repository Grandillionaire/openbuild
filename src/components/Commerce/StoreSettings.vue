<template>
  <div class="store-settings">
    <h2>Store settings</h2>

    <section class="ss-section">
      <h3>Storefront</h3>
      <label>
        <span>Store name</span>
        <input
          :value="settings.storeName"
          @input="update({ storeName: ($event.target as HTMLInputElement).value })"
        />
      </label>
      <label>
        <span>Contact email</span>
        <input
          type="email"
          :value="settings.contactEmail"
          placeholder="orders@yourstore.com"
          @input="update({ contactEmail: ($event.target as HTMLInputElement).value })"
        />
      </label>
      <label>
        <span>Default currency</span>
        <select
          :value="settings.defaultCurrency"
          @change="
            update({ defaultCurrency: ($event.target as HTMLSelectElement).value as CurrencyCode })
          "
        >
          <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
    </section>

    <section class="ss-section">
      <h3>Checkout</h3>
      <p class="ss-description">
        Choose how customers pay. Stripe Payment Links work without a backend — perfect for
        single-product checkouts. For multi-item carts, point us at a Checkout Session endpoint.
      </p>
      <label>
        <span>Mode</span>
        <select
          :value="checkoutType"
          @change="updateCheckoutMode(($event.target as HTMLSelectElement).value)"
        >
          <option value="mock">Demo mode (no real payments)</option>
          <option value="stripe-payment-link">Stripe Payment Links (no backend)</option>
          <option value="stripe-checkout-session">
            Stripe Checkout Session (requires endpoint)
          </option>
          <option value="custom-webhook">Custom webhook</option>
        </select>
      </label>
      <label v-if="checkoutType === 'stripe-checkout-session' || checkoutType === 'custom-webhook'">
        <span>Endpoint URL</span>
        <input
          :value="endpointValue"
          placeholder="https://api.yourstore.com/checkout"
          @input="updateEndpoint(($event.target as HTMLInputElement).value)"
        />
        <small v-if="checkoutType === 'stripe-checkout-session'" class="ss-help">
          Need an endpoint? Our
          <a
            href="https://github.com/maximilliangrand/openbuild/blob/main/docs/COMMERCE.md#minimal-vercelnetlify-function-40-lines"
            target="_blank"
            rel="noopener noreferrer"
            >40-line Vercel function template</a
          >
          handles this — copy, paste your Stripe secret key, deploy.
        </small>
      </label>
      <label v-if="checkoutType !== 'mock' && checkoutType !== 'custom-webhook'">
        <span>Stripe publishable key</span>
        <input
          :value="settings.stripePublishableKey || ''"
          placeholder="pk_test_… or pk_live_…"
          @input="
            update({ stripePublishableKey: ($event.target as HTMLInputElement).value || undefined })
          "
        />
        <small class="ss-help">
          <a
            href="https://dashboard.stripe.com/test/apikeys"
            target="_blank"
            rel="noopener noreferrer"
            >Get a test key from Stripe →</a
          >
          Test keys start with <code>pk_test_</code>; charge nothing real until you switch to
          <code>pk_live_</code>.
        </small>
      </label>
      <div v-if="checkoutType === 'stripe-payment-link'" class="ss-info">
        <strong>How this works:</strong> in Stripe, create a Payment Link per product (<a
          href="https://dashboard.stripe.com/payment-links"
          target="_blank"
          rel="noopener noreferrer"
          >Dashboard → Payment Links → New ↗</a
        >). Paste each URL on the matching product in the Products tab. OpenBuild redirects shoppers
        to that URL with the right quantity. Single product per checkout — switch to "Checkout
        Session" mode for real carts.
      </div>
      <div v-if="checkoutType === 'mock'" class="ss-info ss-info--warn">
        Demo mode: shows a toast instead of charging. Switch to Stripe Payment Links or Checkout
        Session before you ship.
      </div>
    </section>

    <section class="ss-section">
      <h3>Cart behavior</h3>
      <label class="ss-toggle">
        <input
          type="checkbox"
          :checked="settings.enableCart"
          @change="update({ enableCart: ($event.target as HTMLInputElement).checked })"
        />
        Enable cart drawer
      </label>
      <label class="ss-toggle">
        <input
          type="checkbox"
          :checked="settings.enableGuestCheckout"
          @change="update({ enableGuestCheckout: ($event.target as HTMLInputElement).checked })"
        />
        Allow guest checkout
      </label>
      <label class="ss-toggle">
        <input
          type="checkbox"
          :checked="settings.enableInventoryTracking"
          @change="update({ enableInventoryTracking: ($event.target as HTMLInputElement).checked })"
        />
        Track inventory
      </label>
    </section>

    <section class="ss-section">
      <h3>Legal</h3>
      <label>
        <span>Terms of service URL</span>
        <input
          :value="settings.legal.termsUrl || ''"
          @input="updateLegal({ termsUrl: ($event.target as HTMLInputElement).value })"
        />
      </label>
      <label>
        <span>Privacy policy URL</span>
        <input
          :value="settings.legal.privacyUrl || ''"
          @input="updateLegal({ privacyUrl: ($event.target as HTMLInputElement).value })"
        />
      </label>
      <label>
        <span>Refund policy URL</span>
        <input
          :value="settings.legal.refundPolicyUrl || ''"
          @input="updateLegal({ refundPolicyUrl: ($event.target as HTMLInputElement).value })"
        />
      </label>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommerceStore } from '@/stores/commerce';
import type { CheckoutMode, CommerceSettings, CurrencyCode } from '@/types/commerce';

const store = useCommerceStore();
const settings = computed(() => store.settings);

const CURRENCIES: ReadonlyArray<CurrencyCode> = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
  'JPY',
  'CNY',
  'HKD',
  'SGD',
  'INR',
  'BRL',
  'MXN',
  'NZD',
  'ZAR',
  'PLN',
  'CZK',
  'HUF',
  'TRY',
  'AED',
  'SAR',
  'ILS',
];

const checkoutType = computed(() => settings.value.checkout.type);
const endpointValue = computed(() => {
  const c = settings.value.checkout;
  if (c.type === 'stripe-checkout-session' || c.type === 'custom-webhook') return c.endpoint;
  return '';
});

function update(patch: Partial<CommerceSettings>): void {
  store.updateSettings(patch);
}

function updateLegal(patch: Partial<CommerceSettings['legal']>): void {
  store.updateSettings({ legal: { ...settings.value.legal, ...patch } });
}

function updateCheckoutMode(type: string): void {
  let mode: CheckoutMode;
  switch (type) {
    case 'stripe-payment-link':
      mode = { type: 'stripe-payment-link' };
      break;
    case 'stripe-checkout-session':
      mode = { type: 'stripe-checkout-session', endpoint: endpointValue.value || '' };
      break;
    case 'custom-webhook':
      mode = { type: 'custom-webhook', endpoint: endpointValue.value || '' };
      break;
    default:
      mode = { type: 'mock' };
  }
  store.updateSettings({ checkout: mode });
}

function updateEndpoint(url: string): void {
  const current = settings.value.checkout;
  if (current.type === 'stripe-checkout-session') {
    store.updateSettings({ checkout: { ...current, endpoint: url } });
  } else if (current.type === 'custom-webhook') {
    store.updateSettings({ checkout: { ...current, endpoint: url } });
  }
}
</script>

<style scoped>
.store-settings {
  padding: 28px;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.store-settings h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
.ss-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ss-section h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}
.ss-description {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}
.ss-section label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
.ss-section input,
.ss-section select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
}
.ss-section input:focus,
.ss-section select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.ss-toggle {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.ss-toggle input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.ss-help {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.5;
  margin-top: 4px;
}
.ss-help a {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
}
.ss-help a:hover {
  text-decoration: underline;
}
.ss-help code {
  font-family: ui-monospace, monospace;
  font-size: 0.6875rem;
  background: #f3f4f6;
  padding: 1px 6px;
  border-radius: 4px;
  color: #374151;
}
.ss-info {
  font-size: 0.8125rem;
  color: #075985;
  line-height: 1.6;
  padding: 12px 14px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 10px;
}
.ss-info a {
  color: #0369a1;
  font-weight: 600;
  text-decoration: none;
}
.ss-info a:hover {
  text-decoration: underline;
}
.ss-info--warn {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #92400e;
}
</style>
