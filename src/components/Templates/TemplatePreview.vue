<template>
  <div class="template-preview-container">
    <!-- Mini Canvas Preview -->
    <div class="mini-canvas" :style="canvasStyle">
      <!-- Render simplified components -->
      <div v-for="(component, index) in previewComponents" :key="index" class="preview-component" :style="getComponentStyle(component)">
        <!-- Navigation Preview -->
        <template v-if="component.type === 'navigation'">
          <div class="nav-preview">
            <div class="nav-logo"></div>
            <div class="nav-links">
              <span v-for="n in 4" :key="n" class="nav-link"></span>
            </div>
          </div>
        </template>

        <!-- Hero Preview -->
        <template v-else-if="component.type === 'hero'">
          <div class="hero-preview">
            <div class="hero-title"></div>
            <div class="hero-subtitle"></div>
            <div class="hero-button"></div>
          </div>
        </template>

        <!-- Features Preview -->
        <template v-else-if="component.type === 'features'">
          <div class="features-preview">
            <div v-for="n in 3" :key="n" class="feature-item">
              <div class="feature-icon"></div>
              <div class="feature-text"></div>
            </div>
          </div>
        </template>

        <!-- CTA Preview -->
        <template v-else-if="component.type === 'cta'">
          <div class="cta-preview">
            <div class="cta-text"></div>
            <div class="cta-button"></div>
          </div>
        </template>

        <!-- Footer Preview -->
        <template v-else-if="component.type === 'footer'">
          <div class="footer-preview">
            <div class="footer-content"></div>
          </div>
        </template>

        <!-- Section Preview -->
        <template v-else-if="component.type === 'section'">
          <div class="section-preview" :style="getSectionStyle(component)">
            <div class="section-content"></div>
          </div>
        </template>

        <!-- Container/Div Preview -->
        <template v-else-if="component.type === 'container' || component.type === 'div'">
          <div class="container-preview">
            <div class="container-content"></div>
          </div>
        </template>

        <!-- Text/Heading Preview -->
        <template v-else-if="component.type === 'heading' || component.type === 'text'">
          <div class="text-preview" :class="component.type"></div>
        </template>

        <!-- Button Preview -->
        <template v-else-if="component.type === 'button'">
          <div class="button-preview"></div>
        </template>

        <!-- Image Preview -->
        <template v-else-if="component.type === 'image'">
          <div class="image-preview">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        </template>

        <!-- Generic Component -->
        <template v-else>
          <div class="generic-preview"></div>
        </template>
      </div>
    </div>

    <!-- Gradient Overlay for Style -->
    <div class="preview-overlay" :style="overlayStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Template } from '@/types/template';

const props = defineProps<{
  template: Template;
  category?: string;
}>();

// Get color scheme based on category
const categoryColors = {
  landing: {
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  portfolio: {
    primary: '#f59e0b',
    secondary: '#ea580c',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
  },
  blog: {
    primary: '#10b981',
    secondary: '#059669',
    gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
  },
  business: {
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
  },
  ecommerce: {
    primary: '#ec4899',
    secondary: '#db2777',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)'
  }
};

const colorScheme = computed(() => {
  return categoryColors[props.template.category as keyof typeof categoryColors] || categoryColors.landing;
});

const canvasStyle = computed(() => ({
  background: '#ffffff',
  position: 'relative',
  overflow: 'hidden'
}));

const overlayStyle = computed(() => ({
  background: colorScheme.value.gradient,
  opacity: 0.05
}));

// Simplify components for preview
const previewComponents = computed(() => {
  // Take first 5-6 components for preview
  return props.template.components.slice(0, 6);
});

function getComponentStyle(component: any) {
  const baseStyle: any = {};

  // Extract key styles for preview
  if (component.styles?.base) {
    const styles = component.styles.base;
    if (styles.backgroundColor) baseStyle.backgroundColor = styles.backgroundColor;
    if (styles.padding) baseStyle.padding = '8px';
    if (styles.margin) baseStyle.margin = '4px';
  }

  // Special handling for specific types
  if (component.type === 'hero') {
    baseStyle.background = colorScheme.value.gradient;
    baseStyle.minHeight = '80px';
  }

  return baseStyle;
}

function getSectionStyle(component: any) {
  const style: any = {};
  if (component.props?.style?.background) {
    style.background = component.props.style.background;
  }
  return style;
}
</script>

<style scoped>
.template-preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
}

.mini-canvas {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

/* Component Previews */
.preview-component {
  position: relative;
  flex-shrink: 0;
}

/* Navigation */
.nav-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.nav-logo {
  width: 40px;
  height: 8px;
  background: #6b7280;
  border-radius: 4px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  width: 20px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
}

/* Hero */
.hero-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 6px;
  min-height: 80px;
}

.hero-title {
  width: 120px;
  height: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
}

.hero-subtitle {
  width: 160px;
  height: 4px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
}

.hero-button {
  width: 60px;
  height: 12px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  margin-top: 4px;
}

/* Features */
.features-preview {
  display: flex;
  gap: 8px;
  padding: 12px;
  justify-content: center;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.feature-icon {
  width: 20px;
  height: 20px;
  background: #e5e7eb;
  border-radius: 6px;
}

.feature-text {
  width: 100%;
  height: 3px;
  background: #e5e7eb;
  border-radius: 2px;
}

/* CTA */
.cta-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: #f3f4f6;
}

.cta-text {
  width: 100px;
  height: 4px;
  background: #6b7280;
  border-radius: 2px;
}

.cta-button {
  width: 50px;
  height: 10px;
  background: #3b82f6;
  border-radius: 5px;
}

/* Footer */
.footer-preview {
  padding: 8px;
  background: #1f2937;
  margin-top: auto;
}

.footer-content {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 auto;
}

/* Sections */
.section-preview {
  padding: 12px;
  background: #f9fafb;
}

.section-content {
  width: 100%;
  height: 20px;
  background: #e5e7eb;
  border-radius: 4px;
}

/* Container */
.container-preview {
  padding: 8px;
}

.container-content {
  width: 100%;
  height: 16px;
  background: #f3f4f6;
  border-radius: 4px;
}

/* Text */
.text-preview {
  height: 3px;
  background: #9ca3af;
  border-radius: 2px;
  margin: 2px 8px;
}

.text-preview.heading {
  height: 5px;
  background: #6b7280;
  width: 60%;
}

/* Button */
.button-preview {
  width: 40px;
  height: 10px;
  background: #3b82f6;
  border-radius: 5px;
  margin: 4px 8px;
}

/* Image */
.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #f3f4f6;
}

.image-preview svg {
  width: 24px;
  height: 24px;
  color: #d1d5db;
}

/* Generic */
.generic-preview {
  width: 100%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 4px;
  margin: 2px 0;
}

/* Hover Effect */
.template-preview-container:hover .mini-canvas {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}
</style>