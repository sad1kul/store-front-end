"use client";

import { useState } from "react";
import { Star, Send, User } from "lucide-react";
import { useReviewStore } from "@/lib/store/reviewStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Props {
  productId: string;
}

export default function ReviewForm({ productId }: Props) {
  const addReview = useReviewStore((s) => s.addReview);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    if (!author.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    addReview({ productId, author: author.trim(), rating, comment: comment.trim() });
    toast.success("Review submitted — thank you!");
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"
      >
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-semibold text-emerald-800">Thanks for your review!</p>
        <p className="text-sm text-emerald-600 mt-1">
          Your feedback helps other customers make great choices.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setRating(0);
            setAuthor("");
            setComment("");
          }}
          className="mt-4 text-xs text-emerald-700 underline"
        >
          Write another review
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Your Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  size={26}
                  className={
                    n <= (hover || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  }
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-slate-500 self-center">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
          <div className="relative">
            <User
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. James M."
              className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience with this product…"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">{comment.length} characters</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          <Send size={15} />
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
