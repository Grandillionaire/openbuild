<template>
  <div class="app">
    <!-- Performance Monitor (development only) -->
    <div v-if="isDev" class="perf-monitor">
      <span>FPS: {{ fps }}</span>
      <span>MEM: {{ memoryUsage }}%</span>
    </div>
    
    <ErrorBoundary>
      <!-- Header -->
      <AppHeader />
      
      <div class="app-body">
        <!-- Left Sidebar - Component Library -->
        <aside class="sidebar sidebar-left">
          <ErrorBoundary>
            <ComponentLibrary />
          </ErrorBoundary>
        </aside>
        
        <!-- Main Canvas -->
        <main class="main-content">
          <ErrorBoundary>
            <Canvas @show-templates="showTemplateLibrary = true" />
          </ErrorBoundary>
        </main>
        
        <!-- Right Sidebar - Properties -->
        <aside class="sidebar sidebar-right">
          <ErrorBoundary>
            <PropertyEditor />
          </ErrorBoundary>
        </aside>
      </div>
      
      <!-- Code View Modal -->
      <CodeViewer v-if="store.showCode" />
      
      <!-- Asset Manager Modal -->
      <AssetManager 
        :isOpen="store.showAssetManager" 
        @close="store.toggleAssetManager"
        @select="handleAssetSelect"
      />
      
      <!-- Template Library -->
      <TemplateLibrary 
        :isOpen="showTemplateLibrary" 
        @close="showTemplateLibrary = false" 
      />
    </ErrorBoundary>
    
  </div>
</template>

<script setup lang="ts">
/**
 * Main Application Component - OpenBuild Website Builder
 * 
 * This is the root component that orchestrates the entire visual website builder.
 * It manages the overall layout with three main sections:
 * 1. Left sidebar: Component library for dragging components
 * 2. Center: Canvas area where users build their websites
 * 3. Right sidebar: Property editor for customizing components
 * 
 * Key Features:
 * - Responsive design with mobile-friendly navigation
 * - Modal system for templates, assets, and code viewing
 * - Performance monitoring in development mode
 * - Auto-save and project persistence
 * - Keyboard shortcuts for power users
 * - Error boundaries for graceful error handling
 */

import { onMounted, computed, ref } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useThemeStore } from '@/stores/theme';
import AppHeader from '@/components/Layout/AppHeader.vue';
import ComponentLibrary from '@/components/Editor/ComponentLibrary.vue';
import Canvas from '@/components/Canvas/Canvas.vue';
import PropertyEditor from '@/components/Editor/PropertyEditorNew.vue';
import CodeViewer from '@/components/Editor/CodeViewer.vue';
import ErrorBoundary from '@/components/UI/ErrorBoundary.vue';
import AssetManager from '@/components/Assets/AssetManager.vue';
import TemplateLibrary from '@/components/Templates/TemplateLibrary.vue';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';
import { usePerformance } from '@/composables/usePerformance';
import { storageService } from '@/services/storageService';
import { useAnimationStyles } from '@/composables/useAnimationStyles';

const store = useEditorStore();
const themeStore = useThemeStore();
const { fps, memoryUsage, startMonitoring } = usePerformance();
const isDev = computed(() => import.meta.env.DEV);

// Template Library state
const showTemplateLibrary = ref(false);

// Initialize keyboard shortcuts
useKeyboardShortcuts();

// Initialize animation styles
useAnimationStyles();

/**
 * Handles asset selection from the Asset Manager
 * When an asset is selected:
 * 1. If an image component is selected, updates its source
 * 2. Adds the asset to the global asset store for reuse
 */
function handleAssetSelect(asset: any) {
  // Check if current selected component is an image that needs updating
  if (store.selectedComponent && store.selectedComponent.type === 'image') {
    const attributes = { ...store.selectedComponent.props.attributes };
    attributes.src = asset.url;
    store.updateComponent(store.selectedComponent.id, {
      props: { ...store.selectedComponent.props, attributes }
    });
  }
  
  // Store asset for future use
  store.addAsset(asset);
}


onMounted(async () => {
  // Apply default theme
  themeStore.applyThemeToDocument();
  
  // Start performance monitoring
  if (isDev.value) {
    startMonitoring();
  }
  
  // Load last project if exists
  const lastProjectId = localStorage.getItem('lastProjectId');
  if (lastProjectId) {
    const project = await storageService.loadProject(lastProjectId);
    if (project) {
      store.projectId = project.id;
      store.projectName = project.name;
      store.components = project.components;
    }
  }
  
  // Setup beforeunload handler
  window.addEventListener('beforeunload', (e) => {
    if (store.components.length > 0) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  });
});
</script>

<style>
@import './assets/styles/main.css';

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F9FAFB;
  overflow: hidden;
}

.perf-monitor {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #10B981;
  font-family: monospace;
  font-size: 12px;
  border-radius: 4px;
  z-index: 9999;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  background: white;
  border-right: 1px solid #E5E7EB;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.sidebar-left {
  width: 280px;
  min-width: 240px;
  max-width: 400px;
  resize: horizontal;
}

.sidebar-right {
  width: 320px;
  min-width: 280px;
  max-width: 480px;
  resize: horizontal;
  border-left: 1px solid #E5E7EB;
  border-right: none;
}

.main-content {
  flex: 1;
  overflow: hidden;
  min-width: 400px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar-left {
    width: 240px;
  }
  
  .sidebar-right {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .sidebar-left,
  .sidebar-right {
    width: 240px;
    min-width: 200px;
  }
  
  .main-content {
    min-width: 320px;
  }
}
</style>