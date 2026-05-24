<template>
  <div class="pm">
    <header class="pm-header">
      <div>
        <h2>Products</h2>
        <p class="pm-subtitle">{{ products.length }} {{ products.length === 1 ? 'product' : 'products' }} · {{ activeCount }} live</p>
      </div>
      <div class="pm-actions">
        <button v-if="products.length === 0" class="pm-btn pm-btn-secondary" @click="seedDemo">Add demo products</button>
        <button class="pm-btn pm-btn-primary" @click="createDraft">+ New product</button>
      </div>
    </header>

    <div class="pm-toolbar">
      <input v-model="search" class="pm-search" placeholder="Search products" aria-label="Search products" />
      <select v-model="statusFilter" class="pm-filter">
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
      <div v-if="selectedIds.size > 0" class="pm-bulk">
        <span>{{ selectedIds.size }} selected</span>
        <button class="pm-btn pm-btn-ghost" @click="bulkSetStatus('active')">Activate</button>
        <button class="pm-btn pm-btn-ghost" @click="bulkSetStatus('archived')">Archive</button>
        <button class="pm-btn pm-btn-ghost pm-btn-danger" @click="bulkDelete">Delete</button>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="pm-empty">
      <div class="pm-empty-icon">🛍</div>
      <h3>{{ products.length === 0 ? 'No products yet' : 'No matches' }}</h3>
      <p v-if="products.length === 0">Add your first product to start selling. You can connect Stripe later in Store Settings.</p>
      <p v-else>Try adjusting your search or filter.</p>
    </div>

    <div v-else class="pm-body">
      <table class="pm-table">
        <thead>
          <tr>
            <th class="pm-check-col"><input type="checkbox" :checked="allVisibleSelected" @change="toggleSelectAll(($event.target as HTMLInputElement).checked)" /></th>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>Inventory</th>
            <th>Variants</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" :class="{ active: editingId === product.id }">
            <td class="pm-check-col"><input type="checkbox" :checked="selectedIds.has(product.id)" @change="toggleSelect(product.id)" /></td>
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
            <td>{{ product.variants.length === 0 ? '—' : `${product.variants.length} variants` }}</td>
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

      <aside v-if="editingProduct" class="pm-editor" :key="editingProduct.id">
        <header>
          <h3>Edit product</h3>
          <button @click="editingId = null" class="pm-btn pm-btn-ghost" aria-label="Close">×</button>
        </header>
        <div class="pm-tabs">
          <button v-for="t in tabs" :key="t" :class="['pm-tab', { active: activeTab === t }]" @click="activeTab = t">{{ t }}</button>
        </div>
        <div class="pm-editor-body">
          <!-- Details -->
          <div v-if="activeTab === 'Details'" class="pm-tab-body">
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
              <span>SKU</span>
              <input :value="editingProduct.sku ?? ''" @input="patch({ sku: ($event.target as HTMLInputElement).value || undefined })" />
            </label>
            <label>
              <span>Stripe Payment Link <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noopener" class="pm-help">create in Stripe ↗</a></span>
              <input :value="editingProduct.stripePaymentLinkUrl || ''" placeholder="https://buy.stripe.com/…" @input="patch({ stripePaymentLinkUrl: ($event.target as HTMLInputElement).value || undefined })" />
            </label>
          </div>

          <!-- Images -->
          <div v-else-if="activeTab === 'Images'" class="pm-tab-body">
            <p class="pm-hint">Paste image URLs (Unsplash / Cloudinary / Imgix / ImageKit URLs auto-get WebP + AVIF + responsive srcset).</p>
            <div class="pm-image-row" v-for="(image, idx) in editingProduct.images" :key="image.id">
              <img v-if="image.url" :src="image.url" :alt="image.alt" />
              <div v-else class="pm-image-placeholder">📷</div>
              <div class="pm-image-fields">
                <input :value="image.url" placeholder="https://…" @input="updateImageField(idx, 'url', ($event.target as HTMLInputElement).value)" />
                <input :value="image.alt" placeholder="Alt text" @input="updateImageField(idx, 'alt', ($event.target as HTMLInputElement).value)" />
              </div>
              <div class="pm-image-actions">
                <button :disabled="idx === 0" @click="moveImage(idx, -1)" aria-label="Move up">↑</button>
                <button :disabled="idx === editingProduct.images.length - 1" @click="moveImage(idx, 1)" aria-label="Move down">↓</button>
                <button class="pm-btn-danger" @click="removeImage(idx)" aria-label="Delete">×</button>
              </div>
            </div>
            <button class="pm-btn pm-btn-secondary" @click="addImage">+ Add image</button>
          </div>

          <!-- Variants -->
          <div v-else-if="activeTab === 'Variants'" class="pm-tab-body">
            <p class="pm-hint">Define attributes (e.g. "Size" → S, M, L). All combinations are generated as variants. Existing variant prices, SKUs and inventory are preserved when you add or remove options.</p>
            <div v-for="(attr, ai) in attributeDraft" :key="ai" class="pm-attr">
              <input class="pm-attr-name" :value="attr.name" placeholder="Attribute name" @input="updateAttrName(ai, ($event.target as HTMLInputElement).value)" />
              <input class="pm-attr-values" :value="attr.values.join(', ')" placeholder="comma-separated values" @input="updateAttrValues(ai, ($event.target as HTMLInputElement).value)" />
              <button class="pm-btn-icon pm-btn-danger" aria-label="Remove" @click="removeAttribute(ai)">×</button>
            </div>
            <div class="pm-attr-actions">
              <button class="pm-btn pm-btn-secondary" @click="addAttribute">+ Add attribute</button>
              <button class="pm-btn pm-btn-primary" :disabled="!attributesDirty" @click="applyAttributes">Generate variants</button>
            </div>

            <div v-if="editingProduct.variants.length > 0" class="pm-variants">
              <h4>Variants ({{ editingProduct.variants.length }})</h4>
              <div class="pm-variant" v-for="(variant, vi) in editingProduct.variants" :key="variant.id">
                <div class="pm-variant-head">{{ variant.name }}</div>
                <div class="pm-variant-fields">
                  <label><span>SKU</span><input :value="variant.sku ?? ''" @input="updateVariant(vi, 'sku', ($event.target as HTMLInputElement).value || undefined)" /></label>
                  <label><span>Price ({{ currency }})</span><input type="number" min="0" step="0.01" :value="(variant.price.amount / 100).toFixed(2)" @input="updateVariantPrice(vi, ($event.target as HTMLInputElement).value)" /></label>
                  <label><span>Inventory</span><input type="number" min="0" :value="variant.inventory ?? ''" placeholder="untracked" @input="updateVariantInventory(vi, ($event.target as HTMLInputElement).value)" /></label>
                </div>
              </div>
            </div>
          </div>

          <!-- SEO -->
          <div v-else-if="activeTab === 'SEO'" class="pm-tab-body">
            <label>
              <span>Page title</span>
              <input :value="editingProduct.seo?.title ?? ''" @input="updateSeo({ title: ($event.target as HTMLInputElement).value || undefined })" />
            </label>
            <label>
              <span>Meta description</span>
              <textarea :value="editingProduct.seo?.description ?? ''" rows="3" @input="updateSeo({ description: ($event.target as HTMLTextAreaElement).value || undefined })" />
            </label>
            <label>
              <span>Open Graph image URL</span>
              <input :value="editingProduct.seo?.ogImage ?? ''" placeholder="https://…" @input="updateSeo({ ogImage: ($event.target as HTMLInputElement).value || undefined })" />
            </label>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { nanoid } from 'nanoid';
