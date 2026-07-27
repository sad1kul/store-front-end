"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import { getUserByIdApi } from "@/lib/api/users";
import { UserAccount } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import {
  ChevronLeft, Mail, Calendar, Building2, BadgeCheck, Loader2,
} from "lucide-react";

interface PageProps {
  params: { id: string };
}

export default function UserDetailPage({ params }: PageProps) {
  const { user: adminUser } = useAuthStore();
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (adminUser?.role === "admin") {
      getUserByIdApi(params.id)
        .then((res) => {
          if (res.success && res.data?.user) {
            setProfile(res.data.user);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [adminUser, params.id]);

  if (!adminUser || adminUser.role !== "admin") {
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

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">User Not Found</h2>
          <Link href="/admin/users" className="text-indigo-600 font-semibold">← Back to Users</Link>
        </main>
      </div>
    );
  }

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
                src={profile.avatar || "https://placehold.co/100x100/10B981/FFFFFF?text=U"}
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
                  <span className="flex items-center gap-1.5"><Calendar size={13} />Joined {profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString("en-ZA", { year: "numeric", month: "long" }) : "N/A"}</span>
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
                  <p className="text-xl font-bold text-slate-900">{profile.totalOrders || 0}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(profile.totalSpent || 0)}</p>
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
        </div>
      </main>
    </div>
  );
}
