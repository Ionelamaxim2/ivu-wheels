"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FooterSection from "../../components/FooterSection";

export default function TermsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        color: "white",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(10px)",
          padding: "1rem 0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="/"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
          >
            IVU
          </a>
          <a
            href="/"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "20px",
              transition: "all 0.3s ease",
            }}
          >
            Back to Home
          </a>
        </div>
      </nav>

      {/* Content */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: isMobile ? "2rem 1rem" : "4rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "2rem" : "3rem",
            fontWeight: "300",
            marginBottom: "2rem",
            fontFamily: "Gruppo, Arial, sans-serif",
          }}
        >
          Terms of Service
        </h1>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "15px",
            padding: isMobile ? "1.5rem" : "2rem",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          <p style={{ marginBottom: "1.5rem", color: "#ccc" }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Acceptance of Terms
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            By accessing and using IVU Wheels website and services, you accept
            and agree to be bound by the terms and provision of this agreement.
            These Terms of Service govern your use of our website and services.
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Products and Services
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            IVU Wheels offers high-quality wheel products for various vehicle
            models. All product descriptions, prices, and availability are
            subject to change without notice. We reserve the right to limit
            quantities and refuse service to anyone.
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Ordering and Payment
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            By placing an order, you agree to provide accurate and complete
            information. All orders are subject to acceptance and availability.
            We reserve the right to cancel any order for any reason. Payment
            must be received before products are shipped.
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Shipping and Returns
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Shipping costs and delivery times vary based on location and
            shipping method selected. Returns are accepted within 30 days of
            purchase in original condition. Customer is responsible for return
            shipping costs unless the return is due to our error.
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Warranty and Liability
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Our products come with manufacturer warranties. We are not liable
            for any damages resulting from the use of our products beyond the
            purchase price. Installation should be performed by qualified
            professionals.
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Intellectual Property
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            All content on this website, including text, graphics, logos, and
            images, is the property of IVU Wheels and is protected by copyright
            and other intellectual property laws. You may not reproduce or
            distribute any content without our written permission.
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Contact Information
          </h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at:{" "}
            <a
              href="mailto:contact@ivuwheels.com"
              style={{ color: "#ff8c00", textDecoration: "none" }}
            >
              contact@ivuwheels.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <FooterSection />
      </div>
    </div>
  );
}
