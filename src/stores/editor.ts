import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { nanoid } from 'nanoid';
import type { Component, ComponentType } from '@/types/component';
import type { Asset } from '@/types/asset';
import { componentDefinitions } from '@/config/components';
import { safeStringify, safeParse, safeClone } from '@/utils/safeSerialize';

interface HistoryState {
  past: Component[][];
  future: Component[][];
  maxSize: number;
}

export const useEditorStore = defineStore('editor', () => {
  // Project state
  const projectId = ref(nanoid());
  const projectName = ref('Untitled Project');
  const components = ref<Component[]>([]);
  
  // Editor state
  const selectedId = ref<string | null>(null);
  const hoveredId = ref<string | null>(null);
  const isDragging = ref(false);
  const draggedType = ref<ComponentType | null>(null);
  const viewport = ref<'mobile' | 'tablet' | 'desktop'>('desktop');
  const zoom = ref(1);
  const showCode = ref(false);
  const showGrid = ref(true);
  
  // Asset management
  const showAssetManager = ref(false);
  const assets = ref<Asset[]>([]);
  
  // Global custom code
  const globalCustomCode = ref({
    css: '',
    javascript: '',
    headHTML: ''
  });
  
  // History for undo/redo
  const history = ref<HistoryState>({
    past: [],
    future: [],
    maxSize: 50
  });
  
  // Computed
  const selectedComponent = computed(() => 
    findComponentById(components.value, selectedId.value)
  );
  
  const canUndo = computed(() => history.value.past.length > 0);
  const canRedo = computed(() => history.value.future.length > 0);
  
  // Helper functions
  function findComponentById(comps: Component[], id: string | null): Component | null {
    if (!id) return null;
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponentById(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  
  function saveHistory() {
    const state = safeClone(components.value);
    history.value.past.push(state);
    if (history.value.past.length > history.value.maxSize) {
      history.value.past.shift();
    }
    history.value.future = [];
  }
  
  // Actions
  function addComponent(type: ComponentType, parentId?: string, index?: number) {
    saveHistory();
    
    const definition = componentDefinitions[type];
    const newComponent: Component = {
      id: nanoid(8),
      type,
      displayName: definition.displayName,
      props: { ...definition.defaultProps },
      styles: safeClone(definition.defaultStyles),
      children: definition.acceptsChildren ? [] : undefined
    };
    
    if (parentId) {
      const parent = findComponentById(components.value, parentId);
      if (parent && parent.children) {
        if (index !== undefined) {
          parent.children.splice(index, 0, newComponent);
        } else {
          parent.children.push(newComponent);
        }
        newComponent.parent = parentId;
      }
    } else {
      if (index !== undefined) {
        components.value.splice(index, 0, newComponent);
      } else {
        components.value.push(newComponent);
      }
    }
    
    selectedId.value = newComponent.id;
    return newComponent;
  }
  
  function updateComponent(id: string, updates: Partial<Component>) {
    saveHistory();
    const component = findComponentById(components.value, id);
    if (component) {
      Object.assign(component, updates);
    }
  }
  
  function deleteComponent(id: string) {
    saveHistory();
    
    function removeFromArray(comps: Component[]): boolean {
      const index = comps.findIndex(c => c.id === id);
      if (index !== -1) {
        comps.splice(index, 1);
        return true;
      }
      for (const comp of comps) {
        if (comp.children && removeFromArray(comp.children)) {
          return true;
        }
      }
      return false;
    }
    
    removeFromArray(components.value);
    if (selectedId.value === id) {
      selectedId.value = null;
    }
  }
  
  function moveComponent(componentId: string, targetParentId: string | null, targetIndex: number) {
    saveHistory();
    
    // Find and remove component from current position
    let component: Component | null = null;
    
    function extractComponent(comps: Component[]): Component | null {
      const index = comps.findIndex(c => c.id === componentId);
      if (index !== -1) {
        const [extracted] = comps.splice(index, 1);
        return extracted;
      }
      for (const comp of comps) {
        if (comp.children) {
          const found = extractComponent(comp.children);
          if (found) return found;
        }
      }
      return null;
    }
    
    component = extractComponent(components.value);
    if (!component) return;
    
    // Add to new position
    if (targetParentId) {
      const parent = findComponentById(components.value, targetParentId);
      if (parent && parent.children) {
        parent.children.splice(targetIndex, 0, component);
        component.parent = targetParentId;
      }
    } else {
      components.value.splice(targetIndex, 0, component);
      component.parent = undefined;
    }
  }
  
  function duplicateComponent(id: string) {
    saveHistory();
    const component = findComponentById(components.value, id);
    if (!component) return;
    
    const duplicate = safeClone(component);
    duplicate.id = nanoid(8);
    
    // Regenerate IDs for all children
    function regenerateIds(comp: Component) {
      comp.id = nanoid(8);
      if (comp.children) {
        comp.children.forEach(regenerateIds);
      }
    }
    regenerateIds(duplicate);
    
    // Insert after original
    if (component.parent) {
      const parent = findComponentById(components.value, component.parent);
      if (parent && parent.children) {
        const index = parent.children.findIndex(c => c.id === id);
        parent.children.splice(index + 1, 0, duplicate);
      }
    } else {
      const index = components.value.findIndex(c => c.id === id);
      components.value.splice(index + 1, 0, duplicate);
    }
    
    selectedId.value = duplicate.id;
  }
  
  function undo() {
    if (!canUndo.value) return;
    const state = history.value.past.pop()!;
    history.value.future.push(safeClone(components.value));
    components.value = state;
    selectedId.value = null;
  }
  
  function redo() {
    if (!canRedo.value) return;
    const state = history.value.future.pop()!;
    history.value.past.push(safeClone(components.value));
    components.value = state;
    selectedId.value = null;
  }
  
  function clearProject() {
    saveHistory();
    components.value = [];
    selectedId.value = null;
    projectName.value = 'Untitled Project';
    projectId.value = nanoid();
  }
  
  function setViewport(vp: 'mobile' | 'tablet' | 'desktop') {
    viewport.value = vp;
  }
  
  function setZoom(z: number) {
    zoom.value = Math.max(0.25, Math.min(2, z));
  }
  
  // Asset management actions
  function addAsset(asset: Asset) {
    const exists = assets.value.some(a => a.id === asset.id);
    if (!exists) {
      assets.value.push(asset);
    }
  }
  
  function toggleAssetManager() {
    showAssetManager.value = !showAssetManager.value;
  }
  
  // Style management
  function updateComponentStyle(id: string, property: string, value: string | number, breakpoint: string = 'base') {
    saveHistory();
    const component = findComponentById(components.value, id);
    if (component) {
      if (!component.styles[breakpoint]) {
        component.styles[breakpoint] = {};
      }
      component.styles[breakpoint][property] = value;
    }
  }
  
  function updateMultipleStyles(id: string, styles: Record<string, string | number>, breakpoint: string = 'base') {
    saveHistory();
    const component = findComponentById(components.value, id);
    if (component) {
      if (!component.styles[breakpoint]) {
        component.styles[breakpoint] = {};
      }
      Object.assign(component.styles[breakpoint], styles);
    }
  }
  
  // Animation management
  function addAnimation(componentId: string, animation: any) {
    const component = findComponentById(components.value, componentId);
    if (component) {
      if (!component.props.animations) {
        component.props.animations = [];
      }
      component.props.animations.push(animation);
    }
  }
  
  function updateAnimation(componentId: string, animation: any) {
    const component = findComponentById(components.value, componentId);
    if (component && component.props.animations) {
      const index = component.props.animations.findIndex(a => a.id === animation.id);
      if (index !== -1) {
        component.props.animations[index] = animation;
      }
    }
  }
  
  function removeAnimation(componentId: string, animationId: string) {
    const component = findComponentById(components.value, componentId);
    if (component && component.props.animations) {
      component.props.animations = component.props.animations.filter(a => a.id !== animationId);
    }
  }
  
  return {
    // State
    projectId,
    projectName,
    components,
    selectedId,
    hoveredId,
    isDragging,
    draggedType,
    viewport,
    zoom,
    showCode,
    showGrid,
    showAssetManager,
    assets,
    globalCustomCode,
    
    // Computed
    selectedComponent,
    canUndo,
    canRedo,
    
    // Actions
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    duplicateComponent,
    undo,
    redo,
    clearProject,
    setViewport,
    setZoom,
    addAsset,
    toggleAssetManager,
    updateComponentStyle,
    updateMultipleStyles,
    addAnimation,
    updateAnimation,
    removeAnimation
  };
});