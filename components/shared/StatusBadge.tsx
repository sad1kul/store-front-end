"use client";

import { cn } from "@/lib/utils/cn";

type StatusType = "pending" | "approved" | "rejected" | "active" | "inactive" |
  "delivered" | "shipped" | "processing" | "cancelled" | "admin" | "retail" | "bulk_buyer";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Approved ✓", classes: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", classes: "bg-rose-100 text-rose-700 border-rose-200" },
  active: { label: "Active", classes: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", classes: "bg-slate-100 text-slate-600 border-slate-200" },
  delivered: { label: "Delivered", classes: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  shipped: { label: "Shipped", classes: "bg-blue-100 text-blue-700 border-blue-200" },
  processing: { label: "Processing", classes: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  cancelled: { label: "Cancelled", classes: "bg-rose-100 text-rose-700 border-rose-200" },
  admin: { label: "Admin", classes: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  retail: { label: "Retail", classes: "bg-sky-100 text-sky-700 border-sky-200" },
  bulk_buyer: { label: "Bulk Buyer", classes: "bg-violet-100 text-violet-700 border-violet-200" },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    classes: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", config.classes, className)}>
      {config.label}
    </span>
  );
}
