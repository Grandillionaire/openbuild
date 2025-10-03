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
      @dragover="handleDragOver"
      @dragenter.prevent
      @dragleave="handleDragLeave"
      @mousemove="handleMouseMove"
    >
      <div
        class="canvas-viewport"
        :style="viewportStyles"
      >
        <!-- Snap Guides Overlay -->
        <div v-if="store.showSnapGuides && showGuides" class="snap-guides">
          <div
            v-for="(line, index) in snapGuides.vertical"
            :key="'v-' + index"
            class="snap-guide vertical"
            :style="{ left: line + 'px' }"
          ></div>
          <div
            v-for="(line, index) in snapGuides.horizontal"
            :key="'h-' + index"
            class="snap-guide horizontal"
            :style="{ top: line + 'px' }"
          ></div>
        </div>

        <!-- Drop Preview Ghost -->
        <div
          v-if="dropPreview.targetId"
          class="drop-preview"
          :style="dropPreviewStyles"
        >
          <div class="preview-content">
            <Plus :size="20" />
            <span>Drop {{ draggedComponentName }} here</span>
          </div>
        </div>

        <!-- Marquee Selection Box -->
        <div
          v-if="isMarqueeSelecting"
          class="marquee-selection"
          :style="marqueeStyles"
        ></div>

        <div
          v-if="components.length === 0"
          class="empty-state"
          @dragover="handleDragOver"
          @drop="handleDrop"
        >
          <div class="empty-state-content">
            <div class="icon-wrapper">
              <Package :size="48" />
            </div>
            <h3>Let's Build Something Amazing! 🚀</h3>
            <p class="subtitle">Choose how you want to start:</p>

            <div class="start-options">
              <button @click="$emit('show-templates')" class="option-card template-option">
                <div class="option-icon">
                  <BookOpen :size="24" />
                </div>
                <div class="option-content">
                  <h4>Use a Template</h4>
                  <p>Start with a professional design</p>
                </div>
                <span class="recommended">Recommended</span>
              </button>

              <button @click="showComponentHint" class="option-card scratch-option">
                <div class="option-icon">
                  <Plus :size="24" />
                </div>
                <div class="option-content">
                  <h4>Start from Scratch</h4>
                  <p>Drag components from the left</p>
                </div>
              </button>
            </div>

            <div class="drag-hint" :class="{ active: isDraggingOver }">
              <div class="drag-area">
                <Upload :size="32" />
                <p>Or drag your first component here!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="canvas-content" v-if="components.length > 0" @click="handleCanvasClick">
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
  BookOpen,
  Plus,
  Upload
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
const dropPreview = computed(() => store.dropPreview);
const snapGuides = computed(() => store.snapGuides);

// State
const isDraggingOver = ref(false);
const showGuides = ref(false);
const isMarqueeSelecting = ref(false);
const marqueeStart = ref({ x: 0, y: 0 });
const marqueeEnd = ref({ x: 0, y: 0 });
const draggedComponentName = ref('');

// Store event handler for cleanup
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;

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

// Computed styles
const dropPreviewStyles = computed(() => {
  if (!dropPreview.value.coords) return {};

  return {
    left: dropPreview.value.coords.x + 'px',
    top: dropPreview.value.coords.y + 'px',
    opacity: 1
  };
});

const marqueeStyles = computed(() => {
  const left = Math.min(marqueeStart.value.x, marqueeEnd.value.x);
  const top = Math.min(marqueeStart.value.y, marqueeEnd.value.y);
  const width = Math.abs(marqueeEnd.value.x - marqueeStart.value.x);
  const height = Math.abs(marqueeEnd.value.y - marqueeStart.value.y);

  return {
    left: left + 'px',
    top: top + 'px',
    width: width + 'px',
    height: height + 'px'
  };
});

// Methods
function selectComponent(id: string) {
  store.selectedId = id;
  // Note: Multi-select is handled by handleCanvasClick which captures the event
}

