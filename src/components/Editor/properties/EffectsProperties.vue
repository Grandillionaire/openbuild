<template>
  <div class="effects-properties">
    <!-- Box Shadow -->
    <div class="property-section">
      <h4 class="section-title">
        <Droplet :size="14" />
        Box Shadow
      </h4>

      <div class="shadow-presets">
        <button 
          v-for="preset in shadowPresets"
          :key="preset.label"
          @click="applyShadowPreset(preset)"
          class="preset-btn"
          :title="preset.label"
        >
          <div class="shadow-preview" :style="{ boxShadow: preset.value }"></div>
        </button>
      </div>

      <div v-for="(shadow, index) in shadows" :key="index" class="shadow-item">
        <div class="shadow-header">
          <span>Shadow {{ index + 1 }}</span>
          <button v-if="shadows.length > 1" @click="removeShadow(index)" class="remove-btn">
            <X :size="12" />
          </button>
        </div>

        <div class="shadow-controls">
          <div class="property-row">
            <div class="property-group">
              <label>X Offset</label>
              <div class="input-unit">
                <input 
                  type="number" 
                  v-model.number="shadow.x"
                  @input="updateShadows"
                />
                <span>px</span>
              </div>
            </div>
            <div class="property-group">
              <label>Y Offset</label>
              <div class="input-unit">
                <input 
                  type="number" 
                  v-model.number="shadow.y"
                  @input="updateShadows"
                />
                <span>px</span>
              </div>
            </div>
          </div>

          <div class="property-row">
            <div class="property-group">
              <label>Blur</label>
              <div class="input-unit">
                <input 
                  type="number" 
                  v-model.number="shadow.blur"
                  @input="updateShadows"
                  min="0"
                />
                <span>px</span>
              </div>
            </div>
            <div class="property-group">
              <label>Spread</label>
              <div class="input-unit">
                <input 
                  type="number" 
                  v-model.number="shadow.spread"
                  @input="updateShadows"
                />
                <span>px</span>
              </div>
            </div>
          </div>

          <div class="property-group">
            <label>Color</label>
            <div class="color-input">
              <div 
                class="color-preview" 
                :style="{ backgroundColor: shadow.color }"
              ></div>
              <input 
                v-model="shadow.color"
                @input="updateShadows"
                placeholder="rgba(0,0,0,0.1)"
              />
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="shadow.inset"
                  @change="updateShadows"
                />
                Inset
              </label>
            </div>
          </div>
        </div>
      </div>

      <button @click="addShadow" class="add-btn">
        <Plus :size="14" /> Add Shadow
      </button>
    </div>

    <!-- Transform -->
    <div class="property-section">
      <h4 class="section-title">
        <Move3d :size="14" />
        Transform
      </h4>

      <div class="property-group">
        <label>Rotate</label>
        <div class="transform-controls">
          <input 
            type="range" 
            v-model.number="rotate"
            @input="updateTransform"
            min="-180"
            max="180"
            class="transform-slider"
          />
          <div class="input-unit">
            <input 
              type="number" 
              v-model.number="rotate"
              @input="updateTransform"
            />
            <span>°</span>
          </div>
        </div>
      </div>

      <div class="property-row">
        <div class="property-group">
          <label>Scale X</label>
          <input 
            type="number" 
            v-model.number="scaleX"
            @input="updateTransform"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
        <div class="property-group">
          <label>Scale Y</label>
          <input 
            type="number" 
            v-model.number="scaleY"
            @input="updateTransform"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      <div class="property-row">
        <div class="property-group">
          <label>Translate X</label>
          <div class="input-unit">
            <input 
              type="number" 
              v-model.number="translateX"
              @input="updateTransform"
            />
            <span>px</span>
          </div>
        </div>
        <div class="property-group">
          <label>Translate Y</label>
          <div class="input-unit">
            <input 
              type="number" 
              v-model.number="translateY"
              @input="updateTransform"
            />
            <span>px</span>
          </div>
        </div>
      </div>

      <div class="property-row">
        <div class="property-group">
          <label>Skew X</label>
          <div class="input-unit">
            <input 
              type="number" 
              v-model.number="skewX"
              @input="updateTransform"
              min="-90"
              max="90"
            />
            <span>°</span>
          </div>
        </div>
        <div class="property-group">
          <label>Skew Y</label>
          <div class="input-unit">
            <input 
              type="number" 
              v-model.number="skewY"
              @input="updateTransform"
              min="-90"
              max="90"
            />
            <span>°</span>
          </div>
        </div>
      </div>

      <button @click="resetTransform" class="reset-btn">
        <RotateCcw :size="14" /> Reset Transform
      </button>
    </div>

    <!-- Filters -->
    <div class="property-section">
      <h4 class="section-title">
        <Sparkles :size="14" />
        Filters
      </h4>

      <div class="filter-controls">
        <div class="property-group">
          <label>Blur</label>
          <div class="slider-control">
            <input 
              type="range" 
              v-model.number="filterBlur"
              @input="updateFilters"
              min="0"
              max="20"
            />
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="filterBlur"
                @input="updateFilters"
                min="0"
              />
              <span>px</span>
            </div>
          </div>
        </div>

        <div class="property-group">
          <label>Brightness</label>
          <div class="slider-control">
            <input 
              type="range" 
              v-model.number="brightness"
              @input="updateFilters"
              min="0"
              max="200"
            />
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="brightness"
                @input="updateFilters"
                min="0"
              />
              <span>%</span>
            </div>
          </div>
        </div>

        <div class="property-group">
          <label>Contrast</label>
          <div class="slider-control">
            <input 
              type="range" 
              v-model.number="contrast"
              @input="updateFilters"
              min="0"
              max="200"
            />
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="contrast"
                @input="updateFilters"
                min="0"
              />
              <span>%</span>
            </div>
          </div>
        </div>

        <div class="property-group">
          <label>Grayscale</label>
          <div class="slider-control">
            <input 
              type="range" 
              v-model.number="grayscale"
              @input="updateFilters"
              min="0"
              max="100"
            />
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="grayscale"
                @input="updateFilters"
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
          </div>
        </div>

        <div class="property-group">
          <label>Saturate</label>
          <div class="slider-control">
            <input 
              type="range" 
              v-model.number="saturate"
              @input="updateFilters"
              min="0"
              max="200"
            />
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="saturate"
                @input="updateFilters"
                min="0"
              />
              <span>%</span>
            </div>
          </div>
        </div>

        <div class="property-group">
          <label>Hue Rotate</label>
          <div class="slider-control">
            <input 
              type="range" 
              v-model.number="hueRotate"
              @input="updateFilters"
              min="0"
              max="360"
            />
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="hueRotate"
                @input="updateFilters"
                min="0"
                max="360"
              />
              <span>°</span>
            </div>
          </div>
        </div>

        <button @click="resetFilters" class="reset-btn">
          <RotateCcw :size="14" /> Reset Filters
        </button>
      </div>
    </div>

    <!-- Backdrop Filter -->
    <div class="property-section">
      <h4 class="section-title">
        <Layers :size="14" />
        Backdrop Filter
      </h4>

      <div class="property-group">
        <label>Backdrop Blur</label>
        <div class="slider-control">
          <input 
            type="range" 
            v-model.number="backdropBlur"
            @input="updateBackdropFilter"
            min="0"
            max="20"
          />
          <div class="input-unit">
            <input 
              type="number" 
              v-model.number="backdropBlur"
              @input="updateBackdropFilter"
              min="0"
            />
            <span>px</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mix Blend Mode -->
    <div class="property-section">
      <h4 class="section-title">
        <Palette :size="14" />
        Blend Mode
      </h4>
      
      <div class="property-group">
        <select v-model="mixBlendMode" @change="updateBlendMode">
          <option value="normal">Normal</option>
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
          <option value="darken">Darken</option>
          <option value="lighten">Lighten</option>
          <option value="color-dodge">Color Dodge</option>
          <option value="color-burn">Color Burn</option>
          <option value="hard-light">Hard Light</option>
          <option value="soft-light">Soft Light</option>
          <option value="difference">Difference</option>
          <option value="exclusion">Exclusion</option>
          <option value="hue">Hue</option>
          <option value="saturation">Saturation</option>
          <option value="color">Color</option>
          <option value="luminosity">Luminosity</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { 
  Droplet, Move3d, Sparkles, Layers, Palette, 
  X, Plus, RotateCcw 
} from 'lucide-vue-next';

