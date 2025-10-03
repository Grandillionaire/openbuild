<template>
  <div class="layers-panel">
    <div class="layers-header">
      <div class="header-title">
        <Layers :size="18" />
        <h3>Layers</h3>
      </div>
      <div class="header-actions">
        <button @click="collapseAll" class="action-btn" title="Collapse All">
          <ChevronsUp :size="16" />
        </button>
        <button @click="expandAll" class="action-btn" title="Expand All">
          <ChevronsDown :size="16" />
        </button>
      </div>
    </div>

    <div class="layers-search">
      <Search :size="16" />
      <input
        v-model="searchQuery"
        placeholder="Search layers..."
        @input="filterLayers"
      />
    </div>

    <div class="layers-content">
      <div v-if="components.length === 0" class="empty-state">
        <Box :size="32" />
        <p>No components yet</p>
        <span class="hint">Add components to see them here</span>
      </div>

      <div v-else class="layer-tree">
        <LayerTreeItem
          v-for="component in filteredComponents"
          :key="component.id"
          :component="component"
          :depth="0"
          :selectedIds="selectedIds"
          :expandedIds="expandedIds"
          :searchQuery="searchQuery"
          @select="handleSelect"
          @toggle="toggleExpand"
          @toggle-visibility="toggleVisibility"
          @toggle-lock="toggleLock"
          @delete="deleteComponent"
          @duplicate="duplicateComponent"
        />
      </div>
    </div>

    <!-- Selection info footer -->
    <div v-if="selectedIds.size > 0" class="layers-footer">
      <span class="selection-count">
        {{ selectedIds.size }} {{ selectedIds.size === 1 ? 'component' : 'components' }} selected
      </span>
      <div class="footer-actions">
        <button @click="deleteSelected" class="footer-btn delete" title="Delete Selected">
          <Trash2 :size="14" />
        </button>
        <button v-if="selectedIds.size === 1" @click="duplicateSelected" class="footer-btn" title="Duplicate">
          <Copy :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEditorStore } from '@/stores/editor';
import type { Component } from '@/types/component';
import {
  Layers,
  Search,
  ChevronsUp,
  ChevronsDown,
  Box,
  Trash2,
  Copy
} from 'lucide-vue-next';
import LayerTreeItem from './LayerTreeItem.vue';

const store = useEditorStore();
const searchQuery = ref('');
const expandedIds = ref<Set<string>>(new Set());

const components = computed(() => store.components);
const selectedIds = computed(() => store.selectedIds);

const filteredComponents = computed(() => {
  if (!searchQuery.value) return components.value;

  const query = searchQuery.value.toLowerCase();

  function filterComponent(comp: Component): Component | null {
    const matches = (comp.displayName || comp.type || '').toLowerCase().includes(query);

    let filteredChildren: Component[] = [];
    if (comp.children) {
      filteredChildren = comp.children
        .map(filterComponent)
        .filter(Boolean) as Component[];
    }

    if (matches || filteredChildren.length > 0) {
      return {
        ...comp,
        children: filteredChildren.length > 0 ? filteredChildren : comp.children
      };
    }

    return null;
  }

  return components.value
    .map(filterComponent)
    .filter(Boolean) as Component[];
});

function handleSelect(id: string, event: MouseEvent) {
  if (event.shiftKey) {
    store.toggleComponentSelection(id, true);
  } else if (event.metaKey || event.ctrlKey) {
    store.toggleComponentSelection(id, true);
  } else {
    store.selectedId = id;
    store.selectedIds.clear();
    store.selectedIds.add(id);
  }
}

function toggleExpand(id: string) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
}

function toggleVisibility(id: string) {
  const component = store.components.find(c => c.id === id);
  if (component) {
    // Toggle visibility class
    const className = component.props.className || '';
    const hasHidden = className.includes('hidden');

    if (hasHidden) {
      component.props.className = className.replace(/\bhidden\b/g, '').trim();
    } else {
      component.props.className = `${className} hidden`.trim();
    }
  }
}

function toggleLock(id: string) {
  const component = store.components.find(c => c.id === id);
  if (component) {
    component.locked = !component.locked;
  }
}

function deleteComponent(id: string) {
  if (confirm('Delete this component?')) {
    store.deleteComponent(id);
  }
}

function duplicateComponent(id: string) {
  store.duplicateComponent(id);
}

function deleteSelected() {
  if (confirm(`Delete ${selectedIds.value.size} selected components?`)) {
    store.deleteMultipleComponents(Array.from(selectedIds.value));
  }
}

function duplicateSelected() {
  const id = Array.from(selectedIds.value)[0];
  if (id) {
    store.duplicateComponent(id);
  }
}

function collapseAll() {
  expandedIds.value.clear();
}

function expandAll() {
  function addAllIds(comps: Component[]) {
    comps.forEach(comp => {
      if (comp.children && comp.children.length > 0) {
        expandedIds.value.add(comp.id);
        addAllIds(comp.children);
      }
    });
  }
  addAllIds(components.value);
}

function filterLayers() {
  if (searchQuery.value) {
    expandAll();
  }
}
</script>

<style scoped>
.layers-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.layers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 6px;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6B7280;
}

.action-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.layers-search {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #E5E7EB;
  background: #F9FAFB;
  gap: 8px;
  color: #9CA3AF;
}

.layers-search input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  color: #1F2937;
}

.layers-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9CA3AF;
}

.empty-state p {
  margin: 12px 0 4px;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.hint {
  font-size: 12px;
  color: #9CA3AF;
}

.layer-tree {
  display: flex;
  flex-direction: column;
}

.layers-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.selection-count {
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
}

.footer-actions {
  display: flex;
  gap: 6px;
}

.footer-btn {
  padding: 6px 10px;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-btn:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}

.footer-btn.delete:hover {
  background: #FEF2F2;
  border-color: #EF4444;
  color: #EF4444;
}
</style>
