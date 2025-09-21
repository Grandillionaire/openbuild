import { ref, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '@/stores/editor';

export function usePerformance() {
  const fps = ref(0);
  const memoryUsage = ref(0);
  const isOptimizing = ref(false);
  
  let frameCount = 0;
  let lastTime = performance.now();
  let rafId: number | null = null;
  
  function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      fps.value = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
      
      // Check memory if available
      if ('memory' in performance) {
        const perfMemory = (performance as any).memory;
        const usage = perfMemory.usedJSHeapSize;
        const limit = perfMemory.jsHeapSizeLimit;
        memoryUsage.value = Math.round((usage / limit) * 100);
        
        // Optimize if needed
        if (memoryUsage.value > 80 && !isOptimizing.value) {
          optimizePerformance();
        }
      }
    }
    
    rafId = requestAnimationFrame(measureFPS);
  }
  
  function optimizePerformance() {
    isOptimizing.value = true;
    
    // Clear caches
    clearUnusedResources();
    
    // Request garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    setTimeout(() => {
      isOptimizing.value = false;
    }, 2000);
  }
  
  function clearUnusedResources() {
    // Clear image caches
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!isInViewport(img)) {
        img.loading = 'lazy';
      }
    });
    
    // Clear unused component pools
    const store = useEditorStore();
    if (store.history.past.length > 20) {
      store.history.past = store.history.past.slice(-20);
    }
  }
  
  function isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }
  
  function startMonitoring() {
    rafId = requestAnimationFrame(measureFPS);
  }
  
  function stopMonitoring() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  
  onMounted(() => {
    startMonitoring();
  });
  
  onUnmounted(() => {
    stopMonitoring();
  });
  
  return {
    fps,
    memoryUsage,
    isOptimizing,
    startMonitoring,
    stopMonitoring,
    optimizePerformance
  };
}