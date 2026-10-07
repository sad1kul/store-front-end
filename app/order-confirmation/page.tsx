"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, Clock, Loader2, AlertCircle } from "lucide-react";
import { getOrderByIdApi } from "@/lib/api/orders";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    if (!orderId) {
      queueMicrotask(() => setError("No order reference was supplied."));
      return;
    }
    getOrderByIdApi(orderId)
      .then((response) => setOrder(response.data.order))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load the order"));
  }, []);

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertCircle className="mx-auto text-rose-500 mb-4" size={40} />
        <h1 className="text-xl font-bold mb-2">Order details unavailable</h1>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link href="/dashboard" className="text-indigo-600 font-semibold">View order history</Link>
      </div>
    );
  }

  if (!order) return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle2 size={56} className="text-emerald-600 mx-auto mb-5" />
      <h1 className="text-3xl font-bold text-slate-900 mb-3">Order request received</h1>
      <p className="text-slate-500 mb-8">This order is pending. It has not been marked as paid.</p>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-left space-y-4">
        <div className="flex justify-between"><span className="text-slate-500">Order reference</span><strong className="font-mono text-indigo-600">{order.id}</strong></div>
        <div className="flex justify-between"><span className="text-slate-500">Status</span><strong className="capitalize">{order.status}</strong></div>
        <div className="flex justify-between"><span className="text-slate-500">Total</span><strong>{formatCurrency(order.total)}</strong></div>
        <div className="flex justify-between"><span className="text-slate-500">Payment</span><strong className="text-amber-700">Not confirmed</strong></div>
        {order.estimatedDelivery && <div className="flex items-center gap-2 pt-4 border-t"><Clock size={15} /><span>Estimated delivery: {String(order.estimatedDelivery)}</span></div>}
      </div>
      <Link href="/products" className="mt-8 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl"><Package size={18} /> Continue shopping</Link>
    </div>
  );
}
