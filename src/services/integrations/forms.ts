/**
 * Form-submission providers.
 *
 * The Newsletter and Form components emit a `<form>` element. The submission
 * endpoint and any hidden fields come from the configured form provider so
 * users can route submissions to Formspree / Web3Forms / Netlify Forms /
 * Getform / a custom endpoint without touching component code.
 *
 * All providers include a honeypot recommendation in their docs links — the
 * Newsletter and Form generators add a `_gotcha`/`_honey` hidden input that
 * mature providers ignore from real users but bots fill in.
 */

import type { FormProvider } from './types';

export const formspreeProvider: FormProvider = {
  id: 'formspree',
  name: 'Formspree',
  docsUrl: 'https://formspree.io/forms',
  fields: [
    {
      key: 'formId',
      label: 'Form ID',
      type: 'string',
      placeholder: 'xnqewlpz',
      required: true,
      helpText: 'The 8-character ID from your form\'s endpoint URL.',
    },
  ],
  buildFormAction(config) {
    const id = (config.formId || '').trim();
    return {
      action: id ? `https://formspree.io/f/${encodeURIComponent(id)}` : '#',
      method: 'POST',
      hiddenFields: [{ name: '_gotcha', value: '' }],
    };
  },
};

export const web3FormsProvider: FormProvider = {
  id: 'web3forms',
  name: 'Web3Forms',
  docsUrl: 'https://docs.web3forms.com/',
  fields: [
    {
      key: 'accessKey',
      label: 'Access key',
      type: 'secret',
      required: true,
      helpText: 'Sent in the form payload, not in your code. Safe to include in published HTML.',
    },
    {
      key: 'redirect',
      label: 'Redirect URL after submit',
      type: 'url',
      placeholder: 'https://yoursite.com/thanks',
    },
  ],
  buildFormAction(config) {
    const fields: Array<{ name: string; value: string }> = [
      { name: 'access_key', value: (config.accessKey || '').trim() },
      { name: 'botcheck', value: '' },
    ];
    if (config.redirect?.trim()) fields.push({ name: 'redirect', value: config.redirect.trim() });
    return {
      action: 'https://api.web3forms.com/submit',
      method: 'POST',
      hiddenFields: fields,
    };
  },
};

export const netlifyFormsProvider: FormProvider = {
  id: 'netlify-forms',
  name: 'Netlify Forms',
  docsUrl: 'https://docs.netlify.com/forms/setup/',
  fields: [
    {
      key: 'formName',
      label: 'Form name',
      type: 'string',
      placeholder: 'contact',
      required: true,
      helpText: 'Make sure this matches a form configured in your Netlify site.',
    },
  ],
  buildFormAction(config) {
    const name = (config.formName || 'contact').trim();
    return {
      // Netlify Forms uses the page URL itself with data-netlify="true".
      // We emit hidden fields they require for static-build detection.
      action: '/',
      method: 'POST',
      hiddenFields: [
        { name: 'form-name', value: name },
        { name: 'bot-field', value: '' },
      ],
    };
  },
};

export const getformProvider: FormProvider = {
  id: 'getform',
  name: 'Getform',
  docsUrl: 'https://docs.getform.io/',
  fields: [
    {
      key: 'endpointId',
      label: 'Endpoint ID',
      type: 'string',
      placeholder: 'aWxqcDFp',
      required: true,
    },
  ],
  buildFormAction(config) {
    const id = (config.endpointId || '').trim();
    return {
      action: id ? `https://getform.io/f/${encodeURIComponent(id)}` : '#',
      method: 'POST',
      hiddenFields: [{ name: '_gotcha', value: '' }],
    };
  },
};

export const customWebhookFormProvider: FormProvider = {
  id: 'custom',
  name: 'Custom endpoint',
  docsUrl: '',
  fields: [
    {
      key: 'endpoint',
      label: 'POST endpoint',
      type: 'url',
      placeholder: 'https://api.yoursite.com/forms',
      required: true,
    },
  ],
  buildFormAction(config) {
    return {
      action: (config.endpoint || '#').trim(),
      method: 'POST',
      hiddenFields: [{ name: '_gotcha', value: '' }],
    };
  },
};

export const formProviders: ReadonlyArray<FormProvider> = [
  formspreeProvider,
  web3FormsProvider,
  netlifyFormsProvider,
  getformProvider,
  customWebhookFormProvider,
];

export function findFormProvider(id: string): FormProvider | undefined {
  return formProviders.find((p) => p.id === id);
}
