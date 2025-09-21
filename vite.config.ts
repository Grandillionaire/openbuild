import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'vue',
            'pinia',
            '@vueuse/core'
          ],
          'editor': [
            'codemirror',
            '@codemirror/lang-html',
            '@codemirror/lang-css',
            '@codemirror/lang-javascript',
            '@codemirror/theme-one-dark',
            '@codemirror/view',
            'vue-codemirror'
          ],
          'export': [
            'jszip',
            'file-saver',
            'prettier',
            'handlebars'
          ],
          'ui': [
            'lucide-vue-next',
            '@formkit/drag-and-drop',
            'vanilla-colorful'
          ]
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});