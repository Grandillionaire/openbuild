<template>
  <div class="canvas-wrapper">
    <!-- Toolbar -->
    <div class="canvas-toolbar">
      <div class="viewport-controls">
        <button 
          v-for="vp in viewports" 
          :key="vp.value"
          @click="store.setViewport(vp.value as 'mobile' | 'tablet' | 'desktop')"
          :class="['viewport-btn', { active: viewport === vp.value }]"
          :title="vp.label"
        >
          <component :is="vp.icon" :size="20" />
        </button>
      </div>
      
      <div class="zoom-controls">
        <button @click="zoomOut" title="Zoom Out">
          <ZoomOut :size="18" />
        </button>
        <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
        <button @click="zoomIn" title="Zoom In">
          <ZoomIn :size="18" />
        </button>
        <button @click="resetZoom" title="Reset Zoom">
          <Maximize2 :size="18" />
        </button>
      </div>
    </div>
    
    <!-- Canvas -->
    <div 
      ref="canvasRef"
      class="canvas-container"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <div 
        class="canvas-viewport"
        :style="viewportStyles"
      >
        <div
          v-if="components.length === 0"
          class="empty-state"
        >
          <Package :size="48" />
          <h3>Start Building Your Website</h3>
          <p>Choose a template or drag components from the sidebar</p>
          <button @click="$emit('show-templates')" class="template-cta">
            <BookOpen :size="20" />
            Browse Templates
          </button>
          <span class="separator-text">or</span>
          <p class="hint">Drag components from the left sidebar to start from scratch</p>
        </div>
        
        <div class="canvas-content" v-if="components.length > 0">
          <ComponentRenderer
            v-for="component in components"
            :key="component.id"
            :component="component"
            :selected="selectedId === component.id"
            :hovered="hoveredId === component.id"
            @select="selectComponent"
            @mouseenter="store.hoveredId = component.id"
            @mouseleave="store.hoveredId = null"
          />
        </div>
      </div>
      
      <!-- Grid overlay -->
      <div v-if="store.showGrid" class="grid-overlay"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Package,
  BookOpen
} from 'lucide-vue-next';
import ComponentRenderer from './ComponentRenderer.vue';

const store = useEditorStore();
const canvasRef = ref<HTMLElement>();

// Emits
const emit = defineEmits(['show-templates']);

// Computed
const components = computed(() => store.components);
const selectedId = computed(() => store.selectedId);
const hoveredId = computed(() => store.hoveredId);
const viewport = computed(() => store.viewport);
const zoom = computed(() => store.zoom);

const viewports = [
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
  { value: 'tablet', label: 'Tablet', icon: Tablet },
  { value: 'desktop', label: 'Desktop', icon: Monitor }
];

const viewportStyles = computed(() => {
  const widths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%'
  };
  
  return {
    width: widths[viewport.value],
    transform: `scale(${zoom.value})`,
    transformOrigin: 'top center',
    transition: 'width 0.3s ease',
    margin: '0 auto',
    minHeight: '100%',
    backgroundColor: 'white',
    boxShadow: viewport.value !== 'desktop' 
      ? '0 0 50px rgba(0,0,0,0.1)' 
      : 'none'
  };
});

// Methods
function selectComponent(id: string) {
  store.selectedId = id;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();

  // Check if it's a section drop
  const sectionData = e.dataTransfer?.getData('sectionData');
  if (sectionData) {
    try {
      const components = JSON.parse(sectionData);
      // Use the addSectionComponents method for pre-built sections
      store.addSectionComponents(components);
      return;
    } catch (err) {
      console.error('Failed to parse section data:', err);
    }
  }

  // Regular component drop
  const type = e.dataTransfer?.getData('componentType');
  if (type) {
    store.addComponent(type as any);
  }
}

function zoomIn() {
  store.setZoom(zoom.value + 0.1);
}

function zoomOut() {
  store.setZoom(zoom.value - 0.1);
}

function resetZoom() {
  store.setZoom(1);
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  if (e.metaKey || e.ctrlKey) {
    switch(e.key) {
      case 'z':
        if (e.shiftKey) {
          store.redo();
        } else {
          store.undo();
        }
        e.preventDefault();
        break;
      case 'Delete':
      case 'Backspace':
        if (selectedId.value) {
          store.deleteComponent(selectedId.value);
          e.preventDefault();
        }
        break;
      case 'd':
        if (selectedId.value) {
          store.duplicateComponent(selectedId.value);
          e.preventDefault();
        }
        break;
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

</script>

<style scoped>
.canvas-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #F9FAFB;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
}

.viewport-controls {
  display: flex;
  gap: 8px;
}

.viewport-btn {
  padding: 8px;
  border: 1px solid #E5E7EB;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.viewport-btn:hover {
  background: #F3F4F6;
}

.viewport-btn.active {
  background: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-controls button {
  padding: 6px;
  border: 1px solid #E5E7EB;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.zoom-controls button:hover {
  background: #F3F4F6;
}

.zoom-level {
  font-size: 14px;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}

.canvas-container {
  flex: 1;
  overflow: auto;
  position: relative;
  padding: 40px 20px;
}

.canvas-viewport {
  background: white;
  min-height: 600px;
  position: relative;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #9CA3AF;
}

.empty-state h3 {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 600;
  color: #4B5563;
}

.empty-state p {
  margin-top: 8px;
  font-size: 14px;
}

.template-cta {
  margin-top: 24px;
  padding: 12px 24px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.template-cta:hover {
  background: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.separator-text {
  display: block;
  margin: 20px 0 16px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #D1D5DB;
}

.hint {
  font-size: 13px !important;
  color: #9CA3AF !important;
}

.canvas-content {
  min-height: 600px;
  padding: 20px;
  width: 100%;
  position: relative;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(0deg, transparent, transparent 19px, #E5E7EB 19px, #E5E7EB 20px),
    repeating-linear-gradient(90deg, transparent, transparent 19px, #E5E7EB 19px, #E5E7EB 20px);
  pointer-events: none;
  opacity: 0.3;
}

.components-enter-active,
.components-leave-active {
  transition: all 0.3s ease;
}

.components-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.components-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>