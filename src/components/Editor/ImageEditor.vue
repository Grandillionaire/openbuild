<template>
  <div class="image-editor" v-if="isImageSelected">
    <div class="editor-header">
      <h4>Image Settings</h4>
      <button @click="showAdvanced = !showAdvanced" class="toggle-btn">
        <ChevronDown :size="14" :class="{ rotated: showAdvanced }" />
      </button>
    </div>

    <!-- Image Source -->
    <div class="image-source">
      <label>Image Source</label>
      <div class="source-input">
        <input
          v-model="imageUrl"
          type="text"
          placeholder="Enter image URL or drag & drop"
          @input="updateImageSource"
        />
        <button @click="openAssetManager" class="browse-btn">
          <Folder :size="14" />
        </button>
      </div>

      <!-- Drag & Drop Zone -->
      <div
        class="drop-zone"
        :class="{ dragging: isDragging }"
        @dragover.prevent
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleImageDrop"
      >
        <Upload :size="24" />
        <p>Drag & drop image here</p>
        <span>or</span>
        <button @click="selectFile" class="upload-btn">Browse Files</button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          style="display: none"
        />
      </div>
    </div>

    <!-- Quick Image Sources -->
    <div class="quick-sources">
      <h5>Quick Sources</h5>
      <div class="source-buttons">
        <button @click="useUnsplash" class="source-btn">
          <Camera :size="14" />
          Unsplash
        </button>
        <button @click="usePlaceholder" class="source-btn">
          <Image :size="14" />
          Placeholder
        </button>
        <button @click="useIcons" class="source-btn">
          <Grid3x3 :size="14" />
          Icons
        </button>
      </div>
    </div>

    <!-- Image Adjustments -->
    <div class="image-adjustments">
      <h5>Adjustments</h5>

      <div class="adjustment-controls">
        <div class="control-group">
          <label>
            <Sun :size="12" />
            Brightness
          </label>
          <input
            v-model="brightness"
            type="range"
            min="0"
            max="200"
            @input="applyFilters"
          />
          <span>{{ brightness }}%</span>
        </div>

        <div class="control-group">
          <label>
            <Circle :size="12" />
            Contrast
          </label>
          <input
            v-model="contrast"
            type="range"
            min="0"
            max="200"
            @input="applyFilters"
          />
          <span>{{ contrast }}%</span>
        </div>

        <div class="control-group">
          <label>
            <Droplet :size="12" />
            Saturation
          </label>
          <input
            v-model="saturation"
            type="range"
            min="0"
            max="200"
            @input="applyFilters"
          />
          <span>{{ saturation }}%</span>
        </div>

        <div class="control-group">
          <label>
            <Aperture :size="12" />
            Blur
          </label>
          <input
            v-model="blur"
            type="range"
            min="0"
            max="10"
            @input="applyFilters"
          />
          <span>{{ blur }}px</span>
        </div>
      </div>

      <button @click="resetFilters" class="reset-btn">
        <RotateCcw :size="14" />
        Reset Filters
      </button>
    </div>

    <!-- Image Filters -->
    <div class="image-filters">
      <h5>Filters</h5>
      <div class="filter-grid">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="applyPresetFilter(filter)"
          :class="['filter-btn', { active: activeFilter === filter.id }]"
        >
          <div class="filter-preview" :style="filter.style"></div>
          <span>{{ filter.name }}</span>
        </button>
      </div>
    </div>

    <!-- Image Settings -->
    <div class="image-settings" v-if="showAdvanced">
      <h5>Advanced Settings</h5>

      <div class="setting-group">
        <label>Alt Text</label>
        <input
          v-model="altText"
          type="text"
          placeholder="Describe the image"
          @input="updateAltText"
        />
      </div>

      <div class="setting-group">
        <label>Object Fit</label>
        <select v-model="objectFit" @change="updateObjectFit">
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
          <option value="scale-down">Scale Down</option>
        </select>
      </div>

      <div class="setting-group">
        <label>Loading</label>
        <select v-model="loading" @change="updateLoading">
          <option value="lazy">Lazy</option>
          <option value="eager">Eager</option>
        </select>
      </div>

      <div class="setting-group">
        <label>
          <input
            v-model="optimizeImage"
            type="checkbox"
            @change="toggleOptimization"
          />
          Auto-optimize image
        </label>
      </div>
    </div>

    <!-- Cropping Tool -->
    <div class="cropping-tool" v-if="showCropper">
      <h5>Crop Image</h5>
      <div class="crop-presets">
        <button
          v-for="ratio in cropRatios"
          :key="ratio.id"
          @click="setCropRatio(ratio)"
          class="ratio-btn"
        >
          {{ ratio.label }}
        </button>
      </div>
      <button @click="applyCrop" class="apply-btn">Apply Crop</button>
      <button @click="cancelCrop" class="cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';
