import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Import UnoCSS
import 'uno.css';
import '@unocss/reset/tailwind.css';

// Create Vue app
const app = createApp(App);
const pinia = createPinia();

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  if (import.meta.env.PROD) {
    // Production error tracking
  }
};

// Use plugins
app.use(pinia);

// Mount app
app.mount('#app');

// Register service worker for PWA (optional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}