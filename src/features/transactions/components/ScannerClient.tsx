"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { processHandoverAction } from "../actions/handover.actions";

export function ScannerClient() {
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0 && !scannedId && !isPending && !result) {
      const code = detectedCodes[0].rawValue;
      setScannedId(code);
      processCode(code);
    }
  };

  const processCode = (transactionId: string) => {
    startTransition(async () => {
      setResult(null);
      const res = await processHandoverAction(transactionId);
      
      if (res.success) {
        setResult({ type: "success", message: "Organic waste successfully picked up!" });
      } else {
        setResult({ type: "error", message: res.error || "Invalid QR code or transaction." });
      }
    });
  };

  const handleReset = () => {
    setScannedId(null);
    setResult(null);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      
      <div className="bg-white rounded-3xl shadow-sm border border-[#1E293B]/10 overflow-hidden w-full flex flex-col p-6">
        
        {!scannedId && !result ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#1E293B] mb-2">Scan Handover Ticket</h2>
            <p className="text-sm text-[#1E293B]/60 text-center mb-6">
              Point your camera at the buyer&apos;s QR code to verify the transaction.
            </p>
            <div className="w-full aspect-square bg-[#1E293B]/5 rounded-2xl overflow-hidden relative border-4 border-[#2F5D50]/20">
              <Scanner 
                onScan={handleScan}
                components={{
                    onOff: true,
                    torch: true,
                    zoom: true,
                    finder: true
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {isPending ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-12 h-12 text-[#2F5D50] animate-spin" />
                <p className="text-sm font-medium text-[#1E293B]/60 animate-pulse">
                  Verifying transaction...
                </p>
              </div>
            ) : result?.type === "success" ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-[#2F5D50]/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-[#2F5D50]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B]">Handover Complete</h3>
                <p className="text-sm text-[#2F5D50] font-medium">{result.message}</p>
                <div className="w-full mt-6">
                  <button 
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-xl bg-[#2F5D50] text-white font-bold hover:bg-[#A4B69A] transition-colors"
                  >
                    Scan Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-[#D4A373]/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-[#D4A373]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B]">Verification Failed</h3>
                <div className="bg-[#D4A373]/10 border border-[#D4A373]/20 px-4 py-3 rounded-xl">
                  <p className="text-sm text-[#D4A373] font-semibold">{result?.message}</p>
                </div>
                <p className="text-xs text-[#1E293B]/40 font-mono mt-2 break-all max-w-[200px]">
                  ID: {scannedId}
                </p>
                <div className="w-full mt-6">
                  <button 
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-xl border-2 border-[#1E293B]/10 text-[#1E293B] font-bold hover:bg-[#F2EFE7] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
