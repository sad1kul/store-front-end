"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Star, Package, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, Shield, Truck
} from "lucide-react";
import { allProducts } from "@/lib/mock-data";
import { ReviewItem } from "@/lib/types";
import { useCartStore, getApplicableBulkPrice } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useReviewStore } from "@/lib/store/reviewStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import BulkPricingTable from "@/components/products/BulkPricingTable";
import ReviewForm from "@/components/products/ReviewForm";
import Link from "next/link";
import { toast } from "sonner";
import { addRecentlyViewed } from "@/lib/utils/recentlyViewed";

interface PageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = allProducts.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const { user } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const isBulkApproved = user?.role === "bulk_buyer" && user.bulkStatus === "approved";
  const getReviews = useReviewStore((s) => s.getReviews);
  const liveReviews = getReviews(product.id);

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product.id]);

  const bulkPrice = isBulkApproved
    ? getApplicableBulkPrice(product.bulkPricingTiers, qty)
    : null;
  const displayPrice = bulkPrice ?? product.retailPrice;
  const hasBulkDiscount = bulkPrice !== null && bulkPrice < product.retailPrice;
  const savings = hasBulkDiscount ? (product.retailPrice - displayPrice) * qty : 0;

  const avgRating = liveReviews.length
    ? liveReviews.reduce((s: number, r: ReviewItem) => s + r.rating, 0) / liveReviews.length
    : null;

  const handleAddToCart = () => {
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
      qty,
    });
    toast.success(`${product.name} × ${qty} added to cart!`);
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-indigo-600">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* ─── Image Gallery ────────────────────────────────── */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 aspect-square mb-4">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-3">
            {product.images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImage === i ? "border-indigo-500" : "border-slate-200"
                }`}
              >
                <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Product Details ──────────────────────────────── */}
        <div>
          <div className="mb-2">
            <span className="text-indigo-600 text-sm font-medium">{product.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{product.name}</h1>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={15}
                    className={n <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                {avgRating.toFixed(1)} ({product.reviews?.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3 mb-2">
            <span className="text-4xl font-bold text-slate-900">{formatCurrency(displayPrice)}</span>
            {hasBulkDiscount && (
              <span className="text-lg text-slate-400 line-through mb-1">
                {formatCurrency(product.retailPrice)}
              </span>
            )}
          </div>
          {hasBulkDiscount && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium mb-4">
              <CheckCircle2 size={14} />
              You save {formatCurrency(savings)} on this order
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-sm text-emerald-700 font-medium">
                  {product.stock < 20 ? `Only ${product.stock} left in stock!` : "In Stock"}
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-rose-500" />
                <span className="text-sm text-rose-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

          {/* SKU */}
          <p className="text-xs text-slate-400 mb-6">SKU: <span className="font-mono">{product.sku}</span></p>

          {/* Bulk Pricing Table */}
          {isBulkApproved && (
            <div className="mb-6">
              <BulkPricingTable tiers={product.bulkPricingTiers} currentQty={qty} />
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-40 transition-colors text-slate-700"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-slate-900">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-40 transition-colors text-slate-700"
              >
                +
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {isAdding ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </>
              )}
            </motion.button>
          </div>

          {/* Trust Signals */}
          <div className="border-t border-slate-100 pt-6 space-y-3">
            {[
              { icon: Shield, text: "Secure checkout with 256-bit SSL" },
              { icon: Truck, text: "2–5 business day nationwide delivery" },
              { icon: Package, text: "Verified, authentic products only" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-500">
                <Icon size={15} className="text-indigo-400 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews section — live from reviewStore (seeded + submitted) */}
      <section className="mt-16 border-t border-slate-100 pt-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Customer Reviews ({liveReviews.length})
          </h2>
          {avgRating && (
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={15} className={n <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                ))}
              </div>
              <span className="text-sm text-slate-600">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {liveReviews.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {liveReviews.map((review: ReviewItem) => (
              <div key={review.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{review.author}</p>
                    <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={13} className={n <= review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm mb-10">No reviews yet — be the first!</p>
        )}

        <ReviewForm productId={product.id} />
      </section>
    </div>
  );
}
