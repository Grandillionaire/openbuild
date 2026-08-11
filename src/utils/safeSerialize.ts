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
  // Track the current ancestor chain, NOT every object ever visited. A plain
  // "seen" set flags any repeated reference as circular, which would replace
  // legitimately shared objects (e.g. two components sharing a props object)
  // with '[Circular]' and silently destroy the data on the next save/undo.
  const ancestors: unknown[] = [];

  return JSON.stringify(obj, function (this: unknown, _key, value) {
    // Handle null and primitives
    if (value === null || typeof value !== 'object') {
      return value;
    }

    // Special handling for DOM elements or other non-serializable objects
    if (value instanceof HTMLElement) {
      return '[HTMLElement]';
    }

    // Unwind the chain back to the holder of the value being serialized.
    // JSON.stringify calls the replacer with `this` bound to that holder.
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }

    // Only an ancestor of the current value can be a circular reference
    if (ancestors.indexOf(value) !== -1) {
      return '[Circular]';
    }

    ancestors.push(value);

    return value;
  }, space);
}

/**
 * Safely parse JSON string back to object
 * @param json - JSON string to parse
 * @returns Parsed object
 */
export function safeParse(json: string): any {
  return JSON.parse(json, (_key, value) => {
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