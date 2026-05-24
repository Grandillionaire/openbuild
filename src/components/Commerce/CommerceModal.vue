<template>
  <div v-if="open" class="cm-overlay" @click.self="$emit('close')">
    <div class="cm" role="dialog" aria-labelledby="cm-title">
      <header class="cm-head">
        <h2 id="cm-title">Store</h2>
        <button class="cm-close" aria-label="Close" @click="$emit('close')">×</button>
      </header>
      <nav class="cm-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          role="tab"
          :aria-selected="active === tab.id"
          :class="['cm-tab', { active: active === tab.id }]"
          @click="active = tab.id"
        >
          <span>{{ tab.label }}</span>
          <span v-if="tab.badge" class="cm-badge">{{ tab.badge }}</span>
        </button>
      </nav>
      <section class="cm-body">
        <ProductManager v-if="active === 'products'" />
        <OrdersManager v-else-if="active === 'orders'" />
        <StoreSettings v-else-if="active === 'settings'" />
        <IntegrationsManager v-else-if="active === 'integrations'" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommerceStore } from '@/stores/commerce';
import ProductManager from './ProductManager.vue';
import OrdersManager from './OrdersManager.vue';
import StoreSettings from './StoreSettings.vue';
import IntegrationsManager from '@/components/Integrations/IntegrationsManager.vue';

defineProps<{ open: boolean }>();
defineEmits<{ (e: 'close'): void }>();

type TabId = 'products' | 'orders' | 'settings' | 'integrations';
const active = ref<TabId>('products');
const store = useCommerceStore();

const tabs = computed(() => [
  { id: 'products' as TabId, label: 'Products', badge: store.products.length || null },
  { id: 'orders' as TabId, label: 'Orders', badge: store.orders.length || null },
  { id: 'settings' as TabId, label: 'Store settings', badge: null },
  { id: 'integrations' as TabId, label: 'Integrations', badge: null },
]);
</script>

<style scoped>
.cm-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(15, 23, 42, 0.55);
  display: grid; place-items: center;
  backdrop-filter: blur(2px);
}
.cm {
  width: min(1240px, 96vw);
  height: min(820px, 92vh);
  background: white;
  border-radius: 16px;
  display: grid; grid-template-rows: auto auto 1fr;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
}
.cm-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid #E5E7EB; }
.cm-head h2 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #111827; }
.cm-close { background: transparent; border: 0; font-size: 1.5rem; color: #6B7280; cursor: pointer; padding: 4px 10px; border-radius: 6px; }
.cm-close:hover { background: #F3F4F6; color: #111827; }
.cm-tabs { display: flex; padding: 0 16px; border-bottom: 1px solid #E5E7EB; background: #F9FAFB; }
.cm-tab { display: inline-flex; align-items: center; gap: 6px; padding: 12px 16px; background: transparent; border: 0; cursor: pointer; color: #6B7280; font-weight: 500; font-size: 0.875rem; border-bottom: 2px solid transparent; }
.cm-tab:hover { color: #111827; }
.cm-tab.active { color: #111827; border-bottom-color: #3B82F6; background: white; }
.cm-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 6px; font-size: 0.6875rem; font-weight: 600; background: #E5E7EB; color: #374151; border-radius: 999px; }
.cm-tab.active .cm-badge { background: #DBEAFE; color: #1E40AF; }
.cm-body { overflow: auto; }
</style>
