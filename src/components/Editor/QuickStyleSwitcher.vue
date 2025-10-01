<template>
  <div class="quick-style-switcher" v-if="store.selectedComponent">
    <div class="switcher-header">
      <h4>Quick Styles</h4>
      <button @click="showAdvanced = !showAdvanced" class="toggle-btn">
        <Settings :size="14" />
      </button>
    </div>

    <!-- Style Presets -->
    <div class="style-presets">
      <button
        v-for="preset in stylePresets"
        :key="preset.id"
        @click="applyPreset(preset)"
        :class="['preset-btn', { active: currentPreset === preset.id }]"
        :title="preset.description"
      >
        <component :is="preset.icon" :size="16" />
        <span>{{ preset.name }}</span>
      </button>
    </div>

    <!-- Color Schemes -->
    <div class="color-schemes">
      <h5>Color Scheme</h5>
      <div class="scheme-grid">
        <button
          v-for="scheme in colorSchemes"
          :key="scheme.id"
          @click="applyColorScheme(scheme)"
          class="scheme-btn"
          :title="scheme.name"
        >
          <div class="scheme-preview">
            <div
              v-for="(color, index) in scheme.colors"
              :key="index"
              class="color-dot"
              :style="{ background: color }"
            ></div>
          </div>
        </button>
      </div>
    </div>

    <!-- Font Pairings -->
    <div class="font-pairings" v-if="showAdvanced">
      <h5>Typography</h5>
      <select @change="applyFontPairing($event)" class="font-select">
        <option value="">Choose font pairing...</option>
        <option v-for="pairing in fontPairings" :key="pairing.id" :value="pairing.id">
          {{ pairing.name }}
        </option>
      </select>
    </div>

    <!-- Spacing Presets -->
    <div class="spacing-presets" v-if="showAdvanced">
      <h5>Spacing</h5>
      <div class="spacing-options">
        <button
          v-for="spacing in spacingPresets"
          :key="spacing.id"
          @click="applySpacing(spacing)"
          :class="['spacing-btn', { active: currentSpacing === spacing.id }]"
        >
          {{ spacing.name }}
        </button>
      </div>
    </div>

    <!-- Animation Presets -->
    <div class="animation-presets">
      <h5>Animations</h5>
      <div class="animation-options">
        <button
          v-for="animation in animationPresets"
          :key="animation.id"
          @click="applyAnimation(animation)"
          class="animation-btn"
          :title="animation.description"
        >
          <Sparkles :size="12" v-if="animation.id === 'fancy'" />
          <Zap :size="12" v-if="animation.id === 'quick'" />
          <Circle :size="12" v-if="animation.id === 'smooth'" />
          <X :size="12" v-if="animation.id === 'none'" />
          <span>{{ animation.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEditorStore } from '@/stores/editor';
import {
  Settings,
  Sparkles,
  Zap,
  Circle,
  X,
  Square,
  RectangleHorizontal,
  Minimize,
  Maximize
} from 'lucide-vue-next';

const store = useEditorStore();

// State
const showAdvanced = ref(false);
const currentPreset = ref('modern');
const currentSpacing = ref('normal');

// Style Presets
const stylePresets = [
  {
    id: 'modern',
    name: 'Modern',
    icon: Square,
    description: 'Clean lines and subtle shadows',
    styles: {
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: 'none',
      transition: 'all 0.3s ease'
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    icon: RectangleHorizontal,
    description: 'Traditional design with borders',
    styles: {
      borderRadius: '4px',
      boxShadow: 'none',
      border: '1px solid #d1d5db',
      transition: 'all 0.2s ease'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: Minimize,
    description: 'Ultra-clean with no decorations',
    styles: {
      borderRadius: '0',
      boxShadow: 'none',
      border: 'none',
      transition: 'none'
    }
  },
  {
    id: 'bold',
    name: 'Bold',
    icon: Maximize,
    description: 'Strong shadows and vibrant colors',
    styles: {
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: 'none',
      transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }
];

// Color Schemes
const colorSchemes = [
  {
    id: 'purple',
    name: 'Purple Dream',
    colors: ['#5b21b6', '#7c3aed', '#a78bfa', '#c4b5fd'],
    primary: '#5b21b6',
    secondary: '#7c3aed',
    accent: '#a78bfa'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'],
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa'
  },
  {
    id: 'green',
    name: 'Forest Green',
    colors: ['#14532d', '#16a34a', '#4ade80', '#86efac'],
    primary: '#16a34a',
    secondary: '#22c55e',
    accent: '#4ade80'
  },
  {
    id: 'red',
    name: 'Ruby Red',
    colors: ['#991b1b', '#dc2626', '#f87171', '#fca5a5'],
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#f87171'
  },
  {
    id: 'mono',
    name: 'Monochrome',
    colors: ['#111827', '#4b5563', '#9ca3af', '#e5e7eb'],
    primary: '#111827',
    secondary: '#4b5563',
    accent: '#9ca3af'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: '#764ba2',
    accent: '#f093fb'
  }
];

// Font Pairings
const fontPairings = [
  {
    id: 'modern-sans',
    name: 'Modern Sans (Inter + DM Sans)',
    heading: "'Inter', sans-serif",
    body: "'DM Sans', sans-serif"
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif (Playfair + Lora)',
    heading: "'Playfair Display', serif",
    body: "'Lora', serif"
  },
  {
    id: 'tech',
    name: 'Tech (Space Grotesk + Roboto)',
    heading: "'Space Grotesk', sans-serif",
    body: "'Roboto', sans-serif"
  },
  {
    id: 'elegant',
    name: 'Elegant (Poppins + Open Sans)',
    heading: "'Poppins', sans-serif",
    body: "'Open Sans', sans-serif"
  },
  {
    id: 'playful',
    name: 'Playful (Fredoka + Nunito)',
    heading: "'Fredoka', cursive",
    body: "'Nunito', sans-serif"
  }
];

// Spacing Presets
const spacingPresets = [
  {
    id: 'compact',
    name: 'Compact',
    padding: '8px 12px',
    margin: '4px',
    gap: '8px'
  },
  {
    id: 'normal',
    name: 'Normal',
    padding: '12px 20px',
    margin: '8px',
    gap: '16px'
  },
  {
    id: 'spacious',
    name: 'Spacious',
    padding: '20px 32px',
    margin: '16px',
    gap: '24px'
  },
  {
    id: 'airy',
    name: 'Airy',
    padding: '32px 48px',
    margin: '24px',
    gap: '40px'
  }
];

// Animation Presets
const animationPresets = [
  {
    id: 'none',
    name: 'None',
    description: 'No animations',
    animation: 'none'
  },
  {
    id: 'smooth',
    name: 'Smooth',
    description: 'Subtle fade transitions',
    animation: 'fadeIn 0.3s ease-out'
  },
  {
    id: 'quick',
    name: 'Quick',
    description: 'Fast snappy animations',
    animation: 'slideIn 0.2s ease-out'
  },
  {
    id: 'fancy',
    name: 'Fancy',
    description: 'Eye-catching entrance',
    animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
];

// Methods
function applyPreset(preset: any) {
  if (!store.selectedComponent) return;

  currentPreset.value = preset.id;

  const currentStyles = store.selectedComponent.props.style || {};
  const newStyles = {
    ...currentStyles,
    ...preset.styles
  };

  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      style: newStyles
    }
  });
}

function applyColorScheme(scheme: any) {
  if (!store.selectedComponent) return;

  const currentStyles = store.selectedComponent.props.style || {};

  // Apply colors based on component type
  let colorStyles: any = {};

  if (store.selectedComponent.type === 'button') {
    colorStyles = {
      backgroundColor: scheme.primary,
      color: 'white',
      borderColor: scheme.primary
    };
  } else if (store.selectedComponent.type === 'text' || store.selectedComponent.type === 'heading') {
    colorStyles = {
      color: scheme.primary
    };
  } else if (store.selectedComponent.type === 'container' || store.selectedComponent.type === 'section') {
    colorStyles = {
      backgroundColor: scheme.colors[3] + '20', // Light tint
      borderColor: scheme.primary
    };
  } else {
    colorStyles = {
      backgroundColor: scheme.primary
    };
  }

  const newStyles = {
    ...currentStyles,
    ...colorStyles
  };

  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      style: newStyles
    }
  });
}

