<template>
  <teleport to="body">
    <transition name="slide">
      <div
        v-if="store.selectedComponent && showActions"
        class="quick-actions-bar"
        :style="barPosition"
      >
        <!-- Drag Handle -->
        <div class="drag-handle" @mousedown="startDrag">
          <GripVertical :size="14" />
        </div>

        <!-- Primary Actions -->
        <div class="action-group primary">
          <button
            @click="duplicateComponent"
            class="action-btn"
            title="Duplicate (Cmd+D)"
          >
            <Copy :size="16" />
            <span class="tooltip">Duplicate</span>
          </button>

          <button
            @click="deleteComponent"
            class="action-btn delete"
            title="Delete (Del)"
          >
            <Trash2 :size="16" />
            <span class="tooltip">Delete</span>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Positioning Actions -->
        <div class="action-group">
          <button
            @click="moveUp"
            class="action-btn"
            title="Move Up"
            :disabled="!canMoveUp"
          >
            <ArrowUp :size="16" />
            <span class="tooltip">Move Up</span>
          </button>

          <button
            @click="moveDown"
            class="action-btn"
            title="Move Down"
            :disabled="!canMoveDown"
          >
            <ArrowDown :size="16" />
            <span class="tooltip">Move Down</span>
          </button>

          <button
            @click="moveToTop"
            class="action-btn"
            title="Move to Top"
            :disabled="!canMoveUp"
          >
            <ChevronsUp :size="16" />
            <span class="tooltip">To Top</span>
          </button>

          <button
            @click="moveToBottom"
            class="action-btn"
            title="Move to Bottom"
            :disabled="!canMoveDown"
          >
            <ChevronsDown :size="16" />
            <span class="tooltip">To Bottom</span>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Layout Actions -->
        <div class="action-group">
          <button
            @click="alignLeft"
            class="action-btn"
            title="Align Left"
          >
            <AlignLeft :size="16" />
            <span class="tooltip">Align Left</span>
          </button>

          <button
            @click="alignCenter"
            class="action-btn"
            title="Align Center"
          >
            <AlignCenter :size="16" />
            <span class="tooltip">Center</span>
          </button>

          <button
            @click="alignRight"
            class="action-btn"
            title="Align Right"
          >
            <AlignRight :size="16" />
            <span class="tooltip">Align Right</span>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Visibility Actions -->
        <div class="action-group">
          <button
            @click="toggleVisibility"
            class="action-btn"
            :title="isHidden ? 'Show' : 'Hide'"
          >
            <component :is="isHidden ? EyeOff : Eye" :size="16" />
            <span class="tooltip">{{ isHidden ? 'Show' : 'Hide' }}</span>
          </button>

          <button
            @click="lockComponent"
            class="action-btn"
            :title="isLocked ? 'Unlock' : 'Lock'"
            :class="{ active: isLocked }"
          >
            <component :is="isLocked ? Lock : Unlock" :size="16" />
            <span class="tooltip">{{ isLocked ? 'Unlock' : 'Lock' }}</span>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Quick Styles -->
        <div class="action-group">
          <button
            @click="openStylePanel"
            class="action-btn"
            title="Quick Styles"
          >
            <Palette :size="16" />
            <span class="tooltip">Styles</span>
          </button>

          <button
            @click="openAnimationPanel"
            class="action-btn"
            title="Animations"
          >
            <Sparkles :size="16" />
            <span class="tooltip">Animate</span>
          </button>

          <button
            @click="convertToTemplate"
            class="action-btn"
            title="Save as Template"
          >
            <Save :size="16" />
            <span class="tooltip">Save Template</span>
          </button>
        </div>

        <!-- Close Button -->
        <button
          @click="closeBar"
          class="close-btn"
          title="Close"
        >
          <X :size="14" />
        </button>
      </div>
    </transition>

    <!-- Context Menu (Right Click) -->
    <transition name="fade">
      <div
        v-if="showContextMenu"
        class="context-menu"
        :style="contextMenuPosition"
        @click="hideContextMenu"
      >
        <div class="context-item" @click="duplicateComponent">
          <Copy :size="14" />
          <span>Duplicate</span>
          <span class="shortcut">Cmd+D</span>
        </div>
        <div class="context-item" @click="copyStyles">
          <Clipboard :size="14" />
          <span>Copy Styles</span>
          <span class="shortcut">Cmd+C</span>
        </div>
        <div class="context-item" @click="pasteStyles">
          <ClipboardPaste :size="14" />
          <span>Paste Styles</span>
          <span class="shortcut">Cmd+V</span>
        </div>
        <div class="context-divider"></div>
        <div class="context-item" @click="moveUp">
          <ArrowUp :size="14" />
          <span>Move Up</span>
        </div>
        <div class="context-item" @click="moveDown">
          <ArrowDown :size="14" />
          <span>Move Down</span>
        </div>
        <div class="context-divider"></div>
        <div class="context-item delete" @click="deleteComponent">
          <Trash2 :size="14" />
          <span>Delete</span>
          <span class="shortcut">Del</span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Palette,
  Sparkles,
  Save,
  X,
  GripVertical,
  Clipboard,
  ClipboardPaste
} from 'lucide-vue-next';

