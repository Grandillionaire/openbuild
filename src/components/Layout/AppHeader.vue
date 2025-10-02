<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">
        <Package :size="24" />
        <span>OpenBuild</span>
      </div>
      
      <div class="project-name">
        <input 
          v-model="projectName"
          @blur="updateProjectName"
          placeholder="Untitled Project"
        />
      </div>
    </div>
    
    <div class="header-center">
      <div class="action-buttons">
        <button 
          @click="store.undo" 
          :disabled="!store.canUndo"
          title="Undo (Ctrl+Z)"
        >
          <Undo :size="18" />
        </button>
        <button 
          @click="store.redo" 
          :disabled="!store.canRedo"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo :size="18" />
        </button>
        
        <div class="separator"></div>
        
        <button
          @click="showTemplateLibrary = true"
          title="Browse Templates"
          class="template-btn header-btn-templates"
        >
          <BookOpen :size="18" />
          <span class="btn-label">Templates</span>
        </button>
        <button
          @click="toggleTutorials"
          title="Interactive Tutorials"
          class="header-btn-tutorials"
        >
          <GraduationCap :size="18" />
          <span class="btn-label">Tutorials</span>
        </button>
        <button
          @click="showPagesManager = true"
          title="Pages & Navigation"
        >
          <FileText :size="18" />
        </button>
        <button
          @click="showSEOPanel = true"
          title="SEO Settings"
        >
          <Search :size="18" />
        </button>
        <button
          @click="showThemeModal = true"
          title="Design Theme"
        >
          <Palette :size="18" />
        </button>
        <button 
          @click="store.showGrid = !store.showGrid"
          :class="{ active: store.showGrid }"
          title="Toggle Grid"
        >
          <Grid3x3 :size="18" />
        </button>
        <button
          @click="showGlobalCode = true"
          title="Global Custom Code"
        >
          <FileCode :size="18" />
        </button>
        <button 
          @click="togglePreview"
          title="Preview"
        >
          <Eye :size="18" />
        </button>
        <button 
          @click="store.showCode = !store.showCode"
          :class="{ active: store.showCode }"
          title="View Code"
        >
          <Code2 :size="18" />
        </button>
      </div>
    </div>
    
    <div class="header-right">
      <button @click="showMobileMenu = true" class="mobile-menu-btn">
        <Menu :size="20" />
      </button>
      
      <button @click="saveProject" class="btn-secondary">
        <Save :size="16" />
        <span>Save</span>
      </button>
      
      <button @click="showExportModal = true" class="btn-primary">
        <Download :size="16" />
        <span>Export</span>
      </button>
      
      <button @click="showDeployModal = true" class="btn-deploy">
        <Zap :size="16" />
        <span>Deploy</span>
      </button>
    </div>
    
    <!-- Export Modal -->
    <ExportModal v-if="showExportModal" @close="showExportModal = false" />
    
    <!-- Deploy Modal -->
    <DeployModal v-if="showDeployModal" @close="showDeployModal = false" />
    
    <!-- Template Library -->
    <TemplateLibrary :isOpen="showTemplateLibrary" @close="showTemplateLibrary = false" />
    
    <!-- Theme Modal -->
    <ThemeModal :isOpen="showThemeModal" @close="showThemeModal = false" />
    
    <!-- Global Code Editor -->
    <GlobalCodeEditor :isOpen="showGlobalCode" @close="showGlobalCode = false" />

    <!-- Pages Manager Modal -->
    <teleport to="body">
      <div v-if="showPagesManager" class="modal-overlay" @click="showPagesManager = false">
        <div class="modal-content-large pages-manager-modal" @click.stop>
          <PagesManager />
          <button @click="showPagesManager = false" class="modal-close-btn">
            <X :size="20" />
          </button>
        </div>
      </div>
    </teleport>

    <!-- SEO Panel Modal -->
    <teleport to="body">
      <div v-if="showSEOPanel" class="modal-overlay" @click="showSEOPanel = false">
        <div class="modal-content-large" @click.stop>
          <SEOPanel />
          <button @click="showSEOPanel = false" class="modal-close-btn">
            <X :size="20" />
          </button>
        </div>
      </div>
    </teleport>

    <!-- Toast Notifications -->
    <ToastContainer />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useTutorialStore } from '@/stores/tutorial';
