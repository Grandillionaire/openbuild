<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div class="template-library-modal" v-if="isOpen" @click.self="close">
        <div class="template-library-content" :class="{ 'slide-in': isOpen }">
          <!-- Premium Header -->
          <div class="template-header">
            <div class="header-content">
              <div class="header-left">
                <div class="header-icon">
                  <Sparkles :size="24" />
                </div>
                <div>
                  <h2>Template Gallery</h2>
                  <p class="header-subtitle">Choose a professionally designed template to start with</p>
                </div>
              </div>
              <button class="close-btn" @click="close">
                <X :size="20" />
              </button>
            </div>
          </div>

          <!-- Enhanced Filters Section -->
          <div class="template-filters">
            <div class="filters-container">
              <!-- Search with Animation -->
              <div class="search-wrapper">
                <div class="search-bar" :class="{ focused: searchFocused }">
                  <Search :size="18" class="search-icon" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search templates by name or category..."
                    @input="handleSearch"
                    @focus="searchFocused = true"
                    @blur="searchFocused = false"
                    class="search-input"
                  />
                  <transition name="fade">
                    <button v-if="searchQuery" @click="clearSearch" class="clear-search">
                      <X :size="16" />
                    </button>
                  </transition>
                </div>
              </div>

              <!-- Premium Category Pills -->
              <div class="category-section">
                <div class="category-pills">
                  <button
                    v-for="category in categories"
                    :key="category.value"
                    @click="selectedCategory = category.value"
                    :class="['category-pill', { active: selectedCategory === category.value }]"
                  >
                    <component :is="category.icon" :size="16" class="category-icon" />
                    <span>{{ category.label }}</span>
                    <span class="category-count">{{ getCategoryCount(category.value) }}</span>
                  </button>
                </div>
              </div>

              <!-- View Toggle -->
              <div class="view-toggle">
                <button
                  :class="['view-btn', { active: viewMode === 'grid' }]"
                  @click="viewMode = 'grid'"
                  title="Grid View"
                >
                  <Grid3x3 :size="18" />
                </button>
                <button
                  :class="['view-btn', { active: viewMode === 'list' }]"
                  @click="viewMode = 'list'"
                  title="List View"
                >
                  <List :size="18" />
                </button>
              </div>
            </div>
          </div>

          <!-- Premium Template Display -->
          <div class="template-body" :class="viewMode">
            <!-- Stats Bar -->
            <div class="stats-bar">
              <div class="stats-left">
                <span class="stat-item">
                  <Layers :size="16" />
                  {{ filteredTemplates.length }} Templates
                </span>
                <span class="stat-item" v-if="selectedCategory !== 'all'">
                  <Filter :size="16" />
                  {{ getCategoryLabel(selectedCategory) }}
                </span>
              </div>
              <div class="stats-right">
                <button class="sort-dropdown" @click="showSort = !showSort">
                  <ArrowUpDown :size="16" />
                  Sort by {{ sortBy }}
                  <ChevronDown :size="16" />
                </button>
              </div>
            </div>

            <!-- Template Grid/List -->
            <div :class="[viewMode === 'grid' ? 'template-grid' : 'template-list']">
              <TransitionGroup name="template-fade">
                <div
                  v-for="template in sortedTemplates"
                  :key="template.id"
                  class="template-card"
                  :class="{
                    selected: selectedTemplate?.id === template.id,
                    premium: template.isPremium,
                    [viewMode]: true
                  }"
                  @click="selectTemplate(template)"
                >
                  <!-- Enhanced Thumbnail -->
                  <div class="template-thumbnail">
                    <div class="thumbnail-wrapper">
                      <img :src="getTemplateImage(template)" :alt="template.name" />
                      <div class="thumbnail-gradient"></div>
                    </div>

                    <!-- Overlay Actions -->
                    <div class="template-overlay">
                      <div class="overlay-content">
                        <button class="action-btn preview" @click.stop="previewTemplate(template)">
                          <Eye :size="20" />
                          <span>Quick Preview</span>
                        </button>
                        <button class="action-btn details" @click.stop="showDetails(template)">
                          <Info :size="20" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>

                    <!-- Badges -->
                    <div class="badge-container">
                      <div v-if="template.isPremium" class="badge premium">
                        <Crown :size="14" />
                        <span>Premium</span>
                      </div>
                      <div v-if="template.isNew" class="badge new">
                        <Sparkles :size="14" />
                        <span>New</span>
                      </div>
                      <div v-if="template.isPopular" class="badge popular">
                        <TrendingUp :size="14" />
                        <span>Popular</span>
                      </div>
                    </div>
                  </div>

                  <!-- Enhanced Info Section -->
                  <div class="template-info">
                    <div class="info-header">
                      <h3>{{ template.name }}</h3>
                      <button class="favorite-btn" @click.stop="toggleFavorite(template)">
                        <Heart :size="18" :fill="isFavorite(template.id) ? '#ef4444' : 'none'" />
                      </button>
                    </div>

                    <p class="template-description">{{ template.description }}</p>

                    <div class="template-meta">
                      <div class="meta-tags">
                        <span
                          v-for="tag in template.tags.slice(0, 3)"
                          :key="tag"
                          class="meta-tag"
                        >
                          {{ tag }}
                        </span>
                        <span v-if="template.tags.length > 3" class="meta-tag more">
                          +{{ template.tags.length - 3 }}
                        </span>
                      </div>

                      <div class="meta-stats">
                        <span class="stat" title="Components">
                          <Package :size="14" />
                          {{ template.components?.length || 0 }}
                        </span>
                        <span class="stat" title="Views">
                          <Eye :size="14" />
                          {{ getTemplateViews(template.id) }}
                        </span>
                        <span class="stat" title="Uses">
                          <Download :size="14" />
                          {{ getTemplateUses(template.id) }}
                        </span>
                      </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="template-actions">
                      <button
                        class="action-select"
                        :class="{ selected: selectedTemplate?.id === template.id }"
                      >
                        <Check :size="16" v-if="selectedTemplate?.id === template.id" />
                        <span>{{ selectedTemplate?.id === template.id ? 'Selected' : 'Select Template' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>

            <!-- Empty State -->
            <div v-if="filteredTemplates.length === 0" class="empty-state">
              <div class="empty-icon">
                <FileX :size="64" />
              </div>
              <h3>No templates found</h3>
              <p>Try adjusting your search or browse all templates</p>
              <button class="reset-btn" @click="resetFilters">
                <RefreshCw :size="16" />
                Reset Filters
              </button>
            </div>
          </div>

          <!-- Premium Footer -->
          <div class="template-footer">
            <div class="footer-left">
              <transition name="slide-fade">
                <div v-if="selectedTemplate" class="selected-info">
                  <div class="selected-preview">
                    <img :src="getTemplateImage(selectedTemplate)" :alt="selectedTemplate.name" />
                  </div>
                  <div class="selected-details">
                    <span class="selected-label">Selected Template</span>
                    <span class="selected-name">{{ selectedTemplate.name }}</span>
                  </div>
                </div>
              </transition>
            </div>

            <div class="footer-actions">
              <button class="btn-secondary" @click="close">
                <X :size="18" />
                Cancel
              </button>
              <button
                class="btn-primary"
                @click="applyTemplate"
                :disabled="!selectedTemplate"
              >
                <Wand2 :size="18" />
                Use This Template
                <ArrowRight :size="18" class="arrow-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTemplateStore } from '@/stores/templates';
import { useToast } from '@/composables/useToast';
import type { Template, TemplateCategory } from '@/types/template';
import {
  X,
  Search,
  Eye,
  FileX,
  Crown,
  Layout,
  Briefcase,
  PenTool,
  ShoppingBag,
  FileText,
  Sparkles,
  Grid3x3,
  List,
  Layers,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Heart,
  Package,
  Download,
  Check,
  Info,
  TrendingUp,
  RefreshCw,
  Wand2,
  ArrowRight
} from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'apply']);

