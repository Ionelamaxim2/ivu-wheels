"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FooterSection from "../../components/FooterSection";

export default function ShippingPage() {
  const [selectedShipping, setSelectedShipping] = useState("ground");
  const [info, setInfo] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping =
    selectedShipping === "ground"
      ? 0
      : selectedShipping === "express"
      ? 15
      : 30;
  const total = subtotal + shipping;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const check = () => {
      try {
        setIsLoggedIn(!!JSON.parse(localStorage.getItem("user") || "null"));
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("checkoutInfo");
      if (saved) setInfo(JSON.parse(saved));

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const cartKey = user && user.email ? `cart:${user.email}` : "cart";
      const cartItemsFromStorage = JSON.parse(
        localStorage.getItem(cartKey) || "[]"
      );
      console.log("Shipping - Cart key:", cartKey);
      console.log("Shipping - Cart items:", cartItemsFromStorage);
      setCartItems(cartItemsFromStorage);
    } catch {}
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

  const goChange = () => {
    window.location.href = "/cart";
  };

  const contactText = info?.email || "not provided";
  const shipToText = info
    ? `${info.firstName || ""} ${info.lastName || ""}, ${info.address || ""}$${
        info.apartment ? ", " + info.apartment : ""
      }, ${info.city || ""}, ${info.zip || ""}, ${info.country || ""}`.replace(
        "$",
        ""
      )
    : "not provided";

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Gruppo, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img
              src="/wheelsshop/Icon.svg"
              alt="IVU"
              style={{ width: "40px", height: "40px" }}
            />
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "300", margin: 0 }}>
            I.V.U
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/cart" style={{ color: "white", textDecoration: "none" }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "34px", height: "34px" }}
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
          </Link>
          {isLoggedIn ? (
            <Link
              href="/user"
              id="nav-auth"
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
            </Link>
          ) : (
            <Link
              href="/login"
              id="nav-auth"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                textDecoration: "none",
                fontSize: "0.9rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              LOG IN
            </Link>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: "1rem 2rem", fontSize: "0.9rem", color: "#ccc" }}>
        <Link href="/cart" style={{ color: "#ccc", textDecoration: "none" }}>
          cart
        </Link>
        <span style={{ margin: "0 0.5rem" }}>&gt;</span>
        <span>information</span>
        <span style={{ margin: "0 0.5rem" }}>&gt;</span>
        <Link
          href="/shipping"
          style={{ color: "white", textDecoration: "none" }}
        >
          shipping
        </Link>
        <span style={{ margin: "0 0.5rem" }}>&gt;</span>
        <span>payment</span>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : "2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 400px",
            gap: isMobile ? "2rem" : "4rem",
          }}
        >
          {/* Left Side - Shipping Options */}
          <div>
            {/* Contact Info - Filled */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.9rem", color: "#ccc" }}>
                  contact
                </span>
                <div style={{ fontSize: "1rem", color: "white" }}>
                  {contactText}
                </div>
              </div>
              <button
                onClick={goChange}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff8c00",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                change
              </button>
            </div>

            {/* Ship To - Filled */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.9rem", color: "#ccc" }}>
                  ship to
                </span>
                <div style={{ fontSize: "1rem", color: "white" }}>
                  {shipToText}
                </div>
              </div>
              <button
                onClick={goChange}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff8c00",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                change
              </button>
            </div>

            {/* Shipping Method */}
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  marginBottom: "1rem",
                }}
              >
                shipping method
              </h3>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="ground"
                      checked={selectedShipping === "ground"}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <span>GROUND SHIPPING</span>
                  </div>
                  <span style={{ fontWeight: "bold" }}>$10</span>
                </label>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "3rem",
              }}
            >
              <Link
                href="/cart"
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ← RETURN TO CART
              </Link>
              <Link
                href="/payment"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#1a1a1a",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                TO PAYMENT
              </Link>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "2rem",
              borderRadius: "15px",
              height: "fit-content",
              fontFamily: "Gruppo, Arial, sans-serif",
            }}
          >
            {/* Cart Items */}
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "transparent",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={`/wheels2/${item.image}`}
                      alt={item.name}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        console.warn(`Image not found: /wheels2/${item.image}`);
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        marginBottom: "0.25rem",
                        color: "#fff",
                      }}
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#ccc",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Car: {item.car || "N/A"}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#ccc",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Size: {item.size || "N/A"}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#ccc",
                  marginBottom: "2rem",
                }}
              >
                <p>No items in cart</p>
              </div>
            )}

            {/* Summary */}
            <div
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                paddingTop: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  fontSize: "1rem",
                }}
              >
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  fontSize: "1rem",
                  color: "#ccc",
                }}
              >
                <span>SHIPPING</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "1rem",
                }}
              >
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function(){
          function key(){ try{ var u = JSON.parse(localStorage.getItem('user')||'null'); return u && u.email ? ('cart:'+u.email) : 'cart'; }catch(e){ return 'cart'; } }
          function update(){
            try{
              var u = JSON.parse(localStorage.getItem('user')||'null');
              var link = document.getElementById('nav-auth');
              if(u && link){
                link.href = '/user';
                link.innerHTML = '<svg width=20 height=20 viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'></path><circle cx=\'12\' cy=\'7\' r=\'4\'></circle></svg>';
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

      {/* Footer */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginTop: "auto" }}>
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
