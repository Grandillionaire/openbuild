/**
 * Analytics providers.
 *
 * Each provider takes a small config payload (measurement id, domain, etc.)
 * and emits the official snippet for the exported site. We deliberately
 * embed the snippets verbatim from each vendor's installation docs so they
 * stay correct as those vendors evolve their loaders.
 */

import type { AnalyticsProvider } from './types';

function escapeAttr(v: string): string {
  return v.replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export const ga4Provider: AnalyticsProvider = {
  id: 'ga4',
  name: 'Google Analytics 4',
  docsUrl: 'https://support.google.com/analytics/answer/9304153',
  fields: [
    {
      key: 'measurementId',
      label: 'Measurement ID',
      type: 'string',
      placeholder: 'G-XXXXXXXXXX',
      required: true,
      helpText: 'Find it under Admin → Data Streams → Web in your GA4 property.',
    },
    {
      key: 'anonymizeIp',
      label: 'Anonymize visitor IPs',
      type: 'select',
      options: [
        { value: 'true', label: 'Yes (recommended for EU compliance)' },
        { value: 'false', label: 'No' },
      ],
    },
  ],
  buildSnippet(config) {
    const id = config.measurementId?.trim();
    if (!id) return {};
    const anon = config.anonymizeIp !== 'false';
    return {
      head: `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeAttr(id)}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${escapeAttr(id)}'${anon ? `, { 'anonymize_ip': true }` : ''});
</script>`,
    };
  },
};

export const plausibleProvider: AnalyticsProvider = {
  id: 'plausible',
  name: 'Plausible',
  docsUrl: 'https://plausible.io/docs/plausible-script',
  fields: [
    {
      key: 'domain',
      label: 'Site domain',
      type: 'string',
      placeholder: 'yoursite.com',
      required: true,
    },
    {
      key: 'host',
      label: 'Plausible host (self-hosted only)',
      type: 'url',
      placeholder: 'https://plausible.io',
    },
  ],
  buildSnippet(config) {
    const domain = config.domain?.trim();
    if (!domain) return {};
    const host = (config.host?.trim() || 'https://plausible.io').replace(/\/$/, '');
    return {
      head: `<!-- Plausible Analytics -->
<script defer data-domain="${escapeAttr(domain)}" src="${escapeAttr(host)}/js/script.js"></script>`,
    };
  },
};

export const fathomProvider: AnalyticsProvider = {
  id: 'fathom',
  name: 'Fathom',
  docsUrl: 'https://usefathom.com/docs/script/embed',
  fields: [
    { key: 'siteId', label: 'Site ID', type: 'string', placeholder: 'ABCDEFGH', required: true },
  ],
  buildSnippet(config) {
    const siteId = config.siteId?.trim();
    if (!siteId) return {};
    return {
      head: `<!-- Fathom -->
<script src="https://cdn.usefathom.com/script.js" data-site="${escapeAttr(siteId)}" defer></script>`,
    };
  },
};

export const umamiProvider: AnalyticsProvider = {
  id: 'umami',
  name: 'Umami',
  docsUrl: 'https://umami.is/docs/install',
  fields: [
    { key: 'websiteId', label: 'Website ID', type: 'string', required: true },
    {
      key: 'src',
      label: 'Script URL',
      type: 'url',
      placeholder: 'https://cloud.umami.is/script.js',
      required: true,
    },
  ],
  buildSnippet(config) {
    const id = config.websiteId?.trim();
    const src = config.src?.trim() || 'https://cloud.umami.is/script.js';
    if (!id) return {};
    return {
      head: `<!-- Umami -->
<script async defer src="${escapeAttr(src)}" data-website-id="${escapeAttr(id)}"></script>`,
    };
  },
};

export const analyticsProviders: ReadonlyArray<AnalyticsProvider> = [
  ga4Provider,
  plausibleProvider,
  fathomProvider,
  umamiProvider,
];

export function findAnalyticsProvider(id: string): AnalyticsProvider | undefined {
  return analyticsProviders.find((p) => p.id === id);
}
