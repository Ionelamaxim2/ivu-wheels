"use client";

import Link from "next/link";

export default function FooterSection() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        backgroundColor: "#000000",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
          color: "#ccc",
        }}
      >
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
              <div style={{ fontWeight: "bold", color: "white" }}>
                123 Market St. #228
              </div>
              <div>Charlottesville, California</div>
              <div>44635</div>
            </div>
          </div>
          <div style={{ fontSize: "0.9rem" }}>
            <div>(434) 546-4350</div>
            <div>contact@ivuwheels</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "3rem" }}>
          <div>
            <div style={{ color: "white", marginBottom: "1rem" }}>Menu</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.9rem",
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
            <div style={{ color: "white", marginBottom: "1rem" }}>Social</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.9rem",
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
      </footer>

      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.8rem",
          color: "#666",
          backgroundColor: "#000000",
          padding: "1rem",
        }}
      >
        © 2024 Ivu Wheels. All rights reserved.
      </div>
    </div>
  );
}
