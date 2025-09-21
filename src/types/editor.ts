export interface EditorState {
  selectedId: string | null;
  hoveredId: string | null;
  isDragging: boolean;
  draggedType: string | null;
  viewport: 'mobile' | 'tablet' | 'desktop';
  zoom: number;
  showCode: boolean;
  showGrid: boolean;
}

export interface DragDropState {
  isDragging: boolean;
  draggedComponentId?: string;
  draggedComponentType?: string;
  dropTargetId?: string;
  dropPosition?: 'before' | 'after' | 'inside';
}

export interface ViewportConfig {
  name: string;
  width: string;
  icon: string;
}

export interface ExportOptions {
  includeConfig?: boolean;
  platform?: 'vercel' | 'netlify' | 'static';
  minify?: boolean;
}