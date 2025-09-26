import { ref, watch, onUnmounted } from 'vue';
import type { Component, Animation } from '@/types/component';
import { useEditorStore } from '@/stores/editor';

export function useAnimationStyles() {
  const store = useEditorStore();
  const styleElement = ref<HTMLStyleElement | null>(null);

  // Generate keyframes CSS for an animation
  function generateKeyframesCSS(animation: Animation): string {
    if (!animation.timeline || animation.timeline.length === 0) {
      // Use preset keyframes based on animation type
      return generatePresetKeyframes(animation);
    }

    const keyframes = animation.timeline.map((keyframe) => {
      const percentage = keyframe.time * 100;
      const properties = Object.entries(keyframe.properties)
        .map(([key, value]) => {
          // Convert camelCase to kebab-case
          const cssKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
          return `${cssKey}: ${value}`;
        })
        .join('; ');
      return `${percentage}% { ${properties} }`;
    }).join(' ');

    return `@keyframes animation-${animation.id} { ${keyframes} }`;
  }

  // Generate preset keyframes for animations without custom timeline
  function generatePresetKeyframes(animation: Animation): string {
    const animationId = `animation-${animation.id}`;
    
    // Map animation names to preset keyframes
    const presets: Record<string, string> = {
      'Fade In': `@keyframes ${animationId} {
        from { opacity: 0; }
        to { opacity: 1; }
      }`,
      'Slide In Left': `@keyframes ${animationId} {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }`,
      'Slide In Right': `@keyframes ${animationId} {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }`,
      'Slide In Top': `@keyframes ${animationId} {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }`,
      'Slide In Bottom': `@keyframes ${animationId} {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }`,
      'Scale In': `@keyframes ${animationId} {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }`,
      'Rotate In': `@keyframes ${animationId} {
        from { transform: rotate(-180deg); opacity: 0; }
        to { transform: rotate(0); opacity: 1; }
      }`,
      'Bounce In': `@keyframes ${animationId} {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); }
      }`,
      'Fade Out': `@keyframes ${animationId} {
        from { opacity: 1; }
        to { opacity: 0; }
      }`,
      'Scale Out': `@keyframes ${animationId} {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0); opacity: 0; }
      }`,
      'Pulse': `@keyframes ${animationId} {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }`,
      'Shake': `@keyframes ${animationId} {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }`,
      'Swing': `@keyframes ${animationId} {
        20% { transform: rotate(15deg); }
        40% { transform: rotate(-10deg); }
        60% { transform: rotate(5deg); }
        80% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
      }`,
      'Bounce': `@keyframes ${animationId} {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
      }`,
      'Float': `@keyframes ${animationId} {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }`,
      'Spin': `@keyframes ${animationId} {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }`
    };

    return presets[animation.name] || presets['Fade In'];
  }

  // Update global animation styles
  function updateAnimationStyles() {
    if (!styleElement.value) {
      styleElement.value = document.createElement('style');
      styleElement.value.id = 'openbuild-animations';
      document.head.appendChild(styleElement.value);
    }

    const allAnimations: Animation[] = [];
    
    // Collect all animations from all components
    function collectAnimations(components: Component[]) {
      components.forEach(component => {
        if (component.props.animations) {
          allAnimations.push(...component.props.animations);
        }
        if (component.children) {
          collectAnimations(component.children);
        }
      });
    }

    collectAnimations(store.components);

    // Generate CSS for all animations
    const css = allAnimations
      .map(animation => generateKeyframesCSS(animation))
      .join('\n\n');

    styleElement.value.textContent = css;
  }

  // Debounce function to prevent rapid updates
  let updateTimeout: NodeJS.Timeout | null = null;
  
  const debouncedUpdateAnimationStyles = () => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
      updateAnimationStyles();
    }, 100); // 100ms debounce
  };

  // Watch for changes in components and update animation styles
  const stopWatcher = watch(
    () => store.components,
    debouncedUpdateAnimationStyles,
    { deep: true, immediate: true }
  );

  // Cleanup on unmount
  onUnmounted(() => {
    stopWatcher();
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    if (styleElement.value && styleElement.value.parentNode) {
      styleElement.value.parentNode.removeChild(styleElement.value);
    }
  });

  return {
    updateAnimationStyles,
    generateKeyframesCSS
  };
}