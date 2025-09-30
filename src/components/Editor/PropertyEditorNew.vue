<template>
  <div class="property-editor">
    <div class="editor-header">
      <div class="header-title">
        <Sliders :size="18" />
        <h3>Properties</h3>
      </div>
      <div class="header-actions">
        <button 
          v-if="selectedComponent" 
          @click="duplicateComponent" 
          class="action-btn"
          title="Duplicate"
        >
          <Copy :size="16" />
        </button>
        <button 
          v-if="selectedComponent" 
          @click="store.deleteComponent(selectedComponent.id)" 
          class="action-btn delete"
          title="Delete"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
    
    <div v-if="!selectedComponent" class="empty-state">
      <div class="empty-icon">
        <MousePointer2 :size="32" />
      </div>
      <p>Select a component to edit</p>
      <span class="hint">Click on any element in the canvas</span>
    </div>
    
    <div v-else class="editor-content">
      <!-- Quick Style Switcher -->
      <QuickStyleSwitcher />

      <!-- Responsive Editor -->
      <ResponsiveEditor />

      <!-- Image Editor (for image components) -->
      <ImageEditor />

      <!-- Search/Filter -->
      <div class="search-box">
        <Search :size="16" />
        <input
          v-model="searchQuery"
          placeholder="Search properties..."
          @input="filterProperties"
        />
      </div>

      <!-- Component Info Section -->
      <div class="property-section">
        <div class="section-header" @click="toggleSection('info')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.info }"
          />
          <span class="section-title">
            <Info :size="14" />
            Component Info
          </span>
          <span class="component-type">{{ selectedComponent.type }}</span>
        </div>
        
        <div v-show="!collapsedSections.info" class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <input 
                :value="selectedComponent.displayName"
                @input="updateDisplayName($event.target.value)"
                placeholder="Component name"
              />
            </div>
            <div class="info-item">
              <label>ID</label>
              <div class="id-display">
                <code>{{ selectedComponent.id }}</code>
                <button @click="copyId" class="copy-btn">
                  <Copy :size="12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Properties Section -->
      <div class="property-section" v-if="hasContentProps">
        <div class="section-header" @click="toggleSection('content')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.content }"
          />
          <span class="section-title">
            <Type :size="14" />
            Content
          </span>
        </div>
        
        <div v-show="!collapsedSections.content" class="section-content">
          <!-- Dynamic content based on component type -->
          <component 
            v-if="getContentEditor"
            :is="getContentEditor" 
            :component="selectedComponent"
            @update="updateComponent"
          />
          <div v-else class="no-content-editor">
            <p>Content editing for {{ selectedComponent.type }} coming soon</p>
          </div>
        </div>
      </div>

      <!-- Variants Section -->
      <div class="property-section" v-if="hasVariants">
        <div class="section-header" @click="toggleSection('variants')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.variants }"
          />
          <span class="section-title">
            <Layers :size="14" />
            Variants
          </span>
        </div>
        
        <div v-show="!collapsedSections.variants" class="section-content">
          <VariantSelector />
        </div>
      </div>

      <!-- Layout Properties -->
      <div class="property-section">
        <div class="section-header" @click="toggleSection('layout')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.layout }"
          />
          <span class="section-title">
            <Layout :size="14" />
            Layout
          </span>
          <ResponsiveToggle v-model="currentBreakpoint" />
        </div>
        
        <div v-show="!collapsedSections.layout" class="section-content">
          <LayoutProperties 
            :component="selectedComponent" 
            :breakpoint="currentBreakpoint"
            @update="updateStyles"
          />
        </div>
      </div>

      <!-- Spacing Properties -->
      <div class="property-section">
        <div class="section-header" @click="toggleSection('spacing')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.spacing }"
          />
          <span class="section-title">
            <Move :size="14" />
            Spacing
          </span>
        </div>
        
        <div v-show="!collapsedSections.spacing" class="section-content">
          <SpacingProperties 
            :component="selectedComponent" 
            :breakpoint="currentBreakpoint"
            @update="updateStyles"
          />
        </div>
      </div>

      <!-- Typography Properties -->
      <div class="property-section" v-if="hasTextStyles">
        <div class="section-header" @click="toggleSection('typography')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.typography }"
          />
          <span class="section-title">
            <Type :size="14" />
            Typography
          </span>
        </div>
        
        <div v-show="!collapsedSections.typography" class="section-content">
          <TypographyProperties 
            :component="selectedComponent" 
            :breakpoint="currentBreakpoint"
            @update="updateStyles"
          />
        </div>
      </div>

      <!-- Appearance Properties -->
      <div class="property-section">
        <div class="section-header" @click="toggleSection('appearance')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.appearance }"
          />
          <span class="section-title">
            <Palette :size="14" />
            Appearance
          </span>
        </div>
        
        <div v-show="!collapsedSections.appearance" class="section-content">
          <AppearanceProperties 
            :component="selectedComponent" 
            :breakpoint="currentBreakpoint"
            @update="updateStyles"
          />
        </div>
      </div>

      <!-- Effects Properties -->
      <div class="property-section">
        <div class="section-header" @click="toggleSection('effects')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.effects }"
          />
          <span class="section-title">
            <Zap :size="14" />
            Effects
          </span>
        </div>
        
        <div v-show="!collapsedSections.effects" class="section-content">
          <EffectsProperties 
            :component="selectedComponent" 
            :breakpoint="currentBreakpoint"
            @update="updateStyles"
          />
        </div>
      </div>

      <!-- Animations Section -->
      <div class="property-section">
        <div class="section-header" @click="toggleSection('animations')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.animations }"
          />
          <span class="section-title">
            <Sparkles :size="14" />
            Animations
          </span>
          <span class="count" v-if="animationCount > 0">{{ animationCount }}</span>
        </div>
        
        <div v-show="!collapsedSections.animations" class="section-content no-padding">
          <AnimationEditor />
        </div>
      </div>

      <!-- Custom Code Section -->
      <div class="property-section">
        <div class="section-header" @click="toggleSection('code')">
          <ChevronDown 
            :size="16" 
            :class="{ rotated: !collapsedSections.code }"
          />
          <span class="section-title">
            <Code2 :size="14" />
            Custom Code
          </span>
        </div>
        
        <div v-show="!collapsedSections.code" class="section-content no-padding">
          <CustomCodeEditor />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { nanoid } from 'nanoid';
