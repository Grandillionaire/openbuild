<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <AlertTriangle :size="48" />
      <h2>Something went wrong</h2>
      <p>{{ error?.message || 'An unexpected error occurred' }}</p>
      <button @click="reset" class="reset-btn">
        <RefreshCw :size="16" />
        <span>Reset</span>
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { AlertTriangle, RefreshCw } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const hasError = ref(false);
const error = ref<Error | null>(null);
const { showToast } = useToast();

onErrorCaptured((err: Error) => {
  hasError.value = true;
  error.value = err;
  showToast('An error occurred. Please try again.', 'error');
  return false;
});

function reset() {
  hasError.value = false;
  error.value = null;
  window.location.reload();
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content svg {
  color: #EF4444;
  margin-bottom: 16px;
}

.error-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.error-content p {
  color: #6B7280;
  margin-bottom: 24px;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #2563EB;
  transform: translateY(-1px);
}
</style>