<template>
  <div class="asset-manager-modal" v-if="props.isOpen" @click.self="close">
    <div class="asset-manager-content">
      <div class="asset-manager-header">
        <h2>Asset Library</h2>
        <button class="close-btn" @click="close">
          <i class="i-lucide-x"></i>
        </button>
      </div>

      <div class="asset-manager-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id as 'uploads' | 'unsplash' | 'pexels' | 'icons'"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>

      <div class="asset-manager-body">
        <!-- Upload Tab -->
        <div v-if="activeTab === 'uploads'" class="tab-content">
          <div 
            class="upload-zone"
            :class="{ dragging: isDragging }"
            @dragenter.prevent="isDragging = true"
            @dragover.prevent
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input 
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileSelect"
              style="display: none"
            />
            <i class="i-lucide-upload-cloud"></i>
            <p>Drop images here or click to upload</p>
            <p class="text-muted">Maximum file size: 5MB</p>
          </div>

          <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p>Uploading... {{ uploadProgress }}%</p>
          </div>

          <div class="asset-grid" v-if="uploadedAssets.length > 0">
            <div 
              v-for="asset in uploadedAssets" 
              :key="asset.id"
              class="asset-item"
              :class="{ selected: selectedAsset?.id === asset.id }"
              @click="selectAsset(asset)"
            >
              <img :src="asset.thumbnail || asset.url" :alt="asset.metadata.name" />
              <div class="asset-info">
                <span class="asset-name">{{ truncateName(asset.metadata.name) }}</span>
                <span class="asset-size">{{ formatFileSize(asset.metadata.size) }}</span>
              </div>
              <button class="delete-btn" @click.stop="deleteAsset(asset.id)">
                <i class="i-lucide-trash-2"></i>
              </button>
            </div>
          </div>

          <div v-else class="empty-state">
            <i class="i-lucide-image"></i>
            <p>No uploaded images yet</p>
          </div>
        </div>

        <!-- Unsplash Tab -->
        <div v-if="activeTab === 'unsplash'" class="tab-content">
          <div class="search-bar">
            <i class="i-lucide-search"></i>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search Unsplash..."
              @keyup.enter="searchUnsplash"
            />
            <button @click="searchUnsplash" class="search-btn">
              Search
            </button>
          </div>

          <div class="asset-grid" v-if="unsplashAssets.length > 0">
            <div 
              v-for="asset in unsplashAssets" 
              :key="asset.id"
              class="asset-item external"
              @click="selectExternalAsset(asset)"
            >
              <img :src="asset.thumbnail" :alt="asset.description" loading="lazy" />
              <div class="asset-overlay">
                <span class="asset-author">Photo by {{ asset.author }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="isSearching" class="loading-state">
            <i class="i-lucide-loader-2 animate-spin"></i>
            <p>Searching...</p>
          </div>

          <div v-else class="empty-state">
            <i class="i-lucide-search"></i>
            <p>Search for free stock photos</p>
          </div>

          <div v-if="unsplashAssets.length > 0" class="pagination">
            <button @click="loadMoreUnsplash" :disabled="isSearching">
              Load More
            </button>
          </div>
        </div>

        <!-- Pexels Tab -->
        <div v-if="activeTab === 'pexels'" class="tab-content">
          <div class="search-bar">
            <i class="i-lucide-search"></i>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search Pexels..."
              @keyup.enter="searchPexels"
            />
            <button @click="searchPexels" class="search-btn">
              Search
            </button>
          </div>

          <div class="asset-grid" v-if="pexelsAssets.length > 0">
            <div 
              v-for="asset in pexelsAssets" 
              :key="asset.id"
              class="asset-item external"
              @click="selectExternalAsset(asset)"
            >
              <img :src="asset.thumbnail" :alt="asset.description" loading="lazy" />
              <div class="asset-overlay">
                <span class="asset-author">Photo by {{ asset.author }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="isSearching" class="loading-state">
            <i class="i-lucide-loader-2 animate-spin"></i>
            <p>Searching...</p>
          </div>

          <div v-else class="empty-state">
            <i class="i-lucide-search"></i>
            <p>Search for free stock photos</p>
          </div>

          <div v-if="pexelsAssets.length > 0" class="pagination">
            <button @click="loadMorePexels" :disabled="isSearching">
              Load More
            </button>
          </div>
        </div>

        <!-- Icons Tab -->
        <div v-if="activeTab === 'icons'" class="tab-content">
          <div class="coming-soon">
            <i class="i-lucide-package"></i>
            <h3>Coming Soon</h3>
            <p>Icon library will be available in a future update</p>
          </div>
        </div>
      </div>

      <div class="asset-manager-footer">
        <button class="btn-secondary" @click="close">Cancel</button>
        <button 
          class="btn-primary" 
          @click="useAsset"
          :disabled="!selectedAsset && !pendingExternalAsset"
        >
          Use Selected Asset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { assetService } from '@/services/assetService';
import type { Asset, ExternalAsset } from '@/types/asset';
import { useToast } from '@/composables/useToast';

interface Props {
  isOpen: boolean;
  onSelect?: (asset: Asset) => void;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'select']);

const { showToast } = useToast();

// State
const activeTab = ref<'uploads' | 'unsplash' | 'pexels' | 'icons'>('uploads');
const uploadedAssets = ref<Asset[]>([]);
const unsplashAssets = ref<ExternalAsset[]>([]);
const pexelsAssets = ref<ExternalAsset[]>([]);
const selectedAsset = ref<Asset | null>(null);
const pendingExternalAsset = ref<ExternalAsset | null>(null);
const searchQuery = ref('');
const isSearching = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement>();

// Pagination
const unsplashPage = ref(1);
const pexelsPage = ref(1);

const tabs = [
  { id: 'uploads', label: 'Uploads', icon: 'i-lucide-upload' },
  { id: 'unsplash', label: 'Unsplash', icon: 'i-lucide-image' },
  { id: 'pexels', label: 'Pexels', icon: 'i-lucide-camera' },
  { id: 'icons', label: 'Icons', icon: 'i-lucide-shapes' }
];

// Load uploaded assets on mount
onMounted(async () => {
  await loadUploadedAssets();
});

async function loadUploadedAssets() {
  try {
    uploadedAssets.value = await assetService.getAssets('image');
  } catch (error) {
    showToast('Failed to load assets', 'error');
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;
  await uploadFiles(Array.from(files));
}

async function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer?.files || []);
  const imageFiles = files.filter(f => f.type.startsWith('image/'));
  if (imageFiles.length > 0) {
    await uploadFiles(imageFiles);
  }
}

