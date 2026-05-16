"use client";

import React, { useState } from "react";
import { TriageResult } from "../interfaces/triage.interface";
import { CheckCircle, Image as ImageIcon, Tag, Activity, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApprovalFormProps {
  initialData: TriageResult;
  imageUrl: string | null;
}

export default function ApprovalForm({ initialData, imageUrl }: ApprovalFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<TriageResult>(initialData);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dynamicPrice" ? Number(value) : value,
    }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    // Simulate API call to publish listing
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Redirect to merchant dashboard or success page
    router.push("/merchant");
  };

  const isTier1 = formData.tier === "Tier 1";

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-[#2F5D50] text-[#F2EFE7] p-6 items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#A4B69A]" />
            AI Triage Complete
          </h1>
          <p className="text-[#A4B69A] text-sm mt-1">Review and publish your listing in seconds.</p>
        </div>
        
        {/* Tier Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${isTier1 ? 'bg-[#A4B69A] text-[#1E293B]' : 'bg-[#D4A373] text-[#1E293B]'}`}>
          <Activity className="w-5 h-5" />
          {formData.tier}
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full p-6 gap-8">
        {/* Left Column: Image Preview */}
        <div className="flex flex-col w-full md:w-1/3 gap-4">
          <div className="w-full aspect-square rounded-2xl bg-[#F2EFE7] border-2 border-[#A4B69A]/30 overflow-hidden flex items-center justify-center relative">
            {imageUrl ? (
              <img src={imageUrl} alt="Product preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-[#1E293B]/40">
                <ImageIcon className="w-12 h-12 mb-2" />
                <span>No image available</span>
              </div>
            )}
            
            {/* Absolute badge on image */}
            <div className="absolute top-3 right-3 bg-[#1E293B]/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              AI Optimized
            </div>
          </div>
          
          <div className="flex flex-col bg-[#F2EFE7] p-4 rounded-xl gap-2">
            <h3 className="font-semibold text-[#1E293B] text-sm">AI Assessment Notes</h3>
            <p className="text-sm text-[#1E293B]/70 leading-relaxed">
              Based on the time of day and visual condition, this item was automatically categorized as {formData.tier}. 
              The price has been dynamically adjusted to maximize sell-through rate.
            </p>
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <form onSubmit={handlePublish} className="flex flex-col w-full md:w-2/3 gap-6">
          <div className="flex flex-col gap-5">
            {/* Product Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="productName" className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
                <Tag className="w-4 h-4 text-[#2F5D50]" /> Product Name
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2F5D50] focus:ring-4 focus:ring-[#A4B69A]/20 outline-none transition-all text-lg font-medium text-[#1E293B]"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
                <FileText className="w-4 h-4 text-[#2F5D50]" /> Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2F5D50] focus:ring-4 focus:ring-[#A4B69A]/20 outline-none transition-all text-[#1E293B] resize-none"
                required
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label htmlFor="dynamicPrice" className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
                <span className="font-serif text-[#2F5D50] font-bold text-lg leading-none">Rp</span> Dynamic Price
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-[#1E293B]/50 font-bold">Rp</span>
                <input
                  id="dynamicPrice"
                  name="dynamicPrice"
                  type="number"
                  value={formData.dynamicPrice}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2F5D50] focus:ring-4 focus:ring-[#A4B69A]/20 outline-none transition-all text-xl font-bold text-[#2F5D50]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col pt-4 mt-auto">
            <button
              type="submit"
              disabled={isPublishing}
              className="group flex items-center justify-center gap-2 w-full py-4 bg-[#2F5D50] hover:bg-[#1E293B] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isPublishing ? (
                "Publishing..."
              ) : (
                <>
                  Publish Listing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-[#1E293B]/50 mt-3 font-medium">
              You can edit this later from your dashboard
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
