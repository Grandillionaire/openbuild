<template>
  <div class="global-code-modal" v-if="isOpen" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Global Custom Code</h2>
        <button @click="close" class="close-btn">
          <X :size="20" />
        </button>
      </div>

      <div class="code-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
        </button>
      </div>

      <div class="code-content">
        <!-- CSS Tab -->
        <div v-if="activeTab === 'css'" class="tab-content">
          <div class="editor-info">
            <Info :size="14" />
            <span>Global CSS applied to all pages</span>
          </div>
          <div class="editor-container">
            <codemirror
              v-model="globalCode.css"
              :extensions="cssExtensions"
              :style="{ height: '400px' }"
              @change="updateGlobalCode"
            />
          </div>
        </div>

        <!-- JavaScript Tab -->
        <div v-if="activeTab === 'javascript'" class="tab-content">
          <div class="editor-info">
            <Info :size="14" />
            <span>JavaScript runs when the page loads</span>
          </div>
          <div class="editor-container">
            <codemirror
              v-model="globalCode.javascript"
              :extensions="jsExtensions"
              :style="{ height: '400px' }"
              @change="updateGlobalCode"
            />
          </div>
        </div>

        <!-- Head HTML Tab -->
        <div v-if="activeTab === 'head'" class="tab-content">
          <div class="editor-info">
            <Info :size="14" />
            <span>HTML added to the &lt;head&gt; section (meta tags, external scripts, etc.)</span>
          </div>
          <div class="editor-container">
            <codemirror
              v-model="globalCode.headHTML"
              :extensions="htmlExtensions"
              :style="{ height: '400px' }"
              @change="updateGlobalCode"
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="close" class="secondary-btn">Close</button>
        <button @click="saveAndClose" class="primary-btn">Save & Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { useEditorStore } from '@/stores/editor';
import {
  X,
  Code,
  Palette,
  FileCode,
  Info
} from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const store = useEditorStore();
const activeTab = ref('css');

// Local copy of global code
const globalCode = ref({
  css: '',
  javascript: '',
  headHTML: ''
});

// Tab configuration
const tabs = [
  { key: 'css', label: 'Global CSS', icon: Palette },
  { key: 'javascript', label: 'JavaScript', icon: Code },
  { key: 'head', label: 'Head HTML', icon: FileCode }
];

// CodeMirror extensions
const baseTheme = EditorView.theme({
  '&': { fontSize: '13px' },
  '.cm-content': { padding: '16px' }
});

const cssExtensions = [css(), oneDark, baseTheme];
const jsExtensions = [javascript(), oneDark, baseTheme];
const htmlExtensions = [html(), oneDark, baseTheme];

// Load global code when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    globalCode.value = { ...store.globalCustomCode };
  }
});

function updateGlobalCode() {
  // Update is handled on save
}

function close() {
  emit('close');
}

function saveAndClose() {
  store.globalCustomCode = { ...globalCode.value };
  emit('close');
}
</script>

<style scoped>
.global-code-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 6px;
}

.close-btn:hover {
  background: var(--hover-bg);
}

.code-tabs {
  display: flex;
  gap: 8px;
  padding: 0 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  transition: all 0.2s;
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-btn:hover:not(.active) {
  color: var(--text-primary);
}

.code-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.editor-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--info-bg, #EBF5FF);
  border-radius: 6px;
  font-size: 13px;
  color: var(--info-text, #1E40AF);
}

.editor-container {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary-btn,
.primary-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.secondary-btn:hover {
  background: var(--hover-bg);
}

.primary-btn {
  background: var(--primary);
  border: none;
  color: white;
}

.primary-btn:hover {
  background: var(--primary-dark);
}

/* CodeMirror overrides */
:deep(.cm-editor) {
  height: 100%;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

:deep(.cm-focused) {
  outline: none;
}

:deep(.cm-scroller) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>