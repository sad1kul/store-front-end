"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import usersData from "@/lib/mock-data/users.json";
import ordersData from "@/lib/mock-data/orders.json";
import bulkAppsData from "@/lib/mock-data/bulk-applications.json";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import {
  ChevronLeft, User, Mail, Calendar, Package, ShoppingBag,
  Building2, Lock, BadgeCheck, Clock, ExternalLink,
} from "lucide-react";

const allUsers = usersData as any[];
const allOrders = ordersData as any[];
const allApps = bulkAppsData as any[];

interface PageProps {
  params: { id: string };
}

export default function UserDetailPage({ params }: PageProps) {
  const { user: adminUser } = useAuthStore();

  if (!adminUser || adminUser.role !== "admin") {
    return <AdminGuard />;
  }

  const profile = allUsers.find((u) => u.id === params.id);
  if (!profile) notFound();

  const userOrders = allOrders.filter((o) => o.customerId === profile.id);
  const application = allApps.find((a) => a.email === profile.email);

  const totalSpent = userOrders.reduce((sum: number, o: any) => sum + o.total, 0);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 bg-slate-50 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/admin/users"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft size={16} /> All Users
            </Link>
          </div>

          {/* Profile header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
            <div className="flex items-start gap-4">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    profile.role === "admin" ? "bg-violet-100 text-violet-700"
                    : profile.role === "bulk_buyer" ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-600"
                  }`}>
                    {profile.role === "bulk_buyer" ? "Bulk Buyer" : profile.role === "admin" ? "Admin" : "Retail"}
                  </span>
                  {profile.status === "inactive" && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Deactivated</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1.5"><Mail size={13} />{profile.email}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} />Joined {new Date(profile.joinedDate).toLocaleDateString("en-ZA", { year: "numeric", month: "long" })}</span>
                </div>
                {profile.businessName && (
                  <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
                    <Building2 size={13} className="text-slate-400" />
                    {profile.businessName}
                    {profile.businessType && <span className="text-slate-400">· {profile.businessType}</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Stats row for bulk buyers */}
            {profile.role === "bulk_buyer" && (
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Total Orders</p>
                  <p className="text-xl font-bold text-slate-900">{userOrders.length}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-xs text-emerald-600 mb-1">Bulk Status</p>
                  <p className={`text-sm font-bold capitalize ${
                    profile.bulkStatus === "approved" ? "text-emerald-700" : profile.bulkStatus === "pending" ? "text-amber-600" : "text-rose-600"
                  }`}>
                    {profile.bulkStatus ?? "—"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Order history */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Order History</h2>
                <span className="text-xs text-slate-400">{userOrders.length} orders</span>
              </div>
              {userOrders.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No orders yet</div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {userOrders.map((order: any) => (
                    <li key={order.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50">
                      <ShoppingBag size={14} className="text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 font-mono">{order.id}</p>
                        <p className="text-xs text-slate-400">{order.date}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(order.total)}</p>
                      <StatusBadge status={order.status} />
                      <Link href={`/admin/orders/${order.id}`} className="text-slate-400 hover:text-indigo-600">
                        <ExternalLink size={13} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Wholesale application */}
            {(profile.role === "bulk_buyer" || application) && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900">Wholesale Application</h2>
                </div>
                {application ? (
                  <div className="p-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Business Name</span>
                      <span className="font-medium text-slate-900">{application.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Business Type</span>
                      <span className="font-medium text-slate-900">{application.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Order Value</span>
                      <span className="font-medium text-slate-900">{application.monthlyOrderValue}</span>
                    </div>
                    {application.shopAddress && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Shop Address</span>
                        <span className="font-medium text-slate-900 text-right max-w-[55%]">{application.shopAddress}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status</span>
                      <span className={`font-bold capitalize ${
                        application.status === "approved" ? "text-emerald-600"
                        : application.status === "pending" ? "text-amber-600"
                        : "text-rose-600"
                      }`}>
                        {application.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applied</span>
                      <span className="font-medium text-slate-900">{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString("en-ZA") : "—"}</span>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/admin/bulk-approvals`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <BadgeCheck size={13} /> Manage in Bulk Approvals
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">No application on file</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