const props = defineProps(['component', 'breakpoint']);
const emit = defineEmits(['update']);

// Shadow state
const shadows = ref([
  { x: 0, y: 0, blur: 0, spread: 0, color: 'rgba(0,0,0,0.1)', inset: false }
]);

const shadowPresets = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: '0 1px 3px rgba(0,0,0,0.12)' },
  { label: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
  { label: 'Large', value: '0 10px 15px rgba(0,0,0,0.1)' },
  { label: 'Glow', value: '0 0 20px rgba(59,130,246,0.5)' }
];

// Transform state
const rotate = ref(0);
const scaleX = ref(1);
const scaleY = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const skewX = ref(0);
const skewY = ref(0);

// Filter state
const filterBlur = ref(0);
const brightness = ref(100);
const contrast = ref(100);
const grayscale = ref(0);
const saturate = ref(100);
const hueRotate = ref(0);

// Other effects
const backdropBlur = ref(0);
const mixBlendMode = ref('normal');

// Get current breakpoint styles
const currentStyles = computed(() => {
  if (!props.component?.styles) return {};
  return props.component.styles[props.breakpoint] || props.component.styles.base || {};
});

// Initialize values
watch([() => props.component, () => props.breakpoint], () => {
  if (currentStyles.value) {
    const styles = currentStyles.value;
    
    // Parse box shadow
    if (styles.boxShadow && styles.boxShadow !== 'none') {
      parseShadows(styles.boxShadow);
    }

    // Parse transform
    if (styles.transform && styles.transform !== 'none') {
      parseTransform(styles.transform);
    }

    // Parse filter
    if (styles.filter && styles.filter !== 'none') {
      parseFilters(styles.filter);
    }

    // Parse backdrop filter
    if (styles.backdropFilter) {
      const match = styles.backdropFilter.match(/blur\((\d+)px\)/);
      if (match) {
        backdropBlur.value = parseInt(match[1]);
      }
    }

    // Mix blend mode
    if (styles.mixBlendMode) {
      mixBlendMode.value = styles.mixBlendMode;
    }
  }
}, { immediate: true });

