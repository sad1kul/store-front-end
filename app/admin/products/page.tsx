"use client";

import { useState } from "react";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { allProducts } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, X, Lock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    toast.success("Product deleted.");
    setDeleteId(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-slate-50 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-500 text-sm">{products.length} products total</p>
          </div>
          <button
            onClick={() => { setEditProduct(null); setModal("add"); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">SKU</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-500 hidden sm:table-cell">{product.sku}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-slate-900">{formatCurrency(product.retailPrice)}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className={`text-sm font-medium ${product.stock < 20 ? "text-amber-600" : "text-emerald-600"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setEditProduct(product); setModal("edit"); }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mb-10"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">{modal === "add" ? "Add New Product" : "Edit Product"}</h3>
                  <button onClick={() => setModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: "Product Name", placeholder: "e.g. Premium Pipe Tobacco", defaultValue: editProduct?.name },
                    { label: "Slug", placeholder: "e.g. premium-pipe-tobacco", defaultValue: editProduct?.slug },
                    { label: "SKU", placeholder: "e.g. STS-013", defaultValue: editProduct?.sku },
                    { label: "Category", placeholder: "e.g. Pipe Tobacco", defaultValue: editProduct?.category },
                  ].map(({ label, placeholder, defaultValue }) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                      <input
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Retail Price (ZAR)</label>
                      <input type="number" defaultValue={editProduct?.retailPrice} placeholder="0.00" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock Quantity</label>
                      <input type="number" defaultValue={editProduct?.stock} placeholder="0" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea rows={3} defaultValue={editProduct?.description} placeholder="Product description..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Images (UI Only)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-sm text-slate-400 hover:border-indigo-300 transition-colors cursor-pointer">
                      Click to upload images (demo only)
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                  <button
                    onClick={() => { toast.success(modal === "add" ? "Product added!" : "Product updated!"); setModal(null); }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-semibold text-white transition-colors"
                  >
                    {modal === "add" ? "Add Product" : "Save Changes"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirm */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={22} className="text-rose-500" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Delete Product?</h3>
                <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                  <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm font-semibold text-white transition-colors">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
