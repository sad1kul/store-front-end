"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getOrdersApi } from "@/lib/api/orders";
import { getProductsApi } from "@/lib/api/products";
import { Order, Product } from "@/lib/types";
import StatusBadge from "@/components/shared/StatusBadge";
import { Lock, TrendingUp, ShoppingBag, DollarSign, Tag, Plus, Trash2, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface QuickOrderRow { sku: string; qty: number; }

export default function DashboardPage() {
  const { user } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "bulk_buyer" && user.bulkStatus === "approved") {
      Promise.all([
        getOrdersApi().catch(() => ({ success: false, data: { orders: [] } })),
        getProductsApi().catch(() => ({ success: false, data: { products: [] } })),
      ]).then(([ordersRes, productsRes]) => {
        if (ordersRes.data) setMyOrders(ordersRes.data.orders);
        if (productsRes.data) setProductsList(productsRes.data.products);
        setIsLoading(false);
      });
    }
  }, [user]);

  // Access Control
  if (!user || user.role !== "bulk_buyer") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-4">This area is for approved bulk buyers only.</p>
          <Link href="/register/wholesale" className="text-indigo-600 font-semibold hover:text-indigo-700">
            Apply for a wholesale account →
          </Link>
        </div>
      </div>
    );
  }

  if (user.bulkStatus !== "approved") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Application Under Review</h2>
          <p className="text-slate-500 mb-4">
            Your bulk buyer application is currently <strong>pending review</strong>. You&apos;ll receive an email once approved.
          </p>
          <StatusBadge status="pending" />
        </div>
      </div>
    );
  }

  const [quickRows, setQuickRows] = useState<QuickOrderRow[]>([{ sku: "", qty: 1 }]);

  const addQuickRow = () => setQuickRows((r) => [...r, { sku: "", qty: 1 }]);
  const removeQuickRow = (i: number) => setQuickRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof QuickOrderRow, value: string | number) => {
    setQuickRows((rows) => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const addAllToCart = () => {
    let added = 0;
    quickRows.forEach((row) => {
      if (!row.sku) return;
      const product = productsList.find((p) => p.sku.toLowerCase() === row.sku.toLowerCase());
      if (product) {
        addItem({
          id: product.id, name: product.name, slug: product.slug, sku: product.sku,
          image: product.images[0] || "", retailPrice: product.retailPrice,
          bulkPricingTiers: product.bulkPricingTiers, unitPrice: product.bulkPricingTiers[0]?.price || product.retailPrice,
          isBulkPriced: true, qty: row.qty,
        });
        added++;
      }
    });
    if (added > 0) toast.success(`${added} item${added !== 1 ? "s" : ""} added to cart!`);
    else toast.error("No valid SKUs found. Check your SKU entries.");
  };

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: myOrders.length, color: "text-indigo-600", bg: "bg-indigo-100" },
    { icon: DollarSign, label: "Total Spent", value: formatCurrency(user.totalSpent ?? 0), color: "text-slate-700", bg: "bg-slate-100" },
    { icon: Tag, label: "Bulk Savings", value: formatCurrency(user.bulkSavings ?? 0), color: "text-emerald-600", bg: "bg-emerald-100" },
    { icon: TrendingUp, label: "Avg. Order", value: myOrders.length ? formatCurrency((user.totalSpent ?? 0) / myOrders.length) : "—", color: "text-violet-600", bg: "bg-violet-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img src={user.avatar || "https://placehold.co/100x100/7C3AED/FFFFFF?text=SD"} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white/30" />
            <div>
              <h1 className="text-xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
              <p className="text-indigo-200 text-sm">{user.businessName}</p>
            </div>
          </div>
        </div>
        <StatusBadge status="approved" className="!bg-white !text-emerald-700 !border-white" />
      </motion.div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-3 text-left">Order #</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 text-sm font-mono font-semibold text-slate-900">{order.id}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{order.date}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-right text-slate-900">{formatCurrency(order.total)}</td>
                          <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => window.open(`/admin/orders/${order.id}`, "_blank")}
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              <FileText size={12} /> View / Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Order Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-1">Quick Order</h2>
                <p className="text-xs text-slate-500 mb-4">Enter SKU codes to add directly to cart</p>

                <div className="space-y-2 mb-4">
                  {quickRows.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={row.sku}
                        onChange={(e) => updateRow(i, "sku", e.target.value.toUpperCase())}
                        placeholder="SKU (e.g. STS-001)"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => updateRow(i, "qty", Math.max(1, Number(e.target.value)))}
                        className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      {quickRows.length > 1 && (
                        <button onClick={() => removeQuickRow(i)} className="text-slate-400 hover:text-rose-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button onClick={addQuickRow} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-4 transition-colors">
                  <Plus size={14} /> Add another item
                </button>

                <button
                  onClick={addAllToCart}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Add All to Cart
                </button>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 font-semibold mb-2">Available SKUs:</p>
                  <div className="flex flex-wrap gap-1">
                    {productsList.slice(0, 8).map((p) => (
                      <span key={p.sku} className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {p.sku}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
