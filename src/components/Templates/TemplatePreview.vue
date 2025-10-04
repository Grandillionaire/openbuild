<template>
  <div class="template-preview-container">
    <!-- Rendered HTML Preview -->
    <div class="mini-canvas" :style="canvasStyle">
      <!-- Render components with actual content -->
      <div
        v-for="(component, index) in previewComponents"
        :key="index"
        class="preview-component"
        :style="getComponentStyle(component)"
      >
        <!-- Navigation Preview -->
        <template v-if="component.type === 'navigation'">
          <div class="nav-preview" :style="getNavStyle(component)">
            <div class="nav-logo">{{ getLogoText(component) }}</div>
            <div class="nav-links">
              <span v-for="(link, i) in getNavLinks(component)" :key="i" class="nav-link">
                {{ link }}
              </span>
            </div>
          </div>
        </template>

        <!-- Hero Preview -->
        <template v-else-if="component.type === 'hero'">
          <div class="hero-preview" :style="getHeroStyle(component)">
            <h1 class="hero-title">{{ getHeroTitle(component) }}</h1>
            <p class="hero-subtitle">{{ getHeroSubtitle(component) }}</p>
            <button class="hero-button">{{ getHeroButtonText(component) }}</button>
          </div>
        </template>

        <!-- Features Preview -->
        <template v-else-if="component.type === 'features'">
          <div class="features-preview" :style="getFeaturesStyle(component)">
            <div v-for="(feature, i) in getFeatures(component)" :key="i" class="feature-item">
              <div class="feature-icon" :style="{ background: feature.color }">
                <span class="icon-text">{{ feature.icon }}</span>
              </div>
              <h4 class="feature-title">{{ feature.title }}</h4>
              <p class="feature-desc">{{ feature.description }}</p>
            </div>
          </div>
        </template>

        <!-- CTA Preview -->
        <template v-else-if="component.type === 'cta'">
          <div class="cta-preview" :style="getCtaStyle(component)">
            <h3 class="cta-title">{{ getCtaText(component) }}</h3>
            <button class="cta-button">{{ getCtaButtonText(component) }}</button>
          </div>
        </template>

        <!-- Footer Preview -->
        <template v-else-if="component.type === 'footer'">
          <div class="footer-preview" :style="getFooterStyle(component)">
            <div class="footer-content">
              <p class="footer-text">{{ getFooterText(component) }}</p>
            </div>
          </div>
        </template>

        <!-- Render child components recursively -->
        <template v-else-if="component.children && component.children.length > 0">
          <div :style="getContainerStyle(component)">
            <template v-for="(child, childIndex) in getVisibleChildren(component)" :key="childIndex">
              <!-- Heading -->
              <h2 v-if="child.type === 'heading'" class="preview-heading" :style="getTextStyle(child)">
                {{ getTextContent(child) }}
              </h2>
              <!-- Text -->
              <p v-else-if="child.type === 'text'" class="preview-text" :style="getTextStyle(child)">
                {{ getTextContent(child) }}
              </p>
              <!-- Button -->
              <button v-else-if="child.type === 'button'" class="preview-button" :style="getButtonStyle(child)">
                {{ getButtonText(child) }}
              </button>
              <!-- Image -->
              <div v-else-if="child.type === 'image'" class="preview-image" :style="getImageStyle(child)">
                <svg viewBox="0 0 24 24" fill="currentColor" class="placeholder-icon">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
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

// Helper functions to extract content from components
function getLogoText(component: any): string {
  return component.content?.logo || component.props?.brandName || 'Logo';
}

function getNavLinks(component: any): string[] {
  const links = component.children?.filter((c: any) => c.type === 'link') || [];
  return links.length > 0
    ? links.slice(0, 4).map((l: any) => l.content || l.text || 'Link')
    : ['Home', 'About', 'Services', 'Contact'];
}

function getNavStyle(component: any): any {
  return {
    background: component.styles?.base?.backgroundColor || '#ffffff',
    borderBottom: `1px solid ${component.styles?.base?.borderColor || '#e5e7eb'}`
  };
}

function getHeroTitle(component: any): string {
  const heading = component.children?.find((c: any) => c.type === 'heading' || c.type === 'h1');
  return heading?.content || heading?.text || 'Welcome to Your Site';
}

function getHeroSubtitle(component: any): string {
  const text = component.children?.find((c: any) => c.type === 'text' || c.type === 'p');
  return text?.content || text?.text || 'Build amazing things';
}

function getHeroButtonText(component: any): string {
  const button = component.children?.find((c: any) => c.type === 'button');
  return button?.content || button?.text || 'Get Started';
}

function getHeroStyle(component: any): any {
  return {
    background: colorScheme.value.gradient,
    color: '#ffffff',
    minHeight: '80px'
  };
}

