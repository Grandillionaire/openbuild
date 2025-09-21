import type { Component } from './component';

export interface Project {
  id: string;
  name: string;
  components: Component[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  version?: number;
  metadata?: ProjectMetadata;
}

export interface ProjectMetadata {
  description?: string;
  author?: string;
  tags?: string[];
  settings?: ProjectSettings;
}

export interface ProjectSettings {
  defaultViewport?: 'mobile' | 'tablet' | 'desktop';
  theme?: 'light' | 'dark';
  customCSS?: string;
  customJS?: string;
}