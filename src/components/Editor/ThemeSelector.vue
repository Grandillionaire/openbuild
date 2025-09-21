<template>
  <div class="theme-selector">
    <div class="theme-header">
      <h3>Design Theme</h3>
      <button @click="showCustomizer = !showCustomizer" class="customize-btn">
        <Palette :size="16" />
        Customize
      </button>
    </div>

    <div class="preset-themes">
      <button
        v-for="(theme, key) in presetThemes"
        :key="key"
        @click="applyTheme(key)"
        :class="['theme-option', { active: themeName === key }]"
      >
        <div class="theme-preview">
          <div class="color-dots">
            <span 
              v-for="(color, index) in getThemeColors(theme)" 
              :key="index"
              :style="{ backgroundColor: color }"
              class="color-dot"
            />
          </div>
        </div>
        <span class="theme-name">{{ formatThemeName(key) }}</span>
      </button>
    </div>

    <transition name="slide">
      <div v-if="showCustomizer" class="theme-customizer">
        <div class="customizer-section">
          <h4>Colors</h4>
          <div class="color-grid">
            <div v-for="(value, key) in activeTheme.colors" :key="key" class="color-input">
              <label>{{ formatColorName(key) }}</label>
              <div class="color-picker">
                <input
                  type="color"
                  :value="value"
                  @input="updateColor(key, $event.target.value)"
                />
                <input
                  type="text"
                  :value="value"
                  @input="updateColor(key, $event.target.value)"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="customizer-section">
          <h4>Typography</h4>
          <div class="typography-controls">
            <div class="control-group">
              <label>Base Font Size</label>
              <input
                type="range"
                min="12"
                max="20"
                :value="parseInt(activeTheme.typography.baseFontSize)"
                @input="updateTypography('baseFontSize', $event.target.value + 'px')"
              />
              <span>{{ activeTheme.typography.baseFontSize }}</span>
            </div>
            <div class="control-group">
              <label>Font Family</label>
              <select
                :value="activeTheme.typography.fontFamily"
                @change="updateTypography('fontFamily', $event.target.value)"
              >
                <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'>System</option>
                <option value='"Inter", sans-serif'>Inter</option>
                <option value='"Helvetica Neue", Helvetica, Arial, sans-serif'>Helvetica</option>
                <option value='Georgia, serif'>Georgia</option>
                <option value='"Courier New", monospace'>Monospace</option>
              </select>
            </div>
          </div>
        </div>

        <div class="customizer-section">
          <h4>Border Radius</h4>
          <div class="radius-controls">
            <button
              v-for="(preset, key) in radiusPresets"
              :key="key"
              @click="applyRadiusPreset(preset)"
              :class="['radius-preset', { active: isRadiusPresetActive(preset) }]"
            >
              <div class="radius-preview" :style="{ borderRadius: preset.md }"></div>
              <span>{{ key }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { Palette } from 'lucide-vue-next';

const themeStore = useThemeStore();

const showCustomizer = ref(false);

const { presetThemes, activeTheme, themeName } = themeStore;

const radiusPresets = {
  Sharp: { none: '0', sm: '0', md: '0', lg: '0', xl: '0', full: '0' },
  Default: { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
  Rounded: { none: '0', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', full: '9999px' }
};

function getThemeColors(theme: any) {
  return [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    theme.colors.background,
    theme.colors.text
  ];
}

function formatThemeName(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function formatColorName(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function applyTheme(themeName: keyof typeof presetThemes) {
  themeStore.setTheme(themeName);
}

function updateColor(key: string, value: string) {
  themeStore.updateThemeTokens({
    colors: {
      ...activeTheme.colors,
      [key]: value
    }
  });
}

function updateTypography(key: string, value: string) {
  themeStore.updateThemeTokens({
    typography: {
      ...activeTheme.typography,
      [key]: value
    }
  });
}

function applyRadiusPreset(preset: any) {
  themeStore.updateThemeTokens({
    borderRadius: preset
  });
}

function isRadiusPresetActive(preset: any) {
  return JSON.stringify(preset) === JSON.stringify(activeTheme.borderRadius);
}
</script>

<style scoped>
.theme-selector {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.theme-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.theme-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.customize-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.customize-btn:hover {
  background: var(--bg-tertiary);
}

.preset-themes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-option:hover {
  background: var(--bg-tertiary);
}

.theme-option.active {
  border-color: var(--primary);
  background: var(--bg-tertiary);
}

.theme-preview {
  margin-bottom: 0.5rem;
}

.color-dots {
  display: flex;
  gap: 4px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.theme-name {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.theme-customizer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.customizer-section {
  margin-bottom: 2rem;
}

.customizer-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.color-grid {
  display: grid;
  gap: 0.75rem;
}

.color-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-input label {
  font-size: 0.813rem;
  color: var(--text-secondary);
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-picker input[type="color"] {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.color-picker input[type="text"] {
  width: 90px;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.813rem;
  font-family: monospace;
}

.typography-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.813rem;
  color: var(--text-secondary);
}

.control-group input[type="range"] {
  width: 100%;
}

.control-group select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.radius-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.radius-preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.radius-preset:hover {
  background: var(--bg-tertiary);
}

.radius-preset.active {
  border-color: var(--primary);
}

.radius-preview {
  width: 40px;
  height: 40px;
  background: var(--primary);
  opacity: 0.2;
}

.radius-preset span {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>