import VariantSelector from './VariantSelector.vue';
import AnimationEditor from './AnimationEditorNew.vue';
import CustomCodeEditor from './CustomCodeEditor.vue';
import QuickStyleSwitcher from './QuickStyleSwitcher.vue';
import ResponsiveEditor from './ResponsiveEditor.vue';
import ImageEditor from './ImageEditor.vue';

// Sub-components for different property groups
import ResponsiveToggle from './properties/ResponsiveToggle.vue';
import LayoutProperties from './properties/LayoutProperties.vue';
import SpacingProperties from './properties/SpacingProperties.vue';
import TypographyProperties from './properties/TypographyProperties.vue';
import AppearanceProperties from './properties/AppearanceProperties.vue';
import EffectsProperties from './properties/EffectsProperties.vue';

// Content editors for different component types
// import TextContentEditor from './content/TextContentEditor.vue';
// import ImageContentEditor from './content/ImageContentEditor.vue';
// import LinkContentEditor from './content/LinkContentEditor.vue';
// import HeadingContentEditor from './content/HeadingContentEditor.vue';
// import ButtonContentEditor from './content/ButtonContentEditor.vue';

import { 
  Trash2, 
  MousePointer2,
  Copy,
  Search,
  ChevronDown,
  Info,
  Type,
  Layout,
  Move,
  Palette,
  Zap,
  Sparkles,
  Code2,
  Layers,
  Sliders
} from 'lucide-vue-next';

const store = useEditorStore();
const selectedComponent = computed(() => store.selectedComponent);
const currentBreakpoint = ref<'base' | 'sm' | 'md' | 'lg' | 'xl'>('base');
const searchQuery = ref('');

// Collapsed sections state
const collapsedSections = ref({
  info: false,
  content: false,
  variants: false,
  layout: false,
  spacing: false,
  typography: false,
  appearance: false,
  effects: true,
  animations: false,
  code: true
});

// Computed properties
const hasContentProps = computed(() => {
  const comp = selectedComponent.value;
  if (!comp) return false;
  return comp.props.content || comp.props.attributes;
});

const hasTextStyles = computed(() => {
  const textComponents = ['heading', 'text', 'button', 'link', 'hero', 'cta'];
  return selectedComponent.value && textComponents.includes(selectedComponent.value.type);
});

