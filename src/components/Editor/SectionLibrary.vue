<template>
  <div class="section-library">
    <div class="library-header">
      <h3>Section Templates</h3>
      <button @click="showAllSections = !showAllSections" class="toggle-btn">
        <ChevronDown :size="16" :class="{ rotated: showAllSections }" />
      </button>
    </div>

    <transition name="expand">
      <div v-if="showAllSections" class="sections-content">
        <!-- Search -->
        <div class="section-search">
          <Search :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search sections..."
          />
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="selectedCategory = cat.value"
            :class="['category-tab', { active: selectedCategory === cat.value }]"
          >
            <component :is="cat.icon" :size="14" />
            {{ cat.label }}
          </button>
        </div>

        <!-- Section Grid -->
        <div class="sections-grid">
          <div
            v-for="section in filteredSections"
            :key="section.id"
            class="section-card"
            draggable="true"
            @dragstart="handleDragStart($event, section)"
            @click="addSectionToCanvas(section)"
          >
            <div class="section-preview">
              <div class="preview-placeholder">
                <component :is="getCategoryIcon(section.category)" :size="24" />
              </div>
            </div>
            <div class="section-info">
              <span class="section-name">{{ section.name }}</span>
              <span class="section-category">{{ section.category }}</span>
            </div>
            <div class="section-actions">
              <button
                @click.stop="previewSection(section)"
                class="action-btn"
                title="Preview"
              >
                <Eye :size="14" />
              </button>
              <button
                @click.stop="showVariations(section)"
                class="action-btn"
                title="Variations"
              >
                <Layers :size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredSections.length === 0" class="empty-state">
          <Package :size="32" />
          <p>No sections found</p>
        </div>
      </div>
    </transition>

    <!-- Variations Modal -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showVariationsModal" class="modal-overlay" @click="closeVariationsModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Choose Style Variation</h3>
              <button @click="closeVariationsModal" class="close-btn">
                <X :size="20" />
              </button>
            </div>
            <div class="modal-body">
              <div class="variations-grid">
                <div
                  v-for="variation in currentVariations"
                  :key="variation.id"
                  @click="selectVariation(variation)"
                  class="variation-card"
                >
                  <div class="variation-preview">
                    <span class="style-badge" :class="variation.style">
                      {{ variation.style }}
                    </span>
                  </div>
                  <span class="variation-name">{{ variation.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { sectionTemplates, type SectionTemplate, type SectionVariation } from '@/data/sectionTemplates';
import { useToast } from '@/composables/useToast';
import {
  ChevronDown,
  Search,
  Package,
  Eye,
  Layers,
  X,
  Home,
  Grid3x3,
  MessageSquare,
  DollarSign,
  HelpCircle,
  Mail,
  Info,
  Zap,
  Navigation
} from 'lucide-vue-next';

const store = useEditorStore();
const { showToast } = useToast();

// State
const showAllSections = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('all');
const showVariationsModal = ref(false);
const currentSection = ref<SectionTemplate | null>(null);
const currentVariations = computed(() => currentSection.value?.variations || []);

// Categories
const categories = [
  { value: 'all', label: 'All', icon: Grid3x3 },
  { value: 'hero', label: 'Hero', icon: Home },
  { value: 'features', label: 'Features', icon: Grid3x3 },
  { value: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { value: 'pricing', label: 'Pricing', icon: DollarSign },
  { value: 'faq', label: 'FAQ', icon: HelpCircle },
  { value: 'contact', label: 'Contact', icon: Mail },
  { value: 'about', label: 'About', icon: Info },
  { value: 'cta', label: 'CTA', icon: Zap },
  { value: 'header', label: 'Header', icon: Navigation },
  { value: 'footer', label: 'Footer', icon: Navigation }
];

// Computed
const filteredSections = computed(() => {
  let sections = sectionTemplates;

  // Filter by category
  if (selectedCategory.value !== 'all') {
    sections = sections.filter(s => s.category === selectedCategory.value);
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    sections = sections.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return sections;
});

// Methods
function getCategoryIcon(category: string) {
  const cat = categories.find(c => c.value === category);
  return cat?.icon || Package;
}

function handleDragStart(event: DragEvent, section: SectionTemplate) {
  // Use the first variation as default
  const defaultVariation = section.variations[0];
  if (defaultVariation) {
    event.dataTransfer!.effectAllowed = 'copy';
    event.dataTransfer!.setData('sectionData', JSON.stringify(defaultVariation.components));
  }
}

function addSectionToCanvas(section: SectionTemplate) {
  // If section has multiple variations, show modal
  if (section.variations.length > 1) {
    showVariations(section);
  } else {
    // Add the default variation
    const defaultVariation = section.variations[0];
    if (defaultVariation) {
      // Use the addSectionComponents method from store
      store.addSectionComponents(defaultVariation.components);
      showToast(`Added ${section.name} to canvas`, 'success');
    }
  }
}

function showVariations(section: SectionTemplate) {
  currentSection.value = section;
  showVariationsModal.value = true;
}

function closeVariationsModal() {
  showVariationsModal.value = false;
  currentSection.value = null;
}

function selectVariation(variation: SectionVariation) {
  // Use the addSectionComponents method from store
  store.addSectionComponents(variation.components);
  showToast(`Added ${variation.name} to canvas`, 'success');
  closeVariationsModal();
}

function previewSection(section: SectionTemplate) {
  // TODO: Implement preview functionality
  showToast('Preview coming soon', 'info');
}
</script>

<style scoped>
.section-library {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.library-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
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
  cursor: pointer;
  color: #6b7280;
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

/* Sections Content */
.sections-content {
  margin-top: 12px;
}

.section-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
}

.section-search input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 13px;
  color: #374151;
}

.section-search input::placeholder {
  color: #9ca3af;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.category-tabs::-webkit-scrollbar {
  height: 2px;
}

.category-tabs::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  background: #f9fafb;
  color: #374151;
}

.category-tab.active {
  background: #5b21b6;
  color: white;
  border-color: #5b21b6;
}

/* Sections Grid */
.sections-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.section-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: move;
  transition: all 0.2s;
}

.section-card:hover {
  background: #f9fafb;
  border-color: #5b21b6;
  transform: translateX(2px);
}

.section-preview {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 6px;
  color: #6b7280;
}

.section-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
}

.section-category {
  font-size: 11px;
  color: #9ca3af;
  text-transform: capitalize;
}

.section-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
  color: #9ca3af;
}

.empty-state p {
  font-size: 13px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.variations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.variation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f9fafb;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.variation-card:hover {
  background: white;
  border-color: #5b21b6;
}

.variation-preview {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 6px;
  position: relative;
}

.style-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.style-badge.modern {
  background: #5b21b6;
  color: white;
}

.style-badge.minimal {
  background: #f3f4f6;
  color: #374151;
}

.style-badge.classic {
  background: #1e40af;
  color: white;
}

.style-badge.bold {
  background: #dc2626;
  color: white;
}

.variation-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  text-align: center;
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>