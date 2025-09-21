import Dexie, { Table } from 'dexie';
import { nanoid } from 'nanoid';
import type { Asset, ExternalAsset, AssetSearchOptions } from '@/types/asset';

class AssetDatabase extends Dexie {
  assets!: Table<Asset>;

  constructor() {
    super('OpenBuildAssets');
    
    this.version(1).stores({
      assets: 'id, type, metadata.name, metadata.uploadedAt, metadata.source'
    });
  }
}

export class AssetService {
  private db: AssetDatabase;
  private cache = new Map<string, ExternalAsset[]>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  // API Keys - In production, these should be environment variables
  // To use Unsplash/Pexels, you need to:
  // 1. Register at https://unsplash.com/developers and https://www.pexels.com/api/
  // 2. Get your API keys
  // 3. Replace these placeholders with your actual keys
  private unsplashKey = import.meta.env.VITE_UNSPLASH_KEY || '';
  private pexelsKey = import.meta.env.VITE_PEXELS_KEY || '';

  constructor() {
    this.db = new AssetDatabase();
  }

  async uploadImage(file: File): Promise<Asset> {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are supported');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size must be less than 5MB');
    }

    // Create optimized versions
    const { optimized, thumbnail, dimensions } = await this.optimizeImage(file);
    
    // Convert to base64 for storage
    const url = await this.fileToBase64(optimized);
    const thumbnailUrl = await this.fileToBase64(thumbnail);

    const asset: Asset = {
      id: nanoid(8),
      type: 'image',
      url,
      thumbnail: thumbnailUrl,
      metadata: {
        name: file.name,
        size: optimized.size,
        dimensions,
        uploadedAt: new Date(),
        source: 'upload'
      }
    };

    await this.db.assets.put(asset);
    return asset;
  }

  async getAssets(type?: 'image' | 'video' | 'icon'): Promise<Asset[]> {
    if (type) {
      return this.db.assets.where('type').equals(type).toArray();
    }
    return this.db.assets.toArray();
  }

  async deleteAsset(id: string): Promise<void> {
    await this.db.assets.delete(id);
  }

  async searchUnsplash(options: AssetSearchOptions): Promise<ExternalAsset[]> {
    if (!this.unsplashKey) {
      console.warn('Unsplash API key not configured. Please set VITE_UNSPLASH_KEY in your .env file.');
      return [];
    }

    const cacheKey = `unsplash:${options.query}:${options.page || 1}`;
    
    // Check cache
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(options.query)}&page=${options.page || 1}&per_page=${options.perPage || 20}`, {
        headers: {
          'Authorization': `Client-ID ${this.unsplashKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assets: ExternalAsset[] = data.results.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnail: photo.urls.small,
        author: photo.user.name,
        description: photo.description || photo.alt_description || '',
        dimensions: {
          width: photo.width,
          height: photo.height
        },
        source: 'unsplash'
      }));

      this.setCache(cacheKey, assets);
      return assets;
    } catch (error) {
      console.error('Unsplash search error:', error);
      return [];
    }
  }

  async searchPexels(options: AssetSearchOptions): Promise<ExternalAsset[]> {
    if (!this.pexelsKey) {
      console.warn('Pexels API key not configured. Please set VITE_PEXELS_KEY in your .env file.');
      return [];
    }

    const cacheKey = `pexels:${options.query}:${options.page || 1}`;
    
    // Check cache
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(options.query)}&page=${options.page || 1}&per_page=${options.perPage || 20}`, {
        headers: {
          'Authorization': this.pexelsKey
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assets: ExternalAsset[] = data.photos.map((photo: any) => ({
        id: photo.id.toString(),
        url: photo.src.large,
        thumbnail: photo.src.medium,
        author: photo.photographer,
        description: photo.alt || '',
        dimensions: {
          width: photo.width,
          height: photo.height
        },
        source: 'pexels'
      }));

      this.setCache(cacheKey, assets);
      return assets;
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  }

  async importExternalAsset(externalAsset: ExternalAsset): Promise<Asset> {
    const asset: Asset = {
      id: nanoid(8),
      type: 'image',
      url: externalAsset.url,
      thumbnail: externalAsset.thumbnail,
      metadata: {
        name: `${externalAsset.source}-${externalAsset.id}`,
        size: 0, // Unknown for external assets
        dimensions: externalAsset.dimensions,
        uploadedAt: new Date(),
        source: externalAsset.source,
        originalUrl: externalAsset.url
      }
    };

    await this.db.assets.put(asset);
    return asset;
  }

  private async optimizeImage(file: File): Promise<{
    optimized: Blob;
    thumbnail: Blob;
    dimensions: { width: number; height: number };
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        // Original dimensions
        const dimensions = { width: img.width, height: img.height };

        // Optimize main image (max 1920px)
        const maxSize = 1920;
        let { width, height } = dimensions;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((optimizedBlob) => {
          if (!optimizedBlob) {
            reject(new Error('Failed to optimize image'));
            return;
          }

          // Create thumbnail (200px)
          const thumbSize = 200;
          let thumbWidth = dimensions.width;
          let thumbHeight = dimensions.height;
          
          if (thumbWidth > thumbHeight) {
            thumbHeight = (thumbHeight / thumbWidth) * thumbSize;
            thumbWidth = thumbSize;
          } else {
            thumbWidth = (thumbWidth / thumbHeight) * thumbSize;
            thumbHeight = thumbSize;
          }

          canvas.width = thumbWidth;
          canvas.height = thumbHeight;
          ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

          canvas.toBlob((thumbnailBlob) => {
            if (!thumbnailBlob) {
              reject(new Error('Failed to create thumbnail'));
              return;
            }

            resolve({
              optimized: optimizedBlob,
              thumbnail: thumbnailBlob,
              dimensions
            });
          }, 'image/jpeg', 0.8);
        }, 'image/jpeg', 0.85);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async fileToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private getCached(key: string): ExternalAsset[] | null {
    const cached = this.cache.get(key);
    if (cached && cached.timestamp > Date.now() - this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: ExternalAsset[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export const assetService = new AssetService();