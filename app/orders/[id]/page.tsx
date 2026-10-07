"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { getOrderByIdApi } from "@/lib/api/orders";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import StatusBadge from "@/components/shared/StatusBadge";

export default function CustomerOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderByIdApi(id)
      .then((response) => setOrder(response.data.order))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load order"));
  }, [id]);

  if (error) return <div className="max-w-xl mx-auto py-20 text-center"><AlertCircle className="mx-auto text-rose-500 mb-3" /><p>{error}</p></div>;
  if (!order) return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/dashboard" className="text-sm text-indigo-600">← Back to dashboard</Link>
      <div className="mt-5 bg-white border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div><p className="text-xs text-slate-500">Order</p><h1 className="text-2xl font-bold font-mono">{order.id}</h1></div>
          <StatusBadge status={order.status} />
        </div>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="flex justify-between border-b pb-3">
              <div><p className="font-medium">{item.name || item.productName}</p><p className="text-xs text-slate-500">{item.sku} · Qty {item.qty}</p></div>
              <strong>{formatCurrency(item.lineTotal ?? item.unitPrice * item.qty)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>VAT</span><span>{formatCurrency(order.vat)}</span></div>
          <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        </div>
        <div className="mt-6 border-t pt-4"><p className="text-xs text-slate-500">Delivery address</p><p>{order.deliveryAddress}</p></div>
      </div>
    </div>
  );
}
