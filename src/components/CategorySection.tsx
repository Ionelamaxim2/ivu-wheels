"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { wheels } from "../data/wheels";
import GlassCard from "./GlassCard";

export default function CategorySection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const categories = [
    {
      name: "Performance",
      wheels: wheels
        .filter((wheel) => wheel.category === "Performance")
        .slice(0, isMobile ? 3 : 4),
    },
    {
      name: "Flow",
      wheels: wheels
        .filter((wheel) => wheel.category === "Flow")
        .slice(0, isMobile ? 3 : 4),
    },
    {
      name: "Modular",
      wheels: wheels
        .filter((wheel) => wheel.category === "Modular")
        .slice(0, isMobile ? 3 : 4),
    },
  ];

  const getFirstImage = (wheelImages: string[]) => {
    return wheelImages.find((img) => img.includes("1")) || wheelImages[0];
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", padding: "2rem 0" }}>
      <div
        style={{
          width: "100%",
          margin: "0",
          padding: "0",
        }}
      >
        {categories.map((category, categoryIndex) => (
          <div
            key={category.name}
            style={{ marginBottom: category.name === "Flow" ? "3rem" : "0" }}
          >
            {/* CATEGORIE - BG GRI */}
            <div
              style={{
                background: "rgba(128, 128, 128, 0.4)",
                borderRadius: "20px",
                padding: "2rem",
                margin: "0 2rem",
              }}
            >
              {/* CATEGORIE - RESPONSIV */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "2rem",
                  width: isMobile ? "100%" : "100vw",
                  marginLeft: isMobile ? "0" : "calc(-50vw + 50%)",
                  position: "relative",
                  display: isMobile ? "flex" : "block",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  gap: isMobile ? "1rem" : "0",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    fontSize: isMobile ? "1.5rem" : "2rem",
                    fontWeight: "300",
                    margin: 0,
                    fontFamily: "Gruppo, Arial, sans-serif",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                  }}
                >
                  {category.name}
                </h3>
                <Link
                  href={`/products?category=${category.name}`}
                  style={{
                    position: isMobile ? "static" : "absolute",
                    right: isMobile ? "auto" : "4rem",
                    top: isMobile ? "auto" : "50%",
                    transform: isMobile ? "none" : "translateY(-50%)",
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                    color: "white",
                    padding: isMobile ? "0.6rem 1.5rem" : "0.75rem 2rem",
                    borderRadius: "25px",
                    textDecoration: "none",
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    fontWeight: "500",
                    fontFamily: "Gruppo, Arial, sans-serif",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(20px)",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.15)",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))";
                    e.currentTarget.style.transform =
                      "translateY(-50%) translateY(-2px)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px 0 rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))";
                    e.currentTarget.style.transform = "translateY(-50%)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px 0 rgba(0, 0, 0, 0.15)";
                  }}
                >
                  SEE MORE
                </Link>
              </div>

              {/* CARTE - STIL GLASS */}
              {isMobile ? (
                <>
                  {/* PRIMA RINDA - 2 CARTE */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.6rem",
                      width: "100%",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {category.wheels.slice(0, 2).map((wheel) => (
                      <Link
                        key={wheel.id}
                        href={`/products/${wheel.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <GlassCard wheel={wheel} />
                      </Link>
                    ))}
                  </div>
                  {/* A DOUA RINDA - 1 CARD CENTRAT */}
                  {category.wheels.length > 2 && (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        key={category.wheels[2].id}
                        href={`/products/${category.wheels[2].id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <GlassCard wheel={category.wheels[2]} />
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    width: "100%",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {category.wheels.map((wheel) => (
                    <Link
                      key={wheel.id}
                      href={`/products/${wheel.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <GlassCard wheel={wheel} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* IMAGINE MASINA PERFORMANCE */}
            {category.name === "Performance" && (
              <div
                style={{
                  marginTop: "0",
                  borderRadius: "0",
                  overflow: "hidden",
                  height: "400px",
                  background: "linear-gradient(45deg, #333, #555)",
                  width: "100%",
                }}
              >
                <img
                  src="/wheelsshop/masinafundal1.webp"
                  alt="Performance Car"
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              </div>
            )}

            {/* IMAGINE MASINA MODULAR */}
            {category.name === "Modular" && (
              <div
                style={{
                  marginTop: "0",
                  borderRadius: "0",
                  overflow: "hidden",
                  height: "400px",
                  background: "linear-gradient(45deg, #333, #555)",
                  width: "100%",
                }}
              >
                <img
                  src="/wheelsshop/masinafundal2.webp"
                  alt="Performance Car"
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
