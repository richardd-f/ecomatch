"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { processTriageAction } from "../actions/processTriage.action";

export default function CameraCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsProcessing(true);
      setError(null);
      try {
        await processTriageAction(imageSrc);
      } catch (err: any) {
        if (err.message !== "NEXT_REDIRECT") {
          setError(err.message || "Failed to process image");
          setIsProcessing(false);
        }
      }
    }
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 gap-6 relative">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <div className="flex flex-col items-center p-8 bg-[#F2EFE7] rounded-3xl shadow-2xl gap-4">
            <Loader2 className="w-12 h-12 text-[#2F5D50] animate-spin" />
            <p className="text-lg font-semibold text-[#1E293B] animate-pulse">
              AI is analyzing your product...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-3xl font-bold text-[#1E293B]">Surplus Triage</h1>
        <p className="text-[#1E293B]/70">Capture the food item to generate an automatic AI listing.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-lg w-full">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Camera Viewport */}
      <div className="relative w-full flex justify-center items-center rounded-3xl overflow-hidden border-4 border-[#A4B69A] shadow-xl bg-black">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "environment", // Prioritize back camera on mobile
          }}
          className="w-full h-full object-cover aspect-video"
        />
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-xl" />
      </div>

      {/* Capture Controls */}
      <div className="flex justify-center items-center w-full py-4">
        <button
          onClick={capture}
          disabled={isProcessing}
          className="flex items-center justify-center w-20 h-20 bg-[#2F5D50] rounded-full text-white shadow-lg hover:bg-[#2F5D50]/90 transition-all active:scale-95 disabled:opacity-50 group border-4 border-[#F2EFE7] outline outline-2 outline-[#2F5D50]"
        >
          <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