const templateStore = useTemplateStore();
const { showToast } = useToast();

// State
const selectedTemplate = ref<Template | null>(null);
const selectedCategory = ref<TemplateCategory | 'all'>('all');
const searchQuery = ref('');
const searchFocused = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref('popular');
const showSort = ref(false);
const favorites = ref<Set<string>>(new Set());

// Categories with icons and better labels
const categories = [
  { value: 'all', label: 'All', icon: Layout },
  { value: 'landing', label: 'Landing', icon: Layout },
  { value: 'portfolio', label: 'Portfolio', icon: PenTool },
  { value: 'blog', label: 'Blog', icon: FileText },
  { value: 'business', label: 'Business', icon: Briefcase },
  { value: 'ecommerce', label: 'Shop', icon: ShoppingBag }
];

// Computed filtered templates
const filteredTemplates = computed(() => {
  let templates = templateStore.filteredTemplates;

  // Filter by category
  if (selectedCategory.value !== 'all') {
    templates = templates.filter(t => t.category === selectedCategory.value);
  }

  return templates;
});

// Sorted templates
const sortedTemplates = computed(() => {
  const templates = [...filteredTemplates.value];

  switch (sortBy.value) {
    case 'newest':
      return templates.reverse();
    case 'popular':
      return templates.sort((a, b) => getTemplateUses(b.id) - getTemplateUses(a.id));
    case 'alphabetical':
      return templates.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return templates;
  }
});

