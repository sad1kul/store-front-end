"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { allProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";


export default function WishlistPage() {
  const { ids, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  const products = allProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-rose-500 fill-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-sm text-slate-500">{products.length} saved item{products.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
          <Heart size={40} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Your wishlist is empty</p>
          <p className="text-sm text-slate-400 mt-1 mb-6">Browse products and click the heart icon to save items here.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <Link href={`/products/${product.slug}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs font-medium text-indigo-600 mb-1">{product.category}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-3">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-slate-900 mb-4">{formatCurrency(product.retailPrice)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addItem({
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          sku: product.sku,
                          image: product.images[0],
                          retailPrice: product.retailPrice,
                          bulkPricingTiers: product.bulkPricingTiers,
                          unitPrice: product.retailPrice,
                          isBulkPriced: false,
                          qty: 1,
                        });
                        toast.success(`${product.name} added to cart!`);
                      }}
                      disabled={product.stock === 0}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      <ShoppingCart size={13} />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => toggle(product.id)}
                      className="w-9 h-9 flex items-center justify-center border border-rose-200 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
