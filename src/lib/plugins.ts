/**
 * Plugin / extension system.
 *
 * OpenBuild's component library, code generators, exporters and integrations are
 * all surfaced through a single registry so third-party authors can extend the
 * editor without forking. A plugin is a plain object: declare what it provides,
 * call `registerPlugin()` once at module init, and the editor will pick it up.
 *
 * This file intentionally has no Vue / Pinia imports — plugins should remain
 * unit-testable in plain Node.
 */

import type { ComponentDefinition, ComponentType } from '@/types/component';

export interface ExporterPlugin {
  id: string;
  name: string;
  description: string;
  /** File extension produced (e.g. 'zip', 'html'). */
  extension: string;
  export(payload: ExportPayload): Promise<Blob | string>;
}

export interface ExportPayload {
  projectName: string;
  fullPageHTML: string;
  css: string;
  js: string;
  assets: ReadonlyArray<{ name: string; url: string }>;
}

export interface IntegrationPlugin {
  id: string;
  name: string;
  category: 'analytics' | 'forms' | 'commerce' | 'cms' | 'storage' | 'auth';
  configSchema: ReadonlyArray<{
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'secret' | 'url';
    required?: boolean;
    placeholder?: string;
  }>;
}

export interface OpenBuildPlugin {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  components?: ReadonlyArray<Readonly<ComponentDefinition>>;
  exporters?: ReadonlyArray<ExporterPlugin>;
  integrations?: ReadonlyArray<IntegrationPlugin>;
}

interface Registry {
  plugins: Map<string, OpenBuildPlugin>;
  components: Map<ComponentType, ComponentDefinition>;
  exporters: Map<string, ExporterPlugin>;
  integrations: Map<string, IntegrationPlugin>;
}

const registry: Registry = {
  plugins: new Map(),
  components: new Map(),
  exporters: new Map(),
  integrations: new Map(),
};

export function registerPlugin(plugin: OpenBuildPlugin): void {
  if (registry.plugins.has(plugin.id)) {
    if (import.meta.env.DEV) {
      console.warn(`[plugins] Plugin "${plugin.id}" already registered — overwriting.`);
    }
  }
  registry.plugins.set(plugin.id, plugin);

  for (const def of plugin.components ?? []) {
    registry.components.set(def.type, def);
  }
  for (const exp of plugin.exporters ?? []) {
    registry.exporters.set(exp.id, exp);
  }
  for (const integ of plugin.integrations ?? []) {
    registry.integrations.set(integ.id, integ);
  }
}

export function unregisterPlugin(id: string): void {
  const plugin = registry.plugins.get(id);
  if (!plugin) return;
  registry.plugins.delete(id);
  for (const def of plugin.components ?? []) registry.components.delete(def.type);
  for (const exp of plugin.exporters ?? []) registry.exporters.delete(exp.id);
  for (const integ of plugin.integrations ?? []) registry.integrations.delete(integ.id);
}

export function getRegisteredComponents(): ReadonlyMap<ComponentType, ComponentDefinition> {
  return registry.components;
}

export function getRegisteredExporters(): ReadonlyMap<string, ExporterPlugin> {
  return registry.exporters;
}

export function getRegisteredIntegrations(): ReadonlyMap<string, IntegrationPlugin> {
  return registry.integrations;
}

export function listPlugins(): ReadonlyArray<OpenBuildPlugin> {
  return [...registry.plugins.values()];
}

/** Internal helper for tests — wipes the registry. Not exported in plugin docs. */
export function __resetRegistryForTests(): void {
  registry.plugins.clear();
  registry.components.clear();
  registry.exporters.clear();
  registry.integrations.clear();
}
