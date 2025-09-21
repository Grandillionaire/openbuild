<template>
  <div class="property-editor">
    <div class="editor-header">
      <h3>Properties</h3>
      <button v-if="selectedComponent" @click="store.deleteComponent(selectedComponent.id)" class="delete-btn">
        <Trash2 :size="16" />
      </button>
    </div>
    
    <div v-if="!selectedComponent" class="empty-state">
      <MousePointer2 :size="32" />
      <p>Select a component to edit its properties</p>
    </div>
    
    <div v-else class="editor-content">
      <!-- Component Info -->
      <div class="section">
        <div class="section-header">Component</div>
        <div class="info-row">
          <label>Type</label>
          <span class="type-badge">{{ selectedComponent.type }}</span>
        </div>
        <div class="info-row">
          <label>ID</label>
          <span class="id-text">{{ selectedComponent.id }}</span>
        </div>
      </div>
      
      <!-- Content Properties -->
      <div class="section" v-if="hasContentProps">
        <div class="section-header">Content</div>
        
        <!-- Text Content -->
        <div v-if="selectedComponent.props.content && typeof selectedComponent.props.content === 'string'" class="form-group">
          <label>Text</label>
          <textarea
            :value="selectedComponent.props.content"
            @input="updateContent($event.target.value)"
            rows="3"
          />
        </div>
        
        <!-- Hero Content -->
        <template v-if="selectedComponent.type === 'hero'">
          <div class="form-group">
            <label>Heading</label>
            <input
              :value="selectedComponent.props.content?.heading"
              @input="updateContentField('heading', $event.target.value)"
            />
          </div>
          <div class="form-group">
            <label>Subheading</label>
            <textarea
              :value="selectedComponent.props.content?.subheading"
              @input="updateContentField('subheading', $event.target.value)"
              rows="2"
            />
          </div>
          <div class="form-group">
            <label>Button Text</label>
            <input
              :value="selectedComponent.props.content?.buttonText"
              @input="updateContentField('buttonText', $event.target.value)"
            />
          </div>
        </template>
        
        <!-- Image Properties -->
        <template v-if="selectedComponent.type === 'image'">
          <div class="form-group">
            <label>Image URL</label>
            <div class="input-with-button">
              <input
                :value="selectedComponent.props.attributes?.src"
                @input="updateAttribute('src', $event.target.value)"
                placeholder="https://..."
              />
              <button @click="openAssetManager" class="asset-btn">
                <Image :size="16" />
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>Alt Text</label>
            <input
              :value="selectedComponent.props.attributes?.alt"
              @input="updateAttribute('alt', $event.target.value)"
              placeholder="Description of image"
            />
          </div>
        </template>
        
        <!-- Link Properties -->
        <template v-if="selectedComponent.type === 'link'">
          <div class="form-group">
            <label>URL</label>
            <input
              :value="selectedComponent.props.attributes?.href"
              @input="updateAttribute('href', $event.target.value)"
              placeholder="https://..."
            />
          </div>
          <div class="form-group">
            <label>Target</label>
            <select
              :value="selectedComponent.props.attributes?.target"
              @change="updateAttribute('target', $event.target.value)"
            >
              <option value="_self">Same Window</option>
              <option value="_blank">New Window</option>
            </select>
          </div>
        </template>
        
        <!-- Heading Level -->
        <template v-if="selectedComponent.type === 'heading'">
          <div class="form-group">
            <label>Level</label>
            <select
              :value="selectedComponent.props.attributes?.level || 'h2'"
              @change="updateAttribute('level', $event.target.value)"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </div>
        </template>
      </div>
      
      <!-- Component Variants -->
      <VariantSelector />
      
      <!-- Animations -->
      <AnimationEditor />
      
      <!-- Custom Code -->
      <CustomCodeEditor />
      
      <!-- Style Properties -->
      <div class="section">
        <div class="section-header">
          <span>Styles</span>
          <select v-model="currentBreakpoint" class="breakpoint-select">
            <option value="base">Base</option>
            <option value="sm">SM (640px+)</option>
            <option value="md">MD (768px+)</option>
            <option value="lg">LG (1024px+)</option>
            <option value="xl">XL (1280px+)</option>
          </select>
        </div>
        
        <!-- Layout -->
        <div class="style-group">
          <div class="group-label">Layout</div>
          
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Width</label>
              <input
                :value="getCurrentStyle('width')"
                @input="updateStyle('width', $event.target.value)"
                placeholder="auto"
              />
            </div>
            <div class="form-group flex-1">
              <label>Height</label>
              <input
                :value="getCurrentStyle('height')"
                @input="updateStyle('height', $event.target.value)"
                placeholder="auto"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Display</label>
            <select
              :value="getCurrentStyle('display')"
              @change="updateStyle('display', $event.target.value)"
            >
              <option value="">Default</option>
              <option value="block">Block</option>
              <option value="inline-block">Inline Block</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        
        <!-- Spacing -->
        <div class="style-group">
          <div class="group-label">Spacing</div>
          
          <div class="form-group">
            <label>Padding</label>
            <div class="spacing-inputs">
              <input
                :value="getCurrentStyle('paddingTop')"
                @input="updateStyle('paddingTop', $event.target.value)"
                placeholder="T"
              />
              <input
                :value="getCurrentStyle('paddingRight')"
                @input="updateStyle('paddingRight', $event.target.value)"
                placeholder="R"
              />
              <input
                :value="getCurrentStyle('paddingBottom')"
                @input="updateStyle('paddingBottom', $event.target.value)"
                placeholder="B"
              />
              <input
                :value="getCurrentStyle('paddingLeft')"
                @input="updateStyle('paddingLeft', $event.target.value)"
                placeholder="L"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Margin</label>
            <div class="spacing-inputs">
              <input
                :value="getCurrentStyle('marginTop')"
                @input="updateStyle('marginTop', $event.target.value)"
                placeholder="T"
              />
              <input
                :value="getCurrentStyle('marginRight')"
                @input="updateStyle('marginRight', $event.target.value)"
                placeholder="R"
              />
              <input
                :value="getCurrentStyle('marginBottom')"
                @input="updateStyle('marginBottom', $event.target.value)"
                placeholder="B"
              />
              <input
                :value="getCurrentStyle('marginLeft')"
                @input="updateStyle('marginLeft', $event.target.value)"
                placeholder="L"
              />
            </div>
          </div>
        </div>
        
        <!-- Typography -->
        <div class="style-group" v-if="hasTextStyles">
          <div class="group-label">Typography</div>
          
          <div class="form-group">
            <label>Font Size</label>
            <input
              :value="getCurrentStyle('fontSize')"
              @input="updateStyle('fontSize', $event.target.value)"
              placeholder="16px"
            />
          </div>
          
          <div class="form-group">
            <label>Font Weight</label>
            <select
              :value="getCurrentStyle('fontWeight')"
              @change="updateStyle('fontWeight', $event.target.value)"
            >
              <option value="">Normal</option>
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Text Align</label>
            <div class="button-group">
              <button
                @click="updateStyle('textAlign', 'left')"
                :class="{ active: getCurrentStyle('textAlign') === 'left' }"
              >
                <AlignLeft :size="16" />
              </button>
              <button
                @click="updateStyle('textAlign', 'center')"
                :class="{ active: getCurrentStyle('textAlign') === 'center' }"
              >
                <AlignCenter :size="16" />
              </button>
              <button
                @click="updateStyle('textAlign', 'right')"
                :class="{ active: getCurrentStyle('textAlign') === 'right' }"
              >
                <AlignRight :size="16" />
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>Color</label>
            <div class="color-input">
              <input
                type="color"
                :value="getCurrentStyle('color') || '#000000'"
                @input="updateStyle('color', $event.target.value)"
              />
              <input
                :value="getCurrentStyle('color')"
                @input="updateStyle('color', $event.target.value)"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        
        <!-- Background -->
        <div class="style-group">
          <div class="group-label">Background</div>
          
          <div class="form-group">
            <label>Background Color</label>
            <div class="color-input">
              <input
                type="color"
                :value="getCurrentStyle('backgroundColor') || '#ffffff'"
                @input="updateStyle('backgroundColor', $event.target.value)"
              />
              <input
                :value="getCurrentStyle('backgroundColor')"
                @input="updateStyle('backgroundColor', $event.target.value)"
                placeholder="transparent"
              />
            </div>
          </div>
        </div>
        
        <!-- Border -->
        <div class="style-group">
          <div class="group-label">Border</div>
          
          <div class="form-group">
            <label>Border Radius</label>
            <input
              :value="getCurrentStyle('borderRadius')"
              @input="updateStyle('borderRadius', $event.target.value)"
              placeholder="0px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '@/stores/editor';
