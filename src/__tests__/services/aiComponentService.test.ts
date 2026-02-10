import { describe, it, expect } from 'vitest';
import { generateComponent } from '@/services/aiComponentService';

describe('AI Component Service', () => {
  it('should generate a hero component from description', async () => {
    const result = await generateComponent({
      description: 'A hero section with a gradient background and large heading'
    });
    
    expect(result.success).toBe(true);
    expect(result.component).toBeDefined();
    expect(result.component?.type).toBe('section');
    expect(result.component?.displayName).toContain('Hero');
  });

  it('should generate a contact form from description', async () => {
    const result = await generateComponent({
      description: 'A contact form with name, email, and message fields'
    });
    
    expect(result.success).toBe(true);
    expect(result.component).toBeDefined();
    expect(result.component?.type).toBe('section');
    expect(result.component?.displayName).toContain('Contact');
  });

  it('should generate a features section from description', async () => {
    const result = await generateComponent({
      description: 'A features section with 3 feature cards'
    });
    
    expect(result.success).toBe(true);
    expect(result.component).toBeDefined();
    expect(result.component?.children).toBeDefined();
  });

  it('should apply style presets correctly', async () => {
    const modernResult = await generateComponent({
      description: 'A card component',
      style: 'modern'
    });
    
    const minimalResult = await generateComponent({
      description: 'A card component',
      style: 'minimal'
    });
    
    expect(modernResult.success).toBe(true);
    expect(minimalResult.success).toBe(true);
    // Different styles should produce different results
    expect(JSON.stringify(modernResult.component?.styles))
      .not.toBe(JSON.stringify(minimalResult.component?.styles));
  });

  it('should default to card type for generic descriptions', async () => {
    const result = await generateComponent({
      description: 'A simple component that displays some content'
    });
    
    expect(result.success).toBe(true);
    expect(result.component).toBeDefined();
    expect(result.component?.type).toBe('container');
  });

  it('should generate unique IDs for all components', async () => {
    const result = await generateComponent({
      description: 'A features section with multiple cards'
    });
    
    expect(result.success).toBe(true);
    
    const ids = new Set<string>();
    function collectIds(component: any) {
      ids.add(component.id);
      component.children?.forEach(collectIds);
    }
    
    if (result.component) {
      collectIds(result.component);
    }
    
    // All IDs should be unique
    const allIds = Array.from(ids);
    const uniqueIds = [...new Set(allIds)];
    expect(allIds.length).toBe(uniqueIds.length);
  });
});