import {
  ChevronDown,
  Folder,
  Upload,
  Camera,
  Image,
  Grid3x3,
  Sun,
  Circle,
  Droplet,
  Aperture,
  RotateCcw,
  Crop
} from 'lucide-vue-next';

const store = useEditorStore();
const { showToast } = useToast();

// State
const showAdvanced = ref(false);
const isDragging = ref(false);
const imageUrl = ref('');
const altText = ref('');
const objectFit = ref('cover');
const loading = ref('lazy');
const optimizeImage = ref(true);
const showCropper = ref(false);

// Filters
const brightness = ref(100);
const contrast = ref(100);
const saturation = ref(100);
const blur = ref(0);
const activeFilter = ref('');

// File input ref
const fileInput = ref<HTMLInputElement>();

// Computed
const isImageSelected = computed(() => {
  return store.selectedComponent?.type === 'image';
});

// Filter presets
const filters = [
  { id: 'none', name: 'None', style: {} },
  { id: 'grayscale', name: 'B&W', style: { filter: 'grayscale(100%)' } },
  { id: 'sepia', name: 'Sepia', style: { filter: 'sepia(100%)' } },
  { id: 'vintage', name: 'Vintage', style: { filter: 'sepia(50%) contrast(120%) brightness(90%)' } },
  { id: 'cold', name: 'Cold', style: { filter: 'hue-rotate(180deg) saturate(120%)' } },
  { id: 'warm', name: 'Warm', style: { filter: 'hue-rotate(-30deg) saturate(130%)' } },
  { id: 'dramatic', name: 'Dramatic', style: { filter: 'contrast(150%) brightness(110%)' } },
  { id: 'fade', name: 'Fade', style: { filter: 'contrast(80%) brightness(120%)' } }
];

// Crop ratios
const cropRatios = [
  { id: 'free', label: 'Free', ratio: null },
  { id: '1:1', label: '1:1', ratio: 1 },
  { id: '16:9', label: '16:9', ratio: 16 / 9 },
  { id: '4:3', label: '4:3', ratio: 4 / 3 },
  { id: '3:2', label: '3:2', ratio: 3 / 2 }
];

// Methods
function updateImageSource() {
  if (!store.selectedComponent) return;

  // Update both src and attributes.src for compatibility
  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      src: imageUrl.value,
      attributes: {
        ...store.selectedComponent.props.attributes,
        src: imageUrl.value
      }
    }
  });

  showToast('Image updated successfully', 'success');
}

function handleImageDrop(event: DragEvent) {
  isDragging.value = false;

  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    processImageFile(files[0]);
  }
}

function selectFile() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files[0]) {
    processImageFile(files[0]);
  }
}

function processImageFile(file: File) {
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error');
    return;
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image size should be less than 5MB', 'error');
    return;
  }

  // Read and convert to base64
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    imageUrl.value = result;

    // Optimize image if enabled
    if (optimizeImage.value) {
      optimizeImageData(result);
    } else {
      updateImageSource();
    }
  };
  reader.readAsDataURL(file);
}

function optimizeImageData(dataUrl: string) {
  const img = new window.Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate new dimensions (max 1920px width)
    let width = img.width;
    let height = img.height;
    const maxWidth = 1920;

    if (width > maxWidth) {
      height = (maxWidth / width) * height;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw and compress
    ctx?.drawImage(img, 0, 0, width, height);
    const optimized = canvas.toDataURL('image/jpeg', 0.85);

    imageUrl.value = optimized;
    updateImageSource();
    showToast('Image optimized successfully', 'success');
  };
  img.src = dataUrl;
}

function applyFilters() {
  if (!store.selectedComponent) return;

  const filterString = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) blur(${blur.value}px)`;

  store.updateComponentStyle(store.selectedComponent.id, 'filter', filterString);
}

function resetFilters() {
  brightness.value = 100;
  contrast.value = 100;
  saturation.value = 100;
  blur.value = 0;
  activeFilter.value = '';
  applyFilters();
}

function applyPresetFilter(filter: any) {
  if (!store.selectedComponent) return;

  activeFilter.value = filter.id;

  if (filter.id === 'none') {
    resetFilters();
  } else {
    store.updateComponentStyle(store.selectedComponent.id, 'filter', filter.style.filter);
  }
}

function updateAltText() {
  if (!store.selectedComponent) return;

  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      alt: altText.value
    }
  });
}

function updateObjectFit() {
  if (!store.selectedComponent) return;

  store.updateComponentStyle(store.selectedComponent.id, 'objectFit', objectFit.value);
}

function updateLoading() {
  if (!store.selectedComponent) return;

  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      loading: loading.value
    }
  });
}

function toggleOptimization() {
  // Save preference
  localStorage.setItem('imageOptimization', optimizeImage.value.toString());
}

function openAssetManager() {
  store.toggleAssetManager();
}

function useUnsplash() {
  // Open Unsplash modal
  showToast('Unsplash integration coming soon', 'info');
}

function usePlaceholder() {
  const width = 800;
  const height = 600;
  imageUrl.value = `https://via.placeholder.com/${width}x${height}`;
  updateImageSource();
}