import { useCommerceStore } from '@/stores/commerce';
import { formatMoney as fmt } from '@/services/commerceService';
import type { Money, Product, ProductImage, ProductStatus } from '@/types/commerce';

const store = useCommerceStore();
const editingId = ref<string | null>(null);
const search = ref('');
const statusFilter = ref<'' | ProductStatus>('');
const selectedIds = ref<Set<string>>(new Set());

const tabs = ['Details', 'Images', 'Variants', 'SEO'] as const;
type Tab = (typeof tabs)[number];
const activeTab = ref<Tab>('Details');

const products = computed(() => store.products);
const currency = computed(() => store.currency);
const editingProduct = computed(() => (editingId.value ? store.getProduct(editingId.value) : null));
const activeCount = computed(() => products.value.filter((p) => p.status === 'active').length);

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase();
  return products.value.filter((p) => {
    if (statusFilter.value && p.status !== statusFilter.value) return false;
    if (q && !(p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q))) return false;
    return true;
  });
});

const allVisibleSelected = computed(() => {
  if (filteredProducts.value.length === 0) return false;
  return filteredProducts.value.every((p) => selectedIds.value.has(p.id));
});

/* ---------- Variant attribute draft state ---------- */

interface AttrDraft { name: string; values: string[] }
const attributeDraft = ref<AttrDraft[]>([]);
const lastSyncedProductId = ref<string | null>(null);

