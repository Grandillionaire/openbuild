import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { nanoid } from 'nanoid';
import { useEditorStore } from './editor';
import type { Template, TemplateCategory, TemplateFilter } from '@/types/template';
import { templates as templateData } from '@/data/templates';
import { safeClone } from '@/utils/safeSerialize';

export const useTemplateStore = defineStore('templates', () => {
  // State
  const templates = ref<Template[]>(templateData);
  const filter = ref<TemplateFilter>({});
  
  // Computed
  const filteredTemplates = computed(() => {
    let result = [...templates.value];
    
    // Filter by category
    if (filter.value.category) {
      result = result.filter(t => t.category === filter.value.category);
    }
    
    // Filter by tags
    if (filter.value.tags && filter.value.tags.length > 0) {
      result = result.filter(t => 
        filter.value.tags!.some(tag => t.tags.includes(tag))
      );
    }
    
    // Filter by search
    if (filter.value.search) {
      const search = filter.value.search.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    // Filter premium
    if (filter.value.showPremium === false) {
      result = result.filter(t => !t.isPremium);
    }
    
    return result;
  });
  
  const categories = computed((): TemplateCategory[] => {
    return ['landing', 'portfolio', 'blog', 'business', 'ecommerce'];
  });
  
  const allTags = computed(() => {
    const tags = new Set<string>();
    templates.value.forEach(t => {
      t.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  });
  
  // Actions
  function applyTemplate(templateId: string) {
    try {
      const template = templates.value.find(t => t.id === templateId);
      if (!template) {
        return false;
      }
      
      const editorStore = useEditorStore();
      
      // Clear current components
      editorStore.clearProject();
      
      // Deep clone template components to avoid reference issues
      const clonedComponents = safeClone(template.components);
      
      // Ensure all components have valid IDs and parent references
      function ensureValidIds(components: any[], parentId?: string) {
        components.forEach(component => {
          // Ensure component has an ID
          if (!component.id) {
            component.id = nanoid(8);
          }
          
          // Ensure component has required properties
          if (!component.props) {
            component.props = {};
          }
          if (!component.styles) {
            component.styles = { base: {} };
          }
          
          // Set parent reference
          if (parentId) {
            component.parent = parentId;
          }
          
          // Process children recursively
          if (component.children && Array.isArray(component.children)) {
            ensureValidIds(component.children, component.id);
          }
        });
      }
      
      ensureValidIds(clonedComponents);
      
      // Apply template components one by one to maintain reactivity
      clonedComponents.forEach((component) => {
        editorStore.components.push(component);
      });
      
      // Update project name
      editorStore.projectName = `${template.name} Project`;
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  function setFilter(newFilter: TemplateFilter) {
    filter.value = { ...filter.value, ...newFilter };
  }
  
  function clearFilter() {
    filter.value = {};
  }
  
  function getTemplateById(id: string) {
    return templates.value.find(t => t.id === id);
  }
  
  function getTemplatesByCategory(category: TemplateCategory) {
    return templates.value.filter(t => t.category === category);
  }
  
  return {
    // State
    templates,
    filter,
    
    // Computed
    filteredTemplates,
    categories,
    allTags,
    
    // Actions
    applyTemplate,
    setFilter,
    clearFilter,
    getTemplateById,
    getTemplatesByCategory
  };
});