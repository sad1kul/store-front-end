"use client";

import { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminGuard from "@/components/layout/AdminGuard";
import { useAuthStore } from "@/lib/store/authStore";
import { useContentStore } from "@/lib/store/contentStore";
import { allProducts } from "@/lib/mock-data";
import { Lock, RefreshCw, Check, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";



export default function AdminContentPage() {
  const { user } = useAuthStore();
  const {
    heroHeading, setHeroHeading,
    heroSubtext, setHeroSubtext,
    promoBannerText, setPromoBannerText,
    featuredProductIds, toggleFeatured,
    reset,
  } = useContentStore();



  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }

  const handleSave = () => {
    toast.success("Homepage content saved! Changes are live.");
  };

  const handleReset = () => {
    reset();
    toast("Content reset to defaults", { icon: "↩️" });
  };



  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 bg-slate-50 overflow-auto">
        <div className="max-w-3xl mx-auto p-6 lg:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <LayoutDashboard size={20} className="text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Homepage Content</h1>
                <p className="text-sm text-slate-500">Edits are live immediately — no rebuild needed</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-white transition-colors"
            >
              <RefreshCw size={13} /> Reset Defaults
            </button>
          </div>

          <div className="space-y-5">
            {/* Hero section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Hero Heading
                  </label>
                  <input
                    type="text"
                    value={heroHeading}
                    onChange={(e) => setHeroHeading(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Hero Subtext
                  </label>
                  <textarea
                    value={heroSubtext}
                    onChange={(e) => setHeroSubtext(e.target.value)}
                    rows={2}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Promo banner */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Wholesale Promo Banner</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Banner Heading
                </label>
                <input
                  type="text"
                  value={promoBannerText}
                  onChange={(e) => setPromoBannerText(e.target.value)}
                  placeholder="e.g., Free shipping on orders over R1000"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* Featured products */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">Featured Products</h2>
                <span className="text-xs text-slate-400">{featuredProductIds.length} selected</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Toggle products to include or exclude them from the Featured section on the homepage.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {allProducts.map((p) => {
                  const active = featuredProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleFeatured(p.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        active
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.sku}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        active ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white"
                      }`}>
                        {active && <Check size={11} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                Save Content
              </button>
              <p className="text-xs text-slate-400">
                Changes are already live via Zustand — Save is a confirmation action.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
