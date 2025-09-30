<template>
  <div class="responsive-editor" v-if="store.selectedComponent">
    <div class="editor-header">
      <h4>Responsive Settings</h4>
      <div class="device-switcher">
        <button
          v-for="device in devices"
          :key="device.id"
          @click="store.setResponsiveMode(device.id)"
          :class="['device-btn', { active: store.responsiveMode === device.id }]"
          :title="device.label"
        >
          <component :is="device.icon" :size="16" />
        </button>
      </div>
    </div>

    <!-- Device Visibility -->
    <div class="visibility-section">
      <h5>Show/Hide on Devices</h5>
      <div class="visibility-controls">
        <div
          v-for="device in devices"
          :key="device.id"
          class="visibility-item"
        >
          <label class="visibility-label">
            <input
              type="checkbox"
              :checked="getVisibility(device.id)"
              @change="toggleVisibility(device.id)"
            />
            <component :is="device.icon" :size="14" />
            <span>{{ device.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Responsive Spacing -->
    <div class="spacing-section">
      <h5>{{ currentDeviceLabel }} Spacing</h5>

      <div class="spacing-controls">
        <div class="control-group">
          <label>Padding</label>
          <div class="spacing-inputs">
            <input
              v-model="responsivePadding.top"
              type="number"
              placeholder="T"
              @input="updateResponsiveSpacing('padding')"
            />
            <input
              v-model="responsivePadding.right"
              type="number"
              placeholder="R"
              @input="updateResponsiveSpacing('padding')"
            />
            <input
              v-model="responsivePadding.bottom"
              type="number"
              placeholder="B"
              @input="updateResponsiveSpacing('padding')"
            />
            <input
              v-model="responsivePadding.left"
              type="number"
              placeholder="L"
              @input="updateResponsiveSpacing('padding')"
            />
          </div>
        </div>

        <div class="control-group">
          <label>Margin</label>
          <div class="spacing-inputs">
            <input
              v-model="responsiveMargin.top"
              type="number"
              placeholder="T"
              @input="updateResponsiveSpacing('margin')"
            />
            <input
              v-model="responsiveMargin.right"
              type="number"
              placeholder="R"
              @input="updateResponsiveSpacing('margin')"
            />
            <input
              v-model="responsiveMargin.bottom"
              type="number"
              placeholder="B"
              @input="updateResponsiveSpacing('margin')"
            />
            <input
              v-model="responsiveMargin.left"
              type="number"
              placeholder="L"
              @input="updateResponsiveSpacing('margin')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Responsive Typography -->
    <div class="typography-section">
      <h5>{{ currentDeviceLabel }} Typography</h5>

      <div class="typography-controls">
        <div class="control-group">
          <label>Font Size</label>
          <div class="size-control">
            <input
              v-model="responsiveFontSize"
              type="number"
              @input="updateResponsiveTypography"
            />
            <select v-model="fontSizeUnit" @change="updateResponsiveTypography">
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label>Line Height</label>
          <input
            v-model="responsiveLineHeight"
            type="number"
            step="0.1"
            @input="updateResponsiveTypography"
          />
        </div>
      </div>
    </div>

    <!-- Responsive Layout -->
    <div class="layout-section">
      <h5>{{ currentDeviceLabel }} Layout</h5>

      <div class="layout-controls">
        <div class="control-group">
          <label>Direction</label>
          <select v-model="layoutDirection" @change="updateResponsiveLayout">
            <option value="">Default</option>
            <option value="row">Row</option>
            <option value="row-reverse">Row Reverse</option>
            <option value="column">Column</option>
            <option value="column-reverse">Column Reverse</option>
          </select>
        </div>

        <div class="control-group">
          <label>Alignment</label>
          <select v-model="layoutAlign" @change="updateResponsiveLayout">
            <option value="">Default</option>
            <option value="flex-start">Start</option>
            <option value="center">Center</option>
            <option value="flex-end">End</option>
            <option value="space-between">Space Between</option>
            <option value="space-around">Space Around</option>
          </select>
        </div>

        <div class="control-group">
          <label>Width</label>
          <div class="size-control">
            <input
              v-model="responsiveWidth"
              type="text"
              placeholder="auto"
              @input="updateResponsiveLayout"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Breakpoint Preview -->
    <div class="breakpoint-preview">
      <h5>Breakpoints</h5>
      <div class="breakpoint-list">
        <div
          v-for="bp in breakpoints"
          :key="bp.id"
          :class="['breakpoint-item', { active: isBreakpointActive(bp) }]"
        >
          <span class="bp-label">{{ bp.label }}</span>
          <span class="bp-value">{{ bp.min }}px</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { Smartphone, Tablet, Monitor } from 'lucide-vue-next';

const store = useEditorStore();

// Device configurations
const devices = [
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'desktop', label: 'Desktop', icon: Monitor }
];

// Breakpoints
const breakpoints = [
  { id: 'mobile', label: 'Mobile', min: 320, max: 767 },
  { id: 'tablet', label: 'Tablet', min: 768, max: 1023 },
  { id: 'desktop', label: 'Desktop', min: 1024, max: null }
];

// Reactive state for responsive values
const responsivePadding = ref({ top: 0, right: 0, bottom: 0, left: 0 });
const responsiveMargin = ref({ top: 0, right: 0, bottom: 0, left: 0 });
const responsiveFontSize = ref(16);
const fontSizeUnit = ref('px');
const responsiveLineHeight = ref(1.5);
const layoutDirection = ref('');
const layoutAlign = ref('');
const responsiveWidth = ref('');

// Computed
const currentDeviceLabel = computed(() => {
  const device = devices.find(d => d.id === store.responsiveMode);
  return device ? device.label : 'Desktop';
});

// Methods
function getVisibility(deviceId: string) {
  if (!store.selectedComponent) return true;
  const visibility = store.getDeviceVisibility(store.selectedComponent.id);
  return visibility[deviceId as keyof typeof visibility];
}

function toggleVisibility(deviceId: string) {
  if (!store.selectedComponent) return;
  store.toggleDeviceVisibility(store.selectedComponent.id, deviceId as any);
}

function updateResponsiveSpacing(type: 'padding' | 'margin') {
  if (!store.selectedComponent) return;

  const values = type === 'padding' ? responsivePadding.value : responsiveMargin.value;
  const cssValue = `${values.top}px ${values.right}px ${values.bottom}px ${values.left}px`;

  // Create responsive class name based on current mode
  const className = `${store.responsiveMode}-${type}`;

  updateResponsiveStyle(type, cssValue, className);
}

function updateResponsiveTypography() {
  if (!store.selectedComponent) return;

  const fontSize = `${responsiveFontSize.value}${fontSizeUnit.value}`;
  const lineHeight = responsiveLineHeight.value;

  updateResponsiveStyle('fontSize', fontSize, `${store.responsiveMode}-font-size`);
  updateResponsiveStyle('lineHeight', lineHeight, `${store.responsiveMode}-line-height`);
}

function updateResponsiveLayout() {
  if (!store.selectedComponent) return;

  if (layoutDirection.value) {
    updateResponsiveStyle('flexDirection', layoutDirection.value, `${store.responsiveMode}-direction`);
  }

  if (layoutAlign.value) {
    updateResponsiveStyle('justifyContent', layoutAlign.value, `${store.responsiveMode}-align`);
  }

  if (responsiveWidth.value) {
    updateResponsiveStyle('width', responsiveWidth.value, `${store.responsiveMode}-width`);
  }
}

function updateResponsiveStyle(property: string, value: any, className: string) {
  if (!store.selectedComponent) return;

  // Store responsive styles in component metadata
  if (!store.selectedComponent.props.responsiveStyles) {
    store.selectedComponent.props.responsiveStyles = {};
  }

  if (!store.selectedComponent.props.responsiveStyles[store.responsiveMode]) {
    store.selectedComponent.props.responsiveStyles[store.responsiveMode] = {};
  }

  store.selectedComponent.props.responsiveStyles[store.responsiveMode][property] = value;

  // Apply styles based on current viewport
  if (store.responsiveMode === store.viewport) {
    const currentStyles = store.selectedComponent.props.style || {};
    store.updateComponentStyle(store.selectedComponent.id, property, value);
  }
}

function isBreakpointActive(breakpoint: any) {
  return breakpoint.id === store.responsiveMode;
}

// Watch for component changes and load its responsive values
watch(() => store.selectedComponent, (component) => {
  if (component && component.props.responsiveStyles) {
    const modeStyles = component.props.responsiveStyles[store.responsiveMode] || {};

    // Load padding
    if (modeStyles.padding) {
      const values = modeStyles.padding.split(' ').map((v: string) => parseInt(v) || 0);
      responsivePadding.value = {
        top: values[0] || 0,
        right: values[1] || 0,
        bottom: values[2] || 0,
        left: values[3] || 0
      };
    }

    // Load other values
    if (modeStyles.fontSize) {
      const match = modeStyles.fontSize.match(/(\d+)(\w+)/);
      if (match) {
        responsiveFontSize.value = parseInt(match[1]);
        fontSizeUnit.value = match[2];
      }
    }
  }
}, { immediate: true });
</script>

<style scoped>
.responsive-editor {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-header h4 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-switcher {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 2px;
}

.device-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.device-btn:hover {
  background: white;
  color: #374151;
}

.device-btn.active {
  background: white;
  color: #5b21b6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Sections */
.visibility-section,
.spacing-section,
.typography-section,
.layout-section,
.breakpoint-preview {
  margin-bottom: 24px;
}

h5 {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

/* Visibility Controls */
.visibility-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visibility-item {
  display: flex;
}

.visibility-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.visibility-label:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.visibility-label input[type="checkbox"] {
  margin: 0;
}

.visibility-label span {
  font-size: 12px;
  color: #374151;
}

/* Control Groups */
.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

/* Spacing Inputs */
.spacing-inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.spacing-inputs input {
  padding: 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.spacing-inputs input:focus {
  outline: none;
  border-color: #5b21b6;
}

/* Size Control */
.size-control {
  display: flex;
  gap: 4px;
}

.size-control input {
  flex: 1;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
}

.size-control select {
  padding: 6px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

/* Select Controls */
select {
  width: 100%;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #5b21b6;
}

/* Breakpoint Preview */
.breakpoint-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breakpoint-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  transition: all 0.2s;
}

.breakpoint-item.active {
  background: #5b21b6;
  border-color: #5b21b6;
  color: white;
}

.bp-label {
  font-size: 12px;
  font-weight: 500;
}

.bp-value {
  font-size: 11px;
  opacity: 0.8;
}

/* Typography Controls */
.typography-controls input[type="number"] {
  width: 100%;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
}
</style>