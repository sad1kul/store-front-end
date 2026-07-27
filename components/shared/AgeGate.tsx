"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "sts_age_verified";

export default function AgeGate() {
  const [state, setState] = useState<"hidden" | "gate" | "denied">("hidden");

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      queueMicrotask(() => setState("gate"));
    }
  }, []);

  const confirm = () => {
    sessionStorage.setItem(STORAGE_KEY, "yes");
    setState("hidden");
  };

  const deny = () => {
    setState("denied");
  };

  return (
    <AnimatePresence>
      {state !== "hidden" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 24 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600" />

            <div className="p-8">
              {state === "gate" ? (
                <>
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={30} className="text-indigo-600" />
                  </div>

                  <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-2">
                    Age Verification Required
                  </h1>
                  <p className="text-slate-500 text-sm text-center mb-1 leading-relaxed">
                    Smoke Time Store sells tobacco and nicotine products.
                  </p>
                  <p className="text-slate-500 text-sm text-center mb-8 leading-relaxed">
                    By entering this site you confirm that you are{" "}
                    <strong className="text-slate-700">18 years of age or older</strong> and
                    agree to our terms of use.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={confirm}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-sm"
                    >
                      ✓ I am 18 or older — Enter Site
                    </button>
                    <button
                      onClick={deny}
                      className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-xl transition-colors text-sm"
                    >
                      I am under 18
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 text-center mt-6">
                    This site is intended for adults 18+ only in compliance with South
                    African tobacco legislation.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={30} className="text-amber-500" />
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900 text-center mb-3">
                    Access Restricted
                  </h2>
                  <p className="text-slate-500 text-sm text-center leading-relaxed mb-6">
                    We&apos;re sorry, but you must be 18 years or older to access Smoke Time
                    Store. This site sells tobacco and nicotine products which are legally
                    restricted to adults only.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <p className="text-sm font-semibold text-amber-800">
                      🚫 Entry not permitted
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Please come back when you are of legal age.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
