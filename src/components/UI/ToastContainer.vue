<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
        >
          <component :is="getIcon(toast.type)" :size="18" />
          <span>{{ toast.message }}</span>
          <button @click="removeToast(toast.id)" class="toast-close">
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next';

const { toasts, removeToast } = useToast();

function getIcon(type: string) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  return icons[type as keyof typeof icons] || Info;
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  padding: 14px 16px;
  margin-bottom: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.toast-success {
  border-left: 4px solid #10B981;
  color: #059669;
}

.toast-error {
  border-left: 4px solid #EF4444;
  color: #DC2626;
}

.toast-warning {
  border-left: 4px solid #F59E0B;
  color: #D97706;
}

.toast-info {
  border-left: 4px solid #3B82F6;
  color: #2563EB;
}

.toast-close {
  margin-left: auto;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #4B5563;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>