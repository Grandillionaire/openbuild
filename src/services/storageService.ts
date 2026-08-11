import Dexie, { Table } from 'dexie';
import type { Component } from '@/types/component';
import { nanoid } from 'nanoid';
import { useEditorStore } from '@/stores/editor';
import { safeStringify, safeParse } from '@/utils/safeSerialize';
import { telemetry } from '@/lib/telemetry';

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
    // Auto-save every 30 seconds. autoSave() never rejects — an unhandled
    // rejection on a timer would fire forever with nothing to catch it.
    setInterval(() => {
      void this.autoSave();
    }, 30000);

    // Save before page unload
    window.addEventListener('beforeunload', () => {
      void this.autoSave();
    });
  }

  private async autoSave() {
    try {
      const store = useEditorStore();
      if (store.components.length === 0) return;

      // Carry the stored createdAt and version forward: re-stamping them on
      // every tick would reset each project's age and version counter to now/1.
      const existing = await this.projects.get(store.projectId);
      await this.saveProject({
        id: store.projectId,
        name: store.projectName,
        components: store.components,
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
        version: existing?.version
      });
    } catch (error) {
      telemetry.captureException(error, { scope: 'storageService.autoSave' });
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
    } catch (error) {
      telemetry.captureException(error, { scope: 'storageService.saveProject' });
      console.error('Failed to save project:', error);
      throw error;
    }

    // Best-effort localStorage backup. The whole tree is mirrored into a ~5 MB
    // budget, so a QuotaExceededError here is expected on large projects — it
    // must not fail a save that already succeeded in IndexedDB.
    try {
      localStorage.setItem('lastProjectId', project.id);
      localStorage.setItem(`project_backup_${project.id}`, safeStringify(project.components));
    } catch (error) {
      telemetry.captureException(error, { scope: 'storageService.backupToLocalStorage' });
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

    // Validate imported data structure
    if (!data || typeof data !== 'object') throw new Error('Invalid project data');
    if (data.components && !Array.isArray(data.components)) throw new Error('Invalid components');
    if (data.components) {
      data.components = data.components.filter((c: any) => c && typeof c === 'object' && typeof c.type === 'string');
    }

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