const store = useEditorStore();
const { showToast } = useToast();

// State
const showActions = ref(true);
const showContextMenu = ref(false);
const barPosition = ref({ top: '100px', left: '50%' });
const contextMenuPosition = ref({ top: '0px', left: '0px' });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const isHidden = ref(false);
const isLocked = ref(false);
const copiedStyles = ref<any>(null);

// Computed
const canMoveUp = computed(() => {
  if (!store.selectedComponent) return false;
  const index = store.components.indexOf(store.selectedComponent);
  return index > 0;
});

const canMoveDown = computed(() => {
  if (!store.selectedComponent) return false;
  const index = store.components.indexOf(store.selectedComponent);
  return index < store.components.length - 1;
});

// Methods
function duplicateComponent() {
  if (store.selectedComponent) {
    store.duplicateComponent(store.selectedComponent.id);
    showToast('Component duplicated', 'success');
  }
}

function deleteComponent() {
  if (store.selectedComponent) {
    const name = store.selectedComponent.type;
    store.deleteComponent(store.selectedComponent.id);
    showToast(`${name} deleted`, 'success');
  }
}

function moveUp() {
  if (store.selectedComponent && canMoveUp.value) {
    const index = store.components.indexOf(store.selectedComponent);
    store.moveComponent(store.selectedComponent.id, index - 1);
    showToast('Moved up', 'success');
  }
}

function moveDown() {
  if (store.selectedComponent && canMoveDown.value) {
    const index = store.components.indexOf(store.selectedComponent);
    store.moveComponent(store.selectedComponent.id, index + 1);
    showToast('Moved down', 'success');
  }
}

function moveToTop() {
  if (store.selectedComponent && canMoveUp.value) {
    store.moveComponent(store.selectedComponent.id, 0);
    showToast('Moved to top', 'success');
  }
}

function moveToBottom() {
  if (store.selectedComponent && canMoveDown.value) {
    store.moveComponent(store.selectedComponent.id, store.components.length - 1);
    showToast('Moved to bottom', 'success');
  }
}

function alignLeft() {
  if (store.selectedComponent) {
    store.updateComponentStyle(store.selectedComponent.id, 'textAlign', 'left');
    store.updateComponentStyle(store.selectedComponent.id, 'marginLeft', '0');
    store.updateComponentStyle(store.selectedComponent.id, 'marginRight', 'auto');
    showToast('Aligned left', 'success');
  }
}

function alignCenter() {
  if (store.selectedComponent) {
    store.updateComponentStyle(store.selectedComponent.id, 'textAlign', 'center');
    store.updateComponentStyle(store.selectedComponent.id, 'marginLeft', 'auto');
    store.updateComponentStyle(store.selectedComponent.id, 'marginRight', 'auto');
    showToast('Centered', 'success');
  }
}

function alignRight() {
  if (store.selectedComponent) {
    store.updateComponentStyle(store.selectedComponent.id, 'textAlign', 'right');
    store.updateComponentStyle(store.selectedComponent.id, 'marginLeft', 'auto');
    store.updateComponentStyle(store.selectedComponent.id, 'marginRight', '0');
    showToast('Aligned right', 'success');
  }
}

