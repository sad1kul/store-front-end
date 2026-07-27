"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/lib/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
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
          {products.map((product, i) => (
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
  );
}
