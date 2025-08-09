"use client";

import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export default function Breadcrumbs({ items, currentPage }: BreadcrumbsProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "http://localhost:3001",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `http://localhost:3001${item.href}`,
      })),
      {
        "@type": "ListItem",
        position: items.length + 2,
        name: currentPage,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        style={{
          padding: "1rem 0",
          fontSize: "0.9rem",
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <ol
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link
              href="/"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
              }}
            >
              Home
            </Link>
          </li>

          {items.map((item, index) => (
            <li
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>›</span>
              <Link
                href={item.href}
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}

          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>›</span>
            <span style={{ color: "white", fontWeight: "500" }}>
              {currentPage}
            </span>
          </li>
        </ol>
      </nav>
    </>
  );
}
