export interface Asset {
  id: string;
  type: 'image' | 'video' | 'icon';
  url: string;
  thumbnail?: string;
  metadata: {
    name: string;
    size: number;
    dimensions?: { width: number; height: number };
    uploadedAt: Date;
    source?: 'upload' | 'unsplash' | 'pexels';
    originalUrl?: string;
  };
}

export interface ExternalAsset {
  id: string;
  url: string;
  thumbnail: string;
  author: string;
  description: string;
  dimensions: { width: number; height: number };
  source: 'unsplash' | 'pexels';
}

export interface AssetSearchOptions {
  query: string;
  page?: number;
  perPage?: number;
  source?: 'unsplash' | 'pexels' | 'all';
}

export interface AssetCategory {
  name: string;
  count: number;
}