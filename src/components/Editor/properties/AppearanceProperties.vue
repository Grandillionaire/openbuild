<template>
  <div class="appearance-properties">
    <!-- Background -->
    <div class="property-section">
      <h4 class="section-title">
        <Palette :size="14" />
        Background
      </h4>
      
      <div class="property-group">
        <label>Type</label>
        <select v-model="bgType" @change="updateBackgroundType">
          <option value="none">None</option>
          <option value="solid">Solid Color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </select>
      </div>

      <!-- Solid Color -->
      <div v-if="bgType === 'solid'" class="property-group">
        <label>Color</label>
        <div class="color-input">
          <div 
            class="color-preview" 
            :style="{ backgroundColor: bgColor }"
            @click="toggleColorPicker('bg')"
          ></div>
          <input 
            v-model="bgColor"
            @input="updateBackgroundColor"
            placeholder="transparent"
          />
          <button @click="bgColor = 'transparent'" class="clear-btn">
            <X :size="14" />
          </button>
        </div>
      </div>

      <!-- Gradient -->
      <div v-if="bgType === 'gradient'" class="gradient-controls">
        <div class="property-group">
          <label>Direction</label>
          <select v-model="gradientDirection" @change="updateGradient">
            <option value="to right">→ Right</option>
            <option value="to left">← Left</option>
            <option value="to bottom">↓ Down</option>
            <option value="to top">↑ Up</option>
            <option value="to bottom right">↘ Diagonal</option>
            <option value="45deg">45°</option>
            <option value="90deg">90°</option>
            <option value="180deg">180°</option>
          </select>
        </div>

        <div class="gradient-stops">
          <div v-for="(stop, index) in gradientStops" :key="index" class="gradient-stop">
            <div class="stop-color">
              <div 
                class="color-preview small" 
                :style="{ backgroundColor: stop.color }"
              ></div>
              <input 
                v-model="stop.color"
                @input="updateGradient"
                placeholder="#000000"
              />
            </div>
            <input 
              type="number" 
              v-model.number="stop.position"
              @input="updateGradient"
              min="0"
              max="100"
              class="stop-position"
            />
            <span>%</span>
            <button 
              v-if="gradientStops.length > 2"
              @click="removeGradientStop(index)"
              class="remove-stop"
            >
              <X :size="12" />
            </button>
          </div>
          <button @click="addGradientStop" class="add-stop">
            <Plus :size="14" /> Add Stop
          </button>
        </div>
      </div>

      <!-- Image -->
      <div v-if="bgType === 'image'" class="image-controls">
        <div class="property-group">
          <label>Image URL</label>
          <input 
            v-model="bgImage"
            @input="updateBackgroundImage"
            placeholder="https://..."
          />
        </div>

        <div class="property-row">
          <div class="property-group">
            <label>Size</label>
            <select v-model="bgSize" @change="updateBackgroundImage">
              <option value="auto">Auto</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="100% 100%">Stretch</option>
            </select>
          </div>
          <div class="property-group">
            <label>Position</label>
            <select v-model="bgPosition" @change="updateBackgroundImage">
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <div class="property-group">
          <label>Repeat</label>
          <select v-model="bgRepeat" @change="updateBackgroundImage">
            <option value="no-repeat">No Repeat</option>
            <option value="repeat">Repeat</option>
            <option value="repeat-x">Repeat X</option>
            <option value="repeat-y">Repeat Y</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Border -->
    <div class="property-section">
      <h4 class="section-title">
        <Square :size="14" />
        Border
      </h4>

      <div class="border-shortcuts">
        <button 
          v-for="preset in borderPresets"
          :key="preset.label"
          @click="applyBorderPreset(preset)"
          class="preset-btn"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="property-row">
        <div class="property-group">
          <label>Width</label>
          <input 
            type="number" 
            v-model.number="borderWidth"
            @input="updateBorder"
            min="0"
            placeholder="0"
          />
        </div>
        <div class="property-group">
          <label>Style</label>
          <select v-model="borderStyle" @change="updateBorder">
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
          </select>
        </div>
      </div>

      <div class="property-group">
        <label>Color</label>
        <div class="color-input">
          <div 
            class="color-preview" 
            :style="{ backgroundColor: borderColor }"
          ></div>
          <input 
            v-model="borderColor"
            @input="updateBorder"
            placeholder="#000000"
          />
        </div>
      </div>

      <!-- Border Radius -->
      <div class="property-group">
        <label>Border Radius</label>
        <div class="radius-controls">
          <div class="radius-input">
            <input 
              type="number" 
              v-model.number="borderRadius"
              @input="updateBorderRadius"
              min="0"
              placeholder="0"
            />
            <span>px</span>
          </div>
          <button 
            @click="uniformRadius = !uniformRadius"
            :class="{ active: !uniformRadius }"
            class="radius-toggle"
            title="Individual corners"
          >
            <Maximize2 :size="14" />
          </button>
        </div>

        <div v-if="!uniformRadius" class="individual-radius">
          <div class="radius-grid">
            <input 
              v-model.number="radiusTopLeft"
              @input="updateIndividualRadius"
              type="number"
              min="0"
              placeholder="TL"
            />
            <input 
              v-model.number="radiusTopRight"
              @input="updateIndividualRadius"
              type="number"
              min="0"
              placeholder="TR"
            />
            <input 
              v-model.number="radiusBottomLeft"
              @input="updateIndividualRadius"
              type="number"
              min="0"
              placeholder="BL"
            />
            <input 
              v-model.number="radiusBottomRight"
              @input="updateIndividualRadius"
              type="number"
              min="0"
              placeholder="BR"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Opacity -->
    <div class="property-section">
      <h4 class="section-title">
        <Eye :size="14" />
        Opacity
      </h4>
      <div class="property-group">
        <div class="slider-control">
          <input 
            type="range" 
            v-model.number="opacity"
            @input="updateOpacity"
            min="0"
            max="1"
            step="0.01"
          />
          <input 
            type="number" 
            v-model.number="opacity"
            @input="updateOpacity"
            min="0"
            max="1"
            step="0.01"
            class="slider-value"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { 
  Palette, Square, Eye, X, Plus, Maximize2 
} from 'lucide-vue-next';

