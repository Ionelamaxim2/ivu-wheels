"use client";

import { useEffect, useRef, useState } from "react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  connectionType?: string;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
  });
  const renderStartTime = useRef<number>(performance.now());

  useEffect(() => {
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const renderEndTime = performance.now();

      const newMetrics: PerformanceMetrics = {
        loadTime: navigation
          ? navigation.loadEventEnd - navigation.fetchStart
          : 0,
        renderTime: renderEndTime - renderStartTime.current,
      };

      // Memory usage (if available)
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        newMetrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB
      }

      // Connection type (if available)
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        newMetrics.connectionType = connection.effectiveType;
      }

      setMetrics(newMetrics);
    };

    // Measure after page load
    if (document.readyState === "complete") {
      measurePerformance();
    } else {
      window.addEventListener("load", measurePerformance);
    }

    return () => {
      window.removeEventListener("load", measurePerformance);
    };
  }, []);

  return metrics;
}

// Hook pentru monitorizarea vitezei de scroll
export function useScrollPerformance() {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
      }

      // Clear timeout și setează unul nou
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolling]);

  return { isScrolling };
}

// Hook pentru detectarea device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowEndDevice: false,
    supportsWebP: false,
    supportsAvif: false,
    prefersReducedMotion: false,
    connectionSpeed: "unknown",
  });

  useEffect(() => {
    const checkCapabilities = async () => {
      // Mobile detection
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;

      // Low-end device detection
      const isLowEndDevice =
        navigator.hardwareConcurrency <= 2 ||
        ("memory" in navigator && (navigator as any).memory.deviceMemory <= 2);

      // WebP support
      const supportsWebP = await new Promise<boolean>((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
      });

      // AVIF support
      const supportsAvif = await new Promise<boolean>((resolve) => {
        const avif = new Image();
        avif.onload = avif.onerror = () => resolve(avif.height === 2);
        avif.src =
          "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";
      });

      // Prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Connection speed
      let connectionSpeed = "unknown";
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        connectionSpeed = connection.effectiveType || "unknown";
      }

      setCapabilities({
        isMobile,
        isLowEndDevice,
        supportsWebP,
        supportsAvif,
        prefersReducedMotion,
        connectionSpeed,
      });
    };

    checkCapabilities();
  }, []);

  return capabilities;
}

// Hook pentru optimizarea imaginilor bazat pe device capabilities
export function useImageOptimization() {
  const capabilities = useDeviceCapabilities();

  const getOptimizedImageSrc = (
    baseSrc: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ) => {
    const { width, height, quality = 85 } = options || {};

    // Pentru device-uri low-end, folosim calitate mai mică
    const adjustedQuality = capabilities.isLowEndDevice
      ? Math.min(quality, 70)
      : quality;

    // Construiește URL-ul optimizat (presupunând un serviciu de optimizare)
    let optimizedSrc = baseSrc;

    // Adaugă parametri pentru optimizare
    const params = new URLSearchParams();
    if (width) params.append("w", width.toString());
    if (height) params.append("h", height.toString());
    params.append("q", adjustedQuality.toString());

    // Format selection based on support
    if (capabilities.supportsAvif) {
      params.append("f", "avif");
    } else if (capabilities.supportsWebP) {
      params.append("f", "webp");
    }

    const queryString = params.toString();
    if (queryString) {
      optimizedSrc += (baseSrc.includes("?") ? "&" : "?") + queryString;
    }

    return optimizedSrc;
  };

  return {
    getOptimizedImageSrc,
    ...capabilities,
  };
}
