"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navStyle = {
  backgroundColor: "white",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const containerStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 2rem",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "4rem",
};

const logoStyle = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: "#1f2937",
  textDecoration: "none",
};

const navLinksStyle = {
  display: "flex",
  gap: "2rem",
};

const linkStyle = {
  color: "#6b7280",
  textDecoration: "none",
  padding: "0.5rem 0",
  transition: "color 0.15s ease-in-out",
};

const activeLinkStyle = {
  color: "#2563eb",
  borderBottom: "2px solid #2563eb",
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  textDecoration: "none",
  transition: "background-color 0.15s ease-in-out",
};

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <Link href="/" style={logoStyle}>
            IVU Wheels
          </Link>

          {/* Desktop Navigation */}
          <div style={navLinksStyle}>
            <Link
              href="/"
              style={{
                ...linkStyle,
                ...(isActive("/") ? activeLinkStyle : {}),
              }}
            >
              Home
            </Link>
            <Link
              href="/products"
              style={{
                ...linkStyle,
                ...(isActive("/products") ? activeLinkStyle : {}),
              }}
            >
              Products
            </Link>
            <Link
              href="/cart"
              style={{
                ...linkStyle,
                ...(isActive("/cart") ? activeLinkStyle : {}),
              }}
            >
              Cart
            </Link>
            <Link
              href="/login"
              style={{
                ...linkStyle,
                ...(isActive("/login") ? activeLinkStyle : {}),
              }}
            >
              Login
            </Link>
            <Link href="/register" style={buttonStyle}>
              Register
            </Link>
            <Link
              href="/user"
              style={{
                ...linkStyle,
                ...(isActive("/user") ? activeLinkStyle : {}),
              }}
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
