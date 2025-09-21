<template>
  <div class="responsive-toggle">
    <button 
      v-for="bp in breakpoints" 
      :key="bp.value"
      @click="$emit('update:modelValue', bp.value)"
      :class="['breakpoint-btn', { active: modelValue === bp.value }]"
      :title="bp.label"
    >
      <component :is="bp.icon" :size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Smartphone, Tablet, Monitor, Tv2, Laptop } from 'lucide-vue-next';

defineProps<{
  modelValue: 'base' | 'sm' | 'md' | 'lg' | 'xl'
}>();

defineEmits<{
  'update:modelValue': [value: 'base' | 'sm' | 'md' | 'lg' | 'xl']
}>();

const breakpoints = [
  { value: 'base', label: 'Base', icon: Smartphone },
  { value: 'sm', label: 'Small (640px+)', icon: Tablet },
  { value: 'md', label: 'Medium (768px+)', icon: Laptop },
  { value: 'lg', label: 'Large (1024px+)', icon: Monitor },
  { value: 'xl', label: 'Extra Large (1280px+)', icon: Tv2 },
];
</script>

<style scoped>
.responsive-toggle {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: #F3F4F6;
  border-radius: 6px;
}

.breakpoint-btn {
  padding: 4px 6px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.breakpoint-btn:hover {
  background: white;
  color: #4B5563;
}

.breakpoint-btn.active {
  background: white;
  color: #3B82F6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>