// Helper Methods
function getCategoryCount(category: string): number {
  if (category === 'all') {
    return templateStore.templates.length;
  }
  return templateStore.templates.filter(t => t.category === category).length;
}

function getCategoryLabel(category: string): string {
  return categories.find(c => c.value === category)?.label || category;
}

function getTemplateImage(template: Template): string {
  // Return actual image or enhanced placeholder
  return template.thumbnail || `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(template.name)}`;
}

function getTemplateViews(templateId: string): string {
  // Mock data - could be real analytics
  const views = Math.floor(Math.random() * 9000) + 1000;
  return views > 1000 ? `${(views / 1000).toFixed(1)}k` : views.toString();
}

function getTemplateUses(templateId: string): number {
  // Mock data - could be real usage stats
  return Math.floor(Math.random() * 500) + 50;
}

function isFavorite(templateId: string): boolean {
  return favorites.value.has(templateId);
}

function toggleFavorite(template: Template): void {
  if (favorites.value.has(template.id)) {
    favorites.value.delete(template.id);
    showToast('Removed from favorites', 'info');
  } else {
    favorites.value.add(template.id);
    showToast('Added to favorites', 'success');
  }
}

// Methods
function handleSearch() {
  templateStore.setFilter({ search: searchQuery.value });
}

function clearSearch() {
  searchQuery.value = '';
  handleSearch();
}

function selectTemplate(template: Template) {
  selectedTemplate.value = template;
}

function previewTemplate(template: Template) {
  // Could open a preview modal
  showToast(`Preview: ${template.name}`, 'info');
}

function showDetails(template: Template) {
  // Could show detailed view
  showToast(`Details: ${template.name}`, 'info');
}

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  templateStore.clearFilter();
}

function applyTemplate() {
  if (!selectedTemplate.value) return;

  const confirmed = confirm(
    'This will replace your current design. Are you sure you want to continue?'
  );

  if (confirmed) {
    const success = templateStore.applyTemplate(selectedTemplate.value.id);

    if (success) {
      showToast(`Applied template: ${selectedTemplate.value.name}`, 'success');
      emit('apply', selectedTemplate.value);
      close();
    } else {
      showToast('Failed to apply template', 'error');
    }
  }
}

function close() {
  selectedTemplate.value = null;
  searchQuery.value = '';
  selectedCategory.value = 'all';
  templateStore.clearFilter();
  emit('close');
}

// Load templates on mount
onMounted(() => {
  // Templates are already loaded from the data file
  // Load favorites from localStorage
  const saved = localStorage.getItem('templateFavorites');
  if (saved) {
    favorites.value = new Set(JSON.parse(saved));
  }
});
</script>

<style scoped>
/* Modern Variables */
:root {
  --modal-bg: rgba(15, 23, 42, 0.8);
  --content-bg: #ffffff;
  --header-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --border-subtle: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --primary: #667eea;
  --primary-dark: #5a67d8;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
}

/* Animations */
@keyframes slideInUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.template-fade-enter-active,
.template-fade-leave-active,
.template-fade-move {
  transition: all 0.3s ease;
}

