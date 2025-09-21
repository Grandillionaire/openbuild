import { onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '@/stores/editor';

export function useKeyboardShortcuts() {
  const store = useEditorStore();
  
  const shortcuts: Record<string, (e?: KeyboardEvent) => void> = {
    'ctrl+z': () => store.undo(),
    'cmd+z': () => store.undo(),
    'ctrl+shift+z': () => store.redo(),
    'cmd+shift+z': () => store.redo(),
    'ctrl+y': () => store.redo(),
    'cmd+y': () => store.redo(),
    'delete': () => {
      if (store.selectedId) {
        store.deleteComponent(store.selectedId);
      }
    },
    'backspace': () => {
      if (store.selectedId && !isInputFocused()) {
        store.deleteComponent(store.selectedId);
      }
    },
    'ctrl+d': () => {
      if (store.selectedId) {
        store.duplicateComponent(store.selectedId);
      }
    },
    'cmd+d': () => {
      if (store.selectedId) {
        store.duplicateComponent(store.selectedId);
      }
    },
    'ctrl+s': (e: KeyboardEvent) => {
      e.preventDefault();
      saveProject();
    },
    'cmd+s': (e: KeyboardEvent) => {
      e.preventDefault();
      saveProject();
    },
    'escape': () => {
      store.selectedId = null;
    }
  };
  
  function handleKeydown(event: KeyboardEvent) {
    const key = getKeyCombo(event);
    const handler = shortcuts[key];
    
    if (handler) {
      handler(event);
    }
  }
  
  function getKeyCombo(event: KeyboardEvent): string {
    const parts = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.metaKey) parts.push('cmd');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    
    const key = event.key.toLowerCase();
    if (!['control', 'meta', 'shift', 'alt'].includes(key)) {
      parts.push(key);
    }
    
    return parts.join('+');
  }
  
  function isInputFocused(): boolean {
    const activeEl = document.activeElement;
    return activeEl instanceof HTMLInputElement || 
           activeEl instanceof HTMLTextAreaElement;
  }
  
  async function saveProject() {
    const { storageService } = await import('@/services/storageService');
    const { useToast } = await import('./useToast');
    const { showToast } = useToast();
    
    try {
      await storageService.saveProject({
        id: store.projectId,
        name: store.projectName,
        components: store.components,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      showToast('Project saved', 'success');
    } catch (error) {
      showToast('Failed to save project', 'error');
    }
  }
  
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
  
  return {
    shortcuts
  };
}