watch(editingProduct, (p) => {
  if (!p) {
    attributeDraft.value = [];
    return;
  }
  if (lastSyncedProductId.value === p.id) return;
  lastSyncedProductId.value = p.id;
  // Recover existing attributes from existing variants
  const byName = new Map<string, Set<string>>();
  for (const v of p.variants) {
    for (const a of v.attributes) {
      if (!byName.has(a.name)) byName.set(a.name, new Set());
      byName.get(a.name)!.add(a.value);
    }
  }
  attributeDraft.value = [...byName.entries()].map(([name, values]) => ({ name, values: [...values] }));
  activeTab.value = 'Details';
}, { immediate: true });

const attributesDirty = computed(() => {
  const product = editingProduct.value;
  if (!product) return false;
  const current = JSON.stringify(attributeDraft.value);
  const fromVariants = (() => {
    const byName = new Map<string, Set<string>>();
    for (const v of product.variants) {
      for (const a of v.attributes) {
        if (!byName.has(a.name)) byName.set(a.name, new Set());
        byName.get(a.name)!.add(a.value);
      }
    }
    return JSON.stringify([...byName.entries()].map(([name, values]) => ({ name, values: [...values] })));
  })();
  return current !== fromVariants;
});

/* ---------- Mutations ---------- */

function formatMoney(m: Money): string { return fmt(m); }

function createDraft() {
  const product = store.createProduct({
    name: 'Untitled product',
    price: { amount: 1000, currency: currency.value },
    status: 'draft',
  });
  editingId.value = product.id;
}

function seedDemo() { store.seedDemoCatalog(); }
function edit(id: string) { editingId.value = id; activeTab.value = 'Details'; }
function remove(id: string) {
  if (confirm('Delete this product? This cannot be undone.')) {
    store.deleteProduct(id);
    if (editingId.value === id) editingId.value = null;
  }
}

function patch(p: Parameters<typeof store.updateProduct>[1]) {
  if (!editingId.value) return;
  store.updateProduct(editingId.value, p);
}

function updatePrice(field: 'price' | 'compareAtPrice', value: string) {
  if (!editingId.value) return;
  const cleaned = value.trim();
  if (field === 'compareAtPrice' && !cleaned) {
    store.updateProduct(editingId.value, { compareAtPrice: undefined });
    return;
  }
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num) || num < 0) return;
  store.updateProduct(editingId.value, {
    [field]: { amount: Math.round(num * 100), currency: currency.value },
  });
}

function updateInventory(value: string) {
  if (!editingId.value) return;
  const trimmed = value.trim();
  if (!trimmed) {
    store.updateProduct(editingId.value, { inventory: null });
    return;
  }
  const num = Number.parseInt(trimmed, 10);
  if (Number.isFinite(num) && num >= 0) store.updateProduct(editingId.value, { inventory: num });
}

/* ---------- Images ---------- */

function addImage() {
  if (!editingProduct.value || !editingId.value) return;
  const images: ProductImage[] = [
    ...editingProduct.value.images,
    { id: nanoid(6), url: '', alt: '', isPrimary: editingProduct.value.images.length === 0 },
  ];
  store.updateProduct(editingId.value, { images });
}

function updateImageField(idx: number, field: 'url' | 'alt', value: string) {
  if (!editingProduct.value || !editingId.value) return;
  const images = editingProduct.value.images.map((img, i) => (i === idx ? { ...img, [field]: value } : img));
  store.updateProduct(editingId.value, { images });
}

function removeImage(idx: number) {
  if (!editingProduct.value || !editingId.value) return;
  const images = editingProduct.value.images.filter((_, i) => i !== idx);
  if (images[0]) images[0] = { ...images[0], isPrimary: true };
  store.updateProduct(editingId.value, { images });
}

function moveImage(idx: number, delta: number) {
  if (!editingProduct.value || !editingId.value) return;
  const target = idx + delta;
  if (target < 0 || target >= editingProduct.value.images.length) return;
  const images = [...editingProduct.value.images];
  [images[idx], images[target]] = [images[target], images[idx]];
  // Primary image is always the first
  images.forEach((img, i) => (images[i] = { ...img, isPrimary: i === 0 }));
  store.updateProduct(editingId.value, { images });
}

/* ---------- Variants ---------- */

