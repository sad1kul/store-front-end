"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Shop by Category</h2>
        <p className="text-slate-500">Browse our curated selection of premium products</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat, i) => (
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
  );
}
