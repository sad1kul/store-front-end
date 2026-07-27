"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartItem({ item }: { item: ReturnType<typeof useCartStore.getState>["items"][0] }) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 py-4 border-b border-slate-100 last:border-0"
    >
      {/* Image */}
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg border border-slate-100"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.slug}`}>
          <h3 className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {item.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">SKU: {item.sku}</p>
        {item.isBulkPriced && (
          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            Bulk Price Applied
          </span>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Qty Stepper */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => updateQty(item.id, item.qty - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-slate-600"
            >
              <Minus size={13} />
            </button>
            <span className="text-sm font-semibold text-slate-900 w-8 text-center">
              {item.qty}
            </span>
            <button
              onClick={() => updateQty(item.id, item.qty + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-slate-600"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{formatCurrency(item.unitPrice * item.qty)}</p>
            {item.qty > 1 && (
              <p className="text-xs text-slate-400">{formatCurrency(item.unitPrice)} each</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-2 text-slate-400 hover:text-rose-500 transition-colors self-start"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
