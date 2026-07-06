"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";
import productsData from "@/lib/mock-data/products.json";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const allProducts = productsData as any[];
const categories = ["All", ...Array.from(new Set(allProducts.map((p) => p.category)))];
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

function ProductListingContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ITEMS_PER_PAGE = 9;

  const filtered = useMemo(() => {
    let result = allProducts;
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    result = result.filter(
      (p) => p.retailPrice >= priceRange[0] && p.retailPrice <= priceRange[1]
    );
    if (inStockOnly) result = result.filter((p) => p.stock > 0);

    if (sort === "price_asc") result = [...result].sort((a, b) => a.retailPrice - b.retailPrice);
    else if (sort === "price_desc") result = [...result].sort((a, b) => b.retailPrice - a.retailPrice);
    else if (sort === "newest") result = [...result].reverse();

    return result;
  }, [selectedCategory, priceRange, inStockOnly, sort, search]);

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Category</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Price Range: R {priceRange[0]} – R {priceRange[1]}
        </h3>
        <input
          type="range"
          min={0}
          max={2000}
          step={50}
          value={priceRange[1]}
          onChange={(e) => { setPriceRange([0, Number(e.target.value)]); setPage(1); }}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>R 0</span>
          <span>R 2,000+</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-900">In Stock Only</label>
        <button
          onClick={() => { setInStockOnly((v) => !v); setPage(1); }}
          className={`w-11 h-6 rounded-full transition-colors relative ${inStockOnly ? "bg-indigo-600" : "bg-slate-200"}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${inStockOnly ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      <button
        onClick={() => { setSelectedCategory("All"); setPriceRange([0, 2000]); setInStockOnly(false); setSearch(""); setPage(1); }}
        className="w-full text-xs text-slate-500 hover:text-rose-500 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
        <p className="text-slate-500 mt-1">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
          onClick={() => setSidebarOpen(true)}
        >
          <SlidersHorizontal size={15} /> Filter
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <FilterSidebar />
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-6 overflow-y-auto lg:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-slate-900">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                </div>
                <FilterSidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1">
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg mb-2">No products found</p>
              <p className="text-slate-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {paginated.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i % 9) * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {hasMore && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Load More ({filtered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><ProductGridSkeleton /></div>}>
      <ProductListingContent />
    </Suspense>
  );
}
