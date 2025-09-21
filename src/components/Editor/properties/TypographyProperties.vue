<template>
  <div class="typography-properties">
    <!-- Font Family -->
    <div class="property-group">
      <label>Font Family</label>
      <div class="font-selector">
        <select v-model="fontFamily" @change="updateFontFamily">
          <option value="inherit">Inherit</option>
          <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">System</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Monaco, monospace">Monaco</option>
          <option value="custom">Custom...</option>
        </select>
        <input 
          v-if="fontFamily === 'custom'"
          v-model="customFont"
          @input="updateCustomFont"
          placeholder="Enter font family"
          class="custom-font-input"
        />
      </div>
    </div>

    <!-- Font Size & Line Height -->
    <div class="property-row">
      <div class="property-group">
        <label>Size</label>
        <div class="input-unit">
          <input 
            type="number" 
            v-model.number="fontSize"
            @input="updateFontSize"
            min="0"
          />
          <select v-model="fontSizeUnit" @change="updateFontSize">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="%">%</option>
            <option value="vw">vw</option>
          </select>
        </div>
      </div>
      <div class="property-group">
        <label>Line Height</label>
        <div class="input-unit">
          <input 
            type="number" 
            v-model.number="lineHeight"
            @input="updateLineHeight"
            min="0"
            step="0.1"
          />
          <select v-model="lineHeightUnit" @change="updateLineHeight">
            <option value="">-</option>
            <option value="px">px</option>
            <option value="%">%</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Font Weight & Style -->
    <div class="property-row">
      <div class="property-group">
        <label>Weight</label>
        <select v-model="fontWeight" @change="updateFontWeight">
          <option value="100">100 - Thin</option>
          <option value="200">200 - Extra Light</option>
          <option value="300">300 - Light</option>
          <option value="400">400 - Regular</option>
          <option value="500">500 - Medium</option>
          <option value="600">600 - Semi Bold</option>
          <option value="700">700 - Bold</option>
          <option value="800">800 - Extra Bold</option>
          <option value="900">900 - Black</option>
        </select>
      </div>
      <div class="property-group">
        <label>Style</label>
        <div class="button-group">
          <button 
            @click="toggleStyle('italic')"
            :class="{ active: isItalic }"
            title="Italic"
          >
            <Italic :size="14" />
          </button>
          <button 
            @click="toggleStyle('underline')"
            :class="{ active: isUnderline }"
            title="Underline"
          >
            <Underline :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- Text Alignment -->
    <div class="property-group">
      <label>Text Align</label>
      <div class="button-group full-width">
        <button 
          v-for="align in ['left', 'center', 'right', 'justify']"
          :key="align"
          @click="updateTextAlign(align)"
          :class="{ active: textAlign === align }"
          :title="align"
        >
          <component :is="getAlignIcon(align)" :size="14" />
        </button>
      </div>
    </div>

    <!-- Letter & Word Spacing -->
    <div class="property-row">
      <div class="property-group">
        <label>Letter Spacing</label>
        <div class="input-unit">
          <input 
            type="number" 
            v-model.number="letterSpacing"
            @input="updateLetterSpacing"
            step="0.1"
          />
          <select v-model="letterSpacingUnit" @change="updateLetterSpacing">
            <option value="px">px</option>
            <option value="em">em</option>
          </select>
        </div>
      </div>
      <div class="property-group">
        <label>Word Spacing</label>
        <div class="input-unit">
          <input 
            type="number" 
            v-model.number="wordSpacing"
            @input="updateWordSpacing"
            step="0.1"
          />
          <select v-model="wordSpacingUnit" @change="updateWordSpacing">
            <option value="px">px</option>
            <option value="em">em</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Text Transform & Decoration -->
    <div class="property-group">
      <label>Transform</label>
      <select v-model="textTransform" @change="updateTextTransform">
        <option value="none">None</option>
        <option value="uppercase">UPPERCASE</option>
        <option value="lowercase">lowercase</option>
        <option value="capitalize">Capitalize</option>
      </select>
    </div>

    <!-- Text Color -->
    <div class="property-group">
      <label>Color</label>
      <div class="color-input">
        <div 
          class="color-preview" 
          :style="{ backgroundColor: textColor }"
          @click="showColorPicker = !showColorPicker"
        ></div>
        <input 
          v-model="textColor"
          @input="updateTextColor"
          placeholder="#000000"
        />
        <!-- Simple color picker would go here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify 
} from 'lucide-vue-next';

const props = defineProps(['component', 'breakpoint']);
const emit = defineEmits(['update']);

