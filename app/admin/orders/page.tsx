"use client";

import { useState } from "react";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { allOrders } from "@/lib/mock-data";
import { Order, OrderItem } from "@/lib/types";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ORDER_STATUSES, OrderStatus } from "@/lib/constants";

export default function AdminOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>(allOrders);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((os) => os.map((o) => o.id === id ? { ...o, status } : o));
    toast.success(`Order ${id} status updated to ${status}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-slate-50 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 text-sm">{orders.length} orders total</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left w-8"></th>
                  <th className="px-4 py-3 text-left">Order #</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Customer</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-right hidden lg:table-cell">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3 text-slate-400">
                        {expanded === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-slate-900">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 hidden sm:table-cell">{order.customerName}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">{order.date}</td>
                      <td className="px-4 py-3 text-sm text-right text-slate-500 hidden lg:table-cell">{order.items.length}</td>
                      <td className="px-4 py-3 text-sm font-bold text-right text-slate-900">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expanded === order.id && (
                        <tr key={`${order.id}-details`}>
                          <td colSpan={8} className="px-0 py-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-indigo-50/40 border-t border-b border-indigo-100"
                            >
                              <div className="px-6 py-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Items</p>
                                <div className="space-y-2">
                                  {order.items.map((item: OrderItem) => (
                                    <div key={item.sku} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-400 font-mono text-xs">{item.sku}</span>
                                        <span className="text-slate-700">{item.productName}</span>
                                      </div>
                                      <div className="flex items-center gap-4 text-slate-600">
                                        <span>×{item.qty}</span>
                                        <span className="font-semibold text-slate-900">{formatCurrency(item.lineTotal ?? (item.unitPrice * item.qty))}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-indigo-100 flex justify-between text-sm font-semibold">
                                  <span className="text-slate-700">Delivery: {order.deliveryAddress}</span>
                                  <span className="text-slate-900">Total: {formatCurrency(order.total)}</span>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
