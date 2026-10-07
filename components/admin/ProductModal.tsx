"use client";

import { useState, useEffect, useRef } from "react";
import { Product, BulkPricingTier } from "@/lib/types";
import { createProductApi, updateProductApi, uploadProductImageApi, deleteProductImageApi } from "@/lib/api/products";
import { X, Upload, Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
}

const CATEGORIES = [
  "Hookah & Shisha",
  "Vapes & E-Cigarettes",
  "Premium Cigars",
  "Traditional Tobacco",
  "Accessories",
  "Pipes & Glassware",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

function generateSku(name: string, category: string): string {
  const catPrefix = (category || "GEN").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
  const namePart = (name || "PROD").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${catPrefix}-${namePart}-${random}`;
}

interface ImageItem {
  id?: string;
  url: string;
  isNew?: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}: ProductModalProps) {
  const isEditing = Boolean(productToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [moq, setMoq] = useState("1");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [tiers, setTiers] = useState<BulkPricingTier[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setSlug(productToEdit.slug || "");
      setSku(productToEdit.sku || "");
      if (CATEGORIES.includes(productToEdit.category)) {
        setCategory(productToEdit.category);
        setCustomCategory("");
      } else {
        setCategory("Other");
        setCustomCategory(productToEdit.category || "");
      }
      setDescription(productToEdit.description || "");
      setRetailPrice(String(productToEdit.retailPrice ?? ""));
      setStock(String(productToEdit.stock ?? 0));
      setMoq(String(productToEdit.moq ?? 1));
      setFeatured(Boolean(productToEdit.featured));
      setStatus(productToEdit.status === "inactive" ? "draft" : productToEdit.status || "active");
      setTiers(productToEdit.bulkPricingTiers || []);

      const existingImages: ImageItem[] = (productToEdit.images || []).map((url) => {
        const uuidMatch = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        return {
          id: uuidMatch ? uuidMatch[0] : undefined,
          url,
        };
      });
      setImages(existingImages);
    } else {
      // Reset for add
      setName("");
      setSlug("");
      setSku("");
      setCategory(CATEGORIES[0]);
      setCustomCategory("");
      setDescription("");
      setRetailPrice("");
      setStock("10");
      setMoq("1");
      setStatus("active");
      setFeatured(false);
      setImages([]);
      setTiers([]);
    }
  }, [productToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleAutoGenerateSku = () => {
    const finalCat = category === "Other" ? customCategory : category;
    setSku(generateSku(name, finalCat));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be under 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await uploadProductImageApi(file);
      if (res.success && res.data?.image) {
        setImages((prev) => [
          ...prev,
          { id: res.data.image.id, url: res.data.image.url, isNew: true },
        ]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (index: number) => {
    const image = images[index];
    if (image.isNew && image.id) {
      try { await deleteProductImageApi(image.id); }
      catch (error) { toast.error(error instanceof Error ? error.message : "Could not remove image"); return; }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = async () => {
    const pendingIds = images.filter((image) => image.isNew && image.id).map((image) => image.id as string);
    await Promise.allSettled(pendingIds.map((id) => deleteProductImageApi(id)));
    onClose();
  };

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMin = lastTier ? (lastTier.maxQty ? lastTier.maxQty + 1 : lastTier.minQty + 10) : 10;
    const defaultPrice = retailPrice ? Math.max(1, Number(retailPrice) * 0.85) : 100;
    setTiers([...tiers, { minQty: newMin, maxQty: null, price: Math.round(defaultPrice) }]);
  };

  const handleUpdateTier = (index: number, field: keyof BulkPricingTier, value: any) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const handleRemoveTier = (index: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    const finalSlug = slugify(slug || name);
    if (!finalSlug) {
      toast.error("Valid slug is required");
      return;
    }

    const finalCat = category === "Other" ? customCategory.trim() : category;
    if (!finalCat) {
      toast.error("Category is required");
      return;
    }

    const priceNum = Number(retailPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Valid retail price greater than 0 is required");
      return;
    }

    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Stock quantity must be 0 or more");
      return;
    }

    const moqNum = parseInt(moq, 10) || 1;
    const finalSku = (sku || generateSku(name, finalCat)).trim();

    const imageIds = images.map((img) => img.id).filter(Boolean) as string[];

    const validTiers = tiers
      .filter((t) => t.minQty > 0 && t.price > 0)
      .map((t) => ({
        minQty: Number(t.minQty),
        maxQty: t.maxQty ? Number(t.maxQty) : null,
        price: Number(t.price),
      }));

    const payload: any = {
      name: name.trim(),
      slug: finalSlug,
      sku: finalSku,
      category: finalCat,
      description: description.trim() || name.trim(),
      retailPrice: priceNum,
      stock: stockNum,
      moq: moqNum,
      status,
      featured,
      imageIds: imageIds.length > 0 ? imageIds : undefined,
      bulkPricingTiers: validTiers,
    };

    setIsSubmitting(true);
    try {
      if (isEditing && productToEdit) {
        const res = await updateProductApi(productToEdit.id, payload);
        if (res.success) {
          toast.success("Product updated successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error("Failed to update product");
        }
      } else {
        const res = await createProductApi(payload);
        if (res.success) {
          toast.success("Product created successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error("Failed to create product");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? "Update product details, pricing, and inventory"
                : "Fill in the details below to add a new product to your catalog"}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Al Fakher Double Apple 250g"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Other (Custom)</option>
              </select>
              {category === "Other" && (
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="mt-2 w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  SKU <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateSku}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <Sparkles size={11} /> Auto-generate
                </button>
              </div>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. HOOK-ALFA-250"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Slug <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 select-none">
                /products/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="product-url-slug"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-r-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Pricing, Stock & MOQ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Retail Price (ZAR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  R
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Min Order Qty (MOQ)
              </label>
              <input
                type="number"
                min="1"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                placeholder="1"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active (Visible in Store)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product, features, blend, specifications..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Product Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Images
            </label>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {/* Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl p-4 text-center cursor-pointer transition-colors"
            >
              {isUploadingImage ? (
                <div className="flex items-center justify-center gap-2 py-3 text-indigo-600">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-xs font-semibold">Processing & uploading image...</span>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-center">
                  <Upload size={22} className="text-slate-400 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">Click to upload product image</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, or WebP up to 10MB</p>
                </div>
              )}
            </div>

            {/* Image Preview List */}
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm group"
                  >
                    <img
                      src={img.url}
                      alt={`Product image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-indigo-600/90 text-[9px] text-white px-1.5 py-0.5 rounded font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wholesale / Bulk Pricing Tiers */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Bulk / Wholesale Pricing Tiers
                </h4>
                <p className="text-[11px] text-slate-500">
                  Optional: Offer discounted tiered pricing for approved bulk buyers
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTier}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <Plus size={13} /> Add Tier
              </button>
            </div>

            {tiers.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">
                No bulk tiers configured. Standard retail price will apply to all quantities.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-500 uppercase px-1">
                  <div className="col-span-3">Min Qty</div>
                  <div className="col-span-3">Max Qty (blank = ∞)</div>
                  <div className="col-span-5">Tier Price (ZAR)</div>
                  <div className="col-span-1"></div>
                </div>

                {tiers.map((tier, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        value={tier.minQty}
                        onChange={(e) =>
                          handleUpdateTier(idx, "minQty", parseInt(e.target.value, 10) || 1)
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        value={tier.maxQty ?? ""}
                        placeholder="Unlimited"
                        onChange={(e) =>
                          handleUpdateTier(
                            idx,
                            "maxQty",
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-5">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                          R
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={tier.price}
                          onChange={(e) =>
                            handleUpdateTier(idx, "price", parseFloat(e.target.value) || 0)
                          }
                          className="w-full pl-6 pr-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Changes" : "Create Product"}</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
