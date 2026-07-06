import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Clock } from "lucide-react";

export default function OrderConfirmationPage() {
  const orderNumber = "STS-847291";
  const today = new Date();
  const delivery = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);
  const deliveryStr = delivery.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-emerald-600" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-3">Order Confirmed! 🎉</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        Thank you for shopping with Smoke Time Store. Your order has been received and
        is being prepared for dispatch. A confirmation email will be sent shortly.
      </p>

      {/* Order Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-lg font-bold text-indigo-600 font-mono">{orderNumber}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Order Date</p>
            <p className="text-sm font-medium text-slate-900">
              {today.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              Paid ✓
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Order Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              Processing
            </span>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={15} className="text-indigo-400" />
            <span>Estimated delivery: <span className="font-semibold text-slate-900">{deliveryStr}</span></span>
          </div>
        </div>
      </div>

      {/* Order Steps */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto">
        {[
          { label: "Order Placed", done: true },
          { label: "Processing", done: true },
          { label: "Shipped", done: false },
          { label: "Delivered", done: false },
        ].map((step, i, arr) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className={`flex flex-col items-center gap-1 ${step.done ? "text-indigo-600" : "text-slate-300"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step.done ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 text-slate-400"}`}>
                {step.done ? "✓" : i + 1}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{step.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div className={`w-8 h-0.5 mb-4 ${step.done && arr[i + 1].done ? "bg-indigo-600" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
        >
          <Package size={18} /> Continue Shopping
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 transition-colors"
        >
          View Order History <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
