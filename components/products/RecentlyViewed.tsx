"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Product } from "@/lib/types";

interface RecentlyViewedProps {
  products: Product[];
}

export default function RecentlyViewed({ products }: RecentlyViewedProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-8">
        <Clock size={20} className="text-indigo-400" />
        <h2 className="text-2xl font-bold text-slate-900">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.slice(0, 5).map((p) => (
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
  );
}
