import { ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const CATEGORIES = [
  {
    name: "Pipe Tobacco",
    icon: "🪈",
    description: "Premium blends & accessories",
    color: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    href: "/products?category=Pipe+Tobacco",
  },
  {
    name: "Hookah & Shisha",
    icon: "💨",
    description: "Sets, shisha & charcoal",
    color: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    href: "/products?category=Hookah+%26+Shisha",
  },
  {
    name: "Cigars",
    icon: "🍂",
    description: "Handcrafted premium cigars",
    color: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    href: "/products?category=Cigars",
  },
  {
    name: "Vaping",
    icon: "⚡",
    description: "Devices, pods & e-liquids",
    color: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    href: "/products?category=Vaping",
  },
  {
    name: "Nicotine Products",
    icon: "🌿",
    description: "Pouches & tobacco-free",
    color: "from-teal-50 to-teal-100",
    border: "border-teal-200",
    href: "/products?category=Nicotine+Products",
  },
  {
    name: "Accessories",
    icon: "🔧",
    description: "Lighters, papers & more",
    color: "from-violet-50 to-violet-100",
    border: "border-violet-200",
    href: "/products?category=Accessories",
  },
];

export const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "256-bit SSL encryption. Your payment info is always safe.",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    desc: "2–5 business day delivery anywhere in South Africa.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day hassle-free returns on all unopened products.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    desc: "All products sourced from verified, reputable suppliers.",
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
];
