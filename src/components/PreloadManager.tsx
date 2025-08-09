"use client";

import { useEffect } from "react";
// @ts-ignore: imageCache may not have type declarations
import { imageCache } from "../lib/cache";

interface PreloadManagerProps {
  images?: string[];
  routes?: string[];
  priority?: boolean;
}

export default function PreloadManager({
  images = [],
  routes = [],
  priority = false,
}: PreloadManagerProps) {
  useEffect(() => {
    if (!priority) {
      // Delay non-priority preloading
      const timer = setTimeout(() => {
        preloadResources();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      preloadResources();
    }
  }, [images, routes, priority]);

  const preloadResources = async () => {
    if (images.length > 0) {
      const imagePromises = images.map(async (src) => {
        try {
          await imageCache.preload(src);
        } catch (error) {
          console.warn(`Failed to preload image: ${src}`, error);
        }
      });

      await Promise.allSettled(imagePromises);
    }

    if (routes.length > 0 && typeof window !== "undefined") {
      routes.forEach((route) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = route;
        document.head.appendChild(link);
      });
    }
  };

  return null;
}

export function useSmartPreload() {
  useEffect(() => {
    let mouseIdleTimer: NodeJS.Timeout;
    let isIdle = false;

    const handleMouseMove = () => {
      if (mouseIdleTimer) {
        clearTimeout(mouseIdleTimer);
      }

      mouseIdleTimer = setTimeout(() => {
        isIdle = true;

        preloadCriticalResources();
      }, 3000);
    };

    const handleMouseLeave = () => {
      if (!isIdle) {
        preloadCriticalResources();
      }
    };

    const preloadCriticalResources = () => {
      imageCache.preload("/wheelsshop/masinafundal1.webp");

      const commonImages = [
        "/wheels2/satinblack1.flow.webp",
        "/wheels2/silver.flow1.webp",
        "/wheels2/champagne.flow1.webp",
      ];

      commonImages.forEach((src) => {
        imageCache.preload(src).catch(() => {});
      });

      const criticalRoutes = ["/products", "/cart", "/login"];
      criticalRoutes.forEach((route) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = route;
        document.head.appendChild(link);
      });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (mouseIdleTimer) {
        clearTimeout(mouseIdleTimer);
      }
    };
  }, []);
}

export function CriticalPreloader() {
  useSmartPreload();

  useEffect(() => {
    const criticalImages = [
      "/wheelsshop/Icon.svg",
      "/wheelsshop/masinafundal1.webp",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });

    const fontLink = document.createElement("link");
    fontLink.rel = "preload";
    fontLink.as = "font";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Gruppo:wght@400;700&display=swap";
    fontLink.crossOrigin = "anonymous";
    document.head.appendChild(fontLink);
  }, []);

  return null;
}
