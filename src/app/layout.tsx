import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZAID FF TOURNAMENT | Free Fire Tournaments Pakistan",
  description:
    "Pakistan ka most trusted Free Fire tournament - Daily Solo, Duo, Squad matches. Entry Easypaisa / JazzCash / Sadapay se. Instant prize. WhatsApp 03390068468",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#07090f] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
