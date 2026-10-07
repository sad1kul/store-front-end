"use client";

import Link from "next/link";
import { Package, MapPin, Phone, Mail, Globe, Share2, MessageCircle } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Pipe Tobacco", href: "/products?category=Pipe+Tobacco" },
    { label: "Hookah & Shisha", href: "/products?category=Hookah+%26+Shisha" },
    { label: "Cigars", href: "/products?category=Cigars" },
    { label: "Vaping", href: "/products?category=Vaping" },
  ],
  Account: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "My Dashboard", href: "/dashboard" },
    { label: "Order History", href: "/dashboard" },
    { label: "Wholesale Account", href: "/register/wholesale" },
  ],
  Company: [
    { label: "About Us", href: "/" },
    { label: "Contact", href: "/" },
    { label: "Privacy Policy", href: "/" },
    { label: "Terms of Service", href: "/" },
    { label: "Delivery Info", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Smoke<span className="text-indigo-400">Time</span> Store
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              South Africa&apos;s trusted online smoke shop. Premium tobacco products, hookahs,
              cigars, and vaping supplies. B2C retail &amp; B2B wholesale available.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin size={15} className="mt-0.5 shrink-0 text-indigo-400" />
                <span>12 Market Square, Johannesburg CBD, Gauteng, 2000</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone size={15} className="shrink-0 text-indigo-400" />
                <span>+27 11 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={15} className="shrink-0 text-indigo-400" />
                <span>info@smoketimestore.co.za</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {[
                { Icon: Globe, href: "#" },
                { Icon: Share2, href: "#" },
                { Icon: MessageCircle, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                >
                  <Icon size={15} className="text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Smoke Time Store. All rights reserved. For adults 18+ only.
          </p>
          <div className="flex items-center gap-3">
            {["VISA", "MC", "EFT", "PayFast"].map((p) => (
              <span
                key={p}
                className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
