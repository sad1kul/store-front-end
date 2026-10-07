"use client";

import { useAuthStore, UserRole } from "@/lib/store/authStore";
import { useState } from "react";
import { ChevronUp, User, ShieldCheck, Package, ShoppingCart, LogOut, ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

const roleDisplayMap: Record<UserRole, { label: string; bg: string; badgeBg: string; icon: LucideIcon }> = {
  guest: {
    label: "Guest",
    bg: "bg-slate-800",
    badgeBg: "bg-slate-700 text-slate-300",
    icon: User,
  },
  retail: {
    label: "Retail User",
    bg: "bg-emerald-600",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    icon: ShoppingCart,
  },
  bulk_buyer: {
    label: "Bulk Buyer",
    bg: "bg-violet-600",
    badgeBg: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
    icon: Package,
  },
  admin: {
    label: "Admin",
    bg: "bg-indigo-600",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    icon: ShieldCheck,
  },
};

export default function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const currentRole: UserRole = user?.role ?? "guest";
  const roleInfo = roleDisplayMap[currentRole] ?? roleDisplayMap.guest;
  const RoleIcon = roleInfo.icon;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 w-64 mb-2 text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Current Session
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${roleInfo.badgeBg}`}>
              {roleInfo.label}
            </span>
          </div>

          <div className="py-3 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${roleInfo.bg} text-white shadow-md`}>
              <RoleIcon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {isAuthenticated && user ? user.name : "Guest User"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {isAuthenticated && user ? user.email : "Not signed in"}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Role:</span>
                <span className="text-xs font-semibold text-white">{roleInfo.label}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 transition-colors"
                  >
                    <span>Admin Panel</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                )}
                {user.role === "bulk_buyer" && user.bulkStatus === "approved" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 transition-colors"
                  >
                    <span>Wholesale Dashboard</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await logout().catch(() => undefined);
                    setOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 border border-rose-900/40 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md"
              >
                <span>Sign In</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-white text-sm font-medium transition-all hover:scale-105 active:scale-95 ${roleInfo.bg}`}
        title={isAuthenticated && user ? `Logged in as ${user.name} (${roleInfo.label})` : "Guest"}
      >
        <RoleIcon size={16} />
        <span className="font-semibold">
          {isAuthenticated && user ? (
            <>
              <span className="max-w-[110px] truncate inline-block align-bottom">{user.name.split(" ")[0]}</span>
              <span className="opacity-80 font-normal ml-1">({roleInfo.label})</span>
            </>
          ) : (
            "Guest"
          )}
        </span>
        <ChevronUp size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
