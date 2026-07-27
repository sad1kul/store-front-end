"use client";

import { useState, useEffect } from "react";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuthStore } from "@/lib/store/authStore";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getOrdersApi } from "@/lib/api/orders";
import { getProductsApi } from "@/lib/api/products";
import { getWholesaleApplicationsApi } from "@/lib/api/wholesale";
import { Order, Product, WholesaleApplication } from "@/lib/types";
import { BarChart2, ShoppingBag, Users, Package, Clock, AlertTriangle, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";

const revenueData = [
  { day: "Mon", revenue: 14500 },
  { day: "Tue", revenue: 22800 },
  { day: "Wed", revenue: 18400 },
  { day: "Thu", revenue: 31200 },
  { day: "Fri", revenue: 27600 },
  { day: "Sat", revenue: 42100 },
  { day: "Sun", revenue: 19800 },
];

export default function AdminPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [applications, setApplications] = useState<WholesaleApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      Promise.all([
        getOrdersApi().catch(() => ({ success: false, data: { orders: [] } })),
        getProductsApi().catch(() => ({ success: false, data: { products: [] } })),
        getWholesaleApplicationsApi().catch(() => ({ success: false, data: { applications: [] } })),
      ]).then(([ordersRes, productsRes, appsRes]) => {
        if (ordersRes.data) setOrders(ordersRes.data.orders);
        if (productsRes.data) setProducts(productsRes.data.products);
        if (appsRes.data) setApplications(appsRes.data.applications);
        setIsLoading(false);
      });
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingApprovals = applications.filter((a) => a.status === "pending").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing");
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 15);
  const todayOrders = orders.length;

  const topProducts = products.slice(0, 5).map((p, i) => ({
    ...p,
    sales: [87, 65, 54, 43, 38][i] || 10,
    revenue: ([87, 65, 54, 43, 38][i] || 10) * p.retailPrice,
  }));

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-slate-50 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of your store performance</p>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center items-center">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={BarChart2}
                subtitle="All time" trend={{ value: 12.4, label: "vs last month" }}
                colorClass="text-indigo-600" iconBg="bg-indigo-100" />
              <StatsCard title="Total Orders" value={todayOrders} icon={ShoppingBag}
                subtitle="Active orders" trend={{ value: 33, label: "vs yesterday" }}
                colorClass="text-emerald-600" iconBg="bg-emerald-100" />
              <StatsCard title="Pending Approvals" value={pendingApprovals} icon={Clock}
                subtitle="Bulk buyer applications" colorClass="text-amber-600" iconBg="bg-amber-100" />
              <StatsCard title="Total Products" value={products.length} icon={Package}
                subtitle="Active listings" colorClass="text-violet-600" iconBg="bg-violet-100" />
            </div>

            <div className="grid xl:grid-cols-3 gap-6 mb-6">
              {/* Revenue Chart */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Revenue — Last 7 Days</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-900">Recent Orders</h2>
                  <Link href="/admin/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 font-mono">{order.id}</p>
                        <p className="text-xs text-slate-400">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{formatCurrency(order.total)}</p>
                        <StatusBadge status={order.status} className="text-[10px] px-1.5 py-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Top Products</h2>
                <Link href="/admin/products" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                  Manage products →
                </Link>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">SKU</th>
                    <th className="px-4 py-3 text-right">Units Sold</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((p, i) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-sm font-bold w-5">#{i + 1}</span>
                          <img src={p.images[0] || ""} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-sm font-medium text-slate-900 line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-500 hidden md:table-cell">{p.sku}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-slate-900">{p.sales}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-indigo-600">{formatCurrency(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Low Stock + Pending Actions */}
            <div className="grid xl:grid-cols-2 gap-6 mt-6">
              {/* Low Stock */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <h2 className="font-bold text-slate-900">Low Stock Alert</h2>
                  </div>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {lowStockProducts.length} items
                  </span>
                </div>
                {lowStockProducts.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">All products well stocked</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-50">
                    {lowStockProducts.map((p: Product) => (
                      <li key={p.id} className="flex items-center gap-3 px-6 py-3">
                        <img src={p.images[0] || ""} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs font-mono text-slate-400">{p.sku}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          p.stock <= 5 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {p.stock} left
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Pending Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-indigo-500" />
                    <h2 className="font-bold text-slate-900">Pending Actions</h2>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <Link
                    href="/admin/bulk-approvals"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                        <Users size={14} className="text-amber-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          {pendingApprovals} wholesale application{pendingApprovals !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-amber-600">awaiting review</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-amber-500" />
                  </Link>

                  <Link
                    href="/admin/orders"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-200 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={14} className="text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">
                          {pendingOrders.length} order{pendingOrders.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-indigo-600">pending or in processing</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-indigo-500" />
                  </Link>

                  {pendingApprovals === 0 && pendingOrders.length === 0 && (
                    <div className="text-center py-4">
                      <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">All caught up — nothing pending</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
