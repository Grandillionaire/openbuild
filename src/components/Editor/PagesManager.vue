<template>
  <div class="pages-manager">
    <div class="manager-header">
      <div class="header-title">
        <FileText :size="18" />
        <h3>Pages & Navigation</h3>
      </div>
      <button @click="createNewPage" class="add-page-btn">
        <Plus :size="16" />
        Add Page
      </button>
    </div>

    <!-- Pages List -->
    <div class="pages-section">
      <h4>Pages ({{ pagesStore.pageCount }})</h4>

      <div class="pages-list">
        <div
          v-for="page in pagesStore.pages"
          :key="page.id"
          :class="['page-item', { active: pagesStore.currentPageId === page.id }]"
          @click="selectPage(page)"
        >
          <div class="page-info">
            <div class="page-header">
              <Home v-if="page.isHomePage" :size="14" />
              <FileText v-else :size="14" />
              <span class="page-name">{{ page.name }}</span>
              <span v-if="page.isHomePage" class="home-badge">HOME</span>
            </div>
            <span class="page-path">{{ page.path }}</span>
          </div>

          <div class="page-actions">
            <button
              @click.stop="editPage(page)"
              class="action-btn"
              title="Edit Page"
            >
              <Edit2 :size="14" />
            </button>
            <button
              @click.stop="duplicatePage(page)"
              class="action-btn"
              title="Duplicate"
            >
              <Copy :size="14" />
            </button>
            <button
              v-if="!page.isHomePage"
              @click.stop="deletePage(page)"
              class="action-btn delete"
              title="Delete"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Editor -->
    <div class="navigation-section">
      <h4>Navigation</h4>

      <div class="nav-tabs">
        <button
          @click="activeNavTab = 'header'"
          :class="['nav-tab', { active: activeNavTab === 'header' }]"
        >
          Header Menu
        </button>
        <button
          @click="activeNavTab = 'footer'"
          :class="['nav-tab', { active: activeNavTab === 'footer' }]"
        >
          Footer Menu
        </button>
      </div>

      <div class="nav-content">
        <div class="nav-items">
          <draggable
            v-model="currentNavItems"
            item-key="id"
            group="navigation"
            @end="onNavigationReorder"
            handle=".drag-handle"
          >
            <template #item="{ element }">
              <div class="nav-item">
                <div class="drag-handle">
                  <GripVertical :size="14" />
                </div>
                <div class="nav-item-info">
                  <span class="nav-label">{{ element.label }}</span>
                  <span class="nav-path">{{ element.path }}</span>
                </div>
                <div class="nav-item-actions">
                  <button
                    @click="editNavItem(element)"
                    class="action-btn"
                    title="Edit"
                  >
                    <Edit2 :size="14" />
                  </button>
                  <button
                    @click="removeNavItem(element)"
                    class="action-btn delete"
                    title="Remove"
                  >
                    <X :size="14" />
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <button @click="addNavItem" class="add-nav-btn">
          <Plus :size="14" />
          Add Menu Item
        </button>
      </div>
    </div>

    <!-- Page Editor Modal -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showPageEditor" class="modal-overlay" @click="closePageEditor">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>{{ editingPage ? 'Edit Page' : 'New Page' }}</h3>
              <button @click="closePageEditor" class="close-btn">
                <X :size="20" />
              </button>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>Page Name</label>
                <input
                  v-model="pageForm.name"
                  type="text"
                  placeholder="About Us"
                />
              </div>

              <div class="form-group">
                <label>URL Slug</label>
                <div class="slug-input">
                  <span>/</span>
                  <input
                    v-model="pageForm.slug"
                    type="text"
                    placeholder="about-us"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>
                  <input
                    v-model="pageForm.isHomePage"
                    type="checkbox"
                  />
                  Set as Home Page
                </label>
              </div>

              <div class="form-group" v-if="editingPage">
                <label>Page Template</label>
                <select v-model="pageTemplate">
                  <option value="">Keep Current Design</option>
                  <option value="blank">Blank Page</option>
                  <option value="landing">Landing Page</option>
                  <option value="about">About Page</option>
                  <option value="contact">Contact Page</option>
                  <option value="blog">Blog Page</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button @click="closePageEditor" class="btn-cancel">Cancel</button>
              <button @click="savePage" class="btn-save">
                {{ editingPage ? 'Save Changes' : 'Create Page' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Navigation Item Editor -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showNavEditor" class="modal-overlay" @click="closeNavEditor">
          <div class="modal-content small" @click.stop>
            <div class="modal-header">
              <h3>{{ editingNavItem ? 'Edit Menu Item' : 'Add Menu Item' }}</h3>
              <button @click="closeNavEditor" class="close-btn">
                <X :size="20" />
              </button>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>Label</label>
                <input
                  v-model="navForm.label"
                  type="text"
                  placeholder="Menu Label"
                />
              </div>

              <div class="form-group">
                <label>Link Type</label>
                <div class="radio-group">
                  <label>
                    <input
                      v-model="navLinkType"
                      type="radio"
                      value="page"
                    />
                    Page Link
                  </label>
                  <label>
                    <input
                      v-model="navLinkType"
                      type="radio"
                      value="external"
                    />
                    External Link
                  </label>
                </div>
              </div>

              <div class="form-group" v-if="navLinkType === 'page'">
                <label>Select Page</label>
                <select v-model="navForm.pageId">
                  <option value="">Choose a page...</option>
                  <option
                    v-for="page in pagesStore.pages"
                    :key="page.id"
                    :value="page.id"
                  >
                    {{ page.name }}
                  </option>
                </select>
              </div>

              <div class="form-group" v-if="navLinkType === 'external'">
                <label>External URL</label>
                <input
                  v-model="navForm.path"
                  type="url"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div class="modal-footer">
              <button @click="closeNavEditor" class="btn-cancel">Cancel</button>
              <button @click="saveNavItem" class="btn-save">
                {{ editingNavItem ? 'Save Changes' : 'Add Item' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePagesStore } from '@/stores/pages';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';
import { nanoid } from 'nanoid';
import draggable from 'vuedraggable';
import {
  FileText,
  Plus,
  Home,
  Edit2,
  Copy,
  Trash2,
  X,
  GripVertical,
  ExternalLink
} from 'lucide-vue-next';

const pagesStore = usePagesStore();
const editorStore = useEditorStore();
const { showToast } = useToast();

// State
const activeNavTab = ref<'header' | 'footer'>('header');
const showPageEditor = ref(false);
const showNavEditor = ref(false);
const editingPage = ref<any>(null);
const editingNavItem = ref<any>(null);
const navLinkType = ref<'page' | 'external'>('page');
const pageTemplate = ref('');

// Forms
const pageForm = ref({
  name: '',
  slug: '',
  isHomePage: false
});

const navForm = ref({
  label: '',
  path: '',
  pageId: '',
  external: false
});

// Computed
const currentNavItems = computed({
  get() {
    return activeNavTab.value === 'header'
      ? pagesStore.headerNavigation.items
      : pagesStore.footerNavigation.items;
  },
  set(value) {
    pagesStore.reorderNavigationItems(activeNavTab.value, value);
  }
});

// Methods
function selectPage(page: any) {
  // Save current page's components before switching
  if (pagesStore.currentPage) {
    pagesStore.updatePageComponents(pagesStore.currentPage.id, editorStore.components);
  }

  // Switch to new page
  pagesStore.setCurrentPage(page.id);

  // Load new page's components
  editorStore.components = page.components || [];

  showToast(`Switched to ${page.name}`, 'success');
}

function createNewPage() {
  editingPage.value = null;
  pageForm.value = {
    name: '',
    slug: '',
    isHomePage: false
  };
  showPageEditor.value = true;
}

function editPage(page: any) {
  editingPage.value = page;
  pageForm.value = {
    name: page.name,
    slug: page.slug,
    isHomePage: page.isHomePage
  };
  showPageEditor.value = true;
}

function savePage() {
  if (!pageForm.value.name) {
    showToast('Please enter a page name', 'error');
    return;
  }

  if (!pageForm.value.slug) {
    pageForm.value.slug = pageForm.value.name.toLowerCase().replace(/\s+/g, '-');
  }

  if (editingPage.value) {
    // Update existing page
    pagesStore.updatePage(editingPage.value.id, {
      name: pageForm.value.name,
      slug: pageForm.value.slug
    });

    if (pageForm.value.isHomePage) {
      pagesStore.setHomePage(editingPage.value.id);
    }

    showToast('Page updated successfully', 'success');
  } else {
    // Create new page
    const newPage = pagesStore.createPage(pageForm.value.name, pageForm.value.slug);

    if (pageForm.value.isHomePage) {
      pagesStore.setHomePage(newPage.id);
    }

    // Apply template if selected
    if (pageTemplate.value) {
      applyPageTemplate(newPage.id, pageTemplate.value);
    }

    showToast('Page created successfully', 'success');
  }

  closePageEditor();
}

function applyPageTemplate(pageId: string, template: string) {
  // Apply predefined templates
  // This would load components based on the template
  console.log('Applying template:', template, 'to page:', pageId);
}

function duplicatePage(page: any) {
  const newPage = pagesStore.duplicatePage(page.id);
  if (newPage) {
    showToast(`Duplicated ${page.name}`, 'success');
  }
}

function deletePage(page: any) {
  if (confirm(`Are you sure you want to delete "${page.name}"?`)) {
    pagesStore.deletePage(page.id);
    showToast(`Deleted ${page.name}`, 'success');
  }
}

function closePageEditor() {
  showPageEditor.value = false;
  editingPage.value = null;
}

// Navigation methods
function addNavItem() {
  editingNavItem.value = null;
  navForm.value = {
    label: '',
    path: '',
    pageId: '',
    external: false
  };
  navLinkType.value = 'page';
  showNavEditor.value = true;
}

function editNavItem(item: any) {
  editingNavItem.value = item;
  navForm.value = {
    label: item.label,
    path: item.path,
    pageId: item.pageId || '',
    external: item.external || false
  };
  navLinkType.value = item.external ? 'external' : 'page';
  showNavEditor.value = true;
}

function saveNavItem() {
  if (!navForm.value.label) {
    showToast('Please enter a label', 'error');
    return;
  }

  const navItem = {
    id: editingNavItem.value?.id || nanoid(),
    label: navForm.value.label,
    path: '',
    pageId: undefined as string | undefined,
    external: false
  };

  if (navLinkType.value === 'page' && navForm.value.pageId) {
    const page = pagesStore.pages.find(p => p.id === navForm.value.pageId);
    if (page) {
      navItem.path = page.path;
      navItem.pageId = page.id;
    }
  } else if (navLinkType.value === 'external') {
    navItem.path = navForm.value.path;
    navItem.external = true;
  }

  if (editingNavItem.value) {
    // Update existing item
    const items = [...currentNavItems.value];
    const index = items.findIndex(i => i.id === editingNavItem.value.id);
    if (index !== -1) {
      items[index] = navItem;
      pagesStore.reorderNavigationItems(activeNavTab.value, items);
    }
  } else {
    // Add new item
    pagesStore.addNavigationItem(activeNavTab.value, navItem);
  }

  showToast('Navigation updated', 'success');
  closeNavEditor();
}

function removeNavItem(item: any) {
  if (confirm(`Remove "${item.label}" from navigation?`)) {
    pagesStore.removeNavigationItem(activeNavTab.value, item.id);
    showToast('Item removed from navigation', 'success');
  }
}

function closeNavEditor() {
  showNavEditor.value = false;
  editingNavItem.value = null;
}

function onNavigationReorder() {
  showToast('Navigation order updated', 'success');
}
</script>

<style scoped>
.pages-manager {
  padding: 16px;
  background: white;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.add-page-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #5b21b6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-page-btn:hover {
  background: #4c1d95;
}

/* Pages Section */
.pages-section,
.navigation-section {
  margin-bottom: 24px;
}

.pages-section h4,
.navigation-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.pages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.page-item.active {
  background: #f3f0ff;
  border-color: #5b21b6;
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.home-badge {
  padding: 2px 6px;
  background: #5b21b6;
  color: white;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.page-path {
  font-size: 12px;
  color: #6b7280;
  margin-left: 20px;
}

.page-actions {
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
  background: white;
  color: #374151;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* Navigation Section */
.nav-tabs {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.nav-tab {
  flex: 1;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-tab:hover {
  background: white;
  color: #374151;
}

.nav-tab.active {
  background: white;
  color: #5b21b6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.drag-handle {
  display: flex;
  align-items: center;
  color: #9ca3af;
  cursor: move;
}

.nav-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-label {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
}

.nav-path {
  font-size: 11px;
  color: #6b7280;
}

.nav-item-actions {
  display: flex;
  gap: 4px;
}

.add-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  background: white;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.add-nav-btn:hover {
  border-color: #5b21b6;
  color: #5b21b6;
  background: #f9f7ff;
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
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-content.small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group select {
  width: 100%;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
}

.form-group input[type="checkbox"] {
  margin-right: 6px;
}

.slug-input {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.slug-input span {
  padding: 8px 12px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  font-size: 13px;
  color: #6b7280;
}

.slug-input input {
  flex: 1;
  border: none;
  padding: 8px 12px;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  margin-right: 6px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-save {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-save {
  background: #5b21b6;
  color: white;
}

.btn-save:hover {
  background: #4c1d95;
}

/* Transitions */
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