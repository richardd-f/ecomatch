"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Store, Clock, Package, Image as ImageIcon } from "lucide-react";
import { PriceBadge } from "@/components/PriceBadge";

// Defining the expected product type from the server
export type MerchantProduct = {
  id: string;
  title: string;
  tier: "TIER_1" | "TIER_2";
  startPrice: number;
  endPrice: number;
  status: "AVAILABLE" | "PENDING" | "SOLD" | "CLAIMED";
  expiresAt: Date;
  images: { imgUrl: string; isPrimary: boolean }[];
};

export function MerchantDashboard({ initialProducts }: { initialProducts: MerchantProduct[] }) {
  const [filterTier, setFilterTier] = useState<"ALL" | "TIER_1" | "TIER_2">("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = initialProducts.filter((p) => {
    if (filterTier !== "ALL" && p.tier !== filterTier) return false;
    if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Your Listings
          </h1>
          <p className="text-[#1E293B]/60 text-sm mt-1">
            Manage your surplus inventory and track claims.
          </p>
        </div>
        
        <Link
          href="/merchant/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F5D50] text-white font-medium hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-[#1E293B]/10 shadow-sm">
        {/* Search */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#1E293B]/40" />
          </div>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F2EFE7]/50 border-none rounded-xl focus:ring-2 focus:ring-[#2F5D50]/20 text-sm outline-none"
          />
        </div>

        {/* Tier Filter */}
        <div className="flex bg-[#F2EFE7]/50 rounded-xl p-1 shrink-0 overflow-x-auto">
          {["ALL", "TIER_1", "TIER_2"].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterTier === tier
                  ? "bg-white text-[#2F5D50] shadow-sm"
                  : "text-[#1E293B]/60 hover:text-[#1E293B]"
              }`}
            >
              {tier === "ALL" ? "All Tiers" : tier === "TIER_1" ? "Discounted" : "Free Claims"}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#F2EFE7]/50 border-none text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#2F5D50]/20 shrink-0 cursor-pointer text-[#1E293B]"
        >
          <option value="ALL">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="PENDING">Pending</option>
          <option value="SOLD">Sold</option>
          <option value="CLAIMED">Claimed</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Find primary image or use fallback
            const primaryImage = product.images.find(img => img.isPrimary)?.imgUrl 
              || product.images[0]?.imgUrl;

            return (
              <div 
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl border border-[#1E293B]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image Section */}
                <div className="relative aspect-video bg-[#F2EFE7] overflow-hidden">
                  {primaryImage ? (
                    <img 
                      src={primaryImage} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#1E293B]/20">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs font-medium">No image</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span 
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm ${
                        product.status === "AVAILABLE" ? "bg-white text-[#2F5D50]" :
                        product.status === "PENDING" ? "bg-[#D4A373] text-white" :
                        "bg-[#1E293B]/80 text-white"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 flex flex-col flex-grow gap-3">
                  <h3 className="font-bold text-[#1E293B] line-clamp-1">{product.title}</h3>
                  
                  <div className="mt-auto">
                    <PriceBadge 
                      tier={product.tier === "TIER_1" ? "tier1" : "tier2"} 
                      originalPrice={product.startPrice} 
                      discountedPrice={product.endPrice} 
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-1 border-t border-[#1E293B]/5 text-xs text-[#1E293B]/60">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires: {new Date(product.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-2xl border border-dashed border-[#1E293B]/20">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F2EFE7] text-[#A4B69A] mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-2">No listings found</h2>
          <p className="text-[#1E293B]/60 mb-6 max-w-sm text-sm">
            {initialProducts.length === 0 
              ? "You haven't added any surplus food listings yet. Start rescuing food today!" 
              : "No products match your current filters. Try adjusting them."}
          </p>
          {initialProducts.length === 0 && (
            <Link 
              href="/merchant/products/new"
              className="px-5 py-2.5 rounded-xl bg-[#2F5D50] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Add First Product
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