function handleCanvasClick(event: MouseEvent) {
  // Find which component was clicked
  const target = event.target as HTMLElement;
  const componentEl = target.closest('[data-component-id]');

  if (componentEl) {
    const componentId = componentEl.getAttribute('data-component-id');

    if (componentId) {
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        store.toggleComponentSelection(componentId, true);
      } else {
        store.toggleComponentSelection(componentId, false);
      }
    }
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  isDraggingOver.value = true;

  if (!canvasRef.value) return;

  // Calculate drop position
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Find target component under cursor
  const targetElement = document.elementFromPoint(e.clientX, e.clientY);
  const componentElement = targetElement?.closest('[data-component-id]');

  if (componentElement) {
    const targetId = componentElement.getAttribute('data-component-id');
    const targetRect = componentElement.getBoundingClientRect();

    // Determine drop position (before, after, inside)
    const relativeY = e.clientY - targetRect.top;
    const threshold = targetRect.height / 3;

    let position: 'before' | 'after' | 'inside';
    if (relativeY < threshold) {
      position = 'before';
    } else if (relativeY > targetRect.height - threshold) {
      position = 'after';
    } else {
      position = 'inside';
    }

    store.setDropPreview(targetId, position, { x, y });
  } else {
    store.setDropPreview(null, null, { x, y });
  }

  // Calculate snap guides
  if (store.showSnapGuides) {
    calculateSnapGuides(x, y);
  }
}

function handleDragLeave(e: DragEvent) {
  // Only clear if we're actually leaving the canvas
  if (e.target === canvasRef.value) {
    isDraggingOver.value = false;
    store.clearDropPreview();
    showGuides.value = false;
  }
}

function calculateSnapGuides(x: number, y: number) {
  const threshold = 5; // Snap within 5px
  const guides = {
    vertical: [] as number[],
    horizontal: [] as number[]
  };

  // Get all component elements
  const componentElements = document.querySelectorAll('[data-component-id]');

  componentElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const canvasRect = canvasRef.value?.getBoundingClientRect();

    if (canvasRect) {
      const relativeLeft = rect.left - canvasRect.left;
      const relativeTop = rect.top - canvasRect.top;
      const relativeRight = relativeLeft + rect.width;
      const relativeBottom = relativeTop + rect.height;
      const centerX = relativeLeft + rect.width / 2;
      const centerY = relativeTop + rect.height / 2;

      // Check vertical alignment
      if (Math.abs(x - relativeLeft) < threshold) guides.vertical.push(relativeLeft);
      if (Math.abs(x - relativeRight) < threshold) guides.vertical.push(relativeRight);
      if (Math.abs(x - centerX) < threshold) guides.vertical.push(centerX);

      // Check horizontal alignment
      if (Math.abs(y - relativeTop) < threshold) guides.horizontal.push(relativeTop);
      if (Math.abs(y - relativeBottom) < threshold) guides.horizontal.push(relativeBottom);
      if (Math.abs(y - centerY) < threshold) guides.horizontal.push(centerY);
    }
  });

  // Remove duplicates
  store.snapGuides.vertical = [...new Set(guides.vertical)];
  store.snapGuides.horizontal = [...new Set(guides.horizontal)];
  showGuides.value = guides.vertical.length > 0 || guides.horizontal.length > 0;
}

function handleMouseMove(e: MouseEvent) {
  if (isMarqueeSelecting.value) {
    const rect = canvasRef.value?.getBoundingClientRect();
    if (rect) {
      marqueeEnd.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      updateMarqueeSelection();
    }
  }
}

function startMarqueeSelection(e: MouseEvent) {
  if (e.target === canvasRef.value || (e.target as HTMLElement).classList.contains('canvas-content')) {
    const rect = canvasRef.value?.getBoundingClientRect();
    if (rect) {
      isMarqueeSelecting.value = true;
      marqueeStart.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      marqueeEnd.value = { ...marqueeStart.value };
    }
  }
}

function updateMarqueeSelection() {
  const left = Math.min(marqueeStart.value.x, marqueeEnd.value.x);
  const top = Math.min(marqueeStart.value.y, marqueeEnd.value.y);
  const right = Math.max(marqueeStart.value.x, marqueeEnd.value.x);
  const bottom = Math.max(marqueeStart.value.y, marqueeEnd.value.y);

  const selectedIds: string[] = [];
  const componentElements = document.querySelectorAll('[data-component-id]');

  componentElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const canvasRect = canvasRef.value?.getBoundingClientRect();

    if (canvasRect) {
      const relativeRect = {
        left: rect.left - canvasRect.left,
        top: rect.top - canvasRect.top,
        right: rect.right - canvasRect.left,
        bottom: rect.bottom - canvasRect.top
      };

      // Check if component intersects with marquee
      if (
        relativeRect.left < right &&
        relativeRect.right > left &&
        relativeRect.top < bottom &&
        relativeRect.bottom > top
      ) {
        const id = el.getAttribute('data-component-id');
        if (id) selectedIds.push(id);
      }
    }
  });

  store.selectMultipleComponents(selectedIds);
}

