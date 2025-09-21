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
          <div class="export-options">
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
          </div>
          
          <div class="preview-section">
            <h3>Files to Export</h3>
            <div class="file-list">
              <div class="file-item">
                <FileText :size="16" />
                <span>index.html</span>
              </div>
              <div class="file-item">
                <FileText :size="16" />
                <span>styles.css</span>
              </div>
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
            <span>{{ isExporting ? 'Exporting...' : 'Export ZIP' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, FileText, Download, Loader } from 'lucide-vue-next';
import { useEditorStore } from '@/stores/editor';
import { exportManager } from '@/services/exportManager';
import { useToast } from '@/composables/useToast';

const emit = defineEmits<{
  close: []
}>();

const store = useEditorStore();
const { showToast } = useToast();

const includeConfig = ref(true);
const minifyCode = ref(false);
const platform = ref('static');
const isExporting = ref(false);

async function handleExport() {
  isExporting.value = true;
  
  try {
    await exportManager.exportProject(
      store.components,
      store.projectName,
      {
        includeConfig: includeConfig.value,
        platform: platform.value as any
      }
    );
    
    showToast('Project exported successfully!', 'success');
    emit('close');
  } catch (error) {
    showToast('Failed to export project', 'error');
  } finally {
    isExporting.value = false;
  }
}
</script>

<style scoped>
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
</style>