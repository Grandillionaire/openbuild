import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { nanoid } from 'nanoid';
import type { Component } from '@/types/component';

export interface Page {
  id: string;
  name: string;
  slug: string;
  path: string;
  components: Component[];
  isHomePage: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Navigation {
  id: string;
  type: 'header' | 'footer';
  items: NavigationItem[];
  style?: any;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  pageId?: string;
  external?: boolean;
  children?: NavigationItem[];
}

export const usePagesStore = defineStore('pages', () => {
  // State
  const pages = ref<Page[]>([
    {
      id: nanoid(),
      name: 'Home',
      slug: 'home',
      path: '/',
      components: [],
      isHomePage: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const currentPageId = ref<string>(pages.value[0].id);
  const headerNavigation = ref<Navigation>({
    id: nanoid(),
    type: 'header',
    items: []
  });

  const footerNavigation = ref<Navigation>({
    id: nanoid(),
    type: 'footer',
    items: []
  });

  // Computed
  const currentPage = computed(() => {
    return pages.value.find(p => p.id === currentPageId.value);
  });

  const pageCount = computed(() => pages.value.length);

  const navigationPages = computed(() => {
    return pages.value.map(page => ({
      id: page.id,
      label: page.name,
      path: page.path
    }));
  });

  // Actions
  function createPage(name: string, slug?: string) {
    const pageSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
    const pagePath = pageSlug === 'home' ? '/' : `/${pageSlug}`;

    const newPage: Page = {
      id: nanoid(),
      name,
      slug: pageSlug,
      path: pagePath,
      components: [],
      isHomePage: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    pages.value.push(newPage);

    // Auto-add to navigation
    addToNavigation(newPage);

    return newPage;
  }

  function updatePage(pageId: string, updates: Partial<Page>) {
    const page = pages.value.find(p => p.id === pageId);
    if (page) {
      Object.assign(page, updates);
      page.updatedAt = new Date();

      // Update navigation if name or path changed
      if (updates.name || updates.path) {
        updateNavigationItem(pageId, updates.name, updates.path);
      }
    }
  }

  function deletePage(pageId: string) {
    const page = pages.value.find(p => p.id === pageId);
    if (page && !page.isHomePage) {
      const index = pages.value.indexOf(page);
      pages.value.splice(index, 1);

      // Remove from navigation
      removeFromNavigation(pageId);

      // Switch to home page if current page was deleted
      if (currentPageId.value === pageId) {
        const homePage = pages.value.find(p => p.isHomePage);
        if (homePage) {
          currentPageId.value = homePage.id;
        }
      }
    }
  }

  function duplicatePage(pageId: string) {
    const page = pages.value.find(p => p.id === pageId);
    if (page) {
      const newPage: Page = {
        ...page,
        id: nanoid(),
        name: `${page.name} Copy`,
        slug: `${page.slug}-copy`,
        path: `/${page.slug}-copy`,
        components: JSON.parse(JSON.stringify(page.components)),
        isHomePage: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      pages.value.push(newPage);
      return newPage;
    }
  }

  function setCurrentPage(pageId: string) {
    if (pages.value.find(p => p.id === pageId)) {
      currentPageId.value = pageId;
    }
  }

  function setHomePage(pageId: string) {
    pages.value.forEach(page => {
      page.isHomePage = page.id === pageId;
      if (page.isHomePage) {
        page.path = '/';
        page.slug = 'home';
      }
    });
  }

  // Navigation management
  function addToNavigation(page: Page) {
    const navItem: NavigationItem = {
      id: nanoid(),
      label: page.name,
      path: page.path,
      pageId: page.id
    };

    // Add to header navigation by default
    headerNavigation.value.items.push(navItem);
  }

  function removeFromNavigation(pageId: string) {
    headerNavigation.value.items = headerNavigation.value.items.filter(
      item => item.pageId !== pageId
    );
    footerNavigation.value.items = footerNavigation.value.items.filter(
      item => item.pageId !== pageId
    );
  }

  function updateNavigationItem(pageId: string, name?: string, path?: string) {
    const updateItem = (item: NavigationItem) => {
      if (item.pageId === pageId) {
        if (name) item.label = name;
        if (path) item.path = path;
      }
      if (item.children) {
        item.children.forEach(updateItem);
      }
    };

    headerNavigation.value.items.forEach(updateItem);
    footerNavigation.value.items.forEach(updateItem);
  }

  function addNavigationItem(type: 'header' | 'footer', item: NavigationItem) {
    const navigation = type === 'header' ? headerNavigation : footerNavigation;
    navigation.value.items.push(item);
  }

  function removeNavigationItem(type: 'header' | 'footer', itemId: string) {
    const navigation = type === 'header' ? headerNavigation : footerNavigation;
    navigation.value.items = navigation.value.items.filter(item => item.id !== itemId);
  }

  function reorderNavigationItems(type: 'header' | 'footer', items: NavigationItem[]) {
    const navigation = type === 'header' ? headerNavigation : footerNavigation;
    navigation.value.items = items;
  }

  // Page components management
  function updatePageComponents(pageId: string, components: Component[]) {
    const page = pages.value.find(p => p.id === pageId);
    if (page) {
      page.components = components;
      page.updatedAt = new Date();
    }
  }

  function getPageBySlug(slug: string) {
    return pages.value.find(p => p.slug === slug);
  }

  function getPageByPath(path: string) {
    return pages.value.find(p => p.path === path);
  }

  // Export/Import
  function exportPages() {
    return {
      pages: pages.value,
      headerNavigation: headerNavigation.value,
      footerNavigation: footerNavigation.value
    };
  }

  function importPages(data: any) {
    if (data.pages) {
      pages.value = data.pages;
    }
    if (data.headerNavigation) {
      headerNavigation.value = data.headerNavigation;
    }
    if (data.footerNavigation) {
      footerNavigation.value = data.footerNavigation;
    }
  }

  return {
    // State
    pages,
    currentPageId,
    currentPage,
    pageCount,
    navigationPages,
    headerNavigation,
    footerNavigation,

    // Actions
    createPage,
    updatePage,
    deletePage,
    duplicatePage,
    setCurrentPage,
    setHomePage,
    addNavigationItem,
    removeNavigationItem,
    reorderNavigationItems,
    updatePageComponents,
    getPageBySlug,
    getPageByPath,
    exportPages,
    importPages
  };
});