"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import { getOrderByIdApi, updateOrderStatusApi } from "@/lib/api/orders";
import { Order, OrderItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { ORDER_STATUSES, OrderStatus } from "@/lib/constants";
import {
  ChevronLeft, Package, Calendar, Printer,
  MapPin, ChevronDown, Truck, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      getOrderByIdApi(params.id)
        .then((res) => {
          if (res.success && res.data?.order) {
            setOrder(res.data.order);
            setStatus(res.data.order.status);
            setAdminNotes(res.data.order.adminNotes || "");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, params.id]);

  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 bg-slate-50 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
          <Link href="/admin/orders" className="text-indigo-600 font-semibold">← Back to Orders</Link>
        </main>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      const res = await updateOrderStatusApi(order.id, newStatus);
      if (res.success) {
        setStatus(newStatus);
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 bg-slate-50 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft size={16} /> All Orders
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900 font-mono">{order.id}</h1>
                  {order.isBulkOrder && (
                    <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      <Package size={10} /> Bulk Order
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Calendar size={13} />
                  Placed on {new Date(order.date).toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors print:hidden"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Left — line items + totals */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900">Order Items</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item: OrderItem, idx: number) => (
                      <tr key={item.productId || idx}>
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-900">{item.productName || item.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(item.lineTotal ?? (item.unitPrice * item.qty))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>VAT (15%)</span>
                    <span>{formatCurrency(order.vat)}</span>
                  </div>
                  {order.bulkSavings > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Bulk Savings</span>
                      <span>−{formatCurrency(order.bulkSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 text-base pt-1.5 border-t border-slate-200">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — customer + status + delivery */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-bold text-slate-900 mb-4">Customer</h2>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                    {order.customerName ? order.customerName[0] : "C"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600 mt-4">
                  <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs leading-relaxed">{order.deliveryAddress}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-bold text-slate-900 mb-3">Update Status</h2>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none cursor-pointer"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-slate-50 rounded-xl">
                  <StatusBadge status={status} />
                </div>
                {order.estimatedDelivery && (
                  <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                    <Truck size={11} />
                    Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-ZA")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
