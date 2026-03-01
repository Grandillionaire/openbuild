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
          @click="showSEOAnalyzer = true"
          title="SEO Analyzer"
        >
          <Search :size="18" />
        </button>
        <button
          @click="showMarketplace = true"
          title="Template Marketplace"
        >
          <Store :size="18" />
        </button>
        <button
          @click="showFigmaImport = true"
          title="Import from Figma"
        >
          <Figma :size="18" />
        </button>
        <button
          @click="showAnalytics = true"
          title="Analytics Dashboard"
        >
          <BarChart3 :size="18" />
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
      
      <!-- Collaboration Button -->
      <button 
        @click="toggleCollaboration"
        class="collab-btn"
        :class="{ connected: isCollabConnected }"
        title="Collaboration"
      >
        <Users :size="16" />
        <span v-if="isCollabConnected" class="collab-count">{{ onlineCount }}</span>
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

    <!-- SEO Panel Modal (Legacy) -->
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

    <!-- SEO Analyzer Modal -->
    <teleport to="body">
      <div v-if="showSEOAnalyzer" class="modal-overlay" @click="showSEOAnalyzer = false">
        <div class="modal-content-large seo-analyzer-modal" @click.stop>
          <SEOAnalyzer />
          <button @click="showSEOAnalyzer = false" class="modal-close-btn">
            <X :size="20" />
          </button>
        </div>
      </div>
    </teleport>

    <!-- Marketplace Modal -->
    <MarketplaceModal v-if="showMarketplace" @close="showMarketplace = false" />

    <!-- Figma Import Modal -->
    <FigmaImportModal v-if="showFigmaImport" @close="showFigmaImport = false" />

    <!-- Analytics Modal -->
    <teleport to="body">
      <div v-if="showAnalytics" class="modal-overlay" @click="showAnalytics = false">
        <div class="modal-content-large analytics-modal" @click.stop>
          <AnalyticsDashboard />
          <button @click="showAnalytics = false" class="modal-close-btn">
            <X :size="20" />
          </button>
        </div>
      </div>
    </teleport>

    <!-- Collaboration Panel -->
    <teleport to="body">
      <div v-if="showCollabPanel" class="collab-panel">
        <div class="collab-header">
          <h3>Collaboration</h3>
          <button @click="showCollabPanel = false" class="close-collab">
            <X :size="18" />
          </button>
        </div>
        <div v-if="!isCollabConnected" class="collab-content">
          <p>Invite others to edit this project in real-time.</p>
          <button @click="startCollaboration" class="start-collab-btn">
            <Share2 :size="16" />
            Start Collaboration
          </button>
        </div>
        <div v-else class="collab-content">
          <div class="share-link">
            <input :value="collabShareLink" readonly />
            <button @click="copyShareLink">
              <Copy :size="16" />
            </button>
          </div>
          <div class="collaborators">
            <div v-for="collab in collaborators" :key="collab.id" class="collaborator">
              <div class="collab-avatar" :style="{ backgroundColor: collab.color }">
                {{ collab.name.charAt(0) }}
              </div>
              <span>{{ collab.name }}</span>
              <span :class="['status', collab.isOnline ? 'online' : 'offline']"></span>
            </div>
          </div>
          <button @click="endCollaboration" class="end-collab-btn">End Session</button>
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
  GraduationCap,
  BarChart3,
  Users,
  Share2,
  Copy
} from 'lucide-vue-next';
import ExportModal from './ExportModal.vue';
import DeployModal from './DeployModal.vue';
import ToastContainer from '../UI/ToastContainer.vue';
import TemplateLibrary from '../Templates/TemplateLibrary.vue';
import ThemeModal from './ThemeModal.vue';
import GlobalCodeEditor from '../Editor/GlobalCodeEditor.vue';
import PagesManager from '../Editor/PagesManager.vue';
import SEOPanel from '../Editor/SEOPanel.vue';
import SEOAnalyzer from '../Tools/SEOAnalyzer.vue';
import MarketplaceModal from '../Marketplace/MarketplaceModal.vue';
import FigmaImportModal from '../UI/FigmaImportModal.vue';
import AnalyticsDashboard from '../Analytics/AnalyticsDashboard.vue';
import { useToast } from '@/composables/useToast';
import { storageService } from '@/services/storageService';
import { useCollaboration } from '@/services/collaborationService';

