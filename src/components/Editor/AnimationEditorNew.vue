<template>
  <div class="animation-editor">
    <!-- Header -->
    <div class="editor-header">
      <div class="header-title">
        <Play :size="18" />
        <h3>Animations</h3>
      </div>
      <div class="header-actions">
        <button 
          @click="showLibrary = true" 
          class="action-btn"
          title="Animation Library"
        >
          <Library :size="16" />
        </button>
        <button 
          @click="addAnimation" 
          class="action-btn primary"
          title="Add Animation"
        >
          <Plus :size="16" />
        </button>
      </div>
    </div>

    <!-- No Animations State -->
    <div v-if="!selectedComponent" class="empty-state">
      <div class="empty-icon">
        <MousePointer2 :size="32" />
      </div>
      <p>Select a component to animate</p>
    </div>

    <div v-else-if="animations.length === 0" class="empty-state">
      <div class="empty-icon">
        <Wand2 :size="32" />
      </div>
      <p>No animations yet</p>
      <button @click="showLibrary = true" class="browse-btn">
        Browse Animation Library
      </button>
    </div>

    <!-- Animation List & Timeline -->
    <div v-else class="editor-content">
      <!-- Animation Controls -->
      <div class="playback-controls">
        <button @click="togglePlayback" class="play-btn">
          <component :is="isPlaying ? Pause : Play" :size="16" />
        </button>
        <button @click="stopPlayback" class="control-btn">
          <Square :size="14" />
        </button>
        <button @click="resetTimeline" class="control-btn">
          <SkipBack :size="14" />
        </button>
        <div class="timeline-time">
          <span>{{ formatTime(currentTime) }}</span>
          <span class="divider">/</span>
          <span>{{ formatTime(totalDuration) }}</span>
        </div>
        <div class="timeline-zoom">
          <button @click="zoomOut" class="zoom-btn">
            <Minus :size="12" />
          </button>
          <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoomIn" class="zoom-btn">
            <Plus :size="12" />
          </button>
        </div>
      </div>

      <!-- Timeline View -->
      <div class="timeline-container" @wheel="handleZoom">
        <!-- Timeline Ruler -->
        <div class="timeline-ruler">
          <div class="time-markers">
            <div 
              v-for="marker in timeMarkers" 
              :key="marker.time"
              class="time-marker"
              :style="{ left: marker.position + 'px' }"
            >
              <span class="marker-line"></span>
              <span class="marker-text">{{ marker.label }}</span>
            </div>
          </div>
          <div 
            class="playhead"
            :style="{ left: playheadPosition + 'px' }"
            @mousedown="startDraggingPlayhead"
          >
            <div class="playhead-handle"></div>
          </div>
        </div>

        <!-- Animation Tracks -->
        <div class="animation-tracks">
          <div 
            v-for="(animation, index) in animations" 
            :key="animation.id"
            class="animation-track"
            :class="{ active: selectedAnimationId === animation.id }"
          >
            <!-- Track Header -->
            <div class="track-header" @click="selectAnimation(animation)">
              <div class="track-info">
                <span class="track-name">{{ animation.name }}</span>
                <span class="track-type">{{ animation.type }}</span>
              </div>
              <div class="track-controls">
                <button 
                  @click.stop="toggleAnimationEnabled(animation)"
                  class="track-btn"
                  :class="{ disabled: !animation.enabled }"
                >
                  <component :is="animation.enabled ? Eye : EyeOff" :size="14" />
                </button>
                <button 
                  @click.stop="duplicateAnimation(animation)"
                  class="track-btn"
                >
                  <Copy :size="14" />
                </button>
                <button 
                  @click.stop="removeAnimation(animation.id)"
                  class="track-btn delete"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>

            <!-- Track Timeline -->
            <div class="track-timeline">
              <div 
                class="animation-bar"
                :style="{
                  left: getAnimationPosition(animation) + 'px',
                  width: getAnimationWidth(animation) + 'px',
                  backgroundColor: getAnimationColor(animation.type)
                }"
                @mousedown="startDraggingAnimation(animation, $event)"
              >
                <span class="bar-handle left" @mousedown.stop="startResizingAnimation(animation, 'left', $event)"></span>
                <span class="bar-handle right" @mousedown.stop="startResizingAnimation(animation, 'right', $event)"></span>
              </div>

              <!-- Keyframes -->
              <div 
                v-for="(keyframe, kIndex) in animation.keyframes"
                :key="kIndex"
                class="keyframe"
                :style="{ left: getKeyframePosition(animation, keyframe) + 'px' }"
                @mousedown="startDraggingKeyframe(animation, keyframe, $event)"
              >
                <div class="keyframe-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Animation Properties -->
      <div v-if="selectedAnimation" class="animation-properties">
        <h4 class="properties-title">Animation Properties</h4>
        
        <!-- Basic Properties -->
        <div class="property-group">
          <label>Name</label>
          <input 
            v-model="animationName"
          />
        </div>

        <div class="property-row">
          <div class="property-group">
            <label>Duration</label>
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="animationDuration"
                min="0"
                step="0.1"
              />
              <span>s</span>
            </div>
          </div>
          <div class="property-group">
            <label>Delay</label>
            <div class="input-unit">
              <input 
                type="number" 
                v-model.number="animationDelay"
                min="0"
                step="0.1"
              />
              <span>s</span>
            </div>
          </div>
        </div>

        <!-- Easing -->
        <div class="property-group">
          <label>Easing</label>
          <select v-model="animationEasing">
            <option value="ease">Ease</option>
            <option value="linear">Linear</option>
            <option value="ease-in">Ease In</option>
            <option value="ease-out">Ease Out</option>
            <option value="ease-in-out">Ease In Out</option>
            <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Elastic</option>
            <option value="cubic-bezier(0.175, 0.885, 0.32, 1.275)">Back</option>
            <option value="custom">Custom Bezier...</option>
          </select>
        </div>

        <!-- Easing Curve Visualizer -->
        <div class="easing-preview">
          <canvas ref="easingCanvas" width="200" height="100"></canvas>
        </div>

        <!-- Loop Settings -->
        <div class="property-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="animationLoop"
            />
            Loop Animation
          </label>
        </div>

        <div v-if="animationLoop" class="property-row">
          <div class="property-group">
            <label>Direction</label>
            <select v-model="animationDirection">
              <option value="normal">Normal</option>
              <option value="reverse">Reverse</option>
              <option value="alternate">Alternate</option>
              <option value="alternate-reverse">Alternate Reverse</option>
            </select>
          </div>
        </div>

        <!-- Animation Type Specific Properties -->
        <component 
          :is="getAnimationPropertiesComponent"
          :animation="selectedAnimation"
          @update="updateAnimation"
        />
      </div>
    </div>

    <!-- Animation Library Modal -->
    <Teleport to="body">
      <AnimationLibrary 
        v-if="showLibrary"
        @close="showLibrary = false"
        @select="applyAnimationPreset"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { 
  Play, Pause, Square, SkipBack, Plus, Minus, Library,
  MousePointer2, Wand2, Eye, EyeOff, Copy, Trash2
} from 'lucide-vue-next';
import AnimationLibrary from './AnimationLibrary.vue';