function endMarqueeSelection() {
  isMarqueeSelecting.value = false;
}

function showComponentHint() {
  // Highlight the component library
  const sidebar = document.querySelector('.sidebar-left');
  sidebar?.classList.add('highlight-pulse');
  setTimeout(() => {
    sidebar?.classList.remove('highlight-pulse');
  }, 3000);
}

function handleDrop(e: DragEvent) {
  isDraggingOver.value = false;
  e.preventDefault();

  // Clear drop preview
  store.clearDropPreview();
  showGuides.value = false;

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
    draggedComponentName.value = type;

    // Use drop preview position if available
    if (dropPreview.value.targetId && dropPreview.value.position) {
      const targetComponent = store.components.find(c => c.id === dropPreview.value.targetId);

      if (targetComponent && dropPreview.value.position === 'inside' && targetComponent.children) {
        // Add as child
        store.addComponent(type as any, dropPreview.value.targetId);
      } else {
        // Add at root level
        store.addComponent(type as any);
      }
    } else {
      store.addComponent(type as any);
    }
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

  // Add mousedown listener for marquee selection
  if (canvasRef.value) {
    mouseDownHandler = (e: MouseEvent) => {
      if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
        startMarqueeSelection(e);
      }
    };
    canvasRef.value.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', endMarqueeSelection);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('mouseup', endMarqueeSelection);

  // Clean up canvas mousedown listener
  if (canvasRef.value && mouseDownHandler) {
    canvasRef.value.removeEventListener('mousedown', mouseDownHandler);
    mouseDownHandler = null;
  }
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
  align-items: center;
  justify-content: center;
  min-height: 600px;
  padding: 40px;
}

.empty-state-content {
  max-width: 600px;
  text-align: center;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px 0;
}

.start-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.option-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.option-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.template-option {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.option-icon {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #6b7280;
}

.template-option .option-icon {
  background: #ede9fe;
  color: #8b5cf6;
}

.option-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.option-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.recommended {
  position: absolute;
  top: -10px;
  right: 16px;
  background: #8b5cf6;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.drag-hint {
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
  transition: all 0.3s;
}

.drag-hint.active {
  background: #ede9fe;
  border-color: #8b5cf6;
}

.drag-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
}

.drag-hint.active .drag-area {
  color: #8b5cf6;
}

/* Highlight pulse animation */
:global(.highlight-pulse) {
  animation: highlightPulse 1s ease 3;
}

@keyframes highlightPulse {
  0%, 100% {
    box-shadow: none;
  }
  50% {
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.4);
  }
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

/* Snap Guides */
.snap-guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
}

.snap-guide {
  position: absolute;
  background: #6366F1;
  z-index: 1000;
  pointer-events: none;
}

.snap-guide.vertical {
  width: 1px;
  height: 100%;
  box-shadow: 0 0 4px rgba(99, 102, 241, 0.5);
}

.snap-guide.horizontal {
  width: 100%;
  height: 1px;
  box-shadow: 0 0 4px rgba(99, 102, 241, 0.5);
}

/* Drop Preview */
.drop-preview {
  position: absolute;
  pointer-events: none;
  z-index: 999;
  transform: translate(-50%, -50%);
}

.preview-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(99, 102, 241, 0.95);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  backdrop-filter: blur(8px);
  animation: dropPreviewPulse 1.5s ease-in-out infinite;
}

@keyframes dropPreviewPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

/* Marquee Selection */
.marquee-selection {
  position: absolute;
  border: 2px solid #6366F1;
  background: rgba(99, 102, 241, 0.1);
  pointer-events: none;
  z-index: 998;
  border-radius: 4px;
  transition: all 0.05s ease-out;
}

.marquee-selection::before {
  content: '';
  position: absolute;
  inset: -2px;
  border: 1px dashed #A5B4FC;
  border-radius: 4px;
  animation: marqueeRotate 20s linear infinite;
}

@keyframes marqueeRotate {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 100;
  }
}
</style>