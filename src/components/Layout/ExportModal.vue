<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click="$emit('close')">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Export Project</h2>
          <button @click="$emit('close')" class="close-btn">
            <X :size="20" />
          </button>
        </div>
        
        <div class="modal-body">
          <!-- One-click primary CTA. Smart defaults: clean HTML, all your
               pages, theme tokens included, with package.json + README so
               the export is publishable to anywhere (Vercel / Netlify /
               GitHub Pages / S3 / `npx serve`). 90% of users want this. -->
          <button class="btn-publish" @click="publishOneClick" :disabled="isExporting">
            <Download v-if="!isExporting" :size="22" />
            <Loader v-else :size="22" class="loading-spinner" />
            <div class="btn-publish-text">
              <span class="btn-publish-title">{{ isExporting ? 'Packaging your site…' : 'Download my site (.zip)' }}</span>
              <span class="btn-publish-sub">Ready to host anywhere — Vercel, Netlify, GitHub Pages, S3</span>
            </div>
          </button>

          <p class="publish-hint">
            Drag the ZIP onto
            <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer">Netlify Drop</a>
            for a free public URL in 30 seconds — no signup needed for testing.
          </p>

          <details class="advanced">
            <summary>Advanced export options</summary>

            <div class="export-options">
              <div class="option framework-option">
                <label>Export Format</label>
                <div class="framework-buttons">
                  <button
                    v-for="fw in frameworks"
                    :key="fw.value"
                    :class="['framework-btn', { active: framework === fw.value }]"
                    @click="framework = fw.value"
                  >
                    <component :is="fw.icon" :size="18" />
                    <span>{{ fw.label }}</span>
                  </button>
                </div>
                <small v-if="framework === 'react'">Generates React JSX components with proper imports</small>
                <small v-else-if="framework === 'vue'">Generates Vue SFC components with Composition API</small>
                <small v-else>Standard HTML/CSS export — works on any static host</small>
              </div>

              <label class="option">
                <input v-model="includeConfig" type="checkbox" />
                <span>Include configuration files</span>
                <small>Adds package.json, README, and .gitignore</small>
              </label>

              <label class="option">
                <input v-model="minifyCode" type="checkbox" />
                <span>Minify code</span>
                <small>Reduces file size for production</small>
              </label>

              <div class="option">
                <label>Platform Configuration</label>
                <select v-model="platform">
                  <option value="static">Static HTML</option>
                  <option value="vercel">Vercel</option>
                  <option value="netlify">Netlify</option>
                </select>
              </div>

              <div class="option">
                <label>Site URL</label>
                <input v-model="siteUrl" type="url" placeholder="https://mystore.com" />
                <small>The domain you'll publish to. Needed for sitemap.xml — without it, search engines reject the sitemap.</small>
              </div>
            </div>
          </details>
          
          <div class="preview-section">
            <h3>Files to Export</h3>
            <div class="file-list">
              <template v-if="framework === 'html'">
                <div class="file-item">
                  <FileText :size="16" />
                  <span>index.html</span>
                </div>
                <div class="file-item">
                  <FileText :size="16" />
                  <span>styles.css</span>
                </div>
              </template>
              <template v-else-if="framework === 'react'">
                <div class="file-item">
                  <Folder :size="16" />
                  <span>src/</span>
                </div>
                <div class="file-item sub">
                  <FileText :size="16" />
                  <span>App.jsx</span>
                </div>
                <div class="file-item sub">
                  <Folder :size="16" />
                  <span>components/</span>
                </div>
                <div class="file-item">
                  <FileText :size="16" />
                  <span>index.css</span>
                </div>
              </template>
              <template v-else-if="framework === 'vue'">
                <div class="file-item">
                  <Folder :size="16" />
                  <span>src/</span>
                </div>
                <div class="file-item sub">
                  <FileText :size="16" />
                  <span>App.vue</span>
                </div>
                <div class="file-item sub">
                  <Folder :size="16" />
                  <span>components/</span>
                </div>
                <div class="file-item">
                  <FileText :size="16" />
                  <span>vite.config.js</span>
                </div>
              </template>
              <div v-if="includeConfig" class="file-item">
                <FileText :size="16" />
                <span>package.json</span>
              </div>
              <div v-if="includeConfig" class="file-item">
                <FileText :size="16" />
                <span>README.md</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="$emit('close')" class="btn-cancel">Cancel</button>
          <button @click="handleExport" class="btn-export" :disabled="isExporting">
            <Download v-if="!isExporting" :size="16" />
            <Loader v-else :size="16" class="loading-spinner" />
            <span>{{ isExporting ? 'Exporting…' : 'Export with advanced options' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, FileText, Download, Loader, Folder, Code, FileCode } from 'lucide-vue-next';
import { useEditorStore } from '@/stores/editor';
import { exportManager } from '@/services/exportManager';
import { frameworkExporter, type ExportFramework } from '@/services/frameworkExporter';
import { useToast } from '@/composables/useToast';
import { saveAs } from 'file-saver';

// Framework icons
const HtmlIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :width="size" :height="size"><path d="m4 5 2 15 6 2 6-2 2-15z"/><path d="M8 10h8l-1 5-3 1-3-1-.5-2.5"/></svg>`,
  props: { size: { type: Number, default: 18 } }
};

const ReactIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" :width="size" :height="size"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>`,
  props: { size: { type: Number, default: 18 } }
};

const VueIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :width="size" :height="size"><path d="M2 3h4l6 10 6-10h4L12 21 2 3z"/><path d="M7 3l5 8 5-8"/></svg>`,
  props: { size: { type: Number, default: 18 } }
};

const emit = defineEmits<{
  close: []
}>();

const store = useEditorStore();
const { showToast } = useToast();

const includeConfig = ref(true);
const minifyCode = ref(false);
const platform = ref('static');
// Remembered between exports so a merchant sets their domain once.
const siteUrl = ref(localStorage.getItem('openbuild.siteUrl') || '');
const framework = ref<ExportFramework>('html');
const isExporting = ref(false);

const frameworks: ReadonlyArray<{ value: ExportFramework; label: string; icon: unknown }> = [
  { value: 'html', label: 'HTML', icon: HtmlIcon },
  { value: 'react', label: 'React', icon: ReactIcon },
  { value: 'vue', label: 'Vue', icon: VueIcon },
];

/** One-click publish: HTML export with sensible defaults. */
async function publishOneClick() {
  framework.value = 'html';
  includeConfig.value = true;
  platform.value = 'static';
  await handleExport();
}

async function handleExport() {
  isExporting.value = true;

  try {
    localStorage.setItem('openbuild.siteUrl', siteUrl.value.trim());

    if (framework.value === 'html') {
      // Use existing HTML export. Always include theme + commerce + multi-page
      // when their stores have data — first-time users shouldn't have to know
      // these are options.
      await exportManager.exportProject(
        store.components,
        store.projectName,
        {
          includeConfig: includeConfig.value,
          platform: platform.value as 'vercel' | 'netlify' | 'static',
          includeTheme: true,
          multiPage: true,
          includeCommerce: true,
          siteUrl: siteUrl.value,
        }
      );
    } else {
      // Use framework exporter for React/Vue
      const result = await frameworkExporter.export(
        store.components,
        framework.value,
        store.projectName
      );

      // Create ZIP with framework files
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const file of result.files) {
        zip.file(file.path, file.content);
      }

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const fileName = `${store.projectName.toLowerCase().replace(/\s+/g, '-')}-${framework.value}.zip`;
      saveAs(blob, fileName);
    }
    
    showToast(`Project exported as ${framework.value.toUpperCase()} successfully!`, 'success');
    emit('close');
  } catch (error) {
    console.error('Export failed:', error);
    showToast('Failed to export project', 'error');
  } finally {
    isExporting.value = false;
  }
}
</script>

<style scoped>
.btn-publish {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px 24px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  color: white;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.5);
}
.btn-publish:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px -4px rgba(99, 102, 241, 0.6);
}
.btn-publish:disabled { opacity: 0.7; cursor: wait; }
.btn-publish-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.btn-publish-title { font-weight: 700; font-size: 1.0625rem; }
.btn-publish-sub { font-size: 0.8125rem; opacity: 0.9; }
.publish-hint {
  margin: 0 0 20px;
  padding: 12px 14px;
  background: #F0F9FF;
  border: 1px solid #BAE6FD;
  border-radius: 10px;
  color: #075985;
  font-size: 0.8125rem;
  line-height: 1.5;
}
.publish-hint a { color: #0369A1; font-weight: 600; text-decoration: none; }
.publish-hint a:hover { text-decoration: underline; }
.advanced {
  margin-top: 8px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 4px 16px;
}
.advanced summary {
  cursor: pointer;
  padding: 10px 0;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
}
.advanced summary::before {
  content: '▸';
  transition: transform 0.15s;
  color: #6B7280;
}
.advanced[open] summary::before { transform: rotate(90deg); }
.advanced .export-options { padding-bottom: 16px; }


.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.close-btn {
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B7280;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1F2937;
}

.modal-body {
  padding: 24px;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option input[type="checkbox"] {
  margin-right: 8px;
}

.option small {
  color: #9CA3AF;
  font-size: 12px;
  margin-left: 24px;
}

.option select {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 4px;
}

.preview-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
  margin-bottom: 12px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 13px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel,
.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  color: #6B7280;
  border: 1px solid #D1D5DB;
}

.btn-cancel:hover {
  background: #F9FAFB;
}

.btn-export {
  background: #3B82F6;
  color: white;
  border: none;
}

.btn-export:hover:not(:disabled) {
  background: #2563EB;
}

.btn-export:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Framework Selection */
.framework-option {
  margin-bottom: 8px;
}

.framework-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.framework-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #F9FAFB;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6B7280;
}

.framework-btn:hover {
  background: #F3F4F6;
  border-color: #D1D5DB;
}

.framework-btn.active {
  background: #EEF2FF;
  border-color: #6366F1;
  color: #6366F1;
}

.framework-btn span {
  font-size: 13px;
  font-weight: 500;
}

.file-item.sub {
  padding-left: 20px;
  opacity: 0.8;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>