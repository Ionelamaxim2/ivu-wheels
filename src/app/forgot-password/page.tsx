"use client";

import { useState, useEffect } from "react";

import SEOHead from "../../components/SEOHead";
import { useToast } from "../../components/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      addToast({
        message: "Password reset link sent to your email!",
        type: "success",
        duration: 4000,
      });
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  return (
    <>
      <SEOHead
        title="Forgot Password - IVU Wheels"
        description="Reset your password for IVU Wheels account."
        url="/forgot-password"
      />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "1rem" : "2rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />
        {/* Main Container */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(25px)",
            borderRadius: isMobile ? "20px" : "28px",
            padding: isMobile ? "1.5rem" : "2.5rem",
            width: "100%",
            maxWidth: isMobile ? "340px" : "420px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "0 25px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            position: "relative",
            zIndex: 1,
            margin: "auto",
          }}
        >
          {/* Logo */}
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
            }}
          >
            <h1
              style={{
                color: "white",
                fontSize: isMobile ? "1.8rem" : "2.2rem",
                fontWeight: "300",
                margin: 0,
                letterSpacing: "2px",
              }}
            >
              IVU
            </h1>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: isMobile ? "0.8rem" : "0.9rem",
                margin: "0.3rem 0 0 0",
                letterSpacing: "1px",
              }}
            >
              WHEELS
            </p>
          </div>

          {/* Welcome Text */}
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: isMobile ? "1.5rem" : "1.7rem",
                fontWeight: "300",
                margin: "0 0 0.3rem 0",
              }}
            >
              Forgot Password
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: isMobile ? "0.85rem" : "0.95rem",
                margin: 0,
              }}
            >
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: isMobile ? "1.2rem" : "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: isMobile ? "0.85rem" : "0.9rem",
                  marginBottom: "0.4rem",
                  fontWeight: "500",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: "100%",
                  padding: isMobile ? "0.75rem 0.9rem" : "0.875rem 1rem",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "14px",
                  color: "white",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                  e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(255, 255, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              style={{
                width: "100%",
                padding: isMobile ? "0.9rem" : "1rem",
                background:
                  isLoading || !email
                    ? "rgba(255, 255, 255, 0.1)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "14px",
                color: "white",
                fontSize: isMobile ? "0.95rem" : "1rem",
                fontWeight: "500",
                cursor: isLoading || !email ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                marginBottom: isMobile ? "1.2rem" : "1.5rem",
                boxSizing: "border-box",
                opacity: isLoading || !email ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && email) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0, 0, 0, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && email) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to Login */}
            <div
              style={{
                textAlign: "center",
                marginBottom: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: isMobile ? "0.85rem" : "0.9rem",
                }}
              >
                Remember your password?{" "}
                <a
                  href="/login"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "500",
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity =
                      "0.8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  }}
                >
                  Sign in
                </a>
              </span>
            </div>
          </form>

          {/* Back to Home */}
          <div style={{ textAlign: "center" }}>
            <a
              href="/"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: isMobile ? "0.8rem" : "0.85rem",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255, 255, 255, 0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255, 255, 255, 0.5)";
              }}
            >
              ← Back to IVU Wheels
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
