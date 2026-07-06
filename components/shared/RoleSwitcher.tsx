"use client";

import { useAuthStore, UserRole } from "@/lib/store/authStore";
import { useState } from "react";
import { ChevronUp, Settings } from "lucide-react";

const roles: { value: UserRole; label: string; color: string; emoji: string }[] = [
  { value: "guest", label: "Guest", color: "bg-slate-500", emoji: "👤" },
  { value: "retail", label: "Retail User", color: "bg-emerald-500", emoji: "🛒" },
  { value: "bulk_buyer", label: "Bulk Buyer", color: "bg-violet-500", emoji: "📦" },
  { value: "admin", label: "Admin", color: "bg-indigo-500", emoji: "⚙️" },
];

export default function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { user, switchRole } = useAuthStore();
  const currentRole = user?.role ?? "guest";
  const current = roles.find((r) => r.value === currentRole) ?? roles[0];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 w-56 mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            DevTools — Role
          </p>
          <div className="flex flex-col gap-2">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => { switchRole(role.value); setOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${currentRole === role.value
                    ? `${role.color} text-white shadow-lg scale-[1.02]`
                    : "text-slate-300 hover:bg-slate-800"
                  }`}
              >
                <span className="text-base">{role.emoji}</span>
                <span>{role.label}</span>
                {currentRole === role.value && (
                  <span className="ml-auto text-xs opacity-80">Active</span>
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              Development only • Not in production
            </p>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-2xl text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${current.color}`}
        title="DevTools: Switch Role"
      >
        <Settings size={15} className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
        <span>{current.emoji} {current.label}</span>
        <ChevronUp size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
