<template>
  <div class="layer-item-wrapper">
    <div
      :class="['layer-item', {
        'is-selected': isSelected,
        'is-locked': component.locked,
        'has-children': hasChildren
      }]"
      :style="{ paddingLeft: depth * 16 + 12 + 'px' }"
      @click="$emit('select', component.id, $event)"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Expand toggle -->
      <button
        v-if="hasChildren"
        @click.stop="$emit('toggle', component.id)"
        class="expand-btn"
      >
        <ChevronRight :size="14" :class="{ rotated: isExpanded }" />
      </button>
      <div v-else class="expand-spacer"></div>

      <!-- Component icon -->
      <div class="component-icon">
        <component :is="getIcon(component.type)" :size="14" />
      </div>

      <!-- Component name -->
      <div class="component-name">
        <span class="name-text">{{ component.displayName || component.type }}</span>
        <span v-if="component.children?.length" class="child-count">
          {{ component.children.length }}
        </span>
      </div>

      <!-- Actions -->
      <div class="layer-actions">
        <button
          @click.stop="emit('toggleVisibility', component.id)"
          class="action-icon"
          :title="isVisible ? 'Hide' : 'Show'"
        >
          <component :is="isVisible ? Eye : EyeOff" :size="14" />
        </button>
        <button
          @click.stop="emit('toggleLock', component.id)"
          class="action-icon"
          :title="component.locked ? 'Unlock' : 'Lock'"
        >
          <component :is="component.locked ? Lock : Unlock" :size="14" />
        </button>
        <button
          @click.stop="showContextMenu"
          class="action-icon"
          title="More options"
        >
          <MoreVertical :size="14" />
        </button>
      </div>
    </div>

    <!-- Context menu -->
    <teleport to="body">
      <div
        v-if="contextMenuOpen"
        class="context-menu"
        :style="{ left: contextMenuPos.x + 'px', top: contextMenuPos.y + 'px' }"
        @click.stop
      >
        <button @click="handleDuplicate" class="menu-item">
          <Copy :size="14" />
          <span>Duplicate</span>
        </button>
        <button @click="handleDelete" class="menu-item delete">
          <Trash2 :size="14" />
          <span>Delete</span>
        </button>
      </div>
    </teleport>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" class="layer-children">
      <LayerTreeItem
        v-for="child in component.children"
        :key="child.id"
        :component="child"
        :depth="depth + 1"
        :selectedIds="selectedIds"
        :expandedIds="expandedIds"
        :searchQuery="searchQuery"
        @select="(id: string, event: MouseEvent) => emit('select', id, event)"
        @toggle="(id: string) => emit('toggle', id)"
        @toggle-visibility="(id: string) => emit('toggleVisibility', id)"
        @toggle-lock="(id: string) => emit('toggleLock', id)"
        @delete="(id: string) => emit('delete', id)"
        @duplicate="(id: string) => emit('duplicate', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { Component } from '@/types/component';
import {
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreVertical,
  Copy,
  Trash2,
  Box,
  Layout,
  Type,
  Image as ImageIcon,
  Grid3x3,
  Columns,
  Minus
} from 'lucide-vue-next';

interface Props {
  component: Component;
  depth: number;
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  searchQuery: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [id: string, event: MouseEvent];
  toggle: [id: string];
  toggleVisibility: [id: string];
  toggleLock: [id: string];
  delete: [id: string];
  duplicate: [id: string];
}>();

const contextMenuOpen = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });

const isSelected = computed(() => props.selectedIds.has(props.component.id));
const isExpanded = computed(() => props.expandedIds.has(props.component.id));
const hasChildren = computed(() => props.component.children && props.component.children.length > 0);
const isVisible = computed(() => {
  const className = props.component.props.className || '';
  return !className.includes('hidden');
});

function getIcon(type: string) {
  const icons: Record<string, any> = {
    container: Box,
    section: Layout,
    div: Box,
    grid: Grid3x3,
    flex: Columns,
    heading: Type,
    text: Type,
    image: ImageIcon,
    spacer: Minus
  };
  return icons[type] || Box;
}

function handleMouseEnter() {
  // Can be used to highlight component on canvas
}

function handleMouseLeave() {
  // Can be used to remove highlight from canvas
}

function showContextMenu(e: MouseEvent) {
  contextMenuPos.value = { x: e.clientX, y: e.clientY };
  contextMenuOpen.value = true;
}

function closeContextMenu() {
  contextMenuOpen.value = false;
}

function handleDuplicate() {
  emit('duplicate', props.component.id);
  closeContextMenu();
}

function handleDelete() {
  emit('delete', props.component.id);
  closeContextMenu();
}

onMounted(() => {
  document.addEventListener('click', closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu);
});
</script>

<style scoped>
.layer-item-wrapper {
  margin-bottom: 1px;
}

.layer-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
  gap: 6px;
  position: relative;
}

.layer-item:hover {
  background: #F3F4F6;
}

.layer-item.is-selected {
  background: #EEF2FF;
  border-left: 3px solid #6366F1;
}

.layer-item.is-locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9CA3AF;
  flex-shrink: 0;
}

.expand-btn svg {
  transition: transform 0.2s;
}

.expand-btn svg.rotated {
  transform: rotate(90deg);
}

.expand-spacer {
  width: 16px;
  flex-shrink: 0;
}

.component-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #F9FAFB;
  border-radius: 4px;
  color: #6B7280;
  flex-shrink: 0;
}

.layer-item.is-selected .component-icon {
  background: #E0E7FF;
  color: #6366F1;
}

.component-name {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.name-text {
  font-size: 13px;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.child-count {
  font-size: 10px;
  padding: 2px 5px;
  background: #F3F4F6;
  border-radius: 10px;
  color: #9CA3AF;
  font-weight: 500;
}

.layer-item.is-selected .child-count {
  background: #C7D2FE;
  color: #6366F1;
}

.layer-actions {
  display: none;
  align-items: center;
  gap: 2px;
}

.layer-item:hover .layer-actions {
  display: flex;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #9CA3AF;
  transition: all 0.15s;
}

.action-icon:hover {
  background: #E5E7EB;
  color: #1F2937;
}

.layer-children {
  position: relative;
}

.layer-children::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #E5E7EB;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 4px;
  z-index: 10000;
  min-width: 160px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #1F2937;
  transition: all 0.15s;
  text-align: left;
}

.menu-item:hover {
  background: #F3F4F6;
}

.menu-item.delete {
  color: #EF4444;
}

.menu-item.delete:hover {
  background: #FEF2F2;
}
</style>
