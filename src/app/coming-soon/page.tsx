"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "2rem 1rem" : "3rem 2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: isMobile ? "80px" : "120px",
            height: isMobile ? "80px" : "120px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem auto",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          <svg
            width={isMobile ? "40" : "60"}
            height={isMobile ? "40" : "60"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="white"
              opacity="0.8"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: isMobile ? "2.5rem" : "3.5rem",
            fontWeight: "300",
            color: "white",
            margin: "0 0 1rem 0",
            letterSpacing: "2px",
          }}
        >
          COMING SOON
        </h1>

        <p
          style={{
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            color: "rgba(255, 255, 255, 0.7)",
            margin: "0 0 3rem 0",
            lineHeight: "1.6",
            fontWeight: "300",
          }}
        >
          We&apos;re working hard to bring you an amazing social experience.
          <br />
          Stay tuned for updates!
        </p>

        <button
          onClick={handleGoBack}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50px",
            padding: isMobile ? "1rem 2rem" : "1.2rem 3rem",
            fontSize: isMobile ? "1rem" : "1.1rem",
            fontWeight: "500",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backdropFilter: "blur(20px)",
            letterSpacing: "1px",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          ← GO BACK
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </div>
  );
}
