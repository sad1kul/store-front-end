import { formatCurrency } from "@/lib/utils/formatCurrency";

interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

interface BulkPricingTableProps {
  tiers: BulkPricingTier[];
  currentQty?: number;
}

export default function BulkPricingTable({ tiers, currentQty = 1 }: BulkPricingTableProps) {
  return (
    <div className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50">
      <div className="bg-emerald-600 px-4 py-2.5 flex items-center gap-2">
        <span className="text-white text-sm font-semibold">📦 Bulk Pricing Tiers</span>
        <span className="text-emerald-200 text-xs">(Approved Wholesale Only)</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-emerald-200">
            <th className="px-4 py-2 text-left text-xs font-semibold text-emerald-800">Quantity</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-emerald-800">Unit Price</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-emerald-800">Savings</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => {
            const isActive = currentQty >= tier.minQty && (tier.maxQty === null || currentQty <= tier.maxQty);
            const retailPrice = tiers[0].price;
            const savings = ((retailPrice - tier.price) / retailPrice) * 100;
            return (
              <tr
                key={i}
                className={`border-b border-emerald-100 last:border-0 transition-colors ${
                  isActive ? "bg-emerald-100" : "bg-white/60"
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {isActive && <span className="mr-1.5 text-emerald-600">▶</span>}
                  {tier.minQty}
                  {tier.maxQty !== null ? `–${tier.maxQty}` : "+"} units
                </td>
                <td className="px-4 py-2.5 font-semibold text-slate-900">{formatCurrency(tier.price)}</td>
                <td className="px-4 py-2.5">
                  {i === 0 ? (
                    <span className="text-slate-400 text-xs">Standard</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold text-xs">
                      Save {savings.toFixed(0)}%
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
