"use client";

import AdminSidebar from "@/components/layout/AdminSidebar";
import { Lock } from "lucide-react";

export default function AdminGuard() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-200">
            <Lock size={28} className="text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500">You need admin privileges to view this page.</p>
        </div>
      </main>
    </div>
  );
}
