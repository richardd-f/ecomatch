"use client";

import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";

interface HandoverModalProps {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function HandoverModal({ transactionId, isOpen, onClose }: HandoverModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-[#1E293B]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F2EFE7] hover:bg-[#E5E0D8] text-[#1E293B]/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-[#1E293B] mb-2 text-center mt-2">
          Handover Ticket
        </h3>
        <p className="text-sm text-[#1E293B]/60 text-center mb-6">
          Show this QR code to the merchant to claim your organic waste.
        </p>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#1E293B]/10">
          <QRCodeSVG 
            value={transactionId} 
            size={200}
            bgColor="#ffffff"
            fgColor="#1E293B"
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="mt-6 w-full text-center">
          <p className="text-xs text-[#1E293B]/40 uppercase tracking-widest font-semibold">
            Transaction ID
          </p>
          <p className="text-sm font-mono text-[#1E293B] mt-1 bg-[#F2EFE7] py-2 px-3 rounded-lg inline-block">
            {transactionId}
          </p>
        </div>
      </div>
    </div>
  );
}
