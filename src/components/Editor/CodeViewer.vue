<template>
  <Teleport to="body">
    <div class="code-viewer-overlay">
      <div class="code-viewer">
        <div class="viewer-header">
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="['tab', { active: activeTab === tab.value }]"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="actions">
            <button @click="copyCode" class="action-btn">
              <Copy :size="16" />
              <span>Copy</span>
            </button>
            <button @click="downloadCode" class="action-btn">
              <Download :size="16" />
              <span>Download</span>
            </button>
            <button @click="close" class="close-btn">
              <X :size="20" />
            </button>
          </div>
        </div>
        
        <div class="viewer-body">
          <div ref="editorContainer" class="code-editor"></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Copy, Download, X } from 'lucide-vue-next';
import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { useEditorStore } from '@/stores/editor';
import { codeGenerator } from '@/services/codeGenerator';
import { useToast } from '@/composables/useToast';

const store = useEditorStore();
const { showToast } = useToast();

const editorContainer = ref<HTMLElement>();
const activeTab = ref<'html' | 'css' | 'full'>('html');
const editor = ref<EditorView | null>(null);
const generatedCode = ref({ html: '', css: '', fullPage: '' });

const tabs = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'full', label: 'Full Page' }
];

async function generateCode() {
  generatedCode.value = await codeGenerator.generateProject(store.components, store.projectName);
}

async function updateEditorContent() {
  if (!editor.value) return;
  
  await generateCode();
  let content = '';
  
  switch (activeTab.value) {
    case 'html':
      content = generatedCode.value.html;
      break;
    case 'css':
      content = generatedCode.value.css;
      break;
    case 'full':
      content = generatedCode.value.fullPage;
      break;
  }
  
  editor.value.dispatch({
    changes: {
      from: 0,
      to: editor.value.state.doc.length,
      insert: content
    }
  });
}

async function copyCode() {
  await generateCode();
  const content = activeTab.value === 'html' ? generatedCode.value.html :
                  activeTab.value === 'css' ? generatedCode.value.css :
                  generatedCode.value.fullPage;
  
  await navigator.clipboard.writeText(content);
  showToast('Code copied to clipboard', 'success');
}

async function downloadCode() {
  await generateCode();
  const content = activeTab.value === 'html' ? generatedCode.value.html :
                  activeTab.value === 'css' ? generatedCode.value.css :
                  generatedCode.value.fullPage;
  
  const extension = activeTab.value === 'css' ? 'css' : 'html';
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${store.projectName.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
  a.click();
  URL.revokeObjectURL(url);
}

function close() {
  store.showCode = false;
}

watch(activeTab, () => {
  updateEditorContent();
});

watch(() => store.components, () => {
  updateEditorContent();
}, { deep: true });

onMounted(async () => {
  if (!editorContainer.value) return;
  
  await generateCode();
  
  editor.value = new EditorView({
    doc: generatedCode.value.html,
    extensions: [
      basicSetup,
      activeTab.value === 'css' ? css() : html(),
      oneDark,
      EditorView.editable.of(false)
    ],
    parent: editorContainer.value
  });
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
.code-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
}

.code-viewer {
  position: absolute;
  top: 40px;
  left: 40px;
  right: 40px;
  bottom: 40px;
  background: #1F2937;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #111827;
  border-bottom: 1px solid #374151;
}

.tabs {
  display: flex;
  gap: 8px;
}

.tab {
  padding: 6px 14px;
  background: transparent;
  color: #9CA3AF;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  background: #1F2937;
  color: white;
}

.tab.active {
  background: #374151;
  color: white;
  border-color: #4B5563;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #374151;
  color: white;
  border: 1px solid #4B5563;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #4B5563;
}

.close-btn {
  padding: 6px;
  background: transparent;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: white;
}

.viewer-body {
  flex: 1;
  overflow: hidden;
}

.code-editor {
  height: 100%;
}

.code-editor :deep(.cm-editor) {
  height: 100%;
}
</style>