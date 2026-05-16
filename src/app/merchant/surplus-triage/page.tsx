import React from "react";
import CameraCapture from "@/features/surplusTriage/components/CameraCapture";

export const metadata = {
  title: "Surplus Triage | Merchant",
};

export default function SurplusTriagePage() {
  return (
    <main className="flex min-h-screen bg-[#F2EFE7]">
      <div className="flex flex-col w-full items-center py-8">
        <CameraCapture />
      </div>
    </main>
  );
}
