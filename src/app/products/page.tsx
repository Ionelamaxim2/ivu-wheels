"use client";

import { wheels } from "@/data/wheels";
import Link from "next/link";
import FooterSection from "@/components/FooterSection";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    model: "All",
    carBrand: "All",
    size: "All",
  });

  const categories = ["All", "Performance", "Flow", "Modular"];
  const modelGroups = ["Flow", "Performance", "Modular"];
  const carBrands = ["All", "BMW", "Mercedes", "Audi", "VW", "Seat"];
  const sizes = ["All", "17", "18", "19", "20", "21", "22"];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const check = () => {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        setIsLoggedIn(!!u);
      } catch {}
    };
    check();
    const onAuth = () => check();
    window.addEventListener("auth-updated", onAuth);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") check();
    };
    window.addEventListener("storage", onStorage as any);
    return () => {
      window.removeEventListener("auth-updated", onAuth);
      window.removeEventListener("storage", onStorage as any);
    };
  }, []);

  const getFirstImage = (wheelImages: string[]) => {
    return wheelImages.find((img) => img.includes("1")) || wheelImages[0];
  };

  const filteredWheels = wheels.filter((wheel) => {
    return (
      (filters.category === "All" || wheel.category === filters.category) &&
      (filters.carBrand === "All" ||
        wheel.compatibleCars.includes(filters.carBrand)) &&
      (filters.size === "All" || wheel.size.includes(filters.size))
    );
  });

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Gruppo, Arial, sans-serif",
      }}
    >
      {/* Header (match other pages) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "0.75rem 2rem" : "1rem 0.5rem",
          backgroundColor: "#000000",
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            onClick={() => (window.location.href = "/")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              border: "2px solid white",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
            }}
          >
            <span
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: "1rem",
                fontFamily: "Arial, sans-serif",
                cursor: "pointer",
              }}
            >
              IVU
            </span>
          </div>
          <span
            style={{ color: "white", fontSize: "0.95rem", letterSpacing: 1 }}
          >
            PRODUCTS
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/cart" style={{ color: "white", textDecoration: "none" }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "28px", height: "28px" }}
              >
                <path
                  d="M6 6h15l-1.5 9h-12z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="9"
                  cy="20"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="18"
                  cy="20"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span
                id="nav-cart-badge"
                style={{
                  position: "absolute",
                  top: -6,
                  right: -8,
                  background: "white",
                  color: "black",
                  borderRadius: "999px",
                  padding: "0 6px",
                  fontSize: 12,
                  lineHeight: "18px",
                  minWidth: 18,
                  textAlign: "center",
                }}
              ></span>
            </span>
          </a>
          {isLoggedIn ? (
            <a
              id="nav-auth"
              href="/user"
              style={{
                color: "white",
                padding: "0.3rem 0.6rem",
                borderRadius: "20px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.4)",
                background: "transparent",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </a>
          ) : (
            <a
              id="nav-auth"
              href="/login"
              style={{
                color: "white",
                padding: "0.4rem 1.2rem",
                borderRadius: "20px",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: "bold",
                border: "1px solid white",
                background: "transparent",
                textTransform: "uppercase",
              }}
            >
              LOG IN
            </a>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "1rem 1.5rem" : "2rem 3rem",
        }}
      >
        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "25px",
            color: "white",
            padding: "0.75rem 2rem",
            marginBottom: "2rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            backdropFilter: "blur(10px)",
          }}
        >
          FILTER
        </button>

        {/* Expandable Filter Section */}
        {isFilterOpen && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "2rem",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Model Filter (mapped to category selection) */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  fontWeight: "500",
                }}
              >
                MODEL
              </h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {modelGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setFilters({ ...filters, category: group })}
                    style={{
                      background:
                        filters.category === group
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "25px",
                      color: "white",
                      padding: "0.5rem 1.5rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* Car Brand Filter */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  fontWeight: "500",
                }}
              >
                CAR BRAND
              </h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {carBrands.slice(0, 3).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setFilters({ ...filters, carBrand: brand })}
                    style={{
                      background:
                        filters.carBrand === brand
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "25px",
                      color: "white",
                      padding: "0.5rem 1.5rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  fontWeight: "500",
                }}
              >
                SIZE
              </h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {sizes.slice(0, 4).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFilters({ ...filters, size })}
                    style={{
                      background:
                        filters.size === size
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "25px",
                      color: "white",
                      padding: "0.5rem 1.5rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(auto-fill, minmax(280px, 1fr))",
            gap: isMobile ? "1rem" : "2rem",
            marginBottom: "3rem",
          }}
        >
          {filteredWheels.map((wheel) => (
            <Link
              key={wheel.id}
              href={`/products/${wheel.id}`}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "1.5rem",
                textDecoration: "none",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  marginBottom: "1rem",
                  borderRadius: "15px",
                  overflow: "hidden",
                  background: "#f5f5f5",
                }}
              >
                <img
                  src={`/wheels2/${getFirstImage(wheel.images)}`}
                  alt={wheel.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "white",
                  lineHeight: "1.3",
                }}
              >
                {wheel.name}
              </h3>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "white",
                  margin: 0,
                }}
              >
                ${wheel.price}
              </p>
            </Link>
          ))}
        </div>

        <FooterSection />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function(){
          function key(){
            try{ var u = JSON.parse(localStorage.getItem('user')||'null'); return u && u.email ? ('cart:'+u.email) : 'cart'; }catch(e){ return 'cart'; }
          }
          function update(){
            try{
              var u = JSON.parse(localStorage.getItem('user')||'null');
              var link = document.getElementById('nav-auth');
              if(u && link){
                link.href = '/user';
                link.innerHTML = '<svg width=20 height=20 viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'></path><circle cx=\'12\' cy=\'7\' r=\'4\'></circle></svg>';
                link.style.border = '1px solid rgba(255,255,255,0.4)';
                link.style.padding = '0.3rem 0.6rem';
              }
              var badge = document.getElementById('nav-cart-badge');
              if(badge){
                var cart = JSON.parse(localStorage.getItem(key())||'[]');
                var count = cart.reduce(function(s,i){return s+(i.quantity||0)},0);
                badge.textContent = count>0? String(count): '';
              }
            }catch(e){}
          }
          update();
          window.addEventListener('cart-updated', update);
          window.addEventListener('auth-updated', update);
          window.addEventListener('storage', function(ev){ if(ev.key==='user') update(); });
        })();
      `,
        }}
      />
    </div>
  );
}