function applyFontPairing(event: Event) {
  const select = event.target as HTMLSelectElement;
  const pairingId = select.value;

  if (!pairingId || !store.selectedComponent) return;

  const pairing = fontPairings.find(p => p.id === pairingId);
  if (!pairing) return;

  const currentStyles = store.selectedComponent.props.style || {};

  // Apply font based on component type
  const fontFamily = store.selectedComponent.type === 'heading'
    ? pairing.heading
    : pairing.body;

  const newStyles = {
    ...currentStyles,
    fontFamily
  };

  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      style: newStyles
    }
  });
}

function applySpacing(spacing: any) {
  if (!store.selectedComponent) return;

  currentSpacing.value = spacing.id;

  const currentStyles = store.selectedComponent.props.style || {};
  const newStyles = {
    ...currentStyles,
    padding: spacing.padding,
    margin: spacing.margin,
    gap: spacing.gap
  };

  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      style: newStyles
    }
  });
}

function applyAnimation(animation: any) {
  if (!store.selectedComponent) return;

  // Apply animation to component styles, not props
  if (animation.id === 'none') {
    // Remove animation
    store.updateComponentStyle(store.selectedComponent.id, 'animation', 'none');
  } else {
    // Apply animation
    store.updateComponentStyle(store.selectedComponent.id, 'animation', animation.animation);

    // Also add as a CSS class for better compatibility
    const className = `animate-${animation.id}`;
    store.updateComponent(store.selectedComponent.id, {
      props: {
        ...store.selectedComponent.props,
        className: className
      }
    });

    // Add keyframes if needed
    addAnimationKeyframes(animation.id);
  }
}

