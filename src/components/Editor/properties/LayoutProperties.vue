<template>
  <div class="layout-properties">
    <!-- Display Property -->
    <div class="property-group">
      <label>Display</label>
      <div class="display-options">
        <button 
          v-for="option in displayOptions" 
          :key="option.value"
          @click="updateDisplay(option.value)"
          :class="['display-btn', { active: display === option.value }]"
          :title="option.label"
        >
          <component :is="option.icon" :size="16" />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- Dimensions -->
    <div class="property-group">
      <label>Size</label>
      <div class="dimension-inputs">
        <div class="input-group">
          <span class="input-label">W</span>
          <input 
            v-model="width" 
            @input="updateStyles({ width })"
            placeholder="auto"
          />
          <select v-model="widthUnit" @change="updateWidthUnit" class="unit-select">
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="vw">vw</option>
            <option value="auto">auto</option>
          </select>
        </div>
        <div class="input-group">
          <span class="input-label">H</span>
          <input 
            v-model="height" 
            @input="updateStyles({ height })"
            placeholder="auto"
          />
          <select v-model="heightUnit" @change="updateHeightUnit" class="unit-select">
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="vh">vh</option>
            <option value="auto">auto</option>
          </select>
        </div>
      </div>

      <!-- Min/Max dimensions -->
      <div class="constraints">
        <button 
          @click="showConstraints = !showConstraints" 
          class="toggle-btn"
        >
          <ChevronRight :size="12" :class="{ rotated: showConstraints }" />
          Constraints
        </button>
        
        <div v-if="showConstraints" class="constraint-inputs">
          <div class="input-group">
            <span class="input-label">Min W</span>
            <input 
              v-model="minWidth" 
              @input="updateStyles({ minWidth })"
              placeholder="0"
            />
          </div>
          <div class="input-group">
            <span class="input-label">Max W</span>
            <input 
              v-model="maxWidth" 
              @input="updateStyles({ maxWidth })"
              placeholder="none"
            />
          </div>
          <div class="input-group">
            <span class="input-label">Min H</span>
            <input 
              v-model="minHeight" 
              @input="updateStyles({ minHeight })"
              placeholder="0"
            />
          </div>
          <div class="input-group">
            <span class="input-label">Max H</span>
            <input 
              v-model="maxHeight" 
              @input="updateStyles({ maxHeight })"
              placeholder="none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Flexbox Properties -->
    <div v-if="display === 'flex'" class="property-group">
      <label>Flex Layout</label>
      
      <!-- Direction -->
      <div class="flex-controls">
        <span class="control-label">Direction</span>
        <div class="button-group">
          <button 
            v-for="dir in flexDirections" 
            :key="dir.value"
            @click="updateStyles({ flexDirection: dir.value })"
            :class="{ active: flexDirection === dir.value }"
            :title="dir.label"
          >
            <component :is="dir.icon" :size="14" />
          </button>
        </div>
      </div>

      <!-- Justify -->
      <div class="flex-controls">
        <span class="control-label">Justify</span>
        <div class="button-group">
          <button 
            v-for="justify in justifyOptions" 
            :key="justify.value"
            @click="updateStyles({ justifyContent: justify.value })"
            :class="{ active: justifyContent === justify.value }"
            :title="justify.label"
          >
            <component :is="justify.icon" :size="14" />
          </button>
        </div>
      </div>

      <!-- Align -->
      <div class="flex-controls">
        <span class="control-label">Align</span>
        <div class="button-group">
          <button 
            v-for="align in alignOptions" 
            :key="align.value"
            @click="updateStyles({ alignItems: align.value })"
            :class="{ active: alignItems === align.value }"
            :title="align.label"
          >
            <component :is="align.icon" :size="14" />
          </button>
        </div>
      </div>

      <!-- Wrap -->
      <div class="flex-controls">
        <span class="control-label">Wrap</span>
        <label class="checkbox">
          <input 
            type="checkbox" 
            :checked="flexWrap === 'wrap'"
            @change="updateStyles({ flexWrap: $event.target.checked ? 'wrap' : 'nowrap' })"
          />
          Allow wrapping
        </label>
      </div>
    </div>

    <!-- Grid Properties -->
    <div v-if="display === 'grid'" class="property-group">
      <label>Grid Layout</label>
      
      <div class="grid-inputs">
        <div class="input-group">
          <span class="input-label">Columns</span>
          <input 
            v-model="gridCols" 
            @input="updateGridColumns"
            placeholder="1fr"
          />
        </div>
        <div class="input-group">
          <span class="input-label">Rows</span>
          <input 
            v-model="gridRows" 
            @input="updateGridRows"
            placeholder="auto"
          />
        </div>
      </div>

      <!-- Quick grid templates -->
      <div class="grid-templates">
        <button 
          v-for="template in gridTemplates" 
          :key="template.value"
          @click="applyGridTemplate(template)"
          class="template-btn"
        >
          {{ template.label }}
        </button>
      </div>
    </div>

    <!-- Position -->
    <div class="property-group">
      <label>Position</label>
      <select 
        v-model="position" 
        @change="updatePosition"
        class="full-select"
      >
        <option value="static">Static</option>
        <option value="relative">Relative</option>
        <option value="absolute">Absolute</option>
        <option value="fixed">Fixed</option>
        <option value="sticky">Sticky</option>
      </select>

      <!-- Position values -->
      <div v-if="position !== 'static'" class="position-inputs">
        <div class="input-row">
          <div class="input-group">
            <span class="input-label">Top</span>
            <input 
              v-model="positionTop" 
              @input="updateStyles({ top: positionTop })"
              placeholder="auto"
            />
          </div>
          <div class="input-group">
            <span class="input-label">Right</span>
            <input 
              v-model="positionRight" 
              @input="updateStyles({ right: positionRight })"
              placeholder="auto"
            />
          </div>
        </div>
        <div class="input-row">
          <div class="input-group">
            <span class="input-label">Bottom</span>
            <input 
              v-model="positionBottom" 
              @input="updateStyles({ bottom: positionBottom })"
              placeholder="auto"
            />
          </div>
          <div class="input-group">
            <span class="input-label">Left</span>
            <input 
              v-model="positionLeft" 
              @input="updateStyles({ left: positionLeft })"
              placeholder="auto"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Overflow -->
    <div class="property-group">
      <label>Overflow</label>
      <div class="overflow-controls">
        <select 
          v-model="overflow" 
          @change="updateStyles({ overflow })"
          class="overflow-select"
        >
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="scroll">Scroll</option>
          <option value="auto">Auto</option>
        </select>
        <button 
          @click="showOverflowXY = !showOverflowXY" 
          class="toggle-btn small"
          title="Separate X/Y overflow"
        >
          <Settings2 :size="12" />
        </button>
      </div>

      <div v-if="showOverflowXY" class="overflow-xy">
        <div class="input-group">
          <span class="input-label">X</span>
          <select 
            v-model="overflowX" 
            @change="updateStyles({ overflowX })"
          >
            <option value="">Default</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="scroll">Scroll</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div class="input-group">
          <span class="input-label">Y</span>
          <select 
            v-model="overflowY" 
            @change="updateStyles({ overflowY })"
          >
            <option value="">Default</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="scroll">Scroll</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  Layout,
  Square,
  Columns,
  Grid3x3,
  Type,
  Eye,
  ChevronRight,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Settings2
} from 'lucide-vue-next';
import type { Component } from '@/types/component';