// Typography state
const fontFamily = ref('inherit');
const customFont = ref('');
const fontSize = ref(16);
const fontSizeUnit = ref('px');
const lineHeight = ref(1.5);
const lineHeightUnit = ref('');
const fontWeight = ref('400');
const letterSpacing = ref(0);
const letterSpacingUnit = ref('px');
const wordSpacing = ref(0);
const wordSpacingUnit = ref('px');
const textAlign = ref('left');
const textTransform = ref('none');
const textColor = ref('#000000');
const showColorPicker = ref(false);

// Computed properties
const currentStyles = computed(() => {
  if (!props.component?.styles) return {};
  return props.component.styles[props.breakpoint] || props.component.styles.base || {};
});

const isItalic = computed(() => {
  return currentStyles.value.fontStyle === 'italic';
});

const isUnderline = computed(() => {
  return currentStyles.value.textDecoration?.includes('underline');
});

// Initialize values
watch([() => props.component, () => props.breakpoint], () => {
  if (currentStyles.value) {
    const styles = currentStyles.value;
    
    // Parse font family
    if (styles.fontFamily) {
      const isCustom = !['inherit', '-apple-system', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Monaco'].some(
        font => styles.fontFamily.includes(font)
      );
      if (isCustom) {
        fontFamily.value = 'custom';
        customFont.value = styles.fontFamily;
      } else {
        fontFamily.value = styles.fontFamily;
      }
    }

    // Parse font size
    if (styles.fontSize) {
      const match = styles.fontSize.match(/^([\d.]+)(.*)$/);
      if (match) {
        fontSize.value = parseFloat(match[1]);
        fontSizeUnit.value = match[2] || 'px';
      }
    }

    // Parse line height
    if (styles.lineHeight) {
      const match = styles.lineHeight.toString().match(/^([\d.]+)(.*)$/);
      if (match) {
        lineHeight.value = parseFloat(match[1]);
        lineHeightUnit.value = match[2] || '';
      }
    }

    // Other properties
    fontWeight.value = styles.fontWeight || '400';
    textAlign.value = styles.textAlign || 'left';
    textTransform.value = styles.textTransform || 'none';
    textColor.value = styles.color || '#000000';

    // Parse letter spacing
    if (styles.letterSpacing) {
      const match = styles.letterSpacing.match(/^([\d.-]+)(.*)$/);
      if (match) {
        letterSpacing.value = parseFloat(match[1]);
        letterSpacingUnit.value = match[2] || 'px';
      }
    }
  }
}, { immediate: true });

// Update functions
function updateFontFamily() {
  const value = fontFamily.value === 'custom' ? customFont.value : fontFamily.value;
  updateStyle('fontFamily', value);
}

function updateCustomFont() {
  if (fontFamily.value === 'custom') {
    updateStyle('fontFamily', customFont.value);
  }
}

function updateFontSize() {
  const value = fontSize.value + fontSizeUnit.value;
  updateStyle('fontSize', value);
}

function updateLineHeight() {
  const value = lineHeightUnit.value ? lineHeight.value + lineHeightUnit.value : lineHeight.value;
  updateStyle('lineHeight', value);
}

function updateFontWeight() {
  updateStyle('fontWeight', fontWeight.value);
}

function updateLetterSpacing() {
  const value = letterSpacing.value + letterSpacingUnit.value;
  updateStyle('letterSpacing', value);
}

function updateWordSpacing() {
  const value = wordSpacing.value + wordSpacingUnit.value;
  updateStyle('wordSpacing', value);
}

function updateTextAlign(align) {
  textAlign.value = align;
  updateStyle('textAlign', align);
}

function updateTextTransform() {
  updateStyle('textTransform', textTransform.value);
}

function updateTextColor() {
  updateStyle('color', textColor.value);
}

function toggleStyle(style) {
  if (style === 'italic') {
    const value = isItalic.value ? 'normal' : 'italic';
    updateStyle('fontStyle', value);
  } else if (style === 'underline') {
    const value = isUnderline.value ? 'none' : 'underline';
    updateStyle('textDecoration', value);
  }
}

function updateStyle(property, value) {
  emit('update', { [property]: value });
}

function getAlignIcon(align) {
  const icons = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify
  };
  return icons[align];
}
</script>

<style scoped>
.typography-properties {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px;
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

.font-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.font-selector select {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
}

.custom-font-input {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
}

.input-unit {
  display: flex;
  gap: 4px;
}

.input-unit input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 13px;
  min-width: 0;
}

.input-unit select {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  font-size: 11px;
  color: var(--text-primary);
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 4px;
}

.button-group.full-width {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.button-group button {
  flex: 1;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.button-group button:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.button-group button.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
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
</style>