// Shadow functions
function updateShadows() {
  const shadowValues = shadows.value
    .map(s => `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`)
    .join(', ');
  updateStyle('boxShadow', shadowValues || 'none');
}

function addShadow() {
  shadows.value.push({
    x: 0, y: 4, blur: 6, spread: 0, 
    color: 'rgba(0,0,0,0.1)', inset: false
  });
  updateShadows();
}

function removeShadow(index) {
  shadows.value.splice(index, 1);
  updateShadows();
}

function applyShadowPreset(preset) {
  if (preset.value === 'none') {
    shadows.value = [{ x: 0, y: 0, blur: 0, spread: 0, color: 'rgba(0,0,0,0.1)', inset: false }];
  } else {
    // Parse preset shadow - simplified
    shadows.value = [{
      x: 0, y: 4, blur: 6, spread: 0, 
      color: 'rgba(0,0,0,0.1)', inset: false
    }];
  }
  updateShadows();
}

// Transform functions
function updateTransform() {
  const transforms = [];
  
  if (rotate.value !== 0) transforms.push(`rotate(${rotate.value}deg)`);
  if (scaleX.value !== 1 || scaleY.value !== 1) {
    transforms.push(`scale(${scaleX.value}, ${scaleY.value})`);
  }
  if (translateX.value !== 0 || translateY.value !== 0) {
    transforms.push(`translate(${translateX.value}px, ${translateY.value}px)`);
  }
  if (skewX.value !== 0 || skewY.value !== 0) {
    transforms.push(`skew(${skewX.value}deg, ${skewY.value}deg)`);
  }

  updateStyle('transform', transforms.length ? transforms.join(' ') : 'none');
}

