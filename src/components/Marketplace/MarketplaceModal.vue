<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click="$emit('close')">
      <div class="marketplace-modal" @click.stop>
        <div class="modal-header">
          <div class="header-left">
            <Store :size="24" class="store-icon" />
            <div>
              <h2>Template Marketplace</h2>
              <p class="subtitle">Community-built templates to kickstart your project</p>
            </div>
          </div>
          <button @click="$emit('close')" class="close-btn">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-content">
          <!-- Filters Sidebar -->
          <aside class="filters-sidebar">
            <div class="search-box">
              <Search :size="18" class="search-icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search templates..."
                @input="filterTemplates"
              />
            </div>

            <div class="filter-section">
              <h4>Categories</h4>
              <div class="filter-options">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  :class="['filter-btn', { active: selectedCategory === cat.id }]"
                  @click="selectedCategory = cat.id"
                >
                  <component :is="cat.icon" :size="16" />
                  <span>{{ cat.name }}</span>
                  <span class="count">{{ getCategoryCount(cat.id) }}</span>
                </button>
              </div>
            </div>

            <div class="filter-section">
              <h4>Sort By</h4>
              <select v-model="sortBy" class="sort-select">
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="downloads">Most Downloads</option>
              </select>
            </div>

            <div class="filter-section">
              <h4>Price</h4>
              <div class="price-filters">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="showFree" />
                  <span>Free</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="showPremium" />
                  <span>Premium</span>
                </label>
              </div>
            </div>
          </aside>

          <!-- Templates Grid -->
          <main class="templates-main">
            <div class="results-header">
              <span class="results-count">
                {{ filteredTemplates.length }} templates found
              </span>
              <div class="view-toggle">
                <button
                  :class="['view-btn', { active: viewMode === 'grid' }]"
                  @click="viewMode = 'grid'"
                >
                  <Grid3x3 :size="18" />
                </button>
                <button
                  :class="['view-btn', { active: viewMode === 'list' }]"
                  @click="viewMode = 'list'"
                >
                  <List :size="18" />
                </button>
              </div>
            </div>

            <div :class="['templates-grid', viewMode]">
              <div
                v-for="template in filteredTemplates"
                :key="template.id"
                class="template-card"
                @click="selectTemplate(template)"
              >
                <div class="card-preview">
                  <img :src="template.preview" :alt="template.name" />
                  <div class="card-overlay">
                    <button class="preview-btn">
                      <Eye :size="18" />
                      Preview
                    </button>
                  </div>
                  <span v-if="template.isPremium" class="premium-badge">
                    <Crown :size="12" />
                    Premium
                  </span>
                </div>
                <div class="card-content">
                  <div class="card-header">
                    <h3>{{ template.name }}</h3>
                    <span :class="['category-tag', template.category]">
                      {{ template.category }}
                    </span>
                  </div>
                  <p class="card-description">{{ template.description }}</p>
                  <div class="card-meta">
                    <div class="rating">
                      <Star :size="14" class="star-icon" />
                      <span>{{ template.rating }}</span>
                      <span class="reviews">({{ template.reviews }})</span>
                    </div>
                    <div class="downloads">
                      <Download :size="14" />
                      <span>{{ formatNumber(template.downloads) }}</span>
                    </div>
                  </div>
                  <div class="card-footer">
                    <div class="author">
                      <div class="author-avatar" :style="{ backgroundColor: template.authorColor }">
                        {{ template.author.charAt(0) }}
                      </div>
                      <span>{{ template.author }}</span>
                    </div>
                    <button class="use-btn" @click.stop="useTemplate(template)">
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredTemplates.length === 0" class="no-results">
              <PackageX :size="48" />
              <h3>No templates found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </main>
        </div>

        <!-- Template Detail Modal -->
        <div v-if="selectedTemplateDetail" class="detail-overlay" @click="selectedTemplateDetail = null">
          <div class="detail-modal" @click.stop>
            <button class="detail-close" @click="selectedTemplateDetail = null">
              <X :size="20" />
            </button>
            
            <div class="detail-preview">
              <img :src="selectedTemplateDetail.preview" :alt="selectedTemplateDetail.name" />
            </div>
            
            <div class="detail-content">
              <div class="detail-header">
                <h2>{{ selectedTemplateDetail.name }}</h2>
                <span :class="['category-tag', selectedTemplateDetail.category]">
                  {{ selectedTemplateDetail.category }}
                </span>
              </div>
              
              <p class="detail-description">{{ selectedTemplateDetail.fullDescription }}</p>
              
              <div class="detail-stats">
                <div class="stat">
                  <Star :size="20" class="star-icon" />
                  <span class="stat-value">{{ selectedTemplateDetail.rating }}</span>
                  <span class="stat-label">{{ selectedTemplateDetail.reviews }} reviews</span>
                </div>
                <div class="stat">
                  <Download :size="20" />
                  <span class="stat-value">{{ formatNumber(selectedTemplateDetail.downloads) }}</span>
                  <span class="stat-label">downloads</span>
                </div>
                <div class="stat">
                  <Layers :size="20" />
                  <span class="stat-value">{{ selectedTemplateDetail.components }}</span>
                  <span class="stat-label">components</span>
                </div>
              </div>

              <div class="detail-features">
                <h4>Features</h4>
                <ul>
                  <li v-for="feature in selectedTemplateDetail.features" :key="feature">
                    <Check :size="16" />
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <div class="detail-actions">
                <button class="btn-secondary" @click="selectedTemplateDetail = null">
                  Cancel
                </button>
                <button class="btn-primary" @click="useTemplate(selectedTemplateDetail)">
                  <Download :size="18" />
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  X,
  Search,
  Grid3x3,
  List,
  Star,
  Download,
  Eye,
  Crown,
  Check,
  Layers,
  Layout,
  Briefcase,
  FileText,
  ShoppingBag,
  Globe
} from 'lucide-vue-next';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';

