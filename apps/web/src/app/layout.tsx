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
  title: "Status Optimize — Photos for WhatsApp Status",
  description:
    "Prepare WhatsApp HD photos on your device, then share to WhatsApp. Processing stays private.",
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
