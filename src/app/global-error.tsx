"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "1rem", color: "#333" }}>
            Something went wrong!
          </h2>
          <p style={{ marginBottom: "2rem", color: "#666" }}>
            {error.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={reset}
            style={{
              background: "#0070f3",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