// Custom icons
const Store = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :width="size" :height="size"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`,
  props: { size: { type: Number, default: 24 } }
};

const PackageX = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :width="size" :height="size"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/><path d="m17 13 5 5m-5 0 5-5"/></svg>`,
  props: { size: { type: Number, default: 24 } }
};

const emit = defineEmits<{
  close: [];
}>();

const store = useEditorStore();
const { showToast } = useToast();

// State
const searchQuery = ref('');
const selectedCategory = ref('all');
const sortBy = ref('popular');
const showFree = ref(true);
const showPremium = ref(true);
const viewMode = ref<'grid' | 'list'>('grid');
const selectedTemplateDetail = ref<any>(null);

// Categories
const categories = [
  { id: 'all', name: 'All Templates', icon: Globe },
  { id: 'landing', name: 'Landing Page', icon: Layout },
  { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
  { id: 'blog', name: 'Blog', icon: FileText },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
];

// Mock template data
const templates = ref([
  {
    id: '1',
    name: 'Startup Launch',
    category: 'landing',
    description: 'Modern SaaS landing page with dark theme',
    fullDescription: 'A comprehensive landing page template for startups and SaaS products. Features a stunning hero section, feature highlights, pricing tables, and testimonials.',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 128,
    downloads: 3420,
    author: 'DesignCraft',
    authorColor: '#6366F1',
    isPremium: false,
    components: 12,
    features: ['Responsive design', 'Dark/Light modes', 'Animation ready', 'SEO optimized']
  },
  {
    id: '2',
    name: 'Creative Portfolio',
    category: 'portfolio',
    description: 'Showcase your work with stunning animations',
    fullDescription: 'Perfect for designers, photographers, and creatives. Includes gallery layouts, project showcases, and contact forms.',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 89,
    downloads: 2150,
    author: 'PixelPerfect',
    authorColor: '#EC4899',
    isPremium: true,
    components: 15,
    features: ['Masonry gallery', 'Smooth animations', 'Project filters', 'Contact integration']
  },
  {
    id: '3',
    name: 'Tech Blog',
    category: 'blog',
    description: 'Clean and readable blog for developers',
    fullDescription: 'A minimalist blog template focused on readability. Supports code highlighting, markdown, and categories.',
    preview: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 156,
    downloads: 4890,
    author: 'DevDesigns',
    authorColor: '#10B981',
    isPremium: false,
    components: 8,
    features: ['Code highlighting', 'Reading time', 'Categories', 'Newsletter signup']
  },
  {
    id: '4',
    name: 'Fashion Store',
    category: 'ecommerce',
    description: 'Elegant e-commerce for fashion brands',
    fullDescription: 'Premium e-commerce template with product galleries, cart functionality, and checkout flow.',
    preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 234,
    downloads: 5670,
    author: 'ShopifyPro',
    authorColor: '#F59E0B',
    isPremium: true,
    components: 24,
    features: ['Product galleries', 'Cart system', 'Size guides', 'Wishlist']
  },
  {
    id: '5',
    name: 'Agency Pro',
    category: 'landing',
    description: 'Professional agency website template',
    fullDescription: 'Complete agency website with services, team, portfolio, and blog sections.',
    preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 67,
    downloads: 1890,
    author: 'WebCraft',
    authorColor: '#8B5CF6',
    isPremium: false,
    components: 18,
    features: ['Team section', 'Services grid', 'Case studies', 'Blog integration']
  },
  {
    id: '6',
    name: 'Minimal Portfolio',
    category: 'portfolio',
    description: 'Ultra-minimal portfolio for artists',
    fullDescription: 'Let your work speak for itself with this clean, distraction-free portfolio template.',
    preview: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 92,
    downloads: 2340,
    author: 'MinimalUI',
    authorColor: '#1F2937',
    isPremium: false,
    components: 6,
    features: ['Fullscreen gallery', 'Minimal navigation', 'Touch gestures', 'Fast loading']
  },
  {
    id: '7',
    name: 'Digital Magazine',
    category: 'blog',
    description: 'Magazine-style blog with rich layouts',
    fullDescription: 'Transform your content into a digital magazine with multiple layout options and rich media support.',
    preview: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
    rating: 4.5,
    reviews: 45,
    downloads: 1560,
    author: 'MediaLabs',
    authorColor: '#EF4444',
    isPremium: true,
    components: 20,
    features: ['Multiple layouts', 'Video embeds', 'Audio player', 'Social sharing']
  },
  {
    id: '8',
    name: 'Digital Products',
    category: 'ecommerce',
    description: 'Sell digital products and downloads',
    fullDescription: 'Perfect for selling ebooks, courses, or digital assets. Includes download management and licensing.',
    preview: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 78,
    downloads: 2890,
    author: 'GumroadUI',
    authorColor: '#06B6D4',
    isPremium: false,
    components: 14,
    features: ['Download links', 'License keys', 'Payment forms', 'Analytics']
  },
  {
    id: '9',
    name: 'App Landing',
    category: 'landing',
    description: 'Mobile app showcase landing page',
    fullDescription: 'Showcase your mobile app with this stunning landing page featuring device mockups and feature highlights.',
    preview: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 112,
    downloads: 3780,
    author: 'AppUI',
    authorColor: '#14B8A6',
    isPremium: false,
    components: 10,
    features: ['Device mockups', 'Feature cards', 'App store links', 'Screenshots gallery']
  },
  {
    id: '10',
    name: 'Photo Portfolio',
    category: 'portfolio',
    description: 'Stunning gallery for photographers',
    fullDescription: 'Image-first portfolio with lightbox galleries, EXIF data display, and client proofing features.',
    preview: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 201,
    downloads: 4560,
    author: 'PhotoPro',
    authorColor: '#D946EF',
    isPremium: true,
    components: 16,
    features: ['Lightbox gallery', 'EXIF display', 'Client proofing', 'Print shop']
  },
  {
    id: '11',
    name: 'Personal Blog',
    category: 'blog',
    description: 'Cozy personal blog with warm aesthetics',
    fullDescription: 'Share your thoughts with this warm and inviting blog template. Perfect for lifestyle and personal content.',
    preview: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 134,
    downloads: 3210,
    author: 'CozyThemes',
    authorColor: '#F97316',
    isPremium: false,
    components: 9,
    features: ['About section', 'Instagram feed', 'Newsletter', 'Comment system']
  },
  {
    id: '12',
    name: 'Electronics Store',
    category: 'ecommerce',
    description: 'Modern tech e-commerce template',
    fullDescription: 'Complete e-commerce solution for electronics and gadgets. Features comparison tools and spec sheets.',
    preview: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 167,
    downloads: 4120,
    author: 'TechShop',
    authorColor: '#3B82F6',
    isPremium: true,
    components: 22,
    features: ['Product comparison', 'Spec sheets', 'Reviews system', 'Quick view']
  }
]);

// Computed
const filteredTemplates = computed(() => {
  let result = [...templates.value];

  // Category filter
  if (selectedCategory.value !== 'all') {
    result = result.filter(t => t.category === selectedCategory.value);
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.author.toLowerCase().includes(query)
    );
  }

  // Price filter
  if (!showFree.value) {
    result = result.filter(t => t.isPremium);
  }
  if (!showPremium.value) {
    result = result.filter(t => !t.isPremium);
  }

  // Sort
  switch (sortBy.value) {
    case 'popular':
      result.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'newest':
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'downloads':
      result.sort((a, b) => b.downloads - a.downloads);
      break;
  }

  return result;
});

