<template>
  <div class="variant-selector" v-if="variants && variants.length > 0">
    <div class="section-header">Style Preset</div>
    <div class="variant-grid">
      <button
        v-for="variant in variants"
        :key="variant.id"
        @click="applyVariant(variant)"
        :class="['variant-option', { active: isActiveVariant(variant) }]"
        :title="variant.name"
      >
        <div class="variant-preview">
          <component
            :is="getPreviewComponent()"
            :style="getPreviewStyles(variant)"
            class="preview-element"
          >
            {{ getPreviewContent() }}
          </component>
        </div>
        <span class="variant-name">{{ variant.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '@/stores/editor';
import type { ComponentVariant } from '@/types/component';
import { componentDefinitions } from '@/config/components';

const store = useEditorStore();

const selectedComponent = computed(() => store.selectedComponent);

const variants = computed(() => {
  if (!selectedComponent.value) return [];
  const definition = componentDefinitions[selectedComponent.value.type];
  return definition.variants || [];
});

function getPreviewComponent() {
  if (!selectedComponent.value) return 'div';
  
  switch (selectedComponent.value.type) {
    case 'heading':
      return 'div';
    case 'button':
      return 'button';
    case 'text':
      return 'p';
    default:
      return 'div';
  }
}

function getPreviewContent() {
  if (!selectedComponent.value) return '';
  
  switch (selectedComponent.value.type) {
    case 'heading':
      return 'Aa';
    case 'button':
      return 'Button';
    case 'text':
      return 'Text';
    default:
      return '';
  }
}

function getPreviewStyles(variant: ComponentVariant) {
  const styles = variant.styles.base || {};
  const previewStyles: any = {};
  
  // Extract key visual properties for preview
  const visualProps = [
    'backgroundColor', 'background', 'color', 'border', 
    'borderRadius', 'fontWeight', 'fontSize', 'textTransform',
    'boxShadow', 'padding'
  ];
  
  visualProps.forEach(prop => {
    if (styles[prop]) {
      previewStyles[prop] = styles[prop];
    }
  });
  
  // Scale down for preview
  if (selectedComponent.value?.type === 'button') {
    previewStyles.padding = '4px 12px';
    previewStyles.fontSize = '12px';
  } else if (selectedComponent.value?.type === 'heading') {
    previewStyles.fontSize = '18px';
    previewStyles.fontWeight = styles.fontWeight || 'bold';
  } else if (selectedComponent.value?.type === 'text') {
    previewStyles.fontSize = '12px';
    previewStyles.lineHeight = '1.4';
  }
  
  return previewStyles;
}

function isActiveVariant(variant: ComponentVariant) {
  if (!selectedComponent.value) return false;
  
  // Compare current component styles with variant styles
  const componentStyles = selectedComponent.value.styles.base;
  const variantStyles = variant.styles.base;
  
  // Check if key properties match
  const keyProps = ['backgroundColor', 'background', 'color', 'border'];
  return keyProps.some(prop => componentStyles[prop] === variantStyles[prop]);
}

function applyVariant(variant: ComponentVariant) {
  if (!selectedComponent.value) return;
  
  // Apply variant styles to component
  const newStyles = {
    ...selectedComponent.value.styles,
    base: {
      ...selectedComponent.value.styles.base,
      ...variant.styles.base
    }
  };
  
  // Apply variant props if any
  const newProps = variant.props ? {
    ...selectedComponent.value.props,
    ...variant.props
  } : selectedComponent.value.props;
  
  store.updateComponent(selectedComponent.value.id, {
    styles: newStyles,
    props: newProps
  });
}
</script>

<style scoped>
.variant-selector {
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
}

.section-header {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.variant-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.variant-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.variant-option:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

.variant-option.active {
  background: var(--bg-tertiary);
  border-color: var(--primary);
}

.variant-preview {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.preview-element {
  max-width: 100%;
  text-align: center;
  transition: none;
}

.variant-name {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}

/* Special handling for gradient backgrounds */
.preview-element[style*="background-clip"] {
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}
</style>