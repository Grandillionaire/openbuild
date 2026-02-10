import { onMounted, onUnmounted, ref } from 'vue';
import { useEditorStore } from '@/stores/editor';

// Global state for keyboard help modal
export const showKeyboardHelp = ref(false);

export function useKeyboardShortcuts() {
  const store = useEditorStore();

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    // Undo/Redo
    'ctrl+z': (_e: KeyboardEvent) => store.undo(),
    'cmd+z': (_e: KeyboardEvent) => store.undo(),
    'ctrl+shift+z': (_e: KeyboardEvent) => store.redo(),
    'cmd+shift+z': (_e: KeyboardEvent) => store.redo(),
    'ctrl+y': (_e: KeyboardEvent) => store.redo(),
    'cmd+y': (_e: KeyboardEvent) => store.redo(),

    // Delete
    'delete': (_e: KeyboardEvent) => {
      if (store.selectedIds.size > 0) {
        store.deleteMultipleComponents(Array.from(store.selectedIds));
      } else if (store.selectedId) {
        store.deleteComponent(store.selectedId);
      }
    },
    'backspace': (_e: KeyboardEvent) => {
      if (!isInputFocused()) {
        if (store.selectedIds.size > 0) {
          store.deleteMultipleComponents(Array.from(store.selectedIds));
        } else if (store.selectedId) {
          store.deleteComponent(store.selectedId);
        }
      }
    },

    // Duplicate
    'ctrl+d': (e: KeyboardEvent) => {
      e?.preventDefault();
      if (store.selectedId) {
        store.duplicateComponent(store.selectedId);
      }
    },
    'cmd+d': (e: KeyboardEvent) => {
      e?.preventDefault();
      if (store.selectedId) {
        store.duplicateComponent(store.selectedId);
      }
    },

    // Style Copy/Paste
    'ctrl+shift+c': (e: KeyboardEvent) => {
      e?.preventDefault();
      if (store.selectedId) {
        store.copyComponentStyles(store.selectedId);
        showToastNotification('Styles copied', 'success');
      }
    },
    'cmd+shift+c': (e: KeyboardEvent) => {
      e?.preventDefault();
      if (store.selectedId) {
        store.copyComponentStyles(store.selectedId);
        showToastNotification('Styles copied', 'success');
      }
    },
    'ctrl+shift+v': (e: KeyboardEvent) => {
      e?.preventDefault();
      if (store.selectedIds.size > 0) {
        store.pasteStylesToSelected();
        showToastNotification('Styles pasted', 'success');
      } else if (store.selectedId) {
        store.pasteComponentStyles(store.selectedId);
        showToastNotification('Styles pasted', 'success');
      }
    },
    'cmd+shift+v': (e: KeyboardEvent) => {
      e?.preventDefault();
      if (store.selectedIds.size > 0) {
        store.pasteStylesToSelected();
        showToastNotification('Styles pasted', 'success');
      } else if (store.selectedId) {
        store.pasteComponentStyles(store.selectedId);
        showToastNotification('Styles pasted', 'success');
      }
    },

    // Save
    'ctrl+s': (e: KeyboardEvent) => {
      e?.preventDefault();
      saveProject();
    },
    'cmd+s': (e: KeyboardEvent) => {
      e?.preventDefault();
      saveProject();
    },

    // Selection
    'escape': (_e: KeyboardEvent) => {
      store.clearSelection();
    },
    'ctrl+a': (e: KeyboardEvent) => {
      if (!isInputFocused()) {
        e?.preventDefault();
        const allIds = getAllComponentIds(store.components);
        store.selectMultipleComponents(allIds);
      }
    },
    'cmd+a': (e: KeyboardEvent) => {
      if (!isInputFocused()) {
        e?.preventDefault();
        const allIds = getAllComponentIds(store.components);
        store.selectMultipleComponents(allIds);
      }
    },

    // Help
    '?': (_e: KeyboardEvent) => {
      if (!isInputFocused()) {
        showKeyboardHelp.value = !showKeyboardHelp.value;
      }
    },
    'shift+?': (_e: KeyboardEvent) => {
      if (!isInputFocused()) {
        showKeyboardHelp.value = !showKeyboardHelp.value;
      }
    }
  };

  function getAllComponentIds(components: any[]): string[] {
    const ids: string[] = [];
    function traverse(comps: any[]) {
      comps.forEach(comp => {
        ids.push(comp.id);
        if (comp.children) {
          traverse(comp.children);
        }
      });
    }
    traverse(components);
    return ids;
  }

  function showToastNotification(message: string, type: string) {
    // Simple toast notification - can be enhanced
    console.log(`${type.toUpperCase()}: ${message}`);
  }
  
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