function toggleVisibility() {
  if (store.selectedComponent) {
    isHidden.value = !isHidden.value;
    const display = isHidden.value ? 'none' : 'block';
    store.updateComponentStyle(store.selectedComponent.id, 'display', display);
    showToast(isHidden.value ? 'Hidden' : 'Visible', 'success');
  }
}

function lockComponent() {
  if (store.selectedComponent) {
    isLocked.value = !isLocked.value;
    // Store lock state in component metadata
    store.updateComponent(store.selectedComponent.id, {
      ...store.selectedComponent,
      locked: isLocked.value
    });
    showToast(isLocked.value ? 'Locked' : 'Unlocked', 'success');
  }
}

function openStylePanel() {
  // Emit event to open style panel
  showToast('Opening style panel', 'info');
}

function openAnimationPanel() {
  // Emit event to open animation panel
  showToast('Opening animation panel', 'info');
}

function convertToTemplate() {
  if (store.selectedComponent) {
    // Save component as reusable template
    const template = JSON.stringify(store.selectedComponent);
    localStorage.setItem(`template_${Date.now()}`, template);
    showToast('Saved as template', 'success');
  }
}

function closeBar() {
  showActions.value = false;
}

// Dragging
function startDrag(e: MouseEvent) {
  isDragging.value = true;
  const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
  if (rect) {
    dragOffset.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e: MouseEvent) {
  if (isDragging.value) {
    barPosition.value = {
      top: `${e.clientY - dragOffset.value.y}px`,
      left: `${e.clientX - dragOffset.value.x}px`
    };
  }
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

// Context menu
function showContextMenuAt(e: MouseEvent) {
  e.preventDefault();
  contextMenuPosition.value = {
    top: `${e.clientY}px`,
    left: `${e.clientX}px`
  };
  showContextMenu.value = true;
}

function hideContextMenu() {
  showContextMenu.value = false;
}

function copyStyles() {
  if (store.selectedComponent) {
    copiedStyles.value = store.selectedComponent.props.style;
    showToast('Styles copied', 'success');
  }
  hideContextMenu();
}

function pasteStyles() {
  if (store.selectedComponent && copiedStyles.value) {
    store.updateComponent(store.selectedComponent.id, {
      ...store.selectedComponent,
      props: {
        ...store.selectedComponent.props,
        style: { ...copiedStyles.value }
      }
    });
    showToast('Styles pasted', 'success');
  }
  hideContextMenu();
}

// Keyboard shortcuts
function handleKeyboard(e: KeyboardEvent) {
  if (!store.selectedComponent) return;

  if (e.metaKey || e.ctrlKey) {
    switch (e.key) {
      case 'd':
        e.preventDefault();
        duplicateComponent();
        break;
      case 'c':
        e.preventDefault();
        copyStyles();
        break;
      case 'v':
        e.preventDefault();
        pasteStyles();
        break;
    }
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault();
    deleteComponent();
  } else if (e.altKey) {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveDown();
        break;
    }
  }
}

// Watch for component changes
watch(() => store.selectedComponent, (component) => {
  if (component) {
    showActions.value = true;
    isHidden.value = component.props?.style?.display === 'none';
    isLocked.value = component.locked || false;
  } else {
    showActions.value = false;
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleKeyboard);
  document.addEventListener('contextmenu', showContextMenuAt);
  document.addEventListener('click', hideContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard);
  document.removeEventListener('contextmenu', showContextMenuAt);
  document.removeEventListener('click', hideContextMenu);
});
</script>

<style scoped>
.quick-actions-bar {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9998;
  transform: translateX(-50%);
  user-select: none;
}

.drag-handle {
  display: flex;
  align-items: center;
  padding: 4px;
  color: #9ca3af;
  cursor: move;
}

.drag-handle:hover {
  color: #6b7280;
}

.action-group {
  display: flex;
  gap: 2px;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.active {
  background: #5b21b6;
  color: white;
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: #1f2937;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.action-btn:hover .tooltip {
  opacity: 1;
}

.divider {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 4px;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 200px;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.context-item:hover {
  background: #f3f4f6;
}

.context-item.delete {
  color: #dc2626;
}

.context-item.delete:hover {
  background: #fee2e2;
}

.shortcut {
  margin-left: auto;
  font-size: 11px;
  color: #9ca3af;
}

.context-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>