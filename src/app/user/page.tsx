"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getOrders, Order as StoredOrder, getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import FooterSection from "../../components/FooterSection";

interface Order extends StoredOrder {}

export default function UserPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setFirstName(u.firstName);
    setLastName(u.lastName);
    setEmail(u.email);
    setOrders(getOrders());
  }, [router]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
    const lastStatus = orders[0]?.status || undefined;
    return { totalOrders, totalSpent, lastStatus };
  }, [orders]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const glass: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    borderRadius: 16,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  const sectionTitle: React.CSSProperties = {
    color: "white",
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0.5,
    marginBottom: 12,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f10 0%, #1b1c1f 100%)",
        padding: isMobile ? "20px 12px" : "40px 16px",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gap: isMobile ? 16 : 24,
        }}
      >
        {/* HEADER + STATS */}
        <div style={{ display: "grid", gap: isMobile ? 12 : 16 }}>
          <div style={{ ...glass, padding: isMobile ? 16 : 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    opacity: 0.8,
                    fontSize: isMobile ? 12 : 14,
                    letterSpacing: 2,
                  }}
                >
                  WELCOME BACK
                </div>
                <h1
                  style={{
                    margin: "6px 0 0 0",
                    fontWeight: 300,
                    fontSize: isMobile ? 24 : 32,
                  }}
                >
                  {firstName ? `Hello, ${firstName}!` : email}
                </h1>
              </div>
              <Link
                href="/products"
                style={{
                  color: "white",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 999,
                  padding: isMobile ? "8px 12px" : "10px 16px",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                }}
              >
                Go shopping →
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div style={{ ...glass, padding: isMobile ? 16 : 20 }}>
              <div style={{ opacity: 0.7, fontSize: isMobile ? 10 : 12 }}>
                TOTAL ORDERS
              </div>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 600 }}>
                {stats.totalOrders}
              </div>
            </div>
            <div style={{ ...glass, padding: isMobile ? 16 : 20 }}>
              <div style={{ opacity: 0.7, fontSize: isMobile ? 10 : 12 }}>
                TOTAL SPENT
              </div>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 600 }}>
                {stats.totalSpent} €
              </div>
            </div>
            <div style={{ ...glass, padding: isMobile ? 16 : 20 }}>
              <div style={{ opacity: 0.7, fontSize: isMobile ? 10 : 12 }}>
                LAST STATUS
              </div>
              <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 500 }}>
                {stats.lastStatus ? stats.lastStatus.toUpperCase() : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr",
            gap: isMobile ? 16 : 24,
          }}
        >
          {/* Orders */}
          <div style={{ ...glass, padding: isMobile ? 16 : 24 }}>
            <div style={sectionTitle}>Recent Orders</div>
            {orders.length === 0 ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px dashed rgba(255,255,255,0.18)",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <div style={{ opacity: 0.8, marginBottom: 12 }}>
                  No orders yet.
                </div>
                <Link
                  href="/products"
                  style={{ color: "white", textDecoration: "underline" }}
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 12,
                      padding: 16,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>Order {order.id}</div>
                        <div style={{ opacity: 0.8, fontSize: 13 }}>
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 600 }}>{order.total} €</div>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontSize: 12,
                            background: "rgba(255,255,255,0.12)",
                          }}
                        >
                          {order.status}
                        </div>
                      </div>
                    </div>
                    <div style={{ opacity: 0.9, fontSize: 14 }}>
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.name} × {item.quantity}
                          {idx < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ ...glass, padding: isMobile ? 16 : 24 }}>
              <div style={sectionTitle}>Profile</div>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ opacity: 0.8, fontSize: 13 }}>Name</div>
                <div style={{ fontSize: 16 }}>
                  {(firstName || "").trim() || "—"} {(lastName || "").trim()}
                </div>
                <div style={{ opacity: 0.8, fontSize: 13, marginTop: 12 }}>
                  Email
                </div>
                <div style={{ fontSize: 16 }}>{email}</div>
              </div>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  gap: isMobile ? 8 : 10,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    padding: isMobile ? "8px 12px" : "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "transparent",
                    color: "white",
                    cursor: "pointer",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  Logout
                </button>
                <Link
                  href="/products"
                  style={{
                    padding: isMobile ? "8px 12px" : "10px 14px",
                    borderRadius: 10,
                    background: "white",
                    color: "black",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.3)",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    textAlign: "center" as const,
                  }}
                >
                  Shop now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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
