import React, { Suspense } from "react";
import ApprovalFormContainer from "@/features/surplusTriage/components/ApprovalFormContainer";

export const metadata = {
  title: "Approve Listing | Merchant",
};

export default function ApprovalPage() {
  return (
    <main className="flex min-h-screen bg-[#F2EFE7] p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-10 h-10 border-4 border-[#A4B69A] border-t-[#2F5D50] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#1E293B]/60 font-medium animate-pulse">Loading...</p>
          </div>
        }>
          <ApprovalFormContainer />
        </Suspense>
      </div>
    </main>
  );
}
