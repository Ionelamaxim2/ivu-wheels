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
    if (this.cache.size >= this.maxSize) {
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
export const cache = new Cache();
if (typeof window !== "undefined") {
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}
export class LocalStorageCache {
  private prefix: string;

  constructor(prefix: string = "ivu_cache_") {
    this.prefix = prefix;
  }

  set<T>(key: string, data: T, ttl: number = 24 * 60 * 60 * 1000): void {
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
export const localCache = new LocalStorageCache();
export class ImageCache {
  private cache: Map<string, HTMLImageElement> = new Map();
  private maxSize: number = 50;

  preload(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const cached = this.cache.get(src);
      if (cached) {
        resolve(cached);
        return;
      }

      const img = new Image();
      img.onload = () => {
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
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cacheKey = `fetch_${url}_${JSON.stringify(options || {})}`;
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    cache.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
