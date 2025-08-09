"use client";

import CookieNotice from "./CookieNotice";
import { ToastProvider } from "./Toast";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
      <CookieNotice />
    </ToastProvider>
  );
}
