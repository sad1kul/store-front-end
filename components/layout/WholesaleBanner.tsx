"use client";

import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

interface WholesaleBannerProps {
  promoBannerText: string;
}

export default function WholesaleBanner({ promoBannerText }: WholesaleBannerProps) {
  return (
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
  );
}