function getFeatures(component: any): any[] {
  const features = component.children?.filter((c: any) =>
    c.type === 'feature' || c.type === 'card'
  ) || [];

  if (features.length > 0) {
    return features.slice(0, 3).map((f: any, i: number) => ({
      icon: f.icon || ['⚡', '🎨', '🚀'][i] || '✨',
      title: f.title || f.heading || `Feature ${i + 1}`,
      description: f.description || f.text || 'Amazing feature',
      color: [colorScheme.value.primary, colorScheme.value.secondary, '#10b981'][i]
    }));
  }

  return [
    { icon: '⚡', title: 'Fast', description: 'Lightning speed', color: colorScheme.value.primary },
    { icon: '🎨', title: 'Beautiful', description: 'Stunning design', color: colorScheme.value.secondary },
    { icon: '🚀', title: 'Modern', description: 'Latest tech', color: '#10b981' }
  ];
}

function getFeaturesStyle(component: any): any {
  return {
    background: component.styles?.base?.backgroundColor || '#ffffff',
    padding: '12px'
  };
}

function getCtaText(component: any): string {
  const heading = component.children?.find((c: any) =>
    c.type === 'heading' || c.type === 'h2' || c.type === 'h3'
  );
  return heading?.content || heading?.text || 'Ready to get started?';
}

function getCtaButtonText(component: any): string {
  const button = component.children?.find((c: any) => c.type === 'button');
  return button?.content || button?.text || 'Get Started';
}

function getCtaStyle(component: any): any {
  return {
    background: component.styles?.base?.backgroundColor || '#f3f4f6',
    padding: '12px'
  };
}

function getFooterText(component: any): string {
  return component.content || '© 2025 All rights reserved';
}

function getFooterStyle(component: any): any {
  return {
    background: component.styles?.base?.backgroundColor || '#1f2937',
    padding: '8px'
  };
}

function getContainerStyle(component: any): any {
  return {
    background: component.styles?.base?.backgroundColor || 'transparent',
    padding: '8px'
  };
}

function getVisibleChildren(component: any): any[] {
  return (component.children || []).slice(0, 6);
}

function getTextContent(child: any): string {
  return child.content || child.text || 'Sample text content';
}

function getTextStyle(child: any): any {
  return {
    color: child.styles?.base?.color || '#6b7280',
    fontSize: child.type === 'heading' ? '0.875rem' : '0.75rem',
    fontWeight: child.type === 'heading' ? 600 : 400
  };
}

function getButtonText(child: any): string {
  return child.content || child.text || 'Button';
}

function getButtonStyle(child: any): any {
  return {
    background: child.styles?.base?.backgroundColor || colorScheme.value.primary,
    color: child.styles?.base?.color || '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600
  };
}

function getImageStyle(child: any): any {
  return {
    background: '#f3f4f6',
    minHeight: '40px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
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
  padding: 6px 10px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.nav-logo {
  font-size: 0.625rem;
  font-weight: 700;
  color: #1f2937;
  padding: 2px 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 6px;
}

.nav-link {
  font-size: 0.5rem;
  color: #6b7280;
  padding: 2px 4px;
  white-space: nowrap;
}

/* Hero */
.hero-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  gap: 4px;
  min-height: 70px;
}

.hero-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  margin: 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin: 0;
  line-height: 1.3;
}

.hero-button {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.95);
  color: #5b21b6;
  border: none;
  border-radius: 4px;
  font-size: 0.5rem;
  font-weight: 600;
  margin-top: 3px;
  cursor: default;
}

/* Features */
.features-preview {
  display: flex;
  gap: 6px;
  padding: 10px 8px;
  justify-content: center;
  background: #ffffff;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  max-width: 60px;
}

.feature-icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

.icon-text {
  font-size: 0.625rem;
}

.feature-title {
  font-size: 0.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-align: center;
  line-height: 1.2;
}

.feature-desc {
  font-size: 0.4rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
  line-height: 1.2;
}

/* CTA */
.cta-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
  background: #f8fafc;
}

.cta-title {
  font-size: 0.625rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin: 0;
  line-height: 1.3;
}

.cta-button {
  padding: 3px 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.5rem;
  font-weight: 600;
  cursor: default;
}

/* Footer */
.footer-preview {
  padding: 6px 8px;
  background: #1f2937;
  margin-top: auto;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-text {
  font-size: 0.45rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
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

/* Headings and Text in generic containers */
.preview-heading {
  font-size: 0.625rem;
  font-weight: 600;
  margin: 2px 0;
  line-height: 1.3;
}

.preview-text {
  font-size: 0.5rem;
  margin: 2px 0;
  line-height: 1.4;
  opacity: 0.8;
}

/* Buttons in generic containers */
.preview-button {
  padding: 3px 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.5rem;
  font-weight: 600;
  cursor: default;
  margin: 3px 0;
}

/* Image */
.preview-image {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  min-height: 30px;
  margin: 2px 0;
}

.placeholder-icon {
  width: 16px;
  height: 16px;
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