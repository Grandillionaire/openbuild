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
  
  try {
    // First try the fast path with safe stringify
    return JSON.parse(safeStringify(obj));
  } catch (error) {
    // If that fails, do a manual deep clone
    return deepCloneWithCircularCheck(obj);
  }
}

/**
 * Manual deep clone with circular reference checking
 */
function deepCloneWithCircularCheck<T>(obj: T, seen = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Check for circular reference
  if (seen.has(obj as any)) {
    return seen.get(obj as any);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const cloned: any[] = [];
    seen.set(obj as any, cloned);
    
    obj.forEach((item, index) => {
      cloned[index] = deepCloneWithCircularCheck(item, seen);
    });
    
    return cloned as any;
  }

  // Handle dates
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  // Handle regular objects
  const cloned: any = {};
  seen.set(obj as any, cloned);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepCloneWithCircularCheck(obj[key], seen);
    }
  }

  return cloned;
}