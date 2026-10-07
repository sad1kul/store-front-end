"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { ShoppingCart, Menu, X, LogOut, User, ChevronDown, Package, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import SearchCommand from "@/components/layout/SearchCommand";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { toast } from "sonner";

const navLinks = [
  { href: "/products", label: "Products" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, initAuth, sessionError } = useAuthStore();
  const getItemCount = useCartStore((s) => s.getItemCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const itemCount = getItemCount();
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  useEffect(() => {
    try { localStorage.removeItem("smoke-time-auth"); } catch { /* Storage may be disabled. */ }
    void initAuth().catch(() => undefined);
  }, [initAuth]);

  const signOut = () => {
    void logout().catch(() => toast.error("The server session could not be revoked. Please retry signing out."));
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
            <Package size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            Smoke<span className="text-indigo-600">Time</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-indigo-600",
                pathname === link.href ? "text-indigo-600" : "text-slate-600"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "bulk_buyer" && user.bulkStatus === "approved" && (
            <Link href="/dashboard" className={cn("text-sm font-medium transition-colors hover:text-indigo-600", pathname === "/dashboard" ? "text-indigo-600" : "text-slate-600")}>
              Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className={cn("text-sm font-medium transition-colors hover:text-indigo-600", pathname.startsWith("/admin") ? "text-indigo-600" : "text-slate-600")}>
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SearchCommand />
          <Link href="/wishlist" className="relative p-2 text-slate-600 hover:text-rose-500 transition-colors">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </motion.span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={28} height={28} unoptimized className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {user.role === "bulk_buyer" ? "Bulk Buyer" : user.role === "admin" ? "Admin" : "Retail"}
                </span>
                <ChevronDown size={14} className={cn("text-slate-500 transition-transform", dropdownOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {user.role === "bulk_buyer" ? "Bulk Buyer" : user.role === "admin" ? "Admin" : "Retail"}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link href="/account/security" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setDropdownOpen(false)}>
                        <User size={14} /> Account security
                      </Link>
                      {user.role === "bulk_buyer" && user.bulkStatus === "approved" && (
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setDropdownOpen(false)}>
                          <User size={14} /> Dashboard
                        </Link>
                      )}
                      {user.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setDropdownOpen(false)}>
                          <User size={14} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={signOut} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 transition-colors">Login</Link>
              <Link href="/register" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg transition-colors">Sign Up</Link>
            </div>
          )}

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {sessionError && <div role="alert" className="flex flex-wrap items-center justify-center gap-3 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        <span>{sessionError}</span>
        <button className="underline" onClick={() => void initAuth().catch(() => undefined)}>Retry connection</button>
        <button className="underline" onClick={signOut}>Retry sign out</button>
      </div>}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {user?.role === "bulk_buyer" && user.bulkStatus === "approved" && (
                <Link href="/dashboard" className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              )}
              {user?.role === "admin" && (
                <Link href="/admin" className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <div className="pt-2 border-t border-slate-100">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.name} width={24} height={24} unoptimized className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                        <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                        {user.role === "bulk_buyer" ? "Bulk Buyer" : user.role === "admin" ? "Admin" : "Retail"}
                      </span>
                    </div>
                    <Link href="/account/security" className="block py-2 text-sm text-indigo-600" onClick={() => setMenuOpen(false)}>Account security</Link>
                    <button onClick={signOut} className="flex items-center gap-2 py-2 text-sm font-medium text-rose-600">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link href="/login" className="text-sm font-medium text-slate-600" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link href="/register" className="text-sm font-semibold text-indigo-600" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
