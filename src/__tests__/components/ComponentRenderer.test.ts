import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ComponentRenderer from '@/components/Canvas/ComponentRenderer.vue';
import { useEditorStore } from '@/stores/editor';
import type { Component } from '@/types/component';

describe('ComponentRenderer', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createComponent = (overrides?: Partial<Component>): Component => ({
    id: 'test-component',
    type: 'container',
    displayName: 'Container',
    props: {},
    styles: {
      base: {
        padding: '20px',
        backgroundColor: '#f0f0f0'
      }
    },
    children: [],
    ...overrides
  });

  it('renders a container component', () => {
    const component = createComponent();
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: false,
        hovered: false
      }
    });
    
    expect(wrapper.find('.component-wrapper').exists()).toBe(true);
    expect(wrapper.find('.component-container').exists()).toBe(true);
  });

  it('shows controls when selected', () => {
    const component = createComponent();
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: true,
        hovered: false
      }
    });
    
    expect(wrapper.find('.component-controls').exists()).toBe(true);
    expect(wrapper.find('.drag-handle').exists()).toBe(true);
  });

  it('shows label when hovered', () => {
    const component = createComponent();
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: false,
        hovered: true
      }
    });
    
    expect(wrapper.find('.component-label').exists()).toBe(true);
    expect(wrapper.text()).toContain('Container');
  });

  it('renders heading component with content', () => {
    const component = createComponent({
      type: 'heading',
      displayName: 'Heading',
      props: {
        content: 'Test Heading',
        attributes: { level: 'h2' }
      }
    });
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: false,
        hovered: false
      }
    });
    
    expect(wrapper.find('h2').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Test Heading');
  });

  it('renders button component', () => {
    const component = createComponent({
      type: 'button',
      displayName: 'Button',
      props: {
        content: 'Click Me'
      }
    });
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: false,
        hovered: false
      }
    });
    
    expect(wrapper.find('button.button-content').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Click Me');
  });

  it('applies responsive styles based on viewport', async () => {
    const store = useEditorStore();
    store.viewport = 'mobile';
    
    const component = createComponent({
      styles: {
        base: { fontSize: '16px' },
        sm: { fontSize: '14px' }
      }
    });
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: false,
        hovered: false
      }
    });
    
    const content = wrapper.find('.component-content');
    expect(content.attributes('style')).toContain('font-size: 16px');
  });

  it('emits select event on click', async () => {
    const component = createComponent();
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: false,
        hovered: false
      }
    });
    
    await wrapper.find('.component-wrapper').trigger('click');
    
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0]).toEqual([component.id]);
  });

  it('handles delete action', async () => {
    const store = useEditorStore();
    store.addComponent('container');
    
    const component = store.components[0];
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: true,
        hovered: false
      }
    });
    
    await wrapper.find('.control-btn[title="Delete"]').trigger('click');
    
    expect(store.components).toHaveLength(0);
  });

  it('handles duplicate action', async () => {
    const store = useEditorStore();
    store.addComponent('heading');
    
    const component = store.components[0];
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: true,
        hovered: false
      }
    });
    
    await wrapper.find('.control-btn[title="Duplicate"]').trigger('click');
    
    expect(store.components).toHaveLength(2);
  });

  it('renders nested children components', () => {
    const childComponent: Component = {
      id: 'child-1',
      type: 'heading',
      displayName: 'Heading',
      props: { content: 'Child Heading' },
      styles: { base: {} }
    };
    
    const component = createComponent({
      children: [childComponent]
    });
    
    const wrapper = mount(ComponentRenderer, {
      props: {
        component,
        selected: false,
        hovered: false
      }
    });
    
    const childWrapper = wrapper.findComponent({ name: 'ComponentRenderer' });
    expect(childWrapper.exists()).toBe(true);
  });
});