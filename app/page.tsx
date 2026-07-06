"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Package,
  ChevronRight,
  Mail,
  Zap,
  Clock,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import productsData from "@/lib/mock-data/products.json";
import { getRecentlyViewed } from "@/lib/utils/recentlyViewed";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useContentStore } from "@/lib/store/contentStore";



const categories = [
  {
    name: "Pipe Tobacco",
    icon: "🪈",
    description: "Premium blends & accessories",
    color: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    href: "/products?category=Pipe+Tobacco",
  },
  {
    name: "Hookah & Shisha",
    icon: "💨",
    description: "Sets, shisha & charcoal",
    color: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    href: "/products?category=Hookah+%26+Shisha",
  },
  {
    name: "Cigars",
    icon: "🍂",
    description: "Handcrafted premium cigars",
    color: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    href: "/products?category=Cigars",
  },
  {
    name: "Vaping",
    icon: "⚡",
    description: "Devices, pods & e-liquids",
    color: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    href: "/products?category=Vaping",
  },
  {
    name: "Nicotine Products",
    icon: "🌿",
    description: "Pouches & tobacco-free",
    color: "from-teal-50 to-teal-100",
    border: "border-teal-200",
    href: "/products?category=Nicotine+Products",
  },
  {
    name: "Accessories",
    icon: "🔧",
    description: "Lighters, papers & more",
    color: "from-violet-50 to-violet-100",
    border: "border-violet-200",
    href: "/products?category=Accessories",
  },
];

const trustBadges = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "256-bit SSL encryption. Your payment info is always safe.",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    desc: "2–5 business day delivery anywhere in South Africa.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day hassle-free returns on all unopened products.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    desc: "All products sourced from verified, reputable suppliers.",
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
];

export default function HomePage() {
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const { heroHeading, heroSubtext, promoBannerText, featuredProductIds } = useContentStore();

  const featuredProducts = (productsData as any[])
    .filter((p) => featuredProductIds.includes(p.id))
    .slice(0, 8);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed());
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMCAyLTIgNC00IDRzLTQtMi00LTQgMi00IDQtNCA0IDIgNCA0eiIvPjwvZz48L2c+PC9zdmc+')]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-6">
                <Zap size={13} />
                South Africa&apos;s Premium Smoke Store
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Premium Tobacco
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                  & Accessories
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
                {heroSubtext}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-xl shadow-indigo-900/30"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link
                  href="/register/wholesale"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
                >
                  <Package size={18} />
                  Apply for Wholesale
                </Link>
              </div>

              <div className="flex gap-8 mt-12 pt-10 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold text-white">12+</p>
                  <p className="text-sm text-slate-400">Product Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-slate-400">Wholesale Buyers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.9★</p>
                  <p className="text-sm text-slate-400">Customer Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 50 240 50 0 0L0 60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Shop by Category</h2>
          <p className="text-slate-500">Browse our curated selection of premium products</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={cat.href}
                className={`flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} hover:shadow-md hover:-translate-y-1 transition-all group`}
              >
                <span className="text-4xl mb-3">{cat.icon}</span>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-tight">{cat.description}</p>
                <ChevronRight size={14} className="mt-2 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ───────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-500">Handpicked top sellers and new arrivals</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Wholesale CTA Banner ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center gap-6 shadow-2xl shadow-indigo-200">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
              <Package size={12} /> B2B Wholesale
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              {promoBannerText}
            </h2>
            <p className="text-indigo-200 leading-relaxed max-w-lg">
              Approved bulk buyers unlock tiered pricing on all products — saving up to 35%
              off retail. Apply today to access exclusive wholesale rates for your business.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="/register/wholesale"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-xl border border-white/30 transition-all text-sm"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trust Badges ────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Shop With Us?</h2>
            <p className="text-slate-500">We&apos;re committed to quality, security, and service</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 ${badge.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <badge.icon size={26} className={badge.color} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{badge.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter ──────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={22} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Stay in the Know</h2>
          <p className="text-slate-400 mb-8">
            Get the latest product drops, wholesale deals, and exclusive offers straight to
            your inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => { e.preventDefault(); alert("Subscribed! (demo mode)"); }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Subscribe
            </button>
          </form>
          <p className="text-slate-500 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
      {/* Recently Viewed — appended after newsletter, only shows if there's history */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-8">
            <Clock size={20} className="text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-900">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentlyViewed.slice(0, 5).map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3">
                    <p className="text-xs text-indigo-600 font-medium mb-0.5">{p.category}</p>
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1">{p.name}</p>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(p.retailPrice)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
