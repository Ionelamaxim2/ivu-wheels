"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FooterSection from "../../components/FooterSection";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [billingAddress, setBillingAddress] = useState("same");
  const [selectedShipping, setSelectedShipping] = useState("ground");
  const [info, setInfo] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Calculate totals
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
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

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("checkoutInfo");
      if (saved) {
        const data = JSON.parse(saved);
        setInfo(data);
        if (data.selectedShipping) {
          setSelectedShipping(data.selectedShipping);
        }
      }

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const cartKey = user && user.email ? `cart:${user.email}` : "cart";
      const cartItemsFromStorage = JSON.parse(
        localStorage.getItem(cartKey) || "[]"
      );
      console.log("Payment - Cart key:", cartKey);
      console.log("Payment - Cart items:", cartItemsFromStorage);
      setCartItems(cartItemsFromStorage);
    } catch {}
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const cartKey = user && user.email ? `cart:${user.email}` : "cart";
      const cartItems = JSON.parse(localStorage.getItem(cartKey) || "[]");

      console.log("Cart key:", cartKey);
      console.log("Cart items:", cartItems);

      if (!cartItems.length) {
        alert("Cart is empty - cart key: " + cartKey);
        return;
      }

      if (!info) {
        alert("Missing checkout information");
        return;
      }

      const paymentData = {
        email: info.email,
        address: info.address,
        city: info.city,
        postalCode: info.postalCode || "",
        country: info.country || "Romania",
        selectedShipping,
        paymentMethod,
        billingAddress,
        cartItems,
        total: cartItems.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        ),
      };

      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.removeItem(cartKey);
        localStorage.setItem("lastOrder", JSON.stringify(result.order));

        window.dispatchEvent(new CustomEvent("cart-updated"));

        router.push("/confirmation");
      } else {
        alert(result.error || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
          <Link
            href="/cart"
            aria-label="Open cart"
            style={{ color: "white", textDecoration: "none" }}
          >
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
          style={{ color: "#ccc", textDecoration: "none" }}
        >
          shipping
        </Link>
        <span style={{ margin: "0 0.5rem" }}>&gt;</span>
        <span style={{ color: "white" }}>payment</span>
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
          {/* Left Side - Payment Form */}
          <div>
            {/* Contact Info - Filled */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.9rem", color: "#ccc" }}>
                  contact
                </span>
                <div style={{ fontSize: "1rem" }}>
                  {info?.email || "No email provided"}
                </div>
              </div>
              <button
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
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.9rem", color: "#ccc" }}>
                  ship to
                </span>
                <div style={{ fontSize: "1rem" }}>
                  {info?.address
                    ? `${info.address}, ${info.city}`
                    : "No address provided"}
                </div>
              </div>
              <button
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

            {/* Shipping Method - Filled */}
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
                  shipping method
                </span>
                <div style={{ fontSize: "1rem" }}>
                  {selectedShipping === "ground"
                    ? "Ground Shipping (5-7 days)"
                    : selectedShipping === "express"
                    ? "Express Shipping (2-3 days)"
                    : "Overnight Shipping (1 day)"}
                </div>
              </div>
              <button
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

            {/* Payment Section */}
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  marginBottom: "1.5rem",
                }}
              >
                Payment
              </h3>

              {/* Payment Method Options */}
              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    padding: "1rem",
                    background:
                      paymentMethod === "credit"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={paymentMethod === "credit"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>CREDIT CARD</span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    padding: "1rem",
                    background:
                      paymentMethod === "paypal"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>PAYPAL</span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    padding: "1rem",
                    background:
                      paymentMethod === "apple"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="apple"
                    checked={paymentMethod === "apple"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>APPLE PAY</span>
                </label>
              </div>

              {/* Billing Address */}
              <div style={{ marginBottom: "2rem" }}>
                <h4
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "400",
                    marginBottom: "1rem",
                  }}
                >
                  Billing address
                </h4>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    padding: "1rem",
                    background:
                      billingAddress === "same"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="radio"
                    name="billing"
                    value="same"
                    checked={billingAddress === "same"}
                    onChange={(e) => setBillingAddress(e.target.value)}
                  />
                  <span>SAME AS THE SHIPPING ADDRESS</span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    padding: "1rem",
                    background:
                      billingAddress === "different"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="radio"
                    name="billing"
                    value="different"
                    checked={billingAddress === "different"}
                    onChange={(e) => setBillingAddress(e.target.value)}
                  />
                  <span>USE A DIFFERENT BILLING ADDRESS</span>
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
                href="/shipping"
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ← RETURN TO SHIPPING
              </Link>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                style={{
                  background: isProcessing
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(255, 255, 255, 0.9)",
                  color: "#1a1a1a",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                }}
              >
                {isProcessing ? "PROCESSING..." : "PAY"}
              </button>
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
                      €{item.price} x {item.quantity}
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
                <span>€{subtotal.toFixed(2)}</span>
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
                <span>€{shipping.toFixed(2)}</span>
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
                <span>€{total.toFixed(2)}</span>
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
          window.addEventListener('auth-updated', function(){ try{ var u = JSON.parse(localStorage.getItem('user')||'null'); var link = document.getElementById('nav-auth'); if(u && link){ link.href='/user'; link.innerHTML='<svg width=20 height=20 viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'></path><circle cx=\'12\' cy=\'7\' r=\'4\'></circle></svg>'; } }catch(e){} });
          window.addEventListener('storage', function(ev){ if(ev.key==='user'){ try{ var u = JSON.parse(localStorage.getItem('user')||'null'); var link = document.getElementById('nav-auth'); if(u && link){ link.href='/user'; link.innerHTML='<svg width=20 height=20 viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'></path><circle cx=\'12\' cy=\'7\' r=\'4\'></circle></svg>'; } }catch(e){} } });
        })();
      `,
        }}
      />

      {/* Footer */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0" : "2rem",
        }}
      >
        <div style={{ marginTop: "auto" }}>
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
