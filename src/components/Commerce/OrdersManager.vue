<template>
  <div class="om">
    <header class="om-head">
      <div>
        <h2>Orders</h2>
        <p class="om-lead">
          {{ store.orders.length }} {{ store.orders.length === 1 ? 'order' : 'orders' }}
          <span v-if="lastSync" class="om-sync">· last synced {{ lastSync }}</span>
        </p>
      </div>
      <div class="om-actions">
        <button class="om-btn" @click="sync">Sync from runtime</button>
        <button class="om-btn" :disabled="store.orders.length === 0" @click="exportCsv">Export CSV</button>
      </div>
    </header>

    <div class="om-filters">
      <input v-model="search" placeholder="Search by id or email" />
      <select v-model="statusFilter">
        <option value="">All statuses</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div v-if="filtered.length === 0" class="om-empty">
      <p>No orders yet. Test a checkout on your published site — successful redirects to <code>?ob_checkout=success</code> are captured here automatically.</p>
    </div>

    <table v-else class="om-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
          <th>Customer</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filtered" :key="order.id">
          <td><code>{{ order.id }}</code></td>
          <td>{{ formatDate(order.createdAt) }}</td>
          <td>{{ itemCount(order) }} × items</td>
          <td>{{ formatMoney(order.totals.total) }}</td>
          <td>{{ order.customer.email || '—' }}</td>
          <td>
            <select :value="order.status" @change="changeStatus(order.id, ($event.target as HTMLSelectElement).value as OrderStatus)" :class="['om-status', `om-status-${order.status}`]">
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </td>
          <td>
            <button class="om-btn-icon" aria-label="Delete order" @click="confirmDelete(order.id)">×</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCommerceStore } from '@/stores/commerce';
import { formatMoney as fmt } from '@/services/commerceService';
import type { CartLineItem, Money, Order, OrderStatus } from '@/types/commerce';

const store = useCommerceStore();
const search = ref('');
const statusFilter = ref<OrderStatus | ''>('');
const lastSync = ref<string | null>(null);

const statuses: OrderStatus[] = ['pending', 'paid', 'fulfilled', 'refunded', 'cancelled'];

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return store.orders.filter((o: Order) => {
    if (statusFilter.value && o.status !== statusFilter.value) return false;
    if (q && !`${o.id} ${o.customer.email ?? ''}`.toLowerCase().includes(q)) return false;
    return true;
  });
});

function formatMoney(m: Money): string {
  return fmt(m);
}

function itemCount(o: Order): number {
  return o.items.reduce((sum: number, i: CartLineItem) => sum + i.quantity, 0);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch { return iso; }
}

function changeStatus(id: string, status: OrderStatus) {
  store.updateOrderStatus(id, status);
}

function confirmDelete(id: string) {
  if (confirm('Delete this order? This cannot be undone.')) store.deleteOrder(id);
}

function sync() {
  const added = store.consumePendingOrders();
  lastSync.value = new Date().toLocaleTimeString();
  if (added > 0) {
    alert(`${added} new ${added === 1 ? 'order' : 'orders'} captured.`);
  }
}

function exportCsv() {
  const rows: string[] = [
    ['id', 'createdAt', 'status', 'currency', 'total', 'customerEmail', 'items'].join(','),
  ];
  for (const o of filtered.value) {
    const items = o.items.map((i: CartLineItem) => `${i.productId}${i.variantId ? `/${i.variantId}` : ''}x${i.quantity}`).join('|');
    rows.push([
      o.id,
      o.createdAt,
      o.status,
      o.totals.total.currency,
      (o.totals.total.amount / 100).toFixed(2),
      escapeCsv(o.customer.email ?? ''),
      escapeCsv(items),
    ].join(','));
  }
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function escapeCsv(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

onMounted(() => {
  const added = store.consumePendingOrders();
  if (added > 0) lastSync.value = new Date().toLocaleTimeString();
});
</script>

<style scoped>
.om { padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; }
.om-head { display: flex; justify-content: space-between; align-items: flex-end; }
.om-head h2 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #111827; }
.om-lead { margin: 0; color: #6B7280; font-size: 0.875rem; }
.om-sync { color: #9CA3AF; }
.om-actions { display: flex; gap: 8px; }
.om-btn { padding: 8px 14px; background: white; border: 1px solid #D1D5DB; border-radius: 8px; font-weight: 600; font-size: 0.875rem; cursor: pointer; color: #111827; }
.om-btn:hover:not(:disabled) { background: #F9FAFB; }
.om-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.om-filters { display: flex; gap: 8px; }
.om-filters input { flex: 1; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
.om-filters select { padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; background: white; }
.om-table { width: 100%; background: white; border-collapse: collapse; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
.om-table th, .om-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #F3F4F6; font-size: 0.875rem; }
.om-table th { font-size: 0.75rem; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; background: #F9FAFB; }
.om-table code { font-family: ui-monospace, monospace; font-size: 0.75rem; color: #4B5563; }
.om-status { padding: 4px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; border: 1px solid transparent; }
.om-status-paid { background: #D1FAE5; color: #047857; border-color: #6EE7B7; }
.om-status-pending { background: #FEF3C7; color: #92400E; border-color: #FCD34D; }
.om-status-fulfilled { background: #DBEAFE; color: #1E40AF; border-color: #93C5FD; }
.om-status-refunded { background: #F3F4F6; color: #6B7280; border-color: #D1D5DB; }
.om-status-cancelled { background: #FEE2E2; color: #991B1B; border-color: #FCA5A5; }
.om-btn-icon { background: transparent; border: 0; color: #9CA3AF; cursor: pointer; font-size: 1.25rem; padding: 4px 8px; border-radius: 4px; }
.om-btn-icon:hover { color: #DC2626; background: #FEF2F2; }
.om-empty { padding: 60px 32px; text-align: center; color: #6B7280; background: white; border: 1px dashed #E5E7EB; border-radius: 12px; }
.om-empty code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, monospace; }
</style>