import VariantSelector from './VariantSelector.vue';
import AnimationEditor from './AnimationEditor.vue';
import CustomCodeEditor from './CustomCodeEditor.vue';
import { 
  Trash2, 
  MousePointer2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image
} from 'lucide-vue-next';

const store = useEditorStore();
const currentBreakpoint = ref<'base' | 'sm' | 'md' | 'lg' | 'xl'>('base');

const selectedComponent = computed(() => store.selectedComponent);

const hasContentProps = computed(() => {
  const comp = selectedComponent.value;
  if (!comp) return false;
  return comp.props.content || comp.props.attributes;
});

const hasTextStyles = computed(() => {
  const textComponents = ['heading', 'text', 'button', 'link', 'hero', 'cta'];
  return selectedComponent.value && textComponents.includes(selectedComponent.value.type);
});

function getCurrentStyle(property: string) {
  if (!selectedComponent.value) return '';
  const styles = selectedComponent.value.styles[currentBreakpoint.value] || {};
  return styles[property] || '';
}

function updateStyle(property: string, value: string) {
  if (!selectedComponent.value) return;
  
  const component = selectedComponent.value;
  if (!component.styles[currentBreakpoint.value]) {
    component.styles[currentBreakpoint.value] = {};
  }
  
  if (value === '') {
    delete component.styles[currentBreakpoint.value][property];
  } else {
    component.styles[currentBreakpoint.value][property] = value;
  }
  
  store.updateComponent(component.id, { styles: component.styles });
}