function addAttribute() { attributeDraft.value.push({ name: '', values: [] }); }
function removeAttribute(idx: number) { attributeDraft.value.splice(idx, 1); }
function updateAttrName(idx: number, name: string) { attributeDraft.value[idx].name = name; }
function updateAttrValues(idx: number, raw: string) {
  attributeDraft.value[idx].values = raw.split(',').map((v) => v.trim()).filter(Boolean);
}

function applyAttributes() {
  if (!editingId.value || !editingProduct.value) return;
  const cleaned = attributeDraft.value.filter((a) => a.name.trim() && a.values.length > 0);
  store.rebuildVariants(editingId.value, cleaned, editingProduct.value.price);
}

function updateVariant(idx: number, field: 'sku', value: string | undefined) {
  if (!editingProduct.value || !editingId.value) return;
  const variants = editingProduct.value.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v));
  store.updateProduct(editingId.value, { variants });
}

function updateVariantPrice(idx: number, value: string) {
  if (!editingProduct.value || !editingId.value) return;
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num) || num < 0) return;
  const variants = editingProduct.value.variants.map((v, i) =>
    i === idx ? { ...v, price: { amount: Math.round(num * 100), currency: currency.value } } : v,
  );
  store.updateProduct(editingId.value, { variants });
}

function updateVariantInventory(idx: number, value: string) {
  if (!editingProduct.value || !editingId.value) return;
  const trimmed = value.trim();
  const inventory = trimmed === '' ? null : Number.parseInt(trimmed, 10);
  if (inventory !== null && (!Number.isFinite(inventory) || inventory < 0)) return;
  const variants = editingProduct.value.variants.map((v, i) =>
    i === idx ? { ...v, inventory } : v,
  );
  store.updateProduct(editingId.value, { variants });
}

/* ---------- SEO ---------- */

function updateSeo(patchSeo: Partial<NonNullable<Product['seo']>>) {
  if (!editingProduct.value || !editingId.value) return;
  store.updateProduct(editingId.value, { seo: { ...editingProduct.value.seo, ...patchSeo } });
}

/* ---------- Bulk + selection ---------- */

function toggleSelect(id: string) {
  if (selectedIds.value.has(id)) selectedIds.value.delete(id);
  else selectedIds.value.add(id);
  // Force reactivity for Set
  selectedIds.value = new Set(selectedIds.value);
}

function toggleSelectAll(check: boolean) {
  selectedIds.value = check ? new Set(filteredProducts.value.map((p) => p.id)) : new Set();
}

function bulkSetStatus(status: ProductStatus) {
  for (const id of selectedIds.value) store.updateProduct(id, { status });
  selectedIds.value = new Set();
}

function bulkDelete() {
  if (!confirm(`Delete ${selectedIds.value.size} products? This cannot be undone.`)) return;
  for (const id of selectedIds.value) store.deleteProduct(id);
  selectedIds.value = new Set();
  if (editingId.value && !store.getProduct(editingId.value)) editingId.value = null;
}
</script>

