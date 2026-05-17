"use client";

import { useState } from "react";
import { ClaimedItem } from "@/interfaces/claim.interface";
import { HandoverModal } from "./HandoverModal";
import { QrCode, Sprout, Weight, MapPin } from "lucide-react";

interface ClaimCardProps {
  item: ClaimedItem;
}

export function ClaimCard({ item }: ClaimCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPickedUp = item.status === "PICKED_UP";

  return (
    <>
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#1E293B]/10 flex flex-col gap-4 transition-all hover:shadow-md">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1E293B]">{item.product.title}</h3>
            <p className="text-sm text-[#1E293B]/60 mt-1 line-clamp-2">
              {item.product.description}
            </p>
          </div>
          <span
            className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
              isPickedUp 
                ? "bg-[#2F5D50]/10 text-[#2F5D50]" 
                : "bg-[#D4A373]/20 text-[#D4A373]"
            }`}
          >
            {isPickedUp ? "CLAIMED" : "PENDING PICKUP"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {item.product.estimatedVolume && (
            <div className="flex items-center gap-2 text-sm text-[#1E293B]/80">
              <div className="w-8 h-8 rounded-full bg-[#F2EFE7] flex items-center justify-center shrink-0">
                <Weight className="w-4 h-4 text-[#2F5D50]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#1E293B]/40 tracking-wider">Est. Volume</span>
                <span className="font-medium">{item.product.estimatedVolume} L/Kg</span>
              </div>
            </div>
          )}
          
          {item.product.ecologicalClassification.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[#1E293B]/80">
              <div className="w-8 h-8 rounded-full bg-[#F2EFE7] flex items-center justify-center shrink-0">
                <Sprout className="w-4 h-4 text-[#2F5D50]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#1E293B]/40 tracking-wider">Ecology</span>
                <span className="font-medium line-clamp-1">{item.product.ecologicalClassification.join(", ")}</span>
              </div>
            </div>
          )}
        </div>

        {item.product.pickupNotes && (
          <div className="bg-[#F2EFE7] rounded-xl p-3 flex gap-3 mt-2">
            <MapPin className="w-5 h-5 text-[#D4A373] shrink-0" />
            <p className="text-sm text-[#1E293B]/80 leading-relaxed">
              <span className="font-semibold block mb-0.5">Pickup Instructions:</span>
              {item.product.pickupNotes}
            </p>
          </div>
        )}

        {!isPickedUp && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 w-full py-3 px-4 rounded-xl bg-[#2F5D50] hover:bg-[#A4B69A] text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Show Handover Ticket
          </button>
        )}
      </div>

      <HandoverModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionId={item.transactionId}
      />
    </>
  );
}
