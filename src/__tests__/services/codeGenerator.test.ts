import { describe, it, expect } from 'vitest';
import { codeGenerator } from '@/services/codeGenerator';
import type { Component } from '@/types/component';

describe('CodeGenerator Service', () => {
  const createComponent = (overrides?: Partial<Component>): Component => ({
    id: 'test-123',
    type: 'heading',
    displayName: 'Heading',
    props: {
      content: 'Test Heading',
      attributes: { level: 'h1' }
    },
    styles: {
      base: {
        fontSize: '32px',
        color: '#333333'
      }
    },
    ...overrides
  });

  describe('generateProject', () => {
    it('should generate a complete HTML page', async () => {
      const components = [createComponent()];
      
      const result = await codeGenerator.generateProject(components, 'Test Project');
      
      expect(result.fullPage).toContain('<!DOCTYPE html>');
      expect(result.fullPage).toContain('<title>Test Project</title>');
      expect(result.fullPage).toContain('Test Heading');
    });

    it('should include custom CSS', async () => {
      const components = [createComponent()];
      
      const result = await codeGenerator.generateProject(components, 'Test Project', {
        globalCustomCode: {
          css: '.custom { color: red; }'
        }
      });
      
      expect(result.css).toContain('.custom { color: red; }');
      expect(result.fullPage).toContain('.custom { color: red; }');
    });

    it('should include custom JavaScript', async () => {
      const components = [createComponent()];
      
      const result = await codeGenerator.generateProject(components, 'Test Project', {
        globalCustomCode: {
          javascript: 'console.log("Hello World");'
        }
      });
      
      expect(result.fullPage).toContain('console.log("Hello World");');
    });

    it('should include theme variables when specified', async () => {
      const components = [createComponent()];
      
      const result = await codeGenerator.generateProject(components, 'Test Project', {
        includeTheme: true,
        themeVariables: {
          '--primary-color': '#3B82F6',
          '--secondary-color': '#10B981'
        }
      });
      
      expect(result.css).toContain(':root {');
      expect(result.css).toContain('--primary-color: #3B82F6');
      expect(result.css).toContain('--secondary-color: #10B981');
    });
  });

  describe('Component HTML Generation', () => {
    it('should generate heading HTML', async () => {
      const component = createComponent();
      const result = await codeGenerator.generateProject([component], 'Test');
      
      expect(result.html).toContain('<h1 class="c-test-123" id="test-123">Test Heading</h1>');
    });

    it('should generate container with children', async () => {
      const container = createComponent({
        type: 'container',
        displayName: 'Container',
        children: [
          createComponent({ id: 'child-1', props: { content: 'Child 1' } }),
          createComponent({ id: 'child-2', props: { content: 'Child 2' } })
        ]
      });
      
      const result = await codeGenerator.generateProject([container], 'Test');
      
      expect(result.html).toContain('Child 1');
      expect(result.html).toContain('Child 2');
    });

    it('should generate button with styles', async () => {
      const button = createComponent({
        type: 'button',
        displayName: 'Button',
        props: { content: 'Click Me' },
        styles: {
          base: {
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '10px 20px'
          }
        }
      });
      
      const result = await codeGenerator.generateProject([button], 'Test');
      
      expect(result.html).toContain('Click Me');
      expect(result.css).toContain('background-color: #3B82F6');
      expect(result.css).toContain('color: white');
    });
  });

  describe('Component CSS Generation', () => {
    it('should generate base styles', async () => {
      const component = createComponent();
      const result = await codeGenerator.generateProject([component], 'Test');
      
      expect(result.css).toContain('.c-test-123');
      expect(result.css).toContain('font-size: 32px');
      expect(result.css).toContain('color: #333333');
    });

    it('should generate responsive styles', async () => {
      const component = createComponent({
        styles: {
          base: { fontSize: '32px' },
          sm: { fontSize: '24px' },
          md: { fontSize: '28px' },
          lg: { fontSize: '32px' }
        }
      });
      
      const result = await codeGenerator.generateProject([component], 'Test');
      
      expect(result.css).toContain('@media (min-width: 640px)');
      expect(result.css).toContain('@media (min-width: 768px)');
      expect(result.css).toContain('@media (min-width: 1024px)');
    });

    it('should include CSS reset', async () => {
      const components = [createComponent()];
      const result = await codeGenerator.generateProject(components, 'Test');
      
      expect(result.css).toContain('/* CSS Reset */');
      expect(result.css).toContain('* {');
      expect(result.css).toContain('margin: 0;');
      expect(result.css).toContain('padding: 0;');
      expect(result.css).toContain('box-sizing: border-box;');
    });
  });

  describe('Animation Generation', () => {
    it('should generate animation keyframes', async () => {
      const component = createComponent({
        props: {
          content: 'Animated',
          animations: [{
            id: 'anim1',
            name: 'Fade In',
            trigger: 'onLoad',
            options: {
              duration: 1000,
              delay: 0,
              easing: 'ease-in-out'
            },
            timeline: []
          }]
        }
      });
      
      const result = await codeGenerator.generateProject([component], 'Test');
      
      expect(result.css).toContain('@keyframes animation-anim1');
      expect(result.css).toContain('animation: animation-anim1');
    });

    it('should generate scroll animation JavaScript', async () => {
      const component = createComponent({
        props: {
          content: 'Scroll Animated',
          animations: [{
            id: 'anim2',
            name: 'Fade In',
            trigger: 'onScroll',
            options: {
              duration: 1000,
              delay: 0,
              easing: 'ease-in-out'
            },
            timeline: []
          }]
        }
      });
      
      const result = await codeGenerator.generateProject([component], 'Test');
      
      expect(result.fullPage).toContain('IntersectionObserver');
      expect(result.fullPage).toContain('in-view');
    });
  });
});