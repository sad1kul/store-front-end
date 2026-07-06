"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import ordersData from "@/lib/mock-data/orders.json";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { ORDER_STATUSES } from "@/lib/constants";
import {
  ChevronLeft, Package, User, MapPin, Calendar, Printer,
  CheckCircle2, Clock, Truck, XCircle, Lock, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

const allOrders = ordersData as any[];

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const { user } = useAuthStore();
  const order = allOrders.find((o) => o.id === params.id);

  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }

  if (!order) notFound();

  const [status, setStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes ?? "");

  const saveNotes = () => {
    toast.success("Admin notes saved");
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
                    {order.items.map((item: any) => (
                      <tr key={item.productId}>
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-900">{item.productName}</p>
                          <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(item.lineTotal)}</td>
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

              {/* Admin notes */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-bold text-slate-900 mb-3">Admin Notes</h2>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Add internal notes about this order…"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <button
                  onClick={saveNotes}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Right — customer + status + delivery */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-bold text-slate-900 mb-4">Customer</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                    {order.customerName[0]}
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
                    onChange={(e) => {
                      setStatus(e.target.value);
                      toast.success(`Status updated to ${e.target.value}`);
                    }}
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
