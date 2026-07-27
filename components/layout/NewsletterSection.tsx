"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! (demo mode)");
    setEmail("");
  };

  return (
    <section className="bg-slate-900 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail size={22} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Stay in the Know</h2>
        <p className="text-slate-400 mb-8">
          Get the latest product drops, wholesale deals, and exclusive offers straight to
          your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Subscribe
          </button>
        </form>
        <p className="text-slate-500 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