const store = useEditorStore();

// State
const showLibrary = ref(false);
const selectedAnimationId = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const zoom = ref(1);
const playheadPosition = ref(0);

// Timeline state
const timelineWidth = ref(800);
const pixelsPerSecond = computed(() => 100 * zoom.value);

// Drag state
const dragState = ref({
  type: null, // 'playhead', 'animation', 'resize', 'keyframe'
  target: null,
  startX: 0,
  startValue: 0,
  side: null
});

// Computed
const selectedComponent = computed(() => store.selectedComponent);
const animations = computed(() => {
  if (!selectedComponent.value) return [];
  return selectedComponent.value.animations || [];
});

const selectedAnimation = computed(() => {
  if (!selectedAnimationId.value) return null;
  return animations.value.find(a => a.id === selectedAnimationId.value);
});

// Animation property getters/setters
const animationName = computed({
  get: () => selectedAnimation.value?.name || '',
  set: (value) => {
    if (selectedAnimation.value) {
      selectedAnimation.value.name = value;
      updateAnimation();
    }
  }
});

const animationDuration = computed({
  get: () => (selectedAnimation.value?.options?.duration || 1000) / 1000,
  set: (value) => {
    if (selectedAnimation.value) {
      selectedAnimation.value.options.duration = value * 1000;
      updateAnimation();
    }
  }
});

