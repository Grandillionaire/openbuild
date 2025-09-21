<template>
  <div class="animation-editor" v-if="selectedComponent">
    <div class="animation-header">
      <h3>Animations</h3>
      <button @click="showPresetLibrary = true" class="add-animation-btn">
        <Plus :size="16" />
        Add Animation
      </button>
    </div>

    <!-- Current Animations -->
    <div class="animations-list" v-if="componentAnimations.length > 0">
      <div
        v-for="(animation, index) in componentAnimations"
        :key="animation.id"
        class="animation-item"
      >
        <div class="animation-item-header">
          <span class="animation-name">{{ animation.name }}</span>
          <div class="animation-controls">
            <button @click="editAnimation(index)" class="icon-btn" title="Edit">
              <Settings :size="14" />
            </button>
            <button @click="playAnimation(index)" class="icon-btn" title="Preview">
              <Play :size="14" />
            </button>
            <button @click="removeAnimation(index)" class="icon-btn" title="Remove">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
        <div class="animation-details">
          <span class="trigger-badge">{{ animation.trigger }}</span>
          <span class="duration-badge">{{ animation.options.duration }}ms</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <Sparkles :size="32" />
      <p>No animations yet</p>
      <button @click="showPresetLibrary = true" class="primary-btn">
        Browse Animation Library
      </button>
    </div>

    <!-- Animation Preset Library Modal -->
    <div v-if="showPresetLibrary" class="modal-overlay" @click.self="showPresetLibrary = false">
      <div class="modal-content animation-library">
        <div class="modal-header">
          <h2>Animation Library</h2>
          <button @click="showPresetLibrary = false" class="close-btn">
            <X :size="20" />
          </button>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="['category-tab', { active: selectedCategory === category }]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Animation Presets Grid -->
        <div class="presets-grid">
          <div
            v-for="preset in filteredPresets"
            :key="preset.id"
            @click="selectPreset(preset)"
            class="preset-card"
          >
            <div class="preset-preview" :data-animation="preset.id">
              <div class="preview-box"></div>
            </div>
            <h4>{{ preset.name }}</h4>
            <p>{{ preset.animation.trigger }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Animation Editor Modal -->
    <div v-if="editingAnimation" class="modal-overlay" @click.self="closeEditor">
      <div class="modal-content animation-editor-modal">
        <div class="modal-header">
          <h2>Edit Animation</h2>
          <button @click="closeEditor" class="close-btn">
            <X :size="20" />
          </button>
        </div>

        <div class="editor-content">
          <!-- Animation Properties -->
          <div class="property-section">
            <h3>Properties</h3>
            
            <label>
              Name
              <input v-model="editingAnimation.name" type="text" />
            </label>

            <label>
              Trigger
              <select v-model="editingAnimation.trigger">
                <option value="onLoad">On Page Load</option>
                <option value="onScroll">On Scroll Into View</option>
                <option value="onHover">On Hover</option>
                <option value="onClick">On Click</option>
                <option value="continuous">Continuous</option>
              </select>
            </label>

            <label>
              Duration (ms)
              <input v-model.number="editingAnimation.options.duration" type="number" min="100" max="10000" />
            </label>

            <label>
              Delay (ms)
              <input v-model.number="editingAnimation.options.delay" type="number" min="0" max="5000" />
            </label>

            <label>
              Easing
              <select v-model="editingAnimation.options.easing">
                <option value="ease">Ease</option>
                <option value="linear">Linear</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="cubic-bezier(0.68,-0.55,0.265,1.55)">Bounce</option>
              </select>
            </label>

            <label>
              <input type="checkbox" v-model="editingAnimation.options.loop" />
              Loop Animation
            </label>

            <!-- Scroll Options -->
            <div v-if="editingAnimation.trigger === 'onScroll'" class="scroll-options">
              <h4>Scroll Settings</h4>
              <label>
                Trigger Threshold
                <input
                  v-model.number="editingAnimation.scrollOptions.threshold"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                />
                <span>{{ (editingAnimation.scrollOptions.threshold * 100).toFixed(0) }}%</span>
              </label>
            </div>
          </div>

          <!-- Timeline Editor -->
          <div class="timeline-section">
            <h3>Timeline</h3>
            <div class="timeline-editor">
              <div class="timeline-preview">
                <div class="preview-element" :style="previewStyles"></div>
              </div>
              
              <!-- Keyframe controls would go here -->
              <p class="hint">Advanced timeline editing coming soon!</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeEditor" class="secondary-btn">Cancel</button>
          <button @click="saveAnimation" class="primary-btn">Save Animation</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { animationPresets } from '@/config/animationPresets';
import type { Animation, AnimationKeyframe } from '@/types/component';
import { nanoid } from 'nanoid';
import { safeClone } from '@/utils/safeSerialize';
import {
  Plus,
  Play,
  Trash2,
  Settings,
  X,
  Sparkles
} from 'lucide-vue-next';

const store = useEditorStore();
const selectedComponent = computed(() => store.selectedComponent);

// Animation state
const componentAnimations = computed(() => selectedComponent.value?.props.animations || []);
const showPresetLibrary = ref(false);
const editingAnimation = ref<Animation | null>(null);
const editingIndex = ref<number>(-1);
const selectedCategory = ref('entrance');
const previewStyles = ref({});

const categories = ['entrance', 'emphasis', 'exit', 'hover', 'continuous'];

const filteredPresets = computed(() => {
  return animationPresets.filter(preset => preset.category === selectedCategory.value);
});

function selectPreset(preset: any) {
  if (!selectedComponent.value) return;

  const newAnimation: Animation = {
    id: nanoid(),
    name: preset.name,
    ...preset.animation
  };

  const currentAnimations = [...componentAnimations.value];
  currentAnimations.push(newAnimation);

  store.updateComponent(selectedComponent.value.id, {
    props: {
      ...selectedComponent.value.props,
      animations: currentAnimations
    }
  });

  showPresetLibrary.value = false;
}

function editAnimation(index: number) {
  editingAnimation.value = safeClone(componentAnimations.value[index]);
  editingIndex.value = index;
}

function playAnimation(index: number) {
  const animation = componentAnimations.value[index];
  // Apply animation to the component in the canvas
  const element = document.getElementById(selectedComponent.value!.id);
  if (element) {
    // Remove any existing animation classes
    element.style.animation = '';
    
    // Force reflow
    void element.offsetWidth;
    
    // Apply new animation
    const animationName = `animation-${animation.id}`;
    const duration = animation.options.duration;
    const delay = animation.options.delay;
    const easing = animation.options.easing;
    
    element.style.animation = `${animationName} ${duration}ms ${easing} ${delay}ms`;
    
    // Remove animation after completion
    setTimeout(() => {
      element.style.animation = '';
    }, duration + delay);
  }
}

function removeAnimation(index: number) {
  const currentAnimations = [...componentAnimations.value];
  currentAnimations.splice(index, 1);

  store.updateComponent(selectedComponent.value!.id, {
    props: {
      ...selectedComponent.value.props,
      animations: currentAnimations
    }
  });
}

function closeEditor() {
  editingAnimation.value = null;
  editingIndex.value = -1;
}

function saveAnimation() {
  if (!editingAnimation.value || !selectedComponent.value) return;

  const currentAnimations = [...componentAnimations.value];
  
  // Initialize scroll options if needed
  if (editingAnimation.value.trigger === 'onScroll' && !editingAnimation.value.scrollOptions) {
    editingAnimation.value.scrollOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };
  }

  if (editingIndex.value >= 0) {
    currentAnimations[editingIndex.value] = editingAnimation.value;
  } else {
    currentAnimations.push(editingAnimation.value);
  }

  store.updateComponent(selectedComponent.value.id, {
    props: {
      ...selectedComponent.value.props,
      animations: currentAnimations
    }
  });

  closeEditor();
}