function useIcons() {
  showToast('Icon library coming soon', 'info');
}

function setCropRatio(ratio: any) {
  // Implement cropping logic
  showToast('Cropping feature coming soon', 'info');
}

function applyCrop() {
  showCropper.value = false;
  showToast('Image cropped', 'success');
}

function cancelCrop() {
  showCropper.value = false;
}

// Watch for component changes
watch(() => store.selectedComponent, (component) => {
  if (component?.type === 'image') {
    imageUrl.value = component.props.src || '';
    altText.value = component.props.alt || '';

    // Parse existing styles
    const styles = component.props.style || {};
    objectFit.value = styles.objectFit || 'cover';

    // Parse filters if exist
    const filterString = styles.filter || '';
    if (filterString) {
      // Extract filter values
      const brightnessMatch = filterString.match(/brightness\((\d+)%\)/);
      const contrastMatch = filterString.match(/contrast\((\d+)%\)/);
      const saturateMatch = filterString.match(/saturate\((\d+)%\)/);
      const blurMatch = filterString.match(/blur\((\d+)px\)/);

      if (brightnessMatch) brightness.value = parseInt(brightnessMatch[1]);
      if (contrastMatch) contrast.value = parseInt(contrastMatch[1]);
      if (saturateMatch) saturation.value = parseInt(saturateMatch[1]);
      if (blurMatch) blur.value = parseInt(blurMatch[1]);
    }
  }
}, { immediate: true });
</script>

<style scoped>
.image-editor {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.editor-header h4 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f3f4f6;
}

.toggle-btn svg {
  transition: transform 0.2s;
}

.toggle-btn svg.rotated {
  transform: rotate(180deg);
}

/* Image Source */
.image-source {
  margin-bottom: 20px;
}

.image-source label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.source-input {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.source-input input {
  flex: 1;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
}

.source-input input:focus {
  outline: none;
  border-color: #5b21b6;
}

.browse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.browse-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Drop Zone */
.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.drop-zone:hover,
.drop-zone.dragging {
  background: #f3f4f6;
  border-color: #5b21b6;
}

.drop-zone p {
  font-size: 13px;
  color: #6b7280;
}

.drop-zone span {
  font-size: 12px;
  color: #9ca3af;
}

.upload-btn {
  padding: 6px 12px;
  background: #5b21b6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover {
  background: #4c1d95;
}

/* Quick Sources */
.quick-sources {
  margin-bottom: 20px;
}

.quick-sources h5,
.image-adjustments h5,
.image-filters h5,
.image-settings h5,
.cropping-tool h5 {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.source-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.source-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 11px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.source-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

/* Image Adjustments */
.image-adjustments {
  margin-bottom: 20px;
}

.adjustment-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.control-group {
  display: grid;
  grid-template-columns: 80px 1fr 40px;
  align-items: center;
  gap: 8px;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #374151;
}

.control-group input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.control-group span {
  font-size: 11px;
  color: #6b7280;
  text-align: right;
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Image Filters */
.image-filters {
  margin-bottom: 20px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.filter-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.filter-btn.active {
  border-color: #5b21b6;
  background: #f3f0ff;
}

.filter-preview {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

.filter-btn span {
  font-size: 10px;
  color: #6b7280;
}

/* Image Settings */
.setting-group {
  margin-bottom: 12px;
}

.setting-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #374151;
  margin-bottom: 6px;
}

.setting-group input[type="text"],
.setting-group select {
  width: 100%;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
}

.setting-group input[type="checkbox"] {
  margin-right: 6px;
}

/* Cropping Tool */
.crop-presets {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.ratio-btn {
  flex: 1;
  padding: 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 11px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.ratio-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.apply-btn,
.cancel-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 6px;
}

.apply-btn {
  background: #5b21b6;
  color: white;
}

.apply-btn:hover {
  background: #4c1d95;
}

.cancel-btn {
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover {
  background: #f9fafb;
}
</style>