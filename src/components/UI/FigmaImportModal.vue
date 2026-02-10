<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click="$emit('close')">
      <div class="modal figma-modal" @click.stop>
        <div class="modal-header">
          <div class="header-title">
            <Figma :size="24" class="figma-icon" />
            <h2>Import from Figma</h2>
          </div>
          <button @click="$emit('close')" class="close-btn">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <!-- Step 1: Enter URL -->
          <div v-if="step === 'input'" class="step-content">
            <p class="description">
              Paste your Figma design URL to automatically convert frames into components.
            </p>

            <div class="input-group">
              <label>Figma URL</label>
              <div class="url-input-wrapper">
                <Link :size="18" class="input-icon" />
                <input
                  v-model="figmaUrl"
                  type="url"
                  placeholder="https://www.figma.com/file/..."
                  @keyup.enter="parseDesign"
                />
              </div>
              <span v-if="urlError" class="error-text">{{ urlError }}</span>
            </div>

            <div class="options-section">
              <h4>Import Options</h4>
              <label class="option-checkbox">
                <input type="checkbox" v-model="options.preserveLayout" />
                <span>Preserve layout structure</span>
              </label>
              <label class="option-checkbox">
                <input type="checkbox" v-model="options.extractColors" />
                <span>Extract color palette</span>
              </label>
              <label class="option-checkbox">
                <input type="checkbox" v-model="options.convertText" />
                <span>Convert text layers to components</span>
              </label>
            </div>

            <div class="info-box">
              <Info :size="16" />
              <span>
                This is a preview feature. Complex designs may require manual adjustment.
              </span>
            </div>
          </div>

          <!-- Step 2: Importing -->
          <div v-else-if="step === 'importing'" class="step-content importing-step">
            <div class="import-animation">
              <div class="import-spinner">
                <div class="spinner-ring"></div>
                <Figma :size="32" class="center-icon" />
              </div>
              <h3>Importing Design</h3>
              <p class="status-text">{{ importStatus }}</p>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${importProgress}%` }"></div>
              </div>
              <div class="import-details">
                <span v-for="detail in importDetails" :key="detail" class="detail-item">
                  <Check :size="14" />
                  {{ detail }}
                </span>
              </div>
            </div>
          </div>

          <!-- Step 3: Success -->
          <div v-else-if="step === 'success'" class="step-content success-step">
            <div class="success-icon">
              <CheckCircle :size="48" />
            </div>
            <h3>Import Complete!</h3>
            <p>Successfully imported {{ importedComponents.length }} components</p>

            <div class="imported-preview">
              <div
                v-for="comp in importedComponents"
                :key="comp.id"
                class="preview-item"
              >
                <div class="preview-thumb" :style="{ backgroundColor: comp.color }">
                  <component :is="getComponentIcon(comp.type)" :size="20" />
                </div>
                <div class="preview-info">
                  <span class="preview-name">{{ comp.name }}</span>
                  <span class="preview-type">{{ comp.type }}</span>
                </div>
              </div>
            </div>

            <div v-if="extractedColors.length" class="color-palette">
              <h4>Extracted Colors</h4>
              <div class="colors-grid">
                <div
                  v-for="color in extractedColors"
                  :key="color"
                  class="color-swatch"
                  :style="{ backgroundColor: color }"
                  :title="color"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="step === 'input'" @click="$emit('close')" class="btn-cancel">
            Cancel
          </button>
          <button
            v-if="step === 'input'"
            @click="parseDesign"
            class="btn-primary"
            :disabled="!figmaUrl.trim()"
          >
            <Download :size="16" />
            Import Design
          </button>

          <button v-if="step === 'success'" @click="addToCanvas" class="btn-primary">
            <Plus :size="16" />
            Add to Canvas
          </button>
          <button v-if="step === 'success'" @click="$emit('close')" class="btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  X,
  Link,
  Info,
  Download,
  Check,
  CheckCircle,
  Plus,
  Layout,
  Type,
  Image,
  Square
} from 'lucide-vue-next';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';

// Figma icon component (not in lucide)
const Figma = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :width="size" :height="size"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>`,
  props: { size: { type: Number, default: 24 } }
};

const emit = defineEmits<{
  close: [];
  imported: [components: any[]];
}>();

const store = useEditorStore();
const { showToast } = useToast();

const figmaUrl = ref('');
const urlError = ref('');
const step = ref<'input' | 'importing' | 'success'>('input');
const importProgress = ref(0);
const importStatus = ref('Connecting to Figma...');
const importDetails = ref<string[]>([]);
const importedComponents = ref<any[]>([]);
const extractedColors = ref<string[]>([]);

const options = ref({
  preserveLayout: true,
  extractColors: true,
  convertText: true
});

// Mock component data for demonstration
const mockComponents = [
  { id: '1', name: 'Hero Section', type: 'section', color: '#6366F1' },
  { id: '2', name: 'Navigation Bar', type: 'navigation', color: '#10B981' },
  { id: '3', name: 'Feature Card', type: 'container', color: '#F59E0B' },
  { id: '4', name: 'Call to Action', type: 'button', color: '#EC4899' },
  { id: '5', name: 'Footer', type: 'footer', color: '#8B5CF6' }
];

