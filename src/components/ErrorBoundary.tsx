"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);

    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary();
      }
    }

    if (
      hasError &&
      resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetErrorBoundary();
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      console.warn("Error report:", errorReport);
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
    }
  };

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        padding: "2rem",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        borderRadius: "12px",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        margin: "1rem",
        textAlign: "center",
      }}
    >
      {/* ICON DE ERORR */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(239, 68, 68, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      {/* MESAJ DE ERORR */}
      <h2
        style={{
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "1rem",
          fontFamily: "Gruppo, Arial, sans-serif",
        }}
      >
        Oops! Something went wrong
      </h2>

      <p
        style={{
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "1rem",
          marginBottom: "1.5rem",
          maxWidth: "500px",
          lineHeight: 1.5,
        }}
      >
        We encountered an unexpected error. This has been reported to our team.
        Please try again or contact support if the problem persists.
      </p>

      {/* BUTOANE DE ACTIUNE */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={onReset}
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "8px",
            color: "white",
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)";
          }}
        >
          Try Again
        </button>

        <button
          onClick={() => window.location.reload()}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "rgba(255, 255, 255, 0.8)",
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
          }}
        >
          Reload Page
        </button>
      </div>

      {/* TEHNICAL DETAILS (EXPANDABLE) */}
      {error && (
        <details
          style={{
            marginTop: "1rem",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <summary
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.8rem",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "4px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
            }}
          >
            Technical Details
          </summary>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: "0.5rem",
              textAlign: "left",
            }}
          >
            <pre
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SafeComponent({ children, fallback }: SafeComponentProps) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