// Initialize preview styles for timeline editor
watch(editingAnimation, (animation) => {
  if (!animation) return;
  
  // Generate preview styles based on animation keyframes
  updatePreviewStyles();
});

function updatePreviewStyles() {
  // This would be more complex with actual keyframe data
  previewStyles.value = {
    width: '60px',
    height: '60px',
    backgroundColor: 'var(--primary)',
    borderRadius: '8px',
    transition: `all ${editingAnimation.value?.options.duration}ms ${editingAnimation.value?.options.easing}`
  };
}
</script>

<style scoped>
.animation-editor {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.animation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.animation-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.add-animation-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.add-animation-btn:hover {
  background: var(--primary-dark);
}

.animations-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.animation-item {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
}

.animation-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.animation-name {
  font-weight: 500;
  font-size: 13px;
}

.animation-controls {
  display: flex;
  gap: 4px;
}

.icon-btn {
  padding: 4px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.animation-details {
  display: flex;
  gap: 8px;
}

.trigger-badge,
.duration-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 1rem;
  font-size: 13px;
}

.primary-btn {
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.primary-btn:hover {
  background: var(--primary-dark);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.animation-library {
  width: 800px;
  padding: 0;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 6px;
}

.close-btn:hover {
  background: var(--hover-bg);
}

.category-tabs {
  display: flex;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.category-tab {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  text-transform: capitalize;
  color: var(--text-secondary);
  font-size: 14px;
}

.category-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.preset-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.preset-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.preset-preview {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.preview-box {
  width: 40px;
  height: 40px;
  background: var(--primary);
  border-radius: 4px;
}

.preset-card h4 {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
}

.preset-card p {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

.animation-editor-modal {
  width: 600px;
}

.editor-content {
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;
}

.property-section h3,
.timeline-section h3 {
  margin: 0 0 1rem;
  font-size: 16px;
}

.property-section label {
  display: block;
  margin-bottom: 12px;
  font-size: 13px;
}

.property-section input[type="text"],
.property-section input[type="number"],
.property-section select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
  color: var(--text-primary);
}

.property-section input[type="checkbox"] {
  margin-right: 8px;
}

.scroll-options {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.scroll-options h4 {
  margin: 0 0 12px;
  font-size: 14px;
}

.timeline-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.timeline-editor {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 200px;
}

.timeline-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  margin-bottom: 1rem;
}

.preview-element {
  transition: all 0.3s;
}

.hint {
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text-primary);
}

.secondary-btn:hover {
  background: var(--hover-bg);
}
</style>