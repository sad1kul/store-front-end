"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import CartItem from "@/components/cart/CartItem";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Tag, Package, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CartPage() {
  const { items, serverValidatedCart, isValidating, validateWithServer, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const isBulkApproved = user?.role === "bulk_buyer" && user.bulkStatus === "approved";

  useEffect(() => {
    if (items.length > 0) {
      validateWithServer();
    }
  }, [items, validateWithServer]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={36} className="text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven&apos;t added anything yet. Let&apos;s change that!</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
        >
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const subtotal = serverValidatedCart?.subtotal || items.reduce((s, i) => s + (i.unitPrice ?? i.retailPrice) * i.qty, 0);
  const vat = serverValidatedCart?.vat || subtotal * 0.15;
  const total = serverValidatedCart?.total || subtotal * 1.15;
  const savings = serverValidatedCart?.bulkSavings || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-rose-500 hover:text-rose-600 transition-colors font-medium">
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Continue Shopping */}
          <div className="mt-4">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h2>

            {/* Bulk Savings Banner */}
            {isBulkApproved && savings > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-start gap-2"
              >
                <Tag size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Bulk Pricing Applied!</p>
                  <p className="text-xs text-emerald-600">You saved {formatCurrency(savings)} with bulk pricing</p>
                </div>
              </motion.div>
            )}

            {isValidating ? (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <Loader2 size={24} className="animate-spin mx-auto text-indigo-600" />
                <p className="text-xs">Validating totals with server...</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                    <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">VAT (15%)</span>
                    <span className="font-medium text-slate-900">{formatCurrency(vat)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Delivery</span>
                    <span className="text-emerald-600 font-medium text-xs">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-xl text-slate-900">{formatCurrency(total)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Incl. VAT (Server Validated)</p>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              </>
            )}

            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-slate-400">
              <Package size={13} />
              Secure 256-bit SSL checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