function updateContent(value: string) {
  if (!selectedComponent.value) return;
  store.updateComponent(selectedComponent.value.id, {
    props: { ...selectedComponent.value.props, content: value }
  });
}

function updateContentField(field: string, value: string) {
  if (!selectedComponent.value) return;
  const content = { ...selectedComponent.value.props.content as any };
  content[field] = value;
  store.updateComponent(selectedComponent.value.id, {
    props: { ...selectedComponent.value.props, content }
  });
}

function updateAttribute(attr: string, value: string) {
  if (!selectedComponent.value) return;
  const attributes = { ...selectedComponent.value.props.attributes };
  attributes[attr] = value;
  store.updateComponent(selectedComponent.value.id, {
    props: { ...selectedComponent.value.props, attributes }
  });
}

function openAssetManager() {
  store.toggleAssetManager();
}
</script>

<style scoped>
.property-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

.editor-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.delete-btn {
  padding: 6px;
  background: white;
  border: 1px solid #EF4444;
  border-radius: 4px;
  color: #EF4444;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #EF4444;
  color: white;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  padding: 20px;
  text-align: center;
}

.empty-state p {
  margin-top: 12px;
  font-size: 14px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.breakpoint-select {
  font-size: 12px;
  padding: 2px 6px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background: white;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row label {
  color: #6B7280;
}

.type-badge {
  padding: 2px 8px;
  background: #EFF6FF;
  color: #3B82F6;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.id-text {
  font-family: monospace;
  font-size: 12px;
  color: #9CA3AF;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #4B5563;
}

.input-with-button {
  display: flex;
  gap: 4px;
}

.input-with-button input {
  flex: 1;
}

.asset-btn {
  padding: 8px;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6B7280;
}

.asset-btn:hover {
  background: #E5E7EB;
  color: #4B5563;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3B82F6;
}

.form-row {
  display: flex;
  gap: 12px;
}

.flex-1 {
  flex: 1;
}

.style-group {
  margin-bottom: 20px;
}

.group-label {
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 12px;
}

.spacing-inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.spacing-inputs input {
  padding: 6px 8px;
  text-align: center;
  font-size: 12px;
}

.button-group {
  display: flex;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  overflow: hidden;
}

.button-group button {
  flex: 1;
  padding: 8px;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.button-group button:not(:last-child) {
  border-right: 1px solid #D1D5DB;
}

.button-group button:hover {
  background: #F3F4F6;
}

.button-group button.active {
  background: #3B82F6;
  color: white;
}

.color-input {
  display: flex;
  gap: 8px;
}

.color-input input[type="color"] {
  width: 40px;
  height: 36px;
  padding: 2px;
  cursor: pointer;
}

.color-input input[type="text"] {
  flex: 1;
}
</style>