async function uploadFiles(files: File[]) {
  isUploading.value = true;
  uploadProgress.value = 0;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadProgress.value = Math.round(((i + 1) / files.length) * 100);
      
      try {
        const asset = await assetService.uploadImage(file);
        uploadedAssets.value.unshift(asset);
      } catch (error: any) {
        showToast(error.message || `Failed to upload ${file.name}`, 'error');
      }
    }
    
    showToast(`Successfully uploaded ${files.length} image(s)`, 'success');
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
}

async function deleteAsset(id: string) {
  if (!confirm('Are you sure you want to delete this asset?')) return;

  try {
    await assetService.deleteAsset(id);
    uploadedAssets.value = uploadedAssets.value.filter(a => a.id !== id);
    if (selectedAsset.value?.id === id) {
      selectedAsset.value = null;
    }
    showToast('Asset deleted', 'success');
  } catch (error) {
    showToast('Failed to delete asset', 'error');
  }
}

async function searchUnsplash() {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  unsplashPage.value = 1;

  try {
    unsplashAssets.value = await assetService.searchUnsplash({
      query: searchQuery.value,
      page: 1
    });
  } catch (error) {
    showToast('Failed to search Unsplash', 'error');
  } finally {
    isSearching.value = false;
  }
}

async function loadMoreUnsplash() {
  if (!searchQuery.value.trim() || isSearching.value) return;

  isSearching.value = true;
  unsplashPage.value++;

  try {
    const moreAssets = await assetService.searchUnsplash({
      query: searchQuery.value,
      page: unsplashPage.value
    });
    unsplashAssets.value.push(...moreAssets);
  } catch (error) {
    showToast('Failed to load more images', 'error');
  } finally {
    isSearching.value = false;
  }
}

