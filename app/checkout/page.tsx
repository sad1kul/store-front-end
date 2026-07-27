"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData, SA_PROVINCES } from "@/lib/validations/checkoutSchema";
import { useCartStore } from "@/lib/store/cartStore";
import { createOrderApi } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Lock, CheckCircle2, ChevronRight,
  ArrowRight, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, serverValidatedCart, isValidating, validateWithServer, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "eft">("card");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>("");

  useEffect(() => {
    if (items.length > 0) {
      validateWithServer();
    }
  }, [items, validateWithServer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "card" },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!serverValidatedCart) {
      toast.error("Cart must be validated with the server before placing order.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrderApi({
        items: items.map((i) => ({ productId: i.id, qty: i.qty })),
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        deliveryAddress: `${data.address}, ${data.city}, ${data.province}, ${data.postalCode}`,
        total: serverValidatedCart.total, // Pass server-validated total for server verification
      });

      if (res.success && res.data?.order) {
        setPlacedOrderNumber(res.data.order.id);
        setShowSuccess(true);
        clearCart();
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
  }: {
    label: string;
    name: keyof CheckoutFormData;
    type?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
          errors[name] ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white"
        }`}
      />
      {errors[name] && (
        <p className="text-xs text-rose-500 mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <p className="text-slate-500 mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-indigo-600 font-semibold">← Browse Products</Link>
      </div>
    );
  }

  const isOrderButtonDisabled = isSubmitting || isValidating || !serverValidatedCart;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/cart" className="hover:text-indigo-600">Cart</Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium">Checkout</span>
      </nav>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ─── Checkout Form ─────────────────────────────── */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4 text-lg">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Full Name" name="fullName" placeholder="John Doe" />
                <InputField label="Email Address" name="email" type="email" placeholder="john@example.com" />
                <InputField label="Phone Number" name="phone" placeholder="083 123 4567" />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4 text-lg">Delivery Address</h2>
              <div className="space-y-4">
                <InputField label="Street Address" name="address" placeholder="12 Main Street, Apartment 3" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="City" name="city" placeholder="Johannesburg" />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Province</label>
                    <select
                      {...register("province")}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${errors.province ? "border-rose-300" : "border-slate-200"}`}
                    >
                      <option value="">Select province</option>
                      {SA_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {errors.province && <p className="text-xs text-rose-500 mt-1">{errors.province.message}</p>}
                  </div>
                  <InputField label="Postal Code" name="postalCode" placeholder="2001" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4 text-lg">Payment Method</h2>

              {/* Method Toggle */}
              <div className="flex gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                    paymentMethod === "card"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <CreditCard size={16} /> Credit / Debit Card
                </button>
                <div className="relative flex-1">
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-400 cursor-not-allowed"
                  >
                    Instant EFT
                  </button>
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Card Fields */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                    <Lock size={12} className="text-indigo-400" />
                    Demo only — no real payment processing
                  </div>
                  <InputField label="Card Number" name="cardNumber" placeholder="1234 5678 9012 3456" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Expiry Date" name="cardExpiry" placeholder="MM/YY" />
                    <InputField label="CVV" name="cardCvv" placeholder="123" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isOrderButtonDisabled}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : isValidating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Validating totals with server...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Place Order — {serverValidatedCart ? formatCurrency(serverValidatedCart.total) : "Calculating..."}
                </>
              )}
            </button>
          </form>
        </div>

        {/* ─── Order Summary ─────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-slate-900 mb-4 text-lg">Order Summary</h2>

            {isValidating ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Loader2 size={24} className="animate-spin mx-auto text-indigo-600" />
                <p className="text-xs">Fetching server-validated pricing...</p>
              </div>
            ) : serverValidatedCart ? (
              <>
                {/* Items */}
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {serverValidatedCart.items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty} {item.isBulkPriced && <span className="text-indigo-600 font-semibold">(Bulk)</span>}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 shrink-0">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(serverValidatedCart.subtotal)}</span>
                  </div>
                  {serverValidatedCart.bulkSavings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600">Bulk Savings</span>
                      <span className="font-medium text-emerald-600">−{formatCurrency(serverValidatedCart.bulkSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">VAT (15%)</span>
                    <span className="font-medium">{formatCurrency(serverValidatedCart.vat)}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between font-bold text-slate-900 text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(serverValidatedCart.total)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Server-calculated total (including 15% VAT)</p>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-rose-500 text-sm space-y-2">
                <AlertCircle size={24} className="mx-auto" />
                <p>Failed to validate cart with server.</p>
                <button
                  onClick={() => validateWithServer()}
                  className="text-xs text-indigo-600 underline font-semibold"
                >
                  Click to retry validation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Success Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed!</h2>
              <p className="text-slate-500 mb-4 text-sm">
                Thank you for your order. We&apos;ll send you a confirmation email shortly.
              </p>
              <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-slate-500 mb-1">Order Reference</p>
                <p className="text-lg font-bold text-indigo-600 font-mono">{placedOrderNumber}</p>
                <p className="text-xs text-slate-400 mt-1">Estimated delivery: 2–5 business days</p>
              </div>
              <Link
                href="/order-confirmation"
                onClick={() => setShowSuccess(false)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                View Order Details <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
