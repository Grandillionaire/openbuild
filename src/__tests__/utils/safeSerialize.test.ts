import { describe, it, expect } from 'vitest';
import { safeStringify, safeParse, safeClone } from '@/utils/safeSerialize';

describe('Safe Serialization Utils', () => {
  describe('safeStringify', () => {
    it('should stringify simple objects', () => {
      const obj = { name: 'test', value: 42 };
      const result = safeStringify(obj);
      expect(result).toBe('{"name":"test","value":42}');
    });

    it('should handle circular references', () => {
      const obj: any = { name: 'test' };
      obj.self = obj;
      
      const result = safeStringify(obj);
      expect(result).toContain('"self":"[Circular]"');
    });

    it('should handle nested circular references', () => {
      const parent: any = { name: 'parent' };
      const child: any = { name: 'child', parent };
      parent.child = child;
      
      const result = safeStringify(parent);
      expect(result).toContain('[Circular]');
    });

    it('should handle functions', () => {
      const obj = {
        name: 'test',
        fn: () => console.log('test')
      };
      
      const result = safeStringify(obj);
      expect(result).toContain('"fn":"[Function]"');
    });

    it('should handle DOM elements', () => {
      const div = document.createElement('div');
      const obj = { element: div };
      
      const result = safeStringify(obj);
      expect(result).toContain('"element":"[HTMLElement]"');
    });

    it('should support indentation', () => {
      const obj = { name: 'test', nested: { value: 42 } };
      const result = safeStringify(obj, 2);
      
      expect(result).toContain('  "name"');
      expect(result).toContain('    "value"');
    });
  });

  describe('safeParse', () => {
    it('should parse valid JSON', () => {
      const json = '{"name":"test","value":42}';
      const result = safeParse(json);
      
      expect(result).toEqual({ name: 'test', value: 42 });
    });

    it('should handle circular reference markers', () => {
      const json = '{"name":"test","self":"[Circular]"}';
      const result = safeParse(json);
      
      expect(result.name).toBe('test');
      expect(result.self).toBeUndefined();
    });
  });

  describe('safeClone', () => {
    it('should clone simple objects', () => {
      const original = { name: 'test', value: 42 };
      const cloned = safeClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should deep clone nested objects', () => {
      const original = {
        name: 'test',
        nested: { value: 42, array: [1, 2, 3] }
      };
      const cloned = safeClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.nested.array).not.toBe(original.nested.array);
    });

    it('should handle circular references', () => {
      const obj: any = { name: 'test' };
      obj.self = obj;
      
      const cloned = safeClone(obj);
      expect(cloned.name).toBe('test');
      expect(cloned.self).toBe(cloned);
    });

    it('should clone arrays', () => {
      const original = [1, { a: 2 }, [3, 4]];
      const cloned = safeClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
      expect(cloned[2]).not.toBe(original[2]);
    });

    it('should clone dates', () => {
      const original = new Date('2025-01-01');
      const cloned = safeClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.getTime()).toBe(original.getTime());
    });

    it('should return primitives as-is', () => {
      expect(safeClone(42)).toBe(42);
      expect(safeClone('test')).toBe('test');
      expect(safeClone(true)).toBe(true);
      expect(safeClone(null)).toBe(null);
    });
  });
});