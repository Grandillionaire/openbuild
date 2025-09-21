import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useEditorStore } from '@/stores/editor';

describe('Editor Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const store = useEditorStore();
    
    expect(store.components).toEqual([]);
    expect(store.selectedId).toBe(null);
    expect(store.hoveredId).toBe(null);
    expect(store.viewport).toBe('desktop');
    expect(store.zoom).toBe(1);
    expect(store.showCode).toBe(false);
  });

  describe('Component Management', () => {
    it('should add a component', () => {
      const store = useEditorStore();
      
      const component = store.addComponent('container');
      
      expect(store.components).toHaveLength(1);
      expect(component.type).toBe('container');
      expect(component.id).toBeDefined();
      expect(store.selectedId).toBe(component.id);
    });

    it('should add a component with parent', () => {
      const store = useEditorStore();
      
      const parent = store.addComponent('container');
      const child = store.addComponent('heading', parent.id);
      
      expect(parent.children).toHaveLength(1);
      expect(parent.children![0].id).toBe(child.id);
      expect(child.parent).toBe(parent.id);
    });

    it('should update a component', () => {
      const store = useEditorStore();
      
      const component = store.addComponent('heading');
      store.updateComponent(component.id, {
        props: { content: 'Updated Heading' }
      });
      
      expect(store.components[0].props.content).toBe('Updated Heading');
    });

    it('should delete a component', () => {
      const store = useEditorStore();
      
      const component = store.addComponent('heading');
      store.deleteComponent(component.id);
      
      expect(store.components).toHaveLength(0);
      expect(store.selectedId).toBe(null);
    });

    it('should duplicate a component', () => {
      const store = useEditorStore();
      
      const original = store.addComponent('heading');
      store.updateComponent(original.id, {
        props: { content: 'Original' }
      });
      
      store.duplicateComponent(original.id);
      
      expect(store.components).toHaveLength(2);
      expect(store.components[1].props.content).toBe('Original');
      expect(store.components[1].id).not.toBe(original.id);
    });

    it('should move a component', () => {
      const store = useEditorStore();
      
      const comp1 = store.addComponent('heading');
      const comp2 = store.addComponent('text');
      const comp3 = store.addComponent('button');
      
      // Move comp3 to position 0
      store.moveComponent(comp3.id, null, 0);
      
      expect(store.components[0].id).toBe(comp3.id);
      expect(store.components[1].id).toBe(comp1.id);
      expect(store.components[2].id).toBe(comp2.id);
    });
  });

  describe('History Management', () => {
    it('should support undo/redo', () => {
      const store = useEditorStore();
      
      // Add component
      const component = store.addComponent('heading');
      expect(store.components).toHaveLength(1);
      expect(store.canUndo).toBe(true);
      expect(store.canRedo).toBe(false);
      
      // Undo
      store.undo();
      expect(store.components).toHaveLength(0);
      expect(store.canUndo).toBe(false);
      expect(store.canRedo).toBe(true);
      
      // Redo
      store.redo();
      expect(store.components).toHaveLength(1);
      expect(store.canUndo).toBe(true);
      expect(store.canRedo).toBe(false);
    });
  });

  describe('Style Management', () => {
    it('should update component styles', () => {
      const store = useEditorStore();
      
      const component = store.addComponent('heading');
      store.updateComponentStyle(component.id, 'color', '#ff0000');
      
      expect(store.components[0].styles.base.color).toBe('#ff0000');
    });

    it('should update multiple styles at once', () => {
      const store = useEditorStore();
      
      const component = store.addComponent('heading');
      store.updateMultipleStyles(component.id, {
        color: '#ff0000',
        fontSize: '24px',
        fontWeight: 'bold'
      });
      
      const styles = store.components[0].styles.base;
      expect(styles.color).toBe('#ff0000');
      expect(styles.fontSize).toBe('24px');
      expect(styles.fontWeight).toBe('bold');
    });

    it('should handle responsive styles', () => {
      const store = useEditorStore();
      
      const component = store.addComponent('heading');
      store.updateComponentStyle(component.id, 'fontSize', '16px', 'sm');
      store.updateComponentStyle(component.id, 'fontSize', '24px', 'md');
      
      const styles = store.components[0].styles;
      expect(styles.sm?.fontSize).toBe('16px');
      expect(styles.md?.fontSize).toBe('24px');
    });
  });

  describe('Animation Management', () => {
    it('should add animations to components', () => {
      const store = useEditorStore();
      
      const component = store.addComponent('heading');
      const animation = {
        id: 'anim1',
        name: 'Fade In',
        trigger: 'onLoad' as const,
        options: {
          duration: 1000,
          delay: 0,
          easing: 'ease-in-out'
        },
        timeline: []
      };
      
      store.addAnimation(component.id, animation);
      
      expect(store.components[0].props.animations).toHaveLength(1);
      expect(store.components[0].props.animations![0].name).toBe('Fade In');
    });
  });
});