<template>
  <div class="gradient-editor">
    <div class="editor-header">
      <h4>Gradient Editor</h4>
      <button @click="$emit('close')" class="close-btn">
        <X :size="16" />
      </button>
    </div>

    <!-- Gradient Preview -->
    <div class="gradient-preview" :style="{ background: gradientString }"></div>

    <!-- Gradient Type -->
    <div class="editor-section">
      <label>Type</label>
      <div class="gradient-types">
        <button
          v-for="type in gradientTypes"
          :key="type.value"
          :class="['type-btn', { active: gradient.type === type.value }]"
          @click="gradient.type = type.value"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- Direction/Angle -->
    <div class="editor-section">
      <label>
        {{ gradient.type === 'linear' ? 'Direction' : 'Shape' }}
      </label>

      <div v-if="gradient.type === 'linear'" class="direction-controls">
        <div class="direction-buttons">
          <button
            v-for="dir in directions"
            :key="dir.value"
            :class="['dir-btn', { active: gradient.direction === dir.value }]"
            @click="gradient.direction = dir.value"
            :title="dir.label"
          >
            <component :is="dir.icon" :size="14" />
          </button>
        </div>

        <div class="angle-control">
          <label>Angle</label>
          <input
            v-model.number="gradient.angle"
            type="range"
            min="0"
            max="360"
            @input="gradient.direction = null"
          />
          <input
            v-model.number="gradient.angle"
            type="number"
            min="0"
            max="360"
            class="angle-input"
          />
          <span class="unit">°</span>
        </div>
      </div>

      <div v-else class="radial-controls">
        <select v-model="gradient.shape" class="shape-select">
          <option value="circle">Circle</option>
          <option value="ellipse">Ellipse</option>
        </select>

        <select v-model="gradient.position" class="position-select">
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top left">Top Left</option>
          <option value="top right">Top Right</option>
          <option value="bottom left">Bottom Left</option>
          <option value="bottom right">Bottom Right</option>
        </select>
      </div>
    </div>

    <!-- Color Stops -->
    <div class="editor-section">
      <div class="section-header-with-action">
        <label>Color Stops</label>
        <button @click="addColorStop" class="add-stop-btn">
          <Plus :size="14" />
          Add Stop
        </button>
      </div>

      <!-- Visual Color Stop Slider -->
      <div class="stop-slider" ref="sliderRef" @click="addStopAtPosition">
        <div class="slider-track" :style="{ background: gradientString }"></div>
        <div
          v-for="(stop, index) in sortedStops"
          :key="index"
          :class="['stop-handle', { active: selectedStopIndex === index }]"
          :style="{ left: stop.position + '%' }"
          @mousedown="startDrag(index, $event)"
          @click.stop="selectedStopIndex = index"
        >
          <div class="handle-color" :style="{ background: stop.color }"></div>
        </div>
      </div>

      <!-- Color Stop List -->
      <div class="stops-list">
        <div
          v-for="(stop, index) in sortedStops"
          :key="index"
          :class="['stop-item', { active: selectedStopIndex === index }]"
          @click="selectedStopIndex = index"
        >
          <div class="stop-color-preview" :style="{ background: stop.color }"></div>
          <input
            v-model="stop.color"
            type="color"
            class="color-input"
            @input="updateGradient"
          />
          <input
            v-model="stop.color"
            type="text"
            class="color-text"
            @input="updateGradient"
            placeholder="#000000"
          />
          <input
            v-model.number="stop.position"
            type="number"
            min="0"
            max="100"
            class="position-input"
            @input="updateGradient"
          />
          <span class="unit">%</span>
          <button
            v-if="gradient.stops.length > 2"
            @click="removeStop(index)"
            class="remove-stop"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- CSS Output -->
    <div class="editor-section">
      <label>CSS Value</label>
      <div class="css-output">
        <code>{{ gradientString }}</code>
        <button @click="copyToClipboard" class="copy-btn" title="Copy">
          <Copy :size="14" />
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="editor-actions">
      <button @click="$emit('close')" class="btn-secondary">Cancel</button>
      <button @click="apply" class="btn-primary">Apply Gradient</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import {
  X,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoveUpRight,
  MoveDownRight,
  MoveUpLeft,
  MoveDownLeft
} from 'lucide-vue-next';

interface ColorStop {
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial';

interface Gradient {
  type: GradientType;
  angle: number;
  direction: string | null;
  shape: 'circle' | 'ellipse';
  position: string;
  stops: ColorStop[];
}

interface Props {
  initialValue?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  apply: [value: string];
  close: [];
}>();

const gradient = reactive<Gradient>({
  type: 'linear',
  angle: 90,
  direction: 'to right',
  shape: 'circle',
  position: 'center',
  stops: [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ]
});

const gradientTypes: Array<{ value: GradientType; label: string }> = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' }
];

const directions = [
  { value: 'to top', label: 'To Top', icon: ArrowUp },
  { value: 'to right', label: 'To Right', icon: ArrowRight },
  { value: 'to bottom', label: 'To Bottom', icon: ArrowDown },
  { value: 'to left', label: 'To Left', icon: ArrowLeft },
  { value: 'to top right', label: 'To Top Right', icon: MoveUpRight },
  { value: 'to bottom right', label: 'To Bottom Right', icon: MoveDownRight },
  { value: 'to bottom left', label: 'To Bottom Left', icon: MoveDownLeft },
  { value: 'to top left', label: 'To Top Left', icon: MoveUpLeft }
];

