"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldX,
  Building2,
  ArrowRight,
  CheckCircle2,
  LogIn,
  Info,
} from "lucide-react";

const perks = [
  "Tiered wholesale pricing — save up to 35% off retail",
  "Dedicated account manager for your business",
  "Priority dispatch & bulk order fulfilment",
  "Early access to new product launches",
  "Monthly invoice statements for your records",
];

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">

        {/* ── Blocked Banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Gradient top bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />

          <div className="p-8 sm:p-12">
            {/* Icon + Heading */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-3xl bg-rose-100 flex items-center justify-center">
                  <ShieldX size={36} className="text-rose-500" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-white text-xs font-black px-2 py-0.5 rounded-full">
                  B2B Only
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                Public Registration is Closed
              </h1>
              <p className="text-slate-500 leading-relaxed max-w-md">
                Smoke Time Store is a <strong className="text-slate-700">trade-only wholesale platform</strong>.
                We do not offer retail accounts to the general public — our platform
                is exclusively designed for <strong className="text-slate-700">registered businesses</strong>{" "}
                in the tobacco &amp; related goods industry.
              </p>
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex gap-3">
              <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Looking to buy as a regular customer?
                </p>
                <p className="text-sm text-amber-700">
                  Our products are sold exclusively in bulk quantities to verified
                  business owners. Retail customers can purchase our products from
                  your local licensed tobacco retailer.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-slate-400 font-medium">
                  Are you a business owner?
                </span>
              </div>
            </div>

            {/* Wholesale perks */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-indigo-600" />
                <h2 className="font-bold text-indigo-900 text-sm uppercase tracking-wider">
                  Wholesale Account Benefits
                </h2>
              </div>
              <ul className="space-y-2.5">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="text-indigo-600 shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-slate-700">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register/wholesale"
                className="flex-1 flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-indigo-200 text-sm"
              >
                <Building2 size={18} />
                Apply for a Wholesale Account
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-2xl transition-colors text-sm"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              Already applied?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Sign in here
              </Link>{" "}
              — approved accounts receive login credentials by email.
            </p>
          </div>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Applications are reviewed within <strong>1–2 business days</strong>. All
          applicants must be 18 years or older and hold a valid South African business.
        </p>
      </div>
    </div>
  );
}
