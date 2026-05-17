"use client";

import { X } from "lucide-react";

interface QRModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRModal({ orderId, isOpen, onClose }: QRModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background backdrop */}
      <div 
        className="absolute inset-0 bg-[#1E293B]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B]/10">
          <h2 className="font-bold text-[#1E293B]">Pickup QR Code</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#1E293B]/40 hover:bg-[#F2EFE7] hover:text-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-white rounded-xl border border-[#1E293B]/10 shadow-sm">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${orderId}`}
              alt="Pickup QR Code"
              className="w-48 h-48"
            />
          </div>
          <p className="text-sm text-center text-[#1E293B]/70">
            Show this QR code to the merchant to claim your rescued items!
          </p>
          <div className="text-xs font-mono bg-[#F2EFE7] px-3 py-1.5 rounded text-[#1E293B]/80">
            {orderId}
          </div>
        </div>
      </div>
    </div>
  );
}
