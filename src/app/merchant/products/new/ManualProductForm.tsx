"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, FileText, ArrowRight, Image as ImageIcon, Leaf } from "lucide-react";
import { publishProductAction } from "@/features/surplusTriage/actions/publishProduct.action";

export default function ManualProductForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    dynamicPrice: 0,
    tier: "Tier 1",
    quantity: 1,
    freshnessScore: 100, // Default for manual entry
    imageUrl: null as string | null,
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["dynamicPrice", "quantity", "freshnessScore"].includes(name) ? Number(value) : value,
    }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(null);
    try {
      const result = await publishProductAction({
        title: formData.productName,
        description: formData.description,
        dynamicPrice: formData.dynamicPrice,
        tier: formData.tier,
        quantity: formData.quantity,
        freshnessScore: formData.freshnessScore,
        imageUrl: formData.imageUrl,
      });

      if (result.success) {
        router.push("/merchant");
      } else {
        setError(result.error || "Failed to publish product");
        setIsPublishing(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsPublishing(false);
    }
  };

  return (
    <form onSubmit={handlePublish} className="flex flex-col gap-6 bg-white p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-[#1E293B]">Add Product Manually</h2>
      <p className="text-[#1E293B]/70 text-sm mb-4">
        Fill out the details below to add a product without AI triage.
      </p>

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

        {/* Price & Quantity */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="dynamicPrice" className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
              <span className="font-serif text-[#2F5D50] font-bold text-lg leading-none">Rp</span> Price
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

          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="quantity" className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2F5D50] focus:ring-4 focus:ring-[#A4B69A]/20 outline-none transition-all text-xl font-bold text-[#1E293B]"
              required
            />
          </div>
        </div>

        {/* Tier & Freshness Score */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="tier" className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
              Product Tier
            </label>
            <select
              id="tier"
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2F5D50] focus:ring-4 focus:ring-[#A4B69A]/20 outline-none transition-all text-lg font-medium text-[#1E293B] bg-white"
              required
            >
              <option value="Tier 1">Tier 1 (Discounted)</option>
              <option value="Tier 2">Tier 2 (Free)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="freshnessScore" className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
              <Leaf className="w-4 h-4 text-[#2F5D50]" /> Freshness Score (1-100)
            </label>
            <input
              id="freshnessScore"
              name="freshnessScore"
              type="number"
              min="1"
              max="100"
              value={formData.freshnessScore}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#2F5D50] focus:ring-4 focus:ring-[#A4B69A]/20 outline-none transition-all text-lg font-medium text-[#1E293B]"
              required
            />
          </div>
        </div>

      </div>

      <div className="flex flex-col pt-4 gap-3 mt-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}
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
      </div>
    </form>
  );
}
