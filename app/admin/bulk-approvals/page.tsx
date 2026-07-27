"use client";

import { useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/lib/store/authStore";
import bulkAppsRaw from "@/lib/mock-data/bulk-applications.json";
import {
  CheckCircle, XCircle, Eye, Lock, X, Building2, Calendar,
  Phone, Mail, FileText, MapPin, Camera, AlertCircle,
  Send, Bell, Clock, UserCheck, BadgeX, ChevronDown, ChevronUp,
  Smartphone, Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";


type AppStatus = "pending" | "approved" | "rejected";

interface Application {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  cellphone?: string;
  businessRegistration: string;
  businessType: string;
  monthlyOrderValue: string;
  shopAddress?: string;
  shopCity?: string;
  shopProvince?: string;
  yearsInBusiness?: string;
  shopPhotos?: string[];
  status: AppStatus;
  appliedDate: string;
  notes?: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  adminNotes?: string;
}


function EmailPreviewModal({
  type, app, reason, onClose,
}: {
  type: "approval" | "rejection";
  app: Application;
  reason?: string;
  onClose: () => void;
}) {
  const isApproval = type === "approval";
  const tempPassword = `STS${Math.random().toString(36).slice(2, 8).toUpperCase()}#`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between ${isApproval ? "bg-emerald-600" : "bg-rose-500"}`}>
          <div className="flex items-center gap-2 text-white">
            <Send size={16} />
            <span className="font-bold text-sm">Email Preview — {isApproval ? "Approval" : "Rejection"} Notification</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Email mockup */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs">
            <div className="space-y-1 text-slate-500 mb-4 pb-4 border-b border-slate-200">
              <p><strong>To:</strong> {app.email}</p>
              <p><strong>From:</strong> no-reply@smoketimestore.co.za</p>
              <p><strong>Subject:</strong> {isApproval
                ? `🎉 Wholesale Application Approved — Welcome to Smoke Time Store!`
                : `Your Smoke Time Store Application — Update Required`}
              </p>
            </div>

            <div className="font-sans text-slate-800 space-y-4">
              <p className="text-base font-bold">{isApproval ? "🎉" : "📋"} Dear {app.ownerName},</p>

              {isApproval ? (
                <>
                  <p>We are thrilled to inform you that your wholesale account application for <strong>{app.businessName}</strong> has been <span className="text-emerald-600 font-bold">approved</span>!</p>
                  <p>You now have access to Smoke Time Store's exclusive bulk pricing tiers. Here are your login credentials:</p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-3">
                    <p className="text-sm font-semibold text-emerald-800 mb-2">🔐 Your Login Credentials</p>
                    <p><strong>Username / Email:</strong> {app.email}</p>
                    <p><strong>Temporary Password:</strong> <code className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">{tempPassword}</code></p>
                    <p className="text-xs text-emerald-600 mt-2">⚠️ Please change your password on first login for security.</p>
                  </div>
                  <p>To get started:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Visit <strong>smoketimestore.co.za/login</strong></li>
                    <li>Enter your email and temporary password</li>
                    <li>Set a new password when prompted</li>
                    <li>Browse our product catalogue with your wholesale pricing</li>
                  </ol>
                  <p className="text-sm text-slate-500">Your account has been assigned a <strong>Bulk Buyer</strong> role with immediate access to all pricing tiers.</p>
                </>
              ) : (
                <>
                  <p>Thank you for applying for a wholesale account with Smoke Time Store. After careful review, we are unable to approve your application for <strong>{app.businessName}</strong> at this time.</p>
                  {reason && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 my-3">
                      <p className="text-sm font-semibold text-rose-700 mb-1">📋 Reason for Rejection:</p>
                      <p className="text-sm text-rose-800">{reason}</p>
                    </div>
                  )}
                  <p>You are welcome to re-apply once the issues listed above have been resolved. To re-apply or to appeal this decision, please contact us at:</p>
                  <p><strong>📧</strong> wholesale@smoketimestore.co.za</p>
                  <p><strong>📞</strong> 011 123 4567 (Mon–Fri, 8am–5pm)</p>
                </>
              )}

              <p className="text-slate-500 text-xs border-t border-slate-200 pt-3 mt-4">
                This is an automated notification from Smoke Time Store. Please do not reply directly to this email.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Info size={12} className="text-amber-500 shrink-0" />
            This is a preview of the email that would be sent. In production, this would be delivered via your email service provider.
          </div>
        </div>

        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors">
            Close Preview
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


function RejectModal({
  app, onConfirm, onClose,
}: {
  app: Application;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const PRESET_REASONS = [
    "Could not verify the business registration details provided.",
    "Shop photos were missing, unclear, or do not match the declared address.",
    "Business address could not be verified through available records.",
    "The business type does not align with our wholesale requirements.",
    "Insufficient information provided — please re-apply with complete documentation.",
    "Application contained inconsistent or potentially inaccurate information.",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          <div className="px-6 py-4 bg-rose-500 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <BadgeX size={18} />
              <h3 className="font-bold">Reject Application</h3>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white"><X size={18} /></button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 text-sm">
              <p className="font-semibold text-slate-900">{app.businessName}</p>
              <p className="text-slate-500">{app.ownerName} · {app.email}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rejection Reason
                <span className="text-slate-400 font-normal ml-1">(optional but recommended)</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                A clear reason helps the applicant understand what to fix for a re-application,
                and protects Smoke Time Store from disputes.
              </p>

              {/* Preset reasons */}
              <div className="space-y-1.5 mb-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Quick select:</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                        reason === r
                          ? "bg-rose-100 border-rose-400 text-rose-700 font-medium"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {r.slice(0, 50)}{r.length > 50 ? "…" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Or type a custom rejection reason… This will be included in the email sent to the applicant."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">{reason.length} characters</p>
            </div>

            <button
              type="button"
              onClick={() => setShowEmailPreview(true)}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              <Send size={12} /> Preview rejection email
            </button>

            <div className="flex gap-3 pt-2">
              <button onClick={onClose}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => onConfirm(reason)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm font-bold text-white transition-colors"
              >
                <XCircle size={15} /> Confirm Rejection &amp; Send Email
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showEmailPreview && (
          <EmailPreviewModal
            type="rejection"
            app={app}
            reason={reason}
            onClose={() => setShowEmailPreview(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}


function ApplicationDrawer({
  app, onApprove, onReject, onClose,
}: {
  app: Application;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}) {
  const [showEmailPreview, setShowEmailPreview] = useState<"approval" | "rejection" | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // Mock shop photos for demo
  const mockPhotos = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1604719312566-8912e9667d9f?w=400&h=300&fit=crop",
  ];
  const photos = app.shopPhotos ?? mockPhotos;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white z-50 overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-slate-900">Application Review</h3>
            <p className="text-xs text-slate-400">{app.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5">
          {/* Status banner */}
          <div className={`flex items-center justify-between p-3 rounded-xl border ${
            app.status === "pending" ? "bg-amber-50 border-amber-200" :
            app.status === "approved" ? "bg-emerald-50 border-emerald-200" :
            "bg-rose-50 border-rose-200"
          }`}>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Current Status</p>
              <StatusBadge status={app.status} />
            </div>
            {app.status === "pending" && (
              <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                <Bell size={13} />
                Awaiting review
              </div>
            )}
          </div>

          {/* Shop Photos */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Camera size={15} className="text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-800">Shop Photos ({photos.length})</h4>
            </div>
            {photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxPhoto(photo)}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-indigo-400 transition-colors group"
                  >
                    <img src={photo} alt={`Shop ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Main</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center text-slate-400 text-sm">
                <Camera size={20} className="mx-auto mb-1 opacity-40" />
                No shop photos submitted
              </div>
            )}
          </div>

          {/* Application details */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Application Details</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <Building2 size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Name</p>
                  <p className="text-sm text-slate-900 font-medium break-words">{app.businessName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <FileText size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner / Contact</p>
                  <p className="text-sm text-slate-900 font-medium break-words">{app.ownerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <Mail size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-slate-900 font-medium break-words">{app.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <Smartphone size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cellphone</p>
                  <p className="text-sm text-slate-900 font-medium">{app.cellphone ?? app.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <FileText size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CIPC Registration</p>
                  <p className="text-sm text-slate-900 font-medium">{app.businessRegistration || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <Building2 size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Type</p>
                  <p className="text-sm text-slate-900 font-medium">{app.businessType}</p>
                </div>
              </div>
              {(app.shopAddress || app.shopCity) && (
                <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <MapPin size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shop Location</p>
                    <p className="text-sm text-slate-900 font-medium break-words">
                      {app.shopAddress ?? app.shopCity}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <FileText size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Volume</p>
                  <p className="text-sm text-slate-900 font-medium">{app.monthlyOrderValue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                <Calendar size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied</p>
                  <p className="text-sm text-slate-900 font-medium">{app.appliedDate}</p>
                </div>
              </div>
              {app.yearsInBusiness && (
                <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <Clock size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Years in Business</p>
                    <p className="text-sm text-slate-900 font-medium">{app.yearsInBusiness}</p>
                  </div>
                </div>
              )}
              {app.approvedDate && (
                <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <UserCheck size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved On</p>
                    <p className="text-sm text-slate-900 font-medium">{app.approvedDate}</p>
                  </div>
                </div>
              )}
              {app.rejectedDate && (
                <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <BadgeX size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rejected On</p>
                    <p className="text-sm text-slate-900 font-medium">{app.rejectedDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Notes */}
          {app.notes && (
            <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Applicant Notes</p>
              <p className="text-sm text-slate-700 leading-relaxed">{app.notes}</p>
            </div>
          )}

          {/* Rejection reason (if rejected) */}
          {app.status === "rejected" && app.rejectionReason && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertCircle size={10} /> Rejection Reason Sent
              </p>
              <p className="text-sm text-rose-800 leading-relaxed">{app.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 space-y-3">
          {app.status === "pending" && (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(app.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  <CheckCircle size={15} /> Approve
                </button>
                <button
                  onClick={() => onReject(app.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  <XCircle size={15} /> Reject
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmailPreview("approval")}
                  className="flex-1 flex items-center justify-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 py-2 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <Send size={11} /> Preview Approval Email
                </button>
                <button
                  onClick={() => setShowEmailPreview("rejection")}
                  className="flex-1 flex items-center justify-center gap-1 text-xs text-rose-500 hover:text-rose-600 py-2 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <Send size={11} /> Preview Rejection Email
                </button>
              </div>
            </>
          )}
          {app.status !== "pending" && (
            <p className="text-center text-xs text-slate-400">
              This application was {app.status} on {app.approvedDate ?? app.rejectedDate ?? "—"}
            </p>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={lightboxPhoto}
              alt="Shop photo"
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email preview modal */}
      <AnimatePresence>
        {showEmailPreview && (
          <EmailPreviewModal
            type={showEmailPreview}
            app={app}
            onClose={() => setShowEmailPreview(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}


import { allApps } from "@/lib/mock-data";

export default function BulkApprovalsPage() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>(allApps as unknown as Application[]);
  const [activeTab, setActiveTab] = useState<AppStatus>("pending");
  const [drawer, setDrawer] = useState<Application | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Application | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!user || user.role !== "admin") {
    return <AdminGuard />;
  }

  const approve = (id: string) => {
    setApplications((apps) =>
      apps.map((a) => a.id === id ? {
        ...a, status: "approved" as AppStatus,
        approvedDate: new Date().toISOString().split("T")[0],
      } : a)
    );
    toast.success("✅ Application approved! Login credentials email sent.", { duration: 4000 });
    setDrawer(null);
  };

  const reject = (id: string, reason: string) => {
    setApplications((apps) =>
      apps.map((a) => a.id === id ? {
        ...a, status: "rejected" as AppStatus,
        rejectedDate: new Date().toISOString().split("T")[0],
        rejectionReason: reason || "No reason provided.",
      } : a)
    );
    toast.error(
      reason
        ? "❌ Application rejected — reason sent to applicant."
        : "❌ Application rejected — no reason provided.",
      { duration: 4000 }
    );
    setRejectTarget(null);
    setDrawer(null);
  };

  const tabs: { key: AppStatus; label: string; color: string }[] = [
    { key: "pending", label: "Pending Review", color: "bg-amber-500" },
    { key: "approved", label: "Approved", color: "bg-emerald-500" },
    { key: "rejected", label: "Rejected", color: "bg-rose-500" },
  ];

  const counts = {
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filtered = applications.filter((a) => a.status === activeTab);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 bg-slate-50 overflow-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Wholesale Applications</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Review, approve, and reject bulk buyer account applications.
            {counts.pending > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-semibold">
                <Bell size={13} /> {counts.pending} pending
              </span>
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                  activeTab === tab.key ? "bg-white text-indigo-600" : `${tab.color} text-white`
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                {activeTab === "pending" ? <Bell size={24} className="text-slate-300" /> :
                 activeTab === "approved" ? <UserCheck size={24} className="text-slate-300" /> :
                 <BadgeX size={24} className="text-slate-300" />}
              </div>
              <p className="text-slate-400 font-medium">No {activeTab} applications</p>
              <p className="text-slate-300 text-sm mt-1">Check back later or switch tabs</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">Applicant</th>
                  <th className="px-4 py-3.5 text-left hidden md:table-cell">Type</th>
                  <th className="px-4 py-3.5 text-left hidden lg:table-cell">Volume</th>
                  <th className="px-4 py-3.5 text-left hidden sm:table-cell">Applied</th>
                  <th className="px-4 py-3.5 text-left">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{app.businessName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{app.ownerName}</p>
                      <p className="text-xs text-slate-400">{app.email}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 hidden md:table-cell">
                      <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">{app.businessType}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 hidden lg:table-cell">{app.monthlyOrderValue}</td>
                    <td className="px-4 py-4 text-sm text-slate-500 hidden sm:table-cell">{app.appliedDate}</td>
                    <td className="px-4 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setDrawer(app)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        {app.status === "pending" && (
                          <>
                            <button
                              onClick={() => approve(app.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => setRejectTarget(app)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Drawers & Modals */}
      <AnimatePresence>
        {drawer && (
          <ApplicationDrawer
            app={drawer}
            onApprove={approve}
            onReject={(id) => { setRejectTarget(drawer); }}
            onClose={() => setDrawer(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectTarget && (
          <RejectModal
            app={rejectTarget}
            onConfirm={(reason) => reject(rejectTarget.id, reason)}
            onClose={() => setRejectTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
