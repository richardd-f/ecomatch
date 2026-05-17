"use client";

import React from "react";
import { FilterTag, ECOLOGICAL_FILTERS, EcologicalCategory } from "@/interfaces/filter.types";

interface EcologicalFiltersProps {
  activeCategory: EcologicalCategory;
  onSelect: (category: EcologicalCategory) => void;
}

export function EcologicalFilters({ activeCategory, onSelect }: EcologicalFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-center py-4 w-full">
      {ECOLOGICAL_FILTERS.map((tag: FilterTag) => (
        <button
          key={tag.id}
          onClick={() => onSelect(tag.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
            activeCategory === tag.id
              ? "bg-[#D4A373] text-white shadow-md border-transparent"
              : "bg-[#F2EFE7] text-[#1E293B]/70 border-[#A4B69A] hover:bg-[#A4B69A]/20"
          }`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
