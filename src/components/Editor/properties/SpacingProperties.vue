<template>
  <div class="spacing-properties">
    <!-- Visual Box Model -->
    <div class="box-model">
      <div class="box-label">Margin</div>
      <div class="box-margin">
        <input 
          v-model="margin.top" 
          @input="updateMargin"
          class="spacing-input top"
          placeholder="-"
        />
        <input 
          v-model="margin.right" 
          @input="updateMargin"
          class="spacing-input right"
          placeholder="-"
        />
        <input 
          v-model="margin.bottom" 
          @input="updateMargin"
          class="spacing-input bottom"
          placeholder="-"
        />
        <input 
          v-model="margin.left" 
          @input="updateMargin"
          class="spacing-input left"
          placeholder="-"
        />
        
        <div class="box-padding">
          <div class="box-label padding-label">Padding</div>
          <input 
            v-model="padding.top" 
            @input="updatePadding"
            class="spacing-input padding top"
            placeholder="-"
          />
          <input 
            v-model="padding.right" 
            @input="updatePadding"
            class="spacing-input padding right"
            placeholder="-"
          />
          <input 
            v-model="padding.bottom" 
            @input="updatePadding"
            class="spacing-input padding bottom"
            placeholder="-"
          />
          <input 
            v-model="padding.left" 
            @input="updatePadding"
            class="spacing-input padding left"
            placeholder="-"
          />
          
          <div class="box-content">
            <div class="content-size">
              {{ contentWidth || 'auto' }} × {{ contentHeight || 'auto' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button 
        @click="linkSpacing('margin')" 
        :class="['link-btn', { linked: marginLinked }]"
        title="Link/Unlink margin values"
      >
        <Link2 v-if="marginLinked" :size="14" />
        <Unlink2 v-else :size="14" />
      </button>
      
      <button 
        @click="resetSpacing('margin')" 
        class="reset-btn"
        title="Reset margin"
      >
        <RotateCcw :size="14" />
      </button>

      <div class="spacer"></div>

      <button 
        @click="linkSpacing('padding')" 
        :class="['link-btn', { linked: paddingLinked }]"
        title="Link/Unlink padding values"
      >
        <Link2 v-if="paddingLinked" :size="14" />
        <Unlink2 v-else :size="14" />
      </button>
      
      <button 
        @click="resetSpacing('padding')" 
        class="reset-btn"
        title="Reset padding"
      >
        <RotateCcw :size="14" />
      </button>
    </div>

    <!-- Spacing Presets -->
    <div class="presets">
      <label>Quick spacing</label>
      <div class="preset-grid">
        <button 
          v-for="preset in spacingPresets" 
          :key="preset.value"
          @click="applyPreset(preset)"
          class="preset-btn"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Gap Control (for flex/grid) -->
    <div v-if="isFlexOrGrid" class="gap-control">
      <label>Gap</label>
      <div class="gap-inputs">
        <div class="input-group">
          <span class="input-label">Row</span>
          <input 
            v-model="gap.row" 
            @input="updateGap"
            placeholder="0"
          />
        </div>
        <div class="input-group">
          <span class="input-label">Column</span>
          <input 
            v-model="gap.column" 
            @input="updateGap"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Link2, Unlink2, RotateCcw } from 'lucide-vue-next';
import type { Component } from '@/types/component';

const props = defineProps<{
  component: Component;
  breakpoint: 'base' | 'sm' | 'md' | 'lg' | 'xl';
}>();

const emit = defineEmits<{
  update: [styles: Record<string, any>];
}>();

// Spacing values
const margin = ref({
  top: '',
  right: '',
  bottom: '',
  left: ''
});

const padding = ref({
  top: '',
  right: '',
  bottom: '',
  left: ''
});

const gap = ref({
  row: '',
  column: ''
});

const marginLinked = ref(false);
const paddingLinked = ref(false);

// Get current styles
const styles = computed(() => 
  props.component.styles[props.breakpoint] || props.component.styles.base || {}
);

const isFlexOrGrid = computed(() => 
  styles.value.display === 'flex' || styles.value.display === 'grid'
);

const contentWidth = computed(() => styles.value.width);
const contentHeight = computed(() => styles.value.height);

// Spacing presets
const spacingPresets = [
  { label: 'None', value: '0' },
  { label: 'XS', value: '4px' },
  { label: 'S', value: '8px' },
  { label: 'M', value: '16px' },
  { label: 'L', value: '24px' },
  { label: 'XL', value: '32px' },
  { label: '2XL', value: '48px' },
  { label: '3XL', value: '64px' }
];

// Initialize values
watch(() => props.component, (component) => {
  const currentStyles = component.styles[props.breakpoint] || {};
  
  margin.value = {
    top: currentStyles.marginTop || '',
    right: currentStyles.marginRight || '',
    bottom: currentStyles.marginBottom || '',
    left: currentStyles.marginLeft || ''
  };
  
  padding.value = {
    top: currentStyles.paddingTop || '',
    right: currentStyles.paddingRight || '',
    bottom: currentStyles.paddingBottom || '',
    left: currentStyles.paddingLeft || ''
  };
  
  gap.value = {
    row: currentStyles.rowGap || currentStyles.gap || '',
    column: currentStyles.columnGap || currentStyles.gap || ''
  };
}, { immediate: true });

// Update functions
function updateMargin() {
  if (marginLinked.value) {
    const value = margin.value.top;
    margin.value = { top: value, right: value, bottom: value, left: value };
  }
  
  emit('update', {
    marginTop: margin.value.top || undefined,
    marginRight: margin.value.right || undefined,
    marginBottom: margin.value.bottom || undefined,
    marginLeft: margin.value.left || undefined
  });
}

function updatePadding() {
  if (paddingLinked.value) {
    const value = padding.value.top;
    padding.value = { top: value, right: value, bottom: value, left: value };
  }
  
  emit('update', {
    paddingTop: padding.value.top || undefined,
    paddingRight: padding.value.right || undefined,
    paddingBottom: padding.value.bottom || undefined,
    paddingLeft: padding.value.left || undefined
  });
}

function updateGap() {
  emit('update', {
    gap: gap.value.row === gap.value.column ? gap.value.row : undefined,
    rowGap: gap.value.row || undefined,
    columnGap: gap.value.column || undefined
  });
}

function linkSpacing(type: 'margin' | 'padding') {
  if (type === 'margin') {
    marginLinked.value = !marginLinked.value;
    if (marginLinked.value) updateMargin();
  } else {
    paddingLinked.value = !paddingLinked.value;
    if (paddingLinked.value) updatePadding();
  }
}

function resetSpacing(type: 'margin' | 'padding') {
  if (type === 'margin') {
    margin.value = { top: '', right: '', bottom: '', left: '' };
    updateMargin();
  } else {
    padding.value = { top: '', right: '', bottom: '', left: '' };
    updatePadding();
  }
}

function applyPreset(preset: { value: string }) {
  if (marginLinked.value) {
    margin.value = { 
      top: preset.value, 
      right: preset.value, 
      bottom: preset.value, 
      left: preset.value 
    };
  }
  
  if (paddingLinked.value) {
    padding.value = { 
      top: preset.value, 
      right: preset.value, 
      bottom: preset.value, 
      left: preset.value 
    };
  }
  
  updateMargin();
  updatePadding();
}
</script>

<style scoped>
.spacing-properties {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Visual Box Model */
.box-model {
  position: relative;
  padding: 20px;
  background: #F9FAFB;
  border-radius: 8px;
}

.box-label {
  position: absolute;
  top: 4px;
  left: 8px;
  font-size: 10px;
  text-transform: uppercase;
  color: #9CA3AF;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.box-margin {
  position: relative;
  background: #E5E7EB;
  border-radius: 6px;
  padding: 32px;
  min-height: 180px;
}

.box-padding {
  position: relative;
  background: #D1D5DB;
  border-radius: 4px;
  padding: 32px;
  height: 100%;
  min-height: 116px;
}

.padding-label {
  top: 4px;
  left: 8px;
}

.box-content {
  background: white;
  border: 1px solid #9CA3AF;
  border-radius: 3px;
  height: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-size {
  font-size: 11px;
  color: #6B7280;
  font-family: monospace;
}

.spacing-input {
  position: absolute;
  width: 36px;
  padding: 2px;
  text-align: center;
  font-size: 11px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  outline: none;
}

.spacing-input:focus {
  border-color: #3B82F6;
  background: white;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.spacing-input.top {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
}

.spacing-input.right {
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.spacing-input.bottom {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
}

.spacing-input.left {
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.spacing-input.padding {
  background: rgba(255, 255, 255, 0.9);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
}

.link-btn,
.reset-btn {
  padding: 6px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.link-btn:hover,
.reset-btn:hover {
  background: #F3F4F6;
  border-color: #D1D5DB;
}

.link-btn.linked {
  background: #EFF6FF;
  color: #3B82F6;
  border-color: #3B82F6;
}

.spacer {
  flex: 1;
}

/* Presets */
.presets label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 8px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.preset-btn {
  padding: 6px 8px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 12px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #F3F4F6;
  border-color: #D1D5DB;
  color: #4B5563;
}

/* Gap Control */
.gap-control {
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.gap-control label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 8px;
}

.gap-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-label {
  font-size: 11px;
  color: #9CA3AF;
  min-width: 40px;
}

.input-group input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

.input-group input:focus {
  border-color: #3B82F6;
}
</style>