const hasVariants = computed(() => {
  return false;
});

const animationCount = computed(() => {
  return selectedComponent.value?.props.animations?.length || 0;
});

// Get content editor component based on type
const getContentEditor = computed(() => {
  const type = selectedComponent.value?.type;
  const contentEditors: Record<string, any> = {
    // text: TextContentEditor,
    // heading: HeadingContentEditor,
    // image: ImageContentEditor,
    // link: LinkContentEditor,
    // button: ButtonContentEditor,
    // Add more as needed
  };
  return contentEditors[type] || null;
});

// Functions
function toggleSection(section: keyof typeof collapsedSections.value) {
  collapsedSections.value[section] = !collapsedSections.value[section];
}

function updateComponent(updates: any) {
  if (!selectedComponent.value) return;
  store.updateComponent(selectedComponent.value.id, updates);
}

function updateStyles(styles: Record<string, string | number>) {
  if (!selectedComponent.value) return;
  store.updateMultipleStyles(selectedComponent.value.id, styles, currentBreakpoint.value);
}

function updateDisplayName(name: string) {
  if (!selectedComponent.value) return;
  store.updateComponent(selectedComponent.value.id, { displayName: name });
}

function duplicateComponent() {
  if (!selectedComponent.value) return;
  
  const duplicate = {
    ...selectedComponent.value,
    id: nanoid(),
    displayName: `${selectedComponent.value.displayName} (Copy)`
  };
  
  // Add to parent or canvas
  if (selectedComponent.value.parent) {
    store.addComponentToParent(duplicate, selectedComponent.value.parent);
  } else {
    store.addComponent(duplicate);
  }
}

function copyId() {
  if (!selectedComponent.value) return;
  navigator.clipboard.writeText(selectedComponent.value.id);
}

function filterProperties() {
  // Property filtering handled via computed properties
}

// Watch for component changes to auto-expand relevant sections
watch(selectedComponent, (newComponent) => {
  if (newComponent) {
    // Auto-expand content section for new selections
    collapsedSections.value.content = false;
  }
});
</script>

<style scoped>
.property-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #FAFBFC;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1F2937;
}

.header-title h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 6px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #F3F4F6;
  color: #4B5563;
  border-color: #D1D5DB;
}

.action-btn.delete {
  color: #EF4444;
  border-color: #FEE2E2;
}

.action-btn.delete:hover {
  background: #FEE2E2;
  border-color: #FCA5A5;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #9CA3AF;
}

.empty-state p {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  color: #4B5563;
}

.empty-state .hint {
  font-size: 13px;
  color: #9CA3AF;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
}

.search-box input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

.search-box input:focus {
  border-color: #3B82F6;
}

/* Property Sections */
.property-section {
  background: white;
  border-bottom: 1px solid #E5E7EB;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.section-header:hover {
  background-color: #F9FAFB;
}

.section-header svg {
  color: #6B7280;
  transition: transform 0.2s;
}

.section-header svg.rotated {
  transform: rotate(-90deg);
}

.section-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
}

.section-title svg {
  color: #6B7280;
}

.component-type {
  font-size: 11px;
  padding: 2px 8px;
  background: #EFF6FF;
  color: #3B82F6;
  border-radius: 4px;
  font-weight: 500;
}

.count {
  font-size: 11px;
  padding: 2px 6px;
  background: #F3F4F6;
  color: #6B7280;
  border-radius: 4px;
  font-weight: 500;
}

.section-content {
  padding: 16px;
  border-top: 1px solid #F3F4F6;
}

.section-content.no-padding {
  padding: 0;
}

.no-content-editor {
  padding: 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

/* Info Section */
.info-grid {
  display: grid;
  gap: 12px;
}

.info-item label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 6px;
}

.info-item input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.info-item input:focus {
  border-color: #3B82F6;
}

.id-display {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
}

.id-display code {
  flex: 1;
  font-family: monospace;
  font-size: 12px;
  color: #6B7280;
}

.copy-btn {
  padding: 4px;
  background: transparent;
  border: none;
  color: #6B7280;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #E5E7EB;
  color: #4B5563;
}

/* Scrollbar styling */
.editor-content::-webkit-scrollbar {
  width: 6px;
}

.editor-content::-webkit-scrollbar-track {
  background: #F3F4F6;
}

.editor-content::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 3px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
</style>