const animationDelay = computed({
  get: () => (selectedAnimation.value?.options?.delay || 0) / 1000,
  set: (value) => {
    if (selectedAnimation.value) {
      selectedAnimation.value.options.delay = value * 1000;
      updateAnimation();
    }
  }
});

const animationEasing = computed({
  get: () => selectedAnimation.value?.options?.easing || 'ease',
  set: (value) => {
    if (selectedAnimation.value) {
      selectedAnimation.value.options.easing = value;
      updateAnimation();
    }
  }
});

const animationLoop = computed({
  get: () => selectedAnimation.value?.options?.loop || false,
  set: (value) => {
    if (selectedAnimation.value) {
      selectedAnimation.value.options.loop = value;
      updateAnimation();
    }
  }
});

const animationDirection = computed({
  get: () => selectedAnimation.value?.options?.direction || 'normal',
  set: (value) => {
    if (selectedAnimation.value) {
      selectedAnimation.value.options.direction = value;
      updateAnimation();
    }
  }
});

const totalDuration = computed(() => {
  if (animations.value.length === 0) return 5;
  return Math.max(
    ...animations.value.map(a => ((a.options?.delay || 0) + (a.options?.duration || 1000)) / 1000),
    5
  );
});

const timeMarkers = computed(() => {
  const markers = [];
  const step = zoom.value > 1.5 ? 0.5 : 1;
  const count = Math.ceil(totalDuration.value / step);
  
  for (let i = 0; i <= count; i++) {
    const time = i * step;
    markers.push({
      time,
      position: time * pixelsPerSecond.value,
      label: time % 1 === 0 ? `${time}s` : `${time}s`
    });
  }
  
  return markers;
});

// Playback
let animationFrame = null;
let startTime = null;

function togglePlayback() {
  if (isPlaying.value) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

function startPlayback() {
  isPlaying.value = true;
  startTime = performance.now() - currentTime.value * 1000;
  animate();
}

function stopPlayback() {
  isPlaying.value = false;
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

function resetTimeline() {
  stopPlayback();
  currentTime.value = 0;
  playheadPosition.value = 0;
}

function animate() {
  if (!isPlaying.value) return;
  
  const now = performance.now();
  currentTime.value = (now - startTime) / 1000;
  
  if (currentTime.value >= totalDuration.value) {
    resetTimeline();
    return;
  }
  
  playheadPosition.value = currentTime.value * pixelsPerSecond.value;
  
  // Update animations
  animations.value.forEach(animation => {
    const animTime = currentTime.value - (animation.delay || 0);
    if (animTime >= 0 && animTime <= animation.duration) {
      // Apply animation to component
      applyAnimationFrame(animation, animTime / animation.duration);
    }
  });
  
  animationFrame = requestAnimationFrame(animate);
}

function applyAnimationFrame(animation, progress) {
  // This would apply the animation frame to the component
  // Implementation depends on animation type
}

// Timeline interactions
function handleZoom(event) {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  zoom.value = Math.max(0.5, Math.min(3, zoom.value + delta));
}

function zoomIn() {
  zoom.value = Math.min(3, zoom.value + 0.2);
}

function zoomOut() {
  zoom.value = Math.max(0.5, zoom.value - 0.2);
}

// Dragging functions
function startDraggingPlayhead(event) {
  dragState.value = {
    type: 'playhead',
    startX: event.clientX,
    startValue: currentTime.value
  };
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDragging);
}

function startDraggingAnimation(animation, event) {
  dragState.value = {
    type: 'animation',
    target: animation,
    startX: event.clientX,
    startValue: (animation.options?.delay || 0) / 1000
  };
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDragging);
}

function startResizingAnimation(animation, side, event) {
  dragState.value = {
    type: 'resize',
    target: animation,
    side: side,
    startX: event.clientX,
    startValue: side === 'left' ? (animation.options?.delay || 0) / 1000 : (animation.options?.duration || 1000) / 1000
  };
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDragging);
}

