<template>
  <div class="template-library-modal" v-if="isOpen" @click.self="close">
    <div class="template-library-content">
      <div class="template-header">
        <h2>Template Library</h2>
        <button class="close-btn" @click="close">
          <X :size="20" />
        </button>
      </div>

      <div class="template-filters">
        <div class="search-bar">
          <Search :size="18" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search templates..."
            @input="handleSearch"
          />
        </div>

        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.value"
            @click="selectedCategory = category.value"
            :class="['category-tab', { active: selectedCategory === category.value }]"
          >
            <component :is="category.icon" :size="18" />
            {{ category.label }}
          </button>
        </div>
      </div>

      <div class="template-body">
        <div class="template-grid">
          <div
            v-for="template in filteredTemplates"
            :key="template.id"
            class="template-card"
            @click="selectTemplate(template)"
            :class="{ selected: selectedTemplate?.id === template.id }"
          >
            <div class="template-thumbnail">
              <img :src="template.thumbnail" :alt="template.name" />
              <div class="template-overlay">
                <button class="preview-btn">
                  <Eye :size="18" />
                  Preview
                </button>
              </div>
            </div>
            <div class="template-info">
              <h3>{{ template.name }}</h3>
              <p>{{ template.description }}</p>
              <div class="template-tags">
                <span v-for="tag in template.tags.slice(0, 3)" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
            <div v-if="template.isPremium" class="premium-badge">
              <Zap :size="14" />
              Premium
            </div>
          </div>
        </div>

        <div v-if="filteredTemplates.length === 0" class="empty-state">
          <FileX :size="48" />
          <p>No templates found</p>
          <span>Try adjusting your search or filters</span>
        </div>
      </div>

      <div class="template-footer">
        <div class="template-preview" v-if="selectedTemplate">
          <span>Selected: {{ selectedTemplate.name }}</span>
        </div>
        <div class="footer-actions">
          <button class="btn-secondary" @click="close">Cancel</button>
          <button 
            class="btn-primary" 
            @click="applyTemplate"
            :disabled="!selectedTemplate"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  </div>
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
  Zap,
  Layout,
  Briefcase,
  PenTool,
  ShoppingBag,
  FileText
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

// Categories with icons
const categories = [
  { value: 'all', label: 'All Templates', icon: Layout },
  { value: 'landing', label: 'Landing Pages', icon: Layout },
  { value: 'portfolio', label: 'Portfolio', icon: PenTool },
  { value: 'blog', label: 'Blog', icon: FileText },
  { value: 'business', label: 'Business', icon: Briefcase },
  { value: 'ecommerce', label: 'E-commerce', icon: ShoppingBag }
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

// Methods
function handleSearch() {
  templateStore.setFilter({ search: searchQuery.value });
}

function selectTemplate(template: Template) {
  selectedTemplate.value = template;
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
});
</script>

<style scoped>
.template-library-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.template-library-content {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90vw;
  max-width: 1200px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Mobile styles */
@media (max-width: 768px) {
  .template-library-modal {
    align-items: flex-end;
  }
  
  .template-library-content {
    width: 100%;
    height: 95vh;
    border-radius: 12px 12px 0 0;
    max-width: none;
  }
}

.template-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.template-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.template-filters {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.search-bar svg {
  color: var(--text-secondary);
}

.search-bar input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.search-bar input::placeholder {
  color: var(--text-muted);
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.category-tabs::-webkit-scrollbar {
  height: 4px;
}

.category-tabs::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.category-tabs::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.category-tab.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.template-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.template-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border: 2px solid transparent;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.template-card.selected {
  border-color: var(--primary);
}

.template-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.template-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: black;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-btn:hover {
  transform: scale(1.05);
}

.template-info {
  padding: 1.25rem;
}

.template-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--text-primary);
}

.template-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
  line-height: 1.5;
}

.template-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.625rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.premium-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.empty-state svg {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.empty-state span {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.template-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.template-preview {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9375rem;
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
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .template-header {
    padding: 1rem;
  }
  
  .template-header h2 {
    font-size: 1.25rem;
  }

  .template-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .template-filters {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-input {
    width: 100%;
  }

  .template-body {
    padding: 1rem;
  }

  .category-tabs {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    padding-bottom: 0.5rem;
  }
  
  .category-tabs::-webkit-scrollbar {
    height: 3px;
  }
  
  .category-tabs::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
  }
  
  .category-tabs::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 3px;
  }
  
  .template-footer {
    padding: 1rem;
    flex-direction: column-reverse;
    gap: 1rem;
  }
  
  .use-template-btn {
    width: 100%;
    padding: 0.875rem;
  }
  
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .category-tab {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
  
  .template-info h3 {
    font-size: 1rem;
  }
  
  .template-info p {
    font-size: 0.75rem;
  }
  
  .empty-state {
    padding: 2rem;
  }
}
</style>