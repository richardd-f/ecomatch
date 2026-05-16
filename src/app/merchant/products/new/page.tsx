import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import ManualProductForm from "./ManualProductForm";

export const metadata = {
  title: "Add New Product | EcoMatch Merchant",
};

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto w-full pt-8 pb-16 px-4">
      <Link 
        href="/merchant"
        className="flex items-center gap-2 text-sm text-[#1E293B]/60 hover:text-[#1E293B] transition-colors mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <div className="bg-[#2F5D50] text-[#F2EFE7] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col gap-2 max-w-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#A4B69A]" />
              Manual Product Entry
            </h1>
            <p className="text-[#A4B69A] text-sm leading-relaxed">
              Manually input product details. For a faster experience, try our AI Surplus Triage which automatically determines the best price and description.
            </p>
          </div>
          <Link
            href="/merchant/surplusTriage"
            className="shrink-0 px-6 py-3 bg-[#F2EFE7] text-[#2F5D50] hover:bg-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Use AI Triage
          </Link>
        </div>
      </div>

      <ManualProductForm />
    </div>
  );
}