// Custom icons
const Store = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :width="size" :height="size"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>`,
  props: { size: { type: Number, default: 18 } }
};

const Figma = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :width="size" :height="size"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>`,
  props: { size: { type: Number, default: 18 } }
};

const store = useEditorStore();
const tutorialStore = useTutorialStore();
const { showToast } = useToast();

// Collaboration service
const {
  isConnected: isCollabConnected,
  shareLink: collabShareLink,
  collaborators,
  onlineCount,
  createSession,
  leaveSession,
  copyShareLink: copyCollabLink
} = useCollaboration();

const projectName = ref(store.projectName);
const showExportModal = ref(false);
const showDeployModal = ref(false);
const showTemplateLibrary = ref(false);
const showThemeModal = ref(false);
const showGlobalCode = ref(false);
const showMobileMenu = ref(false);
const showPagesManager = ref(false);
const showSEOPanel = ref(false);

// New feature modals
const showSEOAnalyzer = ref(false);
const showMarketplace = ref(false);
const showFigmaImport = ref(false);
const showAnalytics = ref(false);
const showCollabPanel = ref(false);

// Collaboration functions
function toggleCollaboration() {
  showCollabPanel.value = !showCollabPanel.value;
}

async function startCollaboration() {
  try {
    await createSession();
    showToast('Collaboration session started!', 'success');
  } catch (error) {
    showToast('Failed to start collaboration', 'error');
  }
}

async function endCollaboration() {
  try {
    await leaveSession();
    showToast('Collaboration session ended', 'info');
  } catch (error) {
    showToast('Failed to end session', 'error');
  }
}

async function copyShareLink() {
  const success = await copyCollabLink();
  if (success) {
    showToast('Link copied to clipboard!', 'success');
  } else {
    showToast('Failed to copy link', 'error');
  }
}

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
    
    // Open in new window with sandboxed iframe
    const blob = new Blob([result.fullPage], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html><head><title>Preview</title><style>body,html{margin:0;padding:0;height:100%}iframe{width:100%;height:100%;border:none}</style></head>
        <body><iframe src="${url}" sandbox="allow-scripts"></iframe></body></html>
      `);
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

/* Extended modals */
.seo-analyzer-modal,
.analytics-modal {
  max-width: 900px;
  max-height: 85vh;
}

/* Collaboration Button */
.collab-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.collab-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.collab-btn.connected {
  background: #ECFDF5;
  border-color: #10B981;
  color: #059669;
}

.collab-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #10B981;
  color: white;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
}

/* Collaboration Panel */
.collab-panel {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  overflow: hidden;
}

.collab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

.collab-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.close-collab {
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B7280;
  border-radius: 4px;
}

.close-collab:hover {
  background: #F3F4F6;
}

.collab-content {
  padding: 20px;
}

.collab-content p {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 16px;
}

.start-collab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.start-collab-btn:hover {
  background: #4F46E5;
}

.share-link {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.share-link input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 13px;
  background: #F9FAFB;
}

.share-link button {
  padding: 10px;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.share-link button:hover {
  background: #4F46E5;
}

.collaborators {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: #F9FAFB;
  border-radius: 8px;
}

.collab-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.collaborator span:first-of-type {
  flex: 1;
  font-size: 14px;
  color: #1F2937;
}

.collaborator .status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.collaborator .status.online {
  background: #10B981;
}

.collaborator .status.offline {
  background: #D1D5DB;
}

.end-collab-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  color: #EF4444;
  border: 1px solid #FCA5A5;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.end-collab-btn:hover {
  background: #FEF2F2;
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

  .collab-panel {
    right: 10px;
    width: calc(100% - 20px);
    max-width: 320px;
  }
}
</style>