"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { wheels } from "../../data/wheels";
import { cartStore } from "../../lib/cartStore";
import FooterSection from "../../components/FooterSection";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  buttonColor: string;
  cardBg: string;
  size?: string;
  car?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form state & validation
  const [formData, setFormData] = useState({
    email: "",
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  const validators: Record<string, (v: string) => string> = {
    email: (v) =>
      !v
        ? "Email is required"
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? ""
        : "Invalid email format",
    country: (v) =>
      !v ? "Country is required" : v.length < 2 ? "Too short" : "",
    firstName: (v) =>
      !v
        ? "First name is required"
        : /^[A-Za-zÀ-ž' -]{2,30}$/.test(v)
        ? ""
        : "2-30 letters only",
    lastName: (v) =>
      !v
        ? "Last name is required"
        : /^[A-Za-zÀ-ž' -]{2,30}$/.test(v)
        ? ""
        : "2-30 letters only",
    address: (v) =>
      !v ? "Address is required" : v.length < 5 ? "Too short" : "",
    apartment: () => "",
    city: (v) =>
      !v
        ? "City is required"
        : /^[A-Za-zÀ-ž' -]{2,50}$/.test(v)
        ? ""
        : "Invalid city",
    zip: (v) =>
      !v
        ? "ZIP is required"
        : /^[A-Za-z0-9 -]{3,10}$/.test(v)
        ? ""
        : "Invalid ZIP",
    phone: (v) =>
      !v
        ? "Phone is required"
        : /^[+()0-9 -]{7,20}$/.test(v)
        ? ""
        : "Invalid phone",
  };

  const setField = (name: string, value: string) => {
    setFormData((p) => {
      const next = { ...p, [name]: value } as typeof p;
      try {
        localStorage.setItem("checkoutInfo", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const validateField = (name: string, value: string) => {
    const fn = validators[name];
    if (!fn) return true;
    const msg = fn(value);
    setFormErrors((p) => ({ ...p, [name]: msg }));
    return !msg;
  };

  const validateAll = () => {
    const next: { [k: string]: string } = {};
    Object.entries(formData).forEach(([k, v]) => {
      const fn = validators[k];
      if (fn) next[k] = fn(v);
    });
    setFormErrors(next);
    return Object.values(next).every((m) => !m);
  };

  const goToShipping = () => {
    if (validateAll()) {
      try {
        localStorage.setItem("checkoutInfo", JSON.stringify(formData));
      } catch {}
      window.location.href = "/shipping";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Setup responsive breakpoint
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prefill checkout info on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("checkoutInfo");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((p) => ({ ...p, ...parsed }));
      }
    } catch {}
  }, []);

  // Auth state
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

  // Load cart items from multiple sources
  useEffect(() => {
    const loadCart = () => {
      try {
        console.log("=== CART PAGE DEBUG ===");
        console.log("Cart page loading...");

        // First try cart store
        const storeItems = cartStore.getItems();
        console.log("Cart store items:", storeItems);

        if (storeItems.length > 0) {
          console.log("Using cart store items:", storeItems);
          setCartItems(storeItems);
          setIsLoaded(true);
          return;
        }

        // Then try localStorage
        if (typeof window !== "undefined") {
          const key = (function () {
            try {
              const u = JSON.parse(localStorage.getItem("user") || "null");
              return u && u.email ? "cart:" + u.email : "cart";
            } catch (e) {
              return "cart";
            }
          })();
          const savedCart = localStorage.getItem(key);
          console.log("Saved cart from localStorage:", savedCart);

          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            console.log("Parsed cart items from localStorage:", parsedCart);
            console.log("Number of items:", parsedCart.length);
            setCartItems(parsedCart);
            setIsLoaded(true);
            return;
          }

          // Finally try sessionStorage
          const savedCartSession = sessionStorage.getItem("cart");
          console.log("Saved cart from sessionStorage:", savedCartSession);

          if (savedCartSession) {
            const parsedCart = JSON.parse(savedCartSession);
            console.log("Parsed cart items from sessionStorage:", parsedCart);
            console.log("Number of items:", parsedCart.length);
            setCartItems(parsedCart);
            setIsLoaded(true);
            return;
          }
        }

        console.log("No cart items found in any source");
        setCartItems([]);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading cart:", error);
        setIsLoaded(true);
      }
    };

    // Load cart immediately
    loadCart();

    // Add global functions for testing
    (window as any).testCart = () => {
      console.log("=== MANUAL CART TEST ===");
      console.log("Cart store items:", cartStore.getItems());
      console.log("localStorage cart:", localStorage.getItem("cart"));
      console.log("sessionStorage cart:", sessionStorage.getItem("cart"));
      loadCart();
      return "testCart executed";
    };

    (window as any).clearCart = () => {
      cartStore.clearItems();
      localStorage.removeItem("cart");
      sessionStorage.removeItem("cart");
      setCartItems([]);
      console.log("Cart cleared from all sources");
      return "clearCart executed";
    };

    (window as any).addTestItem = () => {
      const testItem = {
        id: 999,
        name: "Test Product",
        price: 100,
        quantity: 1,
        image: "deepconcavegri.webp", // Use an existing image
        buttonColor: "#000000",
        cardBg: "#ffffff",
        size: "19",
        car: "Test Car",
      };
      cartStore.addItem(testItem);
      setCartItems(cartStore.getItems());
      console.log("Test item added to cart");
      return "addTestItem executed";
    };

    return () => {
      delete (window as any).testCart;
      delete (window as any).clearCart;
      delete (window as any).addTestItem;
    };
  }, []); // Removed cartItems dependency to fix the warning

  // Save cart items to localStorage whenever cart changes (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const key = (function () {
        try {
          const u = JSON.parse(localStorage.getItem("user") || "null");
          return u && u.email ? "cart:" + u.email : "cart";
        } catch (e) {
          return "cart";
        }
      })();
      localStorage.setItem(key, JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cart-updated"));
    } catch {}
  }, [cartItems, isLoaded]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Will be calculated at next step
  const total = subtotal + shipping;

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
    try {
      window.dispatchEvent(new Event("cart-updated"));
    } catch {}
  };

  // Quick links for express checkout
  const openExpress = (method: string) => {
    const urls: Record<string, string> = {
      "Shop Pay": "https://shop.app/pay",
      PayPal: "https://www.paypal.com/checkoutnow",
      GPay: "https://pay.google.com",
      "Apple Pay": "https://www.apple.com/apple-pay/",
    };
    const url = urls[method];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Gruppo, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          backgroundColor: "#000000",
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
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/cart"
            style={{
              color: "white",
              textDecoration: "none",
              position: "relative",
            }}
          >
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
            </Link>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: "1rem 2rem", fontSize: "0.9rem", color: "#ccc" }}>
        <Link href="/cart" style={{ color: "white", textDecoration: "none" }}>
          cart
        </Link>
        <span style={{ margin: "0 0.5rem" }}>&gt;</span>
        <span>information</span>
        <span style={{ margin: "0 0.5rem" }}>&gt;</span>
        <span>shipping</span>
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
          {/* On mobile, show summary first */}
          {isMobile && (
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              total={total}
              onRemove={handleRemove}
            />
          )}

          {/* Left Side - Form Section */}
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "300",
                marginBottom: "2rem",
              }}
            >
              express checkout
            </h2>

            {/* Express Checkout Buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(4, 1fr)",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {(
                [
                  {
                    name: "Shop Pay",
                    bg: "#5a31f4",
                    color: "#fff",
                    border: "none",
                    content: (
                      <span style={{ fontWeight: 700, letterSpacing: 0.2 }}>
                        Shop Pay
                      </span>
                    ),
                  },
                  {
                    name: "PayPal",
                    bg: "#ffc439",
                    color: "#1d1d1d",
                    border: "none",
                    content: (
                      <span style={{ fontWeight: 700, letterSpacing: 0.2 }}>
                        PayPal
                      </span>
                    ),
                  },
                  {
                    name: "GPay",
                    bg: "#ffffff",
                    color: "#1d1d1d",
                    border: "1px solid rgba(0,0,0,0.15)",
                    content: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {/* Minimal Google G */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 48 48"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303C33.618 32.91 29.155 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.943 6.053 29.73 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.652-.389-3.917z"
                          />
                          <path
                            fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.294 16.019 18.729 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.943 6.053 29.73 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                          />
                          <path
                            fill="#4CAF50"
                            d="M24 44c5.087 0 9.681-1.944 13.178-5.122l-6.08-4.992C29.092 35.266 26.671 36 24 36c-5.128 0-9.476-3.098-11.27-7.487l-6.545 5.043C9.463 40.508 16.141 44 24 44z"
                          />
                          <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303c-1.304 3.06-3.77 5.469-6.882 6.886l6.08 4.992C37.91 37.63 40 31.185 40 24c0-1.341-.138-2.652-.389-3.917z"
                          />
                        </svg>
                        <span style={{ fontWeight: 700 }}>Pay</span>
                      </div>
                    ),
                  },
                  {
                    name: "Apple Pay",
                    bg: "#000000",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    content: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {/* Minimal Apple logo */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="#fff"
                        >
                          <path d="M16.365 1.43c.06.733-.27 1.447-.76 1.982-.52.56-1.375.99-2.19.93-.07-.71.28-1.46.76-1.97.53-.56 1.47-.98 2.19-.94zM20.5 17.34c-.37.88-.81 1.75-1.47 2.52-.78.93-1.77 2.09-3.07 2.11-1.27.02-1.67-.68-3.12-.68-1.45 0-1.89.66-3.15.7-1.32.03-2.33-1.14-3.11-2.06-1.7-2.05-3.01-5.79-1.26-8.34.87-1.24 2.26-2.02 3.78-2.04 1.48-.03 2.86.74 3.12.74.26 0 1.99-.92 3.35-.79.57.02 2.18.23 3.21 1.75-.08.05-1.92 1.12-1.9 3.34.02 2.66 2.34 3.54 2.38 3.56z" />
                        </svg>
                        <span style={{ fontWeight: 700 }}>Pay</span>
                      </div>
                    ),
                  },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.name}
                  onClick={() => openExpress(btn.name)}
                  style={{
                    background: btn.bg,
                    color: btn.color,
                    border: btn.border,
                    borderRadius: 8,
                    padding: "1rem",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  {btn.content}
                </button>
              ))}
            </div>

            <div
              style={{
                textAlign: "center",
                margin: "2rem 0",
                color: "#ccc",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              ></div>
              <span
                style={{
                  background: "#1a1a1a",
                  padding: "0 1rem",
                  position: "relative",
                }}
              >
                OR
              </span>
            </div>

            {/* Contact Information */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  marginBottom: "1rem",
                }}
              >
                contact
              </h3>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={(e) => validateField("email", e.target.value)}
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: formErrors.email
                    ? "1px solid #ff4d4d"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
              {formErrors.email && (
                <div
                  style={{
                    color: "#ff4d4d",
                    fontSize: "0.8rem",
                    marginTop: "0.35rem",
                  }}
                >
                  {formErrors.email}
                </div>
              )}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  color: "#ccc",
                }}
              >
                <input type="checkbox" />
                Email me with news and offers
              </label>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginTop: "0.5rem",
                }}
              >
                BY REGISTERING I AGREE TO RECEIVE EMAILS FROM IVU
              </p>
            </div>

            {/* Shipping Address */}
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  marginBottom: "1rem",
                }}
              >
                shipping address
              </h3>

              <div style={{ display: "grid", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Country/region"
                  value={formData.country}
                  onChange={(e) => setField("country", e.target.value)}
                  onBlur={(e) => validateField("country", e.target.value)}
                  maxLength={56}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: formErrors.country
                      ? "1px solid #ff4d4d"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
                {formErrors.country && (
                  <div
                    style={{
                      color: "#ff4d4d",
                      fontSize: "0.8rem",
                      marginTop: "0.35rem",
                    }}
                  >
                    {formErrors.country}
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      onBlur={(e) => validateField("firstName", e.target.value)}
                      maxLength={30}
                      style={{
                        padding: "1rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: formErrors.firstName
                          ? "1px solid #ff4d4d"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "1rem",
                        width: "100%",
                      }}
                    />
                    {formErrors.firstName && (
                      <div
                        style={{
                          color: "#ff4d4d",
                          fontSize: "0.8rem",
                          marginTop: "0.35rem",
                        }}
                      >
                        {formErrors.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      onBlur={(e) => validateField("lastName", e.target.value)}
                      maxLength={30}
                      style={{
                        padding: "1rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: formErrors.lastName
                          ? "1px solid #ff4d4d"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "1rem",
                        width: "100%",
                      }}
                    />
                    {formErrors.lastName && (
                      <div
                        style={{
                          color: "#ff4d4d",
                          fontSize: "0.8rem",
                          marginTop: "0.35rem",
                        }}
                      >
                        {formErrors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setField("address", e.target.value)}
                  onBlur={(e) => validateField("address", e.target.value)}
                  maxLength={80}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: formErrors.address
                      ? "1px solid #ff4d4d"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
                {formErrors.address && (
                  <div
                    style={{
                      color: "#ff4d4d",
                      fontSize: "0.8rem",
                      marginTop: "0.35rem",
                    }}
                  >
                    {formErrors.address}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={(e) => setField("apartment", e.target.value)}
                  maxLength={30}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setField("city", e.target.value)}
                      onBlur={(e) => validateField("city", e.target.value)}
                      maxLength={50}
                      style={{
                        padding: "1rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: formErrors.city
                          ? "1px solid #ff4d4d"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "1rem",
                        width: "100%",
                      }}
                    />
                    {formErrors.city && (
                      <div
                        style={{
                          color: "#ff4d4d",
                          fontSize: "0.8rem",
                          marginTop: "0.35rem",
                        }}
                      >
                        {formErrors.city}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="ZIP code"
                      value={formData.zip}
                      onChange={(e) => setField("zip", e.target.value)}
                      onBlur={(e) => validateField("zip", e.target.value)}
                      maxLength={10}
                      style={{
                        padding: "1rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: formErrors.zip
                          ? "1px solid #ff4d4d"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "1rem",
                        width: "100%",
                      }}
                    />
                    {formErrors.zip && (
                      <div
                        style={{
                          color: "#ff4d4d",
                          fontSize: "0.8rem",
                          marginTop: "0.35rem",
                        }}
                      >
                        {formErrors.zip}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onBlur={(e) => validateField("phone", e.target.value)}
                  maxLength={20}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: formErrors.phone
                      ? "1px solid #ff4d4d"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
                {formErrors.phone && (
                  <div
                    style={{
                      color: "#ff4d4d",
                      fontSize: "0.8rem",
                      marginTop: "0.35rem",
                    }}
                  >
                    {formErrors.phone}
                  </div>
                )}
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  color: "#ccc",
                  marginTop: "1rem",
                }}
              >
                <input type="checkbox" style={{ marginTop: "0.2rem" }} />
                <span>
                  TEXTS YOU&apos;LL WANT TO OPEN
                  <br />
                  SIGN UP FOR TEXT FROM IVU TO GET EARLY ACCESS TO NEW DROPS,
                  EXCLUSIVE DEALS & MORE
                </span>
              </label>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginTop: "0.5rem",
                }}
              >
                BY REGISTERING I AGREE TO RECEIVE EMAILS FROM IVU
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "2rem",
                  fontSize: "0.9rem",
                  color: "#ccc",
                }}
              >
                <span>📱</span>
                <span>
                  GET SMS ALERTS ABOUT YOUR ORDER AND SHIPPING COST (SWITCH TO
                  MAKE COUNTING SUPER CHILL)
                </span>
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
                href="/products"
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ← RETURN TO SHOPPING
              </Link>
              <button
                onClick={goToShipping}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#1a1a1a",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                TO SHIPPING
              </button>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          {!isMobile && (
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              total={total}
              onRemove={handleRemove}
            />
          )}
        </div>
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

      {/* Footer */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <FooterSection />
      </div>
    </div>
  );
}

function OrderSummary({
  cartItems,
  subtotal,
  total,
  onRemove,
}: {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  onRemove: (id: number) => void;
}) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        padding: "2rem",
        borderRadius: "15px",
        height: "fit-content",
      }}
    >
      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", color: "#ccc" }}>
          <p>Your cart is empty</p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
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
                    if (!target.dataset.fallback) {
                      console.warn(
                        `Primary image missing at /wheels2/${item.image}, trying /wheels/${item.image}`
                      );
                      target.src = `/wheels/${item.image}`;
                      target.dataset.fallback = "1";
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "transparent",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
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
                  {item.car || "for what car"}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
                  {item.size || "what size"}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#ccc",
                    marginTop: "0.5rem",
                  }}
                >
                  quantity: {item.quantity}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  €{item.price * item.quantity}
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  style={{
                    background: "transparent",
                    color: item.buttonColor,
                    border: `1px solid ${item.buttonColor}`,
                    borderRadius: 10,
                    padding: "0.35rem 0.9rem",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

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
              <span>€{subtotal}</span>
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
              <span>CALCULATED AT NEXT STEP</span>
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
              <span>€{total}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