async function searchPexels() {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  pexelsPage.value = 1;

  try {
    pexelsAssets.value = await assetService.searchPexels({
      query: searchQuery.value,
      page: 1
    });
  } catch (error) {
    showToast('Failed to search Pexels', 'error');
  } finally {
    isSearching.value = false;
  }
}

async function loadMorePexels() {
  if (!searchQuery.value.trim() || isSearching.value) return;

  isSearching.value = true;
  pexelsPage.value++;

  try {
    const moreAssets = await assetService.searchPexels({
      query: searchQuery.value,
      page: pexelsPage.value
    });
    pexelsAssets.value.push(...moreAssets);
  } catch (error) {
    showToast('Failed to load more images', 'error');
  } finally {
    isSearching.value = false;
  }
}

function selectAsset(asset: Asset) {
  selectedAsset.value = asset;
  pendingExternalAsset.value = null;
}

function selectExternalAsset(asset: ExternalAsset) {
  pendingExternalAsset.value = asset;
  selectedAsset.value = null;
}

async function useAsset() {
  if (selectedAsset.value) {
    emit('select', selectedAsset.value);
    close();
  } else if (pendingExternalAsset.value) {
    try {
      const asset = await assetService.importExternalAsset(pendingExternalAsset.value);
      emit('select', asset);
      close();
    } catch (error) {
      showToast('Failed to import asset', 'error');
    }
  }
}

function close() {
  emit('close');
}

function truncateName(name: string, maxLength = 20) {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<style scoped>
.asset-manager-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.asset-manager-content {
  background: var(--bg-primary);
  border-radius: 8px;
  width: 90vw;
  max-width: 900px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.asset-manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.asset-manager-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.asset-manager-tabs {
  display: flex;
  gap: 1rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  font-size: 0.875rem;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.asset-manager-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
}

.upload-zone:hover,
.upload-zone.dragging {
  border-color: var(--primary);
  background: var(--bg-secondary);
}

.upload-zone i {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  display: block;
}

.upload-zone p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

.upload-zone .text-muted {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.upload-progress {
  margin-bottom: 1.5rem;
  text-align: center;
}

.progress-bar {
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.search-bar i {
  color: var(--text-secondary);
}

.search-bar input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-btn {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.search-btn:hover {
  opacity: 0.9;
}

.asset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.asset-item {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
}

.asset-item:hover {
  border-color: var(--border-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.asset-item.selected {
  border-color: var(--primary);
}

.asset-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.asset-info {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.asset-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.asset-size {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.asset-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(220, 38, 38, 0.9);
}

.asset-item.external {
  position: relative;
}

.asset-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.asset-item:hover .asset-overlay {
  opacity: 1;
}

.asset-author {
  font-size: 0.75rem;
  color: white;
}

.empty-state,
.loading-state,
.coming-soon {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state i,
.loading-state i,
.coming-soon i {
  font-size: 3rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  display: block;
}

.empty-state p,
.loading-state p,
.coming-soon p {
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

.coming-soon h3 {
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem;
  color: var(--text-primary);
}

.pagination {
  margin-top: 2rem;
  text-align: center;
}

.pagination button {
  padding: 0.75rem 2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: var(--bg-tertiary);
  border-color: var(--primary);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.asset-manager-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>