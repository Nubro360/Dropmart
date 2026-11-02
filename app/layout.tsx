import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "DropMart — Smarter Shopping. Happier You.", template: "%s | DropMart" },
  description: "Discover innovative electronics, gadgets and home products at unbeatable prices, delivered to your door.",
  alternates: { canonical: "/" },
  openGraph: { siteName: "DropMart", type: "website" },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = { "@context": "https://schema.org", "@type": "Organization", name: "DropMart", url: site };
  return (<html lang="en" className={font.variable}><body className="font-sans">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
    <CartProvider><Header /><main>{children}</main><Footer /></CartProvider></body></html>);
}
