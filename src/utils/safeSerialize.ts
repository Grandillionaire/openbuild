/**
 * Safe serialization utilities to prevent circular reference errors
 * Used throughout the application for component state management
 */

/**
 * Safely stringify an object, handling circular references
 * @param obj - Object to stringify
 * @param space - Indentation for pretty printing
 * @returns JSON string with circular references replaced by '[Circular]'
 */
export function safeStringify(obj: any, space?: number): string {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    // Handle null and primitives
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    // Check for circular reference
    if (seen.has(value)) {
      return '[Circular]';
    }
    
    // Mark as seen
    seen.add(value);
    
    // Special handling for DOM elements or other non-serializable objects
    if (value instanceof HTMLElement) {
      return '[HTMLElement]';
    }
    
    if (value instanceof Function) {
      return '[Function]';
    }
    
    return value;
  }, space);
}

/**
 * Safely parse JSON string back to object
 * @param json - JSON string to parse
 * @returns Parsed object
 */
export function safeParse(json: string): any {
  return JSON.parse(json, (key, value) => {
    // You can add custom revival logic here if needed
    if (value === '[Circular]') {
      return undefined; // or handle as needed
    }
    return value;
  });
}

/**
 * Deep clone an object safely, removing circular references
 * @param obj - Object to clone
 * @returns Deep cloned object without circular references
 */
export function safeClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle special object types that JSON.stringify doesn't preserve
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as any;
  }
  
  if (obj instanceof Map || obj instanceof Set) {
    // For Map and Set, convert to array and back
    if (obj instanceof Map) {
      return new Map(Array.from(obj.entries())) as any;
    }
    return new Set(Array.from(obj)) as any;
  }
  
  // Use the safe stringify method for everything else
  return JSON.parse(safeStringify(obj));
}