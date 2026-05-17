"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Leaf, X } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import { Product } from "@/types/product.types";
import { FadeIn } from "@/components/animations/FadeIn";
import { FloatingElement } from "@/components/animations/FloatingElement";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";

const CATEGORIES = ["All", "Bakery", "Vegetables", "Prepared Meals"];

export function HomeClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tierFilter, setTierFilter] = useState<"all" | "tier1" | "tier2">("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (tierFilter !== "all" && p.tier !== tierFilter) return false;
      return true;
    });
  }, [products, search, activeCategory, tierFilter]);

  const onAddToCart = (product: Product, qty: number) => {
    console.log("Added to cart", product.name, qty);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12 px-4 md:px-8">
      {/* Hero Banner */}
      <FadeIn delay={0.1} duration={0.8}>
        <section className="relative overflow-hidden rounded-2xl md:rounded-3xl mt-3 bg-gradient-to-br from-[#1E293B] to-[#2F5D50] px-6 py-10 md:px-12 md:py-16 shadow-lg">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FloatingElement duration={2.5}>
                <Leaf className="w-5 h-5 text-[#A4B69A]" />
              </FloatingElement>
              <span className="text-sm font-semibold text-[#A4B69A] tracking-wide uppercase">
                AI-Powered Food Rescue
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white max-w-2xl leading-tight tracking-tight">
              Rescue surplus food. <br className="hidden md:block" />
              <span className="text-[#D4A373]">Save money. Save the planet.</span>
            </h1>

            <p className="text-base md:text-lg text-white/80 max-w-2xl font-medium">
              Every listing on EcoMatch is verified by our Gemini Vision AI. Food that might be wasted tomorrow is yours today — deeply discounted or completely free.
            </p>

            {/* Stats Row */}

          </div>
        </section>
      </FadeIn>

      {/* Discovery Section (Search & Filters) */}
      <section className="flex flex-col gap-4 sticky top-0 z-20 bg-[#F2EFE7]/90 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0">

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E293B]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for food, merchants, categories…"
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#1E293B]/10 bg-white text-[#1E293B] text-sm md:text-base font-medium outline-none transition-all focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E293B]/40 hover:text-[#1E293B]/70 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters Layout */}
        <StaggerContainer delay={0.3} className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          <SlidersHorizontal className="w-5 h-5 shrink-0 text-[#1E293B]/50 stagger-item" />

          {/* Categories */}
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`stagger-item shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
                    ? "bg-[#2F5D50] text-white shadow-md border-transparent"
                    : "bg-white text-[#1E293B]/70 border border-[#1E293B]/10 hover:bg-[#1E293B]/5"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="stagger-item shrink-0 h-6 w-px bg-[#1E293B]/10 mx-2" />

          {/* Tier Filters */}
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Tiers", activeClass: "bg-[#1E293B] text-white" },
              { id: "tier1", label: "🏷 Discounted", activeClass: "bg-[#D4A373] text-white" },
              { id: "tier2", label: "✨ Free", activeClass: "bg-[#A4B69A] text-white" },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setTierFilter(tier.id as any)}
                className={`stagger-item shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${tierFilter === tier.id
                    ? `${tier.activeClass} shadow-md border-transparent`
                    : "bg-white text-[#1E293B]/70 border-[#1E293B]/10 hover:bg-[#1E293B]/5"
                  }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#1E293B]/70">
          Showing <span className="font-bold text-[#1E293B]">{filtered.length}</span> available item{filtered.length !== 1 ? "s" : ""}
        </h2>
      </div>

      {/* Grid */}
      <ProductGrid products={filtered} onAddToCart={onAddToCart} />
    </div>
  );
}