function addAnimationKeyframes(animationId: string) {
  const styleId = `animation-${animationId}`;

  // Check if keyframes already exist
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;

  const keyframes = {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    slideIn: `
      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,
    bounceIn: `
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
    `
  };

  style.textContent = keyframes[animationId as keyof typeof keyframes] || '';
  document.head.appendChild(style);
}
</script>

<style scoped>
.quick-style-switcher {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.switcher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.switcher-header h4 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Style Presets */
.style-presets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.preset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.preset-btn.active {
  background: #5b21b6;
  border-color: #5b21b6;
  color: white;
}

/* Color Schemes */
.color-schemes {
  margin-bottom: 20px;
}

.color-schemes h5,
.font-pairings h5,
.spacing-presets h5,
.animation-presets h5 {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.scheme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.scheme-btn {
  padding: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.scheme-btn:hover {
  border-color: #5b21b6;
  transform: scale(1.05);
}

.scheme-preview {
  display: flex;
  gap: 2px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Font Pairings */
.font-pairings {
  margin-bottom: 20px;
}

.font-select {
  width: 100%;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.font-select:hover {
  border-color: #d1d5db;
}

.font-select:focus {
  outline: none;
  border-color: #5b21b6;
  box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.1);
}

/* Spacing Presets */
.spacing-presets {
  margin-bottom: 20px;
}

.spacing-options {
  display: flex;
  gap: 4px;
}

.spacing-btn {
  flex: 1;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 11px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.spacing-btn:hover {
  background: #f9fafb;
  color: #374151;
}

.spacing-btn.active {
  background: #5b21b6;
  border-color: #5b21b6;
  color: white;
}

/* Animation Presets */
.animation-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.animation-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 11px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.animation-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}
</style>