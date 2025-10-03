import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { nanoid } from 'nanoid';
import type { Component, ComponentType, ResponsiveStyles } from '@/types/component';
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
  const selectedIds = ref<Set<string>>(new Set()); // Multi-select support
  const hoveredId = ref<string | null>(null);
  const isDragging = ref(false);
  const draggedType = ref<ComponentType | null>(null);
  const viewport = ref<'mobile' | 'tablet' | 'desktop'>('desktop');
  const zoom = ref(1);
  const showCode = ref(false);
  const showGrid = ref(true);
  const showSnapGuides = ref(true);

  // Advanced drag-drop state
  const dropPreview = ref<{
    targetId: string | null;
    position: 'before' | 'after' | 'inside' | null;
    coords: { x: number; y: number } | null;
  }>({
    targetId: null,
    position: null,
    coords: null
  });

  // Clipboard for style copy/paste
  const copiedStyles = ref<ResponsiveStyles | null>(null);

  // Snap guides
  const snapGuides = ref<{
    vertical: number[];
    horizontal: number[];
  }>({
    vertical: [],
    horizontal: []
  });

  // Responsive editing mode
  const responsiveMode = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
  const deviceVisibility = ref<Record<string, {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  }>>({});
  
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

    // Add defensive checks
    if (!definition) {
      console.error(`Component definition not found for type: ${type}`);
      return;
    }

    // Ensure displayName exists
    if (!definition.displayName) {
      console.warn(`Missing displayName for component type: ${type}, using type as fallback`);
      definition.displayName = type;
    }

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

  // Responsive mode functions
  function setResponsiveMode(mode: 'desktop' | 'tablet' | 'mobile') {
    responsiveMode.value = mode;
    viewport.value = mode;
  }

  function toggleDeviceVisibility(componentId: string, device: 'desktop' | 'tablet' | 'mobile') {
    if (!deviceVisibility.value[componentId]) {
      deviceVisibility.value[componentId] = {
        desktop: true,
        tablet: true,
        mobile: true
      };
    }
    deviceVisibility.value[componentId][device] = !deviceVisibility.value[componentId][device];

    // Update component with visibility classes
    const component = findComponentById(components.value, componentId);
    if (component) {
      if (!component.props.className) {
        component.props.className = '';
      }

      // Remove old visibility classes
      component.props.className = component.props.className
        .replace(/\bhide-on-(desktop|tablet|mobile)\b/g, '')
        .trim();

      // Add new visibility classes
      const hideClasses = [];
      if (!deviceVisibility.value[componentId].desktop) hideClasses.push('hide-on-desktop');
      if (!deviceVisibility.value[componentId].tablet) hideClasses.push('hide-on-tablet');
      if (!deviceVisibility.value[componentId].mobile) hideClasses.push('hide-on-mobile');

      if (hideClasses.length > 0) {
        component.props.className = `${component.props.className} ${hideClasses.join(' ')}`.trim();
      }
    }
  }

  function getDeviceVisibility(componentId: string) {
    return deviceVisibility.value[componentId] || {
      desktop: true,
      tablet: true,
      mobile: true
    };
  }

  // Add section components (pre-built templates)
  function addSectionComponents(sectionComponents: Component[]) {
    saveHistory();

    // Deep clone the components to avoid reference issues
    const clonedComponents = JSON.parse(JSON.stringify(sectionComponents));

    // Function to ensure ALL components in tree have required properties
    function processComponent(comp: any): void {
      // Generate new ID
      comp.id = nanoid(8);

      // Ensure displayName exists for EVERY component
      if (!comp.displayName) {
        const definition = componentDefinitions[comp.type];
        if (definition && definition.displayName) {
          comp.displayName = definition.displayName;
        } else {
          // Fallback to type name with proper formatting
          comp.displayName = comp.type ?
            comp.type.charAt(0).toUpperCase() + comp.type.slice(1) :
            'Component';
        }
      }

      // Normalize props - convert 'text' to 'content' for consistency
      if (comp.props) {
        if (comp.props.text && !comp.props.content) {
          comp.props.content = comp.props.text;
          // Keep text for backward compatibility
        }

        // Normalize image src - ensure it's in both places for compatibility
        if (comp.type === 'image' && comp.props.src) {
          if (!comp.props.attributes) {
            comp.props.attributes = {};
          }
          if (!comp.props.attributes.src) {
            comp.props.attributes.src = comp.props.src;
          }
        }
      }

      // Ensure styles structure exists
      if (!comp.styles) {
        comp.styles = comp.props?.style ? { base: comp.props.style } : { base: {} };
        // Remove style from props after moving to styles
        if (comp.props?.style) {
          delete comp.props.style;
        }
      }

      // Process all children recursively
      if (comp.children && Array.isArray(comp.children)) {
        comp.children.forEach(processComponent);
      }
    }

    // Process each component and its entire tree
    clonedComponents.forEach((component: any) => {
      processComponent(component);
      // Add to canvas
      components.value.push(component);
    });

    // Select the first component if any were added
    if (clonedComponents.length > 0) {
      selectedId.value = clonedComponents[0].id;
    }
  }

  // Add a pre-built component object directly
  function addComponentDirect(component: Component): Component {
    saveHistory();

    // Deep clone to avoid reference issues
    const clonedComponent = JSON.parse(JSON.stringify(component));

    // Function to ensure ALL components in tree have required properties
    function processComponent(comp: any): void {
      // Generate new ID
      comp.id = nanoid(8);

      // Ensure displayName exists for EVERY component
      if (!comp.displayName) {
        const definition = componentDefinitions[comp.type];
        if (definition && definition.displayName) {
          comp.displayName = definition.displayName;
        } else {
          // Fallback to type name with proper formatting
          comp.displayName = comp.type ?
            comp.type.charAt(0).toUpperCase() + comp.type.slice(1) :
            'Component';
        }
      }

      // Normalize props - convert 'text' to 'content' for consistency
      if (comp.props) {
        if (comp.props.text && !comp.props.content) {
          comp.props.content = comp.props.text;
          // Keep text for backward compatibility
        }

        // Normalize image src - ensure it's in both places for compatibility
        if (comp.type === 'image' && comp.props.src) {
          if (!comp.props.attributes) {
            comp.props.attributes = {};
          }
          if (!comp.props.attributes.src) {
            comp.props.attributes.src = comp.props.src;
          }
        }
      }

      // Ensure styles structure exists
      if (!comp.styles) {
        comp.styles = comp.props?.style ? { base: comp.props.style } : { base: {} };
        // Remove style from props after moving to styles
        if (comp.props?.style) {
          delete comp.props.style;
        }
      }

      // Process all children recursively
      if (comp.children && Array.isArray(comp.children)) {
        comp.children.forEach(processComponent);
      }
    }

    // Process the component and its entire tree
    processComponent(clonedComponent);

    // Add to canvas
    components.value.push(clonedComponent);
    selectedId.value = clonedComponent.id;

    return clonedComponent;
  }

  // Multi-select functions
  function toggleComponentSelection(id: string, addToSelection: boolean = false) {
    if (addToSelection) {
      const newSet = new Set(selectedIds.value);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      selectedIds.value = newSet;
    } else {
      selectedIds.value = new Set([id]);
      selectedId.value = id;
    }
  }

  function selectMultipleComponents(ids: string[]) {
    selectedIds.value = new Set(ids);
    selectedId.value = ids[0] || null;
  }

  function clearSelection() {
    selectedIds.value = new Set();
    selectedId.value = null;
  }

  // Style copy/paste functions
  function copyComponentStyles(id: string) {
    const component = findComponentById(components.value, id);
    if (component && component.styles) {
      copiedStyles.value = safeClone(component.styles);
      return true;
    }
    return false;
  }

  function pasteComponentStyles(id: string) {
    if (!copiedStyles.value) return false;
    saveHistory();
    const component = findComponentById(components.value, id);
    if (component) {
      component.styles = safeClone(copiedStyles.value);
      return true;
    }
    return false;
  }

  function pasteStylesToSelected() {
    if (!copiedStyles.value) return;
    saveHistory();
    selectedIds.value.forEach(id => {
      const component = findComponentById(components.value, id);
      if (component) {
        component.styles = safeClone(copiedStyles.value!);
      }
    });
  }

  // Drop preview functions
  function setDropPreview(targetId: string | null, position: 'before' | 'after' | 'inside' | null, coords: { x: number; y: number } | null = null) {
    dropPreview.value = { targetId, position, coords };
  }

  function clearDropPreview() {
    dropPreview.value = { targetId: null, position: null, coords: null };
  }

  // Snap guide functions
  function updateSnapGuides(componentId: string) {
    const component = findComponentById(components.value, componentId);
    if (!component) return;

    const guides = {
      vertical: [] as number[],
      horizontal: [] as number[]
    };

    // Calculate guides from all other components
    components.value.forEach(comp => {
      if (comp.id !== componentId) {
        // Add component edges as potential snap points
        // This will be enhanced with actual position calculation
      }
    });

    snapGuides.value = guides;
  }

  function clearSnapGuides() {
    snapGuides.value = { vertical: [], horizontal: [] };
  }

  // Batch update for multiple components
  function updateMultipleComponents(ids: string[], updates: Partial<Component>) {
    saveHistory();
    ids.forEach(id => {
      const component = findComponentById(components.value, id);
      if (component) {
        Object.assign(component, updates);
      }
    });
  }

  // Delete multiple components
  function deleteMultipleComponents(ids: string[]) {
    saveHistory();
    ids.forEach(id => {
      deleteComponent(id);
    });
    clearSelection();
  }
  
  return {
    // State
    projectId,
    projectName,
    components,
    selectedId,
    selectedIds,
    hoveredId,
    isDragging,
    draggedType,
    viewport,
    zoom,
    showCode,
    showGrid,
    showSnapGuides,
    showAssetManager,
    assets,
    globalCustomCode,
    responsiveMode,
    deviceVisibility,
    dropPreview,
    copiedStyles,
    snapGuides,

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
    removeAnimation,
    setResponsiveMode,
    toggleDeviceVisibility,
    getDeviceVisibility,
    addSectionComponents,
    addComponentDirect,
    // New functions
    toggleComponentSelection,
    selectMultipleComponents,
    clearSelection,
    copyComponentStyles,
    pasteComponentStyles,
    pasteStylesToSelected,
    setDropPreview,
    clearDropPreview,
    updateSnapGuides,
    clearSnapGuides,
    updateMultipleComponents,
    deleteMultipleComponents
  };
});