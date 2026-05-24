<template>
  <div class="store-settings">
    <h2>Store settings</h2>

    <section class="ss-section">
      <h3>Storefront</h3>
      <label>
        <span>Store name</span>
        <input :value="settings.storeName" @input="update({ storeName: ($event.target as HTMLInputElement).value })" />
      </label>
      <label>
        <span>Contact email</span>
        <input type="email" :value="settings.contactEmail" placeholder="orders@yourstore.com" @input="update({ contactEmail: ($event.target as HTMLInputElement).value })" />
      </label>
      <label>
        <span>Default currency</span>
        <select :value="settings.defaultCurrency" @change="update({ defaultCurrency: ($event.target as HTMLSelectElement).value as CurrencyCode })">
          <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
    </section>

    <section class="ss-section">
      <h3>Checkout</h3>
      <p class="ss-description">
        Choose how customers pay. Stripe Payment Links work without a backend — perfect for single-product checkouts. For multi-item carts, point us at a Checkout Session endpoint.
      </p>
      <label>
        <span>Mode</span>
        <select :value="checkoutType" @change="updateCheckoutMode(($event.target as HTMLSelectElement).value)">
          <option value="mock">Demo mode (no real payments)</option>
          <option value="stripe-payment-link">Stripe Payment Links (no backend)</option>
          <option value="stripe-checkout-session">Stripe Checkout Session (requires endpoint)</option>
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
      </label>
      <label v-if="checkoutType !== 'mock' && checkoutType !== 'custom-webhook'">
        <span>Stripe publishable key</span>
        <input
          :value="settings.stripePublishableKey || ''"
          placeholder="pk_live_…"
          @input="update({ stripePublishableKey: ($event.target as HTMLInputElement).value || undefined })"
        />
      </label>
    </section>

    <section class="ss-section">
      <h3>Cart behavior</h3>
      <label class="ss-toggle">
        <input type="checkbox" :checked="settings.enableCart" @change="update({ enableCart: ($event.target as HTMLInputElement).checked })" />
        Enable cart drawer
      </label>
      <label class="ss-toggle">
        <input type="checkbox" :checked="settings.enableGuestCheckout" @change="update({ enableGuestCheckout: ($event.target as HTMLInputElement).checked })" />
        Allow guest checkout
      </label>
      <label class="ss-toggle">
        <input type="checkbox" :checked="settings.enableInventoryTracking" @change="update({ enableInventoryTracking: ($event.target as HTMLInputElement).checked })" />
        Track inventory
      </label>
    </section>

    <section class="ss-section">
      <h3>Legal</h3>
      <label>
        <span>Terms of service URL</span>
        <input :value="settings.legal.termsUrl || ''" @input="updateLegal({ termsUrl: ($event.target as HTMLInputElement).value })" />
      </label>
      <label>
        <span>Privacy policy URL</span>
        <input :value="settings.legal.privacyUrl || ''" @input="updateLegal({ privacyUrl: ($event.target as HTMLInputElement).value })" />
      </label>
      <label>
        <span>Refund policy URL</span>
        <input :value="settings.legal.refundPolicyUrl || ''" @input="updateLegal({ refundPolicyUrl: ($event.target as HTMLInputElement).value })" />
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
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK', 'DKK',
  'JPY', 'CNY', 'HKD', 'SGD', 'INR', 'BRL', 'MXN', 'NZD', 'ZAR',
  'PLN', 'CZK', 'HUF', 'TRY', 'AED', 'SAR', 'ILS',
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
    case 'stripe-payment-link': mode = { type: 'stripe-payment-link' }; break;
    case 'stripe-checkout-session': mode = { type: 'stripe-checkout-session', endpoint: endpointValue.value || '' }; break;
    case 'custom-webhook': mode = { type: 'custom-webhook', endpoint: endpointValue.value || '' }; break;
    default: mode = { type: 'mock' };
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
.store-settings { padding: 28px; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
.store-settings h2 { margin: 0; font-size: 1.5rem; font-weight: 700; color: #111827; }
.ss-section { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
.ss-section h3 { margin: 0; font-size: 1rem; font-weight: 600; color: #111827; }
.ss-description { margin: 0; font-size: 0.875rem; color: #6B7280; line-height: 1.5; }
.ss-section label { display: flex; flex-direction: column; gap: 4px; font-size: 0.875rem; font-weight: 500; color: #374151; }
.ss-section input, .ss-section select { padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; font-family: inherit; }
.ss-section input:focus, .ss-section select:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.ss-toggle { flex-direction: row; align-items: center; gap: 10px; cursor: pointer; }
.ss-toggle input[type='checkbox'] { width: 18px; height: 18px; cursor: pointer; }
</style>
