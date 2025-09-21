import Dexie, { Table } from 'dexie';
import type { Component } from '@/types/component';
import { nanoid } from 'nanoid';
import { useEditorStore } from '@/stores/editor';
import { safeStringify, safeParse } from '@/utils/safeSerialize';

export interface Project {
  id: string;
  name: string;
  components: Component[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  version?: number;
}

class StorageService extends Dexie {
  projects!: Table<Project>;
  
  constructor() {
    super('OpenBuildDB');
    
    this.version(1).stores({
      projects: 'id, name, createdAt, updatedAt'
    });
    
    // Auto-save setup
    this.setupAutoSave();
  }
  
  private setupAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
      this.autoSave();
    }, 30000);
    
    // Save before page unload
    window.addEventListener('beforeunload', () => {
      this.autoSave();
    });
  }
  
  private async autoSave() {
    const store = useEditorStore();
    if (store.components.length > 0) {
      await this.saveProject({
        id: store.projectId,
        name: store.projectName,
        components: store.components,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  
  async saveProject(project: Project): Promise<void> {
    try {
      // Generate thumbnail
      const thumbnail = await this.generateThumbnail(project.components);
      
      await this.projects.put({
        ...project,
        thumbnail,
        updatedAt: new Date(),
        version: (project.version || 0) + 1
      });
      
      // Save to localStorage as backup
      localStorage.setItem('lastProjectId', project.id);
      localStorage.setItem(`project_backup_${project.id}`, safeStringify(project.components));
      
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  }
  
  async loadProject(id: string): Promise<Project | null> {
    try {
      const project = await this.projects.get(id);
      if (!project) {
        // Try to load from localStorage backup
        const backup = localStorage.getItem(`project_backup_${id}`);
        if (backup) {
          const components = safeParse(backup);
          return {
            id,
            name: 'Recovered Project',
            components,
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }
        return null;
      }
      
      return project;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  }
  
  async listProjects(): Promise<Project[]> {
    try {
      const projects = await this.projects
        .orderBy('updatedAt')
        .reverse()
        .limit(20)
        .toArray();
      
      return projects.map(p => ({
        ...p,
        components: [] // Don't load components for list
      }));
    } catch (error) {
      console.error('Failed to list projects:', error);
      return [];
    }
  }
  
  async deleteProject(id: string): Promise<void> {
    await this.projects.delete(id);
    localStorage.removeItem(`project_backup_${id}`);
  }
  
  async duplicateProject(id: string): Promise<Project | null> {
    const project = await this.loadProject(id);
    if (!project) return null;
    
    const newProject = {
      ...project,
      id: nanoid(),
      name: `${project.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.saveProject(newProject);
    return newProject;
  }
  
  async exportProject(id: string): Promise<string> {
    const project = await this.loadProject(id);
    if (!project) throw new Error('Project not found');
    
    return safeStringify(project, 2);
  }
  
  async importProject(jsonData: string): Promise<Project> {
    const data = safeParse(jsonData);
    const project: Project = {
      id: nanoid(),
      name: data.name || 'Imported Project',
      components: data.components || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.saveProject(project);
    return project;
  }
  
  private async generateThumbnail(components: Component[]): Promise<string> {
    // Simple SVG thumbnail generation
    const svg = `
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#F9FAFB"/>
        <text x="100" y="75" text-anchor="middle" fill="#9CA3AF" font-size="14">
          ${components.length} components
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}

export const storageService = new StorageService();