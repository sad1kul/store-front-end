"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/authSchema";
import { useAuthStore } from "@/lib/store/authStore";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError("");
    await new Promise((r) => setTimeout(r, 400));
    const result = await login(data.email, data.password);
    setIsLoading(false);
    if (result.success) {
      router.push("/");
    } else {
      setAuthError(result.error ?? "Login failed");
    }
  };

  // Demo accounts helper
  const demoAccounts = [
    { label: "Admin", email: "admin@smoketimestore.co.za", pass: "admin123" },
    { label: "Bulk Buyer", email: "sipho@smokeworld.co.za", pass: "bulk123" },
    { label: "Retail", email: "thabo@example.co.za", pass: "user123" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your Smoke Time Store account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Demo Accounts */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-indigo-700 mb-2 uppercase tracking-wider">Demo Accounts</p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={async () => {
                    await login(a.email, a.pass);
                    router.push("/");
                  }}
                  className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.co.za"
                {...register("email")}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-rose-300" : "border-slate-200"}`}
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full px-3.5 py-2.5 pr-10 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? "border-rose-300" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
            </div>

            {authError && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign up
            </Link>
          </div>

          <div className="mt-3 text-center">
            <Link href="/register/wholesale" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">
              Applying as a bulk buyer? →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
