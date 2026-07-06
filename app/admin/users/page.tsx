"use client";

import { useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import usersRaw from "@/lib/mock-data/users.json";
import { Search, Lock, Eye, UserX } from "lucide-react";
import { toast } from "sonner";

type RoleFilter = "All" | "retail" | "bulk_buyer" | "admin";

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState(usersRaw as any[]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");

  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }


  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const deactivate = (id: string) => {
    setUsers((us) => us.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
    toast.success("User status updated.");
  };

  const roleFilters: RoleFilter[] = ["All", "retail", "bulk_buyer", "admin"];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-slate-50 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 text-sm">{users.length} users registered</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            {roleFilters.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  roleFilter === r
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {r === "bulk_buyer" ? "Bulk Buyer" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Role</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                        {u.businessName && (
                          <p className="text-xs text-indigo-600">{u.businessName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <StatusBadge status={u.role} />
                    {u.bulkStatus && (
                      <StatusBadge status={u.bulkStatus} className="ml-1" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 hidden lg:table-cell">{u.joinedDate}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                        title="View User"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => deactivate(u.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-amber-50"
                        title={u.status === "active" ? "Deactivate" : "Reactivate"}
                      >
                        <UserX size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No users found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
