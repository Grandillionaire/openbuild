<template>
  <div class="im">
    <h2>Integrations</h2>
    <p class="im-lead">Plug in analytics and form-submission providers. Settings persist locally and ship with your exported site.</p>

    <section class="im-card">
      <header>
        <h3>Analytics</h3>
        <label class="im-toggle">
          <input type="checkbox" :checked="!!store.analytics?.enabled" @change="toggleAnalytics(($event.target as HTMLInputElement).checked)" />
          Enabled
        </label>
      </header>
      <label>
        <span>Provider</span>
        <select :value="store.analytics?.providerId ?? ''" @change="setAnalyticsProvider(($event.target as HTMLSelectElement).value)">
          <option value="">— None —</option>
          <option v-for="p in analyticsProviders" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </label>
      <template v-if="activeAnalytics">
        <p class="im-docs">
          <a :href="activeAnalytics.docsUrl" target="_blank" rel="noopener noreferrer">Setup docs ↗</a>
        </p>
        <label v-for="field in activeAnalytics.fields" :key="field.key">
          <span>{{ field.label }}<span v-if="field.required" class="im-req">*</span></span>
          <select
            v-if="field.type === 'select' && field.options"
            :value="store.analytics?.values[field.key] ?? ''"
            @change="updateAnalyticsField(field.key, ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <input
            v-else
            :type="field.type === 'secret' ? 'password' : 'text'"
            :value="store.analytics?.values[field.key] ?? ''"
            :placeholder="field.placeholder"
            @input="updateAnalyticsField(field.key, ($event.target as HTMLInputElement).value)"
          />
          <small v-if="field.helpText" class="im-help">{{ field.helpText }}</small>
        </label>
      </template>
    </section>

    <section class="im-card">
      <header>
        <h3>Form submissions</h3>
        <label class="im-toggle">
          <input type="checkbox" :checked="!!store.forms?.enabled" @change="toggleForms(($event.target as HTMLInputElement).checked)" />
          Enabled
        </label>
      </header>
      <p class="im-lead">Newsletter and Form components route through this provider when "Use global form provider" is on.</p>
      <label>
        <span>Provider</span>
        <select :value="store.forms?.providerId ?? ''" @change="setFormProvider(($event.target as HTMLSelectElement).value)">
          <option value="">— None —</option>
          <option v-for="p in formProviders" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </label>
      <template v-if="activeFormProvider">
        <p v-if="activeFormProvider.docsUrl" class="im-docs">
          <a :href="activeFormProvider.docsUrl" target="_blank" rel="noopener noreferrer">Setup docs ↗</a>
        </p>
        <label v-for="field in activeFormProvider.fields" :key="field.key">
          <span>{{ field.label }}<span v-if="field.required" class="im-req">*</span></span>
          <input
            :type="field.type === 'secret' ? 'password' : 'text'"
            :value="store.forms?.values[field.key] ?? ''"
            :placeholder="field.placeholder"
            @input="updateFormField(field.key, ($event.target as HTMLInputElement).value)"
          />
          <small v-if="field.helpText" class="im-help">{{ field.helpText }}</small>
        </label>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useIntegrationsStore } from '@/stores/integrations';
import { analyticsProviders, findAnalyticsProvider } from '@/services/integrations/analytics';
import { formProviders, findFormProvider } from '@/services/integrations/forms';

const store = useIntegrationsStore();

const activeAnalytics = computed(() =>
  store.analytics ? findAnalyticsProvider(store.analytics.providerId) : undefined,
);
const activeFormProvider = computed(() =>
  store.forms ? findFormProvider(store.forms.providerId) : undefined,
);

function setAnalyticsProvider(id: string) {
  if (!id) { store.clearAnalytics(); return; }
  store.setAnalytics(id, store.analytics?.providerId === id ? store.analytics.values : {}, store.analytics?.enabled ?? true);
}

function updateAnalyticsField(key: string, value: string) {
  if (!store.analytics) return;
  store.setAnalytics(store.analytics.providerId, { ...store.analytics.values, [key]: value }, store.analytics.enabled);
}

function toggleAnalytics(enabled: boolean) {
  if (!store.analytics) return;
  store.setAnalytics(store.analytics.providerId, store.analytics.values, enabled);
}

function setFormProvider(id: string) {
  if (!id) { store.clearFormProvider(); return; }
  store.setFormProvider(id, store.forms?.providerId === id ? store.forms.values : {}, store.forms?.enabled ?? true);
}

function updateFormField(key: string, value: string) {
  if (!store.forms) return;
  store.setFormProvider(store.forms.providerId, { ...store.forms.values, [key]: value }, store.forms.enabled);
}

function toggleForms(enabled: boolean) {
  if (!store.forms) return;
  store.setFormProvider(store.forms.providerId, store.forms.values, enabled);
}
</script>

<style scoped>
.im { padding: 24px; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.im h2 { margin: 0; font-size: 1.5rem; font-weight: 700; color: #111827; }
.im-lead { margin: 0; color: #6B7280; font-size: 0.875rem; line-height: 1.5; }
.im-card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
.im-card header { display: flex; justify-content: space-between; align-items: center; }
.im-card h3 { margin: 0; font-size: 1rem; font-weight: 600; color: #111827; }
.im-toggle { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; color: #374151; cursor: pointer; }
.im-toggle input { width: 16px; height: 16px; cursor: pointer; }
.im-card label:not(.im-toggle) { display: flex; flex-direction: column; gap: 4px; font-size: 0.875rem; font-weight: 500; color: #374151; }
.im-card input, .im-card select { padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; font-family: inherit; }
.im-card input:focus, .im-card select:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }
.im-docs { margin: 0; font-size: 0.75rem; }
.im-docs a { color: #3B82F6; text-decoration: none; font-weight: 500; }
.im-req { color: #EF4444; margin-left: 2px; }
.im-help { color: #6B7280; font-size: 0.75rem; font-weight: 400; line-height: 1.4; }
</style>
