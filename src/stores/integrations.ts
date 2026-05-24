/**
 * Integrations store — pluggable analytics + form submission providers.
 *
 * State is persisted to localStorage so user-configured providers survive
 * reload. Secrets like form access keys are stored client-side (this is a
 * client-only builder); they're embedded into the published site verbatim,
 * which matches every form provider's own docs.
 */

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { telemetry } from '@/lib/telemetry';
import { findAnalyticsProvider } from '@/services/integrations/analytics';
import { findFormProvider } from '@/services/integrations/forms';
import type { IntegrationConfig } from '@/services/integrations/types';

const STORAGE_KEY = 'openbuild.integrations.v1';

interface PersistedState {
  analytics: IntegrationConfig | null;
  forms: IntegrationConfig | null;
}

function load(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : {};
  } catch (err) {
    telemetry.captureException(err, { scope: 'integrationsStore.load' });
    return {};
  }
}

export const useIntegrationsStore = defineStore('integrations', () => {
  const persisted = load();
  const analytics = ref<IntegrationConfig | null>(persisted.analytics ?? null);
  const forms = ref<IntegrationConfig | null>(persisted.forms ?? null);

  const activeAnalytics = computed(() =>
    analytics.value?.enabled ? findAnalyticsProvider(analytics.value.providerId) : undefined,
  );
  const activeFormProvider = computed(() =>
    forms.value?.enabled ? findFormProvider(forms.value.providerId) : undefined,
  );

  watch(
    [analytics, forms],
    () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ analytics: analytics.value, forms: forms.value } satisfies PersistedState),
        );
      } catch (err) {
        telemetry.captureException(err, { scope: 'integrationsStore.persist' });
      }
    },
    { deep: true },
  );

  function setAnalytics(providerId: string, values: Record<string, string>, enabled = true) {
    analytics.value = { providerId, values, enabled };
  }

  function clearAnalytics() {
    analytics.value = null;
  }

  function setFormProvider(providerId: string, values: Record<string, string>, enabled = true) {
    forms.value = { providerId, values, enabled };
  }

  function clearFormProvider() {
    forms.value = null;
  }

  /** Returns the snippet pair (head + bodyEnd) for the configured analytics, or empty. */
  function getAnalyticsSnippet(): { head?: string; bodyEnd?: string } {
    if (!analytics.value?.enabled) return {};
    const provider = findAnalyticsProvider(analytics.value.providerId);
    if (!provider) return {};
    try {
      return provider.buildSnippet(analytics.value.values);
    } catch (err) {
      telemetry.captureException(err, { scope: 'integrationsStore.getAnalyticsSnippet' });
      return {};
    }
  }

  return {
    analytics,
    forms,
    activeAnalytics,
    activeFormProvider,
    setAnalytics,
    clearAnalytics,
    setFormProvider,
    clearFormProvider,
    getAnalyticsSnippet,
  };
});
