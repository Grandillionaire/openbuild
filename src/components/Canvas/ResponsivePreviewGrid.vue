<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="responsive-grid-overlay" @click="close">
        <div class="responsive-grid-modal" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div class="header-left">
              <Grid3x3 :size="20" />
              <h3>Responsive Preview Grid</h3>
            </div>
            <button @click="close" class="close-btn">
              <X :size="20" />
            </button>
          </div>

          <!-- Controls -->
          <div class="controls-bar">
            <div class="control-group">
              <label>View Mode</label>
              <div class="view-mode-toggle">
                <button
                  v-for="mode in viewModes"
                  :key="mode.value"
                  :class="['mode-btn', { active: viewMode === mode.value }]"
                  @click="viewMode = mode.value"
                >
                  <component :is="mode.icon" :size="16" />
                  <span>{{ mode.label }}</span>
                </button>
              </div>
            </div>

            <div class="control-group">
              <label>
                <input v-model="syncScroll" type="checkbox" />
                Sync Scroll
              </label>
            </div>
          </div>

          <!-- Preview Grid -->
          <div :class="['preview-grid', `layout-${viewMode}`]">
            <!-- Desktop Preview -->
            <div class="preview-item desktop">
              <div class="preview-header">
                <Monitor :size="14" />
                <span>Desktop</span>
                <span class="preview-dimensions">1920x1080</span>
              </div>
              <div
                class="preview-iframe-wrapper"
                :style="{ height: iframeHeight }"
                @scroll="handleScroll($event, 'desktop')"
                ref="desktopRef"
              >
                <iframe
                  :srcdoc="generatedHTML"
                  class="preview-iframe"
                  sandbox="allow-scripts allow-same-origin"
                ></iframe>
              </div>
            </div>

            <!-- Tablet Preview -->
            <div v-if="viewMode !== 'desktop-only'" class="preview-item tablet">
              <div class="preview-header">
                <Tablet :size="14" />
                <span>Tablet</span>
                <span class="preview-dimensions">768x1024</span>
              </div>
              <div
                class="preview-iframe-wrapper"
                :style="{ height: iframeHeight }"
                @scroll="handleScroll($event, 'tablet')"
                ref="tabletRef"
              >
                <div class="device-frame tablet-frame">
                  <iframe
                    :srcdoc="generatedHTML"
                    class="preview-iframe"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
              </div>
            </div>

            <!-- Mobile Preview -->
            <div v-if="viewMode !== 'desktop-only'" class="preview-item mobile">
              <div class="preview-header">
                <Smartphone :size="14" />
                <span>Mobile</span>
                <span class="preview-dimensions">375x667</span>
              </div>
              <div
                class="preview-iframe-wrapper"
                :style="{ height: iframeHeight }"
                @scroll="handleScroll($event, 'mobile')"
                ref="mobileRef"
              >
                <div class="device-frame mobile-frame">
                  <iframe
                    :srcdoc="generatedHTML"
                    class="preview-iframe"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button @click="refreshPreviews" class="btn-secondary">
              <RefreshCw :size="14" />
              Refresh
            </button>
            <button @click="openInNewTab" class="btn-secondary">
              <ExternalLink :size="14" />
              Open in New Tab
            </button>
            <button @click="close" class="btn-primary">Done</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Grid3x3,
  RefreshCw,
  ExternalLink,
  Grid2x2,
  Rows
} from 'lucide-vue-next';

const isOpen = ref(false);
const viewMode = ref<'all' | 'desktop-tablet' | 'desktop-only'>('all');
const syncScroll = ref(true);
const iframeHeight = ref('600px');
const desktopRef = ref<HTMLElement>();
const tabletRef = ref<HTMLElement>();
const mobileRef = ref<HTMLElement>();
const isScrolling = ref(false);

const viewModes: Array<{ value: 'all' | 'desktop-tablet' | 'desktop-only'; label: string; icon: any }> = [
  { value: 'all', label: 'All Devices', icon: Grid2x2 },
  { value: 'desktop-tablet', label: 'Desktop + Tablet', icon: Rows },
  { value: 'desktop-only', label: 'Desktop Only', icon: Monitor }
];