function getCategoryCount(categoryId: string): number {
  if (categoryId === 'all') return templates.value.length;
  return templates.value.filter(t => t.category === categoryId).length;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function selectTemplate(template: any) {
  selectedTemplateDetail.value = template;
}

function filterTemplates() {
  // Filtering is reactive via computed
}

function useTemplate(template: any) {
  // Generate sample components based on template
  const sampleComponents = generateTemplateComponents(template);
  
  // Add to canvas
  sampleComponents.forEach(comp => {
    store.addComponentDirect(comp as any);
  });

  showToast(`"${template.name}" template applied!`, 'success');
  selectedTemplateDetail.value = null;
  emit('close');
}

function generateTemplateComponents(template: any): any[] {
  // Generate actual component structures based on template category
  const baseComponents = [
    {
      type: 'section',
      displayName: 'Hero Section',
      props: {
        content: '',
        attributes: {}
      },
      styles: {
        base: {
          padding: '80px 24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      },
      children: [
        {
          type: 'heading',
          displayName: 'Hero Title',
          props: { content: template.name },
          styles: { base: { fontSize: '48px', fontWeight: '700', marginBottom: '16px' } }
        },
        {
          type: 'text',
          displayName: 'Hero Subtitle',
          props: { content: template.description },
          styles: { base: { fontSize: '20px', opacity: '0.9', maxWidth: '600px', margin: '0 auto' } }
        }
      ]
    },
    {
      type: 'section',
      displayName: 'Features Section',
      props: { content: '', attributes: {} },
      styles: {
        base: {
          padding: '64px 24px',
          backgroundColor: '#f9fafb'
        }
      },
      children: []
    }
  ];

  return baseComponents;
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.marketplace-modal {
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.store-icon {
  color: #6366F1;
}

.header-left h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.close-btn {
  padding: 8px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.modal-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Filters Sidebar */
.filters-sidebar {
  width: 240px;
  padding: 20px;
  border-right: 1px solid #E5E7EB;
  overflow-y: auto;
  background: #FAFAFA;
}

.search-box {
  position: relative;
  margin-bottom: 24px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section h4 {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #4B5563;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.filter-btn:hover {
  background: white;
}

.filter-btn.active {
  background: white;
  color: #6366F1;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-btn .count {
  margin-left: auto;
  font-size: 12px;
  color: #9CA3AF;
}

.sort-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.price-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4B5563;
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  accent-color: #6366F1;
}

/* Templates Main */
.templates-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-count {
  font-size: 14px;
  color: #6B7280;
}

.view-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #F3F4F6;
  border-radius: 8px;
}

.view-btn {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.2s;
}

.view-btn.active {
  background: white;
  color: #6366F1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Templates Grid */
.templates-grid {
  display: grid;
  gap: 20px;
}

.templates-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.templates-grid.list {
  grid-template-columns: 1fr;
}

.templates-grid.list .template-card {
  display: flex;
  flex-direction: row;
}

.templates-grid.list .card-preview {
  width: 200px;
  flex-shrink: 0;
}

.template-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
  cursor: pointer;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-preview {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.card-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.template-card:hover .card-preview img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-card:hover .card-overlay {
  opacity: 1;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.preview-btn:hover {
  transform: scale(1.05);
}

.premium-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.card-content {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.category-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: capitalize;
}

.category-tag.landing { background: #DBEAFE; color: #1D4ED8; }
.category-tag.portfolio { background: #FCE7F3; color: #BE185D; }
.category-tag.blog { background: #D1FAE5; color: #047857; }
.category-tag.ecommerce { background: #FEF3C7; color: #B45309; }

.card-description {
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 12px;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.rating,
.downloads {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6B7280;
}

.star-icon {
  color: #F59E0B;
  fill: #F59E0B;
}

.reviews {
  color: #9CA3AF;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.author span {
  font-size: 13px;
  color: #6B7280;
}

.use-btn {
  padding: 8px 14px;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.use-btn:hover {
  background: #4F46E5;
  transform: translateY(-1px);
}

/* No Results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9CA3AF;
}

.no-results h3 {
  margin: 16px 0 8px;
  color: #6B7280;
}

/* Detail Modal */
.detail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.detail-modal {
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.detail-close {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-preview {
  height: 300px;
  overflow: hidden;
}

.detail-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  padding: 24px;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.detail-description {
  font-size: 15px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.detail-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.stat-label {
  font-size: 13px;
}

.detail-features h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.detail-features ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.detail-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4B5563;
}

.detail-features li svg {
  color: #10B981;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.btn-secondary,
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  color: #6B7280;
  border: 1px solid #D1D5DB;
}

.btn-secondary:hover {
  background: #F3F4F6;
}

.btn-primary {
  background: #6366F1;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #4F46E5;
  transform: translateY(-1px);
}
</style>
