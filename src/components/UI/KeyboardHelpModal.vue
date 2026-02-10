<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Keyboard Shortcuts</h2>
            <button class="close-btn" @click="close" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="shortcuts-grid">
            <div v-for="category in shortcutCategories" :key="category.name" class="shortcut-category">
              <h3>{{ category.name }}</h3>
              <div class="shortcut-list">
                <div v-for="shortcut in category.shortcuts" :key="shortcut.keys" class="shortcut-item">
                  <span class="shortcut-description">{{ shortcut.description }}</span>
                  <span class="shortcut-keys">
                    <kbd v-for="(key, i) in shortcut.keys.split('+')" :key="i">
                      {{ formatKey(key) }}
                    </kbd>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <span class="hint">Press <kbd>?</kbd> to toggle this panel</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const isMac = computed(() => navigator.platform.toUpperCase().indexOf('MAC') >= 0);

const shortcutCategories = [
  {
    name: 'General',
    shortcuts: [
      { keys: 'cmd+s', description: 'Save project' },
      { keys: 'cmd+k', description: 'Command palette' },
      { keys: '?', description: 'Show keyboard shortcuts' },
      { keys: 'escape', description: 'Clear selection / Close modal' },
    ]
  },
  {
    name: 'Editing',
    shortcuts: [
      { keys: 'cmd+z', description: 'Undo' },
      { keys: 'cmd+shift+z', description: 'Redo' },
      { keys: 'cmd+y', description: 'Redo (alternative)' },
      { keys: 'cmd+d', description: 'Duplicate component' },
      { keys: 'delete', description: 'Delete component' },
      { keys: 'backspace', description: 'Delete component' },
    ]
  },
  {
    name: 'Selection',
    shortcuts: [
      { keys: 'cmd+a', description: 'Select all components' },
      { keys: 'click', description: 'Select component' },
      { keys: 'shift+click', description: 'Multi-select' },
    ]
  },
  {
    name: 'Style Transfer',
    shortcuts: [
      { keys: 'cmd+shift+c', description: 'Copy component styles' },
      { keys: 'cmd+shift+v', description: 'Paste styles to selected' },
    ]
  }
];

function formatKey(key: string): string {
  const keyMap: Record<string, string> = {
    'cmd': isMac.value ? '⌘' : 'Ctrl',
    'ctrl': isMac.value ? '⌃' : 'Ctrl',
    'shift': isMac.value ? '⇧' : 'Shift',
    'alt': isMac.value ? '⌥' : 'Alt',
    'delete': 'Del',
    'backspace': '⌫',
    'escape': 'Esc',
    'click': 'Click',
  };
  return keyMap[key.toLowerCase()] || key.toUpperCase();
}

function close() {
  emit('close');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 640px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.shortcuts-grid {
  padding: 24px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.shortcut-category h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 12px;
}

.shortcut-description {
  font-size: 14px;
  color: #374151;
}

.shortcut-keys {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.shortcut-keys kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.modal-footer .hint {
  font-size: 13px;
  color: #6b7280;
}

.modal-footer kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  margin: 0 2px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