const props = defineProps<{
  component: Component;
  breakpoint: 'base' | 'sm' | 'md' | 'lg' | 'xl';
}>();

const emit = defineEmits<{
  update: [styles: Record<string, any>];
}>();

// State
const showConstraints = ref(false);
const showOverflowXY = ref(false);

// Current styles
const styles = computed(() => 
  props.component.styles[props.breakpoint] || props.component.styles.base || {}
);

// Layout properties
const display = computed(() => styles.value.display || 'block');
const width = ref('');
const height = ref('');
const widthUnit = ref('px');
const heightUnit = ref('px');
const minWidth = ref('');
const maxWidth = ref('');
const minHeight = ref('');
const maxHeight = ref('');

// Position properties
const position = ref('static');
const positionTop = ref('');
const positionRight = ref('');
const positionBottom = ref('');
const positionLeft = ref('');

// Flex properties
const flexDirection = computed(() => styles.value.flexDirection || 'row');
const justifyContent = computed(() => styles.value.justifyContent || 'flex-start');
const alignItems = computed(() => styles.value.alignItems || 'stretch');
const flexWrap = computed(() => styles.value.flexWrap || 'nowrap');

// Grid properties
const gridCols = ref('');
const gridRows = ref('');

// Overflow
const overflow = ref('visible');
const overflowX = ref('');
const overflowY = ref('');

// Options
const displayOptions = [
  { value: 'block', label: 'Block', icon: Square },
  { value: 'flex', label: 'Flex', icon: Columns },
  { value: 'grid', label: 'Grid', icon: Grid3x3 },
  { value: 'inline-block', label: 'Inline', icon: Type },
  { value: 'none', label: 'None', icon: Eye }
];

const flexDirections = [
  { value: 'row', label: 'Row', icon: ArrowRight },
  { value: 'row-reverse', label: 'Row Reverse', icon: ArrowLeft },
  { value: 'column', label: 'Column', icon: ArrowDown },
  { value: 'column-reverse', label: 'Column Reverse', icon: ArrowUp }
];

const justifyOptions = [
  { value: 'flex-start', label: 'Start', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'flex-end', label: 'End', icon: AlignRight },
  { value: 'space-between', label: 'Space Between', icon: AlignCenter },
  { value: 'space-around', label: 'Space Around', icon: AlignCenter }
];