import {
  Package,
  Undo,
  Redo,
  Grid3x3,
  Eye,
  Code2,
  Save,
  Download,
  Zap,
  Layout,
  Palette,
  FileCode,
  BookOpen,
  Menu,
  FileText,
  Search,
  X,
  GraduationCap
} from 'lucide-vue-next';
import ExportModal from './ExportModal.vue';
import DeployModal from './DeployModal.vue';
import ToastContainer from '../UI/ToastContainer.vue';
import TemplateLibrary from '../Templates/TemplateLibrary.vue';
import ThemeModal from './ThemeModal.vue';
import GlobalCodeEditor from '../Editor/GlobalCodeEditor.vue';
import PagesManager from '../Editor/PagesManager.vue';
import SEOPanel from '../Editor/SEOPanel.vue';
import { useToast } from '@/composables/useToast';
import { storageService } from '@/services/storageService';

const store = useEditorStore();
const tutorialStore = useTutorialStore();
const { showToast } = useToast();

const projectName = ref(store.projectName);
const showExportModal = ref(false);
const showDeployModal = ref(false);
const showTemplateLibrary = ref(false);
const showThemeModal = ref(false);
const showGlobalCode = ref(false);
const showMobileMenu = ref(false);
const showPagesManager = ref(false);
const showSEOPanel = ref(false);

function updateProjectName() {
  store.projectName = projectName.value || 'Untitled Project';
}

async function saveProject() {
  try {
    await storageService.saveProject({
      id: store.projectId,
      name: store.projectName,
      components: store.components,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    showToast('Project saved successfully', 'success');
  } catch (error) {
    showToast('Failed to save project', 'error');
  }
}

function toggleTutorials() {
  tutorialStore.toggleLauncher();
}

async function togglePreview() {
  try {
    // Import and use codeGenerator properly
    const { codeGenerator } = await import('@/services/codeGenerator');
    
    // Generate the full HTML page with styles and scripts
    const result = await codeGenerator.generateProject(
      store.components, 
      store.projectName,
      {
        globalCustomCode: store.globalCustomCode
      }
    );
    
    // Open in new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(result.fullPage);
      previewWindow.document.close();
    } else {
      showToast('Please allow popups to preview', 'warning');
    }
  } catch (error) {
    showToast('Failed to generate preview', 'error');
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.logo svg {
  color: #3B82F6;
}

.project-name input {
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  transition: all 0.2s;
}

.project-name input:hover {
  background: #F9FAFB;
}

.project-name input:focus {
  outline: none;
  background: white;
  border-color: #3B82F6;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: #F9FAFB;
  border-radius: 6px;
}

.action-buttons button {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-buttons button:hover:not(:disabled) {
  background: white;
  color: #1F2937;
}

.action-buttons button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-buttons button.active {
  background: white;
  color: #3B82F6;
}

.separator {
  width: 1px;
  height: 20px;
  background: #D1D5DB;
  margin: 0 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-secondary,
.btn-primary,
.btn-deploy {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  color: #4B5563;
  border: 1px solid #D1D5DB;
}

.btn-secondary:hover {
  background: #F9FAFB;
  border-color: #9CA3AF;
}

.btn-primary {
  background: #3B82F6;
  color: white;
}

.btn-primary:hover {
  background: #2563EB;
  transform: translateY(-1px);
}

.btn-deploy {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
}

.btn-deploy:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Template button with label */
.template-btn {
  display: flex !important;
  align-items: center;
  gap: 4px;
  padding: 8px 12px !important;
}

.btn-label {
  font-size: 13px;
  font-weight: 500;
  display: none;
}

@media (min-width: 1024px) {
  .btn-label {
    display: inline;
  }
}

/* Mobile menu */
.mobile-menu-btn {
  display: none;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content-large {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.pages-manager-modal {
  max-width: 900px;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Responsive styles */
@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
    gap: 8px;
  }

  .logo span {
    display: none;
  }

  .project-name {
    max-width: 120px;
  }

  .header-center {
    display: none;
  }

  .header-right {
    gap: 8px;
  }

  .header-right button span {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>