const props = defineProps(['component', 'breakpoint']);
const emit = defineEmits(['update']);

// Background state
const bgType = ref('none');
const bgColor = ref('#ffffff');
const bgImage = ref('');
const bgSize = ref('cover');
const bgPosition = ref('center');
const bgRepeat = ref('no-repeat');
const gradientDirection = ref('to right');
const gradientStops = ref([
  { color: '#ffffff', position: 0 },
  { color: '#000000', position: 100 }
]);

// Border state
const borderWidth = ref(0);
const borderStyle = ref('solid');
const borderColor = ref('#000000');
const borderRadius = ref(0);
const uniformRadius = ref(true);
const radiusTopLeft = ref(0);
const radiusTopRight = ref(0);
const radiusBottomLeft = ref(0);
const radiusBottomRight = ref(0);

// Other state
const opacity = ref(1);

// Border presets
const borderPresets = [
  { label: 'None', width: 0, style: 'none' },
  { label: 'Thin', width: 1, style: 'solid' },
  { label: 'Medium', width: 2, style: 'solid' },
  { label: 'Thick', width: 4, style: 'solid' }
];

// Get current breakpoint styles
const currentStyles = computed(() => {
  if (!props.component?.styles) return {};
  return props.component.styles[props.breakpoint] || props.component.styles.base || {};
});