const alignOptions = [
  { value: 'flex-start', label: 'Start', icon: AlignStartVertical },
  { value: 'center', label: 'Center', icon: AlignCenterVertical },
  { value: 'flex-end', label: 'End', icon: AlignEndVertical },
  { value: 'stretch', label: 'Stretch', icon: AlignCenterVertical }
];

const gridTemplates = [
  { label: '2 cols', value: 'repeat(2, 1fr)' },
  { label: '3 cols', value: 'repeat(3, 1fr)' },
  { label: '4 cols', value: 'repeat(4, 1fr)' },
  { label: 'Auto fit', value: 'repeat(auto-fit, minmax(200px, 1fr))' }
];

// Initialize values
watch(() => props.component, () => {
  const currentStyles = styles.value;
  
  // Parse dimensions
  const widthStr = currentStyles.width || '';
  const heightStr = currentStyles.height || '';
  
  width.value = widthStr.replace(/[^0-9.-]/g, '');
  height.value = heightStr.replace(/[^0-9.-]/g, '');
  
  minWidth.value = currentStyles.minWidth || '';
  maxWidth.value = currentStyles.maxWidth || '';
  minHeight.value = currentStyles.minHeight || '';
  maxHeight.value = currentStyles.maxHeight || '';
  
  position.value = currentStyles.position || 'static';
  positionTop.value = currentStyles.top || '';
  positionRight.value = currentStyles.right || '';
  positionBottom.value = currentStyles.bottom || '';
  positionLeft.value = currentStyles.left || '';
  
  gridCols.value = currentStyles.gridTemplateColumns || '';
  gridRows.value = currentStyles.gridTemplateRows || '';
  
  overflow.value = currentStyles.overflow || 'visible';
  overflowX.value = currentStyles.overflowX || '';
  overflowY.value = currentStyles.overflowY || '';
}, { immediate: true });

// Update functions
function updateStyles(updates: Record<string, any>) {
  emit('update', updates);
}

function updateDisplay(value: string) {
  updateStyles({ display: value });
}

function updateWidthUnit() {
  if (widthUnit.value === 'auto') {
    updateStyles({ width: 'auto' });
  } else if (width.value) {
    updateStyles({ width: width.value + widthUnit.value });
  }
}

function updateHeightUnit() {
  if (heightUnit.value === 'auto') {
    updateStyles({ height: 'auto' });
  } else if (height.value) {
    updateStyles({ height: height.value + heightUnit.value });
  }
}

function updatePosition() {
  updateStyles({ position: position.value });
}

function updateGridColumns() {
  updateStyles({ gridTemplateColumns: gridCols.value });
}

function updateGridRows() {
  updateStyles({ gridTemplateRows: gridRows.value });
}

function applyGridTemplate(template: { value: string }) {
  gridCols.value = template.value;
  updateGridColumns();
}
</script>

<style scoped>
.layout-properties {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.property-group label {
  font-size: 12px;
  font-weight: 600;
  color: #4B5563;
}

/* Display Options */
.display-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.display-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 11px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.display-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.display-btn.active {
  background: #EFF6FF;
  border-color: #3B82F6;
  color: #3B82F6;
}

/* Input Groups */
.dimension-inputs,
.constraint-inputs,
.grid-inputs,
.input-row,
.overflow-xy {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-label {
  font-size: 11px;
  color: #9CA3AF;
  min-width: 30px;
}

.input-group input,
.input-group select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #3B82F6;
}

.unit-select {
  width: 60px;
  flex: none;
}

/* Constraints */
.constraints {
  margin-top: 8px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  font-size: 12px;
  color: #6B7280;
  cursor: pointer;
  transition: color 0.2s;
}

.toggle-btn:hover {
  color: #4B5563;
}

.toggle-btn.small {
  padding: 4px;
}

.toggle-btn svg {
  transition: transform 0.2s;
}

.toggle-btn svg.rotated {
  transform: rotate(90deg);
}

.constraint-inputs {
  margin-top: 8px;
}

/* Flex Controls */
.flex-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-label {
  font-size: 11px;
  color: #6B7280;
  min-width: 60px;
}

.button-group {
  display: flex;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  overflow: hidden;
  flex: 1;
}

.button-group button {
  flex: 1;
  padding: 6px 8px;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.button-group button:not(:last-child) {
  border-right: 1px solid #E5E7EB;
}

.button-group button:hover {
  background: #F9FAFB;
}

.button-group button.active {
  background: #EFF6FF;
  color: #3B82F6;
}

/* Checkbox */
.checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #4B5563;
  cursor: pointer;
}

.checkbox input {
  cursor: pointer;
}

/* Grid Templates */
.grid-templates {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.template-btn {
  padding: 4px 8px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  font-size: 11px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

/* Full Select */
.full-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

.full-select:focus {
  border-color: #3B82F6;
}

/* Position Inputs */
.position-inputs {
  margin-top: 8px;
}

/* Overflow */
.overflow-controls {
  display: flex;
  gap: 8px;
}

.overflow-select {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

.overflow-select:focus {
  border-color: #3B82F6;
}
</style>