const selectedStopIndex = ref(0);
const sliderRef = ref<HTMLElement>();
const isDragging = ref(false);

const sortedStops = computed(() => {
  return [...gradient.stops].sort((a, b) => a.position - b.position);
});

const gradientString = computed(() => {
  const stopsString = sortedStops.value
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'linear') {
    const direction = gradient.direction || `${gradient.angle}deg`;
    return `linear-gradient(${direction}, ${stopsString})`;
  } else {
    return `radial-gradient(${gradient.shape} at ${gradient.position}, ${stopsString})`;
  }
});

function addColorStop() {
  const newPosition = 50;
  const newColor = interpolateColor(newPosition);

  gradient.stops.push({
    color: newColor,
    position: newPosition
  });

  selectedStopIndex.value = gradient.stops.length - 1;
  updateGradient();
}

function addStopAtPosition(e: MouseEvent) {
  if (!sliderRef.value) return;

  const rect = sliderRef.value.getBoundingClientRect();
  const position = ((e.clientX - rect.left) / rect.width) * 100;
  const color = interpolateColor(position);

  gradient.stops.push({
    color,
    position: Math.round(position)
  });

  selectedStopIndex.value = gradient.stops.length - 1;
  updateGradient();
}

function removeStop(index: number) {
  if (gradient.stops.length > 2) {
    gradient.stops.splice(index, 1);
    selectedStopIndex.value = Math.max(0, index - 1);
    updateGradient();
  }
}

function startDrag(index: number, _e: MouseEvent) {
  selectedStopIndex.value = index;
  isDragging.value = true;

  const onMouseMove = (e: MouseEvent) => {
    if (!sliderRef.value || !isDragging.value) return;

    const rect = sliderRef.value.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;

    gradient.stops[index].position = Math.max(0, Math.min(100, Math.round(position)));
    updateGradient();
  };

  const onMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function interpolateColor(position: number): string {
  const sorted = sortedStops.value;

  // Find the two stops to interpolate between
  let beforeStop = sorted[0];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (position >= sorted[i].position && position <= sorted[i + 1].position) {
      beforeStop = sorted[i];
      // afterStop = sorted[i + 1]; // For future interpolation enhancement
      break;
    }
  }

  // Simple color interpolation (can be enhanced with proper color space conversion)
  return beforeStop.color;
}

function updateGradient() {
  // Trigger reactivity
  gradient.stops = [...gradient.stops];
}

function copyToClipboard() {
  navigator.clipboard.writeText(gradientString.value);
  // Show toast notification
}

function apply() {
  emit('apply', gradientString.value);
  emit('close');
}

// Parse initial value if provided
if (props.initialValue) {
  // Simple parser - can be enhanced
  if (props.initialValue.startsWith('linear-gradient')) {
    gradient.type = 'linear' as GradientType;
  } else if (props.initialValue.startsWith('radial-gradient')) {
    gradient.type = 'radial' as GradientType;
  }
}
</script>

<style scoped>
.gradient-editor {
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
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

.gradient-preview {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #E5E7EB;
}

.editor-section {
  margin-bottom: 20px;
}

.editor-section label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.gradient-types {
  display: flex;
  gap: 8px;
}

.type-btn {
  flex: 1;
  padding: 8px;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  transition: all 0.2s;
}

.type-btn.active {
  background: #EEF2FF;
  border-color: #6366F1;
  color: #6366F1;
}

.direction-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.dir-btn {
  padding: 10px;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B7280;
}

.dir-btn.active {
  background: #EEF2FF;
  border-color: #6366F1;
  color: #6366F1;
}

.angle-control {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
}

.angle-control label {
  grid-column: 1 / -1;
  margin: 0 0 4px;
}

.angle-control input[type="range"] {
  grid-column: 1 / -1;
}

.angle-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  font-size: 13px;
}

.unit {
  font-size: 12px;
  color: #9CA3AF;
}

.radial-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.shape-select,
.position-select {
  padding: 8px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  cursor: pointer;
}

.section-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.add-stop-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #EEF2FF;
  border: 1px solid #6366F1;
  border-radius: 4px;
  color: #6366F1;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-stop-btn:hover {
  background: #6366F1;
  color: white;
}

.stop-slider {
  position: relative;
  height: 40px;
  margin-bottom: 16px;
  cursor: crosshair;
}

.slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 12px;
  transform: translateY(-50%);
  border-radius: 6px;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #E5E7EB;
}

.stop-handle {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 2;
}

.stop-handle.active {
  z-index: 3;
}

.stop-handle:active {
  cursor: grabbing;
}

.handle-color {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stop-handle.active .handle-color {
  border-color: #6366F1;
  box-shadow: 0 0 0 2px #EEF2FF, 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stops-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stop-item {
  display: grid;
  grid-template-columns: 24px 32px 1fr 60px auto auto;
  gap: 8px;
  align-items: center;
  padding: 8px;
  background: #F9FAFB;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.stop-item.active {
  background: #EEF2FF;
  border-color: #C7D2FE;
}

.stop-color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #E5E7EB;
}

.color-input {
  width: 32px;
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

.position-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  font-size: 12px;
}

.remove-stop {
  padding: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  border-radius: 4px;
  transition: all 0.2s;
}

.remove-stop:hover {
  background: #FEE2E2;
  color: #EF4444;
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
