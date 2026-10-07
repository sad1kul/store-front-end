"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCartStore, getApplicableBulkPrice } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { toast } from "sonner";
import { useState } from "react";

interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  retailPrice: number;
  bulkPricingTiers: BulkPricingTier[];
  stock: number;
  images: string[];
  featured?: boolean;
  reviews?: { rating: number }[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const [isAdding, setIsAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const isBulkApproved = user?.role === "bulk_buyer" && user.bulkStatus === "approved";
  const bulkPrice = isBulkApproved ? getApplicableBulkPrice(product.bulkPricingTiers, 1) : null;
  const displayPrice = bulkPrice ?? product.retailPrice;
  const hasBulkDiscount = bulkPrice !== null && bulkPrice < product.retailPrice;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      image: product.images[0],
      retailPrice: product.retailPrice,
      bulkPricingTiers: product.bulkPricingTiers,
      unitPrice: displayPrice,
      isBulkPriced: hasBulkDiscount,
      qty: 1,
    });
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden aspect-square bg-slate-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
          {hasBulkDiscount && (
            <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Bulk Price
            </span>
          )}
          {product.stock > 0 && (
            <span className={`absolute bottom-2 left-2 text-white text-xs font-semibold px-2 py-0.5 rounded-full ${product.stock < 10 ? "bg-amber-500" : "bg-emerald-600"}`}>
              {product.stock} in stock
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Out of Stock</span>
            </div>
          )}
          {/* wishlist heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
              toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
                icon: wishlisted ? "💔" : "❤️",
              });
            }}
            className={`absolute top-2 ${product.featured ? "right-2 top-8" : "right-2"} w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              wishlisted ? "bg-rose-500 text-white" : "bg-white/90 text-slate-400 hover:text-rose-500"
            }`}
          >
            <Heart size={14} className={wishlisted ? "fill-white" : ""} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs font-medium text-indigo-600 mb-1">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {avgRating && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={11}
                className={n <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
              />
            ))}
            <span className="text-xs text-slate-500 ml-1">({product.reviews?.length})</span>
          </div>
        )}

        <div className="flex items-end gap-2 mb-3">
          <span className="text-lg font-bold text-slate-900">{formatCurrency(displayPrice)}</span>
          {hasBulkDiscount && (
            <span className="text-sm text-slate-400 line-through">{formatCurrency(product.retailPrice)}</span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          {isAdding ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <ShoppingCart size={15} />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
