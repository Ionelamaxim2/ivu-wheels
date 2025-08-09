"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function FooterSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        marginLeft: isMobile ? "calc(50% - 50vw)" : "calc(50% - 50vw)",
        marginRight: isMobile ? "calc(50% - 50vw)" : "calc(50% - 50vw)",
        backgroundColor: "#000000",
        paddingLeft: isMobile ? "1rem" : "2rem",
        paddingRight: isMobile ? "1rem" : "2rem",
        paddingBottom: isMobile ? "0" : "2rem",
        marginBottom: isMobile ? "0" : "auto",
      }}
    >
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: isMobile ? "1.5rem" : "2rem",
          paddingBottom: isMobile ? "1rem" : "0",
          display: "flex",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          gap: isMobile ? "1.5rem" : "2rem",
          color: "#ccc",
          position: "relative",
        }}
      >
        {/* Scroll to top button - positioned at top right on mobile only */}
        {isMobile && (
          <button
            onClick={scrollToTop}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: 35,
              height: 35,
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              fontSize: "1rem",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255, 255, 255, 0.1)";
            }}
          >
            ↑
          </button>
        )}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <img
              src="/wheelsshop/Icon.svg"
              alt="IVU"
              style={{ width: 40, height: 40 }}
            />
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: isMobile ? "1rem" : "1rem",
                  lineHeight: "1.4",
                }}
              >
                Strada Victoriei 45, Sector 1
              </div>
              <div
                style={{
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  lineHeight: "1.4",
                  marginTop: "0.3rem",
                }}
              >
                Bucharest, Romania
              </div>
              <div
                style={{
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  lineHeight: "1.4",
                  marginTop: "0.2rem",
                }}
              >
                010061
              </div>
            </div>
          </div>
          <div style={{ fontSize: isMobile ? "1rem" : "0.95rem" }}>
            <div style={{ marginBottom: "0.4rem" }}>+40 21 315 8742</div>
            <div>contact@ivuwheels.ro</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "3rem" }}>
          <div>
            <div
              style={{
                color: "white",
                marginBottom: isMobile ? "1.2rem" : "1rem",
                fontSize: isMobile ? "1.1rem" : "1rem",
                fontWeight: "500",
              }}
            >
              Menu
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "0.8rem" : "0.5rem",
                fontSize: isMobile ? "1rem" : "0.9rem",
              }}
            >
              <Link
                href="/products"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Products
              </Link>
              <Link
                href="/cart"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Cart
              </Link>
              <Link
                href="/user"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Account
              </Link>
              <Link
                href="/privacy"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Terms
              </Link>
            </div>
          </div>
          <div>
            <div
              style={{
                color: "white",
                marginBottom: isMobile ? "1.2rem" : "1rem",
                fontSize: isMobile ? "1.1rem" : "1rem",
                fontWeight: "500",
              }}
            >
              Social
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "0.8rem" : "0.5rem",
                fontSize: isMobile ? "1rem" : "0.9rem",
              }}
            >
              <a
                href="/coming-soon"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Facebook
              </a>
              <a
                href="/coming-soon"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Twitter
              </a>
              <a
                href="/coming-soon"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                LinkedIn
              </a>
              <a
                href="/coming-soon"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {!isMobile && (
          <div style={{ textAlign: "right" }}>
            <button
              onClick={scrollToTop}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255, 255, 255, 0.1)";
              }}
            >
              ↑
            </button>
          </div>
        )}
      </footer>

      <div
        style={{
          textAlign: "center",
          marginTop: isMobile ? "1.5rem" : "2rem",
          fontSize: isMobile ? "0.9rem" : "0.8rem",
          color: "#666",
          backgroundColor: "#000000",
          padding: isMobile ? "1.2rem 0" : "1rem",
          marginBottom: "0",
          lineHeight: "1.4",
        }}
      >
        © 2024 Ivu Wheels. All rights reserved.
      </div>
    </div>
  );
}
