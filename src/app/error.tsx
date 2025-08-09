"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "2rem",
        color: "white",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "500px",
        }}
      >
        <h2
          style={{ marginBottom: "1rem", color: "white", fontSize: "1.5rem" }}
        >
          Oops! Something went wrong
        </h2>
        <p style={{ marginBottom: "2rem", color: "rgba(255, 255, 255, 0.8)" }}>
          {error.message || "An unexpected error occurred"}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
