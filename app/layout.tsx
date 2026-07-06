import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import AgeGate from "@/components/shared/AgeGate";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Smoke Time Store — Premium Tobacco & Accessories",
    template: "%s | Smoke Time Store",
  },
  description:
    "South Africa's premier online smoke shop. Shop premium tobacco, hookahs, cigars, vaping products and more. B2C retail and B2B bulk wholesale available.",
  keywords: ["tobacco", "hookah", "shisha", "cigars", "vaping", "South Africa", "wholesale", "bulk"],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Smoke Time Store",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-slate-50 min-h-screen flex flex-col`}>
        <AgeGate />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <RoleSwitcher />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
