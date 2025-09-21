import { ref, reactive } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  function showToast(message: string, type: ToastType = 'info', duration = 3000) {
    const id = Date.now().toString();
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };
    
    toasts.value.push(toast);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }
  
  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }
  
  return {
    toasts,
    showToast,
    removeToast
  };
}