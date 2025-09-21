<template>
  <div class="custom-code-editor" v-if="selectedComponent">
    <div class="code-header">
      <h3>Custom Code</h3>
      <div class="code-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
        >
          <component :is="tab.icon" :size="14" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Code Editors -->
    <div class="code-content">
      <!-- CSS Editor -->
      <div v-if="activeTab === 'css'" class="editor-section">
        <div class="editor-info">
          <Info :size="14" />
          <span>CSS is automatically scoped to this component (#{{ selectedComponent.id }})</span>
        </div>
        <div class="editor-container">
          <codemirror
            v-model="cssCode"
            :extensions="cssExtensions"
            :style="{ height: '200px' }"
            @update="updateCode('css', $event)"
          />
        </div>
      </div>

      <!-- JavaScript Editor -->
      <div v-if="activeTab === 'javascript'" class="editor-section">
        <div class="editor-info">
          <Info :size="14" />
          <span>JavaScript runs in a sandboxed environment</span>
        </div>
        <div class="editor-container">
          <codemirror
            v-model="jsCode"
            :extensions="jsExtensions"
            :style="{ height: '200px' }"
            @update="updateCode('javascript', $event)"
          />
        </div>
      </div>

      <!-- Event Handlers -->
      <div v-if="activeTab === 'events'" class="editor-section">
        <div class="event-handlers">
          <div v-for="event in eventHandlers" :key="event.key" class="event-handler">
            <label>
              <component :is="event.icon" :size="14" />
              {{ event.label }}
            </label>
            <div class="editor-container">
              <codemirror
                v-model="eventCode[event.key]"
                :extensions="jsExtensions"
                :style="{ height: '100px' }"
                @update="updateEventCode(event.key, $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Lifecycle Hooks -->
      <div v-if="activeTab === 'lifecycle'" class="editor-section">
        <div class="lifecycle-hooks">
          <div v-for="hook in lifecycleHooks" :key="hook.key" class="lifecycle-hook">
            <label>
              <Zap :size="14" />
              {{ hook.label }}
            </label>
            <div class="editor-container">
              <codemirror
                v-model="lifecycleCode[hook.key]"
                :extensions="jsExtensions"
                :style="{ height: '100px' }"
                @update="updateLifecycleCode(hook.key, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Code Templates -->
    <div v-if="showTemplates" class="code-templates">
      <h4>Quick Templates</h4>
      <div class="template-grid">
        <button
          v-for="template in getTemplatesForTab()"
          :key="template.id"
          @click="applyTemplate(template)"
          class="template-btn"
        >
          <span class="template-name">{{ template.name }}</span>
          <span class="template-desc">{{ template.description }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { useEditorStore } from '@/stores/editor';
import {
  Code,
  Palette,
  MousePointer,
  Zap,
  Info,
  FileCode,
  Calendar
} from 'lucide-vue-next';

const store = useEditorStore();
const selectedComponent = computed(() => store.selectedComponent);

// Tab state
const activeTab = ref('css');
const showTemplates = ref(false);

// Code state
const cssCode = ref('');
const jsCode = ref('');
const eventCode = ref({
  onClick: '',
  onHover: '',
  onScroll: ''
});
const lifecycleCode = ref({
  beforeMount: '',
  onMount: ''
});

// Tab configuration
const tabs = [
  { key: 'css', label: 'CSS', icon: Palette },
  { key: 'javascript', label: 'JavaScript', icon: Code },
  { key: 'events', label: 'Events', icon: MousePointer },
  { key: 'lifecycle', label: 'Lifecycle', icon: Zap }
];

// Event handlers configuration
const eventHandlers = [
  { key: 'onClick', label: 'On Click', icon: MousePointer },
  { key: 'onHover', label: 'On Hover', icon: MousePointer },
  { key: 'onScroll', label: 'On Scroll', icon: Calendar }
];

// Lifecycle hooks configuration
const lifecycleHooks = [
  { key: 'beforeMount', label: 'Before Mount', description: 'Runs before component is rendered' },
  { key: 'onMount', label: 'On Mount', description: 'Runs after component is rendered' }
];

// CodeMirror extensions
const cssExtensions = [
  css(),
  oneDark,
  EditorView.theme({
    '&': { fontSize: '13px' },
    '.cm-content': { padding: '12px' }
  })
];

const jsExtensions = [
  javascript(),
  oneDark,
  EditorView.theme({
    '&': { fontSize: '13px' },
    '.cm-content': { padding: '12px' }
  })
];

// Code templates
const codeTemplates = {
  css: [
    {
      id: 'hover-effect',
      name: 'Hover Effect',
      description: 'Add hover animation',
      code: `/* Hover effect */
:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}`
    },
    {
      id: 'gradient-bg',
      name: 'Gradient Background',
      description: 'Beautiful gradient',
      code: `/* Gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;`
    },
    {
      id: 'glass-effect',
      name: 'Glass Morphism',
      description: 'Frosted glass effect',
      code: `/* Glass morphism */
background: rgba(255, 255, 255, 0.25);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);`
    }
  ],
  javascript: [
    {
      id: 'display-alert',
      name: 'Show Alert',
      description: 'Display message to user',
      code: `alert('Welcome to our site!');`
    },
    {
      id: 'api-fetch',
      name: 'API Fetch',
      description: 'Fetch data from API',
      code: `// Fetch data from API
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    // Update component content with data
    this.textContent = data.message || 'Data loaded';
  })
  .catch(error => alert('Failed to load data'));`
    }
  ],
  events: [
    {
      id: 'click-counter',
      name: 'Click Counter',
      description: 'Count clicks',
      code: `// Click counter
if (!this.clickCount) this.clickCount = 0;
this.clickCount++;
this.textContent = 'Clicked ' + this.clickCount + ' times';`
    },
    {
      id: 'toggle-class',
      name: 'Toggle Class',
      description: 'Toggle active class',
      code: `// Toggle active class
this.classList.toggle('active');`
    }
  ]
};

// Load code when component changes
watch(selectedComponent, (component) => {
  if (!component) return;
  
  const customCode = component.props.customCode || {};
  cssCode.value = customCode.css || '';
  jsCode.value = customCode.javascript || '';
  eventCode.value = {
    onClick: customCode.onClick || '',
    onHover: customCode.onHover || '',
    onScroll: customCode.onScroll || ''
  };
  lifecycleCode.value = {
    beforeMount: customCode.beforeMount || '',
    onMount: customCode.onMount || ''
  };
});

// Update functions
function updateCode(type: 'css' | 'javascript', value: any) {
  if (!selectedComponent.value) return;
  
  const customCode = { ...selectedComponent.value.props.customCode };
  customCode[type] = value;
  
  store.updateComponent(selectedComponent.value.id, {
    props: {
      ...selectedComponent.value.props,
      customCode
    }
  });
}

function updateEventCode(event: string, value: any) {
  if (!selectedComponent.value) return;
  
  const customCode = { ...selectedComponent.value.props.customCode };
  customCode[event] = value;
  
  store.updateComponent(selectedComponent.value.id, {
    props: {
      ...selectedComponent.value.props,
      customCode
    }
  });
}

function updateLifecycleCode(hook: string, value: any) {
  if (!selectedComponent.value) return;
  
  const customCode = { ...selectedComponent.value.props.customCode };
  customCode[hook] = value;
  
  store.updateComponent(selectedComponent.value.id, {
    props: {
      ...selectedComponent.value.props,
      customCode
    }
  });
}

function getTemplatesForTab() {
  switch (activeTab.value) {
    case 'css':
      return codeTemplates.css;
    case 'javascript':
      return codeTemplates.javascript;
    case 'events':
      return codeTemplates.events;
    default:
      return [];
  }
}

function applyTemplate(template: any) {
  switch (activeTab.value) {
    case 'css':
      cssCode.value = (cssCode.value ? cssCode.value + '\n\n' : '') + template.code;
      updateCode('css', cssCode.value);
      break;
    case 'javascript':
      jsCode.value = (jsCode.value ? jsCode.value + '\n\n' : '') + template.code;
      updateCode('javascript', jsCode.value);
      break;
    case 'events':
      eventCode.value.onClick = template.code;
      updateEventCode('onClick', template.code);
      break;
  }
  showTemplates.value = false;
}
</script>

<style scoped>
.custom-code-editor {
  border-top: 1px solid var(--border-color);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.code-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.code-header h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
}

.code-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 6px 12px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.tab-btn:hover:not(.active) {
  background: var(--hover-bg);
}

.code-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--info-bg, #EBF5FF);
  border-radius: 6px;
  font-size: 12px;
  color: var(--info-text, #1E40AF);
}

.editor-container {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
}

.event-handlers,
.lifecycle-hooks {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-handler,
.lifecycle-hook {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-handler label,
.lifecycle-hook label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
}

.code-templates {
  border-top: 1px solid var(--border-color);
  padding: 1rem;
}

.code-templates h4 {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
}

.template-grid {
  display: grid;
  gap: 8px;
}

.template-btn {
  padding: 10px 12px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn:hover {
  background: var(--hover-bg);
  border-color: var(--primary);
}

.template-name {
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 2px;
}

.template-desc {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
}

/* CodeMirror overrides */
:deep(.cm-editor) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

:deep(.cm-focused) {
  outline: none;
}
</style>