"use client";

import { useState, useEffect } from "react";

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    console.log(
      "Cookie check - accepted:",
      cookiesAccepted,
      "isMobile:",
      isMobile,
      "isClient:",
      isClient
    );

    if (!cookiesAccepted) {
      setTimeout(() => {
        console.log("Setting cookie notice visible");
        setIsVisible(true);
      }, 1000);
    }
  }, [isClient]);

  const handleAccept = () => {
    console.log("Cookie accepted");
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible || !isClient) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(5px)",
          zIndex: 9999,
        }}
        onClick={handleAccept}
      />

      {/* NOTIFICARE COOKIE */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "calc(100vw - 2rem)" : "450px",
          maxWidth: isMobile ? "calc(100vw - 2rem)" : "450px",
          background: "rgba(0, 0, 0, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          padding: isMobile ? "2rem" : "2.5rem",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          zIndex: 10000,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          {/* COOKIE ICON */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            🍪
          </div>

          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontWeight: "600",
                color: "white",
              }}
            >
              We use cookies
            </h3>
            <p
              style={{
                margin: "0 0 1.5rem 0",
                fontSize: isMobile ? "0.85rem" : "0.9rem",
                color: "#ccc",
                lineHeight: "1.4",
              }}
            >
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. By clicking &quot;I
              understand&quot;, you consent to our use of cookies.
            </p>
            <button
              onClick={handleAccept}
              style={{
                background: "white",
                color: "black",
                border: "none",
                borderRadius: "25px",
                padding: isMobile ? "0.75rem 1.5rem" : "0.75rem 2rem",
                fontSize: isMobile ? "0.9rem" : "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
            >
              I understand
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
