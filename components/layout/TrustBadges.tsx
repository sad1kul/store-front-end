"use client";

import { motion } from "framer-motion";
import { TRUST_BADGES } from "@/lib/constants";

export default function TrustBadges() {
  return (
    <section className="bg-white py-20 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Shop With Us?</h2>
          <p className="text-slate-500">We&apos;re committed to quality, security, and service</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 ${badge.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <badge.icon size={26} className={badge.color} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{badge.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
