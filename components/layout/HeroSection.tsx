"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package, Zap } from "lucide-react";

interface HeroSectionProps {
  heroHeading?: string;
  heroSubtext: string;
}

export default function HeroSection({ heroHeading, heroSubtext }: HeroSectionProps) {
  return (
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
              {heroHeading || "South Africa's Premium Smoke Store"}
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
  );
}
