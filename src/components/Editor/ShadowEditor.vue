<template>
  <div class="shadow-editor">
    <div class="editor-header">
      <h4>Box Shadow Editor</h4>
      <button @click="$emit('close')" class="close-btn">
        <X :size="16" />
      </button>
    </div>

    <!-- Shadow Preview -->
    <div class="shadow-preview-container">
      <div class="preview-box" :style="{ boxShadow: shadowString }">
        <div class="preview-label">Preview</div>
      </div>
    </div>

    <!-- Shadow Layers List -->
    <div class="editor-section">
      <div class="section-header-with-action">
        <label>Shadow Layers</label>
        <button @click="addShadow" class="add-btn">
          <Plus :size="14" />
          Add Shadow
        </button>
      </div>

      <div v-if="shadows.length === 0" class="empty-state">
        <Layers :size="32" />
        <p>No shadows yet</p>
        <span class="hint">Add a shadow to get started</span>
      </div>

      <div v-else class="shadows-list">
        <div
          v-for="(shadow, index) in shadows"
          :key="index"
          :class="['shadow-item', { active: selectedIndex === index, disabled: !shadow.enabled }]"
          @click="selectedIndex = index"
        >
          <!-- Shadow Preview Thumbnail -->
          <div class="shadow-thumbnail">
            <div class="thumbnail-box" :style="{ boxShadow: getShadowString(shadow) }"></div>
          </div>

          <!-- Shadow Info -->
          <div class="shadow-info">
            <div class="shadow-name">
              {{ shadow.inset ? 'Inner' : 'Outer' }} Shadow {{ index + 1 }}
            </div>
            <div class="shadow-values">
              {{ shadow.offsetX }}px {{ shadow.offsetY }}px {{ shadow.blur }}px {{ shadow.spread }}px
            </div>
          </div>

          <!-- Actions -->
          <div class="shadow-actions">
            <button
              @click.stop="toggleShadow(index)"
              class="action-btn"
              :title="shadow.enabled ? 'Disable' : 'Enable'"
            >
              <component :is="shadow.enabled ? Eye : EyeOff" :size="14" />
            </button>
            <button
              @click.stop="duplicateShadow(index)"
              class="action-btn"
              title="Duplicate"
            >
              <Copy :size="14" />
            </button>
            <button
              @click.stop="removeShadow(index)"
              class="action-btn delete"
              title="Delete"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Shadow Controls -->
    <div v-if="selectedShadow" class="editor-section">
      <label>Shadow Properties</label>

      <div class="controls-grid">
        <!-- Inset Toggle -->
        <div class="control-group full-width">
          <label class="checkbox-label">
            <input
              v-model="selectedShadow.inset"
              type="checkbox"
              @change="updateShadow"
            />
            <span>Inner Shadow (Inset)</span>
          </label>
        </div>

        <!-- Color -->
        <div class="control-group full-width">
          <label>Color</label>
          <div class="color-control">
            <div class="color-preview" :style="{ background: selectedShadow.color }"></div>
            <input
              v-model="selectedShadow.color"
              type="color"
              class="color-input"
              @input="updateShadow"
            />
            <input
              v-model="selectedShadow.color"
              type="text"
              class="color-text"
              @input="updateShadow"
              placeholder="#000000"
            />
          </div>
        </div>

        <!-- Offset X -->
        <div class="control-group">
          <label>
            Offset X
            <span class="value">{{ selectedShadow.offsetX }}px</span>
          </label>
          <input
            v-model.number="selectedShadow.offsetX"
            type="range"
            min="-50"
            max="50"
            @input="updateShadow"
            class="range-input"
          />
        </div>

        <!-- Offset Y -->
        <div class="control-group">
          <label>
            Offset Y
            <span class="value">{{ selectedShadow.offsetY }}px</span>
          </label>
          <input
            v-model.number="selectedShadow.offsetY"
            type="range"
            min="-50"
            max="50"
            @input="updateShadow"
            class="range-input"
          />
        </div>

        <!-- Blur -->
        <div class="control-group">
          <label>
            Blur Radius
            <span class="value">{{ selectedShadow.blur }}px</span>
          </label>
          <input
            v-model.number="selectedShadow.blur"
            type="range"
            min="0"
            max="100"
            @input="updateShadow"
            class="range-input"
          />
        </div>

        <!-- Spread -->
        <div class="control-group">
          <label>
            Spread
            <span class="value">{{ selectedShadow.spread }}px</span>
          </label>
          <input
            v-model.number="selectedShadow.spread"
            type="range"
            min="-50"
            max="50"
            @input="updateShadow"
            class="range-input"
          />
        </div>

        <!-- Opacity -->
        <div class="control-group full-width">
          <label>
            Opacity
            <span class="value">{{ Math.round(selectedShadow.opacity * 100) }}%</span>
          </label>
          <input
            v-model.number="selectedShadow.opacity"
            type="range"
            min="0"
            max="1"
            step="0.01"
            @input="updateShadow"
            class="range-input"
          />
        </div>
      </div>
    </div>

    <!-- Presets -->
    <div class="editor-section">
      <label>Presets</label>
      <div class="presets-grid">
        <button
          v-for="preset in presets"
          :key="preset.name"
          @click="applyPreset(preset)"
          class="preset-btn"
          :title="preset.name"
        >
          <div class="preset-preview" :style="{ boxShadow: preset.value }"></div>
          <span>{{ preset.name }}</span>
        </button>
      </div>
    </div>

    <!-- CSS Output -->
    <div class="editor-section">
      <label>CSS Value</label>
      <div class="css-output">
        <code>{{ shadowString }}</code>
        <button @click="copyToClipboard" class="copy-btn" title="Copy">
          <Copy :size="14" />
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="editor-actions">
      <button @click="$emit('close')" class="btn-secondary">Cancel</button>
      <button @click="apply" class="btn-primary">Apply Shadows</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Layers
} from 'lucide-vue-next';

interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
  enabled: boolean;
}

interface ShadowPreset {
  name: string;
  value: string;
}

interface Props {
  initialValue?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  apply: [value: string];
  close: [];
}>();

const shadows = ref<Shadow[]>([
  {
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: -1,
    color: '#000000',
    opacity: 0.1,
    inset: false,
    enabled: true
  }
]);

const selectedIndex = ref(0);

const presets: ShadowPreset[] = [
  { name: 'None', value: 'none' },
  { name: 'Subtle', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  { name: 'Small', value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)' },
  { name: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' },
  { name: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' },
  { name: 'X-Large', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' },
  { name: '2X-Large', value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  { name: 'Inner', value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' },
  { name: 'Glow', value: '0 0 15px rgba(99, 102, 241, 0.5)' }
];

const selectedShadow = computed(() => {
  return shadows.value[selectedIndex.value];
});

const shadowString = computed(() => {
  const enabledShadows = shadows.value.filter(s => s.enabled);
  if (enabledShadows.length === 0) return 'none';

  return enabledShadows
    .map(s => getShadowString(s))
    .join(', ');
});

function getShadowString(shadow: Shadow): string {
  const rgba = hexToRgba(shadow.color, shadow.opacity);
  const inset = shadow.inset ? 'inset ' : '';

  return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${rgba}`;
}

function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function addShadow() {
  shadows.value.push({
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: 0,
    color: '#000000',
    opacity: 0.1,
    inset: false,
    enabled: true
  });

  selectedIndex.value = shadows.value.length - 1;
}

function removeShadow(index: number) {
  if (shadows.value.length > 1) {
    shadows.value.splice(index, 1);
    selectedIndex.value = Math.max(0, Math.min(selectedIndex.value, shadows.value.length - 1));
  }
}

function duplicateShadow(index: number) {
  const shadow = { ...shadows.value[index] };
  shadows.value.splice(index + 1, 0, shadow);
  selectedIndex.value = index + 1;
}

function toggleShadow(index: number) {
  shadows.value[index].enabled = !shadows.value[index].enabled;
}

function updateShadow() {
  // Trigger reactivity
  shadows.value = [...shadows.value];
}

function applyPreset(preset: ShadowPreset) {
  if (preset.value === 'none') {
    shadows.value = [];
    return;
  }

  // Simple parser for preset shadows
  // This is basic - could be enhanced for complex parsing
  shadows.value = [{
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: 0,
    color: '#000000',
    opacity: 0.1,
    inset: preset.value.includes('inset'),
    enabled: true
  }];

  selectedIndex.value = 0;
}

function copyToClipboard() {
  navigator.clipboard.writeText(shadowString.value);
  // Show toast notification
}

function apply() {
  emit('apply', shadowString.value);
  emit('close');
}

// Parse initial value if provided
if (props.initialValue && props.initialValue !== 'none') {
  // Simple parser - can be enhanced
  // For now, just use default shadow
}
</script>

<style scoped>
.shadow-editor {
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  padding: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  transition: all 0.2s;
  border-radius: 4px;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.shadow-preview-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.preview-box {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s;
}

.preview-label {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.editor-section {
  margin-bottom: 24px;
}

.editor-section label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.section-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #EEF2FF;
  border: 1px solid #6366F1;
  border-radius: 4px;
  color: #6366F1;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #6366F1;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #9CA3AF;
  background: #F9FAFB;
  border-radius: 8px;
}

.empty-state p {
  margin: 12px 0 4px;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.hint {
  font-size: 12px;
  color: #9CA3AF;
}

.shadows-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shadow-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: #F9FAFB;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.shadow-item:hover {
  background: #F3F4F6;
}

.shadow-item.active {
  background: #EEF2FF;
  border-color: #6366F1;
}

.shadow-item.disabled {
  opacity: 0.5;
}

.shadow-thumbnail {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-box {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 4px;
}

.shadow-info {
  min-width: 0;
}

.shadow-name {
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 2px;
}

.shadow-values {
  font-size: 11px;
  color: #9CA3AF;
  font-family: monospace;
}

.shadow-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #E5E7EB;
  color: #1F2937;
}

.action-btn.delete:hover {
  background: #FEE2E2;
  color: #EF4444;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-group.full-width {
  grid-column: 1 / -1;
}

.control-group label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  margin: 0;
}

.value {
  font-family: monospace;
  font-size: 11px;
  color: #9CA3AF;
}

.range-input {
  width: 100%;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #1F2937;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.color-control {
  display: grid;
  grid-template-columns: 32px 40px 1fr;
  gap: 8px;
  align-items: center;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #E5E7EB;
}

.color-input {
  width: 40px;
  height: 32px;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
}

.color-text {
  padding: 6px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  color: #6B7280;
}

.preset-btn:hover {
  background: #F3F4F6;
  border-color: #6366F1;
}

.preset-preview {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 4px;
}

.css-output {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
}

.css-output code {
  flex: 1;
  font-size: 11px;
  font-family: 'Monaco', 'Courier New', monospace;
  color: #1F2937;
  overflow-x: auto;
  white-space: nowrap;
}

.copy-btn {
  padding: 6px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #EEF2FF;
  border-color: #6366F1;
  color: #6366F1;
}

.editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  border: 1px solid #E5E7EB;
  color: #6B7280;
}

.btn-secondary:hover {
  background: #F3F4F6;
}

.btn-primary {
  background: #6366F1;
  border: 1px solid #6366F1;
  color: white;
}

.btn-primary:hover {
  background: #4F46E5;
}
</style>