.template-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.template-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Modal Base */
.template-library-modal {
  position: fixed;
  inset: 0;
  background: var(--modal-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.template-library-content {
  background: var(--content-bg);
  border-radius: 24px;
  width: 95vw;
  max-width: 1400px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  animation: slideInUp 0.4s ease;
}

/* Premium Header */
.template-header {
  background: var(--header-bg);
  padding: 1.75rem 2rem;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.template-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

.header-subtitle {
  font-size: 0.875rem;
  opacity: 0.95;
  margin-top: 0.25rem;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Enhanced Filters */
.template-filters {
  background: #f8fafc;
  border-bottom: 1px solid var(--border-subtle);
  padding: 1.5rem 2rem;
}

.filters-container {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  max-width: 400px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 12px;
  border: 2px solid transparent;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.search-bar.focused {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  color: var(--text-muted);
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.clear-search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #e2e8f0;
  color: var(--text-primary);
}

/* Category Pills */
.category-section {
  flex: 1;
}

.category-pills {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 2px;
}

.category-pills::-webkit-scrollbar {
  height: 2px;
}

.category-pills::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 2px;
}

.category-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 2px solid var(--border-subtle);
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s;
  white-space: nowrap;
}

.category-pill:hover {
  background: #f8fafc;
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
}

.category-pill.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.category-icon {
  opacity: 0.8;
}

.category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-pill.active .category-count {
  background: rgba(255, 255, 255, 0.25);
}

/* View Toggle */
.view-toggle {
  display: flex;
  background: white;
  border-radius: 10px;
  padding: 4px;
  box-shadow: var(--shadow-sm);
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  color: var(--text-secondary);
}

.view-btn.active {
  background: var(--primary);
  color: white;
}

/* Template Body */
.template-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  background: #f8fafc;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
}

.stats-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.sort-dropdown:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

/* Template Grid */
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
}

/* Template Card */
.template-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border: 2px solid transparent;
  box-shadow: var(--shadow-md);
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.template-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), var(--shadow-lg);
}

/* Enhanced Thumbnail */
.template-thumbnail {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.thumbnail-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.template-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.template-card:hover .template-thumbnail img {
  transform: scale(1.05);
}

.thumbnail-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.1) 100%);
}

/* Template Overlay */
.template-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(117, 75, 162, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.action-btn.preview {
  color: var(--primary);
}

.action-btn.details {
  color: var(--text-primary);
}

/* Badges */
.badge-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.badge.premium {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.badge.new {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.badge.popular {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Enhanced Info Section */
.template-info {
  padding: 1.5rem;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.template-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background: #fee2e2;
  color: #ef4444;
  transform: scale(1.1);
}

.template-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Template Meta */
.template-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.meta-tags {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.meta-tag {
  padding: 0.25rem 0.625rem;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.meta-tag:hover {
  background: #e2e8f0;
  color: var(--primary);
}

.meta-tag.more {
  background: #e0e7ff;
  color: var(--primary);
}

.meta-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meta-stats .stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Template Actions */
.template-actions {
  display: flex;
  gap: 0.75rem;
}

.action-select {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #f8fafc;
  border: 2px solid var(--border-subtle);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.action-select:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.action-select.selected {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  margin-top: 2rem;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: #f8fafc;
  border-radius: 24px;
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.empty-state p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
}

/* Premium Footer */
.template-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: white;
  border-top: 1px solid var(--border-subtle);
}

.footer-left {
  flex: 1;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.selected-preview {
  width: 60px;
  height: 45px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.selected-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected-details {
  display: flex;
  flex-direction: column;
}

.selected-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.selected-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f8fafc;
  color: var(--text-primary);
  border: 2px solid var(--border-subtle);
}

.btn-secondary:hover {
  background: #f1f5f9;
  border-color: var(--text-muted);
}

.arrow-icon {
  transition: transform 0.2s;
}

.btn-primary:hover .arrow-icon {
  transform: translateX(2px);
}

/* List View Styles */
.template-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.template-card.list {
  display: flex;
  height: auto;
}

.template-card.list .template-thumbnail {
  width: 280px;
  height: 180px;
  flex-shrink: 0;
}

.template-card.list .template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Responsive */
@media (max-width: 1024px) {
  .template-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .filters-container {
    flex-direction: column;
    gap: 1rem;
  }

  .search-wrapper {
    max-width: 100%;
  }

  .category-section {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .template-library-content {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .template-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .template-header {
    padding: 1.25rem 1rem;
  }

  .template-filters {
    padding: 1rem;
  }

  .template-body {
    padding: 1rem;
  }

  .template-footer {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .footer-actions {
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    justify-content: center;
  }

  .template-card.list {
    flex-direction: column;
  }

  .template-card.list .template-thumbnail {
    width: 100%;
    height: 200px;
  }
}
</style>