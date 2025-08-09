"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  style?: React.CSSProperties;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "white",
  style,
}) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
  };

  const spinnerSize = sizeMap[size];

  return (
    <>
      <div
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          border: `${Math.max(
            2,
            spinnerSize / 10
          )}px solid rgba(255, 255, 255, 0.3)`,
          borderTop: `${Math.max(2, spinnerSize / 10)}px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          ...style,
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default LoadingSpinner;
