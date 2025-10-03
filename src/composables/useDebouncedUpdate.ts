import { ref } from 'vue';

interface DebounceOptions {
  delay?: number;
  immediate?: boolean;
}

/**
 * Composable for debouncing rapid updates to improve performance
 * Useful for style property changes, text input, etc.
 */
export function useDebouncedUpdate(options: DebounceOptions = {}) {
  const { delay = 150, immediate = false } = options;

  const timeoutId = ref<number | null>(null);
  const pendingUpdates = ref<Map<string, any>>(new Map());

  /**
   * Debounce a single update
   */
  function debounce<T extends (...args: any[]) => void>(fn: T, customDelay?: number): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      if (timeoutId.value !== null) {
        clearTimeout(timeoutId.value);
      }

      if (immediate && timeoutId.value === null) {
        fn(...args);
      }

      timeoutId.value = window.setTimeout(() => {
        if (!immediate) {
          fn(...args);
        }
        timeoutId.value = null;
      }, customDelay || delay);
    };
  }

  /**
   * Batch multiple property updates and apply them together
   * This is especially useful for style properties that trigger re-renders
   */
  function batchUpdate(key: string, value: any, flush?: () => void) {
    pendingUpdates.value.set(key, value);

    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value);
    }

    timeoutId.value = window.setTimeout(() => {
      if (flush) {
        // const updates = Object.fromEntries(pendingUpdates.value); // Available for inspection
        flush();
        pendingUpdates.value.clear();
      }
      timeoutId.value = null;
    }, delay);
  }

  /**
   * Get all pending updates as an object
   */
  function getPendingUpdates(): Record<string, any> {
    return Object.fromEntries(pendingUpdates.value);
  }

  /**
   * Force flush all pending updates immediately
   */
  function flush(callback?: () => void) {
    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value);
      timeoutId.value = null;
    }

    if (callback) {
      callback();
    }

    pendingUpdates.value.clear();
  }

  /**
   * Cancel pending updates
   */
  function cancel() {
    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value);
      timeoutId.value = null;
    }
    pendingUpdates.value.clear();
  }

  return {
    debounce,
    batchUpdate,
    getPendingUpdates,
    flush,
    cancel
  };
}

/**
 * Specialized hook for batching style updates
 * Collects multiple style property changes and applies them all at once
 */
export function useBatchedStyleUpdates(onUpdate: (styles: Record<string, any>) => void) {
  const pendingStyles = ref<Record<string, any>>({});
  const timeoutId = ref<number | null>(null);

  function updateStyle(property: string, value: any, delay: number = 150) {
    pendingStyles.value[property] = value;

    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value);
    }

    timeoutId.value = window.setTimeout(() => {
      onUpdate({ ...pendingStyles.value });
      pendingStyles.value = {};
      timeoutId.value = null;
    }, delay);
  }

  function updateMultipleStyles(styles: Record<string, any>, delay: number = 150) {
    Object.assign(pendingStyles.value, styles);

    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value);
    }

    timeoutId.value = window.setTimeout(() => {
      onUpdate({ ...pendingStyles.value });
      pendingStyles.value = {};
      timeoutId.value = null;
    }, delay);
  }

  function flushStyles() {
    if (timeoutId.value !== null) {
      clearTimeout(timeoutId.value);
      timeoutId.value = null;
    }

    if (Object.keys(pendingStyles.value).length > 0) {
      onUpdate({ ...pendingStyles.value });
      pendingStyles.value = {};
    }
  }

  return {
    updateStyle,
    updateMultipleStyles,
    flushStyles,
    pendingStyles
  };
}

/**
 * Throttle function for high-frequency events (scroll, resize, drag)
 */
export function useThrottle() {
  const lastRun = ref<number>(0);

  function throttle<T extends (...args: any[]) => void>(
    fn: T,
    limit: number = 16 // ~60fps
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRun.value >= limit) {
        fn(...args);
        lastRun.value = now;
      }
    };
  }

  return {
    throttle
  };
}