function handleDrag(event) {
  const deltaX = event.clientX - dragState.value.startX;
  const deltaTime = deltaX / pixelsPerSecond.value;
  
  if (dragState.value.type === 'playhead') {
    const newTime = Math.max(0, Math.min(totalDuration.value, dragState.value.startValue + deltaTime));
    currentTime.value = newTime;
    playheadPosition.value = newTime * pixelsPerSecond.value;
  } else if (dragState.value.type === 'animation') {
    const newDelay = Math.max(0, dragState.value.startValue + deltaTime);
    dragState.value.target.options.delay = newDelay * 1000;
    updateAnimation();
  } else if (dragState.value.type === 'resize') {
    if (dragState.value.side === 'left') {
      const newDelay = Math.max(0, dragState.value.startValue + deltaTime);
      const oldDelay = dragState.value.target.options.delay / 1000;
      const deltaDuration = oldDelay - newDelay;
      dragState.value.target.options.delay = newDelay * 1000;
      dragState.value.target.options.duration = Math.max(100, dragState.value.target.options.duration + deltaDuration * 1000);
    } else {
      dragState.value.target.options.duration = Math.max(100, dragState.value.startValue * 1000 + deltaTime * 1000);
    }
    updateAnimation();
  }
}

function stopDragging() {
  dragState.value = { type: null };
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
}

// Animation management
function addAnimation() {
  if (!selectedComponent.value) return;
  
  const newAnimation = {
    id: Date.now().toString(),
    name: `Animation ${animations.value.length + 1}`,
    type: 'fadeIn',
    trigger: 'onLoad',
    timeline: [
      { time: 0, properties: { opacity: 0 } },
      { time: 1, properties: { opacity: 1 } }
    ],
    options: {
      duration: 1000,
      delay: 0,
      easing: 'ease',
      loop: false,
      direction: 'normal'
    }
  };
  
  store.addAnimation(selectedComponent.value.id, newAnimation);
  selectedAnimationId.value = newAnimation.id;
}

function selectAnimation(animation) {
  selectedAnimationId.value = animation.id;
}

function updateAnimation() {
  if (!selectedAnimation.value || !selectedComponent.value) return;
  store.updateAnimation(selectedComponent.value.id, selectedAnimation.value);
}

function removeAnimation(animationId) {
  if (!selectedComponent.value) return;
  store.removeAnimation(selectedComponent.value.id, animationId);
  if (selectedAnimationId.value === animationId) {
    selectedAnimationId.value = null;
  }
}

function duplicateAnimation(animation) {
  if (!selectedComponent.value) return;
  
  const duplicate = {
    ...animation,
    id: Date.now().toString(),
    name: `${animation.name} Copy`,
    options: {
      ...animation.options,
      delay: (animation.options?.delay || 0) + 500 // Add 0.5s delay
    }
  };
  
  store.addAnimation(selectedComponent.value.id, duplicate);
}

function toggleAnimationEnabled(animation) {
  animation.enabled = !animation.enabled;
  updateAnimation();
}

function applyAnimationPreset(preset) {
  if (!selectedComponent.value) return;
  
  const animation = {
    ...preset,
    id: Date.now().toString(),
    enabled: true
  };
  
  store.addAnimation(selectedComponent.value.id, animation);
  selectedAnimationId.value = animation.id;
}

// Position calculations
function getAnimationPosition(animation) {
  return ((animation.options?.delay || 0) / 1000) * pixelsPerSecond.value;
}

function getAnimationWidth(animation) {
  return ((animation.options?.duration || 1000) / 1000) * pixelsPerSecond.value;
}

function getKeyframePosition(animation, keyframe) {
  const animationStart = (animation.options?.delay || 0) / 1000;
  const animationDuration = (animation.options?.duration || 1000) / 1000;
  const keyframeTime = animationStart + (animationDuration * keyframe.time);
  return keyframeTime * pixelsPerSecond.value;
}

function getAnimationColor(type) {
  const colors = {
    fadeIn: '#10B981',
    slideIn: '#3B82F6',
    scaleIn: '#8B5CF6',
    rotateIn: '#F59E0B',
    bounceIn: '#EF4444',
    custom: '#6B7280'
  };
  return colors[type] || colors.custom;
}

function formatTime(seconds) {
  return `${seconds.toFixed(1)}s`;
}

