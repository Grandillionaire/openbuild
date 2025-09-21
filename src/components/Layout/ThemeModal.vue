<template>
  <div class="theme-modal" v-if="isOpen" @click.self="close">
    <div class="theme-modal-content">
      <div class="modal-header">
        <h2>Design Theme & Presets</h2>
        <button class="close-btn" @click="close">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <ThemeSelector />
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="close">Close</button>
        <button class="btn-primary" @click="applyAndClose">
          Apply Theme
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import ThemeSelector from '../Editor/ThemeSelector.vue';
import { useThemeStore } from '@/stores/theme';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const themeStore = useThemeStore();

function close() {
  emit('close');
}

function applyAndClose() {
  // Theme is already applied in real-time by ThemeSelector
  themeStore.applyThemeToDocument();
  close();
}
</script>

<style scoped>
.theme-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.theme-modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Mobile styles */
@media (max-width: 768px) {
  .theme-modal {
    align-items: flex-end;
  }
  
  .theme-modal-content {
    width: 100%;
    max-height: 85vh;
    border-radius: 16px 16px 0 0;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-primary);
}
</style>