function resetTransform() {
  rotate.value = 0;
  scaleX.value = 1;
  scaleY.value = 1;
  translateX.value = 0;
  translateY.value = 0;
  skewX.value = 0;
  skewY.value = 0;
  updateTransform();
}

// Filter functions
function updateFilters() {
  const filters = [];
  
  if (filterBlur.value > 0) filters.push(`blur(${filterBlur.value}px)`);
  if (brightness.value !== 100) filters.push(`brightness(${brightness.value}%)`);
  if (contrast.value !== 100) filters.push(`contrast(${contrast.value}%)`);
  if (grayscale.value > 0) filters.push(`grayscale(${grayscale.value}%)`);
  if (saturate.value !== 100) filters.push(`saturate(${saturate.value}%)`);
  if (hueRotate.value > 0) filters.push(`hue-rotate(${hueRotate.value}deg)`);

  updateStyle('filter', filters.length ? filters.join(' ') : 'none');
}

function resetFilters() {
  filterBlur.value = 0;
  brightness.value = 100;
  contrast.value = 100;
  grayscale.value = 0;
  saturate.value = 100;
  hueRotate.value = 0;
  updateFilters();
}

// Other effects
function updateBackdropFilter() {
  const value = backdropBlur.value > 0 ? `blur(${backdropBlur.value}px)` : 'none';
  updateStyle('backdropFilter', value);
  updateStyle('-webkit-backdrop-filter', value);
}

function updateBlendMode() {
  updateStyle('mixBlendMode', mixBlendMode.value);
}

// Parse functions
function parseShadows(shadowString) {
  // Simplified shadow parser
  shadows.value = [{
    x: 0, y: 4, blur: 6, spread: 0, 
    color: 'rgba(0,0,0,0.1)', inset: false
  }];
}

function parseTransform(transformString) {
  // Simplified transform parser
  const rotateMatch = transformString.match(/rotate\(([-\d.]+)deg\)/);
  if (rotateMatch) rotate.value = parseFloat(rotateMatch[1]);
  
  const scaleMatch = transformString.match(/scale\(([-\d.]+),?\s*([-\d.]+)?\)/);
  if (scaleMatch) {
    scaleX.value = parseFloat(scaleMatch[1]);
    scaleY.value = scaleMatch[2] ? parseFloat(scaleMatch[2]) : scaleX.value;
  }
}

function parseFilters(filterString) {
  const blurMatch = filterString.match(/blur\((\d+)px\)/);
  if (blurMatch) filterBlur.value = parseInt(blurMatch[1]);
  
  const brightnessMatch = filterString.match(/brightness\((\d+)%\)/);
  if (brightnessMatch) brightness.value = parseInt(brightnessMatch[1]);
}

function updateStyle(property, value) {
  emit('update', { [property]: value });
}
</script>

<style scoped>
.effects-properties {
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
  gap: 8px;
}

.shadow-presets {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.preset-btn {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--primary);
}

.shadow-preview {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 4px;
  margin: 0 auto;
}

.shadow-item {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
}

.shadow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 500;
}

.shadow-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shadow-controls .property-row {
  gap: 6px;
}

.shadow-controls .property-group {
  min-width: 0; /* Allow flex items to shrink */
}

.input-unit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-unit input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

.input-unit span {
  font-size: 11px;
  color: #666;
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
}

.color-input input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
  cursor: pointer;
}

.add-btn, .reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover, .reset-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--primary);
  color: var(--primary);
}

.remove-btn {
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
}

.transform-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.transform-slider {
  flex: 1;
}

.slider-control {
  display: flex;
  gap: 8px;
  align-items: center;
}

.slider-control input[type="range"] {
  flex: 1;
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

select {
  padding: 8px 12px;
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

input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
}
</style>