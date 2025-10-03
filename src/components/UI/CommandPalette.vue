<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="command-palette-overlay" @click="close" @keydown.esc="close">
        <div class="command-palette" @click.stop role="dialog" aria-modal="true">
          <!-- Search Input -->
          <div class="command-search">
            <Search :size="20" class="search-icon" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Type a command or search..."
              @input="handleSearch"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="executeCommand"
              class="search-input"
              autocomplete="off"
            />
            <span class="search-hint">ESC to close</span>
          </div>

          <!-- Command Categories -->
          <div class="command-content">
            <div v-if="filteredCommands.length === 0" class="empty-state">
              <AlertCircle :size="32" />
              <p>No commands found</p>
              <span class="hint">Try a different search term</span>
            </div>

            <div v-else class="command-list">
              <div v-for="category in groupedCommands" :key="category.name" class="command-category">
                <div class="category-label">{{ category.label }}</div>
                <button
                  v-for="(command, index) in category.commands"
                  :key="command.id"
                  :ref="el => setCommandRef(el, category.name + index)"
                  :class="['command-item', { active: activeIndex === category.name + index }]"
                  @click="execute(command)"
                  @mouseenter="activeIndex = category.name + index"
                >
                  <div class="command-icon">
                    <component :is="command.icon" :size="18" />
                  </div>
                  <div class="command-info">
                    <div class="command-name">{{ command.name }}</div>
                    <div class="command-description">{{ command.description }}</div>
                  </div>
                  <div v-if="command.shortcut" class="command-shortcut">
                    <kbd v-for="key in command.shortcut.split('+')" :key="key">{{ key }}</kbd>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Commands -->
          <div v-if="searchQuery === '' && recentCommands.length > 0" class="command-footer">
            <div class="footer-label">Recent</div>
            <div class="recent-commands">
              <button
                v-for="cmd in recentCommands.slice(0, 5)"
                :key="cmd.id"
                @click="execute(cmd)"
                class="recent-command"
              >
                <component :is="cmd.icon" :size="14" />
                <span>{{ cmd.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '@/stores/editor';
import {
  Search,
  AlertCircle,
  Plus,
  Copy,
  Trash2,
  Code,
  Eye,
  Grid3x3,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Image,
  Type,
  Layout
} from 'lucide-vue-next';

interface Command {
  id: string;
  name: string;
  description: string;
  category: 'edit' | 'view' | 'components' | 'file' | 'help';
  icon: any;
  action: () => void;
  shortcut?: string;
  keywords?: string[];
}

const store = useEditorStore();
const isOpen = ref(false);
const searchQuery = ref('');
const activeIndex = ref<string>('');
const commandRefs = ref<Record<string, HTMLElement>>({});
const searchInput = ref<HTMLInputElement>();
const recentCommands = ref<Command[]>([]);

// Define all available commands
const commands = computed<Command[]>(() => [
  // Edit commands
  {
    id: 'undo',
    name: 'Undo',
    description: 'Undo last action',
    category: 'edit',
    icon: Undo,
    shortcut: '⌘+Z',
    action: () => store.undo(),
    keywords: ['undo', 'revert', 'back']
  },
  {
    id: 'redo',
    name: 'Redo',
    description: 'Redo last undone action',
    category: 'edit',
    icon: Redo,
    shortcut: '⌘+Shift+Z',
    action: () => store.redo(),
    keywords: ['redo', 'forward']
  },
  {
    id: 'copy-styles',
    name: 'Copy Styles',
    description: 'Copy styles from selected component',
    category: 'edit',
    icon: Copy,
    shortcut: '⌘+Shift+C',
    action: () => {
      if (store.selectedId) {
        store.copyComponentStyles(store.selectedId);
        close();
      }
    },
    keywords: ['copy', 'styles', 'duplicate']
  },
  {
    id: 'paste-styles',
    name: 'Paste Styles',
    description: 'Paste copied styles to selected component',
    category: 'edit',
    icon: FileText,
    shortcut: '⌘+Shift+V',
    action: () => {
      if (store.selectedId) {
        store.pasteComponentStyles(store.selectedId);
        close();
      }
    },
    keywords: ['paste', 'styles', 'apply']
  },
  {
    id: 'delete',
    name: 'Delete Component',
    description: 'Delete selected component',
    category: 'edit',
    icon: Trash2,
    shortcut: 'Del',
    action: () => {
      if (store.selectedId) {
        store.deleteComponent(store.selectedId);
        close();
      }
    },
    keywords: ['delete', 'remove', 'trash']
  },
  {
    id: 'duplicate',
    name: 'Duplicate Component',
    description: 'Duplicate selected component',
    category: 'edit',
    icon: Copy,
    shortcut: '⌘+D',
    action: () => {
      if (store.selectedId) {
        store.duplicateComponent(store.selectedId);
        close();
      }
    },
    keywords: ['duplicate', 'clone', 'copy']
  },

  // View commands
  {
    id: 'toggle-code',
    name: 'Toggle Code View',
    description: 'Show/hide generated code',
    category: 'view',
    icon: Code,
    action: () => {
      store.showCode = !store.showCode;
      close();
    },
    keywords: ['code', 'view', 'html', 'css']
  },
  {
    id: 'toggle-grid',
    name: 'Toggle Grid',
    description: 'Show/hide grid overlay',
    category: 'view',
    icon: Grid3x3,
    action: () => {
      store.showGrid = !store.showGrid;
      close();
    },
    keywords: ['grid', 'overlay', 'guides']
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    description: 'Increase canvas zoom',
    category: 'view',
    icon: ZoomIn,
    shortcut: '⌘++',
    action: () => {
      store.setZoom(store.zoom + 0.1);
      close();
    },
    keywords: ['zoom', 'in', 'magnify']
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    description: 'Decrease canvas zoom',
    category: 'view',
    icon: ZoomOut,
    shortcut: '⌘+-',
    action: () => {
      store.setZoom(store.zoom - 0.1);
      close();
    },
    keywords: ['zoom', 'out', 'shrink']
  },
  {
    id: 'zoom-reset',
    name: 'Reset Zoom',
    description: 'Reset canvas zoom to 100%',
    category: 'view',
    icon: Maximize2,
    shortcut: '⌘+0',
    action: () => {
      store.setZoom(1);
      close();
    },
    keywords: ['zoom', 'reset', '100%']
  },
  {
    id: 'view-mobile',
    name: 'Mobile View',
    description: 'Switch to mobile viewport',
    category: 'view',
    icon: Eye,
    action: () => {
      store.setViewport('mobile');
      close();
    },
    keywords: ['mobile', 'phone', 'responsive']
  },
  {
    id: 'view-tablet',
    name: 'Tablet View',
    description: 'Switch to tablet viewport',
    category: 'view',
    icon: Eye,
    action: () => {
      store.setViewport('tablet');
      close();
    },
    keywords: ['tablet', 'ipad', 'responsive']
  },
  {
    id: 'view-desktop',
    name: 'Desktop View',
    description: 'Switch to desktop viewport',
    category: 'view',
    icon: Eye,
    action: () => {
      store.setViewport('desktop');
      close();
    },
    keywords: ['desktop', 'computer', 'responsive']
  },

  // Component commands
  {
    id: 'add-container',
    name: 'Add Container',
    description: 'Add a new container component',
    category: 'components',
    icon: Layout,
    action: () => {
      store.addComponent('container');
      close();
    },
    keywords: ['container', 'add', 'layout']
  },
  {
    id: 'add-text',
    name: 'Add Text',
    description: 'Add a new text component',
    category: 'components',
    icon: Type,
    action: () => {
      store.addComponent('text');
      close();
    },
    keywords: ['text', 'paragraph', 'content']
  },
  {
    id: 'add-image',
    name: 'Add Image',
    description: 'Add a new image component',
    category: 'components',
    icon: Image,
    action: () => {
      store.addComponent('image');
      close();
    },
    keywords: ['image', 'picture', 'media']
  },
  {
    id: 'add-button',
    name: 'Add Button',
    description: 'Add a new button component',
    category: 'components',
    icon: Plus,
    action: () => {
      store.addComponent('button');
      close();
    },
    keywords: ['button', 'cta', 'action']
  },

  // File commands
  {
    id: 'clear-project',
    name: 'Clear Project',
    description: 'Clear all components and start fresh',
    category: 'file',
    icon: Trash2,
    action: () => {
      if (confirm('Are you sure you want to clear the project?')) {
        store.clearProject();
        close();
      }
    },
    keywords: ['clear', 'reset', 'new']
  }
]);

// Filter commands based on search
const filteredCommands = computed(() => {
  if (!searchQuery.value.trim()) {
    return commands.value;
  }

  const query = searchQuery.value.toLowerCase();
  return commands.value.filter(cmd => {
    const searchText = [
      cmd.name,
      cmd.description,
      ...(cmd.keywords || [])
    ].join(' ').toLowerCase();

    return searchText.includes(query);
  });
});

// Group commands by category
const groupedCommands = computed(() => {
  const categories = {
    edit: { name: 'edit', label: 'Edit', commands: [] as Command[] },
    view: { name: 'view', label: 'View', commands: [] as Command[] },
    components: { name: 'components', label: 'Add Components', commands: [] as Command[] },
    file: { name: 'file', label: 'File', commands: [] as Command[] },
    help: { name: 'help', label: 'Help', commands: [] as Command[] }
  };

  filteredCommands.value.forEach(cmd => {
    if (categories[cmd.category]) {
      categories[cmd.category].commands.push(cmd);
    }
  });

  return Object.values(categories).filter(cat => cat.commands.length > 0);
});

// Keyboard navigation
function navigateDown() {
  const allCommands = filteredCommands.value;
  const currentIdx = allCommands.findIndex(cmd => activeIndex.value.includes(cmd.id));
  if (currentIdx < allCommands.length - 1) {
    const nextCmd = allCommands[currentIdx + 1];
    activeIndex.value = nextCmd.category + (currentIdx + 1);
    scrollToActive();
  }
}

function navigateUp() {
  const allCommands = filteredCommands.value;
  const currentIdx = allCommands.findIndex(cmd => activeIndex.value.includes(cmd.id));
  if (currentIdx > 0) {
    const prevCmd = allCommands[currentIdx - 1];
    activeIndex.value = prevCmd.category + (currentIdx - 1);
    scrollToActive();
  }
}

function scrollToActive() {
  nextTick(() => {
    const activeEl = commandRefs.value[activeIndex.value];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

function executeCommand() {
  const allCommands = filteredCommands.value;
  const currentIdx = allCommands.findIndex(cmd => activeIndex.value.includes(cmd.id));
  if (currentIdx >= 0) {
    execute(allCommands[currentIdx]);
  } else if (allCommands.length > 0) {
    execute(allCommands[0]);
  }
}

function execute(command: Command) {
  command.action();
  addToRecent(command);
  close();
}

function addToRecent(command: Command) {
  recentCommands.value = [
    command,
    ...recentCommands.value.filter(c => c.id !== command.id)
  ].slice(0, 10);
  localStorage.setItem('recentCommands', JSON.stringify(
    recentCommands.value.map(c => c.id)
  ));
}

function loadRecentCommands() {
  const saved = localStorage.getItem('recentCommands');
  if (saved) {
    try {
      const ids = JSON.parse(saved);
      recentCommands.value = ids
        .map((id: string) => commands.value.find(c => c.id === id))
        .filter(Boolean);
    } catch (e) {
      // Ignore parsing errors
    }
  }
}

function handleSearch() {
  if (filteredCommands.value.length > 0) {
    const firstCat = groupedCommands.value[0];
    activeIndex.value = firstCat.name + '0';
  }
}

function setCommandRef(el: any, key: string) {
  if (el) {
    commandRefs.value[key] = el;
  }
}

function open() {
  isOpen.value = true;
  nextTick(() => {
    searchInput.value?.focus();
    if (filteredCommands.value.length > 0) {
      const firstCat = groupedCommands.value[0];
      activeIndex.value = firstCat.name + '0';
    }
  });
}

function close() {
  isOpen.value = false;
  searchQuery.value = '';
  activeIndex.value = '';
}

// Keyboard shortcut to open palette
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  loadRecentCommands();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

defineExpose({
  open,
  close
});
</script>

<style scoped>
.command-palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 10000;
}

.command-palette {
  width: 100%;
  max-width: 640px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.command-search {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
  gap: 12px;
}

.search-icon {
  color: #9CA3AF;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1F2937;
  background: transparent;
}

.search-input::placeholder {
  color: #9CA3AF;
}

.search-hint {
  font-size: 12px;
  color: #9CA3AF;
  padding: 4px 8px;
  background: #F3F4F6;
  border-radius: 4px;
  font-family: monospace;
}

.command-content {
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
  max-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9CA3AF;
}

.empty-state p {
  margin: 12px 0 4px;
  font-size: 16px;
  font-weight: 500;
  color: #6B7280;
}

.hint {
  font-size: 13px;
  color: #9CA3AF;
}

.command-list {
  padding: 8px;
}

.command-category {
  margin-bottom: 12px;
}

.category-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9CA3AF;
  padding: 8px 12px 4px;
}

.command-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  gap: 12px;
  text-align: left;
}

.command-item:hover,
.command-item.active {
  background: #F3F4F6;
}

.command-item.active {
  background: #EEF2FF;
  border-left: 3px solid #6366F1;
}

.command-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #F9FAFB;
  border-radius: 6px;
  color: #6B7280;
  flex-shrink: 0;
}

.command-item.active .command-icon {
  background: #E0E7FF;
  color: #6366F1;
}

.command-info {
  flex: 1;
  min-width: 0;
}

.command-name {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 2px;
}

.command-description {
  font-size: 12px;
  color: #9CA3AF;
}

.command-shortcut {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.command-shortcut kbd {
  font-size: 11px;
  font-family: monospace;
  padding: 3px 6px;
  background: #F3F4F6;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  color: #6B7280;
}

.command-footer {
  padding: 12px 20px;
  border-top: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.footer-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9CA3AF;
  margin-bottom: 8px;
}

.recent-commands {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.recent-command {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 12px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.15s;
}

.recent-command:hover {
  border-color: #6366F1;
  color: #6366F1;
  background: #EEF2FF;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .command-palette,
.modal-fade-leave-active .command-palette {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .command-palette,
.modal-fade-leave-to .command-palette {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
