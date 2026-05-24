import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { telemetry } from '@/lib/telemetry';

import 'uno.css';
import '@unocss/reset/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

app.config.errorHandler = (err, instance, info) => {
  telemetry.captureException(err, {
    scope: 'vue.errorHandler',
    tags: { hook: info },
    extra: { componentName: instance?.$options?.name },
  });
};

app.config.warnHandler = (msg, _instance, trace) => {
  if (import.meta.env.DEV) {
    console.warn(msg, trace);
  }
};

window.addEventListener('error', (event) => {
  telemetry.captureException(event.error ?? event.message, {
    scope: 'window.error',
    extra: { filename: event.filename, lineno: event.lineno, colno: event.colno },
  });
});

window.addEventListener('unhandledrejection', (event) => {
  telemetry.captureException(event.reason, { scope: 'window.unhandledrejection' });
});

app.use(pinia);
app.mount('#app');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      telemetry.captureException(err, { scope: 'serviceWorker.register' });
    });
  });
}
