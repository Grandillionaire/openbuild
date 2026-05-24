<template>
  <div class="product-manager">
    <header class="pm-header">
      <div>
        <h2>Products</h2>
        <p class="pm-subtitle">{{ products.length }} {{ products.length === 1 ? 'product' : 'products' }} in your catalog</p>
      </div>
      <div class="pm-actions">
        <button v-if="products.length === 0" class="pm-btn pm-btn-secondary" @click="seedDemo">Add demo products</button>
        <button class="pm-btn pm-btn-primary" @click="createDraft">+ New product</button>
      </div>
    </header>

    <div v-if="products.length === 0" class="pm-empty">
      <div class="pm-empty-icon">🛍</div>
      <h3>No products yet</h3>
      <p>Add your first product to start selling. You can connect Stripe later in Store Settings.</p>
    </div>

    <table v-else class="pm-table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Price</th>
          <th>Inventory</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" :class="{ active: editingId === product.id }">
          <td class="pm-thumb">
            <img v-if="product.images[0]?.url" :src="product.images[0].url" :alt="product.images[0].alt" />
            <div v-else class="pm-thumb-placeholder">📦</div>
          </td>
          <td>
            <div class="pm-name">{{ product.name }}</div>
            <div class="pm-slug">/{{ product.slug }}</div>
          </td>
          <td>
            {{ formatMoney(product.price) }}
            <div v-if="product.compareAtPrice" class="pm-compare">{{ formatMoney(product.compareAtPrice) }}</div>
          </td>
          <td>
            <span v-if="product.inventory === null" class="pm-untracked">untracked</span>
            <span v-else :class="['pm-inventory', product.inventory === 0 ? 'oos' : '']">{{ product.inventory }}</span>
          </td>
          <td>
            <span :class="['pm-status', `pm-status-${product.status}`]">{{ product.status }}</span>
          </td>
          <td class="pm-row-actions">
            <button @click="edit(product.id)" class="pm-btn pm-btn-ghost">Edit</button>
            <button @click="remove(product.id)" class="pm-btn pm-btn-ghost pm-btn-danger" aria-label="Delete product">×</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit panel -->
    <aside v-if="editingProduct" class="pm-editor" :key="editingProduct.id">
      <header>
        <h3>Edit product</h3>
        <button @click="editingId = null" class="pm-btn pm-btn-ghost" aria-label="Close">×</button>
      </header>
      <div class="pm-editor-body">
        <label>
          <span>Name</span>
          <input :value="editingProduct.name" @input="patch({ name: ($event.target as HTMLInputElement).value })" />
        </label>
        <label>
          <span>Description</span>
          <textarea :value="editingProduct.description" rows="3" @input="patch({ description: ($event.target as HTMLTextAreaElement).value })" />
        </label>
        <div class="pm-row-2">
          <label>
            <span>Price ({{ currency }})</span>
            <input type="number" min="0" step="0.01" :value="(editingProduct.price.amount / 100).toFixed(2)" @input="updatePrice('price', ($event.target as HTMLInputElement).value)" />
          </label>
          <label>
            <span>Compare-at price</span>
            <input type="number" min="0" step="0.01" :value="editingProduct.compareAtPrice ? (editingProduct.compareAtPrice.amount / 100).toFixed(2) : ''" placeholder="Optional" @input="updatePrice('compareAtPrice', ($event.target as HTMLInputElement).value)" />
          </label>
        </div>
        <label>
          <span>Primary image URL</span>
          <input :value="editingProduct.images[0]?.url || ''" placeholder="https://…" @input="updatePrimaryImage(($event.target as HTMLInputElement).value)" />
        </label>
        <div class="pm-row-2">
          <label>
            <span>Inventory</span>
            <input type="number" min="0" :value="editingProduct.inventory ?? ''" placeholder="untracked" @input="updateInventory(($event.target as HTMLInputElement).value)" />
          </label>
          <label>
            <span>Status</span>
            <select :value="editingProduct.status" @change="patch({ status: ($event.target as HTMLSelectElement).value as 'draft' | 'active' | 'archived' })">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
        <label>
          <span>Stripe Payment Link <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noopener" class="pm-help">create in Stripe ↗</a></span>
          <input :value="editingProduct.stripePaymentLinkUrl || ''" placeholder="https://buy.stripe.com/…" @input="patch({ stripePaymentLinkUrl: ($event.target as HTMLInputElement).value || undefined })" />
        </label>
        <p class="pm-hint">
          Tip: Stripe Payment Links work without a backend. For multi-item carts, set up a Checkout Session endpoint in Store Settings.
        </p>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommerceStore } from '@/stores/commerce';
import { formatMoney as fmt } from '@/services/commerceService';
import type { Money } from '@/types/commerce';

const store = useCommerceStore();
const editingId = ref<string | null>(null);

const products = computed(() => store.products);
const currency = computed(() => store.currency);
const editingProduct = computed(() => (editingId.value ? store.getProduct(editingId.value) : null));

function formatMoney(m: Money): string {
  return fmt(m);
}

function createDraft(): void {
  const product = store.createProduct({
    name: 'Untitled product',
    price: { amount: 1000, currency: currency.value },
    status: 'draft',
  });
  editingId.value = product.id;
}

function seedDemo(): void {
  store.seedDemoCatalog();
}

