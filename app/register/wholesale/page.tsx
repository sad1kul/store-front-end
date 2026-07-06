"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessDetailsSchema,
  shopDetailsSchema,
  BusinessDetailsData,
  ShopDetailsData,
  BUSINESS_TYPES,
  MONTHLY_ORDER_VALUES,
  SA_PROVINCES,
  YEARS_IN_BUSINESS,
} from "@/lib/validations/wholesaleSchema";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Phone,
  MapPin,
  ShieldCheck,
  Upload,
  X,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Info,
  Camera,
  Star,
  BadgeCheck,
  Package,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface UploadedPhoto {
  id: string;
  name: string;
  size: number;
  preview: string;
  file: File;
}

function StepBusinessDetails({
  onNext,
  savedData,
}: {
  onNext: (data: BusinessDetailsData) => void;
  savedData?: Partial<BusinessDetailsData>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessDetailsData>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: { ...savedData, businessType: "Wholesaler" as const },
  });

  const inputCls = (err: boolean) =>
    `w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all ${
      err ? "border-rose-300 bg-rose-50" : "border-slate-200"
    }`;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-indigo-800 mb-1">📋 What we need from you</p>
        <p className="text-xs text-indigo-600 leading-relaxed">
          Fill in your business details accurately. This information will be verified
          by our team before your account is approved. Providing false information
          will result in immediate rejection.
        </p>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">Wholesalers only — applications are currently restricted</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            At this stage we are only onboarding <strong>wholesale businesses</strong>. Retailers,
            spaza shops, and resellers will be invited to apply in a future phase.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Business / Trading Name <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("businessName")}
            placeholder="e.g. Flames & Smoke Traders"
            className={inputCls(!!errors.businessName)}
          />
          {errors.businessName && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.businessName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Your Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("ownerName")}
            placeholder="e.g. Thabo Nkosi"
            className={inputCls(!!errors.ownerName)}
          />
          {errors.ownerName && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.ownerName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Business Email <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Info size={11} /> We'll send your approval notice here
          </p>
          <input
            type="email"
            {...register("email")}
            placeholder="sales@yourbusiness.co.za"
            className={inputCls(!!errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Cellphone Number <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Info size={11} /> SA number — must be reachable for verification
          </p>
          <div className="relative">
            <Phone
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              {...register("cellphone")}
              placeholder="082 123 4567"
              className={`${inputCls(!!errors.cellphone)} pl-9`}
            />
          </div>
          {errors.cellphone && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.cellphone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            CIPC Registration Number
          </label>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Info size={11} /> Optional — speeds up verification
          </p>
          <input
            {...register("businessRegistration")}
            placeholder="2023/123456/07"
            className={inputCls(!!errors.businessRegistration)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Business Type
          </label>
          {/* locked — only Wholesalers can apply right now */}
          <input type="hidden" {...register("businessType")} value="Wholesaler" />
          <div className="flex items-center gap-2 px-3.5 py-2.5 border border-indigo-200 bg-indigo-50 rounded-xl">
            <Building2 size={14} className="text-indigo-500 shrink-0" />
            <span className="text-sm font-semibold text-indigo-700">Wholesaler</span>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">
              Only type accepted
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Expected Monthly Order Value <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
          <Info size={11} /> Helps us assign the right pricing tier
        </p>
        <div className="relative">
          <select
            {...register("monthlyOrderValue")}
            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none cursor-pointer ${
              errors.monthlyOrderValue ? "border-rose-300 bg-rose-50" : "border-slate-200"
            }`}
          >
            <option value="">How much do you expect to order monthly?</option>
            {MONTHLY_ORDER_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
        {errors.monthlyOrderValue && (
          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
            <AlertCircle size={11} /> {errors.monthlyOrderValue.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-200 text-sm"
      >
        Continue to Shop Details <ArrowRight size={16} />
      </button>
    </form>
  );
}

function StepShopDetails({
  onNext,
  onBack,
  savedData,
  photos,
  onPhotosChange,
}: {
  onNext: (data: ShopDetailsData) => void;
  onBack: () => void;
  savedData?: Partial<ShopDetailsData>;
  photos: UploadedPhoto[];
  onPhotosChange: (photos: UploadedPhoto[]) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopDetailsData>({
    resolver: zodResolver(shopDetailsSchema),
    defaultValues: savedData,
  });

  const [photoError, setPhotoError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputCls = (err: boolean) =>
    `w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all ${
      err ? "border-rose-300 bg-rose-50" : "border-slate-200"
    }`;

  const addFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) {
      toast.error("Only image files are accepted (JPG, PNG, WEBP)");
      return;
    }
    if (photos.length + imgs.length > 5) {
      toast.error("Maximum 5 shop photos allowed");
      return;
    }
    const next = imgs.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      file,
    }));
    onPhotosChange([...photos, ...next]);
    setPhotoError("");
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [photos]
  );

  const removePhoto = (id: string) => {
    const found = photos.find((p) => p.id === id);
    if (found) URL.revokeObjectURL(found.preview);
    onPhotosChange(photos.filter((p) => p.id !== id));
  };

  const onSubmit = (data: ShopDetailsData) => {
    if (!photos.length) {
      setPhotoError(
        "Please upload at least 1 photo of your shop — required for verification."
      );
      return;
    }
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-emerald-800 mb-1">📍 Why we need your shop details</p>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Our verification team confirms business addresses and reviews shop photos to prevent
          fraud. Uploading <strong>real, clear photos of your actual shop</strong> significantly
          speeds up approval.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Shop / Premises Street Address <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
          <Info size={11} /> Full street address — not a PO Box
        </p>
        <div className="relative">
          <MapPin
            size={14}
            className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
          />
          <textarea
            {...register("shopAddress")}
            rows={2}
            placeholder="e.g. 24 Main Road, Shop 3, Clearwater Mall"
            className={`${inputCls(!!errors.shopAddress)} pl-9 resize-none`}
          />
        </div>
        {errors.shopAddress && (
          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
            <AlertCircle size={11} /> {errors.shopAddress.message}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            City / Town <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("shopCity")}
            placeholder="e.g. Johannesburg"
            className={inputCls(!!errors.shopCity)}
          />
          {errors.shopCity && (
            <p className="text-xs text-rose-500 mt-1">{errors.shopCity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Province <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("shopProvince")}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none cursor-pointer ${
                errors.shopProvince ? "border-rose-300 bg-rose-50" : "border-slate-200"
              }`}
            >
              <option value="">Select…</option>
              {SA_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          {errors.shopProvince && (
            <p className="text-xs text-rose-500 mt-1">{errors.shopProvince.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Postal Code <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("shopPostalCode")}
            placeholder="e.g. 2000"
            maxLength={4}
            className={inputCls(!!errors.shopPostalCode)}
          />
          {errors.shopPostalCode && (
            <p className="text-xs text-rose-500 mt-1">{errors.shopPostalCode.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Years in Business <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("yearsInBusiness")}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none cursor-pointer ${
                errors.yearsInBusiness ? "border-rose-300 bg-rose-50" : "border-slate-200"
              }`}
            >
              <option value="">How long have you operated?</option>
              {YEARS_IN_BUSINESS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          {errors.yearsInBusiness && (
            <p className="text-xs text-rose-500 mt-1">{errors.yearsInBusiness.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">VAT / Tax Number</label>
          <p className="text-xs text-slate-400 mb-2">Optional</p>
          <input
            {...register("taxNumber")}
            placeholder="e.g. 4123456789"
            className={inputCls(!!errors.taxNumber)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          How did you hear about us?
        </label>
        <input
          {...register("referral")}
          placeholder="e.g. Referred by a supplier, Google, social media…"
          className={inputCls(false)}
        />
      </div>

      {/* photo upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Shop Photos <span className="text-rose-500">*</span>
          <span className="text-slate-400 font-normal ml-2">(min. 1, max. 5)</span>
        </label>
        <p className="text-xs text-slate-400 mb-3 flex items-start gap-1.5">
          <Camera size={12} className="mt-0.5 shrink-0 text-indigo-400" />
          Upload clear, well-lit photos of your shop interior or exterior. Blurry or
          irrelevant images may delay approval.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
              : photoError
              ? "border-rose-300 bg-rose-50"
              : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isDragging ? "bg-indigo-100" : "bg-slate-100"
              }`}
            >
              <Upload size={22} className={isDragging ? "text-indigo-600" : "text-slate-400"} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {isDragging ? "Drop your photos here!" : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP · Max 10MB per image</p>
            </div>
          </div>
        </div>

        {photoError && (
          <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
            <AlertCircle size={11} /> {photoError}
          </p>
        )}

        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
            <AnimatePresence>
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square"
                >
                  <img
                    src={photo.preview}
                    alt={`Shop photo ${i + 1}`}
                    className="w-full h-full object-cover rounded-xl border-2 border-slate-200 group-hover:border-indigo-400 transition-colors"
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X size={10} />
                  </button>
                </motion.div>
              ))}
              {photos.length < 5 && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                >
                  <Upload size={16} />
                  <span className="text-[10px] mt-1">Add more</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-2">
          {photos.length}/5 photos uploaded
          {!photos.length && " — at least 1 required"}
          {photos.length > 0 && photos.length < 3 && " — more photos increase approval chances"}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-200 text-sm"
        >
          Continue to Review & Submit <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

function StepTerms({
  onSubmit,
  onBack,
  isLoading,
  businessData,
  shopData,
  photos,
}: {
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  businessData?: Partial<BusinessDetailsData>;
  shopData?: Partial<ShopDetailsData>;
  photos: UploadedPhoto[];
}) {
  const [terms, setTerms] = useState(false);
  const [age, setAge] = useState(false);
  const [compliance, setCompliance] = useState(false);
  const [tried, setTried] = useState(false);

  const allChecked = terms && age && compliance;

  const handleClick = () => {
    if (!allChecked) {
      setTried(true);
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-5">
      {/* summary */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Application Summary
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {businessData?.businessName && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Business:</span>
              <span className="font-semibold text-slate-900">{businessData.businessName}</span>
            </div>
          )}
          {businessData?.ownerName && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Owner:</span>
              <span className="font-semibold text-slate-900">{businessData.ownerName}</span>
            </div>
          )}
          {businessData?.email && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Email:</span>
              <span className="font-semibold text-slate-900 break-words">{businessData.email}</span>
            </div>
          )}
          {businessData?.cellphone && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Cellphone:</span>
              <span className="font-semibold text-slate-900">{businessData.cellphone}</span>
            </div>
          )}
          {businessData?.businessType && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Type:</span>
              <span className="font-semibold text-slate-900">{businessData.businessType}</span>
            </div>
          )}
          {businessData?.monthlyOrderValue && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Volume:</span>
              <span className="font-semibold text-slate-900">{businessData.monthlyOrderValue}</span>
            </div>
          )}
          {shopData?.shopCity && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Location:</span>
              <span className="font-semibold text-slate-900">
                {shopData.shopCity}, {shopData.shopProvince}
              </span>
            </div>
          )}
          {shopData?.yearsInBusiness && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">Experience:</span>
              <span className="font-semibold text-slate-900">{shopData.yearsInBusiness}</span>
            </div>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            📷 <strong>{photos.length}</strong> shop photo{photos.length !== 1 ? "s" : ""} attached
          </p>
        </div>
      </div>

      {/* what happens next */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-amber-800 mb-2">⏱ What happens after you submit?</p>
        <div className="space-y-2">
          <p className="text-xs text-amber-700 flex gap-2">
            <span>📩</span>
            <span>You'll receive an email confirming we received your application</span>
          </p>
          <p className="text-xs text-amber-700 flex gap-2">
            <span>🔍</span>
            <span>Our team reviews your details and shop photos within 1–2 business days</span>
          </p>
          <p className="text-xs text-amber-700 flex gap-2">
            <span>✅</span>
            <span>If approved: you'll receive login credentials and pricing access via email</span>
          </p>
          <p className="text-xs text-amber-700 flex gap-2">
            <span>❌</span>
            <span>If rejected: you'll receive an email explaining the reason and how to re-apply</span>
          </p>
        </div>
      </div>

      {/* checkboxes */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Before you submit, please confirm:</p>

        <label
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            terms ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              terms ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
            }`}
          >
            {terms && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={terms}
            onChange={() => setTerms((v) => !v)}
            className="sr-only"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              I agree to the Terms & Conditions and Privacy Policy
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Including the Wholesale Buyer Agreement and pricing terms set by Smoke Time Store
            </p>
          </div>
        </label>

        <label
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            age ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              age ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
            }`}
          >
            {age && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={age}
            onChange={() => setAge((v) => !v)}
            className="sr-only"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              I confirm that I am 18 years of age or older
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              South African law requires all tobacco product buyers and sellers to be 18+
            </p>
          </div>
        </label>

        <label
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            compliance
              ? "border-indigo-400 bg-indigo-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              compliance ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
            }`}
          >
            {compliance && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={compliance}
            onChange={() => setCompliance((v) => !v)}
            className="sr-only"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              My business complies with applicable South African tobacco legislation
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Including the Tobacco Products Control Act and any provincial bylaws governing tobacco
              retail
            </p>
          </div>
        </label>
      </div>

      {tried && !allChecked && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm"
        >
          <AlertCircle size={16} className="shrink-0" />
          Please confirm all three declarations above before submitting.
        </motion.div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-indigo-200 text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <BadgeCheck size={18} /> Submit Wholesale Application
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ name, email }: { name: string; email: string }) {
  const refId = `STS-APP-${Math.floor(10000 + Math.random() * 90000)}`;
  const decisionDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
    "en-ZA",
    { weekday: "long", day: "numeric", month: "short" }
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4"
    >
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={44} className="text-emerald-600" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-emerald-200 border-t-emerald-500 rounded-full"
        />
      </div>

      <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
        <Clock size={13} /> Awaiting Admin Review
      </span>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Application Submitted! 🎉</h2>
      <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
        Thank you, <strong className="text-slate-700">{name.split(" ")[0]}</strong>! Your wholesale
        application has been received and is now in our review queue.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Your Application Details
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Reference ID</span>
            <span className="font-mono font-bold text-indigo-600">{refId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Confirmation sent to</span>
            <span className="font-semibold text-slate-900">{email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Decision expected by</span>
            <span className="font-semibold text-emerald-700">{decisionDate}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-left mb-8">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-3">
          What to expect in your inbox
        </p>
        <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl">
          <span className="text-lg">📩</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Confirmation Email</p>
            <p className="text-xs text-slate-500">
              Sent now — check your spam folder if you don't see it within 5 minutes
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Approval Email</p>
            <p className="text-xs text-slate-500">
              Contains your login credentials and instructions to access your wholesale dashboard
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl">
          <span className="text-lg">❌</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Rejection Email (if applicable)</p>
            <p className="text-xs text-slate-500">
              Will include the specific reason and steps to re-apply or appeal the decision
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
      >
        <Package size={16} /> Back to Store
      </Link>
      <p className="text-xs text-slate-400 mt-4">
        Have questions?{" "}
        <a
          href="mailto:wholesale@smoketimestore.co.za"
          className="text-indigo-600 hover:underline"
        >
          wholesale@smoketimestore.co.za
        </a>
      </p>
    </motion.div>
  );
}

export default function WholesalePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [businessData, setBusinessData] = useState<Partial<BusinessDetailsData>>({});
  const [shopData, setShopData] = useState<Partial<ShopDetailsData>>({});
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  const goTo = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep1 = (data: BusinessDetailsData) => {
    setBusinessData(data);
    goTo(2);
  };

  const handleStep2 = (data: ShopDetailsData) => {
    setShopData(data);
    goTo(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setLoading(false);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepLabels = [
    { n: 1, title: "Business Info", icon: Building2 },
    { n: 2, title: "Shop Details", icon: MapPin },
    { n: 3, title: "Terms & Submit", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {!done && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Star size={12} /> Wholesale Account Application
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Apply to Become a Bulk Buyer
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Complete the 3-step application below. Our team will review your details and respond
              within <strong className="text-slate-700">1–2 business days</strong>.
            </p>
          </div>
        )}

        {!done && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 sm:hidden">
              <span>Step {step} of 3</span>
              <span className="font-semibold text-indigo-600">{stepLabels[step - 1].title}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                initial={false}
                animate={{ width: `${step === 1 ? 5 : ((step - 1) / 2) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
            <div className="hidden sm:flex items-center justify-between">
              {stepLabels.map((s) => {
                const done = step > s.n;
                const active = step === s.n;
                return (
                  <div key={s.n} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all ${
                        done
                          ? "bg-emerald-500"
                          : active
                          ? "bg-indigo-600 shadow-lg shadow-indigo-200"
                          : "bg-slate-200"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 size={18} className="text-white" />
                      ) : (
                        <s.icon size={18} className={active ? "text-white" : "text-slate-400"} />
                      )}
                    </div>
                    <p
                      className={`text-xs font-semibold ${
                        active ? "text-indigo-600" : done ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {s.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <motion.div
          key={done ? "success" : step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />
          <div className="p-6 sm:p-8">
            {done ? (
              <SuccessScreen name={businessData.ownerName ?? ""} email={businessData.email ?? ""} />
            ) : step === 1 ? (
              <StepBusinessDetails onNext={handleStep1} savedData={businessData} />
            ) : step === 2 ? (
              <StepShopDetails
                onNext={handleStep2}
                onBack={() => goTo(1)}
                savedData={shopData}
                photos={photos}
                onPhotosChange={setPhotos}
              />
            ) : (
              <StepTerms
                onSubmit={handleSubmit}
                onBack={() => goTo(2)}
                isLoading={loading}
                businessData={businessData}
                shopData={shopData}
                photos={photos}
              />
            )}
          </div>
        </motion.div>

        {!done && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Already approved?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in here
            </Link>
            {" · "}
            <Link href="/" className="hover:text-indigo-600">
              Back to store
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