// Initialize values
watch([() => props.component, () => props.breakpoint], () => {
  if (currentStyles.value) {
    const styles = currentStyles.value;
    
    // Parse background
    if (styles.background || styles.backgroundColor || styles.backgroundImage) {
      if (styles.backgroundImage && styles.backgroundImage !== 'none') {
        bgType.value = 'image';
        bgImage.value = styles.backgroundImage.replace(/url\(['"]?(.+?)['"]?\)/, '$1');
        bgSize.value = styles.backgroundSize || 'cover';
        bgPosition.value = styles.backgroundPosition || 'center';
        bgRepeat.value = styles.backgroundRepeat || 'no-repeat';
      } else if (styles.background?.includes('gradient')) {
        bgType.value = 'gradient';
        parseGradient(styles.background);
      } else if (styles.backgroundColor || styles.background) {
        bgType.value = 'solid';
        bgColor.value = styles.backgroundColor || styles.background || '#ffffff';
      }
    }

    // Parse border
    if (styles.borderWidth) {
      borderWidth.value = parseInt(styles.borderWidth) || 0;
    }
    if (styles.borderStyle) {
      borderStyle.value = styles.borderStyle;
    }
    if (styles.borderColor) {
      borderColor.value = styles.borderColor;
    }

    // Parse border radius
    if (styles.borderRadius) {
      const value = parseInt(styles.borderRadius) || 0;
      borderRadius.value = value;
      uniformRadius.value = true;
    }

    // Parse opacity
    if (styles.opacity !== undefined) {
      opacity.value = parseFloat(styles.opacity);
    }
  }
}, { immediate: true });

// Update functions
function updateBackgroundType() {
  if (bgType.value === 'none') {
    updateStyle('background', 'none');
    updateStyle('backgroundColor', 'transparent');
    updateStyle('backgroundImage', 'none');
  } else if (bgType.value === 'solid') {
    updateBackgroundColor();
  } else if (bgType.value === 'gradient') {
    updateGradient();
  } else if (bgType.value === 'image') {
    updateBackgroundImage();
  }
}

function updateBackgroundColor() {
  updateStyle('background', bgColor.value);
  updateStyle('backgroundColor', bgColor.value);
  updateStyle('backgroundImage', 'none');
}

function updateGradient() {
  const stops = gradientStops.value
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');
  const gradient = `linear-gradient(${gradientDirection.value}, ${stops})`;
  updateStyle('background', gradient);
  updateStyle('backgroundImage', gradient);
}

function updateBackgroundImage() {
  if (bgImage.value) {
    updateStyle('backgroundImage', `url(${bgImage.value})`);
    updateStyle('backgroundSize', bgSize.value);
    updateStyle('backgroundPosition', bgPosition.value);
    updateStyle('backgroundRepeat', bgRepeat.value);
  }
}

function updateBorder() {
  if (borderWidth.value === 0 || borderStyle.value === 'none') {
    updateStyle('border', 'none');
  } else {
    updateStyle('border', `${borderWidth.value}px ${borderStyle.value} ${borderColor.value}`);
  }
}

function updateBorderRadius() {
  if (borderRadius.value === 0) {
    updateStyle('borderRadius', '0');
  } else {
    updateStyle('borderRadius', `${borderRadius.value}px`);
  }
}

function updateIndividualRadius() {
  const radius = `${radiusTopLeft.value}px ${radiusTopRight.value}px ${radiusBottomRight.value}px ${radiusBottomLeft.value}px`;
  updateStyle('borderRadius', radius);
}

function updateOpacity() {
  updateStyle('opacity', opacity.value.toString());
}

function applyBorderPreset(preset) {
  borderWidth.value = preset.width;
  borderStyle.value = preset.style;
  updateBorder();
}

function addGradientStop() {
  const lastStop = gradientStops.value[gradientStops.value.length - 1];
  const newPosition = Math.min(lastStop.position + 10, 100);
  gradientStops.value.push({
    color: '#888888',
    position: newPosition
  });
  updateGradient();
}

function removeGradientStop(index) {
  if (gradientStops.value.length > 2) {
    gradientStops.value.splice(index, 1);
    updateGradient();
  }
}

function parseGradient(gradientString) {
  // Simple gradient parser - can be enhanced
  const directionMatch = gradientString.match(/linear-gradient\(([^,]+),/);
  if (directionMatch) {
    gradientDirection.value = directionMatch[1].trim();
  }
}

function toggleColorPicker(type) {
  // Color picker toggle logic
}

function updateStyle(property, value) {
  emit('update', { [property]: value });
}
</script>

<style scoped>
.appearance-properties {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 4px;
}

.property-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-group label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.property-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.color-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.color-preview.small {
  width: 24px;
  height: 24px;
}

.color-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, #ddd 25%, transparent 25%), 
              linear-gradient(-45deg, #ddd 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #ddd 75%), 
              linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  opacity: 0.1;
}

.color-input input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

.clear-btn {
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
}

.gradient-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gradient-stops {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gradient-stop {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stop-color {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
}

.stop-position {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

.remove-stop {
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
}

.add-stop {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-stop:hover {
  background: var(--bg-secondary);
  border-color: var(--primary);
  color: var(--primary);
}

.image-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.border-shortcuts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.preset-btn {
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.radius-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.radius-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
}

.radius-input input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

.radius-toggle {
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
}

.radius-toggle.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.individual-radius {
  margin-top: 8px;
}

.radius-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.radius-grid input {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

.slider-control {
  display: flex;
  gap: 8px;
  align-items: center;
}

.slider-control input[type="range"] {
  flex: 1;
}

.slider-value {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

select {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  width: 100%;
}

input {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
  width: 100%;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
</style>