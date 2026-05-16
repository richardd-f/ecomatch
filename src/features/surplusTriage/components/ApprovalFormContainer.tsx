"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ApprovalForm from "./ApprovalForm";

export default function ApprovalFormContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const dataStr = searchParams.get("data");
  const imageUrl = searchParams.get("imageUrl");

  const { initialData, error } = useMemo(() => {
    if (!dataStr) {
      return { initialData: null, error: "No triage data found. Please capture an image first." };
    }
    try {
      const parsed = JSON.parse(dataStr);
      return { initialData: parsed, error: null };
    } catch (err) {
      console.error(err);
      return { initialData: null, error: "Failed to parse triage data." };
    }
  }, [dataStr]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-4 bg-white rounded-3xl shadow-lg max-w-md mx-auto mt-12">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold">!</div>
        <h2 className="text-xl font-bold text-[#1E293B]">Oops!</h2>
        <p className="text-[#1E293B]/70">{error}</p>
        <button 
          onClick={() => router.push("/merchant/surplusTriage")}
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
