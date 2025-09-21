import type { Component } from './component';

export type TemplateCategory = 
  | 'landing' 
  | 'portfolio' 
  | 'blog' 
  | 'business' 
  | 'ecommerce';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnail: string;
  description: string;
  components: Component[];
  tags: string[];
  isPremium?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  tags?: string[];
  search?: string;
  showPremium?: boolean;
}