const mockColors = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#1F2937', '#FFFFFF'];

function validateUrl(url: string): boolean {
  const figmaPattern = /^https:\/\/(www\.)?figma\.com\/(file|design)\/[a-zA-Z0-9]+/;
  return figmaPattern.test(url);
}

async function parseDesign() {
  urlError.value = '';

  if (!figmaUrl.value.trim()) {
    urlError.value = 'Please enter a Figma URL';
    return;
  }

  if (!validateUrl(figmaUrl.value)) {
    urlError.value = 'Invalid Figma URL format';
    return;
  }

  step.value = 'importing';
  importProgress.value = 0;
  importDetails.value = [];

  // Simulate import process with realistic steps
  const steps = [
    { progress: 15, status: 'Connecting to Figma...', detail: 'Connected to Figma API' },
    { progress: 30, status: 'Fetching file data...', detail: 'File data retrieved' },
    { progress: 50, status: 'Parsing design layers...', detail: 'Found 12 frames' },
    { progress: 70, status: 'Converting to components...', detail: 'Converted 5 components' },
    { progress: 85, status: 'Extracting styles...', detail: 'Extracted typography & colors' },
    { progress: 100, status: 'Finalizing import...', detail: 'Import complete' }
  ];

  for (const s of steps) {
    await delay(600 + Math.random() * 400);
    importProgress.value = s.progress;
    importStatus.value = s.status;
    importDetails.value.push(s.detail);
  }

  await delay(300);

  // Set mock results
  importedComponents.value = mockComponents;
  if (options.value.extractColors) {
    extractedColors.value = mockColors;
  }

  step.value = 'success';
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getComponentIcon(type: string) {
  const icons: Record<string, any> = {
    section: Layout,
    navigation: Layout,
    container: Square,
    button: Square,
    footer: Layout,
    text: Type,
    image: Image
  };
  return icons[type] || Square;
}

function addToCanvas() {
  // Generate actual components from mock data
  const componentsToAdd = importedComponents.value.map(mock => ({
    type: mock.type === 'navigation' ? 'navigation' : 
          mock.type === 'footer' ? 'footer' :
          mock.type === 'button' ? 'button' : 'container',
    displayName: mock.name,
    props: {
      content: mock.name,
      attributes: {}
    },
    styles: {
      base: {
        padding: '24px',
        backgroundColor: mock.color + '10',
        borderRadius: '8px',
        marginBottom: '16px'
      }
    },
    children: []
  }));

  componentsToAdd.forEach(comp => {
    store.addComponentDirect(comp as any);
  });

  showToast(`Added ${importedComponents.value.length} components to canvas`, 'success');
  emit('imported', componentsToAdd);
  emit('close');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.figma-modal {
  width: 90%;
  max-width: 520px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.figma-icon {
  color: #A259FF;
}

.close-btn {
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.modal-body {
  padding: 24px;
}

.description {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.url-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #9CA3AF;
}

.url-input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.url-input-wrapper input:focus {
  outline: none;
  border-color: #A259FF;
  box-shadow: 0 0 0 3px rgba(162, 89, 255, 0.1);
}

.error-text {
  display: block;
  color: #EF4444;
  font-size: 12px;
  margin-top: 4px;
}

.options-section {
  margin-bottom: 20px;
}

.options-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.option-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  font-size: 14px;
  color: #4B5563;
}

.option-checkbox input {
  width: 16px;
  height: 16px;
  accent-color: #A259FF;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #F3F4F6;
  border-radius: 8px;
  font-size: 13px;
  color: #6B7280;
}

.info-box svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* Importing Step */
.importing-step {
  text-align: center;
  padding: 20px 0;
}

.import-animation h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 20px 0 8px;
}

.import-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid #E5E7EB;
  border-top-color: #A259FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #A259FF;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-text {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #A259FF, #6366F1);
  transition: width 0.3s ease;
}

.import-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #10B981;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Success Step */
.success-step {
  text-align: center;
}

.success-icon {
  color: #10B981;
  margin-bottom: 12px;
}

.success-step h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.success-step > p {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 20px;
}

.imported-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #F9FAFB;
  border-radius: 8px;
}

.preview-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.preview-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.preview-name {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
}

.preview-type {
  font-size: 12px;
  color: #6B7280;
  text-transform: capitalize;
}

.color-palette {
  text-align: left;
}

.color-palette h4 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.colors-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.btn-cancel,
.btn-secondary,
.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel,
.btn-secondary {
  background: white;
  color: #6B7280;
  border: 1px solid #D1D5DB;
}

.btn-cancel:hover,
.btn-secondary:hover {
  background: #F3F4F6;
}

.btn-primary {
  background: linear-gradient(135deg, #A259FF 0%, #6366F1 100%);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(162, 89, 255, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
