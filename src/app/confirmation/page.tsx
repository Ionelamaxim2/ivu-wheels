"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addOrder, Order } from "@/lib/auth";
import FooterSection from "../../components/FooterSection";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [total, setTotal] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    try {
      const lastOrder = JSON.parse(localStorage.getItem("lastOrder") || "{}");

      if (lastOrder.orderNumber) {
        // Use data from API payment processing
        setOrderNumber(lastOrder.orderNumber);
        setOrderDate(new Date(lastOrder.date).toLocaleDateString());
        setCartItems(lastOrder.items || []);
        setTotal(lastOrder.total || 0);

        // Get contact and shipping info from checkout info
        const info = JSON.parse(localStorage.getItem("checkoutInfo") || "{}");
        setContactEmail(info.email || "");
        const address = `${info.firstName || ""} ${info.lastName || ""}, ${
          info.address || ""
        }${info.apartment ? ", " + info.apartment : ""}, ${info.city || ""}, ${
          info.zip || ""
        }, ${info.country || ""}`;
        setShipTo(address);

        const order: Order = {
          id: lastOrder.orderNumber,
          date: lastOrder.date,
          total: lastOrder.total,
          status: "processing",
          items: lastOrder.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        };
        addOrder(order);

        localStorage.removeItem("lastOrder");
      } else {
        const randomOrder =
          "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        setOrderNumber(randomOrder);
        const dateStr = new Date().toLocaleDateString();
        setOrderDate(dateStr);

        let items: CartItem[] = [];
        try {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsed = JSON.parse(savedCart);
            setCartItems(parsed);
            items = parsed;
            const t = parsed.reduce(
              (sum: number, it: CartItem) => sum + it.price * it.quantity,
              0
            );
            setTotal(t);
          }
        } catch {}

        try {
          const info = localStorage.getItem("checkoutInfo");
          if (info) {
            const parsed = JSON.parse(info);
            setContactEmail(parsed.email || "");
            const address = `${parsed.firstName || ""} ${
              parsed.lastName || ""
            }, ${parsed.address || ""}${
              parsed.apartment ? ", " + parsed.apartment : ""
            }, ${parsed.city || ""}, ${parsed.zip || ""}, ${
              parsed.country || ""
            }`;
            setShipTo(address);
          }
        } catch {}

        try {
          const order: Order = {
            id: randomOrder,
            date: new Date().toISOString(),
            status: "processing",
            total: items.reduce((s, it) => s + it.price * it.quantity, 0),
            items: items.map((it) => ({
              name: it.name,
              quantity: it.quantity,
              price: it.price,
            })),
          };
          addOrder(order);
          localStorage.removeItem("cart");
        } catch {}
      }
    } catch (e) {
      console.error("Error loading order data:", e);
    }
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Gruppo, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: isMobile ? "2rem 1rem" : "3rem 1.5rem",
        }}
      >
        {/* Success header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "1.5rem" : "2rem",
          }}
        >
          <div
            style={{
              width: isMobile ? 70 : 90,
              height: isMobile ? 70 : 90,
              borderRadius: "50%",
              margin: "0 auto 1rem",
              background: "rgba(46, 204, 113, 0.15)",
              border: "2px solid rgba(46, 204, 113, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2ecc71"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: isMobile ? 28 : 38, height: isMobile ? 28 : 38 }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: isMobile ? "1.8rem" : "2.2rem",
              margin: 0,
              letterSpacing: 1,
            }}
          >
            Thank you for your order!
          </h1>
          <p
            style={{
              color: "#ccc",
              marginTop: 8,
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            Your order has been placed and is being processed.
          </p>
        </div>

        {/* Order summary card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
            gap: isMobile ? "1.5rem" : "2rem",
          }}
        >
          {/* Left: details */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 16,
              padding: isMobile ? "1rem" : "1.5rem",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "1rem", fontWeight: 500 }}>
              Order details
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "0.5rem" : "0.75rem 1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ color: "#aaa" }}>Order number</div>
              <div>{orderNumber}</div>
              <div style={{ color: "#aaa" }}>Order date</div>
              <div>{orderDate}</div>
              <div style={{ color: "#aaa" }}>Contact</div>
              <div>{contactEmail || "-"}</div>
              <div style={{ color: "#aaa" }}>Ship to</div>
              <div style={{ lineHeight: 1.4 }}>{shipTo || "-"}</div>
              <div style={{ color: "#aaa" }}>Payment method</div>
              <div>Completed</div>
            </div>

            <h3 style={{ margin: "1rem 0", fontWeight: 500 }}>Items</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {cartItems.length === 0 ? (
                <div style={{ color: "#ccc" }}>No items</div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        background: "#000",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={`/wheels2/${item.image}`}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: "#aaa", fontSize: "0.9rem" }}>
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      ${item.price * item.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link
                href="/products"
                style={{
                  color: "white",
                  padding: "0.8rem 1.5rem",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.3)",
                  textDecoration: "none",
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right: totals card */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 16,
              padding: isMobile ? "1rem" : "1.5rem",
              height: "fit-content",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1rem", fontWeight: 500 }}>
              Summary
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#aaa" }}>Subtotal</span>
              <span>${total}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#aaa" }}>Shipping</span>
              <span>Calculated at fulfillment</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: 10,
                fontSize: "1.3rem",
                fontWeight: 800,
              }}
            >
              <span>TOTAL</span>
              <span>${total}</span>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                textAlign: "center",
                color: "#ccc",
              }}
            >
              A confirmation email has been sent to{" "}
              {contactEmail || "your mailbox"}
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <Link
                href="/"
                style={{
                  color: "#1a1a1a",
                  background: "rgba(255,255,255,0.9)",
                  padding: "0.8rem 1.5rem",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <FooterSection />
      </div>
    </div>
  );
}
