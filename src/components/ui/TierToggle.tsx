"use client";

import React from "react";

interface TierToggleProps {
  activeTier: "tier1" | "tier2";
  onChange: (tier: "tier1" | "tier2") => void;
}

export function TierToggle({ activeTier, onChange }: TierToggleProps) {
  return (
    <div className="relative flex p-1 bg-[#F2EFE7] rounded-full w-full max-w-sm mx-auto shadow-sm border border-[#1E293B]/5">
      <button
        onClick={() => onChange("tier1")}
        className={`relative flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors z-10 duration-300 ${
          activeTier === "tier1" ? "text-white" : "text-[#1E293B]/60 hover:text-[#1E293B]"
        }`}
      >
        Tier 1 (Commercial)
      </button>
      <button
        onClick={() => onChange("tier2")}
        className={`relative flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors z-10 duration-300 ${
          activeTier === "tier2" ? "text-white" : "text-[#1E293B]/60 hover:text-[#1E293B]"
        }`}
      >
        Tier 2 (Ecological)
      </button>

      {/* Sliding Background */}
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#2F5D50] rounded-full shadow-md z-0 transition-all duration-300 ease-in-out"
        style={{ left: activeTier === "tier1" ? "4px" : "calc(50%)" }}
      />
    </div>
  );
}