// Generate HTML for preview
const generatedHTML = computed(() => {
  // This would integrate with your code generator
  // For now, returning a basic template
  // const components = store.components; // Will be used in future integration

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #1F2937;
    }
    /* Add generated component styles here */
  </style>
</head>
<body>
  <!-- Generated component HTML would go here -->
  <div style="padding: 40px;">
    <h1>Responsive Preview</h1>
    <p>Your components will render here with full responsive behavior.</p>
  </div>
</body>
</html>
  `;
});

function open() {
  isOpen.value = true;
  nextTick(() => {
    refreshPreviews();
  });
}

function close() {
  isOpen.value = false;
}

function refreshPreviews() {
  // Force iframe reload
  const iframes = document.querySelectorAll('.preview-iframe');
  iframes.forEach((iframe: any) => {
    iframe.srcdoc = generatedHTML.value;
  });
}

function handleScroll(event: Event, source: string) {
  if (!syncScroll.value || isScrolling.value) return;

  isScrolling.value = true;
  const target = event.target as HTMLElement;
  const scrollPercentage = target.scrollTop / (target.scrollHeight - target.clientHeight);

  // Sync scroll to other previews
  if (source !== 'desktop' && desktopRef.value) {
    const maxScroll = desktopRef.value.scrollHeight - desktopRef.value.clientHeight;
    desktopRef.value.scrollTop = maxScroll * scrollPercentage;
  }

  if (source !== 'tablet' && tabletRef.value) {
    const maxScroll = tabletRef.value.scrollHeight - tabletRef.value.clientHeight;
    tabletRef.value.scrollTop = maxScroll * scrollPercentage;
  }

  if (source !== 'mobile' && mobileRef.value) {
    const maxScroll = mobileRef.value.scrollHeight - mobileRef.value.clientHeight;
    mobileRef.value.scrollTop = maxScroll * scrollPercentage;
  }

  setTimeout(() => {
    isScrolling.value = false;
  }, 100);
}

function openInNewTab() {
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(generatedHTML.value);
    win.document.close();
  }
}

defineExpose({
  open,
  close
});
</script>

<style scoped>
.responsive-grid-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.responsive-grid-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1800px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-group label {
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.control-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.view-mode-toggle {
  display: flex;
  gap: 6px;
  background: white;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #6B7280;
  transition: all 0.2s;
}

.mode-btn:hover {
  background: #F3F4F6;
}

.mode-btn.active {
  background: #6366F1;
  color: white;
}

.preview-grid {
  flex: 1;
  display: grid;
  gap: 16px;
  padding: 20px;
  overflow: auto;
  background: #F9FAFB;
}

.preview-grid.layout-all {
  grid-template-columns: 2fr 1fr 1fr;
}

.preview-grid.layout-desktop-tablet {
  grid-template-columns: 2fr 1fr;
}

.preview-grid.layout-desktop-only {
  grid-template-columns: 1fr;
}

.preview-item {
  background: white;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
}

.preview-dimensions {
  margin-left: auto;
  font-size: 11px;
  color: #9CA3AF;
  font-family: monospace;
}

.preview-iframe-wrapper {
  flex: 1;
  overflow: auto;
  position: relative;
  background: white;
}

.device-frame {
  margin: 20px auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #E5E7EB;
  overflow: hidden;
}

.tablet-frame {
  width: 768px;
}

.mobile-frame {
  width: 375px;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: white;
}

.device-frame .preview-iframe {
  min-height: 1024px;
}

.mobile-frame .preview-iframe {
  min-height: 667px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.btn-secondary,
.btn-primary {
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

.btn-secondary {
  background: white;
  border: 1px solid #D1D5DB;
  color: #6B7280;
}

.btn-secondary:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}

.btn-primary {
  background: #6366F1;
  border: 1px solid #6366F1;
  color: white;
}

.btn-primary:hover {
  background: #4F46E5;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .responsive-grid-modal,
.modal-fade-leave-active .responsive-grid-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .responsive-grid-modal,
.modal-fade-leave-to .responsive-grid-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 1400px) {
  .preview-grid.layout-all {
    grid-template-columns: 1fr;
  }

  .preview-grid.layout-desktop-tablet {
    grid-template-columns: 1fr;
  }
}
</style>
