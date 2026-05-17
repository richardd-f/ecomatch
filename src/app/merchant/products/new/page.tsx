import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddProductForm } from "@/features/inventory/components/AddProductForm";

export const metadata = {
  title: "Add New Product | EcoMatch Merchant",
};

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-16">
      <Link
        href="/merchant"
        className="flex items-center gap-2 text-sm text-[#1E293B]/60 hover:text-[#1E293B] transition-colors mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">New Listing</h1>
        <p className="text-sm text-[#1E293B]/60 mt-1">
          List your surplus food and let the community rescue it.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#1E293B]/10 p-5 sm:p-8 shadow-sm">
        <AddProductForm />
      </div>
    </div>
  );
}