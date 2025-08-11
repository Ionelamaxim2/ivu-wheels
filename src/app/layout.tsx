import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export const metadata: Metadata = {
  title: {
    default: "IVU Wheels - Premium Custom Rims & Wheels",
    template: "%s | IVU Wheels",
  },
  description:
    "Discover premium custom rims and wheels that define your drive. Shop Performance, Modular, and Flow collections with free shipping. Transform your vehicle today.",
  keywords: [
    "custom rims",
    "wheels",
    "performance rims",
    "modular wheels",
    "flow rims",
    "car accessories",
    "vehicle customization",
  ],
  authors: [{ name: "IVU Wheels" }],
  creator: "IVU Wheels",
  publisher: "IVU Wheels",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "IVU Wheels - Premium Custom Rims & Wheels",
    description:
      "Discover premium custom rims and wheels that define your drive. Shop Performance, Modular, and Flow collections with free shipping.",
    siteName: "IVU Wheels",
    images: [
      {
        url: "/wheelsshop/masinafundal1.webp",
        width: 1200,
        height: 630,
        alt: "IVU Wheels - Premium Custom Rims",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IVU Wheels - Premium Custom Rims & Wheels",
    description:
      "Discover premium custom rims and wheels that define your drive. Shop Performance, Modular, and Flow collections.",
    images: ["/wheelsshop/masinafundal1.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code-here",
    yandex: "yandex-verification-code-here",
    yahoo: "yahoo-site-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Keep only critical brand asset preload */}
        <link
          rel="preload"
          href="/wheelsshop/Icon.svg"
          as="image"
          type="image/svg+xml"
        />

        {/* Preload only video metadata via browser fetch; we avoid preloading heavy gallery images here */}
        <link
          rel="preload"
          href="/wheelsshop/HEROVIDEO.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