// Easing visualization
function drawEasingCurve() {
  const canvas = easingCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw grid
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * height / 4);
    ctx.lineTo(width, i * height / 4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(i * width / 4, 0);
    ctx.lineTo(i * width / 4, height);
    ctx.stroke();
  }
  
  // Draw easing curve
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let x = 0; x <= width; x++) {
    const t = x / width;
    const y = height - (getEasingValue(t, selectedAnimation.value.options?.easing || 'ease') * height);
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

function getEasingValue(t, easing) {
  // Simple easing calculations
  switch (easing) {
    case 'linear':
      return t;
    case 'ease-in':
      return t * t;
    case 'ease-out':
      return t * (2 - t);
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t;
  }
}

const easingCanvas = ref(null);

watch(selectedAnimation, () => {
  if (selectedAnimation.value) {
    setTimeout(drawEasingCurve, 0);
  }
}, { deep: true });

onMounted(() => {
  if (selectedComponent.value?.animations?.length > 0) {
    selectedAnimationId.value = selectedComponent.value.animations[0].id;
  }
});

onUnmounted(() => {
  stopPlayback();
});
</script>

<style scoped>
.animation-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.action-btn.primary {
  background: var(--primary);
  color: white;
}

.action-btn.primary:hover {
  background: var(--primary-dark);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
  color: var(--text-muted);
}

.empty-state p {
  margin: 0 0 16px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.browse-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.browse-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--primary);
  color: var(--primary);
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.play-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.play-btn:hover {
  background: var(--primary-dark);
}

.control-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.timeline-time {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 16px;
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

.divider {
  color: var(--text-muted);
}

.timeline-zoom {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.zoom-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.zoom-level {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: center;
}

.timeline-container {
  flex: 1;
  overflow: auto;
  background: var(--bg-secondary);
  position: relative;
}

.timeline-ruler {
  height: 40px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.time-markers {
  position: relative;
  height: 100%;
}

.time-marker {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.marker-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: var(--border-color);
}

.marker-text {
  font-size: 11px;
  color: var(--text-muted);
  padding: 0 4px 4px 4px;
  transform: translateX(-50%);
}

.playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--error);
  cursor: ew-resize;
  z-index: 20;
}

.playhead-handle {
  position: absolute;
  top: 0;
  left: -6px;
  width: 12px;
  height: 12px;
  background: var(--error);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.animation-tracks {
  padding: 8px 0;
}

.animation-track {
  display: flex;
  align-items: stretch;
  border: 1px solid transparent;
  border-radius: 4px;
  margin: 0 8px 4px 8px;
  transition: all 0.2s;
}

.animation-track:hover {
  background: var(--bg-hover);
}

.animation-track.active {
  border-color: var(--primary);
  background: var(--bg-hover);
}

.track-header {
  width: 200px;
  padding: 8px 12px;
  border-right: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.track-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.track-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.track-type {
  font-size: 11px;
  color: var(--text-muted);
}

.track-controls {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.animation-track:hover .track-controls {
  opacity: 1;
}

.track-btn {
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.track-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.track-btn.delete:hover {
  background: var(--error-light);
  color: var(--error);
}

.track-btn.disabled {
  opacity: 0.5;
}

.track-timeline {
  flex: 1;
  position: relative;
  height: 40px;
  margin: 4px 0;
}

.animation-bar {
  position: absolute;
  top: 8px;
  height: 24px;
  border-radius: 4px;
  cursor: move;
  transition: opacity 0.2s;
  opacity: 0.8;
}

.animation-bar:hover {
  opacity: 1;
}

.bar-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
}

.bar-handle.left {
  left: 0;
  border-radius: 4px 0 0 4px;
}

.bar-handle.right {
  right: 0;
  border-radius: 0 4px 4px 0;
}

.keyframe {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: move;
}

.keyframe-dot {
  width: 8px;
  height: 8px;
  background: white;
  border: 2px solid var(--primary);
  border-radius: 50%;
}

.animation-properties {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
  max-height: 400px;
  overflow-y: auto;
}

.properties-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.property-group {
  margin-bottom: 16px;
}

.property-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.property-group input,
.property-group select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.property-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.input-unit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-unit input {
  flex: 1;
}

.input-unit span {
  font-size: 12px;
  color: var(--text-muted);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
}

.easing-preview {
  margin: 16px 0;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  display: flex;
  justify-content: center;
}

.easing-preview canvas {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
}
</style>