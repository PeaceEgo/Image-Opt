import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Status Optimize — Photos & videos for WhatsApp Status",
  description:
    "Make your photos & videos WhatsApp-ready without sacrificing unnecessary quality. Processing stays on your device.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