function edit(id: string): void {
  editingId.value = id;
}

function remove(id: string): void {
  if (confirm('Delete this product? This cannot be undone.')) {
    store.deleteProduct(id);
    if (editingId.value === id) editingId.value = null;
  }
}

function patch(p: Parameters<typeof store.updateProduct>[1]): void {
  if (!editingId.value) return;
  store.updateProduct(editingId.value, p);
}

function updatePrice(field: 'price' | 'compareAtPrice', value: string): void {
  if (!editingId.value) return;
  const cleaned = value.trim();
  if (field === 'compareAtPrice' && !cleaned) {
    store.updateProduct(editingId.value, { compareAtPrice: undefined });
    return;
  }
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num) || num < 0) return;
  const cents = Math.round(num * 100);
  store.updateProduct(editingId.value, {
    [field]: { amount: cents, currency: currency.value },
  });
}

function updatePrimaryImage(url: string): void {
  if (!editingId.value || !editingProduct.value) return;
  const trimmed = url.trim();
  const images = [...editingProduct.value.images];
  if (images[0]) {
    images[0] = { ...images[0], url: trimmed };
  } else if (trimmed) {
    images.push({ id: crypto.randomUUID(), url: trimmed, alt: editingProduct.value.name, isPrimary: true });
  }
  store.updateProduct(editingId.value, { images });
}

function updateInventory(value: string): void {
  if (!editingId.value) return;
  const trimmed = value.trim();
  if (!trimmed) {
    store.updateProduct(editingId.value, { inventory: null });
    return;
  }
  const num = Number.parseInt(trimmed, 10);
  if (Number.isFinite(num) && num >= 0) {
    store.updateProduct(editingId.value, { inventory: num });
  }
}
</script>

<style scoped>
.product-manager { display: grid; grid-template-columns: 1fr 380px; gap: 0; height: 100%; }
.pm-header { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: flex-end; padding: 24px 28px; border-bottom: 1px solid #E5E7EB; background: white; }
.pm-header h2 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #111827; }
.pm-subtitle { margin: 0; color: #6B7280; font-size: 0.875rem; }
.pm-actions { display: flex; gap: 8px; }
.pm-btn { padding: 8px 14px; border-radius: 8px; border: 1px solid transparent; font-weight: 600; cursor: pointer; font-size: 0.875rem; transition: background 0.15s, border-color 0.15s; }
.pm-btn-primary { background: #111827; color: white; }
.pm-btn-primary:hover { background: #1F2937; }
.pm-btn-secondary { background: white; color: #111827; border-color: #D1D5DB; }
.pm-btn-secondary:hover { background: #F9FAFB; }
.pm-btn-ghost { background: transparent; color: #6B7280; padding: 4px 8px; }
.pm-btn-ghost:hover { background: #F3F4F6; color: #111827; }
.pm-btn-danger:hover { color: #DC2626; background: #FEF2F2; }
.pm-empty { grid-column: 1 / -1; padding: 80px 32px; text-align: center; color: #6B7280; }
.pm-empty-icon { font-size: 3rem; margin-bottom: 16px; }
.pm-empty h3 { color: #111827; margin: 0 0 8px; }
.pm-table { grid-column: 1 / 2; width: 100%; border-collapse: collapse; background: white; }
.pm-table th, .pm-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #F3F4F6; }
.pm-table th { font-size: 0.75rem; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; }
.pm-table tr.active { background: #F9FAFB; }
.pm-thumb { width: 64px; }
.pm-thumb img { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; }
.pm-thumb-placeholder { width: 48px; height: 48px; background: #F3F4F6; border-radius: 6px; display: grid; place-items: center; font-size: 1.25rem; }
.pm-name { font-weight: 600; color: #111827; }
.pm-slug { font-size: 0.75rem; color: #9CA3AF; font-family: ui-monospace, monospace; }
.pm-compare { font-size: 0.75rem; color: #9CA3AF; text-decoration: line-through; }
.pm-inventory.oos { color: #DC2626; font-weight: 600; }
.pm-untracked { color: #9CA3AF; font-style: italic; font-size: 0.875rem; }
.pm-status { font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: capitalize; }
.pm-status-draft { background: #F3F4F6; color: #6B7280; }
.pm-status-active { background: #D1FAE5; color: #047857; }
.pm-status-archived { background: #FEF3C7; color: #92400E; }
.pm-row-actions { display: flex; gap: 4px; justify-content: flex-end; }
.pm-editor { grid-column: 2 / 3; border-left: 1px solid #E5E7EB; background: white; display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.pm-editor header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #E5E7EB; }
.pm-editor h3 { margin: 0; font-size: 1rem; }
.pm-editor-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.pm-editor label { display: flex; flex-direction: column; gap: 6px; font-size: 0.875rem; color: #374151; font-weight: 500; }
.pm-editor input, .pm-editor textarea, .pm-editor select { padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; font-family: inherit; }
.pm-editor input:focus, .pm-editor textarea:focus, .pm-editor select:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.pm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pm-help { color: #3B82F6; text-decoration: none; font-size: 0.75rem; font-weight: 500; margin-left: 8px; }
.pm-hint { font-size: 0.75rem; color: #6B7280; line-height: 1.5; margin: 0; padding: 12px; background: #F9FAFB; border-radius: 8px; }
</style>
