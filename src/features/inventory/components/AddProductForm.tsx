"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { createProductAction } from "../actions/inventory.actions";
import { analyzeProductImageAction } from "../actions/ai.actions";
import { ImagePlus, X, Sparkles, Loader2 } from "lucide-react";

type UploadedImage = { url: string; publicId: string };

export function AddProductForm() {
  const router = useRouter();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [tier, setTier] = useState<"TIER_1" | "TIER_2">("TIER_1");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startPrice: "",
    endPrice: "",
    quantity: "1",
    freshnessScore: "100"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyzeImage = async (url: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeProductImageAction(url);
      if (result.success && result.data) {
        setTier(result.data.tier || "TIER_1");
        setFormData(prev => ({
          ...prev,
          title: result.data.title || prev.title,
          description: result.data.description || prev.description,
          endPrice: result.data.dynamicPrice ? result.data.dynamicPrice.toString() : prev.endPrice,
          quantity: result.data.quantity ? result.data.quantity.toString() : prev.quantity,
          freshnessScore: result.data.freshnessScore ? result.data.freshnessScore.toString() : prev.freshnessScore
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setIsLoading(true);
    setError("");

    const submitData = new FormData(e.currentTarget);
    submitData.set("tier", tier);
    submitData.set("imageUrls", JSON.stringify(images.map((img) => img.url)));

    const result = await createProductAction(submitData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/merchant");
      router.refresh();
    }
  };

  const removeImage = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-[#1E293B]">
          Product Photos <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={img.publicId} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#2F5D50]">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold bg-[#2F5D50] text-white py-0.5">
                  PRIMARY
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result: any) => {
              const newImageUrl = result.info.secure_url;
              const newPublicId = result.info.public_id;
              
              setImages((prev) => {
                const isFirst = prev.length === 0;
                if (isFirst) {
                  handleAnalyzeImage(newImageUrl);
                }
                return [...prev, { url: newImageUrl, publicId: newPublicId }];
              });
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-[#1E293B]/20 flex flex-col items-center justify-center gap-1 hover:border-[#2F5D50] hover:bg-[#2F5D50]/5 transition-colors"
              >
                <ImagePlus className="w-6 h-6 text-[#1E293B]/40" />
                <span className="text-[10px] font-medium text-[#1E293B]/40">Add Photo</span>
              </button>
            )}
          </CldUploadWidget>
        </div>
        <p className="text-xs text-[#1E293B]/50">First image will be used as the primary display photo, and will auto-fill your listing details.</p>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#1E293B]">
            Product Title <span className="text-red-500">*</span>
          </label>
          
          <button
            type="button"
            disabled
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isAnalyzing 
                ? "bg-[#2F5D50]/10 text-[#2F5D50]" 
                : "bg-[#F2EFE7] text-[#1E293B]/40"
            }`}
          >
            {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {isAnalyzing ? "AI is Analyzing..." : "AI Autofill Ready"}
          </button>
        </div>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Surplus Bread Assortment"
          className="px-3 py-2.5 border border-[#1E293B]/15 rounded-xl text-sm outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 bg-white"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#1E293B]">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the food, its condition, and any pickup instructions..."
          className="px-3 py-2.5 border border-[#1E293B]/15 rounded-xl text-sm outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 bg-white resize-none"
        />
      </div>

      {/* Tier Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1E293B]">Listing Type</label>
        <div className="flex gap-3">
          {[
            { value: "TIER_1", label: "🏷 Discounted", desc: "Sell at reduced price" },
            { value: "TIER_2", label: "✨ Free Claim", desc: "Give away for free" },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTier(t.value as any)}
              className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
                tier === t.value
                  ? "border-[#2F5D50] bg-[#2F5D50]/5"
                  : "border-[#1E293B]/10 bg-white"
              }`}
            >
              <p className="text-sm font-bold text-[#1E293B]">{t.label}</p>
              <p className="text-xs text-[#1E293B]/60 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E293B]">
            Original Price (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="startPrice"
            required
            min={0}
            value={formData.startPrice}
            onChange={handleChange}
            placeholder="50000"
            className="px-3 py-2.5 border border-[#1E293B]/15 rounded-xl text-sm outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 bg-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E293B]">
            {tier === "TIER_2" ? "Sale Price (Rp)" : "Discounted Price (Rp)"}
            {tier !== "TIER_2" && <span className="text-red-500"> *</span>}
          </label>
          <input
            type="number"
            name="endPrice"
            required={tier === "TIER_1"}
            min={0}
            value={tier === "TIER_2" ? 0 : formData.endPrice}
            onChange={handleChange}
            disabled={tier === "TIER_2"}
            placeholder={tier === "TIER_2" ? "0 (Free)" : "20000"}
            className="px-3 py-2.5 border border-[#1E293B]/15 rounded-xl text-sm outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 bg-white disabled:bg-[#F2EFE7] disabled:text-[#1E293B]/40"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E293B]">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            required
            min={1}
            value={formData.quantity}
            onChange={handleChange}
            className="px-3 py-2.5 border border-[#1E293B]/15 rounded-xl text-sm outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 bg-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E293B]">
            Freshness Score (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="freshnessScore"
            required
            min={1}
            max={100}
            value={formData.freshnessScore}
            onChange={handleChange}
            className="px-3 py-2.5 border border-[#1E293B]/15 rounded-xl text-sm outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 bg-white"
          />
        </div>
      </div>

      {/* Expiry */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#1E293B]">
          Expires At <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          name="expiresAt"
          required
          min={new Date().toISOString().slice(0, 16)}
          className="px-3 py-2.5 border border-[#1E293B]/15 rounded-xl text-sm outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 bg-white"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border border-[#1E293B]/15 text-[#1E293B] text-sm font-medium hover:bg-[#1E293B]/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || isAnalyzing}
          className="flex-1 py-3 rounded-xl bg-[#2F5D50] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isLoading ? "Publishing..." : "Publish Listing"}
        </button>
      </div>
    </form>
  );
}