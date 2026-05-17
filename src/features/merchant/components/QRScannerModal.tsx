"use client";

import { useState, useTransition } from "react";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { claimOrderAction } from "../actions/claimOrder";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const [scannedOrderId, setScannedOrderId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [resultMessage, setResultMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  if (!isOpen) return null;

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0 && !scannedOrderId) {
      setScannedOrderId(detectedCodes[0].rawValue);
    }
  };

  const handleConfirm = () => {
    if (!scannedOrderId) return;
    
    startTransition(async () => {
      setResultMessage(null);
      const res = await claimOrderAction(scannedOrderId);
      if (res.success) {
        setResultMessage({ type: "success", text: res.message });
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setResultMessage({ type: "error", text: res.message });
      }
    });
  };

  const handleClose = () => {
    setScannedOrderId(null);
    setResultMessage(null);
    onClose();
  };

  const handleRetry = () => {
    setScannedOrderId(null);
    setResultMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background backdrop */}
      <div 
        className="absolute inset-0 bg-[#1E293B]/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B]/10">
          <h2 className="font-bold text-[#1E293B]">Scan Claim QR</h2>
          <button 
            onClick={handleClose}
            className="p-1 rounded-md text-[#1E293B]/40 hover:bg-[#F2EFE7] hover:text-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          {!scannedOrderId ? (
            <div className="w-full aspect-square bg-[#F2EFE7] rounded-xl overflow-hidden relative">
              <Scanner 
                onScan={handleScan}
                components={{
                    onOff: true,
                    torch: true,
                    zoom: true,
                    finder: true
                }}
              />
              <p className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium text-white drop-shadow-md z-10 px-4">
                Point camera at the customer&apos;s QR Code
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              {resultMessage?.type === "success" ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="w-16 h-16 text-[#2F5D50]" />
                  <p className="font-bold text-[#2F5D50]">{resultMessage.text}</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#F2EFE7] flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-[#A4B69A]" />
                  </div>
                  <h3 className="font-bold text-[#1E293B] mb-2">QR Detected!</h3>
                  <p className="text-sm text-[#1E293B]/70 mb-1">Order ID:</p>
                  <p className="text-sm font-mono bg-[#F2EFE7] px-3 py-1.5 rounded text-[#1E293B]/80 mb-6 break-all">
                    {scannedOrderId}
                  </p>
                  
                  {resultMessage?.type === "error" && (
                    <div className="w-full p-3 mb-4 rounded-xl bg-red-50 flex items-start gap-2 text-red-600 text-sm border border-red-100 text-left">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{resultMessage.text}</span>
                    </div>
                  )}

                  <div className="flex w-full gap-3">
                    <button
                      onClick={handleRetry}
                      disabled={isPending}
                      className="flex-1 py-2.5 rounded-xl border border-[#1E293B]/20 text-[#1E293B] font-medium hover:bg-[#F2EFE7] transition-colors disabled:opacity-50"
                    >
                      Rescan
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isPending}
                      className="flex-1 py-2.5 rounded-xl bg-[#2F5D50] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Claim"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
