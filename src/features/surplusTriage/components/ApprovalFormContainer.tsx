"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ApprovalForm from "./ApprovalForm";
import { TriageResult } from "../interfaces/triage.interface";

export default function ApprovalFormContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [initialData, setInitialData] = useState<TriageResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const dataStr = searchParams.get("data");
      const imgUrl = searchParams.get("imageUrl");
      
      if (!dataStr) {
        setError("No triage data found. Please capture an image first.");
        return;
      }
      
      const parsed = JSON.parse(dataStr);
      setInitialData(parsed);
      setImageUrl(imgUrl);
    } catch (err) {
      setError("Failed to parse triage data.");
      console.error(err);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-4 bg-white rounded-3xl shadow-lg max-w-md mx-auto mt-12">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold">!</div>
        <h2 className="text-xl font-bold text-[#1E293B]">Oops!</h2>
        <p className="text-[#1E293B]/70">{error}</p>
        <button 
          onClick={() => router.push("/merchant/surplus-triage")}
          className="mt-4 px-6 py-3 bg-[#2F5D50] text-white rounded-xl font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-[#A4B69A] border-t-[#2F5D50] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#1E293B]/60 font-medium animate-pulse">Loading triage details...</p>
      </div>
    );
  }

  return <ApprovalForm initialData={initialData} imageUrl={imageUrl} />;
}
