"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { allProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils/formatCurrency";


interface SearchCommandProps {
  onClose: () => void;
}

function SearchModal({ onClose }: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = query.trim().length < 2
    ? []
    : allProducts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t: string) => t.toLowerCase().includes(q))
        );
      }).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, SKUs, categories…"
            className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
            Esc
          </kbd>
        </div>

        <AnimatePresence mode="wait">
          {query.trim().length < 2 ? (
            <div className="px-4 py-8 text-center text-slate-400 text-sm">
              Type at least 2 characters to search
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-400 text-sm">
              No products found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.category} · {p.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(p.retailPrice)}</p>
                      {p.stock === 0 && (
                        <p className="text-xs text-rose-500">Out of stock</p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AnimatePresence>

        {results.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400">{results.length} result{results.length !== 1 ? "s" : ""}</p>
            <Link
              href={`/products?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all results →
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function SearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors text-sm"
        aria-label="Search products"
      >
        <Search size={15} />
        <span className="hidden sm:inline text-slate-400">Search…</span>
        <kbd className="hidden lg:inline-flex text-xs bg-white text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && <SearchModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
