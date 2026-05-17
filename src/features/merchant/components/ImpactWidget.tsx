"use client";

import { useEffect, useState } from "react";
import { getMerchantImpactMetricsAction } from "../actions/impact.actions";
import { ImpactMetrics } from "@/interfaces/impact.interface";
import { Leaf, Wind, TrendingUp, Loader2 } from "lucide-react";
import Image from "next/image";

export function ImpactWidget() {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImpact() {
      try {
        const res = await getMerchantImpactMetricsAction();
        if (res.success && res.data) {
          setMetrics(res.data);
        }
      } catch (error) {
        console.error("Failed to load metrics", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadImpact();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-[#F2EFE7] rounded-3xl border border-[#A4B69A]/30 min-h-[160px]">
        <Loader2 className="w-8 h-8 text-[#2F5D50] animate-spin" />
      </div>
    );
  }

  const savedKg = metrics?.totalOrganicsSavedKg.toFixed(1) || "0.0";
  const offsetKg = metrics?.carbonEmissionsPreventedKg.toFixed(1) || "0.0";

  return (
    <div className="flex flex-col rounded-3xl bg-[#F2EFE7] border border-[#A4B69A]/50 p-6 md:p-8 relative overflow-hidden shadow-sm">
      {/* Decorative Branding Watermark */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
        <Image 
          src="/images/logo/Logo_Ecomatch_Baru-removebg-preview.png"
          alt="Decoration"
          width={250}
          height={250}
        />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#A4B69A]/30">
          <TrendingUp className="w-5 h-5 text-[#2F5D50]" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">Sustainability Impact</h2>
          <p className="text-sm text-[#1E293B]/60 font-medium">Your contribution to a greener planet</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        {/* Card 1: Organic Waste Rescued */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl p-5 border border-[#A4B69A]/20 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#2F5D50]/10 rounded-xl">
              <Leaf className="w-5 h-5 text-[#2F5D50]" />
            </div>
            <span className="text-sm font-bold text-[#1E293B]/70 uppercase tracking-wide">Organics Rescued</span>
          </div>
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-4xl font-extrabold text-[#2F5D50]">{savedKg}</span>
            <span className="text-lg font-bold text-[#2F5D50]/60">kg</span>
          </div>
        </div>

        {/* Card 2: Carbon Offset */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl p-5 border border-[#A4B69A]/20 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#D4A373]/10 rounded-xl">
              <Wind className="w-5 h-5 text-[#D4A373]" />
            </div>
            <span className="text-sm font-bold text-[#1E293B]/70 uppercase tracking-wide">CO₂ Prevented</span>
          </div>
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-4xl font-extrabold text-[#D4A373]">{offsetKg}</span>
            <span className="text-lg font-bold text-[#D4A373]/60">kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
