<template>
  <div class="component-library">
    <!-- Section Templates -->
    <SectionLibrary />

    <!-- Divider -->
    <div class="library-divider"></div>

    <!-- Form Builder -->
    <FormBuilder />

    <!-- Divider -->
    <div class="library-divider"></div>

    <!-- Components -->
    <div class="library-header">
      <h3>Components</h3>
      <button @click="toggleView" class="view-toggle">
        <component :is="viewMode === 'grid' ? List : Grid2X2" :size="16" />
      </button>
    </div>
    
    <div class="search-box">
      <Search :size="16" />
      <input 
        v-model="searchQuery" 
        placeholder="Search components..."
        @input="filterComponents"
      />
    </div>
    
    <div class="library-content">
      <div v-for="category in filteredCategories" :key="category.name" class="category">
        <div 
          class="category-header"
          @click="toggleCategory(category.name)"
        >
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !expandedCategories[category.name] }"
          />
          <span>{{ category.label }}</span>
          <span class="category-count">{{ category.components.length }}</span>
        </div>
        
        <transition name="expand">
          <div 
            v-if="expandedCategories[category.name]"
            :class="['component-grid', viewMode]"
          >
            <div
              v-for="component in category.components"
              :key="component.type"
              :class="['component-item', { dragging: draggedComponent === component.type }]"
              draggable="true"
              @dragstart="startDrag($event, component)"
              @dragend="endDrag"
            >
              <div class="component-icon">
                <component :is="getIcon(component.icon)" :size="20" />
              </div>
              <div class="component-info">
                <div class="component-name">{{ component.displayName }}</div>
                <div v-if="viewMode === 'list'" class="component-desc">
                  {{ component.description }}
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { 
  Search, 
  List, 
  Grid2X2,
  ChevronDown,
  Layout,
  Package,
  Layers,
  Type,
  Image,
  Link,
  MousePointer,
  Grid3X3,
  Columns,
  Square,
  Minus,
  FileText,
  Navigation,
  Home,
  Star,
  Phone,
  Megaphone
} from 'lucide-vue-next';
import { componentDefinitions } from '@/config/components';
import SectionLibrary from './SectionLibrary.vue';
import FormBuilder from './FormBuilder.vue';

const store = useEditorStore();

const viewMode = ref<'grid' | 'list'>('grid');
const searchQuery = ref('');
const draggedComponent = ref<string | null>(null);

const expandedCategories = reactive({
  layout: true,
  content: true,
  media: true,
  blocks: true
});

const categories = [
  {
    name: 'layout',
    label: 'Layout',
    components: [
      { ...componentDefinitions.container, description: 'Container with max-width' },
      { ...componentDefinitions.section, description: 'Full-width section wrapper' },
      { ...componentDefinitions.grid, description: 'Responsive grid layout' },
      { ...componentDefinitions.flex, description: 'Flexible box layout' },
      { ...componentDefinitions.spacer, description: 'Vertical spacing element' }
    ]
  },
  {
    name: 'content',
    label: 'Content',
    components: [
      { ...componentDefinitions.heading, description: 'Heading text (H1-H6)' },
      { ...componentDefinitions.text, description: 'Paragraph text block' },
      { ...componentDefinitions.button, description: 'Interactive button' },
      { ...componentDefinitions.link, description: 'Hyperlink element' }
    ]
  },
  {
    name: 'media',
    label: 'Media',
    components: [
      { ...componentDefinitions.image, description: 'Responsive image' }
    ]
  },
  {
    name: 'blocks',
    label: 'Pre-built Blocks',
    components: [
      { ...componentDefinitions.hero, description: 'Hero section with CTA' },
      { ...componentDefinitions.features, description: 'Feature grid showcase' },
      { ...componentDefinitions.cta, description: 'Call-to-action section' },
      { ...componentDefinitions.footer, description: 'Site footer' },
      { ...componentDefinitions.navigation, description: 'Navigation bar' }
    ]
  }
];

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories;
  
  return categories.map(category => ({
    ...category,
    components: category.components.filter(comp =>
      comp.displayName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      comp.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })).filter(category => category.components.length > 0);
});

function getIcon(iconName: string) {
  const icons: Record<string, any> = {
    package: Package,
    layers: Layers,
    grid: Grid3X3,
    'move-horizontal': Columns,
    'separator-vertical': Minus,
    heading: Type,
    text: FileText,
    'rectangle-horizontal': Square,
    link: Link,
    image: Image,
    'layout-template': Layout,
    'grid-3x3': Grid3X3,
    megaphone: Megaphone,
    'layout-bottom': Layers,
    menu: Navigation
  };
  return icons[iconName] || Package;
}

function toggleView() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
}

function toggleCategory(category: string) {
  expandedCategories[category] = !expandedCategories[category];
}

function filterComponents() {
  // Automatically expand categories with matches
  if (searchQuery.value) {
    Object.keys(expandedCategories).forEach(key => {
      expandedCategories[key] = true;
    });
  }
}

function startDrag(event: DragEvent, component: any) {
  draggedComponent.value = component.type;
  store.isDragging = true;
  store.draggedType = component.type;
  event.dataTransfer!.effectAllowed = 'copy';
  event.dataTransfer!.setData('componentType', component.type);
}

function endDrag() {
  draggedComponent.value = null;
  store.isDragging = false;
  store.draggedType = null;
}
</script>

<style scoped>
.component-library {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.library-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

.library-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.view-toggle {
  padding: 6px;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle:hover {
  background: #F3F4F6;
}

.search-box {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.search-box input {
  flex: 1;
  margin-left: 8px;
  padding: 6px 8px;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.category {
  margin-bottom: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #F9FAFB;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.category-header:hover {
  background: #F3F4F6;
}

.category-header svg {
  transition: transform 0.2s;
  margin-right: 8px;
}

.category-header svg.rotated {
  transform: rotate(-90deg);
}

.category-header span {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #4B5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-count {
  font-size: 11px;
  padding: 2px 6px;
  background: white;
  border-radius: 10px;
  color: #9CA3AF;
}

.component-grid {
  padding: 8px 0;
}

.component-grid.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.component-grid.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
}

.component-item:hover {
  border-color: #3B82F6;
  background: #EFF6FF;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.component-item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.component-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #F3F4F6;
  border-radius: 4px;
  margin-right: 10px;
  color: #6B7280;
}

.component-grid.grid .component-icon {
  margin-right: 8px;
}

.component-info {
  flex: 1;
  min-width: 0;
}

.component-name {
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.component-desc {
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 2px;
}

.component-grid.grid .component-info {
  overflow: hidden;
}

.component-grid.grid .component-name {
  font-size: 12px;
}



.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>