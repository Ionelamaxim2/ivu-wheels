"use client";

import React, { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  loading?: "lazy" | "eager";
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  style,
  onLoad,
  onError,
  loading = "eager",
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    console.log("Image loaded:", src);
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.log("Image error:", src);
    setHasError(true);
    if (onError) onError();
  };

  useEffect(() => {
    if (loading === "eager" && src) {
      const img = new Image();
      img.src = src;
    }
  }, [src, loading]);

  const imageStyle: React.CSSProperties = {
    ...style,
    opacity: 1,
    ...(hasError && { display: "none" }),
  };

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        className={className}
      />
      {false && !isLoaded && !hasError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
            opacity: 0.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "inherit",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              border: "3px solid rgba(255, 255, 255, 0.2)",
              borderTop: "3px solid rgba(255, 255, 255, 0.7)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default OptimizedImage;