<style scoped>
.pm { display: flex; flex-direction: column; gap: 0; height: 100%; }
.pm-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 24px 28px 16px; }
.pm-header h2 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #111827; }
.pm-subtitle { margin: 0; color: #6B7280; font-size: 0.875rem; }
.pm-actions { display: flex; gap: 8px; }
.pm-btn { padding: 8px 14px; border-radius: 8px; border: 1px solid transparent; font-weight: 600; cursor: pointer; font-size: 0.875rem; transition: background 0.15s, border-color 0.15s; }
.pm-btn-primary { background: #111827; color: white; }
.pm-btn-primary:hover { background: #1F2937; }
.pm-btn-primary:disabled { background: #9CA3AF; cursor: not-allowed; }
.pm-btn-secondary { background: white; color: #111827; border-color: #D1D5DB; }
.pm-btn-secondary:hover { background: #F9FAFB; }
.pm-btn-ghost { background: transparent; color: #6B7280; padding: 4px 8px; }
.pm-btn-ghost:hover { background: #F3F4F6; color: #111827; }
.pm-btn-danger:hover { color: #DC2626; background: #FEF2F2; }
.pm-btn-icon { background: transparent; border: 0; color: #9CA3AF; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 1.125rem; }
.pm-toolbar { display: flex; gap: 8px; align-items: center; padding: 0 28px 12px; }
.pm-search { flex: 1; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.875rem; }
.pm-filter { padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.875rem; background: white; }
.pm-bulk { display: flex; align-items: center; gap: 4px; padding: 4px 12px; background: #F3F4F6; border-radius: 8px; font-size: 0.875rem; color: #374151; }
.pm-empty { padding: 80px 32px; text-align: center; color: #6B7280; }
.pm-empty-icon { font-size: 3rem; margin-bottom: 16px; }
.pm-empty h3 { color: #111827; margin: 0 0 8px; }
.pm-body { display: grid; grid-template-columns: 1fr 420px; flex: 1; overflow: hidden; }
.pm-table { width: 100%; border-collapse: collapse; background: white; }
.pm-check-col { width: 36px; }
.pm-table th, .pm-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #F3F4F6; font-size: 0.875rem; }
.pm-table th { font-size: 0.75rem; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; background: #F9FAFB; }
.pm-table tr.active { background: #EFF6FF; }
.pm-thumb { width: 56px; }
.pm-thumb img { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; }
.pm-thumb-placeholder { width: 40px; height: 40px; background: #F3F4F6; border-radius: 6px; display: grid; place-items: center; font-size: 1.125rem; }
.pm-name { font-weight: 600; color: #111827; }
.pm-slug { font-size: 0.6875rem; color: #9CA3AF; font-family: ui-monospace, monospace; }
.pm-compare { font-size: 0.75rem; color: #9CA3AF; text-decoration: line-through; }
.pm-inventory.oos { color: #DC2626; font-weight: 600; }
.pm-untracked { color: #9CA3AF; font-style: italic; font-size: 0.875rem; }
.pm-status { font-size: 0.6875rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: capitalize; }
.pm-status-draft { background: #F3F4F6; color: #6B7280; }
.pm-status-active { background: #D1FAE5; color: #047857; }
.pm-status-archived { background: #FEF3C7; color: #92400E; }
.pm-row-actions { display: flex; gap: 4px; justify-content: flex-end; }
.pm-editor { border-left: 1px solid #E5E7EB; background: white; display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.pm-editor header { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid #E5E7EB; }
.pm-editor h3 { margin: 0; font-size: 1rem; }
.pm-tabs { display: flex; border-bottom: 1px solid #E5E7EB; padding: 0 16px; }
.pm-tab { padding: 10px 16px; background: transparent; border: 0; cursor: pointer; color: #6B7280; font-weight: 500; font-size: 0.8125rem; border-bottom: 2px solid transparent; }
.pm-tab.active { color: #111827; border-bottom-color: #3B82F6; }
.pm-editor-body { flex: 1; overflow-y: auto; }
.pm-tab-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.pm-editor label { display: flex; flex-direction: column; gap: 4px; font-size: 0.8125rem; color: #374151; font-weight: 500; }
.pm-editor input, .pm-editor textarea, .pm-editor select { padding: 7px 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; font-family: inherit; }
.pm-editor input:focus, .pm-editor textarea:focus, .pm-editor select:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.pm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.pm-help { color: #3B82F6; text-decoration: none; font-size: 0.75rem; font-weight: 500; margin-left: 6px; }
.pm-hint { font-size: 0.75rem; color: #6B7280; line-height: 1.5; margin: 0; padding: 10px 12px; background: #F9FAFB; border-radius: 6px; }
.pm-image-row { display: flex; gap: 8px; align-items: flex-start; padding: 8px; border: 1px solid #E5E7EB; border-radius: 8px; }
.pm-image-row img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
.pm-image-placeholder { width: 48px; height: 48px; background: #F3F4F6; border-radius: 4px; display: grid; place-items: center; font-size: 1rem; }
.pm-image-fields { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.pm-image-actions { display: flex; flex-direction: column; gap: 2px; }
.pm-image-actions button { width: 24px; height: 24px; background: white; border: 1px solid #E5E7EB; border-radius: 4px; cursor: pointer; color: #6B7280; padding: 0; }
.pm-image-actions button:disabled { opacity: 0.3; cursor: not-allowed; }
.pm-attr { display: flex; gap: 6px; align-items: center; }
.pm-attr-name { flex: 0 0 130px; }
.pm-attr-values { flex: 1; }
.pm-attr-actions { display: flex; gap: 8px; }
.pm-variants { display: flex; flex-direction: column; gap: 8px; }
.pm-variants h4 { margin: 16px 0 0; font-size: 0.875rem; color: #374151; }
.pm-variant { padding: 10px 12px; border: 1px solid #E5E7EB; border-radius: 8px; }
.pm-variant-head { font-weight: 600; color: #111827; font-size: 0.8125rem; margin-bottom: 6px; }
.pm-variant-fields { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
.pm-variant-fields label span { font-size: 0.6875rem; }
.pm-variant-fields input { padding: 6px 8px; font-size: 0.75rem; }
</style>
