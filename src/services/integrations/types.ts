/**
 * Integration types shared by analytics, forms, marketing and storage providers.
 *
 * An integration is a typed object describing how to turn a small configuration
 * payload into either:
 *   - A `<script>` snippet injected into the exported site's <head> (analytics)
 *   - A `<form>` action URL + extra hidden fields (form providers)
 *
 * Integrations are registered through `src/lib/plugins.ts` and consumed by:
 *   - The IntegrationsManager admin UI
 *   - `codeGenerator.buildHeadScripts()` at export time
 *   - The Newsletter/Form components at runtime
 */

export interface AnalyticsProvider {
  readonly id: string;
  readonly name: string;
  readonly docsUrl: string;
  readonly fields: ReadonlyArray<IntegrationField>;
  /** Returns the <script> markup (without surrounding <script> tag for inline) to inject. */
  buildSnippet(config: Record<string, string>): { head?: string; bodyEnd?: string };
}

export interface FormProvider {
  readonly id: string;
  readonly name: string;
  readonly docsUrl: string;
  readonly fields: ReadonlyArray<IntegrationField>;
  /** Returns the action URL and any hidden input fields to embed in the form. */
  buildFormAction(config: Record<string, string>): {
    action: string;
    method: 'POST' | 'GET';
    hiddenFields: ReadonlyArray<{ name: string; value: string }>;
  };
}

export interface IntegrationField {
  key: string;
  label: string;
  type: 'string' | 'secret' | 'url' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: ReadonlyArray<{ value: string; label: string }>;
  helpText?: string;
}

export interface IntegrationConfig {
  /** Provider id (e.g. 'ga4', 'formspree') */
  providerId: string;
  /** Whether this integration is active in published exports. */
  enabled: boolean;
  values: Record<string, string>;
}
