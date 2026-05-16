import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export const metadata = {
  title: "Add New Product | EcoMatch Merchant",
};

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto w-full pt-8 pb-16">
      <Link 
        href="/merchant"
        className="flex items-center gap-2 text-sm text-[#1E293B]/60 hover:text-[#1E293B] transition-colors mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-[#1E293B]/10 p-12 text-center flex flex-col items-center justify-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F2EFE7] text-[#D4A373] flex items-center justify-center mb-6">
          <Construction className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
          Product Creation Form
        </h1>
        <p className="text-[#1E293B]/70 max-w-sm mb-8">
          This page is under construction. Soon you will be able to upload images, add descriptions, and use Gemini AI to automatically set the optimal price.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/merchant/surplusTriage"
            className="px-6 py-3 rounded-xl bg-[#2F5D50] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Use AI Surplus Triage Instead
          </Link>
          <Link
            href="/merchant"
            className="px-6 py-3 rounded-xl border-2 border-[#E2E8F0] text-[#1E293B] font-medium hover:bg-[#F2EFE7] transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
