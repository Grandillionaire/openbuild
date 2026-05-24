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
  /** Show a NEW badge in the template gallery. */
  isNew?: boolean;
  /** Show a POPULAR badge in the template gallery. */
  isPopular?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  tags?: string[];
  search?: string;
  showPremium?: boolean;
}