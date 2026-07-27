"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CheckSquare,
  ChevronRight,
  FileEdit,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { allApps } from "@/lib/mock-data";

const pendingCount = allApps.filter((a) => a.status === "pending").length;

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  {
    href: "/admin/bulk-approvals",
    label: "Bulk Approvals",
    icon: CheckSquare,
    badge: pendingCount,
  },
  { href: "/admin/content", label: "Content", icon: FileEdit },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-slate-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Package size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">SmokeTime</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}
