"use client";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class Cache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private maxSize: number = 100;

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // TTL default: 5 minutes
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const cache = new Cache();

// Auto cleanup every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}

// Local Storage cache with expiration
export class LocalStorageCache {
  private prefix: string;

  constructor(prefix: string = "ivu_cache_") {
    this.prefix = prefix;
  }

  set<T>(key: string, data: T, ttl: number = 24 * 60 * 60 * 1000): void {
    // TTL default: 24 hours
    if (typeof window === "undefined") return;

    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);

      // Check if expired
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return item.data as T;
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === "undefined") return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export instances
export const localCache = new LocalStorageCache();

// Image cache for optimized loading
export class ImageCache {
  private cache: Map<string, HTMLImageElement> = new Map();
  private maxSize: number = 50;

  preload(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // Check if already cached
      const cached = this.cache.get(src);
      if (cached) {
        resolve(cached);
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Add to cache
        if (this.cache.size >= this.maxSize) {
          const firstKey = this.cache.keys().next().value;
          if (firstKey) {
            this.cache.delete(firstKey);
          }
        }

        this.cache.set(src, img);
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  get(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null;
  }

  has(src: string): boolean {
    return this.cache.has(src);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();

// API response cache
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cacheKey = `fetch_${url}_${JSON.stringify(options || {})}`;

  // Check cache first
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    cache.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
